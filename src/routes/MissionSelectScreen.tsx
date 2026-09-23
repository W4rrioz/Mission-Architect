/**
 * Mission Select Screen
 * Source: 01-prd.md §4.1, 04-ui-ux-brief.md §6
 *
 * Displays the 4 campaign mission profiles in a responsive grid.
 * Integrates mission unlock logic and tutorial guidance banner.
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MISSIONS } from '../data/missions';
import { MissionId } from '../domain/types';
import { useProgression } from '../context/ProgressionContext';
import { TutorialBanner } from '../components/TutorialBanner';
import { Compass, ArrowRight, Lock, Star, ChevronLeft } from 'lucide-react';
import { getAllPersonalBests } from '../domain/personalBest';

export const MissionSelectScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMissionUnlocked } = useProgression();
  const personalBests = getAllPersonalBests();

  const missionList = Object.values(MISSIONS);

  const getMissionTint = (id: MissionId) => {
    switch (id) {
      case 'moon':
        return 'var(--mission-moon)';
      case 'mars':
        return 'var(--mission-mars)';
      case 'asteroid':
        return 'var(--mission-asteroid)';
      default:
        return 'var(--mission-earth)';
    }
  };

  return (
    <div
      style={{
        maxWidth: 'var(--max-content-width)',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-4) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      {/* Tutorial Guidance Step 1 */}
      <TutorialBanner
        stepNumber={1}
        title="Flight Mission Selection"
        instructions="Welcome to Mission Architect. Select the Earth-Observing Satellite to begin your flight certification tutorial. Successfully finishing your initial flight will unlock lunar, Martian, and deep-space asteroid missions."
        tip="Earth-orbit features relaxed timers and guided hardware constraints."
      />

      {/* Screen Header with Certified Counter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--mission-earth)' }}>
            <Compass size={18} />
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              CATALOG // SELECT TARGET FLIGHT REGIME
            </span>
          </div>
          <div
            className="tier-pill"
            style={{
              borderColor: 'var(--border-hairline)',
              background: 'var(--panel-elevated)',
              color: 'var(--text-muted)',
            }}
          >
            <span className="status-led good" style={{ width: '6px', height: '6px' }} />
            <span>CERTIFIED PROFILES: {Object.keys(personalBests).length} / 4</span>
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
          Select Flight Mission
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Select an authentic planetary destination to configure systems CAD, review flight readiness, and pilot live mission operations.
        </p>
      </div>

      {/* 4 Cards Responsive Bento Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-5)',
        }}
      >
        {missionList.map((m) => {
          const unlocked = isMissionUnlocked(m.id);
          const tint = getMissionTint(m.id);

          const tierLabels: Record<MissionId, string> = {
            'earth-orbit': 'TIER 1 // SUN-SYNCHRONOUS',
            'moon': 'TIER 2 // LUNAR POLAR',
            'mars': 'TIER 3 // MARS HIGH-ELLIPTIC',
            'asteroid': 'TIER 4 // DEEP SPACE SAMPLE RETURN',
          };

          return (
            <div
              key={m.id}
              className="hud-panel"
              style={{
                borderTop: `4px solid ${tint}`,
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                opacity: unlocked ? 1 : 0.65,
                position: 'relative',
                boxShadow: unlocked ? '0 8px 24px rgba(0, 0, 0, 0.3)' : undefined,
                transition: 'transform 150ms ease, border-color 150ms ease',
              }}
            >
              <div>
                {/* Card Header: Tier Badge & Lock Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <span
                    className="tier-pill"
                    style={{
                      borderColor: `${tint}40`,
                      background: `${tint}15`,
                      color: tint,
                    }}
                  >
                    {tierLabels[m.id]}
                  </span>

                  {unlocked ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--status-good)', fontFamily: 'var(--font-mono)' }}>
                      <span className="status-led good" style={{ width: '6px', height: '6px' }} />
                      <span>UNLOCKED</span>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(224, 69, 61, 0.15)',
                        border: '1px solid rgba(224, 69, 61, 0.4)',
                        borderRadius: 'var(--radius-full)',
                        padding: '2px 8px',
                        color: 'var(--status-critical)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      <Lock size={12} />
                      <span>LOCKED</span>
                    </div>
                  )}
                </div>

                {/* Mission Visual & Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-2)' }}>
                  {m.id === 'mars' ? (
                    <img
                      src="/assets/stitch/maven-insignia.png"
                      alt="MAVEN Mission Insignia"
                      width={44}
                      height={44}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'contain',
                        background: 'var(--panel-elevated)',
                        border: '1px solid var(--border-hairline)',
                        padding: '2px',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--panel-elevated)',
                        border: '1px solid var(--border-hairline)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tint,
                        flexShrink: 0,
                      }}
                    >
                      <Star size={22} color={tint} />
                    </div>
                  )}

                  <div>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {m.name}
                    </h2>
                    <div style={{ fontSize: '0.75rem', color: tint, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {`Inspired by NASA ${m.realMission.name}`}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 'var(--space-2) 0', lineHeight: 1.45 }}>
                  {m.objective}
                </p>

                {/* Technical Monospace Specs Matrix Grid */}
                <div className="specs-matrix" style={{ marginTop: 'var(--space-3)' }}>
                  <div>
                    <span className="specs-matrix-item-label">BUDGET</span>
                    <span className="specs-matrix-item-val">{`$${(m.budgetCapUSD / 1_000_000).toFixed(0)}M`}</span>
                  </div>
                  <div>
                    <span className="specs-matrix-item-label">REQUIRED Δv</span>
                    <span className="specs-matrix-item-val">{`${m.orbit.requiredDeltaVms} m/s`}</span>
                  </div>
                  <div>
                    <span className="specs-matrix-item-label">SCIENCE DATA</span>
                    <span className="specs-matrix-item-val">{`${m.minScienceDataMB.toLocaleString()} MB`}</span>
                  </div>
                </div>

                {personalBests[m.id] && (
                  <div
                    style={{
                      marginTop: 'var(--space-2)',
                      padding: '4px 8px',
                      background: 'rgba(61, 190, 122, 0.1)',
                      border: '1px solid var(--status-good)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.75rem',
                      color: 'var(--status-good)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <span>★ PERSONAL BEST:</span>
                    <span style={{ fontWeight: 700 }}>{personalBests[m.id]?.score}/100</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {unlocked ? (
                <button
                  className="primary"
                  onClick={() => navigate(`/missions/${m.id}/briefing`)}
                  style={{
                    width: '100%',
                    backgroundColor: tint,
                    borderColor: tint,
                    color: 'var(--bg-base)',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    boxShadow: `0 4px 12px ${tint}33`,
                  }}
                >
                  <span>Select Mission</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Complete Earth-Orbit Mission to Unlock
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ChevronLeft size={16} />
          <span>Return to Title Screen</span>
        </Link>
      </div>
    </div>
  );
};
