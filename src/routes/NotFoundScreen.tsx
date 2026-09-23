/**
 * 404 Not Found Screen — Stitch AI Tactical Signal Loss Console
 * Source: docs/stitch/10-signal-loss-404.html & 01-prd.md
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Satellite, RadioTower } from 'lucide-react';

export const NotFoundScreen: React.FC = () => {
  const [timeoutSec, setTimeoutSec] = useState(420.0);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeoutSec((prev) => prev + 0.05);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const triggerPing = () => {
    if (isPinging) return;
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
    }, 700);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px 24px',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambience & Reticle Border */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(152, 203, 255, 0.12), rgba(0, 14, 38, 0))',
        }}
      />
      <div
        className="blueprint-grid"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.15,
        }}
      />

      {/* Top Dispatch Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          maxWidth: '720px',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '10px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(63, 72, 81, 0.3)',
          background: 'rgba(0, 14, 38, 0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: '4px 4px 0 0',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-critical, #ffb4ab)',
              boxShadow: '0 0 8px #ffb4ab',
            }}
          />
          <span style={{ color: 'var(--text-muted, #89919c)' }}>TERM // CARRIER_DROP</span>
          <span style={{ color: 'rgba(63, 72, 81, 0.8)' }}>|</span>
          <span style={{ color: 'var(--status-warn, #e0a030)' }}>NODE.404.DISCONNECT</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--text-muted, #bfc7d3)' }}>UTC 00:00:00.00</span>
          <span style={{ color: 'rgba(63, 72, 81, 0.8)' }}>|</span>
          <span style={{ color: 'var(--text-muted, #89919c)' }}>SUBSYS // DSN_RELAY</span>
        </div>
      </div>

      {/* Main Tactical HUD Container */}
      <main
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', position: 'relative' }}>
          {/* Outer Glow Aura */}
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              background: 'linear-gradient(to bottom, rgba(224, 160, 48, 0.2), rgba(224, 69, 61, 0.1), transparent)',
              filter: 'blur(16px)',
              pointerEvents: 'none',
              zIndex: -1,
              borderRadius: '8px',
            }}
          />

          {/* Console Interior Frame */}
          <div
            style={{
              width: '100%',
              backgroundColor: '#131a30',
              border: '1px solid rgba(63, 72, 81, 0.5)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Chamfer Accent Bar */}
            <div
              style={{
                height: '3px',
                width: '100%',
                background: 'linear-gradient(to right, transparent, #e0a030, transparent)',
                opacity: 0.9,
              }}
            />

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative' }}>
              {/* Corner Reticle Indicators */}
              <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px', opacity: 0.6, pointerEvents: 'none' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#e0a030', display: 'inline-block' }} />
                <span style={{ width: '16px', height: '2px', backgroundColor: '#e0a030', display: 'inline-block' }} />
              </div>
              <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', opacity: 0.6, pointerEvents: 'none' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#e0a030', display: 'inline-block' }} />
                <span style={{ width: '16px', height: '2px', backgroundColor: '#e0a030', display: 'inline-block' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '8px', left: '8px', display: 'flex', gap: '4px', opacity: 0.4, pointerEvents: 'none' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#8fa0c4', display: 'inline-block' }} />
                <span style={{ width: '16px', height: '2px', backgroundColor: '#8fa0c4', display: 'inline-block' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', opacity: 0.4, pointerEvents: 'none' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#8fa0c4', display: 'inline-block' }} />
                <span style={{ width: '16px', height: '2px', backgroundColor: '#8fa0c4', display: 'inline-block' }} />
              </div>

              {/* Header Status Pill */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  backgroundColor: '#0b1020',
                  padding: '6px 12px',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(224, 160, 48, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                    <span
                      style={{
                        position: 'absolute',
                        display: 'inline-flex',
                        height: '100%',
                        width: '100%',
                        borderRadius: '50%',
                        backgroundColor: '#e0a030',
                        opacity: 0.75,
                        animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                      }}
                    />
                    <span
                      style={{
                        position: 'relative',
                        display: 'inline-flex',
                        borderRadius: '50%',
                        height: '8px',
                        width: '8px',
                        backgroundColor: '#e0a030',
                      }}
                    />
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#e0a030',
                      fontWeight: 700,
                    }}
                  >
                    SIGNAL LOSS // DSN CARRIER DROP
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '12px',
                  }}
                >
                  <span style={{ color: 'var(--text-muted, #89919c)', fontSize: '10px' }}>TIMEOUT:</span>
                  <span style={{ color: '#e0a030', fontWeight: 700 }}>{timeoutSec.toFixed(2)}s</span>
                </div>
              </div>

              {/* Radar Beacon Display Canvas */}
              <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    backgroundColor: '#0a0f1d',
                    padding: '4px',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 12px rgba(61, 165, 245, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '1px solid rgba(42, 51, 80, 0.8)',
                  }}
                >
                  {/* Grid Lines & Range Rings SVG */}
                  <svg
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', color: '#2a3350' }}
                    fill="none"
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Range Rings */}
                    <circle cx="100" cy="100" opacity="0.6" r="28" stroke="currentColor" strokeDasharray="2 3" strokeWidth="0.75" />
                    <circle cx="100" cy="100" opacity="0.7" r="56" stroke="currentColor" strokeWidth="0.75" />
                    <circle cx="100" cy="100" opacity="0.9" r="84" stroke="currentColor" strokeDasharray="4 2" strokeWidth="0.75" />
                    <circle cx="100" cy="100" opacity="0.9" r="96" stroke="currentColor" strokeWidth="1.25" />
                    {/* Crosshairs */}
                    <line opacity="0.4" stroke="currentColor" strokeWidth="0.75" x1="100" x2="100" y1="4" y2="196" />
                    <line opacity="0.4" stroke="currentColor" strokeWidth="0.75" x1="4" x2="196" y1="100" y2="100" />
                    {/* Range Labels */}
                    <text fill="#8fa0c4" fontFamily="JetBrains Mono, monospace" fontSize="6" opacity="0.7" x="103" y="74">100k km</text>
                    <text fill="#8fa0c4" fontFamily="JetBrains Mono, monospace" fontSize="6" opacity="0.7" x="103" y="46">250k km</text>
                    <text fill="#8fa0c4" fontFamily="JetBrains Mono, monospace" fontSize="6" opacity="0.7" x="103" y="18">500k km</text>
                    {/* Lost Trajectory Projected Vector */}
                    <path d="M 100 100 L 148 44" opacity="0.85" stroke="#e0453d" strokeDasharray="3 3" strokeWidth="1.5" />
                    <circle cx="148" cy="44" fill="#e0453d" opacity="0.4" r="3.5" />
                    <circle cx="148" cy="44" fill="#ffdad6" r="1.5" />
                    {/* Vector Null Flag */}
                    <text fill="#e0453d" fontFamily="JetBrains Mono, monospace" fontSize="6.5" fontWeight="700" x="134" y="36">NULL_VEC</text>
                  </svg>

                  {/* Rotating Radar Sweep Cone */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      transformOrigin: 'center',
                      animation: 'spin 4s linear infinite',
                      background: 'conic-gradient(from 0deg at 50% 50%, rgba(61, 165, 245, 0.28) 0deg, rgba(61, 165, 245, 0.05) 45deg, transparent 90deg, transparent 360deg)',
                    }}
                  />

                  {/* Center Origin Reticle */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 10,
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#3da5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 8px #3da5f5',
                    }}
                  >
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#001330' }} />
                  </div>

                  {/* Interactive Ping Micro-Echo Ring */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: '2px solid #3da5f5',
                      pointerEvents: 'none',
                      transform: isPinging ? 'scale(22)' : 'scale(1)',
                      opacity: isPinging ? 0.9 : 0,
                      transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
                    }}
                  />
                </div>
              </div>

              {/* Primary Headline Section */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Satellite size={24} color="#e0453d" />
                  <h1
                    style={{
                      fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                      fontSize: 'clamp(1.5rem, 3.5vw, 1.9rem)',
                      color: '#e6ecf8',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      margin: 0,
                      fontWeight: 700,
                    }}
                  >
                    404 — Trajectory Lost
                  </h1>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontSize: '12px',
                    color: '#e0a030',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  EPHEMERIS VECTOR UNREACHABLE // TRANSPONDER DESYNCHRONIZED
                </p>
              </div>

              {/* Coordinate Readout Matrix (Recessed Data Inset) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '8px',
                  backgroundColor: '#0a0f1d',
                  padding: '8px',
                  boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(63, 72, 81, 0.4)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '8px', backgroundColor: 'rgba(19, 26, 48, 0.8)' }}>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#8fa0c4', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    TARGET EPHEMERIS
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#e0453d', fontWeight: 700 }}>
                    UNRESOLVED / NULL
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted, #89919c)', marginTop: '2px' }}>DEV: ±INF m/s</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '8px', backgroundColor: 'rgba(19, 26, 48, 0.8)' }}>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#8fa0c4', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    SECTOR COORD
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#e6ecf8', fontWeight: 600 }}>
                    DST-09 // T-RA
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted, #89919c)', marginTop: '2px' }}>AZ 284.12° EL -14°</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '8px', backgroundColor: 'rgba(19, 26, 48, 0.8)' }}>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#8fa0c4', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    UPLINK STATUS
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', color: '#e0a030', fontWeight: 700 }}>
                    NO CARRIER
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted, #89919c)', marginTop: '2px' }}>CARRIER SIG: 0.0 dB</span>
                </div>
              </div>

              {/* Deep Space Network Station Status Mini-Bar */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  backgroundColor: 'rgba(11, 16, 32, 0.9)',
                  padding: '8px 12px',
                  border: '1px solid rgba(63, 72, 81, 0.4)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '10px',
                    color: 'var(--text-muted, #89919c)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span>DSN GROUND STATIONS LOCK STATE</span>
                  <span style={{ color: '#8fa0c4' }}>70M DISH ARRAY</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#192342', padding: '6px 4px' }}>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono, monospace)', color: '#bfc7d3' }}>GOLDSTONE (DSS-14)</span>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#e0a030', fontWeight: 700, letterSpacing: '0.04em' }}>SEARCHING...</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#192342', padding: '6px 4px' }}>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono, monospace)', color: '#bfc7d3' }}>MADRID (DSS-63)</span>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#e0453d', fontWeight: 700, letterSpacing: '0.04em' }}>CARRIER LOST</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#192342', padding: '6px 4px' }}>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono, monospace)', color: '#bfc7d3' }}>CANBERRA (DSS-43)</span>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#e0453d', fontWeight: 700, letterSpacing: '0.04em' }}>NO SIGNAL</span>
                  </div>
                </div>
              </div>

              {/* Technical Explanation Statement */}
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted, #bfc7d3)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                  margin: '4px 0',
                }}
              >
                The requested orbital trajectory, flight profile, or planetary state coordinates do not exist in the NASA Mission Architect active registry. Deep Space Network carrier lock timed out across Goldstone, Madrid, and Canberra transceivers.
              </p>

              {/* Tactical Nav Buttons & Interaction */}
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', paddingTop: '4px' }}>
                {/* Primary Flight Re-acquire Button */}
                <Link
                  to="/missions"
                  style={{
                    flex: '1 1 200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 14px',
                    backgroundColor: '#3da5f5',
                    color: '#001d33',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(61, 165, 245, 0.3)',
                    transition: 'background-color 0.2s, transform 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#98cbff')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3da5f5')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass size={18} />
                    <span style={{ fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      RE-ACQUIRE TRAJECTORY
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#00395d', fontWeight: 500, marginTop: '2px' }}>
                    Browse verified mission manifests
                  </span>
                </Link>

                {/* Return to Initialization Hub Button */}
                <Link
                  to="/"
                  style={{
                    flex: '1 1 200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 14px',
                    backgroundColor: '#192342',
                    color: '#e6ecf8',
                    textDecoration: 'none',
                    border: '1px solid rgba(63, 72, 81, 0.6)',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#243553')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#192342')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Home size={18} color="#8fa0c4" />
                    <span style={{ fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      MISSION CONTROL ROOT
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#89919c', fontWeight: 500, marginTop: '2px' }}>
                    Reset flight initialization terminal
                  </span>
                </Link>
              </div>

              {/* Interactive Diagnostic Scanner Micro-action */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(11, 16, 32, 0.6)',
                  padding: '8px 12px',
                  border: '1px solid rgba(63, 72, 81, 0.4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RadioTower size={16} color="#8fa0c4" />
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'var(--text-muted, #89919c)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    MANUAL PROBE HARNESS
                  </span>
                </div>
                <button
                  type="button"
                  onClick={triggerPing}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#192342',
                    border: '1px solid rgba(61, 165, 245, 0.4)',
                    color: '#3da5f5',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#283958')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#192342')}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3da5f5', display: 'inline-block' }} />
                  <span>PING DSN TRANSCEIVER</span>
                </button>
              </div>

              {/* Bottom Engineering Stamp */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'var(--text-muted, #89919c)',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  paddingTop: '4px',
                  gap: '4px',
                }}
              >
                <span>ERR_CODE: 0x404_ORBITAL_PLANE_OUT_OF_BOUNDS</span>
                <span style={{ color: '#8fa0c4' }}>MET: T+NULL // JPL_DACS7</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Telemetry Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          maxWidth: '720px',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--text-muted, #89919c)',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '10px',
          textTransform: 'uppercase',
          borderTop: '1px solid rgba(63, 72, 81, 0.3)',
          background: 'rgba(0, 14, 38, 0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: '0 0 4px 4px',
          marginTop: '16px',
        }}
      >
        <span>STATUS: LOSS OF SIGNAL [LOS]</span>
        <span style={{ color: 'var(--text-muted, #89919c)' }}>ERR_ORBITAL_VECTOR_UNDEFINED</span>
      </div>
    </div>
  );
};
