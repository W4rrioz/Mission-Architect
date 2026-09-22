/**
 * Gauge Component
 * Source: 04-ui-ux-brief.md §3, §5
 *
 * Renders label, monospace numeric readout (current / limit), and animated status bar
 * with color shifts: good (<85%), warn (≥85%), critical (≥100%).
 */

import React from 'react';

export interface GaugeProps {
  label: string;
  currentValue: number | string;
  limitValue: number | string;
  unit?: string;
  percentage: number;
  status?: 'good' | 'warn' | 'critical';
  subtitle?: string;
}

export const Gauge: React.FC<GaugeProps> = ({
  label,
  currentValue,
  limitValue,
  unit = '',
  percentage,
  status,
  subtitle,
}) => {
  // Determine status color if not explicitly provided
  let computedStatus: 'good' | 'warn' | 'critical' = 'good';
  if (status) {
    computedStatus = status;
  } else if (percentage >= 100) {
    computedStatus = 'critical';
  } else if (percentage >= 85) {
    computedStatus = 'warn';
  }

  const statusColor =
    computedStatus === 'critical'
      ? 'var(--status-critical)'
      : computedStatus === 'warn'
      ? 'var(--status-warn)'
      : 'var(--status-good)';

  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={typeof currentValue === 'number' ? currentValue : parseFloat(String(currentValue)) || 0}
      aria-valuetext={`${currentValue} of ${limitValue} ${unit}`}
      aria-valuemin={0}
      aria-valuemax={typeof limitValue === 'number' ? limitValue : 100}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        boxShadow: computedStatus === 'critical' ? 'var(--glow-critical)' : undefined,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        <span
          className="number-mono"
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: statusColor,
            textTransform: 'uppercase',
          }}
        >
          {computedStatus === 'critical' ? 'CRITICAL' : computedStatus === 'warn' ? 'WARN 85%+' : 'NOMINAL'}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="number-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {typeof currentValue === 'number' ? currentValue.toLocaleString() : currentValue}
          {unit && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '3px' }}>{unit}</span>}
        </span>
        <span className="number-mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          / {typeof limitValue === 'number' ? limitValue.toLocaleString() : limitValue}
          {unit && <span style={{ fontSize: '0.75rem', marginLeft: '2px' }}>{unit}</span>}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: '6px',
          background: 'rgba(42, 51, 80, 0.6)',
          borderRadius: '3px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${clampedPercentage}%`,
            height: '100%',
            backgroundColor: statusColor,
            transition: 'width 100ms linear',
            borderRadius: '3px',
          }}
        />
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
