/**
 * Domain Reference Formulas
 * Source: 07-domain-reference.md sections 1-6
 *
 * Implements real aerospace systems engineering formulas without simplifications.
 */

import { CONSTANTS } from './constants';

// ============================================================================
// SECTION 1: Mass & Delta-v — Tsiolkovsky Rocket Equation
// Source: 07-domain-reference.md §1
// ============================================================================

/**
 * 07-domain-reference.md §1 — Mass Budget Margin
 * Real spacecraft mass budgets carry a contingency for growth during development.
 * Standard 20% mass growth allowance: totalDryMass = Σ(partMass) * 1.20
 *
 * @param summedDryPartMassKg Sum of all dry part masses (kg)
 * @returns Total dry mass including 20% contingency (kg)
 */
export function calculateTotalDryMass(summedDryPartMassKg: number): number {
  return summedDryPartMassKg * 1.2;
}

/**
 * 07-domain-reference.md §1 — Tsiolkovsky Rocket Equation
 * Δv = Isp · g0 · ln(m0 / mf)
 *
 * @param ispSeconds Specific impulse of the propulsion system in seconds (Isp)
 * @param wetMassKg Initial wet mass m0 (dry spacecraft mass + propellant mass) (kg)
 * @param dryMassKg Final dry mass mf after burn (kg)
 * @returns Total velocity change available in m/s (Δv)
 */
export function calculateDeltaV(
  ispSeconds: number,
  wetMassKg: number,
  dryMassKg: number
): number {
  if (wetMassKg <= 0 || dryMassKg <= 0 || wetMassKg < dryMassKg || ispSeconds <= 0) {
    return 0;
  }
  return ispSeconds * CONSTANTS.g0 * Math.log(wetMassKg / dryMassKg);
}

// ============================================================================
// SECTION 2: Orbital Mechanics — Kepler's Third Law & Vis-Viva
// Source: 07-domain-reference.md §2
// ============================================================================

/**
 * 07-domain-reference.md §2 — Orbital Period (Kepler's Third Law)
 * T = 2π · √(a³ / μ)
 *
 * @param semiMajorAxisM Semi-major axis in meters (a)
 * @param muCentralBody Standard gravitational parameter in m³/s² (μ)
 * @returns Orbital period in seconds (T)
 */
export function calculateOrbitalPeriod(
  semiMajorAxisM: number,
  muCentralBody: number
): number {
  if (semiMajorAxisM <= 0 || muCentralBody <= 0) return 0;
  return 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxisM, 3) / muCentralBody);
}

/**
 * 07-domain-reference.md §2 — Orbital Velocity (Vis-Viva Equation)
 * v = √( μ · (2/r − 1/a) )
 *
 * @param currentDistanceM Current distance from central body's center in meters (r)
 * @param semiMajorAxisM Semi-major axis in meters (a)
 * @param muCentralBody Standard gravitational parameter in m³/s² (μ)
 * @returns Orbital velocity in m/s (v)
 */
export function calculateOrbitalVelocity(
  currentDistanceM: number,
  semiMajorAxisM: number,
  muCentralBody: number
): number {
  if (currentDistanceM <= 0 || semiMajorAxisM <= 0 || muCentralBody <= 0) return 0;
  const term = 2 / currentDistanceM - 1 / semiMajorAxisM;
  if (term < 0) return 0;
  return Math.sqrt(muCentralBody * term);
}

// ============================================================================
// SECTION 3: Power Budget — Solar Flux, Inverse-Square Law, Panel Efficiency
// Source: 07-domain-reference.md §3
// ============================================================================

/**
 * 07-domain-reference.md §3 — Solar Power Generation
 * P_generated = (S₀ / d_AU²) · A · η_panel · cos θ · (1 − k_degrade)^years
 *
 * @param solarDistanceAU Distance from the Sun in Astronomical Units (d_AU)
 * @param panelAreaM2 Solar panel area in m² (A)
 * @param panelEfficiency Panel efficiency η_panel (e.g. 0.28 to 0.30)
 * @param cosTheta Sun incidence angle factor cos θ (default 1.0)
 * @param degradationPerYear Annual degradation rate k_degrade (default 0.025 = 2.5%/yr)
 * @param missionYears Mission elapsed time in years (default 0)
 * @returns Generated power in Watts (W)
 */
