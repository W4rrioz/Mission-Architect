/**
 * Event Log Component
 * Source: 04-ui-ux-brief.md §5, §6
 *
 * Auto-scrolling operational flight recorder with MET timestamps and severity color tags.
 */

import React from 'react';
import { LogEntry } from '../domain/types';
import { Terminal } from 'lucide-react';

export interface EventLogProps {
  entries: LogEntry[];
}

function formatMET(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `[T+${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}]`;
}

export const EventLog: React.FC<EventLogProps> = ({ entries }) => {
  // Most recent entries displayed at top
  const sortedEntries = [...entries].reverse();

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        height: '260px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)' }}>
        <Terminal size={14} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          FLIGHT RECORDER & TELEMETRY LOG
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          paddingRight: 'var(--space-2)',
        }}
      >
        {sortedEntries.map((log) => {
          const typeColor =
            log.type === 'error'
              ? 'var(--status-critical)'
              : log.type === 'warn'
              ? 'var(--status-warn)'
              : log.type === 'success'
              ? 'var(--status-good)'
              : 'var(--text-muted)';

          return (
            <div
              key={log.id}
              className="number-mono"
              style={{
                fontSize: '0.78rem',
                lineHeight: 1.4,
                display: 'flex',
                gap: '8px',
                color: 'var(--text-primary)',
              }}
            >
              <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                {formatMET(log.timestampMET)}
              </span>
              <span style={{ color: typeColor }}>
                {log.message}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
