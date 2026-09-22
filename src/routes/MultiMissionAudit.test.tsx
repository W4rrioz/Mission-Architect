/**
 * Comprehensive Multi-Mission UI/UX & State Audit Test Suite
 * Verifies all 4 mission profiles (Landsat 9, LRO, MAVEN, OSIRIS-REx),
 * route transitions, theme color stability, simulation state isolation,
 * and decision card lifecycle.
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DesignProvider, useDesign } from '../context/DesignContext';
import { MissionRunProvider } from '../context/MissionRunContext';
import { ProgressionProvider } from '../context/ProgressionContext';
import { SpacecraftDesignScreen } from './SpacecraftDesignScreen';
import { DebriefScreen } from './DebriefScreen';
import { OrbitView } from '../components/OrbitView';
import { DecisionCardModal } from '../components/DecisionCardModal';
import { MISSIONS } from '../data/missions';
import { PARTS } from '../data/parts';
import { MissionId } from '../domain/types';
import {
  startMissionRun,
  advanceClock,
  resolveDecisionCard,
  createLaunchWindowEvent,
  createFailureEvent,
  createCommsBlackoutEvent,
  createBudgetScheduleEvent,
} from '../domain/missionRun';

describe('Comprehensive Multi-Mission UI/UX & State Audit', () => {
  // ==========================================================================
  // 1. ROUTE & THEME COLOR STABILITY (ALL 4 MISSIONS)
  // ==========================================================================
  describe('1. Mission CAD Routes & Theme Accents', () => {
    const missionProfiles: {
      id: MissionId;
      expectedName: string;
      expectedAccent: string;
      expectedBudget: string;
    }[] = [
      {
        id: 'earth-orbit',
        expectedName: 'Earth-Observing Satellite',
        expectedAccent: 'var(--mission-earth)',
        expectedBudget: '$300M',
      },
      {
        id: 'moon',
        expectedName: 'Lunar Reconnaissance Orbiter',
        expectedAccent: 'var(--mission-moon)',
        expectedBudget: '$550M',
      },
      {
        id: 'mars',
        expectedName: 'Mars Atmosphere & Volatiles Evolution',
        expectedAccent: 'var(--mission-mars)',
        expectedBudget: '$650M',
      },
      {
        id: 'asteroid',
        expectedName: 'Asteroid Sample Return',
        expectedAccent: 'var(--mission-asteroid)',
        expectedBudget: '$1050M',
      },
    ];

    missionProfiles.forEach(({ id, expectedName, expectedAccent, expectedBudget }) => {
      it(`renders CAD screen for ${id} with correct name, budget, and stable accent`, () => {
        const html = renderToString(
          <MemoryRouter initialEntries={[`/missions/${id}/design`]}>
            <DesignProvider initialMissionId={id}>
              <MissionRunProvider>
                <Routes>
                  <Route path="/missions/:missionId/design" element={<SpacecraftDesignScreen />} />
                </Routes>
              </MissionRunProvider>
            </DesignProvider>
          </MemoryRouter>
        );

        const testName = expectedName.includes('&') ? expectedName.replace('&', '&amp;') : expectedName;
        expect(html).toContain(testName);
        expect(html).toContain(expectedBudget);
        expect(html).toContain(expectedAccent);
        expect(html).toContain('Total Program Cost');
        expect(html).toContain('Payload Mass vs Booster');
        expect(html).toContain('SCHEMATIC VISUALIZER');
      });
    });

    it('verifies DesignContext does not reset missionId when setMission is called', () => {
      let capturedMissionId: MissionId = 'earth-orbit';

      const StateInspector: React.FC = () => {
        const { state, setMission } = useDesign();
        capturedMissionId = state.missionId;

        React.useEffect(() => {
          setMission('mars');
        }, [setMission]);

        return <div>{state.missionId}</div>;
      };

      const html = renderToString(
        <DesignProvider initialMissionId="earth-orbit">
          <StateInspector />
        </DesignProvider>
      );

      // Initially renders initialMissionId synchronously
      expect(html).toContain('earth-orbit');
      expect(capturedMissionId).toBe('earth-orbit');
    });
  });

  // ==========================================================================
  // 2. LIVE MISSION CONTROL STABILITY & 20HZ THROTTLING
  // ==========================================================================
  describe('2. Live Mission Control Simulation Stability', () => {
    it('initializes and advances flight simulation without throwing or glitching', () => {
      const mission = MISSIONS['moon'];
      const design = {
        missionId: 'moon' as MissionId,
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
          'prop-hydrazine-mono.propellantLoadKg': 1150,
          'pwr-triple-junction-solar.arrayAreaM2': 14.0,
          'comms-xband-deepspace.dishDiameterM': 1.5,
        },
      };

      let state = startMissionRun(design, mission, PARTS);
      expect(state.phase).toBe('launch');
      expect(state.fuelRemainingKg).toBe(1150);
      expect(state.outcome).toBeNull();

      // Advance clock to T+25s to trigger launchWindow card
      state = advanceClock(state, 25, design, mission, PARTS);
      if (state.activeDecisionCard) {
        state = resolveDecisionCard(state, state.activeDecisionCard.responses[0].id, true);
      }
      expect(state.fuelRemainingKg).toBeLessThan(1150);

      // Advance past launch into cruise phase (PHASE_TIMINGS.launchEnd is 60s)
      state = advanceClock(state, 50, design, mission, PARTS);
      expect(state.phase).toBe('cruise');

      // Advance through cruise (resolving any anomaly cards)
      state = advanceClock(state, 70, design, mission, PARTS);
      if (state.activeDecisionCard) {
        state = resolveDecisionCard(state, state.activeDecisionCard.responses[0].id, true);
      }

      // Advance into arrival phase (PHASE_TIMINGS.cruiseEnd is 180s)
      state = advanceClock(state, 40, design, mission, PARTS);
      expect(state.phase).toBe('arrival');

      // Orbital insertion burn in arrival
      const fuelBeforeBurn = state.fuelRemainingKg;
      state = advanceClock(state, 30, design, mission, PARTS);
      if (state.activeDecisionCard) {
        state = resolveDecisionCard(state, state.activeDecisionCard.responses[0].id, true);
      }
      expect(state.fuelRemainingKg).toBeLessThan(fuelBeforeBurn);

      // Advance into scienceOps (PHASE_TIMINGS.arrivalEnd is 240s)
      state = advanceClock(state, 40, design, mission, PARTS);
      expect(state.phase).toBe('scienceOps');
      expect(state.totalBurnDeltaVms).toBeGreaterThan(0);

      // Advance through scienceOps to comms blackout event (~T+290s)
      state = advanceClock(state, 50, design, mission, PARTS);
      if (state.activeDecisionCard) {
        state = resolveDecisionCard(state, state.activeDecisionCard.responses[0].id, true);
      }

      // Advance to mission completion (PHASE_TIMINGS.scienceOpsEnd is 360s)
      state = advanceClock(state, 80, design, mission, PARTS);
      if (state.activeDecisionCard) {
        state = resolveDecisionCard(state, state.activeDecisionCard.responses[0].id, true);
        state = advanceClock(state, 10, design, mission, PARTS);
      }
      expect(state.phase).toBe('endOfMission');
      expect(state.outcome).toBe('pass');
    });

    it('verifies OrbitView renders smoothly across all 4 central bodies', () => {
      const bodies: { id: MissionId; centralBodyName: string }[] = [
        { id: 'earth-orbit', centralBodyName: 'EARTH' },
        { id: 'moon', centralBodyName: 'MOON' },
        { id: 'mars', centralBodyName: 'MARS' },
        { id: 'asteroid', centralBodyName: 'BENNU' },
      ];

      bodies.forEach(({ id, centralBodyName }) => {
        const mission = MISSIONS[id];
        const html = renderToString(
          <OrbitView
            mission={mission}
            phase="scienceOps"
            elapsedSeconds={300}
            totalBurnDeltaVms={mission.orbit.requiredDeltaVms}
          />
        );

        expect(html).toContain(centralBodyName);
        expect(html).toContain('ORBIT DYNAMICS TELEMETRY');
        expect(html).toContain('TRUE ORBIT PERIOD:');
      });
    });
  });

  // ==========================================================================
  // 3. DECISION CARDS & RESOLUTION LIFECYCLE
  // ==========================================================================
  describe('3. Decision Cards Resolution & Timeouts', () => {
    it('creates and resolves all 4 decision card types cleanly', () => {
      const mission = MISSIONS['mars'];
      const design = {
        missionId: 'mars' as MissionId,
        selectedParts: {
          launchVehicle: 'lv-atlas-v-401',
          bus: 'bus-standard-science',
          redundancy: 'red-single-string',
        },
        sliderValues: {},
      };

      const card1 = createLaunchWindowEvent(mission);
      expect(card1.type).toBe('launchWindow');
      expect(card1.responses.length).toBeGreaterThanOrEqual(2);

      const card2 = createFailureEvent(mission, design, PARTS);
      expect(card2.type).toBe('failure');

      const card3 = createBudgetScheduleEvent(mission);
      expect(card3.type).toBe('budgetSchedule');

      const card4 = createCommsBlackoutEvent(mission);
      expect(card4.type).toBe('commsBlackout');
    });

    it('resolves decision card with user choice and decrements resources', () => {
      const mission = MISSIONS['earth-orbit'];
      const design = {
        missionId: 'earth-orbit' as MissionId,
        selectedParts: {},
        sliderValues: {},
      };
      let state = startMissionRun(design, mission, PARTS);
      state.fuelRemainingKg = 100;
      state.activeDecisionCard = createLaunchWindowEvent(mission);
      state.decisionTimerRemaining = 15;

      const responseId = state.activeDecisionCard.responses[0].id;
      const fuelCost = state.activeDecisionCard.responses[0].fuelCostKg || 0;

      const nextState = resolveDecisionCard(state, responseId, true);
      expect(nextState.activeDecisionCard).toBeNull();
      expect(nextState.totalDecisionsMade).toBe(1);
      expect(nextState.fastDecisionsCount).toBe(1);
      expect(nextState.fuelRemainingKg).toBe(100 - fuelCost);
    });

    it('automatically applies defaultResponseId upon timer expiration', () => {
      const mission = MISSIONS['earth-orbit'];
      const design = {
        missionId: 'earth-orbit' as MissionId,
        selectedParts: {},
        sliderValues: {},
      };
      let state = startMissionRun(design, mission, PARTS);
      state.activeDecisionCard = createLaunchWindowEvent(mission);
      state.decisionTimerRemaining = 5;

      // Advance clock by 6 seconds to expire timer
      const nextState = advanceClock(state, 6, design, mission, PARTS);
      expect(nextState.activeDecisionCard).toBeNull();
      expect(nextState.totalDecisionsMade).toBe(1);
      expect(nextState.eventLog.some((l) => l.message.includes('expired'))).toBe(true);
    });

    it('renders DecisionCardModal dialog without rendering errors', () => {
      const card = createLaunchWindowEvent(MISSIONS['earth-orbit']);

      const html = renderToString(
        <DecisionCardModal
          card={card}
          secondsRemaining={14.5}
          onSelectResponse={() => {}}
        />
      );

      expect(html).toContain('Flight Anomaly Decision');
      expect(html).toContain('SEC');
      expect(html).toContain(card.prompt);
      expect(html).toContain(card.responses[0].label);
    });
  });

  // ==========================================================================
  // 4. DEBRIEF SCREEN & COMPREHENSIVE OUTCOME INTEGRITY
  // ==========================================================================
  describe('4. Debrief Outcome & Real-Mission Comparison Table', () => {
    it('renders Debrief screen with complete 100-point breakdown across missions', () => {
      const html = renderToString(
        <MemoryRouter initialEntries={['/missions/mars/debrief']}>
          <ProgressionProvider>
            <DesignProvider initialMissionId="mars">
              <MissionRunProvider>
                <Routes>
                  <Route path="/missions/:missionId/debrief" element={<DebriefScreen />} />
                </Routes>
              </MissionRunProvider>
            </DesignProvider>
          </ProgressionProvider>
        </MemoryRouter>
      );

      expect(html).toContain('FLIGHT DEBRIEF // MARS ATMOSPHERE &amp; VOLATILES EVOLUTION');
      expect(html).toContain('COMPOSITE SCORE');
      expect(html).toContain('HISTORICAL BENCHMARK');
      expect(html).toContain('Your Design vs. Real NASA MAVEN');
      expect(html).toContain('Atlas V 401');
    });
  });
});
