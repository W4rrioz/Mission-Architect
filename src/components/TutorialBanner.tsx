/**
 * Tutorial Guidance Banner Component
 * Source: 01-prd.md §4.7, 03-app-flow.md §4
 *
 * Floating guidance banner rendered during the Earth-orbit tutorial mission.
 * Features step counters, actionable NASA flight directives, and single-tap dismissal.
 */

import React from 'react';
import { useProgression } from '../context/ProgressionContext';
import { HelpCircle, X, Sparkles } from 'lucide-react';

export interface TutorialBannerProps {
  stepNumber: number;
  totalSteps?: number;
  title: string;
  instructions: string;
  tip?: string;
}

export const TutorialBanner: React.FC<TutorialBannerProps> = ({
  stepNumber,
  totalSteps = 5,
  title,
  instructions,
  tip,
}) => {
  const { tutorialDismissed, dismissTutorial } = useProgression();

  if (tutorialDismissed) return null;

  return (
    <aside
      aria-label="Flight Tutorial Guidance"
      style={{
        background: 'rgba(19, 26, 48, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--mission-earth)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4) var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        boxShadow: '0 4px 20px rgba(61, 165, 245, 0.25)',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--mission-earth)',
              color: 'var(--bg-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={14} />
          </div>

          <span
            className="number-mono"
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--mission-earth)',
              textTransform: 'uppercase',
            }}
          >
            {`FLIGHT CADET TUTORIAL // STEP ${stepNumber} OF ${totalSteps}`}
          </span>
        </div>

        <button
          onClick={dismissTutorial}
          title="Dismiss tutorial"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            padding: '4px',
            minHeight: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          <span>Skip Tutorial</span>
          <X size={14} />
        </button>
      </div>

      <div>
        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
          {title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
          {instructions}
        </p>
        {tip && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '6px',
              fontSize: '0.75rem',
              color: 'var(--mission-earth)',
            }}
          >
            <HelpCircle size={13} style={{ flexShrink: 0 }} />
            <span>{tip}</span>
          </div>
        )}
      </div>
    </aside>
  );
};
