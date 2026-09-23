/**
 * 2D Orbital Mechanics & Trajectory Visualization — Stitch AI Tactical Console
 * Source: docs/stitch/08-live-mission-control.html, 04-ui-ux-brief.md §3, §5, §6 & 07-domain-reference.md §2
 *
 * Features:
 * - Central planetary body with atmospheric glow & core surface shaders
 * - Elliptical Keplerian trajectory propagation with velocity vector orientation
 * - Distance range rings (R: 1,500 KM, R: 3,000 KM)
 * - Optical Umbra / Communication Blackout Shadow Cone with hatch overlay
 * - Liftoff gravity turn ascent arc & staging telemetry markers
 */

import React, { useEffect, useState } from 'react';
import { Mission, MissionPhase } from '../domain/types';

export interface OrbitViewProps {
  mission: Mission;
  phase: MissionPhase;
  elapsedSeconds: number;
  totalBurnDeltaVms: number;
}

export const OrbitView: React.FC<OrbitViewProps> = ({
  mission,
  phase,
  elapsedSeconds,
  totalBurnDeltaVms,
}) => {
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Calibrate animation loop period to real Keplerian periods from 07-domain-reference.md §2
  const realPeriodMinutes = mission.orbit.periodMinutes || 99;
  const visualLoopDurationSec = Math.max(6, Math.min(28, (realPeriodMinutes / 99) * 7));

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setOrbitAngle((prev) => (prev + (dt / visualLoopDurationSec) * 360) % 360);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [visualLoopDurationSec]);

  // Central body styling
  const centralBodyConfig = {
    earth: {
      color: '#3DA5F5',
      glow: 'rgba(61, 165, 245, 0.4)',
      radius: 36,
      name: 'EARTH',
      details: '705 km Sun-Sync Orbit',
    },
    moon: {
      color: '#C9D3EA',
      glow: 'rgba(201, 211, 234, 0.35)',
      radius: 28,
      name: 'MOON',
      details: '50 km Polar Mapping Orbit',
    },
    mars: {
      color: '#E0703D',
      glow: 'rgba(224, 112, 61, 0.4)',
      radius: 32,
      name: 'MARS',
      details: '150×6,200 km Elliptical Orbit',
    },
    asteroid: {
      color: '#8B5CF6',
      glow: 'rgba(139, 92, 246, 0.4)',
      radius: 20,
      name: 'BENNU',
      details: '0.68–2.1 km Proximity Orbit',
    },
  }[mission.orbit.centralBody] || {
    color: '#3DA5F5',
    glow: 'rgba(61, 165, 245, 0.4)',
    radius: 32,
    name: 'EARTH',
    details: 'Standard Orbit',
  };

  // Spacecraft orbit & launch trajectory mechanics
  const isLaunch = phase === 'launch';
  const launchDurationSec = 30;
  const launchProgress = Math.min(1, Math.max(0, elapsedSeconds / launchDurationSec));

  const a = 110; // Semi-major axis visual radius
  const b = mission.orbit.periapsisKm ? 70 : 100; // Ellipticity based on orbit regime

  // Standard orbit angular position
  const rad = (orbitAngle * Math.PI) / 180;

  // During launch: gravity-turn arc from launchpad at surface (-90 deg) into orbital insertion (0 deg)
  const launchAngleRad = -Math.PI / 2 + launchProgress * (Math.PI / 2);
  const currentRadiusX = centralBodyConfig.radius + launchProgress * (a - centralBodyConfig.radius);
  const currentRadiusY = centralBodyConfig.radius + launchProgress * (b - centralBodyConfig.radius);

  const scX = isLaunch
    ? 160 + currentRadiusX * Math.cos(launchAngleRad)
    : 160 + a * Math.cos(rad);

  const scY = isLaunch
    ? 110 + currentRadiusY * Math.sin(launchAngleRad)
    : 110 + b * Math.sin(rad);

  // Flight attitude rotation (pointing forward along velocity vector)
  const flightAngleDeg = isLaunch
    ? (launchAngleRad * 180) / Math.PI + 90
    : orbitAngle + 90;

  // Current displayed altitude
  const currentAltitudeKm = isLaunch
    ? Math.round(launchProgress * mission.orbit.altitudeKm)
    : mission.orbit.altitudeKm;

  return (
    <div
      style={{
        background: 'var(--panel-base, #111728)',
        border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Tactical Canvas Header Bar */}
      <div
        style={{
          background: 'var(--panel-elevated, #162038)',
          borderBottom: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
          padding: '8px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: 'var(--mission-accent, #3DA5F5)',
              boxShadow: '0 0 6px var(--mission-accent, #3DA5F5)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              ORBIT DYNAMICS TELEMETRY
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
              }}
            >
              {`${centralBodyConfig.name} // ${mission.orbit.regime}`}
            </span>
          </div>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          className="number-mono"
        >
          <span>PROJECTION: ECLIPTIC PLANAR</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>TRUE ORBIT PERIOD: </span>
          <span style={{ color: 'var(--mission-accent)', fontWeight: 700 }}>
            {`${mission.orbit.periodMinutes} min`}
          </span>
        </div>
      </div>

      {/* SVG Tactical Simulation Space */}
      <div
        style={{
          width: '100%',
          height: 'clamp(230px, 45vw, 300px)',
          background: 'radial-gradient(circle at center, rgba(16, 24, 46, 0.95) 0%, #070B14 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <svg viewBox="0 0 320 220" style={{ width: '100%', height: '100%' }}>
          <defs>
            <radialGradient id="bodyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={centralBodyConfig.color} stopOpacity="0.8" />
              <stop offset="70%" stopColor={centralBodyConfig.color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={centralBodyConfig.color} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="launchPlume" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FFE066" />
              <stop offset="70%" stopColor="#FF5A52" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="bloom">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Communication Blackout Umbra Shadow Gradient */}
            <linearGradient id="umbraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#050B18" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#050B18" stopOpacity="0.1" />
            </linearGradient>
            <pattern id="hatchShadow" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#3DA5F5" strokeWidth="0.8" opacity="0.15" />
            </pattern>
          </defs>

          {/* Coordinate grid backdrop */}
          <line x1="160" y1="15" x2="160" y2="205" stroke="rgba(42, 51, 80, 0.35)" strokeDasharray="3 3" />
          <line x1="20" y1="110" x2="300" y2="110" stroke="rgba(42, 51, 80, 0.35)" strokeDasharray="3 3" />

          {/* Distance Range Rings (Stitch Screen 08) */}
          <circle cx="160" cy="110" r="55" fill="none" stroke="rgba(42, 51, 80, 0.3)" strokeDasharray="3 3" strokeWidth="0.75" />
          <circle cx="160" cy="110" r="95" fill="none" stroke="rgba(42, 51, 80, 0.25)" strokeDasharray="4 4" strokeWidth="0.75" />
          <text x="165" y="60" fill="rgba(143, 160, 196, 0.45)" fontFamily="'JetBrains Mono', monospace" fontSize="6.5">
            R: 1,500 KM
          </text>
          <text x="165" y="20" fill="rgba(143, 160, 196, 0.45)" fontFamily="'JetBrains Mono', monospace" fontSize="6.5">
            R: 3,000 KM
          </text>

          {/* Communication Blackout Umbra Shadow Cone (cast eastward from central body) */}
          <polygon
            points={`160,${110 - centralBodyConfig.radius * 0.75} 320,${110 - centralBodyConfig.radius * 1.5} 320,${110 + centralBodyConfig.radius * 1.5} 160,${110 + centralBodyConfig.radius * 0.75}`}
            fill="url(#umbraGrad)"
          />
          <polygon
            points={`160,${110 - centralBodyConfig.radius * 0.75} 320,${110 - centralBodyConfig.radius * 1.5} 320,${110 + centralBodyConfig.radius * 1.5} 160,${110 + centralBodyConfig.radius * 0.75}`}
            fill="url(#hatchShadow)"
          />
          <text
            x="270"
            y="113"
            fill="rgba(143, 160, 196, 0.4)"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="6.5"
            letterSpacing="0.08em"
            textAnchor="middle"
          >
            COMM UMBRA
          </text>

          {/* Orbital path ellipse */}
          <ellipse
            cx="160"
            cy="110"
            rx={a}
            ry={b}
            fill="none"
            stroke="rgba(42, 51, 80, 0.6)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Trajectory trace */}
          <ellipse
            cx="160"
            cy="110"
            rx={a}
            ry={b}
            fill="none"
            stroke="var(--mission-accent, #3DA5F5)"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Central Body Atmosphere & Core */}
          <circle
            cx="160"
            cy="110"
            r={centralBodyConfig.radius + 12}
            fill="url(#bodyGlow)"
          />
          <circle
            cx="160"
            cy="110"
            r={centralBodyConfig.radius}
            fill={centralBodyConfig.color}
            filter="url(#bloom)"
            opacity="0.9"
          />
          {/* Surface texture detail */}
          <circle
            cx="152"
            cy="104"
            r={centralBodyConfig.radius * 0.3}
            fill="rgba(0, 0, 0, 0.15)"
          />
          <circle
            cx="168"
            cy="116"
            r={centralBodyConfig.radius * 0.45}
            fill="rgba(0, 0, 0, 0.12)"
          />

          {/* Launch pad marker & liftoff shockwave acoustic ripples */}
          {isLaunch && (
            <g>
              <circle
                cx="160"
                cy={110 - centralBodyConfig.radius}
                r="4"
                fill="var(--status-warn)"
                filter="url(#bloom)"
              />
              <circle
                cx="160"
                cy={110 - centralBodyConfig.radius}
                r={10 + (elapsedSeconds % 2) * 12}
                fill="none"
                stroke="var(--status-warn)"
                strokeWidth="1.5"
                opacity={Math.max(0, 0.8 - (elapsedSeconds % 2) * 0.4)}
              />
              <path
                d={`M 160 ${110 - centralBodyConfig.radius} Q 165 ${110 - centralBodyConfig.radius * 0.5} ${scX} ${scY}`}
                fill="none"
                stroke="var(--status-warn)"
                strokeWidth="2"
                strokeDasharray="3 3"
                opacity="0.75"
              />
            </g>
          )}

          {/* Spacecraft Marker with orientation and exhaust plume */}
          <g transform={`translate(${scX}, ${scY}) rotate(${flightAngleDeg})`}>
            {isLaunch && (
              <g>
                <polygon points="-4,6 0,26 4,6" fill="url(#launchPlume)" filter="url(#bloom)" />
                <polygon points="-2,6 0,16 2,6" fill="#FFFFFF" />
              </g>
            )}

            {phase === 'arrival' && (
              <polygon points="-12,0 0,-4 0,4" fill="var(--status-critical)" filter="url(#bloom)" />
            )}

            {/* Spacecraft core marker */}
            <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
            <circle cx="0" cy="0" r="10" fill="none" stroke="var(--mission-accent, #3DA5F5)" strokeWidth="1.5" opacity="0.8" />
            <line x1="0" y1="0" x2={(160 - scX) * 0.25} y2={(110 - scY) * 0.25} stroke="var(--status-good)" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        </svg>

        {/* Phase Telemetry Overlays */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
          className="number-mono"
        >
          <div>
            ALTITUDE: <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{`${currentAltitudeKm} km`}</span>
          </div>
          <div>
            {isLaunch ? 'BOOSTER THRUST: ' : 'BURN Δv: '}
            <span style={{ color: 'var(--status-good)', fontWeight: 700 }}>
              {isLaunch
                ? launchProgress < 0.5
                  ? 'STAGE 1 BOOST'
                  : launchProgress < 0.85
                  ? 'STAGE 2 INSERTION'
                  : 'MECO / FAIRING JETTISON'
                : `${totalBurnDeltaVms} m/s`}
            </span>
          </div>
          <div>
            REV: <span style={{ color: 'var(--mission-accent)', fontWeight: 700 }}>{`${((elapsedSeconds / 60) / realPeriodMinutes).toFixed(1)}`}</span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '12px',
            fontSize: '0.7rem',
            padding: '3px 8px',
            borderRadius: '4px',
            background: 'rgba(11, 16, 32, 0.85)',
            border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
            color: isLaunch ? 'var(--status-warn)' : 'var(--mission-accent)',
            fontWeight: 600,
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          {isLaunch ? 'LIFTOFF SEQUENCE ACTIVE' : `${phase.toUpperCase()} PHASE ACTIVE`}
        </div>
      </div>
    </div>
  );
};
