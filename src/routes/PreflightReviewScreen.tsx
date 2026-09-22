/**
 * Pre-flight Review Screen
 * Source: 01-prd.md §4.4, 03-app-flow.md §3, §6, and 04-ui-ux-brief.md §6
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
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-4) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
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

      {/* Screen Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
          <CheckCircle2 size={18} color="var(--status-good)" />
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            FLIGHT READINESS REVIEW // FINAL CHECKLIST
          </span>
        </div>

        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
          {`Pre-flight Review: ${mission.name}`}
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Evaluate engineering margins before committing the launch vehicle. Review subsystem balances against nominal operating envelopes.
        </p>
      </div>

      {/* Budget Overrun Hard-Block Alert */}
      {isBudgetBlocked && (
        <div
          role="alert"
          style={{
            background: 'rgba(224, 69, 61, 0.15)',
            border: '2px solid var(--status-critical)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            boxShadow: 'var(--glow-critical)',
          }}
        >
          <ShieldAlert size={32} color="var(--status-critical)" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--status-critical)', fontWeight: 700 }}>
              LAUNCH HOLD: MISSION BUDGET CAP EXCEEDED
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px' }}>
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
            border: '1px solid var(--status-warn)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <AlertTriangle size={24} color="var(--status-warn)" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--status-warn)', fontWeight: 700 }}>
              OPERATIONAL RISK WARNING: MARGINAL FLIGHT PARAMETERS
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              One or more subsystems are operating outside nominal safety margins. Launch is permitted under test flight authorization, but high failure rates or propellant depletion may occur during live mission operations.
            </p>
          </div>
        </div>
      )}

      {/* 7-Constraint Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
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
              : (derived?.powerW.limit || 0) - (derived?.powerW.current || 0) < 50
              ? 'warning'
              : 'nominal'
          }
          currentDisplay={`${(derived?.powerW.limit || 0).toLocaleString()} W gen`}
          limitDisplay={`${(derived?.powerW.current || 0).toLocaleString()} W load`}
          marginDisplay={`${((derived?.powerW.limit || 0) - (derived?.powerW.current || 0) >= 0 ? '+' : '')}${((derived?.powerW.limit || 0) - (derived?.powerW.current || 0)).toLocaleString()} W`}
          description="Solar array generation at target solar distance vs. simultaneous avionics and instrument power draw."
        />

        {/* 5. Deep Space Network Comms Link Margin */}
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
          currentDisplay={`${(derived?.linkMarginDb.current || 0).toFixed(1)} dB`}
          limitDisplay="0.0 dB threshold"
          marginDisplay={`${(derived?.linkMarginDb.current || 0) >= 0 ? '+' : ''}${(derived?.linkMarginDb.current || 0).toFixed(1)} dB`}
          description="Friis free-space transmission budget across maximum Earth distance to guarantee telemetry lock."
        />

        {/* 6. Thermal Radiative Equilibrium Band */}
        <PreflightChecklistRow
          missionId={validMissionId}
          category="thermal"
          categoryName="Thermal"
          metricTitle="Stefan-Boltzmann Thermal Equilibrium"
          status={derived?.thermalEquilibriumK.isSafe ? 'nominal' : 'critical'}
          currentDisplay={`${derived?.thermalEquilibriumK.current || 288} K`}
          limitDisplay={`${derived?.thermalEquilibriumK.minLimit || 180}–${derived?.thermalEquilibriumK.maxLimit || 320} K`}
          marginDisplay={derived?.thermalEquilibriumK.isSafe ? 'NOMINAL BAND' : 'TEMPERATURE EXTREME'}
          description="Passive radiative equilibrium temperature balancing solar absorption against infrared radiation."
        />

        {/* 7. Subsystem Hardware Reliability Estimate */}
        <PreflightChecklistRow
          missionId={validMissionId}
          category="redundancy"
          categoryName="Redundancy"
          metricTitle="Subsystem Hardware Reliability Rating"
          status={
            (derived?.reliabilityEstimate || 0) >= 0.90
              ? 'nominal'
              : (derived?.reliabilityEstimate || 0) >= 0.80
              ? 'warning'
              : 'critical'
          }
          currentDisplay={`${((derived?.reliabilityEstimate || 0.9) * 100).toFixed(1)}%`}
          limitDisplay="90.0% nominal"
          marginDisplay={`${((derived?.reliabilityEstimate || 0.9) * 100).toFixed(1)}% MTBF`}
          description="Exponential constant-failure-rate reliability model incorporating cross-strapped parallel redundancy."
        />
      </div>

      {/* Action Footer Navigation */}
      <footer
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-3)',
          paddingTop: 'var(--space-3)',
        }}
      >
        <Link to={`/missions/${mission.id}/design`} className="mobile-full-width" style={{ textDecoration: 'none' }}>
          <button className="secondary mobile-full-width" style={{ minHeight: '44px' }}>
            <ArrowLeft size={16} />
            <span>Return to Hardware CAD</span>
          </button>
        </Link>

        <button
          className="primary mobile-full-width"
          disabled={isBudgetBlocked}
          onClick={() => navigate(`/missions/${mission.id}/control`)}
          style={{
            padding: '12px 28px',
            minHeight: '44px',
            backgroundColor: isBudgetBlocked ? 'var(--bg-surface)' : 'var(--status-good)',
            borderColor: isBudgetBlocked ? 'var(--border-subtle)' : 'var(--status-good)',
            color: isBudgetBlocked ? 'var(--text-muted)' : 'var(--bg-base)',
            fontWeight: 700,
            cursor: isBudgetBlocked ? 'not-allowed' : 'pointer',
            boxShadow: !isBudgetBlocked ? 'var(--glow-accent)' : undefined,
          }}
        >
          <Rocket size={18} />
          <span>Authorize Launch & Enter Mission Control</span>
          <ArrowRight size={18} />
        </button>
      </footer>
    </div>
  );
};
