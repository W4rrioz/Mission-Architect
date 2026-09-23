/**
 * Pre-flight Review Screen — Stitch AI Flight Readiness Review (FRR) & Launch Clearance Console
 * Source: docs/stitch/09-flight-readiness-review.html & 01-prd.md §4.4
 *
 * Implements the 7-Point Flight Readiness Review checklist, Flight Director Go/No-Go Poll,
 * Interplanetary Transfer Vector, Operational Documentation links, and Launch Authorization bar.
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MISSIONS } from '../data/missions';
import { MissionId } from '../domain/types';
import { useDesign } from '../context/DesignContext';
import { TutorialBanner } from '../components/TutorialBanner';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Rocket,
  Terminal,
  Orbit,
  FileText,
  Binary,
  Shield,
  Key,
} from 'lucide-react';

type SimOverrideState = 'live' | 'nominal' | 'budget' | 'warning';

export const PreflightReviewScreen: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();

  const validMissionId = (missionId as MissionId) || 'earth-orbit';
  const mission = MISSIONS[validMissionId] || MISSIONS['earth-orbit'];

  const { state: designState } = useDesign();
  const derived = designState.derived;

  const [simState, setSimState] = useState<SimOverrideState>('live');
  const [isLaunching, setIsLaunching] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Derive actual states
  const actualBudgetOver = derived ? derived.costUSD.isOver : false;
  const actualMassOver = derived ? derived.massKg.isOver : false;
  const actualDeltaVOver = derived ? derived.deltaVms.isOver : false;
  const actualPowerOver = derived ? derived.powerW.isOver : false;
  const actualCommsOver = derived ? derived.linkMarginDb.isOver : false;
  const actualThermalUnsafe = derived ? !derived.thermalEquilibriumK.isSafe : false;
  const actualReliabilityLow = derived ? derived.reliabilityEstimate < 0.85 : false;

  const actualHasWarnings =
    actualMassOver ||
    actualDeltaVOver ||
    actualPowerOver ||
    actualCommsOver ||
    actualThermalUnsafe ||
    actualReliabilityLow ||
    (derived ? derived.massKg.percentage >= 85 || derived.costUSD.percentage >= 85 : false);

  // Active state based on sim state or live data
  const isBudgetBlocked =
    simState === 'budget' ? true : simState === 'nominal' ? false : actualBudgetOver;

  const hasAnyWarnings =
    simState === 'warning'
      ? true
      : simState === 'nominal'
      ? false
      : simState === 'budget'
      ? true
      : actualHasWarnings;

  // Active flight status mode
  const clearanceMode: 'nominal' | 'budget' | 'warning' = isBudgetBlocked
    ? 'budget'
    : hasAnyWarnings
    ? 'warning'
    : 'nominal';

  const handleAuthorizeLaunch = () => {
    if (isBudgetBlocked) return;
    setIsLaunching(true);
    setTimeout(() => {
      navigate(`/missions/${validMissionId}/run`);
    }, 600);
  };

  const centralBodyName = mission.orbit?.centralBody ? mission.orbit.centralBody.toUpperCase() : 'ORBIT';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '16px 20px 100px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 100,
            backgroundColor: '#0c1f3d',
            border: '1px solid #3da5f5',
            color: '#e6ecf8',
            padding: '12px 20px',
            borderRadius: '6px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '12px',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3da5f5' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tutorial Guidance Step 4 */}
      {mission.isTutorial && (
        <TutorialBanner
          stepNumber={4}
          title="Flight Readiness Review (FRR)"
          instructions="Inspect all 7 mission constraints. Every checklist item links directly back to its responsible CAD subsystem. Budget compliance is a hard block, while other margins issue operational flight warnings."
          tip="All green checks guarantee safe orbital insertion and nominal telemetry."
        />
      )}

      {/* SUB-NAV BREADCRUMB & CONSOLE SYSTEM HEADER */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          backgroundColor: '#071b38',
          padding: '10px 18px',
          borderRadius: '6px',
          border: '1px solid rgba(63, 72, 81, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
          <Terminal size={16} color="#3da5f5" />
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              color: '#8fa0c4',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            CONSOLE DISPATCH:
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '13px',
              color: '#98cbff',
              fontWeight: 700,
            }}
          >
            FRR-LAUNCH-CLEARANCE // PROTOCOL L-00
          </span>
          <span style={{ color: 'rgba(63, 72, 81, 0.8)', padding: '0 4px' }}>|</span>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              color: '#bdc7dd',
              textTransform: 'uppercase',
            }}
          >
            TARGET: {mission.name.toUpperCase()} ({centralBodyName})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#bfc7d3' }}>
            SYS REVISION: <strong style={{ color: '#e6ecf8' }}>REV 4.2.0-STABLE</strong>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3da5f5' }} />
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#98cbff' }}>
              JPL HORIZONS FEED: SYNCHRONIZED
            </span>
          </div>
          <Link
            to={`/missions/${validMissionId}/design`}
            style={{
              textDecoration: 'none',
              backgroundColor: '#182a48',
              color: '#d7e2ff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={13} />
            <span>Return to CAD Workbench</span>
          </Link>
        </div>
      </div>

      {/* ZONE 1: FLIGHT DIRECTOR CLEARANCE HERO BANNER */}
      <div
        id="hero-clearance-card"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
          backgroundColor: '#0c1f3d',
          padding: '24px 28px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          border: `1px solid ${
            clearanceMode === 'budget'
              ? 'rgba(224, 69, 61, 0.6)'
              : clearanceMode === 'warning'
              ? 'rgba(224, 160, 48, 0.6)'
              : 'rgba(61, 165, 245, 0.4)'
          }`,
        }}
      >
        {/* Background telemetry wireframe pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none' }}>
          <svg style={{ width: '100%', height: '100%', color: '#98cbff' }} preserveAspectRatio="none" viewBox="0 0 1000 300">
            <path d="M0,150 Q250,50 500,150 T1000,150" fill="none" stroke="currentColor" strokeDasharray="6 4" strokeWidth="1.5" />
            <circle cx="500" cy="150" fill="none" r="120" stroke="currentColor" strokeWidth="1" />
            <circle cx="500" cy="150" fill="none" r="80" stroke="currentColor" strokeWidth="0.75" />
            <line stroke="currentColor" strokeWidth="0.5" x1="0" x2="1000" y1="150" y2="150" />
            <line stroke="currentColor" strokeWidth="0.5" x1="500" x2="500" y1="0" y2="300" />
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top row: Status Shield + Simulation Mode Switcher */}
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
              <div
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: '#182a48',
                  color:
                    clearanceMode === 'budget'
                      ? '#ffb4ab'
                      : clearanceMode === 'warning'
                      ? '#e0a030'
                      : '#98cbff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    clearanceMode === 'budget'
                      ? '0 0 16px rgba(224,69,61,0.3)'
                      : clearanceMode === 'warning'
                      ? '0 0 16px rgba(224,160,48,0.3)'
                      : '0 0 16px rgba(61,165,245,0.3)',
                }}
              >
                {clearanceMode === 'budget' ? (
                  <ShieldAlert size={36} color="#ffb4ab" />
                ) : clearanceMode === 'warning' ? (
                  <AlertTriangle size={36} color="#e0a030" />
                ) : (
                  <ShieldCheck size={36} color="#98cbff" />
                )}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '3px',
                      backgroundColor:
                        clearanceMode === 'budget'
                          ? '#93000a'
                          : clearanceMode === 'warning'
                          ? '#3d475a'
                          : '#3da5f5',
                      color:
                        clearanceMode === 'budget'
                          ? '#ffdad6'
                          : clearanceMode === 'warning'
                          ? '#e0a030'
                          : '#00395d',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    {clearanceMode === 'budget'
                      ? 'STATE: LAUNCH HOLD // BREACH'
                      : clearanceMode === 'warning'
                      ? 'STATE: CAUTION // MARGINAL'
                      : 'STATE: 100% CLEAR'}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      color: '#bfc7d3',
                      textTransform: 'uppercase',
                    }}
                  >
                    AUTHORITY: FOD-FLIGHT-DIRECTOR-JSC
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                    color: '#e6ecf8',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    margin: '4px 0 2px 0',
                    fontWeight: 700,
                  }}
                >
                  {clearanceMode === 'budget'
                    ? 'LAUNCH HOLD ACTIVE // CONGRESSIONAL CAP EXCEEDED'
                    : clearanceMode === 'warning'
                    ? 'CONDITIONAL CLEARANCE // MARGINAL FLIGHT PARAMETERS'
                    : 'FLIGHT CLEARED FOR DEEP SPACE // ALL 7 CONSTRAINTS NOMINAL'}
                </h1>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#8fa0c4',
                    margin: 0,
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  {clearanceMode === 'budget'
                    ? 'STATUTORY ANTI-DEFICIENCY ACT TRIGGERED // FLIGHT CERTIFICATION SUSPENDED PENDING NASA HQ WAIVER'
                    : clearanceMode === 'warning'
                    ? 'POWER/MASS/PROPULSION MARGIN DRIFT // REQUIRES FLIGHT DIRECTOR WAIVER CONCURRENCE'
                    : 'FOD CHIEF FLIGHT DIRECTOR CONCURRENCE SIGNED // TELEMETRY LINK RECONCILED WITH JPL HORIZONS'}
                </p>
              </div>
            </div>

            {/* Simulation Preview State Selector */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#000e26',
                padding: '4px',
                borderRadius: '4px',
                border: '1px solid rgba(63, 72, 81, 0.4)',
                gap: '4px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '10px',
                  color: '#8fa0c4',
                  padding: '0 6px',
                  textTransform: 'uppercase',
                }}
              >
                SIM STATE:
              </span>
              <button
                type="button"
                onClick={() => setSimState('nominal')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  backgroundColor: simState === 'nominal' ? '#3da5f5' : 'transparent',
                  color: simState === 'nominal' ? '#001d33' : '#bfc7d3',
                  fontWeight: simState === 'nominal' ? 700 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                [ Nominal (Cleared) ]
              </button>
              <button
                type="button"
                onClick={() => setSimState('budget')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  backgroundColor: simState === 'budget' ? '#93000a' : 'transparent',
                  color: simState === 'budget' ? '#ffdad6' : '#bfc7d3',
                  fontWeight: simState === 'budget' ? 700 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                [ Budget Breach (Hold) ]
              </button>
              <button
                type="button"
                onClick={() => setSimState('warning')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  backgroundColor: simState === 'warning' ? '#3d475a' : 'transparent',
                  color: simState === 'warning' ? '#e0a030' : '#bfc7d3',
                  fontWeight: simState === 'warning' ? 700 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                [ Marginal Power (Caution) ]
              </button>
              {simState !== 'live' && (
                <button
                  type="button"
                  onClick={() => setSimState('live')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '3px',
                    border: '1px solid #3da5f5',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    backgroundColor: '#182a48',
                    color: '#98cbff',
                    fontWeight: 600,
                  }}
                >
                  Reset Live
                </button>
              )}
            </div>
          </div>

          {/* Banner Operational Key Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              paddingTop: '6px',
            }}
          >
            <div style={{ backgroundColor: '#182a48', padding: '12px 14px', borderRadius: '4px', border: '1px solid rgba(63, 72, 81, 0.4)' }}>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                LAUNCH WINDOW
              </span>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '18px', color: '#98cbff', fontWeight: 700, marginTop: '2px' }}>
                18:28:00 <span style={{ fontSize: '10px', color: '#bdc7dd' }}>UTC</span>
              </div>
              <span style={{ fontSize: '11px', color: '#8fa0c4', display: 'block', marginTop: '2px' }}>Optimal Type-II Hohmann</span>
            </div>

            <div style={{ backgroundColor: '#182a48', padding: '12px 14px', borderRadius: '4px', border: '1px solid rgba(63, 72, 81, 0.4)' }}>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                LAUNCH PAD
              </span>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '18px', color: '#e6ecf8', fontWeight: 700, marginTop: '2px' }}>
                SLC-41
              </div>
              <span style={{ fontSize: '11px', color: '#8fa0c4', display: 'block', marginTop: '2px' }}>Cape Canaveral SFS, Florida</span>
            </div>

            <div style={{ backgroundColor: '#182a48', padding: '12px 14px', borderRadius: '4px', border: '1px solid rgba(63, 72, 81, 0.4)' }}>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                LAUNCH VEHICLE
              </span>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '18px', color: '#e6ecf8', fontWeight: 700, marginTop: '2px' }}>
                ATLAS V 401
              </div>
              <span style={{ fontSize: '11px', color: '#8fa0c4', display: 'block', marginTop: '2px' }}>Tail: AV-038 // Centaur Upper</span>
            </div>

            <div style={{ backgroundColor: '#182a48', padding: '12px 14px', borderRadius: '4px', border: '1px solid rgba(63, 72, 81, 0.4)' }}>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                INTERPLANETARY TARGET
              </span>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '18px', color: '#98cbff', fontWeight: 700, marginTop: '2px' }}>
                {mission.orbit?.solarDistanceAU ? mission.orbit.solarDistanceAU.toFixed(3) : '1.000'}{' '}
                <span style={{ fontSize: '10px', color: '#bdc7dd' }}>AU</span>
              </div>
              <span style={{ fontSize: '11px', color: '#8fa0c4', display: 'block', marginTop: '2px' }}>{centralBodyName} Centric Orbit</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSTATION LAYOUT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: 7-POINT ENGINEERING MARGIN CHECKLIST (8 COLUMNS) */}
        <div style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: '14px' }} className="xl:col-span-8">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <CheckCircle2 size={18} color="#3da5f5" />
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '16px',
                    color: '#e6ecf8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  FLIGHT READINESS REVIEW // FINAL CHECKLIST
                </h2>
                <div style={{ fontSize: '12px', color: '#8fa0c4', fontFamily: 'var(--font-mono, monospace)' }}>
                  {`Pre-flight Review: ${mission.name}`}
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                color: '#bfc7d3',
                display: 'flex',
                gap: '12px',
              }}
            >
              <span>SHOWING: <strong style={{ color: '#98cbff' }}>ALL 7 CONSTRAINTS</strong></span>
              <span>FILTER: <span style={{ color: '#e6ecf8' }}>NOMINAL CRITICALITY</span></span>
            </div>
          </div>

          {/* 7 CONSTRAINTS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* CONSTRAINT 1: BOOSTER PAYLOAD CAPACITY */}
            <div
              style={{
                backgroundColor: '#071b38',
                padding: '14px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(63, 72, 81, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor:
                        actualMassOver ? '#ff5a52' : (derived?.massKg.percentage || 0) >= 85 ? '#e0a030' : '#3dbe7a',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#bfc7d3', fontWeight: 700, textTransform: 'uppercase' }}>
                    01 // BOOSTER PAYLOAD CAPACITY
                  </span>
                  <span style={{ fontSize: '12px', color: '#e6ecf8', fontWeight: 600 }}>
                    — Booster Payload Mass Capacity
                  </span>
                  <span
                    style={{
                      padding: '2px 6px',
                      backgroundColor: '#243553',
                      color:
                        actualMassOver ? '#ffb4ab' : (derived?.massKg.percentage || 0) >= 85 ? '#e0a030' : '#98cbff',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {actualMassOver ? '■ CRITICAL' : (derived?.massKg.percentage || 0) >= 85 ? '▲ WARNING' : '● NOMINAL'}
                  </span>
                </div>
                <Link
                  to={`/missions/${validMissionId}/design?tab=launchVehicle`}
                  style={{
                    color: '#3da5f5',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Tune Launch Vehicle</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  marginTop: '10px',
                  backgroundColor: '#000e26',
                  padding: '10px 12px',
                  borderRadius: '4px',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    WET MASS / CAP LIMIT
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#e6ecf8', fontWeight: 700 }}>
                    {(derived?.massKg.current || 2120).toLocaleString()} kg <span style={{ color: '#8fa0c4', fontWeight: 400 }}>/ {(derived?.massKg.limit || 2500).toLocaleString()} kg</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    AVAILABLE MARGIN
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#3dbe7a', fontWeight: 700 }}>
                    {((derived?.massKg.limit || 2500) - (derived?.massKg.current || 2120) >= 0 ? '+' : '')}
                    {((derived?.massKg.limit || 2500) - (derived?.massKg.current || 2120)).toLocaleString()} kg{' '}
                    <span style={{ color: '#bdc7dd', fontWeight: 400 }}>
                      ({Math.round(((derived?.massKg.current || 2120) / (derived?.massKg.limit || 2500)) * 100)}% Cap)
                    </span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    UTILIZATION PROGRESS
                  </span>
                  <div style={{ width: '100%', backgroundColor: '#182a48', height: '8px', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        backgroundColor: actualMassOver ? '#ff5a52' : '#3da5f5',
                        height: '100%',
                        borderRadius: '4px',
                        width: `${Math.min(100, Math.round(((derived?.massKg.current || 2120) / (derived?.massKg.limit || 2500)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#bdc7dd', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Booster payload adapter fairing dynamic load envelope verified through structural modal shake test.
              </p>
            </div>

            {/* CONSTRAINT 2: CONGRESSIONAL BUDGET CEILING */}
            <div
              style={{
                backgroundColor: '#071b38',
                padding: '14px 16px',
                borderRadius: '6px',
                border: `1px solid ${isBudgetBlocked ? 'rgba(224, 69, 61, 0.6)' : 'rgba(63, 72, 81, 0.4)'}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: isBudgetBlocked ? '#ff5a52' : '#3dbe7a',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#bfc7d3', fontWeight: 700, textTransform: 'uppercase' }}>
                    02 // CONGRESSIONAL BUDGET CEILING
                  </span>
                  <span style={{ fontSize: '12px', color: '#e6ecf8', fontWeight: 600 }}>
                    — Congressional Budget Cap (Hard Limit)
                  </span>
                  <span
                    style={{
                      padding: '2px 6px',
                      backgroundColor: isBudgetBlocked ? '#93000a' : '#243553',
                      color: isBudgetBlocked ? '#ffdad6' : '#98cbff',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {isBudgetBlocked ? '■ CRITICAL' : '● NOMINAL'}
                  </span>
                </div>
                <Link
                  to={`/missions/${validMissionId}/design?tab=bus`}
                  style={{
                    color: '#3da5f5',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Tune Hardware CAD</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  marginTop: '10px',
                  backgroundColor: '#000e26',
                  padding: '10px 12px',
                  borderRadius: '4px',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    PROGRAM COST / STATUTORY CAP
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#e6ecf8', fontWeight: 700 }}>
                    ${isBudgetBlocked ? '668.4M' : `${((derived?.costUSD.current || 585000000) / 1000000).toFixed(1)}M`}{' '}
                    <span style={{ color: '#8fa0c4', fontWeight: 400 }}>/ ${(mission.budgetCapUSD / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    FISCAL CONTINGENCY RESERVE
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: isBudgetBlocked ? '#ff5a52' : '#3dbe7a', fontWeight: 700 }}>
                    {isBudgetBlocked
                      ? '-$18.4M (102.8% OVERRUN)'
                      : `+$${(((mission.budgetCapUSD - (derived?.costUSD.current || 585000000))) / 1000000).toFixed(1)}M (${Math.round(((derived?.costUSD.current || 585000000) / mission.budgetCapUSD) * 100)}% Cap)`}
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    BUDGET BURN GAUGE
                  </span>
                  <div style={{ width: '100%', backgroundColor: '#182a48', height: '8px', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        backgroundColor: isBudgetBlocked ? '#ff5a52' : '#3da5f5',
                        height: '100%',
                        borderRadius: '4px',
                        width: isBudgetBlocked ? '100%' : `${Math.min(100, Math.round(((derived?.costUSD.current || 585000000) / mission.budgetCapUSD) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#bdc7dd', marginTop: '8px' }}>
                NASA Class-B planetary mission reserves intact; caution trigger set at ${(mission.budgetCapUSD * 0.92 / 1000000).toFixed(1)}M, absolute statutory cap at ${(mission.budgetCapUSD / 1000000).toFixed(1)}M.
              </p>
            </div>

            {/* CONSTRAINT 3: TRAJECTORY INSERTION VELOCITY (DELTA-V) */}
            <div
              style={{
                backgroundColor: '#071b38',
                padding: '14px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(63, 72, 81, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: actualDeltaVOver ? '#ff5a52' : '#3dbe7a',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#bfc7d3', fontWeight: 700, textTransform: 'uppercase' }}>
                    03 // TRAJECTORY INSERTION VELOCITY (ΔV)
                  </span>
                  <span style={{ fontSize: '12px', color: '#e6ecf8', fontWeight: 600 }}>
                    — Orbital Insertion Velocity Margin (Δv)
                  </span>
                  <span
                    style={{
                      padding: '2px 6px',
                      backgroundColor: '#243553',
                      color: '#98cbff',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                    }}
                  >
                    ● NOMINAL
                  </span>
                </div>
                <Link
                  to={`/missions/${validMissionId}/design?tab=propulsion`}
                  style={{
                    color: '#3da5f5',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Tune Propulsion</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  marginTop: '10px',
                  backgroundColor: '#000e26',
                  padding: '10px 12px',
                  borderRadius: '4px',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    DELIVERED ΔV / REQUIRED
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#e6ecf8', fontWeight: 700 }}>
                    {(derived?.deltaVms.current || 2280).toLocaleString()} m/s <span style={{ color: '#8fa0c4', fontWeight: 400 }}>/ {mission.orbit?.requiredDeltaVms ? mission.orbit.requiredDeltaVms.toLocaleString() : '2050'} m/s</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    PROPELLANT RESERVE MARGIN
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#3dbe7a', fontWeight: 700 }}>
                    +{((derived?.deltaVms.current || 2280) - (mission.orbit?.requiredDeltaVms || 2050)).toLocaleString()} m/s{' '}
                    <span style={{ color: '#bdc7dd', fontWeight: 400 }}>(Tsiolkovsky OK)</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    DELTA-V BUDGET RATIO
                  </span>
                  <div style={{ width: '100%', backgroundColor: '#182a48', height: '8px', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#3da5f5', height: '100%', borderRadius: '4px', width: '89.9%' }} />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#bdc7dd', marginTop: '8px' }}>
                Sufficient for Trans-Mars Injection, 4 mid-course trajectory correction maneuvers, and orbital capture.
              </p>
            </div>

            {/* CONSTRAINT 4: PHOTOVOLTAIC POWER BALANCE */}
            <div
              style={{
                backgroundColor: '#071b38',
                padding: '14px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(63, 72, 81, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor:
                        simState === 'warning' ? '#e0a030' : actualPowerOver ? '#ff5a52' : '#3dbe7a',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#bfc7d3', fontWeight: 700, textTransform: 'uppercase' }}>
                    04 // PHOTOVOLTAIC POWER BALANCE
                  </span>
                  <span style={{ fontSize: '12px', color: '#e6ecf8', fontWeight: 600 }}>
                    — Electrical Bus Generation Balance
                  </span>
                  <span
                    style={{
                      padding: '2px 6px',
                      backgroundColor: simState === 'warning' ? '#3d475a' : '#243553',
                      color: simState === 'warning' ? '#e0a030' : '#98cbff',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {simState === 'warning' ? '▲ WARNING' : '● NOMINAL'}
                  </span>
                </div>
                <Link
                  to={`/missions/${validMissionId}/design?tab=power`}
                  style={{
                    color: '#3da5f5',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Tune Power</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  marginTop: '10px',
                  backgroundColor: '#000e26',
                  padding: '10px 12px',
                  borderRadius: '4px',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    AT {mission.orbit?.solarDistanceAU ? mission.orbit.solarDistanceAU.toFixed(2) : '1.00'} AU SOLAR OUTPUT
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#e6ecf8', fontWeight: 700 }}>
                    {simState === 'warning' ? '935 W' : `${(derived?.powerW.current || 1050).toLocaleString()} W`}{' '}
                    <span style={{ color: '#8fa0c4', fontWeight: 400 }}>vs {(derived?.powerW.limit || 920).toLocaleString()} W Peak</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    NET POWER MARGIN
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: simState === 'warning' ? '#e0a030' : '#3dbe7a', fontWeight: 700 }}>
                    {simState === 'warning' ? '+15 W (Marginal 1.6%)' : '+130 W (28.4 VDC Bus)'}
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    BUS LOAD ENVELOPE
                  </span>
                  <div style={{ width: '100%', backgroundColor: '#182a48', height: '8px', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: simState === 'warning' ? '#e0a030' : '#3da5f5', height: '100%', borderRadius: '4px', width: simState === 'warning' ? '98.4%' : '87.6%' }} />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#bdc7dd', marginTop: '8px' }}>
                Dual 3-panel GaAs solar wings with 20° dihedral angle to minimize aerodynamic drag during atmospheric skimming.
              </p>
            </div>

            {/* CONSTRAINT 5: DEEP SPACE NETWORK RF LINK MARGIN */}
            <div
              style={{
                backgroundColor: '#071b38',
                padding: '14px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(63, 72, 81, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3dbe7a', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#bfc7d3', fontWeight: 700, textTransform: 'uppercase' }}>
                    05 // DSN RF LINK MARGIN & TELEMETRY
                  </span>
                  <span style={{ fontSize: '12px', color: '#e6ecf8', fontWeight: 600 }}>
                    — Deep Space Network RF Link Margin
                  </span>
                  <span
                    style={{
                      padding: '2px 6px',
                      backgroundColor: '#243553',
                      color: '#98cbff',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                    }}
                  >
                    ● NOMINAL
                  </span>
                </div>
                <Link
                  to={`/missions/${validMissionId}/design?tab=comms`}
                  style={{
                    color: '#3da5f5',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Tune Communications</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  marginTop: '10px',
                  backgroundColor: '#000e26',
                  padding: '10px 12px',
                  borderRadius: '4px',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    DOWNLINK SNR / MIN FLOOR
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#e6ecf8', fontWeight: 700 }}>
                    +{(derived?.linkMarginDb.current || 4.2)} dB <span style={{ color: '#8fa0c4', fontWeight: 400 }}>/ 3.0 dB Min</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    RESERVE LINK MARGIN
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#3dbe7a', fontWeight: 700 }}>
                    +{((derived?.linkMarginDb.current || 4.2) - 3.0).toFixed(1)} dB <span style={{ color: '#bdc7dd', fontWeight: 400 }}>(Canberra 43)</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    SIGNAL QUALITY THRESHOLD
                  </span>
                  <div style={{ width: '100%', backgroundColor: '#182a48', height: '8px', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#3da5f5', height: '100%', borderRadius: '4px', width: '71.4%' }} />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#bdc7dd', marginTop: '8px' }}>
                2.0m High-Gain Parabolic X-band dish coupled with Electra UHF crosslink transceiver for rover proximity support.
              </p>
            </div>

            {/* CONSTRAINT 6: STEFAN-BOLTZMANN THERMAL EQUILIBRIUM */}
            <div
              style={{
                backgroundColor: '#071b38',
                padding: '14px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(63, 72, 81, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3dbe7a', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#bfc7d3', fontWeight: 700, textTransform: 'uppercase' }}>
                    06 // STEFAN-BOLTZMANN THERMAL EQUILIBRIUM
                  </span>
                  <span style={{ fontSize: '12px', color: '#e6ecf8', fontWeight: 600 }}>
                    — Stefan-Boltzmann Thermal Equilibrium
                  </span>
                  <span
                    style={{
                      padding: '2px 6px',
                      backgroundColor: '#243553',
                      color: '#98cbff',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                    }}
                  >
                    ● NOMINAL
                  </span>
                </div>
                <Link
                  to={`/missions/${validMissionId}/design?tab=thermal`}
                  style={{
                    color: '#3da5f5',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Tune Thermal</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  marginTop: '10px',
                  backgroundColor: '#000e26',
                  padding: '10px 12px',
                  borderRadius: '4px',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    CORE RADIATIVE TEMP
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#e6ecf8', fontWeight: 700 }}>
                    {derived?.thermalEquilibriumK.current || 231} K ({Math.round((derived?.thermalEquilibriumK.current || 231) - 273)}°C){' '}
                    <span style={{ color: '#8fa0c4', fontWeight: 400 }}>
                      / [{derived?.thermalEquilibriumK.minLimit || 123}..{derived?.thermalEquilibriumK.maxLimit || 393} K]
                    </span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    HEATER POWER CONTINGENCY
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#3dbe7a', fontWeight: 700 }}>
                    +35 W Reserve <span style={{ color: '#bdc7dd', fontWeight: 400 }}>(Eclipse Active)</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    THERMAL STABILITY INDEX
                  </span>
                  <div style={{ width: '100%', backgroundColor: '#182a48', height: '8px', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#3da5f5', height: '100%', borderRadius: '4px', width: '65.0%' }} />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#bdc7dd', marginTop: '8px' }}>
                Multi-Layer Insulation (MLI) passive shielding nominal; radiator louvers calibrated for deep orbital eclipse shadowing.
              </p>
            </div>

            {/* CONSTRAINT 7: AVIONICS SUBSYSTEM RELIABILITY (MTBF) */}
            <div
              style={{
                backgroundColor: '#071b38',
                padding: '14px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(63, 72, 81, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3dbe7a', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#bfc7d3', fontWeight: 700, textTransform: 'uppercase' }}>
                    07 // AVIONICS SUBSYSTEM RELIABILITY (MTBF)
                  </span>
                  <span style={{ fontSize: '12px', color: '#e6ecf8', fontWeight: 600 }}>
                    — Subsystem Hardware Reliability Rating
                  </span>
                  <span
                    style={{
                      padding: '2px 6px',
                      backgroundColor: '#243553',
                      color: '#98cbff',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                    }}
                  >
                    ● NOMINAL
                  </span>
                </div>
                <Link
                  to={`/missions/${validMissionId}/design?tab=redundancy`}
                  style={{
                    color: '#3da5f5',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Tune Redundancy</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  marginTop: '10px',
                  backgroundColor: '#000e26',
                  padding: '10px 12px',
                  borderRadius: '4px',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    COMPUTED RELIABILITY
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#e6ecf8', fontWeight: 700 }}>
                    {Math.round((derived?.reliabilityEstimate || 0.942) * 100)}% MTBF <span style={{ color: '#8fa0c4', fontWeight: 400 }}>/ 85.0% Min</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    SAFETY MARGIN EXCESS
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#3dbe7a', fontWeight: 700 }}>
                    +{Math.max(0, Math.round(((derived?.reliabilityEstimate || 0.942) - 0.85) * 100))}% Excess{' '}
                    <span style={{ color: '#bdc7dd', fontWeight: 400 }}>(Class B Pass)</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
                    CROSS-STRAP HARDENING
                  </span>
                  <div style={{ width: '100%', backgroundColor: '#182a48', height: '8px', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#3da5f5', height: '100%', borderRadius: '4px', width: `${Math.round((derived?.reliabilityEstimate || 0.942) * 100)}%` }} />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#bdc7dd', marginTop: '8px' }}>
                Dual-string cold redundancy active on BAE RAD750 flight computers and RWA-4 reaction wheels.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FLIGHT DIRECTOR POLL & TRANSFER VECTOR (4 COLUMNS) */}
        <div style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: '16px' }} className="xl:col-span-4">
          {/* FLIGHT DIRECTOR POLL */}
          <div
            style={{
              backgroundColor: '#071b38',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid rgba(63, 72, 81, 0.4)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(63, 72, 81, 0.4)', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="#3da5f5" />
                <h3
                  style={{
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '14px',
                    color: '#e6ecf8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  FLIGHT DIRECTOR POLL
                </h3>
              </div>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '3px',
                  backgroundColor:
                    clearanceMode === 'budget'
                      ? '#93000a'
                      : clearanceMode === 'warning'
                      ? '#3d475a'
                      : '#3da5f5',
                  color:
                    clearanceMode === 'budget'
                      ? '#ffdad6'
                      : clearanceMode === 'warning'
                      ? '#e0a030'
                      : '#00395d',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {clearanceMode === 'budget' ? 'HOLD / NO-GO' : clearanceMode === 'warning' ? '7/8 CAUTION' : '8/8 GO'}
              </span>
            </div>

            <p style={{ fontSize: '11px', color: '#bfc7d3', marginBottom: '12px', lineHeight: 1.4 }}>
              Verbal clearance poll completed in Mission Control Center Houston (MCCR-04). All flight stations recorded in consensus.
            </p>

            {/* Poll Stations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { station: 'FDIR', title: 'Flight Director', status: clearanceMode === 'budget' ? 'NO-GO' : 'GO' },
                { station: 'NAV', title: 'Flight Dynamics & Nav', status: 'GO' },
                { station: 'PROP', title: 'Propulsion Systems', status: 'GO' },
                { station: 'GNC', title: 'Guidance & Control', status: 'GO' },
                { station: 'EECOM', title: 'Electrical & Env', status: clearanceMode === 'warning' ? 'WAIVER' : 'GO' },
                { station: 'COMM', title: 'Ground DSN Comms', status: 'GO' },
                { station: 'INSM', title: 'Science Payload', status: 'GO' },
                { station: 'SAFETY', title: 'Range Safety Officer', status: clearanceMode === 'budget' ? 'NO-GO' : 'GO' },
              ].map(({ station, title, status }) => (
                <div
                  key={station}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    backgroundColor: '#0c1f3d',
                    borderRadius: '4px',
                    border: '1px solid rgba(63, 72, 81, 0.25)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', color: '#3da5f5', fontWeight: 700, width: '45px' }}>
                      {station}
                    </span>
                    <span style={{ fontSize: '12px', color: '#e6ecf8' }}>{title}</span>
                  </div>
                  <span
                    style={{
                      padding: '1px 6px',
                      borderRadius: '3px',
                      backgroundColor:
                        status === 'NO-GO'
                          ? 'rgba(224, 69, 61, 0.2)'
                          : status === 'WAIVER'
                          ? 'rgba(224, 160, 48, 0.2)'
                          : 'rgba(61, 190, 122, 0.15)',
                      color:
                        status === 'NO-GO'
                          ? '#ff5a52'
                          : status === 'WAIVER'
                          ? '#e0a030'
                          : '#3dbe7a',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {status === 'NO-GO' ? '■ NO-GO' : status === 'WAIVER' ? '▲ WAIVER' : '● GO'}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(63, 72, 81, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase' }}>
                SIGNATURE LOG:
              </span>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#3da5f5', fontWeight: 700 }}>
                JSC-CONCURRENCE-OK
              </span>
            </div>
          </div>

          {/* ORBITAL INSERTION PROFILE VECTOR MINI-CARD */}
          <div
            style={{
              backgroundColor: '#071b38',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid rgba(63, 72, 81, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Orbit size={16} color="#3da5f5" />
                <h3
                  style={{
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '13px',
                    color: '#e6ecf8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  TRANSFER VECTOR
                </h3>
              </div>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#bdc7dd' }}>
                C3: 15.4 km²/s²
              </span>
            </div>

            {/* Micro Trajectory SVG Visualization */}
            <div
              style={{
                position: 'relative',
                backgroundColor: '#000e26',
                height: '130px',
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(63, 72, 81, 0.4)',
              }}
            >
              <svg style={{ width: '100%', height: '100%' }} fill="none" viewBox="0 0 320 140">
                <ellipse cx="60" cy="110" rx="40" ry="18" stroke="#3da5f5" strokeOpacity="0.4" strokeWidth="1.5" />
                <ellipse cx="260" cy="40" rx="35" ry="16" stroke="#98cbff" strokeOpacity="0.4" strokeWidth="1.5" />
                <path d="M 60,110 C 100,20 200,10 260,40" stroke="#3da5f5" strokeDasharray="4 3" strokeWidth="2" />
                <circle cx="60" cy="110" fill="#3da5f5" r="5" />
                <text fill="#98cbff" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="60" y="130">
                  EARTH L-0
                </text>
                <circle cx="260" cy="40" fill="#98cbff" r="4.5" />
                <text fill="#d7e2ff" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="260" y="24">
                  {centralBodyName} L+308d
                </text>
                <circle cx="150" cy="44" fill="#ffffff" r="3" />
                <text fill="#d7e2ff" fontFamily="JetBrains Mono, monospace" fontSize="8" textAnchor="middle" x="150" y="60">
                  TMI VECTOR
                </text>
              </svg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', textTransform: 'uppercase' }}>
              <div style={{ backgroundColor: '#0c1f3d', padding: '8px', borderRadius: '4px' }}>
                <span style={{ color: '#bfc7d3' }}>CRUISE DURATION:</span>
                <strong style={{ color: '#e6ecf8', display: 'block', marginTop: '2px', fontSize: '11px' }}>308.4 DAYS</strong>
              </div>
              <div style={{ backgroundColor: '#0c1f3d', padding: '8px', borderRadius: '4px' }}>
                <span style={{ color: '#bfc7d3' }}>PERIAPSIS PASS:</span>
                <strong style={{ color: '#e6ecf8', display: 'block', marginTop: '2px', fontSize: '11px' }}>150 KM NOMINAL</strong>
              </div>
            </div>
          </div>

          {/* QUICK ACCESS LINKS & MISSION DOSSIER */}
          <div
            style={{
              backgroundColor: '#071b38',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid rgba(63, 72, 81, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#bfc7d3', textTransform: 'uppercase', display: 'block' }}>
              OPERATIONAL DOCUMENTATION
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => showToast(`DISPATCHED: FRR-${validMissionId.toUpperCase()}-REV4-SIGNATURES.PDF`)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '4px',
                  backgroundColor: '#0c1f3d',
                  border: '1px solid rgba(63, 72, 81, 0.3)',
                  color: '#e6ecf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={14} color="#3da5f5" />
                  FRR-{validMissionId.toUpperCase()}-REV4-SIGNATURES.PDF
                </span>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#3da5f5' }}>[VIEW]</span>
              </button>

              <button
                type="button"
                onClick={() => showToast('EXPORTED: CAD_STRUCTURAL_ENVELOPE_V3.STEP')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '4px',
                  backgroundColor: '#0c1f3d',
                  border: '1px solid rgba(63, 72, 81, 0.3)',
                  color: '#e6ecf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Binary size={14} color="#3da5f5" />
                  CAD_STRUCTURAL_ENVELOPE_V3.STEP
                </span>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#3da5f5' }}>[CAD]</span>
              </button>

              <button
                type="button"
                onClick={() => showToast(`VALIDATED: RANGE_SAFETY_DISPATCH_${validMissionId.toUpperCase()}.XML`)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '4px',
                  backgroundColor: '#0c1f3d',
                  border: '1px solid rgba(63, 72, 81, 0.3)',
                  color: '#e6ecf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={14} color="#3da5f5" />
                  RANGE_SAFETY_DISPATCH_{validMissionId.toUpperCase()}.XML
                </span>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#3da5f5' }}>[LOG]</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 3: STICKY BOTTOM LAUNCH AUTHORIZATION ACTION BAR */}
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 40,
          backgroundColor: 'rgba(0, 14, 38, 0.95)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.6)',
          padding: '12px 24px',
          borderTop: '1px solid rgba(63, 72, 81, 0.4)',
        }}
      >
        <div
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          {/* Left: Pre-flight readiness summary pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: '#182a48',
                borderRadius: '4px',
                border: '1px solid rgba(63, 72, 81, 0.5)',
              }}
            >
              <span style={{ position: 'relative', display: 'flex', height: '10px', width: '10px' }}>
                <span
                  style={{
                    position: 'absolute',
                    display: 'inline-flex',
                    height: '100%',
                    width: '100%',
                    borderRadius: '50%',
                    backgroundColor:
                      clearanceMode === 'budget'
                        ? '#ff5a52'
                        : clearanceMode === 'warning'
                        ? '#e0a030'
                        : '#3da5f5',
                    opacity: 0.75,
                    animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    borderRadius: '50%',
                    height: '10px',
                    width: '10px',
                    backgroundColor:
                      clearanceMode === 'budget'
                        ? '#ff5a52'
                        : clearanceMode === 'warning'
                        ? '#e0a030'
                        : '#3da5f5',
                  }}
                />
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color:
                    clearanceMode === 'budget'
                      ? '#ff5a52'
                      : clearanceMode === 'warning'
                      ? '#e0a030'
                      : '#98cbff',
                }}
              >
                {clearanceMode === 'budget'
                  ? 'CONGRESSIONAL HOLD // LAUNCH INTERLOCKED'
                  : clearanceMode === 'warning'
                  ? '6 / 7 NOMINAL // 1 WAIVER PENDING (EECOM)'
                  : '7 / 7 SYSTEMS VERIFIED // FLIGHT ENVELOPE LOCKED'}
              </span>
            </div>
          </div>

          {/* Center: Flight Authorization Hash token */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              backgroundColor: '#0c1f3d',
              borderRadius: '4px',
              border: '1px solid rgba(63, 72, 81, 0.3)',
            }}
          >
            <Key size={14} color="#8fa0c4" />
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#bfc7d3', textTransform: 'uppercase' }}>
              AUTH_KEY:
            </span>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#e6ecf8', letterSpacing: '0.04em' }}>
              NASA-JPL-{validMissionId.toUpperCase()}-2026-T0-410A
            </span>
            <span
              style={{
                padding: '1px 6px',
                borderRadius: '3px',
                backgroundColor: '#243553',
                color: '#98cbff',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              CRYPTO SIGNED
            </span>
          </div>

          {/* Right: Main Call to Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => showToast('GENERATING NASA FORM-742 FLIGHT READINESS DOSSIER (CRYPTO-SIGNED ARCHIVE)...')}
              style={{
                padding: '10px 16px',
                backgroundColor: '#182a48',
                border: '1px solid rgba(63, 72, 81, 0.6)',
                color: '#e6ecf8',
                borderRadius: '4px',
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              [ Export Dossier (PDF) ]
            </button>

            <button
              type="button"
              disabled={isBudgetBlocked}
              onClick={handleAuthorizeLaunch}
              style={{
                padding: '10px 22px',
                backgroundColor: isBudgetBlocked ? '#93000a' : '#3da5f5',
                color: isBudgetBlocked ? '#ffdad6' : '#001d33',
                borderRadius: '4px',
                border: 'none',
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: isBudgetBlocked ? 'not-allowed' : 'pointer',
                opacity: isBudgetBlocked ? 0.6 : 1,
                boxShadow: !isBudgetBlocked ? '0 0 20px rgba(61, 165, 245, 0.4)' : undefined,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.1s, background-color 0.2s',
              }}
            >
              <Rocket size={18} />
              <span>
                {isLaunching
                  ? 'COMMENCING TERMINAL COUNTDOWN...'
                  : 'Authorize Launch & Enter Mission Control'}
              </span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
