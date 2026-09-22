/**
 * Spacecraft Design & Derived Gauges Unit Tests
 * Hand-checked scenario tests verifying computeDerivedGauges and slider clamping
 */

import { describe, it, expect } from 'vitest';
import { MISSIONS } from '../data/missions';
import { PARTS } from '../data/parts';
import { computeDerivedGauges, clampSliderValue } from './design';
import { SpacecraftDesign } from './types';

describe('Design Logic — Slider Value Clamping', () => {
  const solarPart = PARTS.find((p) => p.id === 'pwr-triple-junction-solar')!;
  const propPart = PARTS.find((p) => p.id === 'prop-hydrazine-mono')!;

  it('clamps values below minimum to slider minimum', () => {
    // Array area range: min 4, max 30
    const clamped = clampSliderValue(solarPart, 'arrayAreaM2', 1.0);
    expect(clamped).toBe(4);
  });

  it('clamps values above maximum to slider maximum', () => {
    // Propellant range: min 50, max 1200
    const clamped = clampSliderValue(propPart, 'propellantLoadKg', 5000);
    expect(clamped).toBe(1200);
  });

  it('preserves values within the allowed range', () => {
    const clamped = clampSliderValue(propPart, 'propellantLoadKg', 897);
    expect(clamped).toBe(897);
  });
});

describe('Design Logic — Hand-Checked Lunar Orbiter (LRO) Scenario', () => {
  const moonMission = MISSIONS['moon'];

  const lroDesign: SpacecraftDesign = {
    missionId: 'moon',
    selectedParts: {
      launchVehicle: 'lv-atlas-v-401',
      bus: 'bus-standard-science',
      power: 'pwr-triple-junction-solar',
      propulsion: 'prop-hydrazine-mono',
      comms: 'comms-xband-deepspace',
      instrument: 'inst-lunar-orbiter-laser-cam',
      thermal: 'therm-passive-mli',
      redundancy: 'red-dual-critical',
    },
    sliderValues: {
      'pwr-triple-junction-solar.arrayAreaM2': 10.7,
      'pwr-triple-junction-solar.batteryCapacityKg': 35,
      'prop-hydrazine-mono.propellantLoadKg': 897,
      'comms-xband-deepspace.dishDiameterM': 1.3,
    },
  };

  it('computes exact hand-checked cost and budget margin', () => {
    const gauges = computeDerivedGauges(lroDesign, moonMission, PARTS);

    // Summed costs:
    // Atlas V 401: 153.8M
    // Bus standard science: 38M
    // Triple-junction solar: 24M
    // Hydrazine mono: 18M
    // X-band comms: 21M
    // Laser altimeter & cam: 36M
    // Passive MLI: 8.5M
    // Dual critical redundancy: 26M
    // Total = 325.3M USD
    expect(gauges.costUSD.current).toBe(325_300_000);
    expect(gauges.costUSD.limit).toBe(550_000_000);
    expect(gauges.costUSD.isOver).toBe(false);
    expect(gauges.costUSD.percentage).toBeCloseTo((325.3 / 550) * 100, 1);
  });

  it('computes dry mass with 20% growth contingency and wet mass', () => {
    const gauges = computeDerivedGauges(lroDesign, moonMission, PARTS);

    // Dry parts:
    // bus 460 + prop 95 + power (110 + 35) + comms 42 + inst 160 + therm 35 + red 65 = 1,002 kg
    // Contingency 20%: 1,002 * 1.20 = 1,202.4 kg
    // Propellant: 897 kg
    // Wet mass = 1202.4 + 897 = 2099.4 kg -> rounded 2099 kg
    expect(gauges.massKg.current).toBe(2099);
    expect(gauges.massKg.limit).toBe(9800); // Atlas V 401 payload limit
    expect(gauges.massKg.isOver).toBe(false);
  });

  it('computes delta-v from Tsiolkovsky rocket equation', () => {
    const gauges = computeDerivedGauges(lroDesign, moonMission, PARTS);

    // Isp = 212.2, m0 = 2099.4, mf = 1202.4
    // Δv = 212.2 * 9.80665 * ln(2099.4 / 1202.4) ≈ 1,160 m/s
    expect(gauges.deltaVms.current).toBeGreaterThan(1150);
    expect(gauges.deltaVms.current).toBeLessThan(1170);
  });

  it('computes solar power generation and power balance', () => {
    const gauges = computeDerivedGauges(lroDesign, moonMission, PARTS);

    // At 1 AU, 10.7 m² array with 29.5% eff: ~4,295 W generated
    expect(gauges.powerW.limit).toBeGreaterThan(4200);
    // Consumed: 60 (base) + 140 (instrument) + 100 (50W comms * 2) = 300 W
    expect(gauges.powerW.current).toBe(300);
    expect(gauges.powerW.isOver).toBe(false);
  });

  it('verifies communications link margin closes positively at Lunar distance', () => {
    const gauges = computeDerivedGauges(lroDesign, moonMission, PARTS);

    expect(gauges.linkMarginDb.current).toBeGreaterThan(40);
    expect(gauges.linkMarginDb.isOver).toBe(false);
  });

  it('verifies thermal equilibrium is within safe operational band', () => {
    const gauges = computeDerivedGauges(lroDesign, moonMission, PARTS);

    // T_eq should be evaluated and checked against safe band
    expect(gauges.thermalEquilibriumK.current).toBeGreaterThan(0);
    expect(gauges.thermalEquilibriumK.isSafe).toBe(true);
  });

  it('evaluates reliability estimate with redundancy', () => {
    const gauges = computeDerivedGauges(lroDesign, moonMission, PARTS);

    // With dual-string critical redundancy (multiplier 0.35), reliability is ~0.936 (93.6%)
    expect(gauges.reliabilityEstimate).toBeCloseTo(0.936, 2);
    expect(gauges.reliabilityEstimate).toBeGreaterThan(0.90);

    // Upgrading to Class A fault-tolerant redundancy (multiplier 0.05) reaches > 0.98
    const classADesign = {
      ...lroDesign,
      selectedParts: {
        ...lroDesign.selectedParts,
        redundancy: 'red-triple-voting-fault-tolerant',
      },
    };
    const classAGauges = computeDerivedGauges(classADesign, moonMission, PARTS);
    expect(classAGauges.reliabilityEstimate).toBeGreaterThan(0.98);
  });
});

