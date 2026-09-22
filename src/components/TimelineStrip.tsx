/**
 * Timeline Strip Component
 * Source: 03-app-flow.md §3, 04-ui-ux-brief.md §5
 *
 * Horizontal strip showing the 4 flight phases and current mission progression.
 */

import React from 'react';
import { MissionPhase } from '../domain/types';
import { Rocket, Compass, Target, Activity, Check } from 'lucide-react';

export interface TimelineStripProps {
  phase: MissionPhase;
  elapsedSeconds: number;
}

const PHASES: { id: MissionPhase; label: string; icon: React.ReactNode; range: string }[] = [
  { id: 'launch', label: 'LAUNCH', icon: <Rocket size={14} />, range: 'T+0s – 60s' },
  { id: 'cruise', label: 'CRUISE', icon: <Compass size={14} />, range: 'T+60s – 180s' },
  { id: 'arrival', label: 'ARRIVAL / MOI', icon: <Target size={14} />, range: 'T+180s – 240s' },
  { id: 'scienceOps', label: 'SCIENCE OPS', icon: <Activity size={14} />, range: 'T+240s – 360s' },
];

export const TimelineStrip: React.FC<TimelineStripProps> = ({ phase, elapsedSeconds: _elapsedSeconds }) => {
  const phaseOrder: MissionPhase[] = ['launch', 'cruise', 'arrival', 'scienceOps', 'endOfMission'];
  const currentIndex = phaseOrder.indexOf(phase);

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-4)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-2)',
      }}
    >
      {PHASES.map((p, idx) => {
        const isCurrent = phase === p.id;
        const isPast = currentIndex > idx;

        return (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              opacity: isCurrent ? 1 : isPast ? 0.75 : 0.4,
              flex: '1 1 180px',
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: isCurrent ? 'var(--mission-accent)' : isPast ? 'var(--status-good)' : 'var(--bg-base)',
                color: isCurrent || isPast ? 'var(--bg-base)' : 'var(--text-muted)',
                border: `1px solid ${isCurrent ? 'var(--mission-accent)' : isPast ? 'var(--status-good)' : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isCurrent ? 'var(--glow-accent)' : undefined,
                flexShrink: 0,
              }}
            >
              {isPast ? <Check size={14} strokeWidth={3} /> : p.icon}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  color: isCurrent ? 'var(--mission-accent)' : isPast ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {p.label}
              </span>
              <span className="number-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {p.range}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