export function calculateSolarPowerGeneration(
  solarDistanceAU: number,
  panelAreaM2: number,
  panelEfficiency: number,
  cosTheta: number = 1.0,
  degradationPerYear: number = 0.025,
  missionYears: number = 0
): number {
  if (solarDistanceAU <= 0 || panelAreaM2 <= 0 || panelEfficiency <= 0) return 0;
  const fluxAtDistance = CONSTANTS.SOLAR_CONSTANT / Math.pow(solarDistanceAU, 2);
  const degradationFactor = Math.pow(1 - degradationPerYear, missionYears);
  return fluxAtDistance * panelAreaM2 * panelEfficiency * cosTheta * degradationFactor;
}

/**
 * 07-domain-reference.md §3 — Battery Sizing for Eclipse
 * Required Battery Capacity (Wh) = average load (W) × eclipse duration (h) / depth-of-discharge limit
 *
 * @param averageLoadW Average power load during eclipse in Watts
 * @param eclipseDurationHours Duration of eclipse in hours
 * @param depthOfDischargeLimit Depth of Discharge limit (typically 0.60 to 0.80)
 * @returns Required battery capacity in Watt-hours (Wh)
 */
export function calculateRequiredBatteryWh(
  averageLoadW: number,
  eclipseDurationHours: number,
  depthOfDischargeLimit: number = 0.7
): number {
  if (depthOfDischargeLimit <= 0) return 0;
  return (averageLoadW * eclipseDurationHours) / depthOfDischargeLimit;
}

// ============================================================================
// SECTION 4: Communications Link Budget — Friis Transmission Equation
// Source: 07-domain-reference.md §4
// ============================================================================

/**
 * 07-domain-reference.md §4 — Free-Space Path Loss (FSPL)
 * FSPL(dB) = 20·log₁₀(d_km) + 20·log₁₀(f_MHz) + 32.44
 *
 * @param distanceKm Distance between spacecraft and receiver station in km (d_km)
 * @param frequencyMHz Carrier frequency in MHz (f_MHz, e.g. 8400 for 8.4 GHz X-band)
 * @returns Free-space path loss in dB
 */
export function calculateFSPL(distanceKm: number, frequencyMHz: number): number {
  if (distanceKm <= 0 || frequencyMHz <= 0) return 0;
  return 20 * Math.log10(distanceKm) + 20 * Math.log10(frequencyMHz) + 32.44;
}

/**
 * 07-domain-reference.md §4 — Parabolic Dish Antenna Gain (55% aperture efficiency)
 * G(dBi) ≈ 20·log₁₀(D) + 20·log₁₀(f_GHz) + 17.8
 *
 * @param dishDiameterM Parabolic dish diameter in meters (D)
 * @param frequencyGHz Carrier frequency in GHz (f_GHz, e.g. 8.4 GHz)
 * @returns Dish antenna gain in dBi
 */
export function calculateParabolicAntennaGain(
  dishDiameterM: number,
  frequencyGHz: number
): number {
  if (dishDiameterM <= 0 || frequencyGHz <= 0) return 0;
  return 20 * Math.log10(dishDiameterM) + 20 * Math.log10(frequencyGHz) + 17.8;
}

/**
 * 07-domain-reference.md §4 — Transmit Power in dBm
 * P(dBm) = 10 · log₁₀(P_watts · 1000)
 *
 * @param powerWatts RF transmit power in Watts
 * @returns Power in dBm
 */
export function wattsToDbm(powerWatts: number): number {
  if (powerWatts <= 0) return -Infinity;
  return 10 * Math.log10(powerWatts * 1000);
}

/**
 * 07-domain-reference.md §4 — Equivalent Isotropically Radiated Power (EIRP)
 * EIRP(dBm) = TransmitPower(dBm) + G_transmitter(dBi)
 *
 * @param transmitPowerWatts RF transmit power in Watts
 * @param antennaGainDbi Transmitter antenna gain in dBi
 * @returns EIRP in dBm
 */
export function calculateEIRP(
  transmitPowerWatts: number,
  antennaGainDbi: number
): number {
  return wattsToDbm(transmitPowerWatts) + antennaGainDbi;
}

/**
 * 07-domain-reference.md §4 — Communications Link Margin
 * Link Margin (dB) = EIRP(dBm) + G_receiver(dBi) − FSPL(dB) − OtherLosses(dB) − RequiredThreshold(dBm)
 *
 * @param eirpDbm Spacecraft EIRP in dBm
 * @param receiverGainDbi Receiver station antenna gain in dBi (e.g. DSN 70m dish)
 * @param fsplDb Free-space path loss in dB
 * @param otherLossesDb Atmospheric, pointing, and system losses (typically 3–5 dB)
 * @param requiredThresholdDbm Minimum receiver sensitivity threshold in dBm (e.g. -120 dBm)
 * @returns Link margin in dB (positive = link closes, negative = comms loss)
 */
