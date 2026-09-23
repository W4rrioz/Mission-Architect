/**
 * Score Breakdown Component — Stitch AI Flight Debrief Radial Gauge & Matrix
 * Source: docs/stitch/06-flight-debrief.html & 04-ui-ux-brief.md §6
 *
 * Features:
 * - SVG Radial Arc Meter Gauge (viewBox 0 0 120 120) with target calibration tick & score readout
 * - Architect Rank Badge (RANK S ≥90, RANK A ≥80, RANK B ≥70, RANK C <70)
 * - 5-Component Telemetry Matrix with percentage progress bars
 */

import React from 'react';
import { ScoreResult } from '../domain/types';
import { Database, DollarSign, Shield, Zap, SlidersHorizontal, Award } from 'lucide-react';

export interface ScoreBreakdownProps {
  score: ScoreResult;
}

interface ComponentItem {
  id: string;
  number: string;
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
      number: '01',
      label: 'Science Return & Telemetry Yield',
      points: score.scienceReturn,
      maxPoints: 40,
      icon: <Database size={15} />,
      description: 'Volume of scientific payload telemetry successfully collected and downlinked.',
    },
    {
      id: 'budgetEfficiency',
      number: '02',
      label: 'Budget & Cost Efficiency',
      points: score.budgetEfficiency,
      maxPoints: 20,
      icon: <DollarSign size={15} />,
      description: 'Financial discipline and margin preserved below the mission budget cap.',
    },
    {
      id: 'resilience',
      number: '03',
      label: 'Mission Resilience & Survival',
      points: score.resilience,
      maxPoints: 20,
      icon: <Shield size={15} />,
      description: 'Propellant margin preserved and subsystem redundancy / hardware reliability.',
    },
    {
      id: 'decisionSpeed',
      number: '04',
      label: 'Flight Decision Speed',
      points: score.decisionSpeed,
      maxPoints: 10,
      icon: <Zap size={15} />,
      description: 'Operator reaction time and rapid resolution of tactical in-flight anomalies.',
    },
    {
      id: 'designEfficiency',
      number: '05',
      label: 'Systems Design Efficiency',
      points: score.designEfficiency,
      maxPoints: 10,
      icon: <SlidersHorizontal size={15} />,
      description: 'Pre-flight engineering elegance (mass, power, velocity, and thermal margins).',
    },
  ];

  // Radial Arc calculations (radius = 50, circumference = 2 * pi * 50 = 314.159)
  const circumference = 314.159;
  const clampedTotal = Math.max(0, Math.min(100, score.total));
  const dashOffset = circumference * (1 - clampedTotal / 100);

  // Architect Rank Badge
  const rank =
    score.total >= 90
      ? { title: 'ARCHITECT // RANK S', color: '#FFE066', bg: 'rgba(224, 160, 48, 0.15)', border: 'rgba(224, 160, 48, 0.4)' }
      : score.total >= 80
      ? { title: 'COMMANDER // RANK A', color: 'var(--mission-earth, #3DA5F5)', bg: 'rgba(61, 165, 245, 0.15)', border: 'rgba(61, 165, 245, 0.4)' }
      : score.total >= 70
      ? { title: 'PILOT // RANK B', color: 'var(--status-good, #3DBE7A)', bg: 'rgba(61, 190, 122, 0.15)', border: 'rgba(61, 190, 122, 0.4)' }
      : { title: 'CADET // RANK C', color: 'var(--status-warn, #E0A030)', bg: 'rgba(224, 160, 48, 0.15)', border: 'rgba(224, 160, 48, 0.4)' };

  return (
    <div
      style={{
        background: 'var(--panel-base, #111728)',
        border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
        borderRadius: '8px',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Top Split: Radial Arc Score Gauge & Architect Evaluation Rank */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Radial SVG Gauge */}
          <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
            <svg
              viewBox="0 0 120 120"
              style={{
                width: '100%',
                height: '100%',
                transform: 'rotate(-90deg)',
              }}
            >
              {/* Background track circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                stroke="var(--panel-elevated, #162038)"
                strokeWidth="8"
              />
              {/* Animated fill arc */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                stroke="var(--mission-accent, #3DA5F5)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(61, 165, 245, 0.5))',
                  transition: 'stroke-dashoffset 800ms ease-out',
                }}
              />
              {/* Target calibration tick at top */}
              <line
                x1="60"
                y1="6"
                x2="60"
                y2="14"
                stroke="var(--status-good, #3DBE7A)"
                strokeWidth="2"
              />
            </svg>

            {/* Centered Score Readout */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                className="number-mono"
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1,
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                {score.total}
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono, monospace)',
                  letterSpacing: '0.04em',
                  marginTop: '2px',
                }}
              >
                / 100 PTS
              </span>
            </div>
          </div>

          {/* Rank & Evaluation Info */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '4px',
                background: rank.bg,
                border: `1px solid ${rank.border}`,
                color: rank.color,
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                marginBottom: '6px',
              }}
            >
              <Award size={13} />
              <span>{rank.title}</span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              5-Component Evaluation Breakdown
            </h3>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono, monospace)',
                margin: '2px 0 0 0',
              }}
            >
              ALGORITHM: NASA-SP-2020-5002 // SYSTEMS TELEMETRY
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
            COMPOSITE SCORE
          </span>
          <div
            className="number-mono"
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--mission-accent, #3DA5F5)',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            {`${score.total} / 100`}
          </div>
        </div>
      </div>

      {/* 5-Component Performance Progress List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {components.map((c) => {
          const ratio = c.maxPoints > 0 ? c.points / c.maxPoints : 0;
          const percentage = Math.round(ratio * 100);

          const barColor =
            percentage >= 75
              ? 'var(--status-good, #3DBE7A)'
              : percentage >= 50
              ? 'var(--status-warn, #E0A030)'
              : 'var(--status-critical, #E0453D)';

          return (
            <div
              key={c.id}
              style={{
                background: 'var(--panel-elevated, #162038)',
                border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.5))',
                borderRadius: '6px',
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: barColor }}>{c.icon}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {c.number} // {c.label}
                  </span>
                </div>

                <div
                  style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}
                  className="number-mono"
                >
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: barColor }}>
                    {c.points}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {`/ ${c.maxPoints} PTS`}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
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
                  height: '6px',
                  background: 'var(--deep-space, #0A0F1D)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.4))',
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: barColor,
                    borderRadius: '9999px',
                    transition: 'width 600ms ease-out',
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                {c.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
