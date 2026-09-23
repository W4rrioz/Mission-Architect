/**
 * Part Card Component — Stitch AI Aerospace Part Spec Card
 * Source: docs/stitch/07-cad-workbench.html & 04-ui-ux-brief.md §5
 *
 * Displays part specifications, 3-column technical monospace specs grid,
 * selection state badge, and inline dynamic sliders.
 */

import React from 'react';
import { PartCatalogEntry } from '../domain/types';
import { Slider } from './Slider';
import { Check, Zap } from 'lucide-react';

export interface PartCardProps {
  part: PartCatalogEntry;
  isSelected: boolean;
  onSelect: () => void;
  sliderValues: Record<string, number>;
  onSliderChange: (sliderKey: string, value: number) => void;
}

export const PartCard: React.FC<PartCardProps> = ({
  part,
  isSelected,
  onSelect,
  sliderValues,
  onSliderChange,
}) => {
  return (
    <div
      style={{
        background: isSelected ? 'var(--panel-elevated, #162038)' : 'var(--panel-base, #111728)',
        border: `1px solid ${isSelected ? 'var(--mission-accent, #3DA5F5)' : 'var(--border-hairline, rgba(42, 51, 80, 0.6))'}`,
        borderRadius: '8px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'all 150ms ease',
        boxShadow: isSelected ? '0 0 16px rgba(61, 165, 245, 0.2)' : undefined,
        position: 'relative',
      }}
    >
      {/* Card Header: Part Name & Equip / Selected Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              border: `2px solid ${isSelected ? 'var(--mission-accent, #3DA5F5)' : 'var(--border-hairline, rgba(42, 51, 80, 0.6))'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isSelected && (
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--mission-accent, #3DA5F5)',
                }}
              />
            )}
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              {part.name}
            </h3>
          </div>
        </div>

        <button
          onClick={onSelect}
          className={isSelected ? 'primary' : 'secondary'}
          aria-pressed={isSelected}
          style={{
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            minHeight: '36px',
            minWidth: '84px',
            flexShrink: 0,
            borderRadius: '4px',
            background: isSelected ? 'var(--mission-accent, #3DA5F5)' : 'var(--panel-elevated, #162038)',
            color: isSelected ? '#0A0F1D' : 'var(--text-primary)',
            border: `1px solid ${isSelected ? 'var(--mission-accent, #3DA5F5)' : 'var(--border-hairline, rgba(42, 51, 80, 0.6))'}`,
          }}
        >
          {isSelected ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Check size={12} strokeWidth={3} />
              <span>Selected</span>
            </span>
          ) : (
            <span>Equip</span>
          )}
        </button>
      </div>

      {/* Part Description */}
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #8FA0C4)', margin: 0, lineHeight: 1.45 }}>
        {part.description}
      </p>

      {/* Technical Monospace Specs Grid (Stitch 3-Column Specs Matrix) */}
      <div
        className="specs-matrix"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          background: 'var(--deep-space, #0A0F1D)',
          padding: '8px 10px',
          borderRadius: '4px',
          border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.5))',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.72rem',
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
            Base Cost
          </span>
          <span style={{ fontWeight: 700, color: 'var(--status-good, #3DBE7A)' }}>
            ${(part.costUSD / 1_000_000).toFixed(1)}M
          </span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
            Dry Mass
          </span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {part.massKg > 0 ? `${part.massKg.toLocaleString()} kg` : '0 kg'}
          </span>
        </div>

        <div>
          {'ispSeconds' in part.perfProfile ? (
            <>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                Isp (Impulse)
              </span>
              <span style={{ fontWeight: 700, color: 'var(--mission-accent, #3DA5F5)' }}>
                {(part.perfProfile as { ispSeconds: number }).ispSeconds}s
              </span>
            </>
          ) : 'maxPayloadKg' in part.perfProfile ? (
            <>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                Payload Cap
              </span>
              <span style={{ fontWeight: 700, color: 'var(--mission-accent, #3DA5F5)' }}>
                {((part.perfProfile as { maxPayloadKg: number }).maxPayloadKg / 1000).toFixed(1)}t
              </span>
            </>
          ) : 'ratedWatts' in part.perfProfile ? (
            <>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                Output
              </span>
              <span style={{ fontWeight: 700, color: 'var(--status-warn, #E0A030)' }}>
                {(part.perfProfile as { ratedWatts: number }).ratedWatts}W
              </span>
            </>
          ) : 'maxStorageMb' in part.perfProfile ? (
            <>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                Data Storage
              </span>
              <span style={{ fontWeight: 700, color: 'var(--mission-accent, #3DA5F5)' }}>
                {((part.perfProfile as { maxStorageMb: number }).maxStorageMb / 1000).toFixed(0)}k MB
              </span>
            </>
          ) : (
            <>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                Subsystem
              </span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                CERTIFIED
              </span>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Sliders when Part is Selected */}
      {isSelected && part.sliderRanges && part.sliderRanges.length > 0 && (
        <div
          style={{
            background: 'var(--panel-base, #111728)',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Zap size={12} color="var(--mission-accent)" />
            <span>Subsystem Scaling Sliders</span>
          </div>

          {part.sliderRanges.map((slider) => {
            const currentVal = sliderValues[`${part.id}.${slider.id}`] ?? slider.defaultValue;
            return (
              <Slider
                key={slider.id}
                id={`${part.id}.${slider.id}`}
                label={slider.label}
                value={currentVal}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                unit={slider.unit}
                onChange={(val) => onSliderChange(`${part.id}.${slider.id}`, val)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
