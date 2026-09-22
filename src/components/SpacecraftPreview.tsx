/**
 * Spacecraft Dynamic SVG Preview Panel
 * Source: 04-ui-ux-brief.md §3, §5, §6
 *
 * Hand-built inline SVG silhouette that dynamically scales solar array wings,
 * antenna dish, bus structure, and engine nozzle according to equipped parts and sliders.
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
      : 12.0;

  const dishDiameterM =
    commsPart && design.sliderValues[`${commsPart.id}.dishDiameterM`] !== undefined
      ? design.sliderValues[`${commsPart.id}.dishDiameterM`]
      : 1.3;

  // Visual scaling factors
  const wingLength = Math.max(30, Math.min(85, arrayAreaM2 * 2.8));
  const dishRadius = Math.max(12, Math.min(26, dishDiameterM * 8));

  // Equipped subsystem count
  const equippedCount = Object.values(design.selectedParts).filter(Boolean).length;

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          SCHEMATIC VISUALIZER
        </h3>
        <span
          className="number-mono"
          style={{
            fontSize: '0.8rem',
            color: equippedCount >= 7 ? 'var(--status-good)' : 'var(--status-warn)',
            fontWeight: 700,
          }}
        >
          {equippedCount} / 8 SUBSYSTEMS
        </span>
      </div>

      {/* SVG Canvas */}
      <div
        style={{
          width: '100%',
          height: '240px',
          background: 'radial-gradient(circle at center, rgba(19, 26, 48, 0.95) 0%, rgba(11, 16, 32, 1) 100%)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(42, 51, 80, 0.4)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox="0 0 320 200"
          style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 8px rgba(61, 165, 245, 0.25))' }}
        >
          {/* Coordinate grid lines */}
          <line x1="160" y1="20" x2="160" y2="180" stroke="rgba(42, 51, 80, 0.4)" strokeDasharray="3 3" />
          <line x1="40" y1="100" x2="280" y2="100" stroke="rgba(42, 51, 80, 0.4)" strokeDasharray="3 3" />

          {/* Left Solar Wing */}
          {powerPart && (
            <g transform="translate(160, 100)">
              {/* Left arm */}
              <line x1="-30" y1="0" x2={-30 - wingLength} y2="0" stroke="var(--border-subtle)" strokeWidth="3" />
              {/* Left panels */}
              <rect
                x={-30 - wingLength}
                y="-16"
                width={wingLength}
                height="32"
                fill="rgba(61, 165, 245, 0.2)"
                stroke="var(--mission-earth)"
                strokeWidth="1.5"
                rx="2"
              />
              <line x1={-30 - wingLength * 0.5} y1="-16" x2={-30 - wingLength * 0.5} y2="16" stroke="var(--mission-earth)" strokeWidth="1" opacity="0.6" />
            </g>
          )}

          {/* Right Solar Wing */}
          {powerPart && (
            <g transform="translate(160, 100)">
              {/* Right arm */}
              <line x1="30" y1="0" x2={30 + wingLength} y2="0" stroke="var(--border-subtle)" strokeWidth="3" />
              {/* Right panels */}
              <rect
                x="30"
                y="-16"
                width={wingLength}
                height="32"
                fill="rgba(61, 165, 245, 0.2)"
                stroke="var(--mission-earth)"
                strokeWidth="1.5"
                rx="2"
              />
              <line x1={30 + wingLength * 0.5} y1="-16" x2={30 + wingLength * 0.5} y2="16" stroke="var(--mission-earth)" strokeWidth="1" opacity="0.6" />
            </g>
          )}

          {/* High-Gain Dish Antenna (top) */}
          {commsPart && (
            <g transform="translate(160, 60)">
              <line x1="0" y1="0" x2="0" y2="-12" stroke="var(--text-muted)" strokeWidth="2" />
              <path
                d={`M ${-dishRadius} ${-12} Q 0 ${-12 - dishRadius * 0.6} ${dishRadius} ${-12}`}
                fill="none"
                stroke="var(--mission-accent)"
                strokeWidth="2.5"
              />
              <line x1="0" y1={-12 - dishRadius * 0.3} x2="0" y2={-12 - dishRadius * 0.7} stroke="var(--status-good)" strokeWidth="1.5" />
            </g>
          )}

          {/* Central Spacecraft Bus */}
          <g transform="translate(160, 100)">
            {busPart ? (
              <polygon
                points="-26,-28 26,-28 32,20 -32,20"
                fill="var(--bg-surface-elevated)"
                stroke="var(--mission-accent)"
                strokeWidth="2"
              />
            ) : (
              <rect
                x="-24"
                y="-24"
                width="48"
                height="48"
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                rx="4"
              />
            )}

            {/* Core telemetry indicator light */}
            <circle cx="0" cy="-4" r="5" fill="var(--status-good)" opacity="0.85" />
            <circle cx="0" cy="-4" r="10" fill="none" stroke="var(--status-good)" strokeWidth="1" opacity="0.4" />
          </g>

          {/* Propulsion Rocket Engine Nozzle (bottom) */}
          {propPart && (
            <g transform="translate(160, 122)">
              <polygon
                points="-10,0 10,0 16,18 -16,18"
                fill="rgba(224, 112, 61, 0.3)"
                stroke="var(--mission-mars)"
                strokeWidth="1.5"
              />
              <line x1="-12" y1="18" x2="12" y2="18" stroke="var(--mission-mars)" strokeWidth="2" />
            </g>
          )}
        </svg>

        {!busPart && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}
          >
            Select a Spacecraft Bus to begin integration
          </div>
        )}
      </div>

      {/* Quick Telemetry Digest */}
      <div
        style={{
          background: 'var(--bg-base)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: 'var(--space-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Launch Configuration:</span>
          <span style={{ color: lvPart ? 'var(--status-good)' : 'var(--status-critical)', fontWeight: 600 }}>
            {lvPart ? lvPart.name : 'NO LAUNCH VEHICLE'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Wet Mass:</span>
          <span className="number-mono" style={{ color: derived.massKg.isOver ? 'var(--status-critical)' : 'var(--text-primary)', fontWeight: 700 }}>
            {derived.massKg.current.toLocaleString()} kg
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Total Program Cost:</span>
          <span className="number-mono" style={{ color: derived.costUSD.isOver ? 'var(--status-critical)' : 'var(--status-good)', fontWeight: 700 }}>
            ${(derived.costUSD.current / 1_000_000).toFixed(1)}M
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>System Reliability Est.:</span>
          <span className="number-mono" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
            {(derived.reliabilityEstimate * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Launch Vehicle Warning */}
      {!lvPart ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(224, 69, 61, 0.12)',
            border: '1px solid var(--status-critical)',
            color: 'var(--status-critical)',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          <AlertTriangle size={15} />
          <span>Launch Vehicle required to proceed to Pre-flight</span>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(61, 190, 122, 0.1)',
            border: '1px solid var(--status-good)',
            color: 'var(--status-good)',
            fontSize: '0.75rem',
          }}
        >
          <CheckCircle2 size={15} color="var(--status-good)" />
          <span>Booster integrated: {lvPart.name}</span>
        </div>
      )}
    </div>
  );
};
