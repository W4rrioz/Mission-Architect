/**
 * Part Card Component
 * Source: 04-ui-ux-brief.md §5
 *
 * Displays part specifications, cost, mass, selection state, and inline sliders when active.
 */

import React from 'react';
import { PartCatalogEntry } from '../domain/types';
import { Slider } from './Slider';
import { Check, DollarSign, Weight } from 'lucide-react';

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
        background: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
        border: `1px solid ${isSelected ? 'var(--mission-accent)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        boxShadow: isSelected ? 'var(--glow-accent)' : undefined,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', color: isSelected ? 'var(--mission-accent)' : 'var(--text-primary)' }}>
            {part.name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {part.description}
          </p>
        </div>

        <button
          onClick={onSelect}
          className={isSelected ? 'primary' : 'secondary'}
          aria-pressed={isSelected}
          style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
            minHeight: '44px',
            minWidth: '84px',
            flexShrink: 0,
          }}
        >
          {isSelected ? (
            <>
              <Check size={14} />
              <span>Selected</span>
            </>
          ) : (
            <span>Equip</span>
          )}
        </button>
      </div>

      {/* Stats summary row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          paddingTop: 'var(--space-2)',
          borderTop: '1px solid rgba(42, 51, 80, 0.5)',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
          <DollarSign size={14} color="var(--status-good)" />
          <span className="number-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            ${(part.costUSD / 1_000_000).toFixed(1)}M
          </span>
        </div>

        {part.massKg > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
            <Weight size={14} color="var(--mission-earth)" />
            <span className="number-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {part.massKg.toLocaleString()} kg
            </span>
          </div>
        )}

        {/* Category specific quick stats */}
        {'ispSeconds' in part.perfProfile && (
          <div style={{ color: 'var(--text-muted)' }}>
            Isp: <span className="number-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{(part.perfProfile as { ispSeconds: number }).ispSeconds}s</span>
          </div>
        )}
        {'maxPayloadKg' in part.perfProfile && (
          <div style={{ color: 'var(--text-muted)' }}>
            Max Payload: <span className="number-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{((part.perfProfile as { maxPayloadKg: number }).maxPayloadKg).toLocaleString()} kg</span>
          </div>
        )}
        {'panelEfficiency' in part.perfProfile && (
          <div style={{ color: 'var(--text-muted)' }}>
            Efficiency: <span className="number-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{Math.round(((part.perfProfile as { panelEfficiency: number }).panelEfficiency || 0) * 100)}%</span>
          </div>
        )}
        {'ratedWatts' in part.perfProfile && (
          <div style={{ color: 'var(--text-muted)' }}>
            Output: <span className="number-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{(part.perfProfile as { ratedWatts: number }).ratedWatts}W</span>
          </div>
        )}
        {'powerDrawW' in part.perfProfile && (
          <div style={{ color: 'var(--text-muted)' }}>
            Power Draw: <span className="number-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{(part.perfProfile as { powerDrawW: number }).powerDrawW}W</span>
          </div>
        )}
        {'frequencyGHz' in part.perfProfile && (
          <div style={{ color: 'var(--text-muted)' }}>
            Band: <span className="number-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{(part.perfProfile as { frequencyGHz: number }).frequencyGHz} GHz</span>
          </div>
        )}
      </div>

      {/* Tunable sliders when selected */}
      {isSelected && part.sliderRanges && part.sliderRanges.length > 0 && (
        <div
          style={{
            marginTop: 'var(--space-2)',
            padding: 'var(--space-3)',
            background: 'var(--bg-base)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--mission-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Tuning & Telemetry Sliders
          </div>
          {part.sliderRanges.map((range) => {
            const key = `${part.id}.${range.id}`;
            const currentValue = sliderValues[key] !== undefined ? sliderValues[key] : range.defaultValue;

            return (
              <Slider
                key={range.id}
                id={key}
                label={range.label}
                min={range.min}
                max={range.max}
                step={range.step}
                unit={range.unit}
                value={currentValue}
                onChange={(val) => onSliderChange(key, val)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
