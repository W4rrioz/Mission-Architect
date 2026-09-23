/**
 * Category Tabs Component — Stitch AI Aerospace Console
 * Source: docs/stitch/07-cad-workbench.html & 04-ui-ux-brief.md §5
 *
 * 8-Subsystem numbered pill tabs matching Stitch CAD Workbench:
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
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % CATEGORIES.length;
      onSelectCategory(CATEGORIES[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + CATEGORIES.length) % CATEGORIES.length;
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
      role="tablist"
      aria-label="Spacecraft subsystems"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '2px 0 6px 0',
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
              padding: '7px 12px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              letterSpacing: '0.04em',
              background: isActive ? 'var(--mission-accent, #3DA5F5)' : 'var(--panel-base, #111728)',
              color: isActive ? '#0A0F1D' : 'var(--text-muted, #8FA0C4)',
              border: `1px solid ${isActive ? 'var(--mission-accent, #3DA5F5)' : 'var(--border-hairline, rgba(42, 51, 80, 0.6))'}`,
              boxShadow: isActive ? '0 0 12px rgba(61, 165, 245, 0.35)' : undefined,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              minHeight: '36px',
              transition: 'all 150ms ease',
            }}
          >
            <span style={{ opacity: isActive ? 1 : 0.7 }}>
              [{cat.number}]
            </span>
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            {isConfigured && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: isActive ? '#0A0F1D' : 'var(--status-good, #3DBE7A)',
                  color: isActive ? 'var(--mission-accent, #3DA5F5)' : '#0A0F1D',
                  marginLeft: '2px',
                }}
              >
                <Check size={10} strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
