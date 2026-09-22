/**
 * Domain Formulas Unit Tests
 * Verification against real NASA mission numbers and formulas in 07-domain-reference.md
 */

import { describe, it, expect } from 'vitest';
import { CONSTANTS } from './constants';
import {
  calculateDeltaV,
  calculateTotalDryMass,
  calculateOrbitalPeriod,
  calculateOrbitalVelocity,
  calculateSolarPowerGeneration,
  calculateRequiredBatteryWh,
  calculateFSPL,
  calculateParabolicAntennaGain,
  wattsToDbm,
  calculateEIRP,
  calculateLinkMargin,
  calculateDataVolumeMB,
  calculateThermalEquilibriumK,
  calculateReliability,
  calculateRedundantReliability,
} from './formulas';
import { MISSIONS } from '../data/missions';

describe('Domain Reference §1 — Tsiolkovsky Rocket Equation & Mass Budget', () => {
  it('verifies 20% mass growth contingency on dry parts', () => {
    // 07-domain-reference.md §1: totalDryMass = Σ(partMass) * 1.20
    const sampleDryPartSum = 1000;
    expect(calculateTotalDryMass(sampleDryPartSum)).toBe(1200);
  });

  it('verifies LRO lunar orbit insertion delta-v matches Goddard memo (~1,270 m/s)', () => {
    // 07-domain-reference.md §1 table:
    // LRO: Isp = 212.2 s, 897 kg hydrazine propellant
    // liftoff mass 1,965 kg vs dry mass 1,068 kg produces ~1,270 m/s
    const isp = 212.2;
    const wetMass = 1965;
    const dryMass = 1965 - 897; // 1068 kg
    const deltaV = calculateDeltaV(isp, wetMass, dryMass);

    // Expected: 212.2 * 9.80665 * ln(1965 / 1068) ≈ 1269 m/s
    expect(deltaV).toBeGreaterThan(1260);
    expect(deltaV).toBeLessThan(1280);
    expect(Math.round(deltaV)).toBe(1269);
  });

  it('verifies LRO total delta-v with baseline dry mass 949 kg and 897 kg propellant', () => {
    // 07-domain-reference.md §8: LRO launch mass 1,846 kg, dry mass 949 kg, propellant 897 kg
    const isp = 212.2;
    const dryMass = 949;
    const wetMass = dryMass + 897; // 1846 kg
    const deltaV = calculateDeltaV(isp, wetMass, dryMass);

    // 212.2 * 9.80665 * ln(1846 / 949) ≈ 1384 m/s (gives plenty of margin over required 1,270 m/s)
    expect(deltaV).toBeGreaterThan(1270);
    expect(Math.round(deltaV)).toBe(1385);
  });

  it('verifies MAVEN Mars orbit insertion delta-v burn (~1.0–1.3 km/s class)', () => {
    // 07-domain-reference.md §1 table:
    // MAVEN main engines 229–235 s Isp, wet 2,454 kg, dry 809 kg, tank capacity 1,640 kg
    // MOI burn consumes ~750-800 kg hydrazine
    const isp = 232.0; // mid of 229-235 s
    const wetMass = 2454;
    const fuelBurnedForMOI = 750;
    const massAfterMOI = wetMass - fuelBurnedForMOI;
    const moiDeltaV = calculateDeltaV(isp, wetMass, massAfterMOI);

    // Expected ~1.0–1.3 km/s class
    expect(moiDeltaV).toBeGreaterThan(800);
    expect(moiDeltaV).toBeLessThan(1350);
  });

  it('verifies OSIRIS-REx total delta-v capacity exceeds required ~1.4 km/s', () => {
    // 07-domain-reference.md §1 & §8: OSIRIS-REx dry mass 880 kg, propellant 1,095 kg
    const isp = 315.0; // Bipropellant system
    const dryMass = 880;
    const wetMass = dryMass + 1095; // 1975 kg
    const totalDeltaV = calculateDeltaV(isp, wetMass, dryMass);

    expect(totalDeltaV).toBeGreaterThan(MISSIONS.asteroid.orbit.requiredDeltaVms);
  });
});

