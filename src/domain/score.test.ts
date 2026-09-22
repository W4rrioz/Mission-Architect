/**
 * Scoring Module Unit Tests
 * Source: 06-implementation-plan.md Phase 6, 07-domain-reference.md §7
 *
 * Verifies 5-component score computation and strictly proves score traceability:
 * A run that fails on comms specifically scores low on scienceReturn and NOT
 * on the other components.
 */

import { describe, it, expect } from 'vitest';
import { computeScore } from './score';
import { MISSIONS } from '../data/missions';
import { PARTS } from '../data/parts';
import { SpacecraftDesign, MissionRunState } from './types';
import { computeDerivedGauges } from './design';

describe('Phase 6 — Scoring Algorithm & Traceability', () => {
  const earthMission = MISSIONS['earth-orbit'];

  // Base sound spacecraft design for Earth Orbit
  const baseDesign: SpacecraftDesign = {
    missionId: 'earth-orbit',
    selectedParts: {
      launchVehicle: 'lv-medium-falcon',
      bus: 'bus-standard-science',
      power: 'pwr-triple-junction-solar',
      propulsion: 'prop-hydrazine-mono',
      comms: 'comms-xband-deepspace',
      instrument: 'inst-multispectral-imager',
      thermal: 'therm-passive-mli',
      redundancy: 'red-dual-critical',
    },
    sliderValues: {
      'pwr-triple-junction-solar.arrayAreaM2': 10,
      'pwr-triple-junction-solar.batteryCapacityKg': 40,
      'prop-hydrazine-mono.propellantLoadKg': 300,
      'comms-xband-deepspace.dishDiameterM': 1.2,
    },
  };

  const soundDesignWithDerived: SpacecraftDesign = {
    ...baseDesign,
    derived: computeDerivedGauges(baseDesign, earthMission, PARTS),
  };

  it('computes a high score across all 5 components for a nominal successful run', () => {
    const nominalState: MissionRunState = {
      missionId: 'earth-orbit',
      phase: 'endOfMission',
      elapsedSeconds: 360,
      fuelRemainingKg: 150, // plenty of propellant left
      powerBalanceW: 250,
      dataStoredMB: 1000,
      dataDownlinkedMB: 55_000, // exceeded target (50,000 MB)
      commsLinkOk: true,
      temperatureK: 288,
      activeDecisionCard: null,
      eventLog: [],
      outcome: 'pass',
      decisionTimerRemaining: 0,
      totalDecisionsMade: 2,
      fastDecisionsCount: 2, // 100% fast decisions
      totalBurnDeltaVms: 50,
      requiredBurnDeltaVms: 50,
    };

    const score = computeScore(nominalState, soundDesignWithDerived, earthMission);

    expect(score.outcome).toBe('pass');
    expect(score.scienceReturn).toBe(40); // 100% of 40 pts
    expect(score.budgetEfficiency).toBeGreaterThanOrEqual(10); // under budget
    expect(score.resilience).toBeGreaterThanOrEqual(12); // high fuel + high reliability
    expect(score.decisionSpeed).toBe(10); // 2 fast decisions
    expect(score.designEfficiency).toBe(10); // all margins healthy
    expect(score.total).toBeGreaterThanOrEqual(85);
    expect(score.whatWentWrong).toBeNull();
  });

  it('proves that a run failing on comms specifically scores low on scienceReturn and not on other components', () => {
    // Spacecraft has a sound budget, high reliability, perfect flight decisions,
    // but the communications link failed to downlink science data
    const commsFailureState: MissionRunState = {
      missionId: 'earth-orbit',
      phase: 'endOfMission',
      elapsedSeconds: 360,
      fuelRemainingKg: 150, // Fuel healthy
      powerBalanceW: 250, // Power healthy
      dataStoredMB: 50_000, // Gathered onboard, but...
      dataDownlinkedMB: 0, // Zero data delivered to Earth!
      commsLinkOk: false, // Link did not close
      temperatureK: 288,
      activeDecisionCard: null,
      eventLog: [],
      outcome: 'fail',
      failureReason: 'Communications link margin dropped below 0 dB. Telemetry lost.',
      decisionTimerRemaining: 0,
      totalDecisionsMade: 2,
      fastDecisionsCount: 2, // Operator responded rapidly
      totalBurnDeltaVms: 50,
      requiredBurnDeltaVms: 50,
    };

    const score = computeScore(commsFailureState, soundDesignWithDerived, earthMission);

    expect(score.outcome).toBe('fail');

    // Traceability assertion: scienceReturn is 0 due to zero downlink
    expect(score.scienceReturn).toBe(0);

    // Other components are NOT unfairly penalized:
    expect(score.budgetEfficiency).toBeGreaterThanOrEqual(10); // Design was still under budget
    expect(score.resilience).toBeGreaterThanOrEqual(12); // Propulsion and bus did not explode
    expect(score.decisionSpeed).toBe(10); // Operator was prompt
    expect(score.designEfficiency).toBe(10); // Mass, power, and dv margins were sound

    // Total score is specifically degraded by the missing 40 science points
    expect(score.total).toBeLessThanOrEqual(60);

    // Diagnostic feedback points out comms failure
    expect(score.whatWentWrong).toContain('Communications link failure');
  });

  it('penalizes resilience and identifies propellant exhaustion when fuel runs out', () => {
    const fuelExhaustionState: MissionRunState = {
      missionId: 'earth-orbit',
      phase: 'arrival',
      elapsedSeconds: 200,
      fuelRemainingKg: 0, // Ran dry
      powerBalanceW: 100,
      dataStoredMB: 100,
      dataDownlinkedMB: 50,
      commsLinkOk: true,
      temperatureK: 285,
      activeDecisionCard: null,
      eventLog: [],
      outcome: 'fail',
      failureReason: 'Propellant depleted during orbital maneuver.',
      decisionTimerRemaining: 0,
      totalDecisionsMade: 0,
      fastDecisionsCount: 0,
      totalBurnDeltaVms: 30,
      requiredBurnDeltaVms: 50,
    };

    const score = computeScore(fuelExhaustionState, soundDesignWithDerived, earthMission);

    expect(score.outcome).toBe('fail');
    // Fuel points dropped to 0, resilience only has base reliability
    expect(score.resilience).toBeLessThanOrEqual(10);
    expect(score.whatWentWrong).toContain('Propellant exhaustion');
  });

  it('penalizes budgetEfficiency to 0 if design costs exceed the mission budget cap', () => {
    const expensiveDesign: SpacecraftDesign = {
      ...soundDesignWithDerived,
      derived: {
        ...(soundDesignWithDerived.derived!),
        costUSD: {
          current: earthMission.budgetCapUSD + 50_000_000, // $50M over cap
          limit: earthMission.budgetCapUSD,
          percentage: 116.7,
          isOver: true,
        },
      },
    };

    const nominalState: MissionRunState = {
      missionId: 'earth-orbit',
      phase: 'endOfMission',
      elapsedSeconds: 360,
      fuelRemainingKg: 100,
      powerBalanceW: 200,
      dataStoredMB: 1000,
      dataDownlinkedMB: 50_000,
      commsLinkOk: true,
      temperatureK: 288,
      activeDecisionCard: null,
      eventLog: [],
      outcome: 'pass',
      decisionTimerRemaining: 0,
      totalDecisionsMade: 0,
      fastDecisionsCount: 0,
      totalBurnDeltaVms: 50,
      requiredBurnDeltaVms: 50,
    };

    const score = computeScore(nominalState, expensiveDesign, earthMission);

    expect(score.budgetEfficiency).toBe(0);
  });
});
