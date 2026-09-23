/**
 * Pre-flight Review Screen — Stitch AI Aerospace Clearance Console
 * Source: docs/stitch/ & 01-prd.md §4.4, 03-app-flow.md §3, §6, and 04-ui-ux-brief.md §6
 *
 * Comprehensive Flight Readiness Review checklist covering all 7 engineering constraints.
 * Amber/red items identify the responsible hardware category and link directly back to CAD.
 * Hard-blocks launch when budget cap is exceeded; permits high-risk launches for other warnings.
 */

import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MISSIONS } from '../data/missions';
import { MissionId } from '../domain/types';
import { useDesign } from '../context/DesignContext';
import { PreflightChecklistRow } from '../components/PreflightChecklistRow';
import { TutorialBanner } from '../components/TutorialBanner';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Rocket,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

export const PreflightReviewScreen: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();

  const validMissionId = (missionId as MissionId) || 'earth-orbit';
  const mission = MISSIONS[validMissionId] || MISSIONS['earth-orbit'];

  const { state: designState } = useDesign();
  const derived = designState.derived;

  const missionTint =
    validMissionId === 'moon'
      ? 'var(--mission-moon)'
      : validMissionId === 'mars'
      ? 'var(--mission-mars)'
      : validMissionId === 'asteroid'
      ? 'var(--mission-asteroid)'
      : 'var(--mission-earth)';

  // Constraint Evaluations
  const isBudgetBlocked = derived ? derived.costUSD.isOver : false;
  const isMassCritical = derived ? derived.massKg.isOver : false;
  const isDeltaVCritical = derived ? derived.deltaVms.isOver : false;
  const isPowerCritical = derived ? derived.powerW.isOver : false;
  const isCommsCritical = derived ? derived.linkMarginDb.isOver : false;
  const isThermalCritical = derived ? !derived.thermalEquilibriumK.isSafe : false;

  const hasAnyWarnings =
    isMassCritical ||
    isDeltaVCritical ||
    isPowerCritical ||
    isCommsCritical ||
    isThermalCritical ||
    (derived ? derived.massKg.percentage >= 85 || derived.costUSD.percentage >= 85 : false);

  return (
    <div
      style={{
        '--mission-accent': missionTint,
        maxWidth: '1000px',
        margin: '0 auto',
        padding: 'var(--space-4) var(--space-4) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      } as React.CSSProperties}
    >
      {/* Tutorial Guidance Step 4 */}
      {mission.isTutorial && (
        <TutorialBanner
          stepNumber={4}
          title="Flight Readiness Review (FRR)"
          instructions="Inspect all 7 mission constraints. Every checklist item links directly back to its responsible CAD subsystem. Budget compliance is a hard block, while other margins issue operational flight warnings."
          tip="All green checks guarantee safe orbital insertion and nominal telemetry."
        />
      )}

      {/* Stitch Aerospace HUD Header Bar */}
      <header
        className="hud-panel"
        style={{
          padding: '16px 20px',
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
              color: 'var(--status-good, #3DBE7A)',
              marginBottom: '4px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <CheckCircle2 size={15} color="var(--status-good)" />
            <span>FLIGHT READINESS REVIEW // FINAL CHECKLIST</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            {`Pre-flight Review: ${mission.name}`}
          </h1>

          <p
            style={{
              color: 'var(--text-muted, #8FA0C4)',
              fontSize: '0.82rem',
              marginTop: '4px',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            Evaluate engineering margins before committing the launch vehicle. Review subsystem balances against nominal operating envelopes.
          </p>
        </div>

        {/* Navigation Action */}
        <Link to={`/missions/${mission.id}/design`} style={{ textDecoration: 'none' }}>
          <button className="secondary" style={{ padding: '8px 16px', minHeight: '40px', fontSize: '0.8rem' }}>
            <ArrowLeft size={14} />
            <span>Return to CAD Workbench</span>
          </button>
        </Link>
      </header>

      {/* Budget Overrun Hard-Block Alert */}
      {isBudgetBlocked && (
        <div
          role="alert"
          style={{
            background: 'rgba(224, 69, 61, 0.15)',
            border: '2px solid var(--status-critical, #E0453D)',
            borderRadius: '8px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 0 16px rgba(224, 69, 61, 0.3)',
          }}
        >
          <ShieldAlert size={30} color="var(--status-critical)" style={{ flexShrink: 0 }} />
          <div>
            <h3
              style={{
                fontSize: '0.95rem',
                color: 'var(--status-critical)',
                fontWeight: 700,
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                margin: 0,
              }}
            >
              LAUNCH HOLD: MISSION BUDGET CAP EXCEEDED
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: '4px 0 0', lineHeight: 1.4 }}>
              {`Total spacecraft cost ($${((derived?.costUSD.current || 0) / 1_000_000).toFixed(1)}M) exceeds the $${(mission.budgetCapUSD / 1_000_000).toFixed(1)}M congressional appropriation. You must return to Spacecraft CAD and reduce component costs before flight authorization.`}
            </p>
          </div>
        </div>
      )}

      {/* High-Risk Flight Warning (Non-budget amber/red items) */}
      {!isBudgetBlocked && hasAnyWarnings && (
        <div
          role="alert"
          style={{
            background: 'rgba(224, 160, 48, 0.12)',
            border: '1px solid var(--status-warn, #E0A030)',
            borderRadius: '8px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <AlertTriangle size={22} color="var(--status-warn)" style={{ flexShrink: 0 }} />
          <div>
            <h3
              style={{
                fontSize: '0.92rem',
                color: 'var(--status-warn)',
                fontWeight: 700,
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                margin: 0,
              }}
            >
              OPERATIONAL RISK WARNING: MARGINAL FLIGHT PARAMETERS
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: '4px 0 0', lineHeight: 1.4 }}>
              One or more subsystems are operating outside nominal safety margins. Launch is permitted under test flight authorization, but high failure rates or propellant depletion may occur during live mission operations.
            </p>
          </div>
        </div>
      )}

      {/* 7-Constraint Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* 1. Launch Vehicle Mass Capacity */}
        <PreflightChecklistRow
          missionId={validMissionId}
          category="launchVehicle"
          categoryName="Launch Vehicle"
          metricTitle="Booster Payload Mass Capacity"
          status={
            derived?.massKg.isOver
              ? 'critical'
              : (derived?.massKg.percentage || 0) >= 85
              ? 'warning'
              : 'nominal'
          }
          currentDisplay={`${(derived?.massKg.current || 0).toLocaleString()} kg`}
          limitDisplay={`${(derived?.massKg.limit || 0).toLocaleString()} kg max`}
          marginDisplay={`${((derived?.massKg.limit || 0) - (derived?.massKg.current || 0) >= 0 ? '+' : '')}${((derived?.massKg.limit || 0) - (derived?.massKg.current || 0)).toLocaleString()} kg`}
          description="Total spacecraft wet mass (including 20% mass growth contingency) vs. booster lift capacity."
        />

        {/* 2. Program Budget Cap */}
        <PreflightChecklistRow
          missionId={validMissionId}
          category="bus"
          categoryName="Hardware CAD"
          metricTitle="Congressional Budget Cap (Hard Limit)"
          status={
            derived?.costUSD.isOver
              ? 'critical'
              : (derived?.costUSD.percentage || 0) >= 85
              ? 'warning'
              : 'nominal'
          }
          currentDisplay={`$${((derived?.costUSD.current || 0) / 1_000_000).toFixed(1)}M`}
          limitDisplay={`$${(mission.budgetCapUSD / 1_000_000).toFixed(1)}M cap`}
          marginDisplay={`$${((mission.budgetCapUSD - (derived?.costUSD.current || 0)) / 1_000_000).toFixed(1)}M reserve`}
          description="Aggregate program cost across launch vehicle, primary structure, bus avionics, and payload instruments."
        />

        {/* 3. Propulsion Velocity Maneuver Delta-V */}
        <PreflightChecklistRow
          missionId={validMissionId}
          category="propulsion"
          categoryName="Propulsion"
          metricTitle="Orbital Insertion Velocity Margin (Δv)"
          status={
            derived?.deltaVms.isOver
              ? 'critical'
              : (derived?.deltaVms.current || 0) < mission.orbit.requiredDeltaVms * 1.15
              ? 'warning'
              : 'nominal'
          }
          currentDisplay={`${(derived?.deltaVms.current || 0).toLocaleString()} m/s`}
          limitDisplay={`${mission.orbit.requiredDeltaVms.toLocaleString()} m/s req`}
          marginDisplay={`${((derived?.deltaVms.current || 0) - mission.orbit.requiredDeltaVms >= 0 ? '+' : '')}${((derived?.deltaVms.current || 0) - mission.orbit.requiredDeltaVms).toLocaleString()} m/s`}
          description="Velocity increment calculated via Tsiolkovsky rocket equation against required trajectory insertion burns."
        />

        {/* 4. Electrical Power Generation Balance */}
        <PreflightChecklistRow
          missionId={validMissionId}
          category="power"
          categoryName="Power"
          metricTitle="Electrical Bus Generation Balance"
          status={
            derived?.powerW.isOver
              ? 'critical'
              : (derived?.powerW.percentage || 0) >= 85
              ? 'warning'
              : 'nominal'
          }
          currentDisplay={`${(derived?.powerW.current || 0).toLocaleString()} W`}
          limitDisplay={`${(derived?.powerW.limit || 0).toLocaleString()} W req`}
          marginDisplay={`${((derived?.powerW.limit || 0) - (derived?.powerW.current || 0) <= 0 ? '+' : '-')}${Math.abs((derived?.powerW.current || 0) - (derived?.powerW.limit || 0))} W`}
          description={`Photovoltaic generation at ${mission.orbit.solarDistanceAU.toFixed(2)} AU solar flux vs. active electronics demand.`}
        />

        {/* 5. Deep Space Network Link Margin */}
        <PreflightChecklistRow
          missionId={validMissionId}
          category="comms"
          categoryName="Communications"
          metricTitle="Deep Space Network RF Link Margin"
          status={
            derived?.linkMarginDb.isOver
              ? 'critical'
              : (derived?.linkMarginDb.current || 0) < 3.0
              ? 'warning'
              : 'nominal'
          }
          currentDisplay={`${(derived?.linkMarginDb.current || 0) >= 0 ? '+' : ''}${derived?.linkMarginDb.current || 0} dB`}
          limitDisplay="3.0 dB req"
          marginDisplay={`${((derived?.linkMarginDb.current || 0) - 3.0 >= 0 ? '+' : '')}${((derived?.linkMarginDb.current || 0) - 3.0).toFixed(1)} dB`}
          description={`Friis free-space loss across ${(mission.orbit.distanceToEarthKm / 1_000_000).toFixed(1)}M km to DSN 34m aperture.`}
        />

        {/* 6. Stefan-Boltzmann Thermal Radiative Equilibrium */}
        <PreflightChecklistRow
          missionId={validMissionId}
          category="thermal"
          categoryName="Thermal"
          metricTitle="Stefan-Boltzmann Thermal Equilibrium"
          status={
            !derived?.thermalEquilibriumK.isSafe
              ? 'critical'
              : (derived?.thermalEquilibriumK.current || 0) < (derived?.thermalEquilibriumK.minLimit || 0) + 15 ||
                (derived?.thermalEquilibriumK.current || 0) > (derived?.thermalEquilibriumK.maxLimit || 0) - 15
              ? 'warning'
              : 'nominal'
          }
          currentDisplay={`${derived?.thermalEquilibriumK.current || 0} K (${(derived?.thermalEquilibriumK.current || 273) - 273}°C)`}
          limitDisplay={`${derived?.thermalEquilibriumK.minLimit || 0}–${derived?.thermalEquilibriumK.maxLimit || 0} K`}
          marginDisplay={derived?.thermalEquilibriumK.isSafe ? 'STABLE' : 'OUT OF LIMITS'}
          description="Passive MLI insulation and absorptivity/emissivity equilibrium under direct solar radiation."
        />

        {/* 7. Subsystem Hardware Reliability */}
        <PreflightChecklistRow
          missionId={validMissionId}
          category="redundancy"
          categoryName="Redundancy"
          metricTitle="Subsystem Hardware Reliability Rating"
          status={
            (derived?.reliabilityEstimate || 0) >= 0.85
              ? 'nominal'
              : (derived?.reliabilityEstimate || 0) >= 0.70
              ? 'warning'
              : 'critical'
          }
          currentDisplay={`${Math.round((derived?.reliabilityEstimate || 0) * 100)}%`}
          limitDisplay="85% target"
          marginDisplay={`${Math.round(((derived?.reliabilityEstimate || 0) - 0.85) * 100) >= 0 ? '+' : ''}${Math.round(((derived?.reliabilityEstimate || 0) - 0.85) * 100)}%`}
          description="Avionics reliability, fault detection voting logic, and backup systems reducing anomaly frequency."
        />
      </div>

      {/* Flight Authorization Sticky Launch Footer Bar */}
      <footer
        style={{
          background: 'var(--panel-elevated, #162038)',
          border: '1px solid var(--border-hairline, rgba(42, 51, 80, 0.6))',
          borderRadius: '8px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: 'var(--space-2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isBudgetBlocked ? (
            <ShieldAlert size={22} color="var(--status-critical)" />
          ) : hasAnyWarnings ? (
            <AlertTriangle size={22} color="var(--status-warn)" />
          ) : (
            <ShieldCheck size={22} color="var(--status-good)" />
          )}

          <div>
            <div
              style={{
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: isBudgetBlocked ? 'var(--status-critical)' : hasAnyWarnings ? 'var(--status-warn)' : 'var(--status-good)',
                letterSpacing: '0.04em',
              }}
            >
              {isBudgetBlocked
                ? 'FLIGHT AUTHORIZATION DENIED // BUDGET CAP EXCEEDED'
                : hasAnyWarnings
                ? 'CAUTION: MARGINAL OPERATIONAL ENVELOPE'
                : 'FLIGHT CLEARED FOR DEEP SPACE // ALL 7 CONSTRAINTS NOMINAL'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
              {isBudgetBlocked
                ? 'Congressional hard ceiling blocks ignition. Reduce component costs in CAD.'
                : hasAnyWarnings
                ? 'Proceeding with non-optimal margins may result in telemetry anomalies.'
                : 'All engineering parameters verified. Cleared for launch pad ignition.'}
            </div>
          </div>
        </div>

        <button
          className="primary"
          disabled={isBudgetBlocked}
          onClick={() => navigate(`/missions/${validMissionId}/run`)}
          style={{
            padding: '10px 24px',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            boxShadow: !isBudgetBlocked ? '0 0 16px rgba(61, 165, 245, 0.4)' : undefined,
            minHeight: '44px',
            opacity: isBudgetBlocked ? 0.4 : 1,
            cursor: isBudgetBlocked ? 'not-allowed' : 'pointer',
          }}
        >
          <Rocket size={16} />
          <span>Authorize Launch & Enter Mission Control</span>
          <ArrowRight size={16} />
        </button>
      </footer>
    </div>
  );
};
