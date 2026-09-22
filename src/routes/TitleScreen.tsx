/**
 * Title Screen
 * Source: 01-prd.md §4, 04-ui-ux-brief.md §6
 *
 * Cinematic, full-bleed title screen with starfield aesthetics,
 * clean typography, mission scope highlights, and a primary CTA.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Cpu, Orbit } from 'lucide-react';
import { Logo } from '../components/Logo';

export const TitleScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 50px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-6) var(--space-4)',
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(30, 48, 86, 0.4) 0%, rgba(11, 16, 32, 1) 75%)',
        overflow: 'hidden',
      }}
    >
      {/* Background SVG Grid & Constellations Accent */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(rgba(61, 165, 245, 0.4) 1px, transparent 1px), radial-gradient(rgba(201, 211, 234, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px, 80px 80px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '780px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-6)',
        }}
      >
        {/* Official Insignia & Wordmark */}
        <Logo size="lg" showSubtitle={true} />

        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto',
          }}
        >
          Design, integrate, and pilot authentic robotic space probes across real NASA mission profiles.
          Governed by genuine orbital mechanics, Tsiolkovsky rocket equations, and Deep Space Network link budgets.
        </p>

        {/* Primary CTA */}
        <div style={{ marginTop: 'var(--space-2)' }}>
          <button
            className="primary"
            onClick={() => navigate('/missions')}
            style={{
              fontSize: '1.15rem',
              padding: '16px 40px',
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: 'var(--glow-accent)',
            }}
          >
            <span>Launch Mission Architect</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Architecture & Engineering Feature Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
            width: '100%',
            marginTop: 'var(--space-6)',
          }}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Orbit size={20} color="var(--mission-earth)" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                4 NASA Profiles
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Landsat 9, LRO, MAVEN, OSIRIS-REx
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Cpu size={20} color="var(--status-good)" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Exact Domain Physics
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Kepler, Friis, Stefan-Boltzmann
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <ShieldCheck size={20} color="var(--mission-mars)" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Zero Backend
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                100% Client-Side Pure Simulation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
