/**
 * Scoring Module
 * Source: 01-prd.md §4.6, 05-backend-schema.md §3, §6, and 07-domain-reference.md §7
 *
 * Implements pure computeScore function producing a 100-point ScoreResult across 5 components:
 * 1. scienceReturn (0–40 pts)
 * 2. budgetEfficiency (0–20 pts)
 * 3. resilience (0–20 pts)
 * 4. decisionSpeed (0–10 pts)
 * 5. designEfficiency (0–10 pts)
 */

import { Mission, SpacecraftDesign, MissionRunState, ScoreResult } from './types';

/**
 * Generate diagnostic educational feedback when a mission fails or scores low.
 */
export function generateWhatWentWrong(
  finalState: MissionRunState,
  design: SpacecraftDesign,
  mission: Mission,
  components: {
    scienceReturn: number;
    budgetEfficiency: number;
    resilience: number;
    decisionSpeed: number;
    designEfficiency: number;
  }
): string | null {
  const isFailed = finalState.outcome === 'fail';

  // Primary failure scenarios
  if (isFailed) {
    if (finalState.fuelRemainingKg <= 0) {
      return 'Propellant exhaustion: the spacecraft ran out of fuel before completing orbital insertion maneuvers. Upgrade to a higher-Isp propulsion system or choose a lighter bus to improve Δv margin.';
    }

    if (!finalState.commsLinkOk || finalState.dataDownlinkedMB === 0) {
      return 'Communications link failure: the link budget did not close (negative dB margin), preventing science telemetry downlink to Earth Deep Space Network. Increase antenna diameter or RF transmitter power.';
    }

    if (finalState.powerBalanceW < -20) {
      return 'Electrical power depletion: the electrical bus drained during eclipse. Increase solar array surface area or increase battery storage capacity.';
    }

    if (finalState.failureReason) {
      return `Mission failure: ${finalState.failureReason}`;
    }

    return 'Mission failed: telemetry limits were exceeded during flight operations.';
  }

  // Component-specific low scores (< 50% of category maximum)
  if (components.scienceReturn < 20) {
    return `Low science return (${components.scienceReturn}/40): downlinked data volume (${Math.round(finalState.dataDownlinkedMB)} MB) fell short of mission requirements (${mission.minScienceDataMB.toLocaleString()} MB). Improve comms link margin or payload survey efficiency.`;
  }

  if (components.budgetEfficiency < 10) {
    const cost = design.derived?.costUSD.current || 0;
    return `Tight budget margin (${components.budgetEfficiency}/20): total program cost ($${(cost / 1_000_000).toFixed(1)}M) nearly exhausted the $${(mission.budgetCapUSD / 1_000_000).toFixed(1)}M budget cap. Replace premium components with cost-optimized alternatives.`;
  }

  if (components.resilience < 10) {
    return `Low resilience (${components.resilience}/20): spacecraft concluded operations with critically low propellant or without subsystem redundancy. Equip dual-string redundancy for higher reliability.`;
  }

  if (components.decisionSpeed < 5) {
    return `Slow operational reaction (${components.decisionSpeed}/10): flight controller response latency was high during tactical decision events, incurring timeout penalties.`;
  }

  if (components.designEfficiency < 5) {
    return `Suboptimal pre-flight design (${components.designEfficiency}/10): critical margins (booster mass capacity, power balance, or thermal band) were stressed near structural limits.`;
  }

  return null;
}

/**
 * Compute the 5-component mission score (0–100 total) from final telemetry.
 * Completely traceable to real physical metrics and flight events.
 */
