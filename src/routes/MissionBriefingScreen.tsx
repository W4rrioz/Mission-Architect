/**
 * Mission Briefing Screen
 * Source: 01-prd.md §4.2, 03-app-flow.md §3, 04-ui-ux-brief.md §6
 * Stitch Screen: mission_briefing_dossier_maven_mars_aeronomy
 *
 * Comprehensive aerospace mission briefing dossier.
 * Displays operational flight directive, scientific milestones, engineering constraints,
 * budget cap, target orbital mechanics diagram, and historical NASA benchmarks.
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MISSIONS } from '../data/missions';
import { MissionId } from '../domain/types';
import { useProgression } from '../context/ProgressionContext';
import { TutorialBanner } from '../components/TutorialBanner';

export const MissionBriefingScreen: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();
  const { isMissionUnlocked } = useProgression();

  const validMissionId = (missionId as MissionId) || 'earth-orbit';
  const mission = MISSIONS[validMissionId] || MISSIONS['earth-orbit'];

  useEffect(() => {
    if (!isMissionUnlocked(validMissionId)) {
      navigate('/missions', { replace: true });
    }
  }, [validMissionId, isMissionUnlocked, navigate]);

  const budgetMillions = (mission.budgetCapUSD / 1e6).toFixed(0);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6 text-on-surface">
      {/* Tutorial Guidance Step 2 */}
      {mission.isTutorial && (
        <TutorialBanner
          stepNumber={2}
          title="Flight Briefing &amp; Directives"
          instructions="Carefully analyze your operational envelope. You must design a spacecraft that meets the minimum science data quota while remaining strictly under the allocated budget cap."
          tip="Check required Δv — your propulsion system must provide at least this velocity change."
        />
      )}

      {/* TOP DOSSIER HEADER & METADATA */}
      <section className="flex flex-col gap-4">
        {/* Breadcrumb & Ident */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-telemetry-label text-telemetry-label text-on-surface-variant uppercase tracking-wider">
            <Link to="/missions" className="hover:text-primary transition-colors">
              FLIGHT CATALOG
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">
              PROFILE 0{mission.difficulty}: {mission.name.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-surface-container font-telemetry-label text-telemetry-label text-primary border border-outline-variant/30">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              FLIGHT CLEARANCE: AUTHORIZED
            </span>
            <span className="px-2.5 py-0.5 rounded bg-surface-container-high font-telemetry-label text-telemetry-label text-secondary font-bold tracking-widest border border-outline-variant/30">
              [{validMissionId.toUpperCase()}-STD-REV]
            </span>
          </div>
        </div>

        {/* Title & Directive Clearance Bar */}
        <div className="bg-surface-container p-5 md:p-6 rounded-lg shadow border border-outline-variant/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-1.5 self-stretch bg-primary rounded-full" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-base">public</span>
                <span className="font-telemetry-label text-telemetry-label uppercase tracking-widest text-primary font-bold">
                  OPERATIONAL FLIGHT DIRECTIVE // LEVEL OF INTENT
                </span>
              </div>
              <h1 className="font-headline-panel text-2xl md:text-3xl uppercase tracking-wide text-on-surface font-bold">
                {mission.name}
              </h1>
              <p className="font-body-caption text-body-caption text-on-surface-variant tracking-wider uppercase mt-1">
                OFFICIAL NASA FLIGHT PROFILE // {mission.realMission.name.toUpperCase()} HISTORICAL BENCHMARK // CLEARANCE TIER {mission.difficulty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="w-14 h-14 rounded-lg bg-surface-container-lowest border border-outline-variant/50 p-1 flex items-center justify-center shadow">
              <img
                src="/assets/stitch/patch-insignia.png"
                alt="Mission Seal"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Quick Status Pill Cluster */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-surface-container-low p-3 rounded border border-outline-variant/30 flex flex-col">
            <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Target Body</span>
            <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-semibold uppercase">
              {mission.orbit.centralBody} ({mission.orbit.solarDistanceAU} AU)
            </span>
          </div>
          <div className="bg-surface-container-low p-3 rounded border border-outline-variant/30 flex flex-col">
            <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Required Delta-V</span>
            <span className="font-telemetry-readout-md text-telemetry-readout-md text-primary font-semibold">
              ≥ {mission.orbit.requiredDeltaVms.toLocaleString()} m/s
            </span>
          </div>
          <div className="bg-surface-container-low p-3 rounded border border-outline-variant/30 flex flex-col">
            <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Trajectory Class</span>
            <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-semibold uppercase truncate">
              {mission.orbit.regime}
            </span>
          </div>
          <div className="bg-surface-container-low p-3 rounded border border-outline-variant/30 flex flex-col">
            <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">Difficulty Rating</span>
            <span className="font-telemetry-readout-md text-telemetry-readout-md text-tertiary font-semibold">
              TIER {mission.difficulty} ({mission.difficulty === 1 ? 'STANDARD' : mission.difficulty === 2 ? 'INTERMEDIATE' : mission.difficulty === 3 ? 'ADVANCED' : 'MASTER'})
            </span>
          </div>
        </div>
      </section>

      {/* MAIN 2-COLUMN BALANCED DOSSIER LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Directives, Limits & Schematic (7 COLS) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* PANEL 1: PRIMARY SCIENTIFIC DIRECTIVE */}
          <div className="bg-surface-container p-5 md:p-6 rounded-lg shadow border border-outline-variant/40">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">cyclone</span>
                <h2 className="font-headline-panel text-headline-panel tracking-wider uppercase text-on-surface font-bold">
                  PRIMARY SCIENTIFIC DIRECTIVE
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-high font-telemetry-label text-telemetry-label text-primary uppercase">
                DIRECTIVE // SCIENCE OPERATIONS
              </span>
            </div>

            <p className="font-body-dense text-body-dense text-on-surface-variant leading-relaxed mb-4">
              {mission.objective}
            </p>

            <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant/30 mb-4">
              <div className="font-telemetry-label text-telemetry-label uppercase tracking-wider text-outline mb-2">
                CRITICAL MISSION PHASE MILESTONES
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2.5 p-2 bg-surface-container rounded">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                  <div className="flex flex-col">
                    <span className="font-subhead-tech text-subhead-tech text-on-surface">LAUNCH &amp; ORBITAL INJECTION</span>
                    <span className="font-body-caption text-body-caption text-on-surface-variant">
                      Ascent via certified launch vehicle to target orbital insertion plane and velocity.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 bg-surface-container rounded">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                  <div className="flex flex-col">
                    <span className="font-subhead-tech text-subhead-tech text-on-surface">PROPULSION &amp; ATTITUDE CONTROL</span>
                    <span className="font-body-caption text-body-caption text-on-surface-variant">
                      Provide at least {mission.orbit.requiredDeltaVms} m/s total velocity impulse for stationkeeping and maneuvers.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 bg-surface-container rounded">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                  <div className="flex flex-col">
                    <span className="font-subhead-tech text-subhead-tech text-on-surface">CONTINUOUS TELEMETRY DOWNLINK</span>
                    <span className="font-body-caption text-body-caption text-on-surface-variant">
                      Generate and downlink at least {mission.minScienceDataMB.toLocaleString()} MB of verified science data packets.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-surface-container-low p-2.5 rounded border border-outline-variant/20">
                <span className="font-telemetry-label text-telemetry-label uppercase text-on-surface-variant">ORBIT PERIOD</span>
                <div className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface mt-0.5">
                  {mission.orbit.periodMinutes} MIN
                </div>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded border border-outline-variant/20">
                <span className="font-telemetry-label text-telemetry-label uppercase text-on-surface-variant">ECLIPSE MAX</span>
                <div className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface mt-0.5">
                  {mission.orbit.eclipseDurationMinutes} MIN
                </div>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded border border-outline-variant/20">
                <span className="font-telemetry-label text-telemetry-label uppercase text-on-surface-variant">DSN RANGE</span>
                <div className="font-telemetry-readout-md text-telemetry-readout-md text-primary mt-0.5">
                  {mission.orbit.distanceToEarthKm.toLocaleString()} KM
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 2: ENGINEERING REQUIREMENTS & FLIGHT ENVELOPE */}
          <div className="bg-surface-container p-5 md:p-6 rounded-lg shadow border border-outline-variant/40">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">tune</span>
                <h2 className="font-headline-panel text-headline-panel tracking-wider uppercase text-on-surface font-bold">
                  ENGINEERING REQUIREMENTS &amp; FLIGHT ENVELOPE
                </h2>
              </div>
              <span className="font-telemetry-label text-telemetry-label text-outline uppercase">LIMIT RESTRICTIONS // JSC-FOD</span>
            </div>

            {/* 3 Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-surface-container-low p-3.5 rounded border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-telemetry-label text-telemetry-label uppercase text-on-surface-variant">
                      HARD BUDGET CAP
                    </span>
                    <span className="material-symbols-outlined text-status-warn text-sm">warning</span>
                  </div>
                  <div className="font-telemetry-readout-xl text-telemetry-readout-xl text-on-surface font-bold">
                    {`$${budgetMillions}M`}
                  </div>
                  <span className="font-body-caption text-body-caption text-outline">
                    Hard Class-B Programmatic Limit ({`$${budgetMillions},000,000`})
                  </span>
                </div>
                <div className="mt-3 pt-1">
                  <div className="h-1.5 w-full bg-surface-container-highest rounded overflow-hidden">
                    <div className="h-full bg-primary-container w-[75%]" />
                  </div>
                  <span className="font-telemetry-label text-telemetry-label text-on-surface-variant mt-1 block">
                    Strict Cutoff Limit
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-low p-3.5 rounded border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-telemetry-label text-telemetry-label uppercase text-on-surface-variant">
                      REQUIRED Δv MANEUVER
                    </span>
                    <span className="material-symbols-outlined text-primary text-sm">speed</span>
                  </div>
                  <div className="font-telemetry-readout-xl text-telemetry-readout-xl text-primary font-bold">
                    {`${mission.orbit.requiredDeltaVms.toLocaleString()} m/s`}
                  </div>
                  <span className="font-body-caption text-body-caption text-outline">
                    Orbital Maneuver Quota
                  </span>
                </div>
                <div className="mt-3 pt-1">
                  <div className="h-1.5 w-full bg-surface-container-highest rounded overflow-hidden">
                    <div className="h-full bg-primary w-[85%]" />
                  </div>
                  <span className="font-telemetry-label text-telemetry-label text-on-surface-variant mt-1 block">
                    Propulsion Baseline
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-low p-3.5 rounded border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-telemetry-label text-telemetry-label uppercase text-on-surface-variant">
                      MIN. SCIENCE RETURN
                    </span>
                    <span className="material-symbols-outlined text-secondary text-sm">wifi_tethering</span>
                  </div>
                  <div className="font-telemetry-readout-xl text-telemetry-readout-xl text-on-surface font-bold">
                    {`${mission.minScienceDataMB.toLocaleString()} MB`}
                  </div>
                  <span className="font-body-caption text-body-caption text-outline">
                    Grade-S Certification Baseline
                  </span>
                </div>
                <div className="mt-3 pt-1">
                  <div className="h-1.5 w-full bg-surface-container-highest rounded overflow-hidden">
                    <div className="h-full bg-status-good w-[90%]" />
                  </div>
                  <span className="font-telemetry-label text-telemetry-label text-on-surface-variant mt-1 block">
                    Telemetry Quota Minimum
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Historical Benchmark & Subsystem Checklist (5 COLS) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* PANEL 4: HISTORICAL FLIGHT REFERENCE */}
          <div className="bg-surface-container p-5 md:p-6 rounded-lg shadow border border-outline-variant/40">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">history_edu</span>
                <h2 className="font-headline-panel text-headline-panel tracking-wider uppercase text-on-surface font-bold">
                  HISTORICAL BENCHMARK // REAL NASA MISSION SPECS
                </h2>
              </div>
              <span className="font-telemetry-label text-telemetry-label text-primary uppercase font-bold">
                {`Historical Predecessor: NASA ${mission.realMission.name}`}
              </span>
            </div>

            <div className="bg-surface-container-low p-3 rounded border border-outline-variant/30 flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">
                  FLIGHT REFERENCE SUMMARY
                </span>
                <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface">
                  {mission.realMission.summary}
                </span>
              </div>
            </div>

            {/* Technical Specifications Dense Matrix */}
            <div className="bg-surface-container-lowest rounded border border-outline-variant/30 overflow-hidden mb-3">
              <div className="bg-surface-container-high px-3 py-1.5 flex justify-between">
                <span className="font-telemetry-label text-telemetry-label uppercase text-on-surface">PARAMETER RECORD</span>
                <span className="font-telemetry-label text-telemetry-label uppercase text-outline">SPECIFICATION</span>
              </div>
              <div className="divide-y divide-outline-variant/20">
                <div className="px-3 py-1.5 flex justify-between items-center bg-surface-container-low">
                  <span className="font-body-dense text-body-dense text-on-surface-variant">Launch Vehicle</span>
                  <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-mono">
                    {mission.realMission.launchVehicle}
                  </span>
                </div>
                <div className="px-3 py-1.5 flex justify-between items-center bg-surface-container">
                  <span className="font-body-dense text-body-dense text-on-surface-variant">Real Launch Mass</span>
                  <span className="font-telemetry-readout-md text-telemetry-readout-md text-primary font-mono">
                    {mission.realMission.launchMassKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="px-3 py-1.5 flex justify-between items-center bg-surface-container-low">
                  <span className="font-body-dense text-body-dense text-on-surface-variant">Dry Mass</span>
                  <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-mono">
                    {mission.realMission.dryMassKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="px-3 py-1.5 flex justify-between items-center bg-surface-container">
                  <span className="font-body-dense text-body-dense text-on-surface-variant">Solar Array Power</span>
                  <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-mono">
                    {mission.realMission.powerW.toLocaleString()} W
                  </span>
                </div>
                <div className="px-3 py-1.5 flex justify-between items-center bg-surface-container-low">
                  <span className="font-body-dense text-body-dense text-on-surface-variant">Mission Life Cost</span>
                  <span className="font-telemetry-readout-md text-telemetry-readout-md text-on-surface font-mono">
                    ${(mission.realMission.costUSD / 1e6).toFixed(1)}M
                  </span>
                </div>
                <div className="px-3 py-1.5 flex justify-between items-center bg-surface-container">
                  <span className="font-body-dense text-body-dense text-on-surface-variant">Operational Orbit</span>
                  <span className="font-telemetry-readout-md text-telemetry-readout-md text-tertiary font-mono">
                    {mission.realMission.orbit}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/30 text-body-caption text-on-surface-variant">
              <strong className="text-on-surface">Data Grounding:</strong> {mission.realMission.sourceNote}
            </div>
          </div>

          {/* PANEL 5: OPERATOR CAD CHECKLIST */}
          <div className="bg-surface-container p-5 md:p-6 rounded-lg shadow border border-outline-variant/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">checklist_rtl</span>
                  <h2 className="font-headline-panel text-headline-panel tracking-wider uppercase text-on-surface font-bold">
                    CAD INTEGRATION TARGETS
                  </h2>
                </div>
                <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase">
                  DESIGN READY
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="bg-surface-container-low p-2.5 rounded border border-outline-variant/30 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">rocket</span>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-subhead-tech text-subhead-tech text-on-surface">LAUNCH VEHICLE CAPABILITY</span>
                      <span className="font-telemetry-label text-telemetry-label text-primary">≥ PAYLOAD MASS</span>
                    </div>
                    <span className="font-body-caption text-body-caption text-on-surface-variant">
                      Ensure your total wet mass does not exceed the launch vehicle payload rating.
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-2.5 rounded border border-outline-variant/30 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">wb_sunny</span>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-subhead-tech text-subhead-tech text-on-surface">SOLAR &amp; BATTERY BUFFER</span>
                      <span className="font-telemetry-label text-telemetry-label text-tertiary">
                        {mission.orbit.eclipseDurationMinutes} MIN ECLIPSE
                      </span>
                    </div>
                    <span className="font-body-caption text-body-caption text-on-surface-variant">
                      Equip sufficient battery capacity to power active systems throughout eclipse passes.
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-2.5 rounded border border-outline-variant/30 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">device_thermostat</span>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-subhead-tech text-subhead-tech text-on-surface">THERMAL RADIATORS</span>
                      <span className="font-telemetry-label text-telemetry-label text-status-good">PASSIVE/ACTIVE</span>
                    </div>
                    <span className="font-body-caption text-body-caption text-on-surface-variant">
                      Balance radiator dissipation against internal payload heat dissipation and solar flux.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded bg-surface-container-highest flex items-center justify-between border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">verified_user</span>
                <span className="font-telemetry-label text-telemetry-label text-on-surface uppercase">
                  FLIGHT DIRECTORATE CONCURRENCE
                </span>
              </div>
              <span className="font-telemetry-label text-telemetry-label text-primary font-bold">
                READY FOR SYSTEMS CAD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER COMMAND DOCKING BAR */}
      <section className="bg-surface-container p-4 rounded-lg shadow border border-outline-variant/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          to="/missions"
          className="px-4 py-2.5 rounded bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-subhead-tech text-subhead-tech uppercase flex items-center gap-2 transition-colors border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>RETURN TO CATALOG</span>
        </Link>

        <div className="flex items-center gap-2 text-center">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="font-telemetry-label text-telemetry-label uppercase tracking-widest text-on-surface-variant">
            FLIGHT DIRECTIVE ACCEPTED // <span className="text-primary font-semibold">CAD WORKBENCH STANDBY</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/missions/${validMissionId}/design`)}
          className="w-full md:w-auto px-8 py-3 rounded bg-primary text-on-primary hover:bg-primary-fixed-dim transition-all font-headline-panel text-headline-panel tracking-wider uppercase font-bold flex items-center justify-center gap-2 shadow"
        >
          <span>Begin Spacecraft Design</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </section>
    </div>
  );
};
