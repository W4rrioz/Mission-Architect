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

      {/* Screen Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
          <Compass size={18} />
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            MISSION ARCHIVES // CAMPAIGN SELECT
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Select Flight Mission</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Select an authentic planetary destination to configure systems CAD, review flight readiness, and pilot live mission operations.
        </p>
      </div>

      {/* 4 Cards Responsive Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-5)',
        }}
      >
        {missionList.map((m) => {
          const unlocked = isMissionUnlocked(m.id);
          const tint = getMissionTint(m.id);

          return (
            <div
              key={m.id}
              style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${unlocked ? 'var(--border-subtle)' : 'rgba(42, 51, 80, 0.4)'}`,
                borderTop: `4px solid ${tint}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                opacity: unlocked ? 1 : 0.65,
                position: 'relative',
                boxShadow: unlocked ? '0 4px 16px rgba(0, 0, 0, 0.2)' : undefined,
                transition: 'transform 150ms ease, border-color 150ms ease',
              }}
            >
              <div>
                {/* Card Header: Difficulty & Lock Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < m.difficulty ? tint : 'transparent'}
                        color={i < m.difficulty ? tint : 'var(--border-subtle)'}
                      />
                    ))}
                    <span
                      className="number-mono"
                      style={{ fontSize: '0.7rem', color: tint, fontWeight: 700, marginLeft: '6px' }}
                    >
                      {`TIER ${m.difficulty}`}
                    </span>
                  </div>

                  {!unlocked && (
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

                {/* Mission Name & Reference */}
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.25 }}>
                  {m.name}
                </h2>
                <div style={{ fontSize: '0.8rem', color: tint, fontWeight: 700, marginTop: '2px' }}>
                  {`Inspired by NASA ${m.realMission.name}`}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 'var(--space-2)', lineHeight: 1.45 }}>
                  {m.objective}
                </p>

                {/* Key Spec Badges */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--space-2)',
                    marginTop: 'var(--space-3)',
                    fontSize: '0.75rem',
                  }}
                  className="number-mono"
                >
                  <span style={{ background: 'var(--bg-base)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    {`Budget: $${(m.budgetCapUSD / 1_000_000).toFixed(0)}M`}
                  </span>
                  <span style={{ background: 'var(--bg-base)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    {`Δv: ${m.orbit.requiredDeltaVms} m/s`}
                  </span>
                  {personalBests[m.id] && (
                    <span
                      style={{
                        background: 'rgba(61, 190, 122, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--status-good)',
                        color: 'var(--status-good)',
                        fontWeight: 700,
                      }}
                    >
                      {`★ Best: ${personalBests[m.id]?.score}/100`}
                    </span>
                  )}
                </div>
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
