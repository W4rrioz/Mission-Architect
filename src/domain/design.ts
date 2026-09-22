/**
 * Spacecraft Design State Logic & Gauge Calculations
 * Source: 05-backend-schema.md §3, §6 and 07-domain-reference.md §1, §3, §4, §5, §6, §7
 */

import {
  Mission,
  PartCatalogEntry,
  SpacecraftDesign,
  DerivedGauges,
  PartCategory,
  LaunchVehiclePerf,
  BusPerf,
  PowerPerf,
  PropulsionPerf,
  CommsPerf,
  InstrumentPerf,
  ThermalPerf,
  RedundancyPerf,
} from './types';
import { PARTS } from '../data/parts';
import {
  calculateDeltaV,
  calculateTotalDryMass,
  calculateSolarPowerGeneration,
  calculateParabolicAntennaGain,
  calculateEIRP,
  calculateFSPL,
  calculateLinkMargin,
  calculateThermalEquilibriumK,
  calculateReliability,
} from './formulas';

/**
 * Clamps a slider value to its declared range in the part catalog.
 */
export function clampSliderValue(
  part: PartCatalogEntry,
  sliderId: string,
  rawValue: number
): number {
  const range = part.sliderRanges?.find((r) => r.id === sliderId);
  if (!range) return rawValue;
  return Math.min(range.max, Math.max(range.min, rawValue));
}

/**
 * Extracts default slider values for a given part.
 */
export function getDefaultSliderValuesForPart(
  part: PartCatalogEntry
): Record<string, number> {
  const defaults: Record<string, number> = {};
  if (part.sliderRanges) {
    for (const range of part.sliderRanges) {
      defaults[`${part.id}.${range.id}`] = range.defaultValue;
    }
  }
  return defaults;
}

/**
 * Resolves an active slider value with fallback to the catalog default and range clamping.
 */
function resolveSliderValue(
  part: PartCatalogEntry | undefined,
  sliderId: string,
  sliderValues: Record<string, number>,
  fallback: number = 0
): number {
  if (!part) return fallback;
  const range = part.sliderRanges?.find((r) => r.id === sliderId);
  if (!range) return fallback;

  const key = `${part.id}.${sliderId}`;
  const rawValue = sliderValues[key] !== undefined ? sliderValues[key] : range.defaultValue;
  return Math.min(range.max, Math.max(range.min, rawValue));
}

/**
 * Pure function: computes all 7 derived gauges from a SpacecraftDesign and Mission.
 * Source: 07-domain-reference.md §7
 */
