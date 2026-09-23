/**
 * Pre-flight Checklist Row Component — Stitch AI Aerospace Console
 * Source: docs/stitch/ & 01-prd.md §4.4, 04-ui-ux-brief.md §6
 *
 * Renders an individual constraint row on the Pre-flight Review checklist.
 * Displays green/amber/red status, numeric values, margins, and direct links back
 * to the responsible category tab in the Spacecraft Design CAD screen.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PartCategory, MissionId } from '../domain/types';
import { CheckCircle2, AlertTriangle, XCircle, ArrowUpRight } from 'lucide-react';

export interface PreflightChecklistRowProps {
  missionId: MissionId;
  category: PartCategory;
  categoryName: string;
  metricTitle: string;
  status: 'nominal' | 'warning' | 'critical';
  currentDisplay: string;
  limitDisplay: string;
  marginDisplay: string;
  description: string;
}

export const PreflightChecklistRow: React.FC<PreflightChecklistRowProps> = ({
  missionId,
  category,
  categoryName,
  metricTitle,
  status,
  currentDisplay,
  limitDisplay,
  marginDisplay,
  description,
}) => {
  const navigate = useNavigate();

  const statusColor =
    status === 'nominal'
      ? 'var(--status-good, #3DBE7A)'
      : status === 'warning'
      ? 'var(--status-warn, #E0A030)'
      : 'var(--status-critical, #E0453D)';

  const StatusIcon =
    status === 'nominal'
      ? CheckCircle2
      : status === 'warning'
      ? AlertTriangle
      : XCircle;

  return (
    <div
      style={{
        background: 'var(--panel-elevated, #162038)',
        border: `1px solid ${status === 'nominal' ? 'var(--border-hairline, rgba(42, 51, 80, 0.6))' : statusColor}`,
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        transition: 'all 150ms ease',
      }}
    >
      {/* Left: Status Icon and Metric Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: '1 1 240px', minWidth: 0 }}>
        <div
          style={{
            color: statusColor,
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <StatusIcon size={20} strokeWidth={2.5} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontSize: '0.92rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
              }}
            >
              {metricTitle}
            </span>
            <span
              className="number-mono"
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '3px',
                background: status === 'nominal' ? 'rgba(61, 190, 122, 0.15)' : status === 'warning' ? 'rgba(224, 160, 48, 0.15)' : 'rgba(224, 69, 61, 0.15)',
                color: statusColor,
                border: `1px solid ${statusColor}`,
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              {status.toUpperCase()}
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #8FA0C4)', margin: '4px 0 0', lineHeight: 1.45 }}>
            {description}
          </p>
        </div>
      </div>

      {/* Right: Telemetry Readouts and Link Back to CAD */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          flex: '1 1 200px',
        }}
      >
        <div className="number-mono" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: statusColor }}>
            {currentDisplay}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {`${limitDisplay} (${marginDisplay})`}
          </div>
        </div>

        <button
          onClick={() => navigate(`/missions/${missionId}/design?tab=${category}`)}
          style={{
            background: 'var(--panel-base, #111728)',
            border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
            color: 'var(--text-primary)',
            padding: '7px 14px',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            borderRadius: '4px',
            minHeight: '38px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          title={`Modify ${categoryName} in CAD`}
        >
          <span>{`Tune ${categoryName}`}</span>
          <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
};