describe('Design Logic — Over-Constraint & Deficit Scenarios', () => {
  it('flags cost isOver when budget is exceeded', () => {
    const cheapMission = {
      ...MISSIONS['earth-orbit'],
      budgetCapUSD: 100_000_000, // Small $100M cap
    };

    const heavyDesign: SpacecraftDesign = {
      missionId: 'earth-orbit',
      selectedParts: {
        launchVehicle: 'lv-heavy-deepspace', // $245M alone
      },
      sliderValues: {},
    };

    const gauges = computeDerivedGauges(heavyDesign, cheapMission, PARTS);
    expect(gauges.costUSD.isOver).toBe(true);
    expect(gauges.costUSD.percentage).toBeGreaterThan(100);
  });

  it('flags delta-v deficit when no propulsion is selected', () => {
    const noPropDesign: SpacecraftDesign = {
      missionId: 'moon',
      selectedParts: {
        launchVehicle: 'lv-atlas-v-401',
        bus: 'bus-standard-science',
      },
      sliderValues: {},
    };

    const gauges = computeDerivedGauges(noPropDesign, MISSIONS['moon'], PARTS);
    expect(gauges.deltaVms.current).toBe(0);
    expect(gauges.deltaVms.isOver).toBe(true); // Insufficient delta-v
  });

  it('flags power deficit when no power source is selected', () => {
    const noPwrDesign: SpacecraftDesign = {
      missionId: 'moon',
      selectedParts: {
        instrument: 'inst-lunar-orbiter-laser-cam',
      },
      sliderValues: {},
    };

    const gauges = computeDerivedGauges(noPwrDesign, MISSIONS['moon'], PARTS);
    expect(gauges.powerW.limit).toBe(0); // 0 generated
    expect(gauges.powerW.isOver).toBe(true);
  });
});