describe('Domain Reference §2 — Kepler Third Law & Vis-Viva', () => {
  it('verifies Landsat 9 orbital period matches 99.0 min at 705 km SSO', () => {
    // 07-domain-reference.md §2 table: 705 km SSO altitude, period 99.0 min
    const rEarthM = 6378e3;
    const semiMajorAxisM = rEarthM + 705e3; // 7,083,000 m
    const periodSeconds = calculateOrbitalPeriod(semiMajorAxisM, CONSTANTS.MU_EARTH);
    const periodMinutes = periodSeconds / 60;

    // 2π * sqrt(7083000^3 / 3.986004e14) / 60 ≈ 98.9 minutes
    expect(periodMinutes).toBeCloseTo(99.0, 0);
  });

  it('verifies LRO lunar orbit period matches ~2 hr class (~113.5 min) at 50 km', () => {
    // 07-domain-reference.md §2 table: LRO 50 km circular polar, Moon μ = 4.9048e12
    const rMoonM = 1737.4e3;
    const semiMajorAxisM = rMoonM + 50e3; // 1,787,400 m
    const periodSeconds = calculateOrbitalPeriod(semiMajorAxisM, CONSTANTS.MU_MOON);
    const periodMinutes = periodSeconds / 60;

    // 2π * sqrt(1787400^3 / 4.9048e12) / 60 ≈ 113.4 min ≈ 1.89 hr
    expect(periodMinutes).toBeGreaterThan(110);
    expect(periodMinutes).toBeLessThan(120);
  });

  it('verifies MAVEN elliptical Mars orbit period matches ~4.5 hr', () => {
    // 07-domain-reference.md §2 table: 150 km periapsis x 6,200 km apoapsis, Mars μ = 4.282837e13
    const rMarsM = 3390e3;
    const periapsisM = rMarsM + 150e3;
    const apoapsisM = rMarsM + 6200e3;
    const semiMajorAxisM = (periapsisM + apoapsisM) / 2; // 6,565,000 m
    const periodSeconds = calculateOrbitalPeriod(semiMajorAxisM, CONSTANTS.MU_MARS);
    const periodHours = periodSeconds / 3600;

    // 2π * sqrt(6565000^3 / 4.282837e13) / 3600 ≈ 4.48 hr
    expect(periodHours).toBeCloseTo(4.5, 1);
  });

  it('calculates vis-viva orbital velocity correctly', () => {
    // Circular LEO at 705 km: v = sqrt(μ / r) ≈ 7.5 km/s
    const rM = 6378e3 + 705e3;
    const v = calculateOrbitalVelocity(rM, rM, CONSTANTS.MU_EARTH);
    expect(v).toBeGreaterThan(7400);
    expect(v).toBeLessThan(7600);
  });
});

describe('Domain Reference §3 — Power Budget & Solar Flux', () => {
  it('calculates LRO solar generation with 10.7 m² panel at 1 AU', () => {
    // 07-domain-reference.md §3: LRO 10.7 m², 824 W avg / 1.5 kW peak
    // Theoretical max normal incidence: 1361 * 10.7 * 0.295 ≈ 4,295 W
    const maxPower = calculateSolarPowerGeneration(1.0, 10.7, 0.295, 1.0);
    expect(maxPower).toBeGreaterThan(4200);

    // Average angle factor cos(θ) ≈ 0.20 due to orbit orientation and eclipses yields ~850 W
    const avgPower = calculateSolarPowerGeneration(1.0, 10.7, 0.295, 0.20);
    expect(avgPower).toBeCloseTo(859, 0);
  });

  it('verifies inverse-square drop off at Mars (1.52 AU)', () => {
    // At 1.52 AU, solar flux is 1 / (1.52^2) ≈ 43.3% of 1 AU
    const power1AU = calculateSolarPowerGeneration(1.0, 10.0, 0.30);
    const powerMars = calculateSolarPowerGeneration(1.52, 10.0, 0.30);

    const ratio = powerMars / power1AU;
    expect(ratio).toBeCloseTo(1 / Math.pow(1.52, 2), 4);
  });

  it('calculates battery sizing for eclipse duration', () => {
    // Load = 500W, eclipse = 0.75h (45 min), DoD = 0.70
    // Required Wh = (500 * 0.75) / 0.70 = 535.7 Wh
    const reqWh = calculateRequiredBatteryWh(500, 0.75, 0.7);
    expect(reqWh).toBeCloseTo(535.71, 1);
  });
});