export function computeScore(
  finalState: MissionRunState,
  design: SpacecraftDesign,
  mission: Mission
): ScoreResult {
  const derived = design.derived;

  // 1. Science Return (0–40 pts)
  // Traceability: Ratio of data successfully downlinked vs mission objective.
  // Directly driven by Friis comms link budget (07-domain-reference.md §4).
  let scienceReturn = 0;
  if (mission.minScienceDataMB > 0) {
    const dataRatio = finalState.dataDownlinkedMB / mission.minScienceDataMB;
    scienceReturn = Math.min(40, Math.max(0, Math.round(dataRatio * 40)));
  } else {
    scienceReturn = 40;
  }

  // 2. Budget Efficiency (0–20 pts)
  // Traceability: Cost of design relative to mission budgetCapUSD.
  let budgetEfficiency = 0;
  const totalCost = derived?.costUSD.current ?? 0;
  if (mission.budgetCapUSD > 0) {
    if (totalCost > mission.budgetCapUSD || (derived?.costUSD.isOver ?? false)) {
      budgetEfficiency = 0;
    } else {
      const fractionSpent = totalCost / mission.budgetCapUSD;
      // Spending 100% of budget yields 10/20 pts (50%); spending less yields up to 20/20 pts.
      budgetEfficiency = Math.min(20, Math.max(0, Math.round(20 * (1 - fractionSpent * 0.5))));
    }
  } else {
    budgetEfficiency = 20;
  }

  // 3. Resilience (0–20 pts)
  // Traceability: Propellant margin remaining (0–10 pts) + subsystem reliability rating (0–10 pts).
  let fuelPoints = 0;
  let initialPropellant = 200;
  for (const [key, val] of Object.entries(design.sliderValues || {})) {
    if (key.includes('propellantLoadKg')) {
      initialPropellant = val;
      break;
    }
  }

  if (finalState.fuelRemainingKg > 0) {
    const fuelMarginRatio = Math.min(1, finalState.fuelRemainingKg / Math.max(1, initialPropellant));
    fuelPoints = Math.round(fuelMarginRatio * 10);
  } else {
    fuelPoints = 0;
  }

  const reliability = derived?.reliabilityEstimate ?? 0.9;
  const reliabilityPoints = Math.min(10, Math.max(0, Math.round(reliability * 10)));
  const resilience = Math.min(20, Math.max(0, fuelPoints + reliabilityPoints));

  // 4. Decision Speed (0–10 pts)
  // Traceability: Reaction time during tactical decision cards.
  let decisionSpeed = 10;
  if (finalState.totalDecisionsMade > 0) {
    const fastRatio = finalState.fastDecisionsCount / finalState.totalDecisionsMade;
    decisionSpeed = Math.min(10, Math.max(0, Math.round(5 + fastRatio * 5)));
  }

  // 5. Design Efficiency (0–10 pts)
  // Traceability: Pre-flight margins (mass margin, power margin, delta-V margin, thermal equilibrium).
  let designEfficiency = 0;
  if (derived) {
    // Mass within booster payload limit (3 pts)
    if (!derived.massKg.isOver && derived.massKg.limit > 0) {
      designEfficiency += 3;
    }
    // Power surplus generation (3 pts)
    if (!derived.powerW.isOver && derived.powerW.limit > 0) {
      designEfficiency += 3;
    }
    // Delta-v meets or exceeds mission requirement (2 pts)
    if (!derived.deltaVms.isOver && derived.deltaVms.limit > 0) {
      designEfficiency += 2;
    }
    // Thermal equilibrium within safe operating band (2 pts)
    if (derived.thermalEquilibriumK.isSafe) {
      designEfficiency += 2;
    }
  } else {
    designEfficiency = 7;
  }

  // Determine outcome
  const outcome: 'pass' | 'fail' =
    finalState.outcome !== null
      ? finalState.outcome
      : scienceReturn >= 20 && finalState.fuelRemainingKg > 0 && finalState.powerBalanceW >= 0
      ? 'pass'
      : 'fail';

  const total = Math.min(
    100,
    Math.max(0, scienceReturn + budgetEfficiency + resilience + decisionSpeed + designEfficiency)
  );

  const whatWentWrong = generateWhatWentWrong(finalState, design, mission, {
    scienceReturn,
    budgetEfficiency,
    resilience,
    decisionSpeed,
    designEfficiency,
  });

  return {
    outcome,
    total,
    scienceReturn,
    budgetEfficiency,
    resilience,
    decisionSpeed,
    designEfficiency,
    whatWentWrong,
  };
}
