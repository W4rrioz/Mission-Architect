/**
 * Spacecraft CAD Engineering Workbench Screen
 * Source: docs/stitch/07-cad-workbench.html, 01-prd.md §4.3, 03-app-flow.md §3, 04-ui-ux-brief.md §5, §6
 *
 * Full-fidelity aerospace CAD workbench featuring:
 * - Zone 1: Live constraint telemetry matrix status bar (7 gauges with NOM / CAUTION / VIOLATION legend)
 * - Zone 2: 8 Subsystem manifest pill tabs & interactive part catalog with 3-column specs matrix & sliders
 * - Zone 3: 2D technical orthographic blueprint schematic canvas
 * - Zone 4: Sticky bottom flight bill of materials summary & Proceed to Pre-flight CTA
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
import { ArrowLeft, ArrowRight, AlertOctagon, Activity } from 'lucide-react';

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

  // Active subsystem briefing description
  const categoryBriefings: Record<PartCategory, { title: string; desc: string }> = {
    launchVehicle: {
      title: 'LAUNCH VEHICLE & BOOSTER STAGE',
      desc: `Select a primary launch vehicle with sufficient payload capacity to inject the spacecraft into ${mission.orbit.regime}.`,
    },
    bus: {
      title: 'SPACECRAFT BUS & CENTRAL STRUCTURE',
      desc: 'Central load-bearing structure providing avionics mounting, structural damping, and mechanical interface rings.',
    },
    power: {
      title: 'POWER GENERATION & STORAGE (SOLAR / RTG)',
      desc: `Generate electrical wattage at ${mission.orbit.solarDistanceAU.toFixed(2)} AU solar flux to satisfy orbital subsystems and instrument payload.`,
    },
    propulsion: {
      title: 'PROPULSION & TRAJECTORY MANEUVER SYSTEM',
      desc: `Target maneuver budget requires minimum ${mission.orbit.requiredDeltaVms.toLocaleString()} m/s delta-v for orbital insertion and trajectory trims.`,
    },
    comms: {
      title: 'TELECOMMUNICATIONS & RF LINK MARGIN',
      desc: `Parabolic dish and transponder sized to maintain positive link margin across ${(mission.orbit.distanceToEarthKm / 1_000_000).toFixed(1)}M km to DSN antennas.`,
    },
    instrument: {
      title: 'PRIMARY SCIENCE INSTRUMENTS & PAYLOAD',
      desc: `Science complement required to collect at least ${(mission.minScienceDataMB / 1000).toFixed(0)}k MB of mission research data.`,
    },
    thermal: {
      title: 'THERMAL PROTECTION & MLI INSULATION',
      desc: 'Multilayer insulation blankets and radiative louvers maintaining Stefan-Boltzmann thermal equilibrium.',
    },
    redundancy: {
      title: 'AVIONICS REDUNDANCY & FAULT DETECTION',
      desc: 'Flight computer voting logic and secondary redundant buses ensuring mission longevity.',
    },
  };

  const activeBriefing = categoryBriefings[activeCategory] || categoryBriefings.launchVehicle;

  return (
    <div
      style={{
        '--mission-accent': missionTint,
        maxWidth: 'var(--max-content-width)',
        margin: '0 auto',
        padding: 'var(--space-4) var(--space-4) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
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

      {/* Stitch Screen 07 Aerospace HUD Header Bar */}
      <header
        className="hud-panel"
        style={{
          padding: '12px 16px',
          borderTop: `3px solid var(--mission-accent)`,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.7rem',
              color: 'var(--mission-accent)',
              letterSpacing: '0.08em',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '2px',
            }}
          >
            <span className="status-led good" style={{ width: '6px', height: '6px' }} />
            <span>PHASE II: SYSTEM INTEGRATION // HARDWARE CAD</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
              lineHeight: 1.2,
              letterSpacing: '0.03em',
              margin: 0,
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
            }}
          >
            {mission.name}
          </h1>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono, monospace)',
              margin: '2px 0 0 0',
            }}
          >
            BENCHMARK: NASA {mission.realMission.name.toUpperCase()} | CEILING: ${(mission.budgetCapUSD / 1_000_000).toFixed(0)}M USD | TARGET: {mission.orbit.regime.toUpperCase()}
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Link to={`/missions/${mission.id}/briefing`} style={{ textDecoration: 'none' }}>
            <button className="secondary" style={{ padding: '6px 14px', minHeight: '38px', fontSize: '0.8rem' }}>
              <ArrowLeft size={14} />
              <span>Dossier</span>
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
                style={{
                  padding: '8px 18px',
                  minHeight: '38px',
                  fontSize: '0.8rem',
                  boxShadow: hasLaunchVehicle ? '0 0 14px rgba(61, 165, 245, 0.35)' : undefined,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
                title={!hasLaunchVehicle ? 'Select a Launch Vehicle before proceeding' : 'Proceed to Pre-flight Review'}
              >
                <span>[ PROCEED TO PRE-FLIGHT REVIEW ]</span>
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ZONE 1: LIVE CONSTRAINT MARGIN TELEMETRY MATRIX (7 LIVE GAUGES) */}
      <section
        aria-label="System constraint telemetry"
        style={{
          background: 'var(--panel-base, #111728)',
          border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
          borderRadius: '8px',
          padding: '12px 14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={14} color="var(--mission-accent)" />
            <span
              style={{
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              LIVE CONSTRAINT MARGIN TELEMETRY MATRIX
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.68rem',
            }}
          >
            <span style={{ color: 'var(--status-good, #3DBE7A)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: 'currentColor' }} />
              NOMINAL (&lt;85%)
            </span>
            <span style={{ color: 'var(--status-warn, #E0A030)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: 'currentColor' }} />
              CAUTION (&ge;85%)
            </span>
            <span style={{ color: 'var(--status-critical, #E0453D)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: 'currentColor' }} />
              VIOLATION (&ge;100%)
            </span>
          </div>
        </div>

        {/* 7 Telemetry Constraint Cards Grid */}
        <div
          className="gauges-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
            gap: '8px',
          }}
        >
          {/* 1. Program Cost */}
          <Gauge
            indexNumber={1}
            label="Total Program Cost"
            currentValue={`$${(state.derived.costUSD.current / 1_000_000).toFixed(1)}M`}
            limitValue={`$${(state.derived.costUSD.limit / 1_000_000).toFixed(0)}M`}
            percentage={state.derived.costUSD.percentage}
            status={state.derived.costUSD.isOver ? 'critical' : state.derived.costUSD.percentage >= 85 ? 'warn' : 'good'}
            subtitle={isBudgetExceeded ? 'BUDGET EXCEEDED' : 'Congressional Cap'}
          />

          {/* 2. Wet Mass */}
          <Gauge
            indexNumber={2}
            label="Payload Mass vs Booster"
            currentValue={state.derived.massKg.current}
            limitValue={state.derived.massKg.limit > 0 ? state.derived.massKg.limit : 'NO LV'}
            unit="kg"
            percentage={state.derived.massKg.percentage}
            status={state.derived.massKg.isOver ? 'critical' : state.derived.massKg.percentage >= 85 ? 'warn' : 'good'}
            subtitle="Payload vs Booster"
          />

          {/* 3. Delta-V */}
          <Gauge
            indexNumber={3}
            label="Available Velocity Margin"
            currentValue={state.derived.deltaVms.current}
            limitValue={state.derived.deltaVms.limit}
            unit="m/s"
            percentage={state.derived.deltaVms.percentage}
            status={state.derived.deltaVms.isOver ? 'critical' : state.derived.deltaVms.percentage < 100 ? 'warn' : 'good'}
            subtitle="Trajectory Maneuver"
          />

          {/* 4. Solar Power */}
          <Gauge
            indexNumber={4}
            label="Power Load vs Generation"
            currentValue={state.derived.powerW.current}
            limitValue={state.derived.powerW.limit}
            unit="W"
            percentage={state.derived.powerW.percentage}
            status={state.derived.powerW.isOver ? 'critical' : state.derived.powerW.percentage >= 85 ? 'warn' : 'good'}
            subtitle="Load vs Generation"
          />

          {/* 5. Thermal Env */}
          <Gauge
            indexNumber={5}
            label="Thermal Equilibrium"
            currentValue={state.derived.thermalEquilibriumK.current}
            limitValue={`${state.derived.thermalEquilibriumK.minLimit}-${state.derived.thermalEquilibriumK.maxLimit}`}
            unit="K"
            percentage={state.derived.thermalEquilibriumK.isSafe ? 50 : 100}
            status={state.derived.thermalEquilibriumK.isSafe ? 'good' : 'critical'}
            subtitle="Stefan-Boltzmann"
          />

          {/* 6. DSN Link */}
          <Gauge
            indexNumber={6}
            label="Communications Link Margin"
            currentValue={`${state.derived.linkMarginDb.current >= 0 ? '+' : ''}${state.derived.linkMarginDb.current}`}
            limitValue="0.0"
            unit="dB"
            percentage={state.derived.linkMarginDb.percentage}
            status={state.derived.linkMarginDb.isOver ? 'critical' : state.derived.linkMarginDb.current < 3 ? 'warn' : 'good'}
            subtitle="Friis Link Budget"
          />

          {/* 7. System Reliability */}
          <Gauge
            indexNumber={7}
            label="Reliability"
            currentValue={`${(state.derived.reliabilityEstimate * 100).toFixed(1)}%`}
            limitValue="100%"
            percentage={Math.round(state.derived.reliabilityEstimate * 100)}
            status={state.derived.reliabilityEstimate >= 0.85 ? 'good' : state.derived.reliabilityEstimate >= 0.70 ? 'warn' : 'critical'}
            subtitle="Fault Probability"
          />
        </div>
      </section>

      {/* Main Interactive Split Workspace: Zone 2 (Catalog) & Zone 3 (Blueprint Canvas) */}
      <div className="workbench-grid">
        {/* Left Column: Subsystem Categories & Part Catalog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* 8 Pill Tabs */}
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            selectedParts={state.selectedParts}
          />

          {/* Active Subsystem Briefing Banner */}
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--panel-elevated, #162038)',
              borderLeft: '3px solid var(--mission-accent, #3DA5F5)',
              border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
              borderRadius: '6px',
            }}
          >
            <h4
              style={{
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mission-accent)' }} />
              {activeBriefing.title}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0', lineHeight: 1.45 }}>
              {activeBriefing.desc}
            </p>
          </div>

          {/* Parts list */}
          <div
            id={`panel-${activeCategory}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeCategory}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
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
        <aside style={{ position: 'sticky', top: '16px' }}>
          <SpacecraftPreview design={state} derived={state.derived} />

          {/* Missing Launch Vehicle warning */}
          {!hasLaunchVehicle && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 12px',
                background: 'rgba(224, 69, 61, 0.12)',
                border: '1px solid var(--status-critical)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.78rem',
                color: 'var(--text-primary)',
              }}
            >
              <AlertOctagon size={16} color="var(--status-critical)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--status-critical)' }}>Missing Launch Vehicle</strong>
                <p style={{ color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  A booster rocket must be integrated to calculate mass margins and unlock Pre-flight review.
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ZONE 4: BOTTOM STICKY SUMMARY & MISSION PROCEED CTA BAR */}
      <footer
        style={{
          background: 'var(--panel-elevated, #162038)',
          border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}
          >
            FLIGHT BILL OF MATERIALS // SUMMARY
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.85rem',
            }}
          >
            <span>
              TOTAL COST: <strong style={{ color: isBudgetExceeded ? 'var(--status-critical)' : 'var(--status-good)' }}>${(state.derived.costUSD.current / 1_000_000).toFixed(1)}M</strong>
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>
              WET MASS: <strong style={{ color: state.derived.massKg.isOver ? 'var(--status-critical)' : '#FFFFFF' }}>{state.derived.massKg.current.toLocaleString()} kg</strong>
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>
              Δv BUDGET: <strong style={{ color: state.derived.deltaVms.isOver ? 'var(--status-critical)' : 'var(--status-good)' }}>{state.derived.deltaVms.current.toLocaleString()} m/s</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            to={hasLaunchVehicle ? `/missions/${mission.id}/preflight` : '#'}
            aria-disabled={!hasLaunchVehicle}
            tabIndex={hasLaunchVehicle ? 0 : -1}
            style={{ pointerEvents: hasLaunchVehicle ? 'auto' : 'none', textDecoration: 'none' }}
          >
            <button
              className="primary"
              disabled={!hasLaunchVehicle}
              style={{
                padding: '8px 20px',
                minHeight: '40px',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                boxShadow: hasLaunchVehicle ? '0 0 12px rgba(61, 165, 245, 0.3)' : undefined,
              }}
            >
              <span>[ PROCEED TO PRE-FLIGHT REVIEW ]</span>
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </footer>
    </div>
  );
};