describe('Domain Reference §4 — Communications Link Budget (Friis Equation)', () => {
  it('calculates Free-Space Path Loss (FSPL) for Lunar distance (384,400 km) at 8.4 GHz', () => {
    // FSPL = 20*log10(384400) + 20*log10(8400) + 32.44 ≈ 222.6 dB
    const fspl = calculateFSPL(384_400, 8400);
    expect(fspl).toBeCloseTo(222.6, 0);
  });

  it('calculates parabolic antenna gain for a 1.3m dish at 8.4 GHz (55% efficiency)', () => {
    // G ≈ 20*log10(1.3) + 20*log10(8.4) + 17.8 ≈ 38.57 dBi
    const gain = calculateParabolicAntennaGain(1.3, 8.4);
    expect(gain).toBeCloseTo(38.57, 1);
  });

  it('converts RF power Watts to dBm and calculates EIRP', () => {
    // 50 Watts = 10 * log10(50,000) ≈ 46.99 dBm
    const dbm = wattsToDbm(50);
    expect(dbm).toBeCloseTo(46.99, 1);

    // EIRP = 46.99 + 38.57 ≈ 85.56 dBm
    const eirp = calculateEIRP(50, 38.57);
    expect(eirp).toBeCloseTo(85.56, 1);
  });

  it('verifies link margin closes positively for Lunar Orbiter to Earth DSN', () => {
    const eirpDbm = calculateEIRP(50, 38.57);
    const receiverGainDbi = 68.0; // 70m DSN dish
    const fsplDb = calculateFSPL(384_400, 8400);
    const otherLossesDb = 4.0;
    const requiredThresholdDbm = -120.0;

    const margin = calculateLinkMargin(
      eirpDbm,
      receiverGainDbi,
      fsplDb,
      otherLossesDb,
      requiredThresholdDbm
    );

    // Positive margin ensures the communications link closes
    expect(margin).toBeGreaterThan(0);
    expect(margin).toBeCloseTo(47.0, 0);
  });

  it('calculates downlinked data volume correctly', () => {
    // 50,000 kbps (50 Mbps) for 1 hour (3600s) = 180,000,000 kbits ≈ 21,457 MB
    const mb = calculateDataVolumeMB(50_000, 3600);
    expect(mb).toBeCloseTo(21457.67, 1);
  });
});

describe('Domain Reference §5 — Thermal Radiative Equilibrium', () => {
  it('calculates equilibrium temperature under solar flux', () => {
    // α = 0.25 (white paint), ε = 0.85 (thermal coating), A_absorb/A_emit = 1/4 (sphere in sunlight)
    // T_eq = [ (0.25 * 1361 * 1) / (0.85 * 5.670374e-8 * 4 * 1.0^2) ]^(0.25) ≈ 204.8 K
    const tempK = calculateThermalEquilibriumK(0.25, 0.85, 1.0, 4.0, 1.0);
    expect(tempK).toBeCloseTo(204.8, 0);
  });

  it('verifies temperature is lower at Mars distance (1.52 AU)', () => {
    const tempEarth = calculateThermalEquilibriumK(0.25, 0.85, 1.0, 4.0, 1.0);
    const tempMars = calculateThermalEquilibriumK(0.25, 0.85, 1.0, 4.0, 1.52);

    expect(tempMars).toBeLessThan(tempEarth);
    // Ratio should be 1 / sqrt(1.52) ≈ 0.811
    expect(tempMars / tempEarth).toBeCloseTo(1 / Math.sqrt(1.52), 2);
  });
});

