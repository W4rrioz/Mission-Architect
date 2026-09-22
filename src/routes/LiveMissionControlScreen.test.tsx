/**
 * Live Mission Control Screen UI Component Tests
 * Verifies live telemetry gauges, orbit view, flight deck controls,
 * time warp buttons, event log, and decision card modal presentation.
 */

import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DesignProvider } from '../context/DesignContext';
import { MissionRunProvider } from '../context/MissionRunContext';
import { LiveMissionControlScreen } from './LiveMissionControlScreen';
import { DecisionCardModal } from '../components/DecisionCardModal';
import { OrbitView } from '../components/OrbitView';
import { MISSIONS } from '../data/missions';
import { DecisionCard } from '../domain/types';

describe('Phase 5 — Live Mission Control UI', () => {
  it('renders Live Mission Control console for Earth Orbit mission', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/missions/earth-orbit/control']}>
        <DesignProvider initialMissionId="earth-orbit">
          <MissionRunProvider>
            <Routes>
              <Route path="/missions/:missionId/control" element={<LiveMissionControlScreen />} />
            </Routes>
          </MissionRunProvider>
        </DesignProvider>
      </MemoryRouter>
    );

    // Header telemetry & clock
    expect(html).toContain('LIVE FLIGHT OPERATIONS // EARTH-OBSERVING SATELLITE');
    expect(html).toContain('PHASE:');
    expect(html).toContain('T+ 00:00');

    // Speed warp controls
    expect(html).toContain('1x');
    expect(html).toContain('2x');
    expect(html).toContain('5x');

    // 2D Orbit View
    expect(html).toContain('ORBIT DYNAMICS TELEMETRY');
    expect(html).toContain('EARTH // Sun-synchronous orbit (SSO)');
    expect(html).toContain('99 min');

    // Tactical flight deck controls
    expect(html).toContain('TACTICAL FLIGHT DECK CONTROLS');
    expect(html).toContain('Payload Imager');
    expect(html).toContain('DSN Link Transmit');

    // Live Gauges
    expect(html).toContain('Propellant Remaining');
    expect(html).toContain('Science Data Downlinked');
    expect(html).toContain('Power Generation Balance');
    expect(html).toContain('Onboard Data Buffer');

    // Flight Recorder
    expect(html).toContain('FLIGHT RECORDER &amp; TELEMETRY LOG');
  });

  it('renders Live Mission Control for Mars (MAVEN) with correct orbit period and regime', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/missions/mars/control']}>
        <DesignProvider initialMissionId="mars">
          <MissionRunProvider>
            <Routes>
              <Route path="/missions/:missionId/control" element={<LiveMissionControlScreen />} />
            </Routes>
          </MissionRunProvider>
        </DesignProvider>
      </MemoryRouter>
    );

    expect(html).toContain('LIVE FLIGHT OPERATIONS // MARS ATMOSPHERE &amp; VOLATILES EVOLUTION');
    expect(html).toContain('MARS // Elliptical Mars orbit');
    expect(html).toContain('270 min'); // 4.5 hours = 270 minutes from 07-domain-reference.md §2
  });

  it('renders 2D OrbitView with accurate altitude and burn delta-v', () => {
    const mission = MISSIONS['moon'];
    const html = renderToString(
      <OrbitView
        mission={mission}
        phase="cruise"
        elapsedSeconds={120}
        totalBurnDeltaVms={850}
      />
    );

    expect(html).toContain('MOON // Polar lunar mapping orbit');
    expect(html).toContain('113.5 min');
    expect(html).toContain('ALTITUDE:');
    expect(html).toContain('50 km');
    expect(html).toContain('850 m/s');
    expect(html).toContain('CRUISE PHASE ACTIVE');
  });

  it('renders DecisionCardModal with timer, prompt, responses, and resource cost tags', () => {
    const sampleCard: DecisionCard = {
      id: 'test-card-1',
      type: 'failure',
      prompt: 'Attitude control reaction wheel anomaly detected. High gyro drift rate.',
      timeoutSeconds: 20,
      defaultResponseId: 'resp-safemode',
      responses: [
        {
          id: 'resp-rcs',
          label: 'Switch to RCS Thruster Control',
          description: 'Uses auxiliary cold-gas thrusters to hold orientation.',
          fuelCostKg: 15,
        },
        {
          id: 'resp-safemode',
          label: 'Default Safe Mode Drift',
          description: 'Spin down wheel and coast passively.',
          powerCostW: 10,
          dataLossMB: 50,
        },
      ],
    };

    const html = renderToString(
      <DecisionCardModal
        card={sampleCard}
        secondsRemaining={14.2}
        onSelectResponse={() => {}}
      />
    );

    expect(html).toContain('TACTICAL EVENT // FAILURE');
    expect(html).toContain('Flight Anomaly Decision');
    expect(html).toContain('Attitude control reaction wheel anomaly detected');
    expect(html).toContain('[1] Switch to RCS Thruster Control');
    expect(html).toContain('-15 kg Fuel');
    expect(html).toContain('[2] Default Safe Mode Drift');
    expect(html).toContain('-10 W Power');
    expect(html).toContain('-50 MB Data');
    expect(html).toContain('TIMEOUT DEFAULT');
    expect(html).toContain('15'); // Math.ceil(14.2)
  });
});
