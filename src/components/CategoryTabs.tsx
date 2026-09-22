/**
 * Category Tabs Component
 * Source: 04-ui-ux-brief.md §5
 *
 * Pill-shaped tabs: inactive = outline, active = filled with mission tint.
 * Shows status indicator for configured categories.
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
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryTabItem[] = [
  { id: 'launchVehicle', label: 'Launch Vehicle', icon: <Rocket size={15} /> },
  { id: 'bus', label: 'Spacecraft Bus', icon: <Box size={15} /> },
  { id: 'power', label: 'Power System', icon: <Sun size={15} /> },
  { id: 'propulsion', label: 'Propulsion & Fuel', icon: <Flame size={15} /> },
  { id: 'comms', label: 'Communications', icon: <Radio size={15} /> },
  { id: 'instrument', label: 'Instruments', icon: <Eye size={15} /> },
  { id: 'thermal', label: 'Thermal Protection', icon: <Shield size={15} /> },
  { id: 'redundancy', label: 'Redundancy', icon: <Layers size={15} /> },
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
        flexWrap: 'wrap',
        gap: 'var(--space-2)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: 'var(--space-2)',
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
              borderRadius: '24px',
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.03em',
              background: isActive ? 'var(--mission-accent)' : 'transparent',
              color: isActive ? 'var(--bg-base)' : 'var(--text-primary)',
              border: `1px solid ${isActive ? 'var(--mission-accent)' : 'var(--border-subtle)'}`,
              boxShadow: isActive ? 'var(--glow-accent)' : undefined,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              whiteSpace: 'nowrap',
              minHeight: '44px',
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            {isConfigured && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--bg-base)' : 'var(--status-good)',
                  color: isActive ? 'var(--mission-accent)' : 'var(--bg-base)',
                  marginLeft: '4px',
                }}
              >
                <Check size={11} strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
