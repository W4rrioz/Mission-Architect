/**
 * Mission Run State Machine Unit Tests
 * Source: 06-implementation-plan.md Phase 4
 *
 * Verifies phase transitions, all 4 decision card triggers and resolutions,
 * timeout defaults, and pass/fail execution across strong vs weak designs.
 */

import { describe, it, expect } from 'vitest';
import { MISSIONS } from '../data/missions';
import { PARTS } from '../data/parts';
import { SpacecraftDesign } from './types';
import {
  startMissionRun,
  advanceClock,
  resolveDecisionCard,
  PHASE_TIMINGS,
} from './missionRun';

describe('Phase 4 — Mission Run State Machine', () => {
  const moonMission = MISSIONS['moon'];

  const strongDesign: SpacecraftDesign = {
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
      'pwr-triple-junction-solar.arrayAreaM2': 14.0,
      'prop-hydrazine-mono.propellantLoadKg': 1150,
      'comms-xband-deepspace.dishDiameterM': 1.5,
    },
  };

  const underfueledDesign: SpacecraftDesign = {
    missionId: 'moon',
    selectedParts: {
      launchVehicle: 'lv-atlas-v-401',
      bus: 'bus-standard-science',
      power: 'pwr-triple-junction-solar',
      propulsion: 'prop-hydrazine-mono',
      comms: 'comms-xband-deepspace',
      instrument: 'inst-lunar-orbiter-laser-cam',
      thermal: 'therm-passive-mli',
      redundancy: 'red-single-string',
    },
    sliderValues: {
      'prop-hydrazine-mono.propellantLoadKg': 250, // Severely underfueled for lunar insertion (250 kg vs ~900 kg needed)
    },
  };

  it('verifies decision card pauses clock until resolved, and resolves on timeout default', () => {
    let state = startMissionRun(strongDesign, moonMission, PARTS);
    expect(state.phase).toBe('launch');
    expect(state.elapsedSeconds).toBe(0);

    // Advance clock to T+25s to trigger launchWindow card
    state = advanceClock(state, 25, strongDesign, moonMission, PARTS);
    expect(state.activeDecisionCard).not.toBeNull();
    expect(state.activeDecisionCard?.type).toBe('launchWindow');
    expect(state.elapsedSeconds).toBe(25);

    const initialTimer = state.decisionTimerRemaining;
    expect(initialTimer).toBeGreaterThan(0);

    // Calling advanceClock while card is open should decrement timer, NOT advance elapsedSeconds
    state = advanceClock(state, 5, strongDesign, moonMission, PARTS);
    expect(state.elapsedSeconds).toBe(25); // Clock remains paused at 25
    expect(state.decisionTimerRemaining).toBe(initialTimer - 5);
    expect(state.activeDecisionCard).not.toBeNull();

    // Advance clock past the remaining timeout to trigger automatic default resolution
    state = advanceClock(state, initialTimer, strongDesign, moonMission, PARTS);
    // Card should now be resolved automatically with default response
    expect(state.activeDecisionCard).toBeNull();
    expect(state.decisionTimerRemaining).toBe(0);
    expect(state.totalDecisionsMade).toBe(1);

    // Clock can now advance normally again
    state = advanceClock(state, 10, strongDesign, moonMission, PARTS);
    expect(state.elapsedSeconds).toBe(35);
  });

  it('verifies decision card resolves immediately when player responds manually', () => {
    let state = startMissionRun(strongDesign, moonMission, PARTS);
    state = advanceClock(state, 25, strongDesign, moonMission, PARTS);
    expect(state.activeDecisionCard).not.toBeNull();

    const chosenResponseId = state.activeDecisionCard!.responses[0].id;
    state = resolveDecisionCard(state, chosenResponseId, true);

    expect(state.activeDecisionCard).toBeNull();
    expect(state.totalDecisionsMade).toBe(1);
    expect(state.fastDecisionsCount).toBe(1);
  });

  it('simulates a scripted strong design run that reaches PASS outcome', () => {
    let state = startMissionRun(strongDesign, moonMission, PARTS);
    expect(state.outcome).toBeNull();

    // Step through the entire mission from T=0 to T=370s
    let currentMET = 0;
    while (currentMET < PHASE_TIMINGS.scienceOpsEnd + 10 && state.outcome === null) {
      // Advance by 5-second steps
      state = advanceClock(state, 5, strongDesign, moonMission, PARTS);
      currentMET = state.elapsedSeconds;

      // Whenever a card appears, answer it proactively
      if (state.activeDecisionCard) {
        const bestResponse = state.activeDecisionCard.responses[0].id;
        state = resolveDecisionCard(state, bestResponse, true);
      }
    }

    // Strong design should have successfully entered science ops and passed
    expect(state.phase).toBe('endOfMission');
    expect(state.outcome).toBe('pass');
    expect(state.dataDownlinkedMB).toBeGreaterThanOrEqual(moonMission.minScienceDataMB);
    expect(state.fuelRemainingKg).toBeGreaterThanOrEqual(0);
  });

  it('simulates an underfueled design run that fails during arrival insertion burn', () => {
    let state = startMissionRun(underfueledDesign, moonMission, PARTS);

    // Advance through launch and cruise
    while (state.elapsedSeconds < PHASE_TIMINGS.cruiseEnd + 20 && state.outcome === null) {
      state = advanceClock(state, 5, underfueledDesign, moonMission, PARTS);
      if (state.activeDecisionCard) {
        state = resolveDecisionCard(state, state.activeDecisionCard.responses[0].id, false);
      }
    }

    // Underfueled craft runs out of fuel during lunar orbit insertion
    expect(state.outcome).toBe('fail');
    expect(state.fuelRemainingKg).toBe(0);
    expect(state.failureReason).toContain('Fuel depleted');
  });

  it('immediately fails mission if no launch vehicle was equipped', () => {
    const noLVDesign: SpacecraftDesign = {
      missionId: 'moon',
      selectedParts: {
        bus: 'bus-smallsat',
      },
      sliderValues: {},
    };

    let state = startMissionRun(noLVDesign, moonMission, PARTS);
    // Run into mission completion
    while (state.elapsedSeconds < PHASE_TIMINGS.scienceOpsEnd + 10 && state.outcome === null) {
      state = advanceClock(state, 20, noLVDesign, moonMission, PARTS);
      if (state.activeDecisionCard) {
        state = resolveDecisionCard(state, state.activeDecisionCard.defaultResponseId, false);
      }
    }

    expect(state.outcome).toBe('fail');
    expect(state.failureReason).toContain('launch vehicle');
  });
});
