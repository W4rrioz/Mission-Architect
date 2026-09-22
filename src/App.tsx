import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { TitleScreen } from './routes/TitleScreen';
import { MissionSelectScreen } from './routes/MissionSelectScreen';
import { MissionBriefingScreen } from './routes/MissionBriefingScreen';
import { SpacecraftDesignScreen } from './routes/SpacecraftDesignScreen';
import { PreflightReviewScreen } from './routes/PreflightReviewScreen';
import { LiveMissionControlScreen } from './routes/LiveMissionControlScreen';
import { DebriefScreen } from './routes/DebriefScreen';
import { NotFoundScreen } from './routes/NotFoundScreen';

import { DesignProvider } from './context/DesignContext';
import { MissionRunProvider } from './context/MissionRunContext';
import { ProgressionProvider } from './context/ProgressionContext';
import { Logo } from './components/Logo';

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <ProgressionProvider>
      <DesignProvider initialMissionId="earth-orbit">
        <MissionRunProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <a href="#main-content" className="skip-link">
              Skip to Main Content
            </a>

            {/* Top Navigation Bar with Official Logo (Hidden on Title Screen) */}
            {location.pathname !== '/' && (
              <header
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'rgba(19, 26, 48, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '8px var(--space-4)',
                  position: 'sticky',
                  top: 0,
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    maxWidth: 'var(--max-content-width)',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Link to="/missions" style={{ textDecoration: 'none' }} title="Return to Mission Catalog">
                    <Logo size="sm" showSubtitle={false} />
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Link
                      to="/missions"
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                      }}
                    >
                      Campaign Catalog
                    </Link>
                  </div>
                </div>
              </header>
            )}

            <main id="main-content" tabIndex={-1} style={{ flex: 1, outline: 'none' }}>
          <Routes>
            <Route path="/" element={<TitleScreen />} />
            <Route path="/missions" element={<MissionSelectScreen />} />
            <Route path="/missions/:missionId/briefing" element={<MissionBriefingScreen />} />
            <Route path="/missions/:missionId/design" element={<SpacecraftDesignScreen />} />
            <Route path="/missions/:missionId/preflight" element={<PreflightReviewScreen />} />
            <Route path="/missions/:missionId/control" element={<LiveMissionControlScreen />} />
            <Route path="/missions/:missionId/debrief" element={<DebriefScreen />} />
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </main>

      </div>
        </MissionRunProvider>
      </DesignProvider>
    </ProgressionProvider>
  );
};
