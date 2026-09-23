/**
 * Spacecraft Dynamic SVG Preview Panel — Stitch AI Aerospace CAD Blueprint
 * Source: docs/stitch/07-cad-workbench.html & 04-ui-ux-brief.md §3, §5, §6
 *
 * High-density 2D orthographic technical blueprint featuring:
 * - Hexagonal bus core with avionics bays & propellant tank silhouette
 * - Dual articulating solar wings with photovoltaic `#solarGrid` pattern
 * - Dynamic parabolic high-gain dish antenna with curvature scaling
 * - Gimballed propulsion nozzle bell with simulated thrust cone
 * - Science magnetometer & UV sensor heads
 * - Dimension arrows (Wingspan & Total Height) and coordinate crosshairs
 * - Real-time mass & telemetry readout overlay pill
 */

import React from 'react';
import { SpacecraftDesign, DerivedGauges } from '../domain/types';
import { PARTS } from '../data/parts';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export interface SpacecraftPreviewProps {
  design: SpacecraftDesign;
  derived: DerivedGauges;
}

export const SpacecraftPreview: React.FC<SpacecraftPreviewProps> = ({
  design,
  derived,
}) => {
  const partMap = new Map(PARTS.map((p) => [p.id, p]));

  const busPart = design.selectedParts.bus ? partMap.get(design.selectedParts.bus) : null;
  const powerPart = design.selectedParts.power ? partMap.get(design.selectedParts.power) : null;
  const propPart = design.selectedParts.propulsion ? partMap.get(design.selectedParts.propulsion) : null;
  const commsPart = design.selectedParts.comms ? partMap.get(design.selectedParts.comms) : null;
  const lvPart = design.selectedParts.launchVehicle ? partMap.get(design.selectedParts.launchVehicle) : null;

  // Dynamic dimensions based on sliders
  const arrayAreaM2 =
    powerPart && design.sliderValues[`${powerPart.id}.arrayAreaM2`] !== undefined
      ? design.sliderValues[`${powerPart.id}.arrayAreaM2`]
      : 11.4;

  const dishDiameterM =
    commsPart && design.sliderValues[`${commsPart.id}.dishDiameterM`] !== undefined
      ? design.sliderValues[`${commsPart.id}.dishDiameterM`]
      : 2.0;

  // Visual scaling factors for Stitch blueprint (viewBox 0 0 600 480)
  // Base panel width is ~130px at 11.4 m2
  const panelScale = Math.max(0.5, Math.min(1.5, arrayAreaM2 / 11.4));
  const panelWidth = Math.round(130 * panelScale);
  const leftPanelX = 200 - panelWidth;
  const rightPanelX = 400;

  // Dish antenna arc radius based on dishDiameterM
  const dishSpan = Math.max(16, Math.min(55, Math.round(dishDiameterM * 20)));

  // Wingspan text
  const totalWingspanM = (arrayAreaM2 * 1.0).toFixed(2);

  // Subsystem count
  const equippedCount = Object.values(design.selectedParts).filter(Boolean).length;

  return (
    <div
      style={{
        background: 'var(--panel-base, #111728)',
        border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
        borderRadius: 'var(--radius-lg, 8px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Blueprint Top Header Bar */}
      <div
        style={{
          background: 'var(--panel-elevated, #162038)',
          borderBottom: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: 'var(--mission-accent, #3DA5F5)',
              boxShadow: '0 0 8px var(--mission-accent, #3DA5F5)',
            }}
          />
          <h3
            style={{
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            SCHEMATIC VISUALIZER // BLUEPRINT
          </h3>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>SCALE: 1:25</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span
            className="number-mono"
            style={{
              color: equippedCount >= 7 ? 'var(--status-good)' : 'var(--status-warn)',
              fontWeight: 700,
            }}
          >
            {equippedCount} / 8 SUBSYSTEMS
          </span>
        </div>
      </div>

      {/* Blueprint Canvas with Grid & Crosshairs */}
      <div
        className="blueprint-grid"
        style={{
          width: '100%',
          minHeight: '340px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '16px',
        }}
      >
        {/* Center Coordinate Crosshairs */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '100%', height: '1px', background: 'rgba(42, 51, 80, 0.45)' }} />
          <div style={{ position: 'absolute', height: '100%', width: '1px', background: 'rgba(42, 51, 80, 0.45)' }} />
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '12px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '9px',
              color: 'rgba(143, 160, 196, 0.5)',
              letterSpacing: '0.05em',
            }}
          >
            +Z NADIR / SCIENCE INSTRUMENTS
          </span>
          <span
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '12px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '9px',
              color: 'rgba(143, 160, 196, 0.5)',
              letterSpacing: '0.05em',
            }}
          >
            -Z PROPULSION EXHAUST
          </span>
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '12px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '9px',
              color: 'rgba(143, 160, 196, 0.5)',
              letterSpacing: '0.05em',
            }}
          >
            +Y / -Y SOLAR BOOMS
          </span>
        </div>

        {/* Dynamic 2D Vector Spacecraft Cross-Section */}
        <svg
          viewBox="0 0 600 480"
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '380px',
            filter: 'drop-shadow(0 0 12px rgba(61, 165, 245, 0.2))',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <defs>
            {/* Solar cell photovoltaic texture */}
            <pattern id="stitchSolarGrid" width="12" height="12" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" fill="#132448" stroke="#3DA5F5" strokeWidth="0.75" strokeOpacity="0.6" />
              <line x1="0" y1="6" x2="12" y2="6" stroke="#3DA5F5" strokeWidth="0.3" strokeOpacity="0.4" />
            </pattern>

            {/* Metallic Bus Linear Gradient */}
            <linearGradient id="stitchBusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#243358" />
              <stop offset="50%" stopColor="#162038" />
              <stop offset="100%" stopColor="#0E172A" />
            </linearGradient>

            {/* Thrust Plume Gradient */}
            <radialGradient id="stitchNozzleGrad" cx="50%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#E0703D" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#E0453D" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0B1020" stopOpacity="0" />
            </radialGradient>

            {/* Dimension Line Marker */}
            <marker id="stitchArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#8FA0C4" />
            </marker>
          </defs>

          {/* SENSORS & BOOMS */}
          <line x1="300" y1="130" x2="300" y2="55" stroke="#E6ECF8" strokeWidth="2.5" />
          <circle cx="300" cy="50" r="6" fill="#3DA5F5" stroke="#E6ECF8" strokeWidth="1.5" />
          <line x1="288" y1="50" x2="312" y2="50" stroke="#3DA5F5" strokeWidth="1.5" />
          <text x="316" y="54" fill="#8FA0C4" fontFamily="'JetBrains Mono', monospace" fontSize="9">
            SWEA / MAG BOOM
          </text>

          {/* IUVS Ultraviolet Spectrograph Sensor Head */}
          <rect x="285" y="115" width="30" height="15" fill="#C9D3EA" stroke="#162038" strokeWidth="1.5" rx="2" />
          <circle cx="300" cy="122" r="3" fill="#E0703D" />

          {/* LEFT SOLAR ARRAY WING */}
          {powerPart ? (
            <g id="solar-wing-left">
              <rect
                x={leftPanelX}
                y="195"
                width={panelWidth}
                height="70"
                rx="3"
                fill="url(#stitchSolarGrid)"
                stroke="#3DA5F5"
                strokeWidth="1.5"
              />
              <rect x="205" y="200" width="30" height="60" fill="#182542" stroke="#2A3350" strokeWidth="1" rx="2" />
              <line x1="205" y1="230" x2="245" y2="230" stroke="#E6ECF8" strokeWidth="3" />
              <line x1={leftPanelX} y1="195" x2={leftPanelX} y2="265" stroke="#3DA5F5" strokeWidth="3" />
              <text x={leftPanelX + 6} y="210" fill="#8FA0C4" fontFamily="'JetBrains Mono', monospace" fontSize="9">
                SOLAR WING 1 (-Y)
              </text>
            </g>
          ) : (
            <rect x="120" y="210" width="80" height="40" fill="none" stroke="#2A3350" strokeDasharray="3 3" rx="2" />
          )}

          {/* RIGHT SOLAR ARRAY WING */}
          {powerPart ? (
            <g id="solar-wing-right">
              <line x1="355" y1="230" x2="395" y2="230" stroke="#E6ECF8" strokeWidth="3" />
              <rect x="365" y="200" width="30" height="60" fill="#182542" stroke="#2A3350" strokeWidth="1" rx="2" />
              <rect
                x={rightPanelX}
                y="195"
                width={panelWidth}
                height="70"
                rx="3"
                fill="url(#stitchSolarGrid)"
                stroke="#3DA5F5"
                strokeWidth="1.5"
              />
              <line x1={rightPanelX + panelWidth} y1="195" x2={rightPanelX + panelWidth} y2="265" stroke="#3DA5F5" strokeWidth="3" />
              <text x={rightPanelX + 8} y="210" fill="#8FA0C4" fontFamily="'JetBrains Mono', monospace" fontSize="9">
                SOLAR WING 2 (+Y)
              </text>
            </g>
          ) : (
            <rect x="400" y="210" width="80" height="40" fill="none" stroke="#2A3350" strokeDasharray="3 3" rx="2" />
          )}

          {/* CENTRAL HEXAGONAL SPACECRAFT BUS */}
          {busPart ? (
            <g id="hex-bus-core">
              <polygon
                points="245,170 355,170 380,230 355,290 245,290 220,230"
                fill="url(#stitchBusGrad)"
                stroke="var(--mission-accent, #3DA5F5)"
                strokeWidth="2"
              />
              {/* Tactical Panel Seams */}
              <line x1="245" y1="170" x2="355" y2="290" stroke="#2A3350" strokeWidth="1" />
              <line x1="355" y1="170" x2="245" y2="290" stroke="#2A3350" strokeWidth="1" />
              <rect x="270" y="200" width="60" height="60" rx="4" fill="#0E172A" stroke="#2A3350" strokeWidth="1.5" />

              {/* Central Propellant Tank Silhouette */}
              <circle cx="300" cy="230" r="22" fill="#1A2644" stroke="#E0703D" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="300" y="233" fill="#E0703D" fontFamily="'JetBrains Mono', monospace" fontSize="8" textAnchor="middle">
                PROP TANK
              </text>
              <circle cx="300" cy="208" r="4" fill="#3DA5F5" />
            </g>
          ) : (
            <g id="hex-bus-placeholder">
              <polygon
                points="245,170 355,170 380,230 355,290 245,290 220,230"
                fill="rgba(19, 26, 48, 0.6)"
                stroke="#2A3350"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x="300" y="234" fill="#8FA0C4" fontFamily="'JetBrains Mono', monospace" fontSize="10" textAnchor="middle">
                [NO BUS INTEGRATED]
              </text>
            </g>
          )}

          {/* HIGH-GAIN PARABOLIC DISH ANTENNA */}
          {commsPart && (
            <g id="hga-antenna" transform="translate(0, 0)">
              <line x1="280" y1="150" x2="280" y2="105" stroke="#8FA0C4" strokeWidth="1.5" />
              <path
                d={`M ${280 - dishSpan},${125 - dishSpan / 4} Q 280,140 ${280 + dishSpan},${125 - dishSpan / 4}`}
                fill="none"
                stroke="#E6ECF8"
                strokeWidth="3"
              />
              <circle cx="280" cy="125" r="3" fill="#E0703D" />
              <line x1="280" y1="125" x2="280" y2="110" stroke="#E0703D" strokeWidth="1.5" />
              <text x="280" y="96" fill="#8FA0C4" fontFamily="'JetBrains Mono', monospace" fontSize="9" textAnchor="middle">
                HGA DISH ({dishDiameterM.toFixed(1)}m)
              </text>
            </g>
          )}

          {/* PROPULSION ENGINE NOZZLE & PLUME */}
          {propPart && (
            <g id="prop-engine">
              <path d="M 285,290 L 280,335 L 320,335 L 315,290 Z" fill="#1C2744" stroke="#E0703D" strokeWidth="2" />
              <ellipse cx="300" cy="335" rx="20" ry="5" fill="#E0703D" stroke="#FFA49E" strokeWidth="1" />
              <polygon points="280,336 320,336 340,390 260,390" fill="url(#stitchNozzleGrad)" />
              <text x="300" y="360" fill="#E0703D" fontFamily="'JetBrains Mono', monospace" fontSize="8" textAnchor="middle">
                170N REA NOZZLE
              </text>
            </g>
          )}

          {/* ATTITUDE CONTROL THRUSTERS (ACS) QUADS */}
          {busPart && (
            <>
              <rect x="215" y="222" width="6" height="16" fill="#E0703D" rx="1" />
              <rect x="379" y="222" width="6" height="16" fill="#E0703D" rx="1" />
            </>
          )}

          {/* ANNOTATED DIMENSION ARROWS */}
          {powerPart && (
            <g id="dimension-lines">
              <line
                x1={leftPanelX}
                y1="415"
                x2={rightPanelX + panelWidth}
                y2="415"
                stroke="#8FA0C4"
                strokeWidth="1"
                markerStart="url(#stitchArrow)"
                markerEnd="url(#stitchArrow)"
              />
              <text
                x="300"
                y="432"
                fill="#E6ECF8"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                WINGSPAN: {totalWingspanM} m (SOLAR EXTENDED)
              </text>
            </g>
          )}

          <line x1="45" y1="50" x2="45" y2="335" stroke="#8FA0C4" strokeWidth="1" markerStart="url(#stitchArrow)" markerEnd="url(#stitchArrow)" />
          <text
            x="34"
            y="200"
            fill="#8FA0C4"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="10"
            transform="rotate(-90 34 200)"
            textAnchor="middle"
          >
            TOTAL HEIGHT: 3.15 m
          </text>
        </svg>

        {/* Real-Time Mass & Power Overlay Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(11, 16, 32, 0.85)',
            border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
            backdropFilter: 'blur(8px)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span>DRY MASS:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
              {(derived.massKg.current - (design.sliderValues[`${propPart?.id}.propellantMassKg`] || 0)).toLocaleString()} kg
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span>TOTAL WET:</span>
            <span style={{ color: derived.massKg.isOver ? 'var(--status-critical)' : '#FFFFFF', fontWeight: 'bold' }}>
              {derived.massKg.current.toLocaleString()} kg
            </span>
          </div>
        </div>
      </div>

      {/* Booster Configuration Footer Strip */}
      <div
        style={{
          background: 'var(--panel-elevated, #162038)',
          borderTop: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {lvPart ? (
            <>
              <CheckCircle2 size={16} color="var(--status-good, #3DBE7A)" />
              <span style={{ color: 'var(--text-primary)' }}>
                Booster Integrated: <strong>{lvPart.name}</strong>
              </span>
            </>
          ) : (
            <>
              <AlertTriangle size={16} color="var(--status-critical, #E0453D)" />
              <span style={{ color: 'var(--status-critical, #E0453D)', fontWeight: 600 }}>
                Launch Vehicle required to proceed to Pre-flight
              </span>
            </>
          )}
        </div>

        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          RELIABILITY: <strong style={{ color: 'var(--text-primary)' }}>{(derived.reliabilityEstimate * 100).toFixed(1)}%</strong>
        </div>
      </div>
    </div>
  );
};
