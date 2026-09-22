/**
 * Slider Component
 * Source: 04-ui-ux-brief.md §5
 *
 * Track in --border-subtle, filled portion in --mission-accent,
 * numeric readout in monospace, live update as dragged.
 */

import React from 'react';

export interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  unit = '',
  onChange,
  disabled = false,
}) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label
          htmlFor={id}
          style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}
        >
          {label}
        </label>
        <span
          className="number-mono"
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          {value.toLocaleString()} {unit}
        </span>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '44px' }}>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value.toLocaleString()} ${unit}`}
          style={{
            width: '100%',
            height: '8px',
            WebkitAppearance: 'none',
            appearance: 'none',
            background: `linear-gradient(to right, var(--mission-accent) 0%, var(--mission-accent) ${percentage}%, var(--border-subtle) ${percentage}%, var(--border-subtle) 100%)`,
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }} className="number-mono">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};
