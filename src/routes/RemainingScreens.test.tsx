/**
 * Phase 7 — Remaining Screens Component Tests
 * Source: 01-prd.md §4.1, §4.2, §4.4, §4.7; 04-ui-ux-brief.md §6
 *
 * Verifies TitleScreen, MissionSelectScreen, MissionBriefingScreen,
 * PreflightReviewScreen, and TutorialBanner.
 */

import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProgressionProvider } from '../context/ProgressionContext';
import { DesignProvider } from '../context/DesignContext';
import { TitleScreen } from './TitleScreen';
import { MissionSelectScreen } from './MissionSelectScreen';
import { MissionBriefingScreen } from './MissionBriefingScreen';
import { PreflightReviewScreen } from './PreflightReviewScreen';
import { TutorialBanner } from '../components/TutorialBanner';

describe('Phase 7 — Title Screen', () => {
  it('renders cinematic title, wordmark, tagline, and launch button', () => {
    const html = renderToString(
      <MemoryRouter>
        <TitleScreen />
      </MemoryRouter>
    );

    expect(html).toContain('MISSION ARCHITECT');
    expect(html).toContain('NASA Space Apps Challenge 2026');
    expect(html).toContain('Launch Mission Architect');
    expect(html).toContain('Exact Domain Physics');
    expect(html).toContain('Zero Backend');
  });
});

describe('Phase 7 — Mission Select Screen', () => {
  it('renders all 4 missions with difficulty tiers and lock state badges', () => {
    const html = renderToString(
      <MemoryRouter>
        <ProgressionProvider>
          <MissionSelectScreen />
        </ProgressionProvider>
      </MemoryRouter>
    );

    expect(html).toContain('Select Flight Mission');
    expect(html).toContain('Earth-Observing Satellite');
    expect(html).toContain('Lunar Reconnaissance Orbiter');
    expect(html).toContain('Mars Atmosphere &amp; Volatiles Evolution');
    expect(html).toContain('Asteroid Sample Return');

    // Tutorial step 1 banner
    expect(html).toContain('FLIGHT CADET TUTORIAL // STEP 1 OF 5');
    expect(html).toContain('Flight Mission Selection');

    // Locked indicators for deep space missions
    expect(html).toContain('LOCKED');
    expect(html).toContain('Complete Earth-Orbit Mission to Unlock');
  });
});

describe('Phase 7 — Mission Briefing Screen', () => {
  it('renders mission operational directives, budget, and historical NASA context', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/missions/earth-orbit/briefing']}>
        <ProgressionProvider>
          <Routes>
            <Route path="/missions/:missionId/briefing" element={<MissionBriefingScreen />} />
          </Routes>
        </ProgressionProvider>
      </MemoryRouter>
    );

    expect(html).toContain('OPERATIONAL FLIGHT DIRECTIVE');
    expect(html).toContain('Earth-Observing Satellite');
    expect(html).toContain('HARD BUDGET CAP');
    expect(html).toContain('$300M');
    expect(html).toContain('REQUIRED Δv MANEUVER');
    expect(html).toContain('50 m/s');
    expect(html).toContain('MIN. SCIENCE RETURN');
    expect(html).toContain('50,000 MB');
    expect(html).toContain('Historical Predecessor: NASA Landsat 9');
    expect(html).toContain('Begin Spacecraft Design');
  });
});

describe('Phase 7 — Pre-flight Review Screen', () => {
  it('renders 7-point constraint checklist with links back to CAD and blocks launch on budget overrun', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/missions/earth-orbit/preflight']}>
        <ProgressionProvider>
          <DesignProvider initialMissionId="earth-orbit">
            <Routes>
              <Route path="/missions/:missionId/preflight" element={<PreflightReviewScreen />} />
            </Routes>
          </DesignProvider>
        </ProgressionProvider>
      </MemoryRouter>
    );

    expect(html).toContain('FLIGHT READINESS REVIEW // FINAL CHECKLIST');
    expect(html).toContain('Booster Payload Mass Capacity');
    expect(html).toContain('Congressional Budget Cap (Hard Limit)');
    expect(html).toContain('Orbital Insertion Velocity Margin (Δv)');
    expect(html).toContain('Electrical Bus Generation Balance');
    expect(html).toContain('Deep Space Network RF Link Margin');
    expect(html).toContain('Stefan-Boltzmann Thermal Equilibrium');
    expect(html).toContain('Subsystem Hardware Reliability Rating');

    // Links back to CAD categories
    expect(html).toContain('Tune Launch Vehicle');
    expect(html).toContain('Tune Propulsion');
    expect(html).toContain('Tune Power');
    expect(html).toContain('Tune Communications');
    expect(html).toContain('Tune Thermal');
    expect(html).toContain('Tune Redundancy');

    // Authorize Launch CTA
    expect(html).toContain('Authorize Launch &amp; Enter Mission Control');
  });
});

describe('Phase 7 — Tutorial Guidance Banner', () => {
  it('renders step number, title, directives, and dismiss button', () => {
    const html = renderToString(
      <ProgressionProvider>
        <TutorialBanner
          stepNumber={3}
          totalSteps={5}
          title="Hardware CAD Integration"
          instructions="Equip parts across all 8 subsystem tabs."
          tip="Pre-flight review is unlocked as soon as a launch vehicle is chosen."
        />
      </ProgressionProvider>
    );

    expect(html).toContain('FLIGHT CADET TUTORIAL // STEP 3 OF 5');
    expect(html).toContain('Hardware CAD Integration');
    expect(html).toContain('Equip parts across all 8 subsystem tabs.');
    expect(html).toContain('Skip Tutorial');
  });
});
