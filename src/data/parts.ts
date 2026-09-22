/**
 * Spacecraft Part Catalog
 * Source: 05-backend-schema.md §3 and 07-domain-reference.md §1, §3, §4, §5, §6
 */

import { PartCatalogEntry } from '../domain/types';

export const PARTS: PartCatalogEntry[] = [
  // ==========================================================================
  // 1. LAUNCH VEHICLES
  // ==========================================================================
  {
    id: 'lv-medium-falcon',
    category: 'launchVehicle',
    name: 'Medium Commercial Lift Vehicle',
    description:
      'Two-stage reusable launch vehicle providing dependable low-Earth orbit and lunar transit payload capability.',
    costUSD: 67_000_000,
    massKg: 0, // Booster mass is not part of spacecraft dry mass
    perfProfile: {
      maxPayloadKg: 4_500,
      c3CapableKm2s2: 12.0,
      fairingDiameterM: 4.0,
    },
  },
  {
    id: 'lv-atlas-v-401',
    category: 'launchVehicle',
    name: 'Atlas V 401 (EELV Workhorse)',
    description:
      'Flight-proven launch vehicle utilized for NASA Landsat 9, LRO, and MAVEN with high reliability and payload precision.',
    costUSD: 153_800_000,
    massKg: 0,
    perfProfile: {
      maxPayloadKg: 9_800,
      c3CapableKm2s2: 22.5,
      fairingDiameterM: 4.2,
    },
  },
  {
    id: 'lv-atlas-v-411',
    category: 'launchVehicle',
    name: 'Atlas V 411 (Single SRM Variant)',
    description:
      'Equipped with one solid rocket booster for high C3 injection energy, as used by NASA OSIRIS-REx to reach asteroid Bennu.',
    costUSD: 183_500_000,
    massKg: 0,
    perfProfile: {
      maxPayloadKg: 12_150,
      c3CapableKm2s2: 29.3,
      fairingDiameterM: 4.2,
    },
  },
  {
    id: 'lv-heavy-deepspace',
    category: 'launchVehicle',
    name: 'Heavy-Lift Exploration Booster',
    description:
      'Heavy triple-core launch vehicle delivering maximum payload mass directly into high-energy interplanetary trajectories.',
    costUSD: 245_000_000,
    massKg: 0,
    perfProfile: {
      maxPayloadKg: 22_000,
      c3CapableKm2s2: 45.0,
      fairingDiameterM: 5.2,
    },
  },

  // ==========================================================================
  // 2. SPACECRAFT BUS
  // ==========================================================================
  {
    id: 'bus-smallsat',
    category: 'bus',
    name: 'Modular SmallSat Bus Frame',
    description:
      'Lightweight aluminum honeycomb chassis suited for compact planetary scout or small Earth-observing satellites.',
    costUSD: 15_000_000,
    massKg: 180,
    perfProfile: {
      structuralMassKg: 180,
      crossSectionAreaM2: 1.8,
      surfaceAreaM2: 7.2,
      baseMTBFHours: 40_000,
    },
  },
  {
    id: 'bus-standard-science',
    category: 'bus',
    name: 'Standard Planetary Science Bus',
    description:
      'Hexagonal composite primary structure designed to host heavy remote-sensing suites and large propellant tanks.',
    costUSD: 38_000_000,
    massKg: 460,
    perfProfile: {
      structuralMassKg: 460,
      crossSectionAreaM2: 3.5,
      surfaceAreaM2: 14.0,
      baseMTBFHours: 65_000,
    },
  },
  {
    id: 'bus-heavy-deepspace',
    category: 'bus',
    name: 'Hardened Deep-Space Bus',
    description:
      'Titanium-reinforced structural truss engineered for long-duration interplanetary cruise and high-vibration engine burns.',
    costUSD: 65_000_000,
    massKg: 780,
    perfProfile: {
      structuralMassKg: 780,
      crossSectionAreaM2: 5.2,
      surfaceAreaM2: 21.0,
      baseMTBFHours: 85_000,
    },
  },

  // ==========================================================================
  // 3. POWER SYSTEM
  // ==========================================================================
  {
    id: 'pwr-triple-junction-solar',
    category: 'power',
    name: 'Triple-Junction GaInP/GaAs Solar Array',
    description:
      'Articulated solar array featuring high-efficiency (29.5%) space-grade photovoltaic cells and integrated Li-ion storage.',
    costUSD: 24_000_000,
    massKg: 110,
    sliderRanges: [
      {
        id: 'arrayAreaM2',
        label: 'Solar Array Area',
        min: 4,
        max: 30,
        step: 0.5,
        unit: 'm²',
        defaultValue: 10.7, // Matches LRO (10.7 m²)
      },
      {
        id: 'batteryCapacityKg',
        label: 'Battery Mass',
        min: 15,
        max: 80,
        step: 1,
        unit: 'kg',
        defaultValue: 35, // Matches LRO (35 kg Li-ion)
      },
    ],
    perfProfile: {
      type: 'solar',
      panelEfficiency: 0.295,
      cellDegradationPerYear: 0.025,
      batteryWhPerKg: 150,
      baseMTBFHours: 55_000,
    },
  },
  {
    id: 'pwr-ultraflex-solar',
    category: 'power',
    name: 'Deployable UltraFlex Circular Array',
    description:
      'Lightweight accordion-style deployable solar wings delivering high power-to-mass ratio even out at Mars distance.',
    costUSD: 36_000_000,
    massKg: 95,
    sliderRanges: [
      {
        id: 'arrayAreaM2',
        label: 'Solar Array Area',
        min: 6,
        max: 36,
        step: 0.5,
        unit: 'm²',
        defaultValue: 12.0,
      },
      {
        id: 'batteryCapacityKg',
        label: 'Battery Mass',
        min: 20,
        max: 100,
        step: 1,
        unit: 'kg',
        defaultValue: 45,
      },
    ],
    perfProfile: {
      type: 'solar',
      panelEfficiency: 0.30,
      cellDegradationPerYear: 0.02,
      batteryWhPerKg: 165,
      baseMTBFHours: 60_000,
    },
  },
  {
    id: 'pwr-nextgen-rtg',
    category: 'power',
    name: 'Next-Gen Radioisotope Thermoelectric Generator (RTG)',
    description:
      'Plutonium-238 heat source delivering continuous non-solar power independent of distance from the Sun or shadow eclipses.',
    costUSD: 95_000_000,
    massKg: 48,
    perfProfile: {
      type: 'rtg',
      ratedWatts: 450,
      baseMTBFHours: 120_000,
    },
  },

  // ==========================================================================
  // 4. PROPULSION & FUEL
  // ==========================================================================
  {
    id: 'prop-hydrazine-mono',
    category: 'propulsion',
    name: 'Monopropellant Hydrazine Propulsion (LRO Spec)',
    description:
      'Catalytic hydrazine thruster bank with a specific impulse of 212.2s. Ideal for lunar insertion and stationkeeping.',
    costUSD: 18_000_000,
    massKg: 95, // Dry propulsion assembly mass
    sliderRanges: [
      {
        id: 'propellantLoadKg',
        label: 'Hydrazine Propellant Load',
        min: 50,
        max: 1_200,
        step: 10,
        unit: 'kg',
        defaultValue: 897, // Exactly LRO propellant mass
      },
    ],
    perfProfile: {
      ispSeconds: 212.2,
      thrustN: 440,
      propellantType: 'Hydrazine (N2H4)',
      dryMassKg: 95,
      maxPropellantKg: 1_200,
      baseMTBFHours: 50_000,
    },
  },
  {
    id: 'prop-dual-mode-orbit-insertion',
    category: 'propulsion',
    name: 'High-Impulse Dual-Mode Engine (MAVEN Spec)',
    description:
      'Main orbital insertion thrusters operating at 235s Isp with large fuel tanks for multi-kilometer Mars orbit insertion.',
    costUSD: 29_000_000,
    massKg: 140,
    sliderRanges: [
      {
        id: 'propellantLoadKg',
        label: 'Propellant Tank Fill',
        min: 100,
        max: 1_800,
        step: 10,
        unit: 'kg',
        defaultValue: 1_640, // Exactly MAVEN tank capacity
      },
    ],
    perfProfile: {
      ispSeconds: 235.0,
      thrustN: 680,
      propellantType: 'Hydrazine Monopropellant',
      dryMassKg: 140,
      maxPropellantKg: 1_800,
      baseMTBFHours: 65_000,
    },
  },
  {
    id: 'prop-biprop-deepspace',
    category: 'propulsion',
    name: 'Bipropellant Apogee Engine (MMH/NTO)',
    description:
      'Hypergolic bipropellant system achieving 315s Isp, providing high delta-v efficiency for asteroid rendezvous missions.',
    costUSD: 42_000_000,
    massKg: 175,
    sliderRanges: [
      {
        id: 'propellantLoadKg',
        label: 'Bipropellant Mass',
        min: 200,
        max: 1_500,
        step: 10,
        unit: 'kg',
        defaultValue: 1_095, // Exactly OSIRIS-REx propellant mass
      },
    ],
    perfProfile: {
      ispSeconds: 315.0,
      thrustN: 450,
      propellantType: 'MMH / NTO Bipropellant',
      dryMassKg: 175,
      maxPropellantKg: 1_500,
      baseMTBFHours: 55_000,
    },
  },

  // ==========================================================================
  // 5. COMMUNICATIONS
  // ==========================================================================
  {
    id: 'comms-xband-deepspace',
    category: 'comms',
    name: 'Gimbaled Deep Space X-Band High-Gain Antenna',
    description:
      '8.4 GHz parabolic reflector dish with a 50W traveling-wave tube amplifier (TWTA) compatible with NASA Deep Space Network.',
    costUSD: 21_000_000,
    massKg: 42,
    sliderRanges: [
      {
        id: 'dishDiameterM',
        label: 'Parabolic Dish Diameter',
        min: 0.8,
        max: 3.0,
        step: 0.1,
        unit: 'm',
        defaultValue: 1.3,
      },
    ],
    perfProfile: {
      transmitPowerW: 50,
      frequencyGHz: 8.4,
      receiverGainDbi: 68.0, // 70-meter Deep Space Network ground station
      receiverThresholdDbm: -120.0,
      apertureEfficiency: 0.55,
      baseMTBFHours: 60_000,
    },
  },
  {
    id: 'comms-kaband-highrate',
    category: 'comms',
    name: 'Wideband Ka-Band High-Rate Downlink (LRO Spec)',
    description:
      '32 GHz high-frequency transmitter delivering up to 100 Mbps telemetry downlinks for massive scientific 3D data returns.',
    costUSD: 33_000_000,
    massKg: 55,
    sliderRanges: [
      {
        id: 'dishDiameterM',
        label: 'Dish Diameter',
        min: 1.0,
        max: 3.2,
        step: 0.1,
        unit: 'm',
        defaultValue: 1.8,
      },
    ],
    perfProfile: {
      transmitPowerW: 40,
      frequencyGHz: 32.0,
      receiverGainDbi: 75.0,
      receiverThresholdDbm: -115.0,
      apertureEfficiency: 0.55,
      baseMTBFHours: 55_000,
    },
  },

  // ==========================================================================
  // 6. INSTRUMENTS & PAYLOAD
  // ==========================================================================
  {
    id: 'inst-multispectral-imager',
    category: 'instrument',
    name: 'Multispectral Thermal & Land Imager (Landsat Spec)',
    description:
      'Calibrated multispectral radiometer capturing 9 reflective bands and dual thermal bands for continuous surface monitoring.',
    costUSD: 45_000_000,
    massKg: 310,
    perfProfile: {
      powerDrawW: 280,
      dataRateKbps: 45_000,
      dutyCycleDefault: 0.4,
      scienceValueMultiplier: 1.2,
      baseMTBFHours: 45_000,
    },
  },
  {
    id: 'inst-lunar-orbiter-laser-cam',
    category: 'instrument',
    name: 'Laser Altimeter & High-Res Mapping Camera (LRO Spec)',
    description:
      'Precision topographic mapping payload generating sub-meter digital elevation models and permanent shadow water-ice surveys.',
    costUSD: 36_000_000,
    massKg: 160,
    perfProfile: {
      powerDrawW: 140,
      dataRateKbps: 55_000,
      dutyCycleDefault: 0.6,
      scienceValueMultiplier: 1.3,
      baseMTBFHours: 50_000,
    },
  },
  {
    id: 'inst-mars-ion-neutral-mass-spec',
    category: 'instrument',
    name: 'Atmospheric Gas & Ion Mass Spectrometer (MAVEN Spec)',
    description:
      'High-sensitivity plasma and gas spectrometer suite measuring solar wind ion composition and upper atmosphere isotopic escape rates.',
    costUSD: 48_000_000,
    massKg: 135,
    perfProfile: {
      powerDrawW: 110,
      dataRateKbps: 18_000,
      dutyCycleDefault: 0.85,
      scienceValueMultiplier: 1.4,
      baseMTBFHours: 55_000,
    },
  },
  {
    id: 'inst-asteroid-ocams-spectral',
    category: 'instrument',
    name: 'PolyCam Camera & Thermal Emission Spectrometer (OSIRIS-REx)',
    description:
      'High-magnification telescopic imager and mineral spectrometer designed for micro-gravity proximity scouting and sample selection.',
    costUSD: 52_000_000,
    massKg: 145,
    perfProfile: {
      powerDrawW: 130,
      dataRateKbps: 28_000,
      dutyCycleDefault: 0.5,
      scienceValueMultiplier: 1.5,
      baseMTBFHours: 50_000,
    },
  },

  // ==========================================================================
  // 7. THERMAL & RADIATION PROTECTION
  // ==========================================================================
  {
    id: 'therm-passive-mli',
    category: 'thermal',
    name: 'Multi-Layer Insulation (MLI) & Passive Radiators',
    description:
      'Aluminized Mylar and Kapton blankets with thermal louvers keeping internal electronics within safe operational bounds.',
    costUSD: 8_500_000,
    massKg: 35,
    perfProfile: {
      absorptivity: 0.25,
      emissivity: 0.85,
      insulationFactor: 1.2,
      baseMTBFHours: 100_000,
    },
  },
  {
    id: 'therm-hardened-active',
    category: 'thermal',
    name: 'Rad-Hardened Shielding & Active Fluid Loop',
    description:
      'Beryllium radiation vault and active liquid heat-pipe loops for high-radiation belts and extreme solar flux variation.',
    costUSD: 19_000_000,
    massKg: 75,
    perfProfile: {
      absorptivity: 0.20,
      emissivity: 0.90,
      insulationFactor: 1.6,
      baseMTBFHours: 80_000,
    },
  },

  // ==========================================================================
  // 8. REDUNDANCY & RELIABILITY
  // ==========================================================================
  {
    id: 'red-single-string',
    category: 'redundancy',
    name: 'Single-String Standard Reliability (Class D)',
    description:
      'Single non-redundant component layout. Minimum mass and cost, but any single subsystem failure will end the mission.',
    costUSD: 5_000_000,
    massKg: 10,
    perfProfile: {
      failureRateMultiplier: 1.0,
      redundantSubsystems: [],
    },
  },
  {
    id: 'red-dual-critical',
    category: 'redundancy',
    name: 'Dual-String Critical Redundancy (Class B/C)',
    description:
      'Parallel backup units for communications transponders, power distribution, and attitude control reaction wheels.',
    costUSD: 26_000_000,
    massKg: 65,
    perfProfile: {
      failureRateMultiplier: 0.35,
      redundantSubsystems: ['comms', 'power', 'propulsion'],
    },
  },
  {
    id: 'red-triple-voting-fault-tolerant',
    category: 'redundancy',
    name: 'Full NASA Class A Fault-Tolerant Architecture',
    description:
      'Complete redundant parallel avionics with majority-voting cross-strapping, minimizing failure probability under all environments.',
    costUSD: 48_000_000,
    massKg: 120,
    perfProfile: {
      failureRateMultiplier: 0.05,
      redundantSubsystems: ['all'],
    },
  },
];

export const PARTS_BY_CATEGORY: Record<string, PartCatalogEntry[]> = PARTS.reduce(
  (acc, part) => {
    if (!acc[part.category]) {
      acc[part.category] = [];
    }
    acc[part.category].push(part);
    return acc;
  },
  {} as Record<string, PartCatalogEntry[]>
);
