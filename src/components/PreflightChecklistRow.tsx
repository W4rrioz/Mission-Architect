/**
 * Pre-flight Checklist Row Component
 * Source: 01-prd.md §4.4, 04-ui-ux-brief.md §6
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
      ? 'var(--status-good)'
      : status === 'warning'
      ? 'var(--status-warn)'
      : 'var(--status-critical)';

  const StatusIcon =
    status === 'nominal'
      ? CheckCircle2
      : status === 'warning'
      ? AlertTriangle
      : XCircle;

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${status === 'nominal' ? 'var(--border-subtle)' : statusColor}`,
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-4)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        transition: 'background-color 150ms ease, border-color 150ms ease',
      }}
    >
      {/* Left: Status Icon and Metric Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', flex: '1 1 200px', minWidth: 0 }}>
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
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {metricTitle}
            </span>
            <span
              className="number-mono"
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '1px 6px',
                borderRadius: '3px',
                background: status === 'nominal' ? 'rgba(61, 190, 122, 0.15)' : status === 'warning' ? 'rgba(224, 160, 48, 0.15)' : 'rgba(255, 90, 82, 0.15)',
                color: statusColor,
                border: `1px solid ${statusColor}`,
              }}
            >
              {status.toUpperCase()}
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0', lineHeight: 1.4 }}>
            {description}
          </p>
        </div>
      </div>

      {/* Right: Telemetry Readouts and Link Back to CAD */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          flex: '1 1 180px',
        }}
      >
        <div className="number-mono">
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: statusColor }}>
            {currentDisplay}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {`${limitDisplay} (${marginDisplay})`}
          </div>
        </div>

        <button
          onClick={() => navigate(`/missions/${missionId}/design?tab=${category}`)}
          style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            padding: '8px 14px',
            fontSize: '0.8rem',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          title={`Modify ${categoryName} in CAD`}
        >
          <span>{`Tune ${categoryName}`}</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
};
