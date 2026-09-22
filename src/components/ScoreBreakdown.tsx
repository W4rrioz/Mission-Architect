/**
 * Score Breakdown Component
 * Source: 04-ui-ux-brief.md §6
 *
 * Renders the 5 score components as animated horizontal bars:
 * 1. Science Return (0–40 pts)
 * 2. Budget Efficiency (0–20 pts)
 * 3. Mission Resilience (0–20 pts)
 * 4. Flight Decision Speed (0–10 pts)
 * 5. Systems Design Efficiency (0–10 pts)
 */

import React from 'react';
import { ScoreResult } from '../domain/types';
import { Database, DollarSign, Shield, Zap, SlidersHorizontal } from 'lucide-react';

export interface ScoreBreakdownProps {
  score: ScoreResult;
}

interface ComponentItem {
  id: string;
  label: string;
  points: number;
  maxPoints: number;
  icon: React.ReactNode;
  description: string;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ score }) => {
  const components: ComponentItem[] = [
    {
      id: 'scienceReturn',
      label: 'Science Return & Telemetry Yield',
      points: score.scienceReturn,
      maxPoints: 40,
      icon: <Database size={16} />,
      description: 'Volume of scientific payload telemetry successfully collected and downlinked.',
    },
    {
      id: 'budgetEfficiency',
      label: 'Budget & Cost Efficiency',
      points: score.budgetEfficiency,
      maxPoints: 20,
      icon: <DollarSign size={16} />,
      description: 'Financial discipline and margin preserved below the mission budget cap.',
    },
    {
      id: 'resilience',
      label: 'Mission Resilience & Survival',
      points: score.resilience,
      maxPoints: 20,
      icon: <Shield size={16} />,
      description: 'Propellant margin preserved and subsystem redundancy / hardware reliability.',
    },
    {
      id: 'decisionSpeed',
      label: 'Flight Decision Speed',
      points: score.decisionSpeed,
      maxPoints: 10,
      icon: <Zap size={16} />,
      description: 'Operator reaction time and rapid resolution of tactical in-flight anomalies.',
    },
    {
      id: 'designEfficiency',
      label: 'Systems Design Efficiency',
      points: score.designEfficiency,
      maxPoints: 10,
      icon: <SlidersHorizontal size={16} />,
      description: 'Pre-flight engineering elegance (mass, power, velocity, and thermal margins).',
    },
  ];

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            MISSION SCORING MATRIX
          </span>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>5-Component Evaluation Breakdown</h2>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>COMPOSITE SCORE</span>
          <div className="number-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mission-accent)' }}>
            {`${score.total} / 100`}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {components.map((c) => {
          const ratio = c.maxPoints > 0 ? c.points / c.maxPoints : 0;
          const percentage = Math.round(ratio * 100);

          const barColor =
            percentage >= 75
              ? 'var(--status-good)'
              : percentage >= 50
              ? 'var(--status-warn)'
              : 'var(--status-critical)';

          return (
            <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: barColor }}>{c.icon}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {c.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }} className="number-mono">
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: barColor }}>
                    {c.points}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {`/ ${c.maxPoints} PTS`}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                    {`(${percentage}%)`}
                  </span>
                </div>
              </div>

              {/* Progress bar track */}
              <div
                role="progressbar"
                aria-label={c.label}
                aria-valuenow={c.points}
                aria-valuemin={0}
                aria-valuemax={c.maxPoints}
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-base)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: barColor,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 600ms ease, background-color 300ms ease',
                    boxShadow: percentage >= 75 ? '0 0 8px rgba(61, 190, 122, 0.4)' : undefined,
                  }}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {c.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