export function computeDerivedGauges(
  design: SpacecraftDesign,
  mission: Mission,
  catalog: PartCatalogEntry[] = PARTS
): DerivedGauges {
  const partMap = new Map<string, PartCatalogEntry>(catalog.map((p) => [p.id, p]));

  const getPart = <T>(category: PartCategory): { part: PartCatalogEntry; perf: T } | null => {
    const partId = design.selectedParts[category];
    if (!partId) return null;
    const part = partMap.get(partId);
    if (!part) return null;
    return { part, perf: part.perfProfile as unknown as T };
  };

  const lv = getPart<LaunchVehiclePerf>('launchVehicle');
  const bus = getPart<BusPerf>('bus');
  const power = getPart<PowerPerf>('power');
  const propulsion = getPart<PropulsionPerf>('propulsion');
  const comms = getPart<CommsPerf>('comms');
  const instrument = getPart<InstrumentPerf>('instrument');
  const thermal = getPart<ThermalPerf>('thermal');
  const redundancy = getPart<RedundancyPerf>('redundancy');

  // ==========================================================================
  // 1. COST GAUGE
  // ==========================================================================
  let totalCostUSD = 0;
  for (const partId of Object.values(design.selectedParts)) {
    if (partId) {
      const part = partMap.get(partId);
      if (part) totalCostUSD += part.costUSD;
    }
  }

  const costLimit = mission.budgetCapUSD;
  const costGauge = {
    current: totalCostUSD,
    limit: costLimit,
    percentage: costLimit > 0 ? (totalCostUSD / costLimit) * 100 : 0,
    isOver: totalCostUSD > costLimit,
  };

  // ==========================================================================
  // 2. MASS & DELTA-V GAUGES (07-domain-reference.md §1)
  // ==========================================================================
  let dryPartSumKg = 0;
  if (bus) dryPartSumKg += bus.part.massKg;
  if (propulsion) dryPartSumKg += propulsion.part.massKg;
  if (power) {
    dryPartSumKg += power.part.massKg;
    // Add battery mass if battery slider is configured
    const batteryMassKg = resolveSliderValue(power.part, 'batteryCapacityKg', design.sliderValues, 0);
    dryPartSumKg += batteryMassKg;
  }
  if (comms) dryPartSumKg += comms.part.massKg;
  if (instrument) dryPartSumKg += instrument.part.massKg;
  if (thermal) dryPartSumKg += thermal.part.massKg;
  if (redundancy) dryPartSumKg += redundancy.part.massKg;

  // 20% mass growth contingency (07-domain-reference.md §1)
  const totalDryMassKg = calculateTotalDryMass(dryPartSumKg);

  // Propellant mass from propulsion slider
  const propellantMassKg = resolveSliderValue(
    propulsion?.part,
    'propellantLoadKg',
    design.sliderValues,
    0
  );

  const totalWetMassKg = totalDryMassKg + propellantMassKg;
  const maxPayloadKg = lv ? lv.perf.maxPayloadKg : 0;

  const massGauge = {
    current: Math.round(totalWetMassKg),
    limit: maxPayloadKg,
    percentage: maxPayloadKg > 0 ? (totalWetMassKg / maxPayloadKg) * 100 : 0,
    isOver: maxPayloadKg > 0 ? totalWetMassKg > maxPayloadKg : true,
  };

  // Delta-V from Tsiolkovsky equation
  let deltaVms = 0;
  if (propulsion && propellantMassKg > 0 && totalDryMassKg > 0) {
    deltaVms = calculateDeltaV(propulsion.perf.ispSeconds, totalWetMassKg, totalDryMassKg);
  }

  const requiredDeltaVms = mission.orbit.requiredDeltaVms;
  const deltaVGauge = {
    current: Math.round(deltaVms),
    limit: requiredDeltaVms,
    percentage: requiredDeltaVms > 0 ? (deltaVms / requiredDeltaVms) * 100 : 100,
    isOver: deltaVms < requiredDeltaVms,
  };

  // ==========================================================================
  // 3. POWER BUDGET GAUGE (07-domain-reference.md §3)
  // ==========================================================================
  let powerGeneratedW = 0;
  if (power) {
    if (power.perf.type === 'solar') {
      const panelAreaM2 = resolveSliderValue(power.part, 'arrayAreaM2', design.sliderValues, 10.0);
      const efficiency = power.perf.panelEfficiency ?? 0.295;
      powerGeneratedW = calculateSolarPowerGeneration(
        mission.orbit.solarDistanceAU,
        panelAreaM2,
        efficiency
      );
    } else if (power.perf.type === 'rtg') {
      powerGeneratedW = power.perf.ratedWatts ?? 450;
    }
  }

  // Base bus power consumption
  let powerConsumedW = 60; // Base housekeeping avionics
  if (instrument) powerConsumedW += instrument.perf.powerDrawW;
  if (comms) powerConsumedW += comms.perf.transmitPowerW * 2; // DC input to TWTA
  if (thermal && thermal.part.id.includes('active')) powerConsumedW += 30; // Active loop pump

  const powerGauge = {
    current: Math.round(powerConsumedW),
    limit: Math.round(powerGeneratedW),
    percentage: powerGeneratedW > 0 ? (powerConsumedW / powerGeneratedW) * 100 : 100,
    isOver: powerConsumedW > powerGeneratedW || powerGeneratedW === 0,
  };

  // ==========================================================================
  // 4. COMMUNICATIONS LINK MARGIN GAUGE (07-domain-reference.md §4)
  // ==========================================================================
  let linkMarginDb = -99.9;
  if (comms) {
    const dishDiameterM = resolveSliderValue(
      comms.part,
      'dishDiameterM',
      design.sliderValues,
      1.3
    );
    const gainDbi = calculateParabolicAntennaGain(dishDiameterM, comms.perf.frequencyGHz);
    const eirpDbm = calculateEIRP(comms.perf.transmitPowerW, gainDbi);
    const fsplDb = calculateFSPL(
      mission.orbit.distanceToEarthKm,
      comms.perf.frequencyGHz * 1000
    );

    linkMarginDb = calculateLinkMargin(
      eirpDbm,
      comms.perf.receiverGainDbi,
      fsplDb,
      4.0, // Standard 4.0 dB other losses
      comms.perf.receiverThresholdDbm
    );
  }

  const linkMarginGauge = {
    current: Math.round(linkMarginDb * 10) / 10,
    limit: 0.0,
    percentage: linkMarginDb >= 0 ? Math.min(100, (linkMarginDb / 20) * 100) : 0,
    isOver: linkMarginDb < 0,
  };

  // ==========================================================================
  // 5. THERMAL RADIATIVE EQUILIBRIUM GAUGE (07-domain-reference.md §5)
  // ==========================================================================
  const absorptivity = thermal ? thermal.perf.absorptivity : 0.25;
  const emissivity = thermal ? thermal.perf.emissivity : 0.85;
  const insulationFactor = thermal ? thermal.perf.insulationFactor : 1.0;
  const absorbAreaM2 = bus ? bus.perf.crossSectionAreaM2 : 3.0;
  const emitAreaM2 = bus ? bus.perf.surfaceAreaM2 : 12.0;

  const tempEquilibriumK = calculateThermalEquilibriumK(
    absorptivity,
    emissivity,
    absorbAreaM2,
    emitAreaM2,
    mission.orbit.solarDistanceAU
  );

  // Safe operating band: baseline 180 K (-93°C) to 320 K (+47°C), widened by insulationFactor
  const minSafeTempK = Math.round(180 / insulationFactor);
  const maxSafeTempK = Math.round(320 * insulationFactor);
  const isSafeThermal = tempEquilibriumK >= minSafeTempK && tempEquilibriumK <= maxSafeTempK;

  const thermalGauge = {
    current: Math.round(tempEquilibriumK),
    minLimit: minSafeTempK,
    maxLimit: maxSafeTempK,
    isSafe: isSafeThermal,
  };

  // ==========================================================================
  // 6. RELIABILITY ESTIMATE GAUGE (07-domain-reference.md §6)
  // ==========================================================================
  // Aggregate subsystem failure rates over a nominal 2,000-hour mission phase
  const missionHours = 2000;
  const activeSubsystems = [bus, power, propulsion, comms, instrument, thermal].filter(
    Boolean
  );

  let aggregateMTBFInverse = 0;
  for (const sub of activeSubsystems) {
    if (sub && 'baseMTBFHours' in sub.perf) {
      const mtbf = (sub.perf as { baseMTBFHours: number }).baseMTBFHours;
      if (mtbf > 0) aggregateMTBFInverse += 1 / mtbf;
    }
  }

  const systemMTBFHours = aggregateMTBFInverse > 0 ? 1 / aggregateMTBFInverse : 10_000;
  const baseReliability = calculateReliability(missionHours, systemMTBFHours);

  // Apply redundancy modifier
  const failureMultiplier = redundancy ? redundancy.perf.failureRateMultiplier : 1.0;
  const baseFailureProb = 1 - baseReliability;
  const finalFailureProb = baseFailureProb * failureMultiplier;
  const reliabilityEstimate = Math.max(0, Math.min(0.999, 1 - finalFailureProb));

  return {
    massKg: massGauge,
    powerW: powerGauge,
    costUSD: costGauge,
    deltaVms: deltaVGauge,
    linkMarginDb: linkMarginGauge,
    thermalEquilibriumK: thermalGauge,
    reliabilityEstimate: Math.round(reliabilityEstimate * 1000) / 1000,
  };
}
