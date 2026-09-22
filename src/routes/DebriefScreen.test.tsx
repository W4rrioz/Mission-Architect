/**
 * Debrief Screen UI Component Tests
 * Source: 06-implementation-plan.md Phase 6, 04-ui-ux-brief.md §6
 *
 * Verifies PASS/FAIL banners, composite score, 5-component breakdown,
 * "What Went Wrong" diagnostic callout, and real-mission comparison table.
 */

import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DesignProvider } from '../context/DesignContext';
import { MissionRunProvider } from '../context/MissionRunContext';
import { DebriefScreen } from './DebriefScreen';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { RealMissionComparisonTable } from '../components/RealMissionComparisonTable';
import { MISSIONS } from '../data/missions';
import { ScoreResult, SpacecraftDesign } from '../domain/types';

describe('Phase 6 — Debrief Screen UI', () => {
  it('renders Debrief Screen with PASS banner, score breakdown, and real NASA comparison', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/missions/earth-orbit/debrief']}>
        <DesignProvider initialMissionId="earth-orbit">
          <MissionRunProvider>
            <Routes>
              <Route path="/missions/:missionId/debrief" element={<DebriefScreen />} />
            </Routes>
          </MissionRunProvider>
        </DesignProvider>
      </MemoryRouter>
    );

    // Banner & Status
    expect(html).toContain('FLIGHT DEBRIEF // EARTH-OBSERVING SATELLITE');
    expect(html).toContain('MISSION SUCCESS — PASS');
    expect(html).toContain('COMPOSITE SCORE');
    expect(html).toContain('/100');

    // 5-Component Score Matrix
    expect(html).toContain('5-Component Evaluation Breakdown');
    expect(html).toContain('Science Return &amp; Telemetry Yield');
    expect(html).toContain('Budget &amp; Cost Efficiency');
    expect(html).toContain('Mission Resilience &amp; Survival');
    expect(html).toContain('Flight Decision Speed');
    expect(html).toContain('Systems Design Efficiency');

    // Real Mission Comparison Table
    expect(html).toContain('HISTORICAL BENCHMARK // REAL NASA MISSION SPECS');
    expect(html).toContain('Your Design vs. Real NASA Landsat 9');
    expect(html).toContain('2,711 kg'); // Landsat 9 real launch mass
    expect(html).toContain('4,300 W'); // Landsat 9 real power
    expect(html).toContain('Atlas V 401'); // Landsat 9 real launch vehicle

    // Action CTAs
    expect(html).toContain('Retry Mission');
    expect(html).toContain('Mission Catalog');
  });

  it('renders ScoreBreakdown with correct max points and percentage bars', () => {
    const sampleScore: ScoreResult = {
      outcome: 'pass',
      total: 88,
      scienceReturn: 36,
      budgetEfficiency: 16,
      resilience: 18,
      decisionSpeed: 10,
      designEfficiency: 8,
      whatWentWrong: null,
    };

    const html = renderToString(<ScoreBreakdown score={sampleScore} />);

    expect(html).toContain('88 / 100');
    expect(html).toContain('36');
    expect(html).toContain('/ 40 PTS');
    expect(html).toContain('16');
    expect(html).toContain('/ 20 PTS');
    expect(html).toContain('18');
    expect(html).toContain('/ 20 PTS');
    expect(html).toContain('10');
    expect(html).toContain('/ 10 PTS');
    expect(html).toContain('8');
    expect(html).toContain('/ 10 PTS');
  });

  it('renders RealMissionComparisonTable for Moon (LRO) with exact Section 8 numbers', () => {
    const moonMission = MISSIONS['moon'];
    const mockDesign: SpacecraftDesign = {
      missionId: 'moon',
      selectedParts: {
        launchVehicle: 'lv-atlas-v-401',
        bus: 'bus-standard-science',
      },
      sliderValues: {},
      derived: {
        massKg: { current: 1800, limit: 9800, percentage: 18.4, isOver: false },
        powerW: { current: 300, limit: 900, percentage: 33.3, isOver: false },
        costUSD: { current: 420_000_000, limit: 550_000_000, percentage: 76.4, isOver: false },
        deltaVms: { current: 1300, limit: 1270, percentage: 102.4, isOver: false },
        linkMarginDb: { current: 6.2, limit: 0, percentage: 31, isOver: false },
        thermalEquilibriumK: { current: 270, minLimit: 170, maxLimit: 340, isSafe: true },
        reliabilityEstimate: 0.95,
      },
    };

    const html = renderToString(
      <RealMissionComparisonTable mission={moonMission} design={mockDesign} />
    );

    expect(html).toContain('Your Design vs. Real NASA LRO');
    expect(html).toContain('1,846 kg'); // LRO real launch mass from 07-domain-reference.md §8
    expect(html).toContain('949 kg'); // LRO real dry mass
    expect(html).toContain('824 W'); // LRO real power
    expect(html).toContain('1,270 m/s'); // LRO real required Δv
    expect(html).toContain('Atlas V 401'); // LRO real launch vehicle
    expect(html).toContain('Goddard Space Flight Center LRO Δv budget memo'); // Source note
  });
});