export function calculateLinkMargin(
  eirpDbm: number,
  receiverGainDbi: number,
  fsplDb: number,
  otherLossesDb: number = 4.0,
  requiredThresholdDbm: number = -120.0
): number {
  return eirpDbm + receiverGainDbi - fsplDb - otherLossesDb - requiredThresholdDbm;
}

/**
 * 07-domain-reference.md §4 — Data Volume Downlinked
 * DataVolumeDownlinked(bits) = DataRate(bits/s) × PassDuration(s)
 * DataVolumeMB = DataVolumeDownlinked / (8 * 1024 * 1024)
 *
 * @param dataRateKbps Downlink data rate in kilobits per second (kbps)
 * @param passDurationSec Duration of the communications pass in seconds
 * @returns Data volume in Megabytes (MB)
 */
export function calculateDataVolumeMB(
  dataRateKbps: number,
  passDurationSec: number
): number {
  const totalBits = dataRateKbps * 1000 * passDurationSec;
  return totalBits / (8 * 1024 * 1024);
}

// ============================================================================
// SECTION 5: Thermal Balance — Stefan-Boltzmann Radiative Equilibrium
// Source: 07-domain-reference.md §5
// ============================================================================

/**
 * 07-domain-reference.md §5 — Radiative Thermal Equilibrium Temperature
 * T_eq = [ (α · S₀ · A_absorb) / (ε · σ · A_emit · d_AU²) ] ^ (1/4)
 *
 * @param absorptivity Solar absorptivity α (0.2 for white paint to 0.9 for dark surfaces)
 * @param emissivity Infrared emissivity ε (0.8 to 0.9 for thermal coatings)
 * @param absorbAreaM2 Sunlit cross-section area in m² (A_absorb)
 * @param emitAreaM2 Total radiating surface area in m² (A_emit)
 * @param solarDistanceAU Distance from the Sun in Astronomical Units (d_AU)
 * @returns Equilibrium temperature in Kelvin (K)
 */
export function calculateThermalEquilibriumK(
  absorptivity: number,
  emissivity: number,
  absorbAreaM2: number,
  emitAreaM2: number,
  solarDistanceAU: number
): number {
  if (
    absorptivity <= 0 ||
    emissivity <= 0 ||
    absorbAreaM2 <= 0 ||
    emitAreaM2 <= 0 ||
    solarDistanceAU <= 0
  ) {
    return 0;
  }
  const numerator = absorptivity * CONSTANTS.SOLAR_CONSTANT * absorbAreaM2;
  const denominator =
    emissivity *
    CONSTANTS.STEFAN_BOLTZMANN *
    emitAreaM2 *
    Math.pow(solarDistanceAU, 2);
  return Math.pow(numerator / denominator, 0.25);
}

// ============================================================================
// SECTION 6: Reliability — Exponential Failure Model & Redundancy
// Source: 07-domain-reference.md §6
// ============================================================================

/**
 * 07-domain-reference.md §6 — Exponential Reliability Function
 * R(t) = e^(−λ·t), where λ = 1 / MTBF
 *
 * @param elapsedHours Mission elapsed time in hours (t)
 * @param mtbfHours Mean Time Between Failures in hours (MTBF)
 * @returns Reliability probability R(t) between 0 and 1
 */
export function calculateReliability(
  elapsedHours: number,
  mtbfHours: number
): number {
  if (mtbfHours <= 0) return 0;
  if (elapsedHours <= 0) return 1.0;
  const lambda = 1 / mtbfHours;
  return Math.exp(-lambda * elapsedHours);
}

/**
 * 07-domain-reference.md §6 — Redundant System Reliability (Parallel Pair)
 * P(system failure) = P(unit A fails) × P(unit B fails) = (1 − R_unit(t))²
 * R_redundant(t) = 1 - (1 − R_unit(t))²
 *
 * @param unitReliability Reliability probability of a single unit R_unit(t) (0 to 1)
 * @returns Reliability probability of the parallel redundant pair (0 to 1)
 */
export function calculateRedundantReliability(unitReliability: number): number {
  const failureProb = Math.max(0, Math.min(1, 1 - unitReliability));
  const systemFailureProb = failureProb * failureProb;
  return 1 - systemFailureProb;
}
