/**
 * Title Screen
 * Source: 01-prd.md §4, 04-ui-ux-brief.md §6
 * Stitch Screen: mission_architect_title_flight_initialization
 *
 * Cinematic, full-bleed title screen with procedural starfield SVG,
 * planetary limb curvature, live UTC clock, NASA Space Apps badges,
 * central insignia patch, and tactical CTA triggers.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const TitleScreen: React.FC = () => {
  const navigate = useNavigate();
  const [utcTime, setUtcTime] = useState('00:00:00');
  const [audioMuted, setAudioMuted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const min = String(now.getUTCMinutes()).padStart(2, '0');
      const sec = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hrs}:${min}:${sec}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        if (e.code === 'Space') e.preventDefault();
        navigate('/missions');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="relative min-h-[calc(100vh-50px)] flex flex-col justify-between select-none bg-surface text-on-surface overflow-hidden">
      {/* Ambient Space Horizon & Procedural Starfield Canvas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg className="w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient cx="50%" cy="32%" id="nebulaA" r="48%">
              <stop offset="0%" stopColor="#3da5f5" stopOpacity="0.14" />
              <stop offset="45%" stopColor="#ac8bff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#001330" stopOpacity="0" />
            </radialGradient>
            <radialGradient cx="50%" cy="100%" id="horizonGlow" r="60%">
              <stop offset="0%" stopColor="#3da5f5" stopOpacity="0.22" />
              <stop offset="35%" stopColor="#0c1f3d" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#001330" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect fill="url(#nebulaA)" height="100%" width="100%" />

          {/* Coordinate Reticle Gridlines */}
          <g opacity="0.45" stroke="#243553" strokeDasharray="4,8" strokeWidth="0.5">
            <line x1="12%" x2="12%" y1="0" y2="100%" />
            <line x1="88%" x2="88%" y1="0" y2="100%" />
            <line x1="50%" x2="50%" y1="0" y2="100%" />
            <line x1="0" x2="100%" y1="50%" y2="50%" />
          </g>

          {/* Tactical Reticle Crosshairs */}
          <circle cx="50%" cy="50%" fill="none" opacity="0.5" r="380" stroke="#182a48" strokeWidth="1" />
          <circle cx="50%" cy="50%" fill="none" opacity="0.3" r="390" stroke="#3da5f5" strokeDasharray="3,12" strokeWidth="0.75" />

          {/* Fixed & Twinkling Stellar Positions */}
          <g fill="#d7e2ff">
            <circle cx="8%" cy="14%" opacity="0.8" r="1" />
            <circle cx="15%" cy="28%" opacity="0.9" r="1.5" />
            <circle cx="23%" cy="11%" opacity="0.4" r="0.8" />
            <circle cx="34%" cy="22%" opacity="0.7" r="1.2" />
            <circle cx="42%" cy="9%" opacity="0.8" r="1" />
            <circle cx="67%" cy="17%" opacity="0.9" r="1.4" />
            <circle cx="78%" cy="26%" opacity="0.5" r="0.9" />
            <circle cx="84%" cy="13%" opacity="0.85" r="1.8" />
            <circle cx="92%" cy="34%" opacity="0.6" r="1" />
            <circle cx="11%" cy="65%" opacity="0.5" r="1.2" />
            <circle cx="19%" cy="78%" opacity="0.7" r="0.8" />
            <circle cx="81%" cy="72%" opacity="0.65" r="1.5" />
            <circle cx="89%" cy="61%" opacity="0.75" r="1" />
            <circle cx="95%" cy="82%" opacity="0.4" r="1.3" />
            <circle cx="5%" cy="45%" opacity="0.5" r="1" />
            <circle cx="96%" cy="19%" opacity="0.8" r="0.9" />
          </g>
        </svg>

        {/* Planetary Limb Curvature */}
        <div className="absolute -bottom-72 left-1/2 -translate-x-1/2 w-[1800px] h-[340px] rounded-full bg-surface-container-lowest opacity-95 shadow-[0_-30px_90px_rgba(61,165,245,0.25)]" />
      </div>

      {/* Audio & Configuration HUD Controls */}
      <aside aria-label="Flight Deck HUD Overlays" className="relative z-20 flex justify-between items-center px-6 py-3 w-full text-secondary">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-telemetry-label text-telemetry-label tracking-widest text-primary uppercase">
            UPLINK ACTIVE // DSN 43 CANBERRA
          </span>
          <span className="text-surface-container-highest">|</span>
          <span className="font-telemetry-label text-telemetry-label text-on-surface-variant hidden md:inline">
            FREQ: 8415.22 MHz
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle Cockpit Audio"
            onClick={() => setAudioMuted(!audioMuted)}
            className="flex items-center gap-1.5 px-3 py-1 bg-surface-container hover:bg-surface-container-high transition-colors rounded text-secondary hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-sm">
              {audioMuted ? 'volume_off' : 'volume_up'}
            </span>
            <span className="font-telemetry-label text-telemetry-label uppercase tracking-wider">
              {audioMuted ? 'AUDIO MUTED' : 'AUDIO ON'}
            </span>
          </button>
          <div className="px-2.5 py-1 bg-surface-container-low rounded text-on-surface-variant font-telemetry-label text-telemetry-label uppercase">
            UTC <span className="text-on-surface font-telemetry-clock">{utcTime}</span>
          </div>
        </div>
      </aside>

      {/* Central Flight Deck Mission Hub */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 max-w-[1100px] mx-auto w-full text-center py-6">
        {/* Top NASA Classification Pill */}
        <div className="mb-5 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container-high/90 shadow-md backdrop-blur-sm border border-outline-variant/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="font-headline-panel text-telemetry-label tracking-widest text-on-surface font-semibold uppercase">
            NASA Space Apps Challenge 2026 // FLIGHT DYNAMICS LAB
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-surface-bright" />
          <span className="font-telemetry-label text-telemetry-label text-primary font-bold tracking-wider">
            SYS_READY: NOMINAL
          </span>
        </div>

        {/* Central Mission Insignia Container */}
        <div
          onClick={() => navigate('/missions')}
          className="relative mb-6 group cursor-pointer"
          title="Initialize Flight Mission"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl transform scale-110 group-hover:scale-125 transition-transform duration-700" />
          <div className="relative w-[180px] h-[180px] rounded-full p-2 bg-gradient-to-b from-surface-container-highest via-surface-container to-surface-container-lowest shadow-2xl flex items-center justify-center border border-primary/30">
            <img
              alt="Mission Architect Insignia Flight Patch"
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(61,165,245,0.4)] transform group-hover:rotate-3 transition-transform duration-500 rounded-full"
              src="/assets/stitch/patch-insignia.png"
            />
          </div>
        </div>

        {/* Primary Title Typography */}
        <div className="relative mb-3">
          <h1 className="font-display-hero text-display-hero uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-white via-on-surface to-secondary drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            MISSION ARCHITECT
          </h1>
          <div className="h-0.5 w-36 mx-auto mt-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
        </div>

        {/* Value Statement / Narrative Subtitle */}
        <p className="font-body-default text-body-default text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-6">
          Architect, simulate, and command authentic robotic missions across the solar system.
          <span className="text-on-surface block sm:inline"> Balance mass limits, power budgets, delta-v constraints, and real orbital mechanics.</span>
        </p>

        {/* Operational CTA Hardware Switchgear Stack */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mb-4">
          {/* Primary Flight Execution Trigger */}
          <button
            id="btnInitFlight"
            onClick={() => navigate('/missions')}
            className="w-full sm:w-auto flex-1 min-h-[52px] px-8 rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-headline-panel text-headline-panel tracking-wider uppercase transition-all duration-200 shadow-xl flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1" style={{ fontVariationSettings: "'FILL' 1" }}>
              rocket_launch
            </span>
            <span>Launch Mission Architect</span>
          </button>

          {/* Auxiliary Dossier / Manual CTA */}
          <button
            type="button"
            onClick={() => navigate('/missions')}
            className="w-full sm:w-auto px-6 min-h-[52px] rounded-lg bg-surface-container-high hover:bg-surface-bright text-secondary hover:text-on-surface font-headline-panel text-subhead-tech tracking-wider uppercase transition-colors duration-200 flex items-center justify-center gap-2 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-base">menu_book</span>
            <span>FLIGHT PROFILES &amp; LOGS</span>
          </button>
        </div>

        {/* Tactile Keyboard Hint Pill */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container-low text-on-surface-variant font-telemetry-label text-telemetry-label uppercase tracking-widest border border-outline-variant/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
          PRESS <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-telemetry-clock text-telemetry-clock">SPACE</kbd> OR <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-telemetry-clock text-telemetry-clock">ENTER</kbd> TO COMMENCE
        </div>

        {/* Real-time Telemetry Data Matrices HUD Chips */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          {/* Metric Chip 1 */}
          <div className="p-3 bg-surface-container/90 rounded-lg shadow border border-outline-variant/20 flex flex-col justify-between hover:bg-surface-container-high transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-telemetry-label text-telemetry-label text-primary font-bold">4 NASA Profiles</span>
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-mono uppercase">LEO / GTO / LUNAR / MARS</div>
            <span className="font-body-caption text-body-caption text-on-surface-variant mt-1">Landsat 9, LRO, MAVEN, OSIRIS-REx</span>
          </div>

          {/* Metric Chip 2 */}
          <div className="p-3 bg-surface-container/90 rounded-lg shadow border border-outline-variant/20 flex flex-col justify-between hover:bg-surface-container-high transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-telemetry-label text-telemetry-label text-error font-bold">Exact Domain Physics</span>
              <span className="w-2 h-2 rounded-full bg-error" />
            </div>
            <div className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-mono uppercase">CHEM // ION HALL // RCS</div>
            <span className="font-body-caption text-body-caption text-on-surface-variant mt-1">Kepler, Friis, Stefan-Boltzmann</span>
          </div>

          {/* Metric Chip 3 */}
          <div className="p-3 bg-surface-container/90 rounded-lg shadow border border-outline-variant/20 flex flex-col justify-between hover:bg-surface-container-high transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-telemetry-label text-telemetry-label text-primary-fixed-dim font-bold">Zero Backend</span>
              <span className="w-2 h-2 rounded-full bg-primary-fixed-dim" />
            </div>
            <div className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-mono uppercase">100% Client-Side Pure Simulation</div>
            <span className="font-body-caption text-body-caption text-on-surface-variant mt-1">Real-Time N-Body &amp; RK4 Solver</span>
          </div>

          {/* Metric Chip 4 */}
          <div className="p-3 bg-surface-container/90 rounded-lg shadow border border-outline-variant/20 flex flex-col justify-between hover:bg-surface-container-high transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-telemetry-label text-telemetry-label text-tertiary font-bold">TELEMETRY BUS</span>
              <span className="w-2 h-2 rounded-full bg-tertiary" />
            </div>
            <div className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-mono uppercase">MIL-STD-1553 COMPLIANT</div>
            <span className="font-body-caption text-body-caption text-on-surface-variant mt-1">CCSDS Frame Sync Packets</span>
          </div>
        </div>
      </section>

      {/* Flight Operations Station Footer */}
      <footer className="relative z-20 w-full px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-secondary text-body-caption bg-surface-container-lowest/80 border-t border-outline-variant/20">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs tracking-tighter">
            NASA
          </div>
          <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase tracking-wider">
            MISSION ARCHITECT V1.0.0-PROD // CLIENT-SIDE FLIGHT DYNAMICS
          </span>
        </div>
        <div className="flex items-center gap-4 font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">
          <span className="hover:text-primary cursor-pointer transition-colors">DIAGNOSTICS: 0 ERRORS</span>
          <span className="text-surface-container-highest">/</span>
          <span className="hover:text-primary cursor-pointer transition-colors">EPOCH: J2000.0</span>
          <span className="text-surface-container-highest">/</span>
          <span>LATENCY: 12ms</span>
        </div>
      </footer>
    </div>
  );
};
