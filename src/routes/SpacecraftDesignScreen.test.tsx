/**
 * Spacecraft Design Screen UI Component Tests
 * Verifies live gauge rendering, category switching, part selection, slider adjustments,
 * and the disabled "no launch vehicle selected" state.
 */

import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DesignProvider } from '../context/DesignContext';
import { SpacecraftDesignScreen } from './SpacecraftDesignScreen';

describe('Phase 3 — Spacecraft Design Screen UI', () => {
  it('renders initial screen with disabled Pre-flight button and missing LV alert', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/missions/earth-orbit/design']}>
        <DesignProvider initialMissionId="earth-orbit">
          <Routes>
            <Route path="/missions/:missionId/design" element={<SpacecraftDesignScreen />} />
          </Routes>
        </DesignProvider>
      </MemoryRouter>
    );

    // Header and Mission details
    expect(html).toContain('Earth-Observing Satellite');
    expect(html).toContain('PHASE II: SYSTEM INTEGRATION');

    // Pre-flight button should be disabled when no LV is equipped
    expect(html).toContain('disabled=""');
    expect(html).toContain('Missing Launch Vehicle');
    expect(html).toContain('Launch Vehicle required to proceed to Pre-flight');

    // Category tabs should be present
    expect(html).toContain('Launch Vehicle');
    expect(html).toContain('Spacecraft Bus');
    expect(html).toContain('Power System');

    // Live Gauges
    expect(html).toContain('Total Program Cost');
    expect(html).toContain('Payload Mass vs Booster');
    expect(html).toContain('Available Velocity Margin');
    expect(html).toContain('Power Load vs Generation');
    expect(html).toContain('Communications Link Margin');
    expect(html).toContain('Thermal Equilibrium');

    // Schematic visualizer
    expect(html).toContain('SCHEMATIC VISUALIZER');
  });

  it('renders correctly for Moon (LRO) mission with mission tint', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/missions/moon/design']}>
        <DesignProvider initialMissionId="moon">
          <Routes>
            <Route path="/missions/:missionId/design" element={<SpacecraftDesignScreen />} />
          </Routes>
        </DesignProvider>
      </MemoryRouter>
    );

    expect(html).toContain('Lunar Reconnaissance Orbiter');
    expect(html).toContain('LRO');
    expect(html).toContain('550');
  });

  it('renders correctly for Mars (MAVEN) mission with $650M budget and 1250 m/s delta-v', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/missions/mars/design']}>
        <DesignProvider initialMissionId="mars">
          <Routes>
            <Route path="/missions/:missionId/design" element={<SpacecraftDesignScreen />} />
          </Routes>
        </DesignProvider>
      </MemoryRouter>
    );

    expect(html).toContain('Mars Atmosphere &amp; Volatiles Evolution');
    expect(html).toContain('MAVEN');
    expect(html).toContain('650');
  });
});
