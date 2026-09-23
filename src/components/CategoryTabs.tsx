/**
 * Category Tabs Component — Stitch AI Aerospace Console
 * Source: docs/stitch/07-cad-workbench.html & 04-ui-ux-brief.md §5
 *
 * 8-Subsystem manifest bays arranged in a non-scrollable responsive aerospace grid.
 * All 8 subsystem buttons are 100% visible simultaneously without any horizontal scroll bar:
 * [1] LAUNCH VEHICLE, [2] BUS STRUCTURE, [3] POWER & SOLAR, [4] PROPULSION,
 * [5] COMMS, [6] INSTRUMENTS, [7] THERMAL MLI, [8] REDUNDANCY.
 */

import React from 'react';
import { PartCategory } from '../domain/types';
import {
  Rocket,
  Box,
  Sun,
  Flame,
  Radio,
  Eye,
  Shield,
  Layers,
  Check,
} from 'lucide-react';

export interface CategoryTabItem {
  id: PartCategory;
  number: number;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryTabItem[] = [
  { id: 'launchVehicle', number: 1, label: 'Launch Vehicle', shortLabel: 'LAUNCH', icon: <Rocket size={14} /> },
  { id: 'bus', number: 2, label: 'Spacecraft Bus', shortLabel: 'BUS', icon: <Box size={14} /> },
  { id: 'power', number: 3, label: 'Power System', shortLabel: 'POWER', icon: <Sun size={14} /> },
  { id: 'propulsion', number: 4, label: 'Propulsion & Fuel', shortLabel: 'PROP', icon: <Flame size={14} /> },
  { id: 'comms', number: 5, label: 'Communications', shortLabel: 'COMMS', icon: <Radio size={14} /> },
  { id: 'instrument', number: 6, label: 'Instruments', shortLabel: 'PAYLOAD', icon: <Eye size={14} /> },
  { id: 'thermal', number: 7, label: 'Thermal Protection', shortLabel: 'THERMAL', icon: <Shield size={14} /> },
  { id: 'redundancy', number: 8, label: 'Redundancy', shortLabel: 'AVIONICS', icon: <Layers size={14} /> },
];

export interface CategoryTabsProps {
  activeCategory: PartCategory;
  onSelectCategory: (category: PartCategory) => void;
  selectedParts: Partial<Record<PartCategory, string>>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  selectedParts,
}) => {
  const equippedCount = CATEGORIES.filter((c) => Boolean(selectedParts[c.id])).length;

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 4 : 1;
      const nextIndex = (index + step) % CATEGORIES.length;
      onSelectCategory(CATEGORIES[nextIndex].id);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowUp' ? 4 : 1;
      const prevIndex = (index - step + CATEGORIES.length) % CATEGORIES.length;
      onSelectCategory(CATEGORIES[prevIndex].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSelectCategory(CATEGORIES[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      onSelectCategory(CATEGORIES[CATEGORIES.length - 1].id);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
      }}
    >
      {/* Manifest Status Bar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 2px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--text-muted, #8FA0C4)',
              textTransform: 'uppercase',
            }}
          >
            SUBSYSTEM INTEGRATION MANIFEST
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '3px',
              background: equippedCount === 8 ? 'rgba(61, 190, 122, 0.15)' : 'rgba(61, 165, 245, 0.12)',
              color: equippedCount === 8 ? 'var(--status-good, #3DBE7A)' : 'var(--mission-accent, #3DA5F5)',
              border: `1px solid ${equippedCount === 8 ? 'rgba(61, 190, 122, 0.4)' : 'rgba(61, 165, 245, 0.3)'}`,
            }}
          >
            {equippedCount} / 8 CONFIGURED
          </span>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.68rem',
            color: 'var(--text-muted, #8FA0C4)',
          }}
        >
          ALL BAYS ACTIVE
        </span>
      </div>

      {/* 8 Subsystem Buttons — Non-scrollable 4x2 responsive grid */}
      <div
        role="tablist"
        aria-label="Spacecraft subsystems"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
          gap: '8px',
          width: '100%',
        }}
      >
        {CATEGORIES.map((cat, index) => {
          const isActive = activeCategory === cat.id;
          const isConfigured = Boolean(selectedParts[cat.id]);

          return (
            <button
              key={cat.id}
              id={`tab-${cat.id}`}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              aria-controls={`panel-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                letterSpacing: '0.02em',
                background: isActive
                  ? 'var(--panel-elevated, #162038)'
                  : 'var(--panel-base, #111728)',
                color: isActive ? '#FFFFFF' : 'var(--text-muted, #8FA0C4)',
                border: `1.5px solid ${
                  isActive
                    ? 'var(--mission-accent, #3DA5F5)'
                    : isConfigured
                    ? 'rgba(61, 190, 122, 0.35)'
                    : 'var(--border-hairline, rgba(42, 51, 80, 0.6))'
                }`,
                boxShadow: isActive
                  ? '0 0 12px rgba(61, 165, 245, 0.3), inset 0 0 8px rgba(61, 165, 245, 0.1)'
                  : undefined,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '6px',
                minHeight: '52px',
                textAlign: 'left',
                transition: 'all 150ms ease',
                position: 'relative',
              }}
            >
              {/* Top row: [Number] + Icon and Configured Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.7rem',
                    color: isActive ? 'var(--mission-accent, #3DA5F5)' : 'inherit',
                  }}
                >
                  <span style={{ opacity: 0.7 }}>[{cat.number}]</span>
                  <span>{cat.icon}</span>
                </div>

                {/* Subsystem status badge */}
                {isConfigured ? (
                  <span
                    title="Subsystem Configured"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      background: 'var(--status-good, #3DBE7A)',
                      color: '#0A0F1D',
                    }}
                  >
                    <Check size={10} strokeWidth={3.5} />
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'rgba(143, 160, 196, 0.3)',
                    }}
                  />
                )}
              </div>

              {/* Bottom row: Subsystem Name */}
              <span
                style={{
                  lineHeight: 1.25,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {cat.label}
              </span>

              {/* Active bottom accent bar */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '6px',
                    right: '6px',
                    height: '2px',
                    background: 'var(--mission-accent, #3DA5F5)',
                    borderRadius: '2px 2px 0 0',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
