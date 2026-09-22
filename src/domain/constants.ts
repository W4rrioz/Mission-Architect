/**
 * Domain Reference — Real Physical & Astronomical Constants
 * Source: 07-domain-reference.md §9
 */

export const CONSTANTS = {
  /** Standard gravity (Isp reference constant), m/s² */
  g0: 9.80665,
  /** Solar constant at 1 AU, W/m² */
  SOLAR_CONSTANT: 1361,
  /** Stefan-Boltzmann constant, W/(m²·K⁴) */
  STEFAN_BOLTZMANN: 5.670374e-8,
  /** Speed of light in vacuum, m/s */
  C: 2.998e8,
  /** Standard gravitational parameter of Earth, m³/s² */
  MU_EARTH: 3.986004e14,
  /** Standard gravitational parameter of the Moon, m³/s² */
  MU_MOON: 4.9048e12,
  /** Standard gravitational parameter of Mars, m³/s² */
  MU_MARS: 4.282837e13,
  /** Kilometers per Astronomical Unit (AU), km */
  AU_KM: 1.495978707e8,
} as const;

export type Constants = typeof CONSTANTS;
