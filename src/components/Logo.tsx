/**
 * Mission Architect — Official NASA Space Apps Challenge Wordmark & Logo
 * Source: 04-ui-ux-brief.md §3, §6 and 06-implementation-plan.md Phase 9
 *
 * Geometric vector insignia featuring:
 * 1. An elliptical orbital trajectory ring
 * 2. The classic NASA vector aeronautics chevron
 * 3. A stylized robotic probe with deployed solar wings
 * 4. Crisp display typography paired with the NASA Space Apps Challenge wordmark
 */

import React from 'react';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 64 : 44;
  const titleSize = size === 'sm' ? '1.1rem' : size === 'lg' ? '2.2rem' : '1.5rem';
  const subtitleSize = size === 'sm' ? '0.65rem' : size === 'lg' ? '0.85rem' : '0.75rem';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '10px' : '16px',
        textDecoration: 'none',
      }}
    >
      {/* Precision Geometric SVG Insignia */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          flexShrink: 0,
          filter: 'drop-shadow(0 0 12px rgba(61, 165, 245, 0.45))',
        }}
      >
        <defs>
          <radialGradient id="logoBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1B2444" />
            <stop offset="100%" stopColor="#0B1020" />
          </radialGradient>
          <linearGradient id="logoOrbit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3DA5F5" />
            <stop offset="50%" stopColor="#9D74FF" />
            <stop offset="100%" stopColor="#3DBE7A" />
          </linearGradient>
          <linearGradient id="chevronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#E0453D" />
          </linearGradient>
        </defs>

        {/* Outer Insignia Ring */}
        <circle cx="40" cy="40" r="37" fill="url(#logoBg)" stroke="rgba(61, 165, 245, 0.4)" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="33" fill="none" stroke="rgba(42, 51, 80, 0.6)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Elliptical Orbital Trajectory Path */}
        <ellipse
          cx="40"
          cy="40"
          rx="26"
          ry="14"
          transform="rotate(-28 40 40)"
          fill="none"
          stroke="url(#logoOrbit)"
          strokeWidth="2"
        />

        {/* NASA Aeronautics Red Vector Chevron */}
        <path
          d="M 16 52 L 40 18 L 47 38 L 41 38 L 38 27 L 24 50 Z"
          fill="url(#chevronGrad)"
          style={{ filter: 'drop-shadow(0 0 4px rgba(224, 69, 61, 0.5))' }}
        />

        {/* Central Spacecraft Bus & Solar Wing Silhouette */}
        <rect x="36" y="36" width="8" height="8" rx="1.5" fill="#E6ECF8" stroke="#3DA5F5" strokeWidth="1" />
        {/* Left Solar Panel */}
        <rect x="23" y="38.5" width="10" height="3" rx="0.5" fill="#3DA5F5" opacity="0.9" />
        {/* Right Solar Panel */}
        <rect x="47" y="38.5" width="10" height="3" rx="0.5" fill="#3DA5F5" opacity="0.9" />
        {/* Antenna Mast */}
        <line x1="40" y1="36" x2="40" y2="31" stroke="#E6ECF8" strokeWidth="1" />
        <circle cx="40" cy="30" r="1.5" fill="#3DBE7A" />

        {/* Orbiting Satellite Node on Ellipse */}
        <circle cx="61" cy="29" r="2.5" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 4px #FFFFFF)' }} />
      </svg>

      {/* Typography Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: titleSize,
            fontWeight: 800,
            letterSpacing: '0.06em',
            lineHeight: 1.1,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #C9D3EA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          MISSION ARCHITECT
        </span>

        {showSubtitle && (
          <span
            style={{
              fontSize: subtitleSize,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--mission-earth)',
              marginTop: '2px',
            }}
          >
            NASA Space Apps Challenge 2026
          </span>
        )}
      </div>
    </div>
  );
};
