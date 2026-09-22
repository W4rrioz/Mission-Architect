import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';

describe('Phase 0 - Route Reachability', () => {
  const routesToTest = [
    { path: '/', expectedTexts: ['MISSION ARCHITECT', 'NASA Space Apps Challenge'] },
    { path: '/missions', expectedTexts: ['Select Flight Mission', 'Landsat 9', 'LRO', 'MAVEN', 'OSIRIS-REx'] },
    { path: '/missions/earth-orbit/briefing', expectedTexts: ['OPERATIONAL FLIGHT DIRECTIVE', 'Earth-Observing Satellite'] },
    { path: '/missions/earth-orbit/design', expectedTexts: ['SYSTEM INTEGRATION', 'HARDWARE CAD', 'Earth-Observing Satellite'] },
    { path: '/missions/earth-orbit/preflight', expectedTexts: ['FLIGHT READINESS REVIEW', 'Pre-flight Review: Earth-Observing Satellite'] },
    { path: '/missions/earth-orbit/control', expectedTexts: ['LIVE FLIGHT OPERATIONS', 'EARTH-OBSERVING SATELLITE'] },
    { path: '/missions/earth-orbit/debrief', expectedTexts: ['MISSION SUCCESS — PASS', 'HISTORICAL BENCHMARK', 'Landsat 9'] },
    { path: '/random-unknown-path', expectedTexts: ['404 — Trajectory Lost'] }
  ];

  for (const { path, expectedTexts } of routesToTest) {
    it(`renders route ${path} and displays expected content`, () => {
      const html = renderToString(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      );
      for (const text of expectedTexts) {
        expect(html).toContain(text);
      }
    });
  }
});
