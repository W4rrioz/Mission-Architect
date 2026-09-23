/**
 * Mission Briefing Screen
 * Source: 01-prd.md §4.2, 03-app-flow.md §3, 04-ui-ux-brief.md §6
 *
 * Detailed flight directives and engineering constraints briefing for a chosen mission.
 * Displays objectives, budget cap, required delta-v, orbit parameters, and historical NASA context.
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MISSIONS } from '../data/missions';
import { MissionId } from '../domain/types';
import { useProgression } from '../context/ProgressionContext';
import { TutorialBanner } from '../components/TutorialBanner';
import {
  FileText,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Compass,
  Database,
  Flame,
  Sparkles,
} from 'lucide-react';

export const MissionBriefingScreen: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();
  const { isMissionUnlocked } = useProgression();

  const validMissionId = (missionId as MissionId) || 'earth-orbit';
  const mission = MISSIONS[validMissionId] || MISSIONS['earth-orbit'];

  // Route protection: redirect locked missions to /missions per 03-app-flow.md §8
  useEffect(() => {
    if (!isMissionUnlocked(validMissionId)) {
      navigate('/missions', { replace: true });
    }
  }, [validMissionId, isMissionUnlocked, navigate]);

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
        maxWidth: '860px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-4) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      } as React.CSSProperties}
    >
      {/* Tutorial Guidance Step 2 */}
      {mission.isTutorial && (
        <TutorialBanner
          stepNumber={2}
          title="Flight Briefing & Directives"
          instructions="Carefully analyze your operational envelope. You must design a spacecraft that meets the minimum science data quota while remaining strictly under the allocated budget cap."
          tip="Check required Δv — your propulsion system must provide at least this velocity change."
        />
      )}

      {/* Stitch Dossier Header & Clearance Bar */}
      <div className="hud-panel" style={{ padding: 'var(--space-5)', borderTop: `4px solid var(--mission-accent)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--mission-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            <FileText size={16} />
            <span style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              OPERATIONAL FLIGHT DIRECTIVE // LEVEL OF INTENT
            </span>
          </div>

          <div className="tier-pill" style={{ borderColor: 'rgba(61, 190, 122, 0.4)', background: 'rgba(61, 190, 122, 0.1)', color: 'var(--status-good)' }}>
            <span className="status-led good" style={{ width: '6px', height: '6px' }} />
            <span>FLIGHT CLEARANCE: AUTHORIZED</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          {validMissionId === 'mars' ? (
            <img
              src="/assets/stitch/maven-insignia.png"
              alt="NASA MAVEN Mission Seal"
              width={64}
              height={64}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'contain',
                background: 'var(--panel-elevated)',
                border: '1px solid var(--border-hairline)',
                padding: '4px',
                boxShadow: '0 4px 16px rgba(224, 112, 61, 0.25)',
              }}
            />
          ) : (
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--panel-elevated)',
                border: '1px solid var(--border-hairline)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--mission-accent)',
              }}
            >
              <FileText size={32} />
            </div>
          )}

          <div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '0.04em' }}>
              {mission.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--mission-accent)', fontWeight: 700 }}>
                {`TIER ${mission.difficulty} MISSION`}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: 'var(--text-muted)' }}>
                DESTINATION BODY: <strong style={{ color: 'var(--text-primary)' }}>{mission.orbit.centralBody.toUpperCase()}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Objective Card */}
      <div
        className="hud-panel"
        style={{
          borderLeft: '4px solid var(--mission-accent)',
          padding: 'var(--space-5)',
        }}
      >
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mission-accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          PRIMARY SCIENTIFIC DIRECTIVE
        </span>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginTop: 'var(--space-2)', lineHeight: 1.6 }}>
          {mission.objective}
        </p>
      </div>

      {/* Constraints & Requirements Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Key Engineering Constraints</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          {/* Budget Cap */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <DollarSign size={14} color="var(--status-warn)" />
              <span>HARD BUDGET CAP</span>
            </div>
            <div className="number-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {`$${(mission.budgetCapUSD / 1_000_000).toFixed(0)}M`}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Non-negotiable ceiling across all parts.
            </div>
          </div>

          {/* Required Delta-V */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <Flame size={14} color="var(--status-critical)" />
              <span>REQUIRED Δv MANEUVER</span>
            </div>
            <div className="number-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {`${mission.orbit.requiredDeltaVms} m/s`}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Minimum rocket velocity change.
            </div>
          </div>

          {/* Minimum Science Data */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <Database size={14} color="var(--status-good)" />
              <span>MIN. SCIENCE RETURN</span>
            </div>
            <div className="number-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {`${mission.minScienceDataMB.toLocaleString()} MB`}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Target downlink volume to pass.
            </div>
          </div>

          {/* Orbit Regime & Altitude */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <Compass size={14} color="var(--mission-earth)" />
              <span>TARGET REGIME</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {mission.orbit.regime}
            </div>
            <div className="number-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {`${mission.orbit.altitudeKm} km | Period: ${mission.orbit.periodMinutes} min`}
            </div>
          </div>
        </div>
      </div>

      {/* Historical NASA Benchmark Callout Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--mission-accent)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {`Historical Predecessor: NASA ${mission.realMission.name}`}
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
          {mission.realMission.summary}
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            marginTop: '4px',
            padding: '8px 12px',
            background: 'var(--bg-base)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
          }}
          className="number-mono"
        >
          <div>
            LAUNCH VEHICLE: <strong style={{ color: 'var(--text-primary)' }}>{mission.realMission.launchVehicle}</strong>
          </div>
          <div>
            LAUNCH MASS: <strong style={{ color: 'var(--text-primary)' }}>{mission.realMission.launchMassKg.toLocaleString()} kg</strong>
          </div>
          <div>
            POWER: <strong style={{ color: 'var(--text-primary)' }}>{mission.realMission.powerW.toLocaleString()} W</strong>
          </div>
        </div>
      </div>

      {/* Action Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <Link to="/missions" className="mobile-full-width" style={{ textDecoration: 'none' }}>
          <button className="secondary mobile-full-width" style={{ minHeight: '44px' }}>
            <ArrowLeft size={16} />
            <span>Mission Catalog</span>
          </button>
        </Link>

        <button
          className="primary mobile-full-width"
          onClick={() => navigate(`/missions/${mission.id}/design`)}
          style={{
            padding: '12px 28px',
            minHeight: '44px',
            backgroundColor: 'var(--mission-accent)',
            borderColor: 'var(--mission-accent)',
            color: 'var(--bg-base)',
            fontWeight: 700,
          }}
        >
          <span>Begin Spacecraft Design</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
