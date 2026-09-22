/**
 * Live Mission Control Screen
 * Source: 01-prd.md §4.5, 03-app-flow.md §3, 04-ui-ux-brief.md §5, §6
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MISSIONS } from '../data/missions';
import { MissionId, MissionRunState } from '../domain/types';
import { useDesign } from '../context/DesignContext';
import { useMissionRun } from '../context/MissionRunContext';
import { useProgression } from '../context/ProgressionContext';
import { startMissionRun, advanceClock, resolveDecisionCard } from '../domain/missionRun';
import { OrbitView } from '../components/OrbitView';
import { TimelineStrip } from '../components/TimelineStrip';
import { Gauge } from '../components/Gauge';
import { EventLog } from '../components/EventLog';
import { DecisionCardModal } from '../components/DecisionCardModal';
import { TutorialBanner } from '../components/TutorialBanner';
import {
  Play,
  Pause,
  FastForward,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Radio,
  Eye,
  ArrowRight,
} from 'lucide-react';

function formatClock(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `T+ ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const LiveMissionControlScreen: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();
  const validMissionId = (missionId as MissionId) || 'earth-orbit';
  const mission = MISSIONS[validMissionId] || MISSIONS['earth-orbit'];

  const { state: designState } = useDesign();
  const { setRunState: setGlobalRunState } = useMissionRun();

  // Initialize mission run state
  const [runState, setLocalRunState] = useState<MissionRunState>(() =>
    startMissionRun(designState, mission)
  );

  const [simSpeed, setSimSpeed] = useState<number>(1); // 0 = pause, 1 = 1x, 2 = 2x, 5 = 5x
  const [instrumentsActive, setInstrumentsActive] = useState(true);
  const [downlinkActive, setDownlinkActive] = useState(true);

  // Keep ref for tick loop
  const runStateRef = useRef<MissionRunState>(runState);
  runStateRef.current = runState;

  const simSpeedRef = useRef<number>(simSpeed);
  simSpeedRef.current = simSpeed;

  const { markMissionCompleted } = useProgression();

  // Sync to global context when mission concludes (pass/fail),
  // preventing 60fps root re-render stampedes during flight operations
  useEffect(() => {
    if (runState.outcome !== null) {
      setGlobalRunState(runState);
      markMissionCompleted(validMissionId);
    }
  }, [runState.outcome, runState, setGlobalRunState, validMissionId, markMissionCompleted]);

  // Ensure latest telemetry is persisted to global context if unmounted/navigated away
  useEffect(() => {
    return () => {
      setGlobalRunState(runStateRef.current);
    };
  }, [setGlobalRunState]);

  // Main simulation tick loop (requestAnimationFrame with 20Hz throttled state dispatch)
  useEffect(() => {
    let lastTime = performance.now();
    let accumulatedDt = 0;
    let animId: number;

    const tick = (time: number) => {
      const realDt = (time - lastTime) / 1000;
      lastTime = time;

      const currentSpeed = simSpeedRef.current;
      const currentRun = runStateRef.current;

      if (currentSpeed > 0 && currentRun.outcome === null) {
        // Effective delta seconds (clamp to prevent huge jumps on tab defocus)
        accumulatedDt += Math.min(0.2, realDt) * currentSpeed;

        // Dispatch state updates at a steady, stable 20Hz (every 50ms)
        // to prevent UI thrashing and CSS transition interruptions
        if (accumulatedDt >= 0.05) {
          const step = accumulatedDt;
          accumulatedDt = 0;

          setLocalRunState((prev) => advanceClock(prev, step, designState, mission));
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [designState, mission]);

  // Handle player decision response
  const handleDecisionResponse = useCallback((responseId: string, isFast: boolean) => {
    setLocalRunState((prev) => resolveDecisionCard(prev, responseId, isFast));
  }, []);

  // Restart flight simulation
  const handleRestart = () => {
    const fresh = startMissionRun(designState, mission);
    setLocalRunState(fresh);
    setSimSpeed(1);
  };

  const missionTint =
    validMissionId === 'moon'
      ? 'var(--mission-moon)'
      : validMissionId === 'mars'
      ? 'var(--mission-mars)'
      : validMissionId === 'asteroid'
      ? 'var(--mission-asteroid)'
      : 'var(--mission-earth)';

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
          stepNumber={5}
          title="Live Flight Operations"
          instructions="Monitor the orbital trajectory and live gauges. When tactical decision cards appear, review resource trade-offs and choose a response before the timer expires (relaxed to 45s for this tutorial flight)."
          tip="Use time warp buttons (2x, 5x) to accelerate flight between maneuvers."
        />
      )}

      {/* Top Telemetry & Clock Bar */}
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-3)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: runState.outcome === null ? 'var(--status-good)' : runState.outcome === 'pass' ? 'var(--status-good)' : 'var(--status-critical)',
              boxShadow: runState.outcome === null ? '0 0 8px var(--status-good)' : undefined,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {`LIVE FLIGHT OPERATIONS // ${mission.name.toUpperCase()}`}
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              PHASE: <span style={{ color: 'var(--mission-accent)' }}>{runState.phase.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* MET Clock Readout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              COMPRESSED MISSION ELAPSED TIME
            </div>
            <div
              className="number-mono"
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'var(--mission-accent)',
                lineHeight: 1,
              }}
            >
              {formatClock(runState.elapsedSeconds)}
            </div>
          </div>

          {/* Time Warp / Speed Multiplier Controls */}
          <div
            role="toolbar"
            aria-label="Simulation speed controls"
            style={{
              display: 'flex',
              gap: '4px',
              background: 'var(--bg-base)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setSimSpeed(simSpeed === 0 ? 1 : 0)}
              aria-label={simSpeed === 0 ? 'Resume simulation' : 'Pause simulation'}
              style={{
                padding: '6px 12px',
                minHeight: '44px',
                minWidth: '44px',
                background: simSpeed === 0 ? 'var(--mission-accent)' : 'transparent',
                color: simSpeed === 0 ? 'var(--bg-base)' : 'var(--text-primary)',
              }}
              title={simSpeed === 0 ? 'Resume' : 'Pause'}
            >
              {simSpeed === 0 ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              onClick={() => setSimSpeed(1)}
              aria-label="Normal speed 1x"
              style={{
                padding: '6px 12px',
                minHeight: '44px',
                minWidth: '44px',
                background: simSpeed === 1 ? 'var(--mission-accent)' : 'transparent',
                color: simSpeed === 1 ? 'var(--bg-base)' : 'var(--text-primary)',
              }}
              title="Normal Speed (1x)"
            >
              1x
            </button>
            <button
              onClick={() => setSimSpeed(2)}
              aria-label="Fast forward 2x"
              style={{
                padding: '6px 12px',
                minHeight: '44px',
                minWidth: '44px',
                background: simSpeed === 2 ? 'var(--mission-accent)' : 'transparent',
                color: simSpeed === 2 ? 'var(--bg-base)' : 'var(--text-primary)',
              }}
              title="Fast Forward (2x)"
            >
              2x
            </button>
            <button
              onClick={() => setSimSpeed(5)}
              aria-label="Hyper warp 5x"
              style={{
                padding: '6px 12px',
                minHeight: '44px',
                minWidth: '44px',
                background: simSpeed === 5 ? 'var(--mission-accent)' : 'transparent',
                color: simSpeed === 5 ? 'var(--bg-base)' : 'var(--text-primary)',
              }}
              title="Hyper Warp (5x)"
            >
              <FastForward size={16} />
              <span style={{ fontSize: '0.75rem' }}>5x</span>
            </button>
            <button
              onClick={handleRestart}
              aria-label="Restart mission run"
              style={{
                padding: '6px 12px',
                minHeight: '44px',
                minWidth: '44px',
                background: 'transparent',
                color: 'var(--text-muted)',
              }}
              title="Restart Run"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Flight Timeline Progress Strip */}
      <TimelineStrip phase={runState.phase} elapsedSeconds={runState.elapsedSeconds} />

      {/* End of Mission Banner (Appears when PASS or FAIL) */}
      {runState.outcome !== null && (
        <div
          style={{
            background: runState.outcome === 'pass' ? 'rgba(61, 190, 122, 0.15)' : 'rgba(224, 69, 61, 0.15)',
            border: `2px solid ${runState.outcome === 'pass' ? 'var(--status-good)' : 'var(--status-critical)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-6)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-4)',
            boxShadow: runState.outcome === 'pass' ? 'var(--glow-accent)' : 'var(--glow-critical)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {runState.outcome === 'pass' ? (
              <CheckCircle2 size={32} color="var(--status-good)" />
            ) : (
              <XCircle size={32} color="var(--status-critical)" />
            )}
            <div>
              <h2
                style={{
                  fontSize: '1.3rem',
                  color: runState.outcome === 'pass' ? 'var(--status-good)' : 'var(--status-critical)',
                }}
              >
                {runState.outcome === 'pass' ? 'MISSION OBJECTIVES ACHIEVED — PASS' : 'MISSION FAILED'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {runState.outcome === 'pass'
                  ? `Successfully returned ${runState.dataDownlinkedMB.toLocaleString()} MB science data within engineering limits.`
                  : runState.failureReason || 'Flight telemetry limits exceeded.'}
              </p>
            </div>
          </div>

          <button
            className="primary"
            onClick={() => navigate(`/missions/${mission.id}/debrief`)}
            style={{
              backgroundColor: runState.outcome === 'pass' ? 'var(--status-good)' : 'var(--status-critical)',
              borderColor: runState.outcome === 'pass' ? 'var(--status-good)' : 'var(--status-critical)',
              padding: '10px 24px',
              minHeight: '44px',
            }}
          >
            <span>Proceed to Mission Debrief</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Main Console Grid (Stacked on Mobile, Side-by-Side on Desktop) */}
      <div className="console-grid">
        {/* Left Column: 2D Orbit View + Tactical Manual Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <OrbitView
            mission={mission}
            phase={runState.phase}
            elapsedSeconds={runState.elapsedSeconds}
            totalBurnDeltaVms={runState.totalBurnDeltaVms}
          />

          {/* Manual Flight Operations Console */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              TACTICAL FLIGHT DECK CONTROLS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
              {/* Science Imager Toggle */}
              <button
                onClick={() => setInstrumentsActive(!instrumentsActive)}
                style={{
                  background: instrumentsActive ? 'rgba(61, 165, 245, 0.15)' : 'var(--bg-base)',
                  border: `1px solid ${instrumentsActive ? 'var(--mission-accent)' : 'var(--border-subtle)'}`,
                  color: instrumentsActive ? 'var(--mission-accent)' : 'var(--text-muted)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 14px',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={16} />
                  <span>Payload Imager</span>
                </span>
                <span className="number-mono" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  {instrumentsActive ? 'SURVEYING' : 'STANDBY'}
                </span>
              </button>

              {/* DSN Downlink Toggle */}
              <button
                onClick={() => setDownlinkActive(!downlinkActive)}
                style={{
                  background: downlinkActive && runState.commsLinkOk ? 'rgba(61, 190, 122, 0.15)' : 'var(--bg-base)',
                  border: `1px solid ${downlinkActive && runState.commsLinkOk ? 'var(--status-good)' : 'var(--border-subtle)'}`,
                  color: downlinkActive && runState.commsLinkOk ? 'var(--status-good)' : 'var(--text-muted)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 14px',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Radio size={16} />
                  <span>DSN Link Transmit</span>
                </span>
                <span className="number-mono" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  {downlinkActive && runState.commsLinkOk ? 'LOCKED' : 'OFFLINE'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Gauges Sidebar + Event Flight Recorder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Live Telemetry Gauges Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
            {/* Propellant Tank Fuel */}
            <Gauge
              label="Propellant Remaining"
              currentValue={Math.max(0, runState.fuelRemainingKg)}
              limitValue="TANK"
              unit="kg"
              percentage={runState.fuelRemainingKg > 0 ? (runState.fuelRemainingKg / 1000) * 100 : 0}
              status={runState.fuelRemainingKg <= 50 ? 'critical' : runState.fuelRemainingKg <= 150 ? 'warn' : 'good'}
            />

            {/* Science Data Downlinked */}
            <Gauge
              label="Science Data Downlinked"
              currentValue={Math.round(runState.dataDownlinkedMB)}
              limitValue={mission.minScienceDataMB}
              unit="MB"
              percentage={(runState.dataDownlinkedMB / mission.minScienceDataMB) * 100}
              status={runState.dataDownlinkedMB >= mission.minScienceDataMB ? 'good' : 'warn'}
            />

            {/* Power Balance */}
            <Gauge
              label="Power Generation Balance"
              currentValue={`${runState.powerBalanceW >= 0 ? '+' : ''}${Math.round(runState.powerBalanceW)}`}
              limitValue="0"
              unit="W"
              percentage={runState.powerBalanceW >= 0 ? 100 : 0}
              status={runState.powerBalanceW < -20 ? 'critical' : runState.powerBalanceW < 0 ? 'warn' : 'good'}
            />

            {/* Solid State Memory Buffer */}
            <Gauge
              label="Onboard Data Buffer"
              currentValue={Math.round(runState.dataStoredMB)}
              limitValue="64,000"
              unit="MB"
              percentage={(runState.dataStoredMB / 64000) * 100}
              status={runState.dataStoredMB >= 55000 ? 'warn' : 'good'}
            />
          </div>

          {/* Event Flight Recorder Log */}
          <EventLog entries={runState.eventLog} />
        </div>
      </div>

      {/* Timed Decision Card Modal (Appears during tactical flight events) */}
      {runState.activeDecisionCard && (
        <DecisionCardModal
          card={runState.activeDecisionCard}
          secondsRemaining={runState.decisionTimerRemaining}
          onSelectResponse={handleDecisionResponse}
        />
      )}
    </div>
  );
};
