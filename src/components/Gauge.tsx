/**
 * Gauge Component — Stitch AI Live Constraint Telemetry Card
 * Source: docs/stitch/07-cad-workbench.html §Zone 1 & 04-ui-ux-brief.md §3, §5
 *
 * Renders an aerospace telemetry card featuring:
 * - Upper label & status LED badge (● NOM, ▲ WARN, ■ CRIT)
 * - Monospace numeric readout (current / limit)
 * - Micro progress bar with color-coded threshold fills
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
  indexNumber?: number;
}

export const Gauge: React.FC<GaugeProps> = ({
  label,
  currentValue,
  limitValue,
  unit = '',
  percentage,
  status,
  subtitle,
  indexNumber,
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
      ? 'var(--status-critical, #E0453D)'
      : computedStatus === 'warn'
      ? 'var(--status-warn, #E0A030)'
      : 'var(--status-good, #3DBE7A)';

  const statusBadgeText =
    computedStatus === 'critical'
      ? '■ CRIT'
      : computedStatus === 'warn'
      ? '▲ WARN'
      : '● NOM';

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
        background: 'var(--panel-elevated, #162038)',
        border: `1px solid ${computedStatus === 'critical' ? 'var(--status-critical, #E0453D)' : 'var(--border-hairline, rgba(42, 51, 80, 0.6))'}`,
        borderRadius: '6px',
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '6px',
        transition: 'all 200ms ease',
        boxShadow: computedStatus === 'critical' ? '0 0 10px rgba(224, 69, 61, 0.25)' : undefined,
      }}
    >
      {/* Top Header: Label & Status Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
        <span
          style={{
            fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
            fontSize: '0.72rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: 'var(--text-muted, #8FA0C4)',
            letterSpacing: '0.04em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {indexNumber ? `${indexNumber}. ` : ''}{label}
        </span>
        <span
          className="number-mono"
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            color: statusColor,
            fontFamily: 'var(--font-mono, monospace)',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          {statusBadgeText}
        </span>
      </div>

      {/* Numeric Readout: Monospace value / limit */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span
          className="number-mono"
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-primary, #E6ECF8)',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          {typeof currentValue === 'number' ? currentValue.toLocaleString() : currentValue}
          {unit && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '2px' }}>{unit}</span>}
        </span>
        <span
          className="number-mono"
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted, #8FA0C4)',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          / {typeof limitValue === 'number' ? limitValue.toLocaleString() : limitValue}
          {unit && <span style={{ fontSize: '0.7rem', marginLeft: '1px' }}>{unit}</span>}
        </span>
      </div>

      {/* Micro Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '5px',
          background: 'var(--deep-space, #0A0F1D)',
          borderRadius: '9999px',
          overflow: 'hidden',
          border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.4))',
        }}
      >
        <div
          style={{
            width: `${clampedPercentage}%`,
            height: '100%',
            backgroundColor: statusColor,
            transition: 'width 250ms ease-out',
          }}
        />
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono, monospace)' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
