/**
 * Mission Select Screen
 * Source: 01-prd.md §4.1, 04-ui-ux-brief.md §6
 * Stitch Screen: mission_architect_flight_profile_catalog
 *
 * Displays the 4 campaign mission profiles in an aerospace catalog layout.
 * Features procedural planetary vector graphics (Earth SSO, Moon polar,
 * Mars aerobraking, Bennu polygonal asteroid), dynamic filter rail,
 * lock state overlays, personal best badges, and live telemetry dock.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MISSIONS } from '../data/missions';
import { useProgression } from '../context/ProgressionContext';
import { TutorialBanner } from '../components/TutorialBanner';
import { getAllPersonalBests } from '../domain/personalBest';

function getRank(score: number): string {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

export const MissionSelectScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMissionUnlocked } = useProgression();
  const personalBests = getAllPersonalBests();
  const [filter, setFilter] = useState<'all' | 'inner' | 'deep-space'>('all');

  const missionList = Object.values(MISSIONS);

  const filteredMissions = missionList.filter((m) => {
    if (filter === 'all') return true;
    if (filter === 'inner') return m.id === 'earth-orbit' || m.id === 'moon' || m.id === 'mars';
    if (filter === 'deep-space') return m.id === 'asteroid';
    return true;
  });

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6 text-on-surface">
      {/* Tutorial Guidance Step 1 */}
      <TutorialBanner
        stepNumber={1}
        title="Flight Mission Selection"
        instructions="Welcome to Mission Architect. Select the Earth-Observing Satellite to begin your flight certification tutorial. Successfully finishing your initial flight will unlock lunar, Martian, and deep-space asteroid missions."
        tip="Earth-orbit features relaxed timers and guided hardware constraints."
      />

      {/* Top Sub-Header & Briefing Bar */}
      <header className="flex flex-col gap-4 bg-surface-container border border-outline-variant/40 p-5 md:p-6 rounded-lg relative overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 w-36 h-1 bg-primary" />
        <div className="absolute top-2 right-4 font-telemetry-label text-telemetry-label text-on-surface-variant tracking-widest hidden sm:inline-block">
          SYS_ID: NAS-OPS-8842-REV9
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="font-telemetry-label text-telemetry-label text-primary uppercase tracking-widest">
                Target Selection Matrix // 4 FLIGHT PROFILES AVAILABLE
              </span>
            </div>
            <h1 className="font-headline-panel text-2xl md:text-3xl text-on-surface uppercase tracking-wider font-bold">
              Select Flight Mission
            </h1>
            <p className="font-body-default text-body-dense text-on-surface-variant max-w-3xl mt-1">
              Design, balance, and command certified robotic deep-space flight profiles. Complete predecessor flight trajectories to unlock advanced interplanetary orbits.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/50 px-3.5 py-2 rounded self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-status-good shadow-[0_0_8px_#3DBE7A]" />
            <div className="flex flex-col">
              <span className="font-telemetry-clock text-telemetry-clock text-status-good tracking-wider uppercase">
                SIM LINK: NOMINAL [99.8%]
              </span>
              <span className="font-telemetry-label text-telemetry-label text-on-surface-variant">
                CERTIFIED: {Object.keys(personalBests).length} / 4 PROFILES
              </span>
            </div>
          </div>
        </div>

        {/* Filter Rail & Quick Switchers */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/30">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-sm font-subhead-tech text-subhead-tech tracking-wider uppercase transition-all flex items-center gap-2 border ${
                filter === 'all'
                  ? 'bg-surface-container-high border-primary text-primary shadow'
                  : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${filter === 'all' ? 'bg-primary' : 'bg-on-surface-variant'}`} />
              ALL PROFILES (4)
            </button>
            <button
              type="button"
              onClick={() => setFilter('inner')}
              className={`px-3 py-1.5 rounded-sm font-subhead-tech text-subhead-tech tracking-wider uppercase transition-all border ${
                filter === 'inner'
                  ? 'bg-surface-container-high border-primary text-primary shadow'
                  : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              INNER SOLAR SYSTEM (3)
            </button>
            <button
              type="button"
              onClick={() => setFilter('deep-space')}
              className={`px-3 py-1.5 rounded-sm font-subhead-tech text-subhead-tech tracking-wider uppercase transition-all border ${
                filter === 'deep-space'
                  ? 'bg-surface-container-high border-primary text-primary shadow'
                  : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              DEEP SPACE SAMPLE RETURN (1)
            </button>
          </div>

          <div className="font-telemetry-label text-telemetry-label text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>FILTER: GRAVITATIONAL WELL / VELOCITY VECTORS</span>
          </div>
        </div>
      </header>

      {/* Mission Cards Grid (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {filteredMissions.map((m) => {
          const unlocked = isMissionUnlocked(m.id);
          const pb = personalBests[m.id];

          // Specific Visual configurations per Mission ID
          if (m.id === 'earth-orbit') {
            return (
              <article
                key={m.id}
                className="group relative bg-surface-container border border-outline-variant/50 hover:border-primary rounded-lg p-5 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-[0_0_24px_rgba(61,165,245,0.2)]"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-lg" />
                <div className="absolute top-3 right-3 text-primary font-telemetry-label text-telemetry-label tracking-widest pointer-events-none opacity-40">
                  GRID: L9-TERRA
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                      <span className="font-telemetry-label text-telemetry-label text-primary uppercase tracking-wider bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-sm">
                        UNLOCKED // TUTORIAL ACTIVE
                      </span>
                    </div>
                    {pb ? (
                      <span className="font-telemetry-clock text-telemetry-clock text-status-good bg-status-good/10 border border-status-good/30 px-2 py-0.5 rounded-sm">
                        ★ BEST: {pb.score} / 100 [RANK {getRank(pb.score)}]
                      </span>
                    ) : (
                      <span className="font-telemetry-clock text-telemetry-clock text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-sm">
                        READY FOR CERTIFICATION
                      </span>
                    )}
                  </div>

                  <div className="font-subhead-tech text-subhead-tech text-on-surface-variant tracking-wider uppercase mb-1">
                    TIER 1 // SUN-SYNCHRONOUS ORBIT (705 KM)
                  </div>
                  <h2 className="font-headline-panel text-headline-panel text-on-surface font-bold tracking-wide uppercase mb-1">
                    LANDSAT 9 // TERRESTRIAL OBSERVATORY
                  </h2>
                  <div className="text-body-caption text-primary/80 font-telemetry-label tracking-wider mb-4">
                    Earth-Observing Satellite // Landsat 9
                  </div>

                  {/* Tactical Earth Vector Graphic */}
                  <div className="relative w-full h-44 bg-surface-container-lowest border border-outline-variant/40 rounded flex items-center justify-center overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(61,165,245,0.15),transparent_70%)]" />
                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-outline-variant/30" xmlns="http://www.w3.org/2000/svg">
                      <line strokeDasharray="4 4" strokeWidth="0.75" x1="50%" x2="50%" y1="0" y2="100%" />
                      <line strokeDasharray="4 4" strokeWidth="0.75" x1="0" x2="100%" y1="50%" y2="50%" />
                    </svg>

                    {/* Vector Planet Earth */}
                    <svg className="w-36 h-36 relative z-10" fill="none" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                      <ellipse className="opacity-80" cx="80" cy="80" rx="28" ry="72" stroke="#3DA5F5" strokeDasharray="3 3" strokeWidth="1.2" transform="rotate(-25 80 80)" />
                      <g transform="translate(68, 16)">
                        <rect fill="#E6ECF8" height="6" rx="1" width="8" x="0" y="4" />
                        <rect fill="#3DA5F5" height="3" width="7" x="-8" y="5.5" />
                        <rect fill="#3DA5F5" height="3" width="7" x="9" y="5.5" />
                        <circle cx="4" cy="4" fill="#3DBE7A" r="1.5" />
                      </g>
                      <circle cx="80" cy="80" fill="#0C1B33" r="48" stroke="#3DA5F5" strokeWidth="1.5" />
                      <circle className="opacity-40" cx="80" cy="80" r="50" stroke="#3DA5F5" strokeWidth="2" />
                      <path d="M62 50 C 68 52, 75 48, 80 54 C 82 58, 76 64, 72 68 C 65 67, 60 62, 62 50 Z" fill="#205886" opacity="0.8" />
                      <path d="M85 65 C 95 62, 102 70, 100 78 C 94 82, 88 88, 82 82 C 84 75, 80 70, 85 65 Z" fill="#205886" opacity="0.8" />
                      <path d="M68 85 C 75 88, 78 98, 72 108 C 66 102, 64 94, 68 85 Z" fill="#205886" opacity="0.8" />
                      <path d="M96 95 C 104 96, 112 104, 106 112 C 100 114, 95 106, 96 95 Z" fill="#205886" opacity="0.8" />
                      <path d="M80 32 A 48 48 0 0 1 80 128 A 24 48 0 0 0 80 32 Z" fill="#000E26" opacity="0.55" />
                      <circle cx="73" cy="84" fill="#E6ECF8" r="2" />
                    </svg>

                    <div className="absolute bottom-2 left-3 font-telemetry-label text-telemetry-label text-on-surface-variant">
                      ALT: 705 KM // INC: 98.2° (SSO)
                    </div>
                    <div className="absolute bottom-2 right-3 font-telemetry-label text-telemetry-label text-status-good">
                      PASS: ASCENDING NODE
                    </div>
                  </div>

                  {/* Technical Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-surface-container-lowest p-3 rounded border border-outline-variant/30 mb-4">
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Budget Ceiling</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                        ${(m.budgetCapUSD / 1e6).toFixed(0)},000,000 <span className="text-xs text-on-surface-variant">(${(m.budgetCapUSD / 1e6).toFixed(0)}M)</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Payload Mass Limit</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                        {m.realMission.launchMassKg.toLocaleString()} <span className="text-xs text-on-surface-variant">kg</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Min Science Telemetry</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                        {m.minScienceDataMB.toLocaleString()} <span className="text-xs text-on-surface-variant">MB</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Difficulty Rating</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-primary font-bold">
                        ★☆☆☆ <span className="text-xs text-on-surface-variant">(STANDARD)</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/missions/${m.id}/briefing`)}
                  className="w-full h-12 bg-primary hover:bg-primary-fixed-dim text-on-primary font-headline-panel text-headline-panel font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow"
                >
                  <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                  <span>[ ARCHITECT LANDSAT 9 ]</span>
                </button>
              </article>
            );
          }

          if (m.id === 'moon') {
            return (
              <article
                key={m.id}
                className="group relative bg-surface-container border border-outline-variant/50 hover:border-moonPolar rounded-lg p-5 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-[0_0_24px_rgba(201,211,234,0.2)]"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-moonPolar rounded-t-lg" />
                <div className="absolute top-3 right-3 text-moonPolar font-telemetry-label text-telemetry-label tracking-widest pointer-events-none opacity-40">
                  GRID: LRO-SELENA
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-moonPolar" />
                      <span className="font-telemetry-label text-telemetry-label text-moonPolar uppercase tracking-wider bg-moonPolar/10 border border-moonPolar/30 px-2 py-0.5 rounded-sm">
                        {unlocked ? 'UNLOCKED // SYSTEM CERTIFIED' : 'LOCKED'}
                      </span>
                    </div>
                    {pb ? (
                      <span className="font-telemetry-clock text-telemetry-clock text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-sm">
                        ★ BEST: {pb.score} / 100 [RANK {getRank(pb.score)}]
                      </span>
                    ) : (
                      <span className="font-telemetry-clock text-telemetry-clock text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-sm">
                        {unlocked ? 'READY FOR FLIGHT' : 'REQUIRES EARTH PASS'}
                      </span>
                    )}
                  </div>

                  <div className="font-subhead-tech text-subhead-tech text-on-surface-variant tracking-wider uppercase mb-1">
                    TIER 2 // POLAR LUNAR MAPPING (50 KM)
                  </div>
                  <h2 className="font-headline-panel text-headline-panel text-on-surface font-bold tracking-wide uppercase mb-1">
                    LUNAR RECONNAISSANCE ORBITER (LRO)
                  </h2>
                  <div className="text-body-caption text-moonPolar/80 font-telemetry-label uppercase tracking-wider mb-4">
                    Lunar Reconnaissance Orbiter
                  </div>

                  {/* Tactical Moon Vector Graphic */}
                  <div className="relative w-full h-44 bg-surface-container-lowest border border-outline-variant/40 rounded flex items-center justify-center overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,211,234,0.12),transparent_70%)]" />
                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-outline-variant/30" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50%" cy="50%" r="68" strokeDasharray="2 4" strokeWidth="0.75" />
                      <line strokeDasharray="4 4" strokeWidth="0.75" x1="50%" x2="50%" y1="0" y2="100%" />
                    </svg>

                    <svg className="w-36 h-36 relative z-10" fill="none" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                      <ellipse className="opacity-80" cx="80" cy="80" rx="30" ry="68" stroke="#C9D3EA" strokeDasharray="4 3" strokeWidth="1.2" transform="rotate(18 80 80)" />
                      <circle cx="80" cy="80" fill="#1A2033" r="46" stroke="#C9D3EA" strokeWidth="1.5" />
                      <circle cx="68" cy="62" fill="#141928" r="9" stroke="#C9D3EA" strokeWidth="0.9" />
                      <circle cx="68" cy="62" fill="#2A3350" r="3" />
                      <circle cx="95" cy="92" fill="#141928" r="14" stroke="#C9D3EA" strokeDasharray="3 1" strokeWidth="0.9" />
                      <circle cx="80" cy="116" fill="#0E1424" r="6" stroke="#C9D3EA" strokeWidth="1" />
                      <path d="M80 112 L 80 120" stroke="#C9D3EA" strokeWidth="0.5" />
                      <path d="M60 76 Q 74 88 90 74 Q 85 60 65 65 Z" fill="#242C44" opacity="0.6" />
                      <path d="M95 92 L 118 108 M95 92 L 72 108 M95 92 L 114 78" opacity="0.7" stroke="#8FA0C4" strokeDasharray="2 2" strokeWidth="0.5" />
                      <circle cx="98" cy="24" fill="#C9D3EA" r="2.5" />
                      <line stroke="#C9D3EA" strokeWidth="1.5" x1="93" x2="103" y1="24" y2="24" />
                    </svg>

                    <div className="absolute bottom-2 left-3 font-telemetry-label text-telemetry-label text-on-surface-variant">
                      PERILUNE: 30 KM // APOLUNE: 216 KM
                    </div>
                    <div className="absolute bottom-2 right-3 font-telemetry-label text-telemetry-label text-moonPolar">
                      POLAR INSERTION: LOCKED
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-surface-container-lowest p-3 rounded border border-outline-variant/30 mb-4">
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Budget Ceiling</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                        ${(m.budgetCapUSD / 1e6).toFixed(0)},000,000 <span className="text-xs text-on-surface-variant">(${(m.budgetCapUSD / 1e6).toFixed(0)}M)</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Payload Mass Limit</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                        {m.realMission.launchMassKg.toLocaleString()} <span className="text-xs text-on-surface-variant">kg</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Min Science Telemetry</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                        {m.minScienceDataMB.toLocaleString()} <span className="text-xs text-on-surface-variant">MB</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Difficulty Rating</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-moonPolar font-bold">
                        ★★☆☆ <span className="text-xs text-on-surface-variant">(INTERMEDIATE)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {!unlocked ? (
                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant text-center font-telemetry-label text-telemetry-label text-on-surface-variant">
                      LOCKED // Complete Earth-Orbit Mission to Unlock
                    </div>
                    <button
                      type="button"
                      disabled
                      className="w-full h-12 border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-headline-panel text-headline-panel font-semibold tracking-widest uppercase rounded flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                    >
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                      <span>[ CLEARANCE RESTRICTED - LOCKED ]</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(`/missions/${m.id}/briefing`)}
                    className="w-full h-12 border-2 border-moonPolar hover:bg-moonPolar text-moonPolar hover:text-surface font-headline-panel text-headline-panel font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                  >
                    <span className="material-symbols-outlined text-[20px]">explore</span>
                    <span>[ ARCHITECT LRO ]</span>
                  </button>
                )}
              </article>
            );
          }

          if (m.id === 'mars') {
            return (
              <article
                key={m.id}
                className="group relative bg-surface-container border border-outline-variant/50 hover:border-marsRust rounded-lg p-5 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-[0_0_24px_rgba(224,112,61,0.2)]"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-marsRust rounded-t-lg" />
                <div className="absolute top-3 right-3 text-marsRust font-telemetry-label text-telemetry-label tracking-widest pointer-events-none opacity-40">
                  GRID: MVN-ARES
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-marsRust" />
                      <span className="font-telemetry-label text-telemetry-label text-marsRust uppercase tracking-wider bg-marsRust/10 border border-marsRust/30 px-2 py-0.5 rounded-sm">
                        {unlocked ? 'UNLOCKED // READY FOR FLIGHT' : 'LOCKED'}
                      </span>
                    </div>
                    {pb ? (
                      <span className="font-telemetry-clock text-telemetry-clock text-status-good bg-status-good/10 border border-status-good/30 px-2 py-0.5 rounded-sm">
                        ★ BEST: {pb.score} / 100 [RANK {getRank(pb.score)}]
                      </span>
                    ) : (
                      <span className="font-telemetry-clock text-telemetry-clock text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-sm">
                        PENDING CERTIFICATION RUN
                      </span>
                    )}
                  </div>

                  <div className="font-subhead-tech text-subhead-tech text-on-surface-variant tracking-wider uppercase mb-1">
                    TIER 3 // HIGH-ELLIPTICITY AERONOMY
                  </div>
                  <h2 className="font-headline-panel text-headline-panel text-on-surface font-bold tracking-wide uppercase mb-1">
                    MAVEN // MARTIAN AERONOMY EXPLORER
                  </h2>
                  <div className="text-body-caption text-marsRust/80 font-telemetry-label uppercase tracking-wider mb-4">
                    Mars Atmosphere &amp; Volatiles Evolution
                  </div>

                  {/* Tactical Mars Vector Graphic */}
                  <div className="relative w-full h-44 bg-surface-container-lowest border border-outline-variant/40 rounded flex items-center justify-center overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,112,61,0.15),transparent_70%)]" />
                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-outline-variant/30" xmlns="http://www.w3.org/2000/svg">
                      <line strokeWidth="1" x1="20" x2="40" y1="20" y2="20" />
                      <line strokeWidth="1" x1="20" x2="20" y1="20" y2="40" />
                    </svg>

                    <svg className="w-40 h-40 relative z-10" fill="none" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
                      <path className="opacity-80" d="M35 125 C 20 80, 50 25, 140 35 C 175 40, 160 120, 100 135 C 75 142, 45 145, 35 125 Z" stroke="#E0703D" strokeDasharray="4 3" strokeWidth="1.2" />
                      <circle cx="85" cy="85" fill="#3D1D14" r="44" stroke="#E0703D" strokeWidth="1.5" />
                      <path d="M72 43 Q 85 50 98 43 Q 85 41 72 43 Z" fill="#E6ECF8" opacity="0.9" />
                      <path d="M64 88 Q 80 94 105 84 Q 112 86 118 84" fill="none" stroke="#E0703D" strokeLinecap="round" strokeWidth="2" />
                      <circle cx="60" cy="72" fill="#5E2818" r="5" stroke="#E0703D" strokeWidth="0.8" />
                      <circle cx="60" cy="72" fill="#E6ECF8" r="1.5" />
                      <path d="M42 105 L 50 115" stroke="#3DBE7A" strokeWidth="1.5" />
                      <circle cx="42" cy="105" fill="#3DBE7A" r="2" />
                    </svg>

                    <div className="absolute bottom-2 left-3 font-telemetry-label text-telemetry-label text-on-surface-variant">
                      PERIAPSIS: 150 KM // APOAPSIS: 6,200 KM
                    </div>
                    <div className="absolute bottom-2 right-3 font-telemetry-label text-telemetry-label text-marsRust">
                      AEROBRAKE DIP: ACTIVE
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-surface-container-lowest p-3 rounded border border-outline-variant/30 mb-4">
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Budget Ceiling</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                        ${(m.budgetCapUSD / 1e6).toFixed(0)},000,000 <span className="text-xs text-on-surface-variant">(${(m.budgetCapUSD / 1e6).toFixed(0)}M)</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Payload Mass Limit</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                        {m.realMission.launchMassKg.toLocaleString()} <span className="text-xs text-on-surface-variant">kg</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Min Science Telemetry</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                        {m.minScienceDataMB.toLocaleString()} <span className="text-xs text-on-surface-variant">MB</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Difficulty Rating</span>
                      <span className="font-telemetry-readout-md text-telemetry-readout-md text-marsRust font-bold">
                        ★★★☆ <span className="text-xs text-on-surface-variant">(ADVANCED)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {!unlocked ? (
                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant text-center font-telemetry-label text-telemetry-label text-on-surface-variant">
                      LOCKED // Complete Earth-Orbit Mission to Unlock
                    </div>
                    <button
                      type="button"
                      disabled
                      className="w-full h-12 border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-headline-panel text-headline-panel font-semibold tracking-widest uppercase rounded flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                    >
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                      <span>[ CLEARANCE RESTRICTED - LOCKED ]</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(`/missions/${m.id}/briefing`)}
                    className="w-full h-12 bg-marsRust hover:bg-[#ff8f5a] text-surface font-headline-panel text-headline-panel font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow"
                  >
                    <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
                    <span>[ ARCHITECT MAVEN ]</span>
                  </button>
                )}
              </article>
            );
          }

          // OSIRIS-REx Asteroid Sample Return
          return (
            <article
              key={m.id}
              className="mission-card group relative bg-surface-container/60 border border-outline-variant/50 rounded-lg p-5 flex flex-col justify-between overflow-hidden shadow-md"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-asteroidViolet/50 rounded-t-lg" />
              <div className="absolute top-3 right-3 text-asteroidViolet font-telemetry-label text-telemetry-label tracking-widest pointer-events-none opacity-40">
                GRID: ORX-BENNU
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-status-warn text-[16px]">lock</span>
                    <span className="font-telemetry-label text-telemetry-label text-status-warn uppercase tracking-wider bg-status-warn/10 border border-status-warn/30 px-2 py-0.5 rounded-sm">
                      {unlocked ? 'UNLOCKED // SYSTEM CERTIFIED' : 'LOCKED (REQUIRES MARS CLEARANCE)'}
                    </span>
                  </div>
                  <span className="font-telemetry-clock text-telemetry-clock text-on-surface-variant">
                    TIER 4 ACCESS ONLY
                  </span>
                </div>

                <div className="font-subhead-tech text-subhead-tech text-on-surface-variant tracking-wider uppercase mb-1">
                  TIER 4 // DEEP SPACE SAMPLE RETURN &amp; RE-ENTRY
                </div>
                <h2 className="font-headline-panel text-headline-panel text-on-surface font-bold tracking-wide uppercase mb-1">
                  OSIRIS-REx // BENNU SAMPLE RETURN
                </h2>
                <div className="text-body-caption text-asteroidViolet/80 font-telemetry-label uppercase tracking-wider mb-4">
                  Asteroid Sample Return
                </div>

                {/* Bennu Diamond Polygonal Vector Graphic */}
                <div className="relative w-full h-44 bg-surface-container-lowest border border-outline-variant/40 rounded flex items-center justify-center overflow-hidden mb-4">
                  <svg className="w-36 h-36" fill="none" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="80" cy="80" rx="65" ry="32" stroke="#9D74FF" strokeDasharray="2 4" strokeWidth="1" transform="rotate(-30 80 80)" />
                    <polygon fill="#1A192E" points="80,36 118,58 126,92 98,124 58,122 36,90 44,56" stroke="#9D74FF" strokeWidth="1.5" />
                    <polyline opacity="0.6" points="80,36 82,78 126,92" stroke="#9D74FF" strokeWidth="0.8" />
                    <polyline opacity="0.6" points="82,78 98,124" stroke="#9D74FF" strokeWidth="0.8" />
                    <polyline opacity="0.6" points="82,78 58,122" stroke="#9D74FF" strokeWidth="0.8" />
                    <polyline opacity="0.6" points="82,78 36,90" stroke="#9D74FF" strokeWidth="0.8" />
                    <polyline opacity="0.6" points="82,78 44,56" stroke="#9D74FF" strokeWidth="0.8" />
                    <circle cx="82" cy="78" fill="#9D74FF" r="4" />
                    <line stroke="#3DBE7A" strokeDasharray="2 2" strokeWidth="1" x1="82" x2="108" y1="78" y2="48" />
                    <rect fill="#E6ECF8" height="6" width="8" x="106" y="44" />
                  </svg>
                  <div className="absolute bottom-2 left-3 font-telemetry-label text-telemetry-label text-on-surface-variant">
                    TARGET: 101955 BENNU // DIA: 490 M
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 bg-surface-container-lowest p-3 rounded border border-outline-variant/30 mb-4">
                  <div className="flex flex-col">
                    <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Budget Ceiling</span>
                    <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                      ${(m.budgetCapUSD / 1e6).toFixed(0)},000,000 <span className="text-xs text-on-surface-variant">(${(m.budgetCapUSD / 1e6).toFixed(0)}M)</span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Payload Mass Limit</span>
                    <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                      {m.realMission.launchMassKg.toLocaleString()} <span className="text-xs text-on-surface-variant">kg</span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Sample Objective</span>
                    <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-bold">
                      {m.minScienceDataMB.toLocaleString()} MB <span className="text-xs text-on-surface-variant">+ 60g SAMPLE</span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Difficulty Rating</span>
                    <span className="font-telemetry-readout-md text-telemetry-readout-md text-asteroidViolet font-bold">
                      ★★★★ <span className="text-xs text-on-surface-variant">(MASTER)</span>
                    </span>
                  </div>
                </div>
              </div>

              {!unlocked ? (
                <div className="flex flex-col gap-2">
                  <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant text-center font-telemetry-label text-telemetry-label text-on-surface-variant">
                    LOCKED // Complete Earth-Orbit Mission to Unlock
                  </div>
                  <button
                    type="button"
                    disabled
                    className="w-full h-12 border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-headline-panel text-headline-panel font-semibold tracking-widest uppercase rounded flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                  >
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    <span>[ CLEARANCE RESTRICTED - LOCKED ]</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(`/missions/${m.id}/briefing`)}
                  className="w-full h-12 bg-asteroidViolet hover:bg-[#b894ff] text-surface font-headline-panel text-headline-panel font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow"
                >
                  <span className="material-symbols-outlined text-[20px]">explore</span>
                  <span>[ ARCHITECT OSIRIS-REx ]</span>
                </button>
              )}
            </article>
          );
        })}
      </div>

      {/* Bottom Telemetry Summary Dock */}
      <footer className="bg-surface-container border border-outline-variant/40 rounded-lg p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow">
        <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <div className="flex flex-col">
              <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">ACTIVE OPERATOR</span>
              <span className="font-headline-panel text-subhead-tech text-on-surface font-bold">CDR. ALEX VANCE</span>
            </div>
          </div>
          <div className="hidden sm:block h-7 w-[1px] bg-outline-variant" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-status-good">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">FLIGHT DIRECTORATE</span>
              <span className="font-headline-panel text-subhead-tech text-status-good font-bold">NASA GSFC / JSC CERTIFIED</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface font-headline-panel text-subhead-tech uppercase transition-colors flex items-center gap-2 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>INITIALIZATION TERMINAL</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
