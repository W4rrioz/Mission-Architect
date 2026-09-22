/**
 * Spacecraft Design Screen
 * Source: 01-prd.md §4.3, 03-app-flow.md §3, 04-ui-ux-brief.md §5, §6
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MISSIONS } from '../data/missions';
import { PARTS_BY_CATEGORY } from '../data/parts';
import { PartCategory, MissionId } from '../domain/types';
import { useDesign } from '../context/DesignContext';
import { Gauge } from '../components/Gauge';
import { CategoryTabs } from '../components/CategoryTabs';
import { PartCard } from '../components/PartCard';
import { SpacecraftPreview } from '../components/SpacecraftPreview';
import { TutorialBanner } from '../components/TutorialBanner';
import { ArrowLeft, ArrowRight, AlertOctagon } from 'lucide-react';

export const SpacecraftDesignScreen: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const validMissionId = (missionId as MissionId) || 'earth-orbit';
  const mission = MISSIONS[validMissionId] || MISSIONS['earth-orbit'];

  const { state, selectPart, setSlider, setMission } = useDesign();
  const [activeCategory, setActiveCategory] = useState<PartCategory>('launchVehicle');

  // Sync design context's missionId to match the URL whenever we land on this screen
  useEffect(() => {
    if (state.missionId !== validMissionId) {
      setMission(validMissionId);
    }
  }, [validMissionId, state.missionId, setMission]);

  // Dynamic mission tint per 04-ui-ux-brief.md §3
  const missionTint =
    validMissionId === 'moon'
      ? 'var(--mission-moon)'
      : validMissionId === 'mars'
      ? 'var(--mission-mars)'
      : validMissionId === 'asteroid'
      ? 'var(--mission-asteroid)'
      : 'var(--mission-earth)';

  const availableParts = PARTS_BY_CATEGORY[activeCategory] || [];
  const hasLaunchVehicle = Boolean(state.selectedParts.launchVehicle);
  const isBudgetExceeded = state.derived.costUSD.isOver;

  return (
    <div
      style={{
        '--mission-accent': missionTint,
        maxWidth: 'var(--max-content-width)',
        margin: '0 auto',
        padding: 'var(--space-4) var(--space-4) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      } as React.CSSProperties}
    >
      {mission.isTutorial && (
        <TutorialBanner
          stepNumber={3}
          title="Hardware CAD Integration"
          instructions="Equip parts across all 8 subsystem tabs. Start by picking a Launch Vehicle (Atlas V 401 or Falcon). Adjust sliders (fuel fill, solar area, antenna dish) to balance mass, power, comms, and thermal equilibrium."
          tip="Pre-flight review is unlocked as soon as a launch vehicle is chosen."
        />
      )}

      {/* Header Bar */}
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-3)',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 'var(--space-4)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--mission-accent)',
              letterSpacing: '0.12em',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '2px',
            }}
          >
            PHASE II: SYSTEM INTEGRATION & HARDWARE CAD
          </div>
          <h1 style={{ fontSize: '1.75rem', lineHeight: 1.2 }}>
            {mission.name}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Benchmark: NASA {mission.realMission.name} | Budget Limit: ${(mission.budgetCapUSD / 1_000_000).toFixed(0)}M USD
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Link to={`/missions/${mission.id}/briefing`}>
            <button className="secondary" style={{ padding: '8px 16px', minHeight: '44px' }}>
              <ArrowLeft size={16} />
              <span>Briefing</span>
            </button>
          </Link>

          <div>
            <Link
              to={hasLaunchVehicle ? `/missions/${mission.id}/preflight` : '#'}
              aria-disabled={!hasLaunchVehicle}
              tabIndex={hasLaunchVehicle ? 0 : -1}
              style={{ pointerEvents: hasLaunchVehicle ? 'auto' : 'none', textDecoration: 'none' }}
            >
              <button
                className="primary"
                disabled={!hasLaunchVehicle}
                style={{ padding: '8px 20px', minHeight: '44px' }}
                title={!hasLaunchVehicle ? 'Select a Launch Vehicle before proceeding' : 'Proceed to Pre-flight Review'}
              >
                <span>Pre-flight Review</span>
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Live Constraint Gauges (2x4 Desktop / 2x2 or 1-col Mobile Grid) */}
      <section aria-label="System constraint telemetry">
        <div
          className="gauges-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          {/* Budget Gauge */}
          <Gauge
            label="Total Program Cost"
            currentValue={`$${(state.derived.costUSD.current / 1_000_000).toFixed(1)}M`}
            limitValue={`$${(state.derived.costUSD.limit / 1_000_000).toFixed(0)}M`}
            percentage={state.derived.costUSD.percentage}
            status={state.derived.costUSD.isOver ? 'critical' : state.derived.costUSD.percentage >= 85 ? 'warn' : 'good'}
            subtitle={isBudgetExceeded ? 'BUDGET EXCEEDED' : 'Hard mission limit'}
          />

          {/* Mass Budget Gauge */}
          <Gauge
            label="Payload Mass vs Booster"
            currentValue={state.derived.massKg.current}
            limitValue={state.derived.massKg.limit > 0 ? state.derived.massKg.limit : 'NO LV'}
            unit="kg"
            percentage={state.derived.massKg.percentage}
            status={state.derived.massKg.isOver ? 'critical' : state.derived.massKg.percentage >= 85 ? 'warn' : 'good'}
            subtitle="Includes 20% dry growth margin"
          />

          {/* Propulsion / Delta-V Gauge */}
          <Gauge
            label="Available Velocity Margin"
            currentValue={state.derived.deltaVms.current}
            limitValue={state.derived.deltaVms.limit}
            unit="m/s"
            percentage={state.derived.deltaVms.percentage}
            status={state.derived.deltaVms.isOver ? 'critical' : state.derived.deltaVms.percentage < 100 ? 'warn' : 'good'}
            subtitle="Tsiolkovsky Rocket Equation"
          />

          {/* Power Budget Gauge */}
          <Gauge
            label="Power Load vs Generation"
            currentValue={state.derived.powerW.current}
            limitValue={state.derived.powerW.limit}
            unit="W"
            percentage={state.derived.powerW.percentage}
            status={state.derived.powerW.isOver ? 'critical' : state.derived.powerW.percentage >= 85 ? 'warn' : 'good'}
            subtitle="Solar flux inverse-square law"
          />

          {/* Communications Link Margin */}
          <Gauge
            label="Communications Link Margin"
            currentValue={`${state.derived.linkMarginDb.current >= 0 ? '+' : ''}${state.derived.linkMarginDb.current}`}
            limitValue="0.0"
            unit="dB"
            percentage={state.derived.linkMarginDb.percentage}
            status={state.derived.linkMarginDb.isOver ? 'critical' : state.derived.linkMarginDb.current < 3 ? 'warn' : 'good'}
            subtitle="DSN X/Ka-band Friis link budget"
          />

          {/* Thermal Radiative Equilibrium */}
          <Gauge
            label="Thermal Equilibrium"
            currentValue={state.derived.thermalEquilibriumK.current}
            limitValue={`${state.derived.thermalEquilibriumK.minLimit}-${state.derived.thermalEquilibriumK.maxLimit}`}
            unit="K"
            percentage={state.derived.thermalEquilibriumK.isSafe ? 50 : 100}
            status={state.derived.thermalEquilibriumK.isSafe ? 'good' : 'critical'}
            subtitle="Stefan-Boltzmann radiative balance"
          />
        </div>
      </section>

      {/* Main Workbench Layout: Responsive Workbench Grid (Stacked on Mobile, Side-by-Side on Desktop) */}
      <div className="workbench-grid">
        {/* Left Column: Subsystem Categories & Part Catalog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            selectedParts={state.selectedParts}
          />

          {/* Category description & available parts list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {availableParts.map((part) => {
              const isSelected = state.selectedParts[activeCategory] === part.id;
              return (
                <PartCard
                  key={part.id}
                  part={part}
                  isSelected={isSelected}
                  onSelect={() => selectPart(activeCategory, part.id)}
                  sliderValues={state.sliderValues}
                  onSliderChange={(sliderKey, val) => setSlider(sliderKey, val)}
                />
              );
            })}
          </div>
        </div>

        {/* Right Column: Spacecraft CAD Schematic Preview & Telemetry Digest */}
        <aside style={{ position: 'sticky', top: 'var(--space-4)' }}>
          <SpacecraftPreview design={state} derived={state.derived} />

          {/* Inline notification if Launch Vehicle is missing */}
          {!hasLaunchVehicle && (
            <div
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3)',
                background: 'rgba(224, 69, 61, 0.12)',
                border: '1px solid var(--status-critical)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-2)',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
              }}
            >
              <AlertOctagon size={16} color="var(--status-critical)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--status-critical)' }}>Missing Launch Vehicle</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  A booster rocket must be integrated to calculate mass margins and unlock Pre-flight review.
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
