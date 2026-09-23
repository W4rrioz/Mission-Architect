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

export const TitleScreen: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        // Prevent default space scroll
        if (e.code === 'Space') e.preventDefault();
        navigate('/missions');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div
      className="star-layer"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 50px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-8) var(--space-4)',
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(30, 48, 86, 0.45) 0%, rgba(11, 16, 32, 1) 85%)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Planetary Horizon Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: 'linear-gradient(to top, rgba(61, 165, 245, 0.12), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '820px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-6)',
        }}
      >
        {/* Stitch Large Glowing Emblem Container */}
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-2)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-16px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(61, 165, 245, 0.35) 0%, rgba(157, 116, 255, 0.15) 50%, transparent 70%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }}
          />
          <img
            src="/assets/stitch/patch-insignia.png"
            alt="Mission Architect Flight Emblem"
            width={140}
            height={140}
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: '2px solid var(--border-glow)',
              boxShadow: '0 0 32px rgba(61, 165, 245, 0.4)',
              background: 'var(--panel-base)',
              padding: '6px',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Tactical Sub-Badge */}
        <div
          className="tier-pill"
          style={{
            borderColor: 'rgba(61, 165, 245, 0.4)',
            backgroundColor: 'rgba(61, 165, 245, 0.08)',
            color: 'var(--mission-earth)',
          }}
        >
          <span className="status-led good" style={{ width: '6px', height: '6px' }} />
          <span>NASA Space Apps Challenge 2026 // Flight Dynamics Lab</span>
        </div>

        {/* Display Heading with Metallic Gradient */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            letterSpacing: '0.08em',
            lineHeight: 1.1,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #D4E1FA 55%, #8FA0C4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 auto',
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6))',
          }}
        >
          MISSION ARCHITECT
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto',
          }}
        >
          Architect, simulate, and command authentic robotic missions across the solar system.
          Balance mass limits, power budgets, delta-v constraints, and real orbital physics.
        </p>

        {/* Primary Tactical CTA */}
        <div style={{ marginTop: 'var(--space-2)' }}>
          <button
            className="primary"
            onClick={() => navigate('/missions')}
            style={{
              fontSize: '1.15rem',
              padding: '16px 44px',
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: 'var(--glow-accent)',
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            <span>Launch Mission Architect</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Monospace Keyboard Shortcut Hint */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'rgba(143, 160, 196, 0.75)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              padding: '2px 8px',
              background: 'var(--panel-elevated)',
              border: '1px solid var(--border-hairline)',
              borderRadius: '4px',
            }}
          >
            SPACE
          </span>
          <span>or</span>
          <span
            style={{
              padding: '2px 8px',
              background: 'var(--panel-elevated)',
              border: '1px solid var(--border-hairline)',
              borderRadius: '4px',
            }}
          >
            ENTER
          </span>
          <span>to commence flight configuration</span>
        </div>

        {/* Architecture & Engineering Feature Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
            width: '100%',
            marginTop: 'var(--space-4)',
          }}
        >
          <div
            className="hud-panel"
            style={{
              padding: 'var(--space-3) var(--space-4)',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Orbit size={22} color="var(--mission-earth)" />
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
            className="hud-panel"
            style={{
              padding: 'var(--space-3) var(--space-4)',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Cpu size={22} color="var(--status-good)" />
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
            className="hud-panel"
            style={{
              padding: 'var(--space-3) var(--space-4)',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <ShieldCheck size={22} color="var(--mission-mars)" />
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