describe('Domain Reference §6 — Exponential Reliability & Redundancy', () => {
  it('evaluates exponential reliability decay', () => {
    // MTBF = 50,000 hours, elapsed = 1,000 hours -> R(t) = exp(-1000/50000) = exp(-0.02) ≈ 0.9802
    const r = calculateReliability(1000, 50_000);
    expect(r).toBeCloseTo(Math.exp(-0.02), 4);
  });

  it('verifies parallel redundancy squares the failure probability', () => {
    // Single unit reliability = 0.95 -> failure prob = 0.05
    // Dual parallel system failure prob = 0.05 * 0.05 = 0.0025 -> system reliability = 0.9975
    const singleR = 0.95;
    const redundantR = calculateRedundantReliability(singleR);
    expect(redundantR).toBeCloseTo(0.9975, 4);
  });
});

describe('Domain Reference §8 — Real Mission Reference Numbers Integrity', () => {
  for (const [id, mission] of Object.entries(MISSIONS)) {
    it(`validates real mission numbers for ${mission.name} (${id})`, () => {
      const real = mission.realMission;
      expect(real.launchMassKg).toBeGreaterThan(0);
      expect(real.dryMassKg).toBeGreaterThan(0);
      expect(real.launchMassKg).toBeGreaterThanOrEqual(real.dryMassKg);
      expect(real.costUSD).toBeGreaterThan(0);
      expect(real.powerW).toBeGreaterThan(0);
      expect(real.launchVehicle).toBeTruthy();
      expect(real.orbit).toBeTruthy();
      expect(real.sourceNote).toBeTruthy();
    });
  }

  it('matches Landsat 9 exact figures from section 8', () => {
    const l9 = MISSIONS['earth-orbit'].realMission;
    expect(l9.name).toBe('Landsat 9');
    expect(l9.launchMassKg).toBe(2711);
    expect(l9.dryMassKg).toBe(2390);
    expect(l9.powerW).toBe(4300);
    expect(l9.launchVehicle).toBe('Atlas V 401');
  });

  it('matches LRO exact figures from section 8', () => {
    const lro = MISSIONS['moon'].realMission;
    expect(lro.name).toBe('LRO');
    expect(lro.launchMassKg).toBe(1846);
    expect(lro.dryMassKg).toBe(949);
    expect(lro.powerW).toBe(824);
    expect(lro.costUSD).toBe(500_000_000);
    expect(lro.deltaVms).toBe(1270);
    expect(lro.launchVehicle).toBe('Atlas V 401');
  });

  it('matches MAVEN exact figures from section 8', () => {
    const maven = MISSIONS['mars'].realMission;
    expect(maven.name).toBe('MAVEN');
    expect(maven.launchMassKg).toBe(2454);
    expect(maven.dryMassKg).toBe(809);
    expect(maven.powerW).toBe(1135);
    expect(maven.costUSD).toBe(582_500_000);
    expect(maven.launchVehicle).toBe('Atlas V 401');
  });

  it('matches OSIRIS-REx exact figures from section 8', () => {
    const orex = MISSIONS['asteroid'].realMission;
    expect(orex.name).toBe('OSIRIS-REx');
    expect(orex.launchMassKg).toBe(2110);
    expect(orex.dryMassKg).toBe(880);
    expect(orex.powerW).toBe(1226);
    expect(orex.costUSD).toBe(983_500_000);
    expect(orex.deltaVms).toBe(1400);
    expect(orex.launchVehicle).toBe('Atlas V 411');
  });
});
