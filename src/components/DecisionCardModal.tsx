/**
 * Decision Card Modal Overlay
 * Source: 01-prd.md §4.5, 04-ui-ux-brief.md §5, §7
 *
 * Urgent operational modal with animated countdown ring, large monospace timer,
 * screen-edge alert glow, 2-3 response options, and reduced-motion fallback.
 */

import React, { useEffect, useState, useRef } from 'react';
import { DecisionCard } from '../domain/types';
import { AlertTriangle, Clock, Flame, Zap, Database } from 'lucide-react';

export interface DecisionCardModalProps {
  card: DecisionCard;
  secondsRemaining: number;
  onSelectResponse: (responseId: string, isFast: boolean) => void;
}

export const DecisionCardModal: React.FC<DecisionCardModalProps> = ({
  card,
  secondsRemaining,
  onSelectResponse,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const totalSeconds = card.timeoutSeconds || 20;
  const clampedSeconds = Math.max(0, Math.ceil(secondsRemaining));
  const isUrgent = clampedSeconds <= 5;
  const isFast = secondsRemaining >= totalSeconds * 0.5;

  // Auto-focus the first option for rapid keyboard response
  useEffect(() => {
    firstButtonRef.current?.focus();
  }, []);

  // Keyboard shortcut listener: pressing keys 1, 2, or 3 selects response
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key >= '1' && e.key <= '3') {
        const index = parseInt(e.key, 10) - 1;
        if (card.responses[index]) {
          e.preventDefault();
          onSelectResponse(card.responses[index].id, isFast);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card.responses, onSelectResponse, isFast]);

  // SVG countdown ring parameters
  const size = 72;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = prefersReducedMotion
    ? 0
    : circumference - (secondsRemaining / totalSeconds) * circumference;

  const severityColor =
    card.type === 'failure'
      ? 'var(--status-critical)'
      : card.type === 'commsBlackout'
      ? 'var(--status-warn)'
      : 'var(--mission-accent)';

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="decision-card-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 16, 32, 0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-3)',
        boxShadow: `inset 0 0 100px ${
          card.type === 'failure' ? 'rgba(255, 90, 82, 0.35)' : 'rgba(224, 160, 48, 0.25)'
        }`,
      }}
    >
      <div
        style={{
          background: 'var(--bg-surface-elevated)',
          border: `2px solid ${severityColor}`,
          borderRadius: 'var(--radius-lg)',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 'clamp(var(--space-4), 4vw, var(--space-6))',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          boxShadow: isUrgent ? 'var(--glow-critical)' : 'var(--glow-accent)',
          transition: 'box-shadow 200ms ease',
        }}
      >
        {/* Header with Title and Countdown Ring */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: severityColor,
                color: 'var(--bg-base)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: severityColor,
                  fontWeight: 700,
                }}
              >
                {`TACTICAL EVENT // ${card.type.toUpperCase()}`}
              </span>
              <h2 id="decision-card-title" style={{ fontSize: '1.25rem', lineHeight: 1.2 }}>
                Flight Anomaly Decision
              </h2>
            </div>
          </div>

          {/* Countdown Ring (SVG) + Large Monospace Readout */}
          <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
            {!prefersReducedMotion ? (
              <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="rgba(42, 51, 80, 0.8)"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={isUrgent ? 'var(--status-critical)' : severityColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 200ms linear' }}
                />
              </svg>
            ) : (
              <div
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  border: `3px solid ${severityColor}`,
                }}
              />
            )}

            <div
              className="number-mono"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: isUrgent ? 'var(--status-critical)' : 'var(--text-primary)',
              }}
            >
              <span style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{clampedSeconds}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SEC</span>
            </div>
          </div>
        </div>

        {/* Prompt Body */}
        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {card.prompt}
        </p>

        {/* Response Option Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          {card.responses.map((resp, index) => {
            const isDefault = resp.id === card.defaultResponseId;

            return (
              <button
                key={resp.id}
                ref={index === 0 ? firstButtonRef : undefined}
                onClick={() => onSelectResponse(resp.id, isFast)}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${isDefault ? 'rgba(224, 69, 61, 0.5)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3) var(--space-4)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease, border-color 150ms ease, transform 100ms ease',
                  minHeight: '48px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(42, 51, 80, 0.6)';
                  e.currentTarget.style.borderColor = severityColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                  e.currentTarget.style.borderColor = isDefault ? 'rgba(224, 69, 61, 0.5)' : 'var(--border-subtle)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {`[${index + 1}] ${resp.label}`}
                  </span>
                  {isDefault && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--status-critical)',
                        fontWeight: 700,
                        border: '1px solid var(--status-critical)',
                        borderRadius: '3px',
                        padding: '1px 6px',
                      }}
                    >
                      TIMEOUT DEFAULT
                    </span>
                  )}
                </div>

                {resp.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    {resp.description}
                  </p>
                )}

                {/* Resource impact tags */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: '4px', fontSize: '0.75rem' }} className="number-mono">
                  {resp.fuelCostKg !== undefined && resp.fuelCostKg > 0 && (
                    <span style={{ color: 'var(--status-critical)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Flame size={12} /> {`-${resp.fuelCostKg} kg Fuel`}
                    </span>
                  )}
                  {resp.powerCostW !== undefined && resp.powerCostW > 0 && (
                    <span style={{ color: 'var(--status-warn)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Zap size={12} /> {`-${resp.powerCostW} W Power`}
                    </span>
                  )}
                  {resp.dataLossMB !== undefined && resp.dataLossMB > 0 && (
                    <span style={{ color: 'var(--status-critical)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Database size={12} /> {`-${resp.dataLossMB} MB Data`}
                    </span>
                  )}
                  {resp.scienceBonusMB !== undefined && resp.scienceBonusMB > 0 && (
                    <span style={{ color: 'var(--status-good)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Database size={12} /> {`+${resp.scienceBonusMB.toLocaleString()} MB Science Bonus`}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <Clock size={13} />
          <span>If timer reaches 0, the highlighted default response will be executed automatically.</span>
        </div>
      </div>
    </div>
  );
};
