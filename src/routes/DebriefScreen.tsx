/**
 * Mission Debrief Screen
 * Source: 01-prd.md §4.6, 03-app-flow.md §3, 04-ui-ux-brief.md §6
 *
 * Displays PASS/FAIL outcome banner, 100-point composite score with 5-component breakdown,
 * "What Went Wrong" diagnostic callout, and side-by-side comparison table against real NASA mission specs.
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MISSIONS } from '../data/missions';
import { MissionId, MissionRunState } from '../domain/types';
import { useDesign } from '../context/DesignContext';
import { useMissionRun } from '../context/MissionRunContext';
import { useProgression } from '../context/ProgressionContext';
import { computeScore } from '../domain/score';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { RealMissionComparisonTable } from '../components/RealMissionComparisonTable';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Compass,
  ArrowRight,
  AlertTriangle,
  Award,
} from 'lucide-react';

import { getPersonalBest, savePersonalBest } from '../domain/personalBest';

export const DebriefScreen: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();

  const validMissionId = (missionId as MissionId) || 'earth-orbit';
  const mission = MISSIONS[validMissionId] || MISSIONS['earth-orbit'];

  const { state: designState, resetDesign } = useDesign();
  const { runState: globalRunState } = useMissionRun();
  const { markMissionCompleted } = useProgression();

  const [isNewRecord, setIsNewRecord] = React.useState(false);
  const [previousBest, setPreviousBest] = React.useState<number | null>(null);

  // Fallback completed state if navigated directly without running simulation
  const runState: MissionRunState = globalRunState || {
    missionId: validMissionId,
    phase: 'endOfMission',
    elapsedSeconds: 360,
    fuelRemainingKg: 180,
    powerBalanceW: 220,
    dataStoredMB: 1200,
    dataDownlinkedMB: mission.minScienceDataMB,
    commsLinkOk: true,
    temperatureK: 288,
    activeDecisionCard: null,
    eventLog: [],
    outcome: 'pass',
    decisionTimerRemaining: 0,
    totalDecisionsMade: 2,
    fastDecisionsCount: 2,
    totalBurnDeltaVms: mission.orbit.requiredDeltaVms,
    requiredBurnDeltaVms: mission.orbit.requiredDeltaVms,
  };

  const score = computeScore(runState, designState, mission);

  React.useEffect(() => {
    markMissionCompleted(validMissionId);
    const existing = getPersonalBest(validMissionId);
    if (existing) {
      setPreviousBest(existing.score);
    }
    const achieved = savePersonalBest(validMissionId, score.total);
    setIsNewRecord(achieved);
  }, [validMissionId, markMissionCompleted, score.total]);

  const missionTint =
    validMissionId === 'moon'
      ? 'var(--mission-moon)'
      : validMissionId === 'mars'
      ? 'var(--mission-mars)'
      : validMissionId === 'asteroid'
      ? 'var(--mission-asteroid)'
      : 'var(--mission-earth)';

  // Determine next mission in campaign progression
  const nextMissionId: MissionId | null =
    validMissionId === 'earth-orbit'
      ? 'moon'
      : validMissionId === 'moon'
      ? 'mars'
      : validMissionId === 'mars'
      ? 'asteroid'
      : null;

  return (
    <div
      style={{
        '--mission-accent': missionTint,
        maxWidth: '1000px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-4) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      } as React.CSSProperties}
    >
      {/* Top Banner: Outcome & Total Composite Score */}
      <div
        style={{
          background:
            score.outcome === 'pass' ? 'rgba(61, 190, 122, 0.12)' : 'rgba(224, 69, 61, 0.12)',
          border: `2px solid ${
            score.outcome === 'pass' ? 'var(--status-good)' : 'var(--status-critical)'
          }`,
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          boxShadow:
            score.outcome === 'pass' ? 'var(--glow-accent)' : 'var(--glow-critical)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background:
                score.outcome === 'pass' ? 'var(--status-good)' : 'var(--status-critical)',
              color: 'var(--bg-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {score.outcome === 'pass' ? (
              <CheckCircle2 size={36} strokeWidth={2.5} />
            ) : (
              <XCircle size={36} strokeWidth={2.5} />
            )}
          </div>

          <div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: score.outcome === 'pass' ? 'var(--status-good)' : 'var(--status-critical)',
              }}
            >
              {`FLIGHT DEBRIEF // ${mission.name.toUpperCase()}`}
            </span>
            <h1
              style={{
                fontSize: '1.8rem',
                color: score.outcome === 'pass' ? 'var(--status-good)' : 'var(--status-critical)',
                lineHeight: 1.2,
                marginTop: '2px',
              }}
            >
              {score.outcome === 'pass' ? 'MISSION SUCCESS — PASS' : 'MISSION FAILED'}
            </h1>
            <p style={{ color: 'var(--text-primary)', marginTop: '4px', fontSize: '0.95rem' }}>
              {score.outcome === 'pass'
                ? `Successfully returned ${Math.round(runState.dataDownlinkedMB).toLocaleString()} MB of science telemetry within operational limits.`
                : runState.failureReason || 'Critical operational limit exceeded during flight.'}
            </p>
          </div>
        </div>

        {/* Large Score Monospace Display */}
        <div style={{ textAlign: 'right', minWidth: '160px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            COMPOSITE SCORE
          </div>
          <div
            className="number-mono"
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: score.outcome === 'pass' ? 'var(--status-good)' : 'var(--status-critical)',
              lineHeight: 1,
            }}
          >
            {score.total}
            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/100</span>
          </div>

          {isNewRecord ? (
            <div
              style={{
                marginTop: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--status-good)',
                background: 'rgba(61, 190, 122, 0.15)',
                border: '1px solid var(--status-good)',
                borderRadius: 'var(--radius-full)',
                padding: '2px 8px',
                display: 'inline-block',
              }}
            >
              ★ NEW PERSONAL BEST!
            </div>
          ) : previousBest !== null ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Personal Best: {previousBest} / 100
            </div>
          ) : null}
        </div>
      </div>

      {/* "What Went Wrong" Callout (Rendered if failed or category scored low) */}
      {score.whatWentWrong && (
        <div
          role="alert"
          style={{
            background:
              score.outcome === 'fail' ? 'rgba(224, 69, 61, 0.1)' : 'rgba(224, 160, 48, 0.1)',
            border: `1px solid ${
              score.outcome === 'fail' ? 'var(--status-critical)' : 'var(--status-warn)'
            }`,
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-3)',
          }}
        >
          <AlertTriangle
            size={22}
            color={score.outcome === 'fail' ? 'var(--status-critical)' : 'var(--status-warn)'}
            style={{ flexShrink: 0, marginTop: '2px' }}
          />
          <div>
            <h3
              style={{
                fontSize: '0.95rem',
                color: score.outcome === 'fail' ? 'var(--status-critical)' : 'var(--status-warn)',
                fontWeight: 700,
              }}
            >
              ENGINEERING DIAGNOSTIC // WHAT WENT WRONG
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '3px', lineHeight: 1.5 }}>
              {score.whatWentWrong}
            </p>
          </div>
        </div>
      )}

      {/* 5-Component Score Breakdown */}
      <ScoreBreakdown score={score} />

      {/* Real NASA Mission Comparison Table */}
      <RealMissionComparisonTable mission={mission} design={designState} />

      {/* Footer Navigation CTA Toolbar */}
      <footer
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          paddingTop: 'var(--space-2)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {/* Primary CTA row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          {/* Secondary actions */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              className="secondary"
              onClick={() => {
                resetDesign(validMissionId);
                navigate(`/missions/${mission.id}/design`);
              }}
              style={{ minHeight: '44px' }}
            >
              <RotateCcw size={16} />
              <span>Retry Mission</span>
            </button>

            <button
              className="secondary"
              onClick={() => navigate('/missions')}
              style={{ minHeight: '44px' }}
            >
              <Compass size={16} />
              <span>Mission Catalog</span>
            </button>
          </div>

          {/* Primary CTA: next mission or return to catalog after final mission */}
          {score.outcome === 'pass' && nextMissionId ? (
            <button
              className="primary"
              onClick={() => {
                resetDesign(nextMissionId);
                navigate(`/missions/${nextMissionId}/briefing`);
              }}
              style={{ padding: '10px 24px', minHeight: '44px' }}
            >
              <Award size={16} />
              <span>{`Proceed to ${MISSIONS[nextMissionId].realMission.name}`}</span>
              <ArrowRight size={16} />
            </button>
          ) : score.outcome === 'pass' && !nextMissionId ? (
            <button
              className="primary"
              onClick={() => navigate('/missions')}
              style={{ padding: '10px 24px', minHeight: '44px' }}
            >
              <Award size={16} />
              <span>Campaign Complete — View All Missions</span>
              <ArrowRight size={16} />
            </button>
          ) : null}
        </div>
      </footer>
    </div>
  );
};
