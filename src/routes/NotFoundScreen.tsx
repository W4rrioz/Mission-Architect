/**
 * 404 Not Found Screen — Stitch AI Tactical Signal Loss Console
 * Source: docs/stitch/ & 01-prd.md
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { RadioTower, Home, Compass } from 'lucide-react';

export const NotFoundScreen: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        textAlign: 'center',
        padding: 'var(--space-6) var(--space-4)',
      }}
    >
      <div
        className="hud-panel blueprint-grid"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '40px 32px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}
      >
        {/* Radar Icon with Beacon Ripple */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(224, 160, 48, 0.12)',
            border: '1px solid var(--status-warn, #E0A030)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--status-warn, #E0A030)',
            boxShadow: '0 0 20px rgba(224, 160, 48, 0.25)',
          }}
        >
          <RadioTower size={32} />
        </div>

        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.75rem',
              color: 'var(--status-warn, #E0A030)',
              letterSpacing: '0.1em',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            ERR: 404 // TELEMETRY LINK LOSS
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              fontSize: '1.8rem',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              margin: '0 0 8px 0',
            }}
          >
            404 — Trajectory Lost
          </h1>

          <p
            style={{
              color: 'var(--text-muted, #8FA0C4)',
              fontSize: '0.85rem',
              maxWidth: '420px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            The requested flight coordinates or deep-space sector do not exist in the Mission Architect flight manifest.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link to="/missions" style={{ textDecoration: 'none' }}>
            <button
              className="primary"
              style={{
                padding: '8px 18px',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                minHeight: '40px',
              }}
            >
              <Compass size={15} />
              <span>Flight Profile Catalog</span>
            </button>
          </Link>

          <Link to="/" style={{ textDecoration: 'none' }}>
            <button
              className="secondary"
              style={{
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                minHeight: '40px',
              }}
            >
              <Home size={15} />
              <span>Return to Title</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
