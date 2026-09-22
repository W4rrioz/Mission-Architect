/**
 * Live Mission Control Simulation & State Machine
 * Source: 01-prd.md §4.5, 05-backend-schema.md §3, §6, and 07-domain-reference.md §3, §4, §6
 */

import {
  Mission,
  SpacecraftDesign,
  MissionRunState,
  DecisionCard,
  LogEntry,
  PartCatalogEntry,
  PropulsionPerf,
  InstrumentPerf,
  CommsPerf,
  RedundancyPerf,
} from './types';
import { PARTS } from '../data/parts';
import { computeDerivedGauges } from './design';
import { calculateDataVolumeMB } from './formulas';

// Phase duration boundaries in compressed MET (Mission Elapsed Time seconds)
export const PHASE_TIMINGS = {
  launchEnd: 60,
  cruiseEnd: 180,
  arrivalEnd: 240,
  scienceOpsEnd: 360,
} as const;

function formatMET(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `[T+${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}]`;
}

/**
 * Initializes a new mission run from a finalized SpacecraftDesign and Mission.
 */
export function startMissionRun(
  design: SpacecraftDesign,
  mission: Mission,
  catalog: PartCatalogEntry[] = PARTS
): MissionRunState {
  const partMap = new Map(catalog.map((p) => [p.id, p]));
  const derived = computeDerivedGauges(design, mission, catalog);

  const propPart = design.selectedParts.propulsion ? partMap.get(design.selectedParts.propulsion) : null;
  const initialFuelKg = propPart
    ? (design.sliderValues[`${propPart.id}.propellantLoadKg`] ??
       (propPart.sliderRanges?.[0]?.defaultValue ?? 0))
    : 0;

  const initialLog: LogEntry[] = [
    {
      id: 'log-init-1',
      timestampMET: 0,
      message: `${mission.name} flight systems activated. Ready for liftoff.`,
      type: 'info',
    },
  ];

  if (!design.selectedParts.launchVehicle) {
    initialLog.push({
      id: 'log-init-no-lv',
      timestampMET: 0,
      message: 'CRITICAL: No launch vehicle integrated. Trajectory insertion impossible.',
      type: 'error',
    });
  }

  return {
    missionId: mission.id,
    phase: 'launch',
    elapsedSeconds: 0,
    fuelRemainingKg: initialFuelKg,
    powerBalanceW: derived.powerW.limit - derived.powerW.current,
    dataStoredMB: 0,
    dataDownlinkedMB: 0,
    commsLinkOk: !derived.linkMarginDb.isOver,
    temperatureK: derived.thermalEquilibriumK.current,
    activeDecisionCard: null,
    eventLog: initialLog,
    outcome: null,
    decisionTimerRemaining: 0,
    totalDecisionsMade: 0,
    fastDecisionsCount: 0,
    totalBurnDeltaVms: 0,
    requiredBurnDeltaVms: mission.orbit.requiredDeltaVms,
  };
}

// ============================================================================
// DECISION CARD GENERATORS (4 Types per 01-prd.md §4.5)
// ============================================================================

export function createLaunchWindowEvent(mission: Mission): DecisionCard {
  return {
    id: `event-launch-window-${Date.now()}`,
    type: 'launchWindow',
    prompt:
      'Upper-Atmospheric Wind Shear Alert: Doppler lidar detects high shear near Max-Q. Launch azimuth margins are compressed.',
    responses: [
      {
        id: 'hold-window',
        label: 'Hold for Backup Launch Window',
        description: 'Vents 25 kg boiloff propellant while holding on pad for nominal atmospheric calm.',
        fuelCostKg: 25,
      },
      {
        id: 'punch-through',
        label: 'Commit to Heavy Throttle Profile',
        description: 'Compensates with active engine gimbaling and higher initial burn rate.',
        fuelCostKg: 50,
      },
    ],
    timeoutSeconds: mission.isTutorial ? 45 : 15,
    defaultResponseId: 'punch-through',
  };
}

export function createFailureEvent(
  mission: Mission,
  design: SpacecraftDesign,
  catalog: PartCatalogEntry[] = PARTS
): DecisionCard {
  const partMap = new Map(catalog.map((p) => [p.id, p]));
  const redPart = design.selectedParts.redundancy ? partMap.get(design.selectedParts.redundancy) : null;
  const isRedundant = redPart && (redPart.perfProfile as RedundancyPerf).failureRateMultiplier < 0.5;

  return {
    id: `event-failure-${Date.now()}`,
    type: 'failure',
    prompt:
      'Reaction Wheel Cluster Desaturation Fault: Wheel-2 bearing friction spike is dumping attitude control torque into RCS thrusters.',
    responses: [
      {
        id: 'switch-redundant',
        label: isRedundant ? 'Switch to Redundant Backup Wheel' : 'Emergency Thruster Attitude Dump',
        description: isRedundant
          ? 'Cross-strapped Class A/B backup hardware takes over instantly with zero penalty.'
          : 'Non-redundant system must burn 40 kg propellant to stabilize spacecraft roll.',
        fuelCostKg: isRedundant ? 0 : 40,
      },
      {
        id: 'magnetic-torquer-unload',
        label: 'Slow Magnetorquer Desaturation',
        description: 'Takes 45 seconds of attitude drift, temporarily corrupting telemetry buffer.',
        dataLossMB: 1200,
      },
    ],
    timeoutSeconds: mission.isTutorial ? 45 : 18,
    defaultResponseId: 'switch-redundant',
  };
}

export function createCommsBlackoutEvent(mission: Mission): DecisionCard {
  return {
    id: `event-comms-blackout-${Date.now()}`,
    type: 'commsBlackout',
    prompt:
      'Deep Space Network Carrier Loss: Earth ground station handover delay encountered. Uplink/downlink lock broken.',
    responses: [
      {
        id: 'buffer-data',
        label: 'Buffer Science into Solid-State Storage',
        description: 'Safely stores observational packets in onboard flash memory until link re-acquisition.',
      },
      {
        id: 'overdrive-twta',
        label: 'Overdrive TWTA Transmitter Gain',
        description: 'Drives Traveling Wave Tube Amplifier +30W above nominal to cut through atmospheric attenuation.',
        powerCostW: 40,
      },
    ],
    timeoutSeconds: mission.isTutorial ? 45 : 16,
    defaultResponseId: 'buffer-data',
  };
}

export function createBudgetScheduleEvent(mission: Mission): DecisionCard {
  return {
    id: `event-budget-schedule-${Date.now()}`,
    type: 'budgetSchedule',
    prompt:
      'Target of Opportunity: Optical navigation cameras identify a pristine uncataloged crater/regolith outcrop along current ground track.',
    responses: [
      {
        id: 'execute-survey',
        label: 'Authorize Orbit Trim for Secondary Science',
        description: 'Burns 35 kg propellant to align camera passes, gathering 20,000 MB high-value bonus science.',
        fuelCostKg: 35,
        scienceBonusMB: 20_000,
      },
      {
        id: 'stay-nominal',
        label: 'Maintain Nominal Flight Trajectory',
        description: 'Declines secondary survey to conserve fuel margin and power reserves.',
      },
    ],
    timeoutSeconds: mission.isTutorial ? 45 : 20,
    defaultResponseId: 'stay-nominal',
  };
}

// ============================================================================
// DECISION RESOLUTION
// ============================================================================

export function resolveDecisionCard(
  state: MissionRunState,
  responseId: string,
  isFastDecision: boolean = false
): MissionRunState {
  if (!state.activeDecisionCard) return state;

  const card = state.activeDecisionCard;
  const chosenResponse = card.responses.find((r) => r.id === responseId) || card.responses[0];

  const fuelCost = chosenResponse.fuelCostKg ?? 0;
  const powerCost = chosenResponse.powerCostW ?? 0;
  const dataLoss = chosenResponse.dataLossMB ?? 0;
  const scienceBonus = chosenResponse.scienceBonusMB ?? 0;

  const nextFuel = Math.max(0, state.fuelRemainingKg - fuelCost);
  const nextPowerBalance = state.powerBalanceW - powerCost;
  const nextDataStored = Math.max(0, state.dataStoredMB - dataLoss + scienceBonus);

  const newLog: LogEntry = {
    id: `log-decision-${Date.now()}-${Math.random()}`,
    timestampMET: state.elapsedSeconds,
    message: `Decision executed: [${card.type.toUpperCase()}] -> ${chosenResponse.label}.`,
    type: 'info',
  };

  const nextLog = [...state.eventLog, newLog];

  // Check if resolution caused critical fuel depletion
  let nextOutcome = state.outcome;
  let failureReason = state.failureReason;
  if (state.fuelRemainingKg > 0 && nextFuel <= 0 && state.phase !== 'scienceOps') {
    nextOutcome = 'fail';
    failureReason = 'Fuel reserves exhausted following critical event response.';
    nextLog.push({
      id: `log-fuel-exhausted-${Date.now()}`,
      timestampMET: state.elapsedSeconds,
      message: 'CRITICAL FAILURE: Propellant tanks dry. Attitude and trajectory control lost.',
      type: 'error',
    });
  }

  return {
    ...state,
    fuelRemainingKg: nextFuel,
    powerBalanceW: nextPowerBalance,
    dataStoredMB: nextDataStored,
    activeDecisionCard: null,
    decisionTimerRemaining: 0,
    totalDecisionsMade: state.totalDecisionsMade + 1,
    fastDecisionsCount: state.fastDecisionsCount + (isFastDecision ? 1 : 0),
    eventLog: nextLog,
    outcome: nextOutcome,
    failureReason,
  };
}

// ============================================================================
// CLOCK ADVANCE SIMULATION TICK
// ============================================================================

export function advanceClock(
  state: MissionRunState,
  deltaSeconds: number,
  design: SpacecraftDesign,
  mission: Mission,
  catalog: PartCatalogEntry[] = PARTS,
  customRng: () => number = Math.random
): MissionRunState {
  // If mission already concluded, clock does not advance
  if (state.outcome !== null) return state;

  // RULE: If decision card is open, timer counts down and clock DOES NOT advance until card resolves
  if (state.activeDecisionCard !== null) {
    const nextTimer = state.decisionTimerRemaining - deltaSeconds;
    if (nextTimer <= 0) {
      // Automatic resolution with default worse-case response on timeout
      const card = state.activeDecisionCard;
      const timeoutLog: LogEntry = {
        id: `log-timeout-${Date.now()}`,
        timestampMET: state.elapsedSeconds,
        message: `Decision timer expired! Default response automatically applied: ${card.defaultResponseId}.`,
        type: 'warn',
      };
      const timedOutState = {
        ...state,
        eventLog: [...state.eventLog, timeoutLog],
      };
      return resolveDecisionCard(timedOutState, card.defaultResponseId, false);
    }

    return {
      ...state,
      decisionTimerRemaining: nextTimer,
    };
  }

  // Advance simulation clock
  const nextElapsed = state.elapsedSeconds + deltaSeconds;
  const partMap = new Map(catalog.map((p) => [p.id, p]));
  const instPart = design.selectedParts.instrument ? partMap.get(design.selectedParts.instrument) : null;
  const propPart = design.selectedParts.propulsion ? partMap.get(design.selectedParts.propulsion) : null;

  // 1. Determine Current Mission Phase
  let currentPhase = state.phase;
  const newLogs: LogEntry[] = [];

  if (state.phase === 'launch' && nextElapsed >= PHASE_TIMINGS.launchEnd) {
    currentPhase = 'cruise';
    newLogs.push({
      id: `log-cruise-enter-${Date.now()}`,
      timestampMET: nextElapsed,
      message: `${formatMET(nextElapsed)} Booster separation nominal. Spacecraft entering cruise trajectory.`,
      type: 'success',
    });
  } else if (state.phase === 'cruise' && nextElapsed >= PHASE_TIMINGS.cruiseEnd) {
    currentPhase = 'arrival';
    newLogs.push({
      id: `log-arrival-enter-${Date.now()}`,
      timestampMET: nextElapsed,
      message: `${formatMET(nextElapsed)} Target approach vector locked. Commencing Orbit Insertion burn.`,
      type: 'info',
    });
  } else if (state.phase === 'arrival' && nextElapsed >= PHASE_TIMINGS.arrivalEnd) {
    currentPhase = 'scienceOps';
    newLogs.push({
      id: `log-science-enter-${Date.now()}`,
      timestampMET: nextElapsed,
      message: `${formatMET(nextElapsed)} Insertion burn complete. Stable orbit confirmed. Commencing primary science survey.`,
      type: 'success',
    });
  } else if (state.phase === 'scienceOps' && nextElapsed >= PHASE_TIMINGS.scienceOpsEnd) {
    currentPhase = 'endOfMission';
  }

  // 2. Propulsion Burns & Delta-V Progression
  let nextFuel = state.fuelRemainingKg;
  let nextBurnDeltaV = state.totalBurnDeltaVms;
  let nextOutcome: 'pass' | 'fail' | null = state.outcome;
  let failureReason = state.failureReason;

  if (currentPhase === 'launch' && state.phase === 'launch') {
    // Minor attitude thruster burn during launch
    const burnRate = 0.2 * deltaSeconds;
    nextFuel = Math.max(0, nextFuel - burnRate);
  } else if (currentPhase === 'arrival') {
    // Major orbital insertion burn (LOI/MOI/Rendezvous)
    const arrivalBurnDuration = PHASE_TIMINGS.arrivalEnd - PHASE_TIMINGS.cruiseEnd; // 60s
    const targetDeltaV = mission.orbit.requiredDeltaVms;
    const deltaVPerSecond = targetDeltaV / arrivalBurnDuration;
    const burnThisTick = Math.min(targetDeltaV - nextBurnDeltaV, deltaVPerSecond * deltaSeconds);

    if (burnThisTick > 0 && propPart) {
      const isp = (propPart.perfProfile as PropulsionPerf).ispSeconds;
      const derived = computeDerivedGauges(design, mission, catalog);
      const totalDryMassKg = derived.massKg.current - (design.sliderValues[`${propPart.id}.propellantLoadKg`] ?? 900);
      const currentMass = totalDryMassKg + nextFuel;

      // Exact rocket equation propellant consumption: Δm = m * (1 - e^(-Δv / (Isp * g0)))
      const fuelConsumedKg = currentMass * (1 - Math.exp(-burnThisTick / (isp * 9.80665)));

      if (nextFuel < fuelConsumedKg) {
        // Ran out of fuel before burn completed!
        nextBurnDeltaV += (nextFuel / fuelConsumedKg) * burnThisTick;
        nextFuel = 0;
        nextOutcome = 'fail';
        failureReason = 'Fuel depleted during orbital insertion burn. Craft stranded on hyperbolic flyby.';
        newLogs.push({
          id: `log-fail-burn-${Date.now()}`,
          timestampMET: nextElapsed,
          message: `${formatMET(nextElapsed)} CRITICAL: Main engine fuel starved! Orbit insertion failed.`,
          type: 'error',
        });
      } else {
        nextFuel -= fuelConsumedKg;
        nextBurnDeltaV += burnThisTick;
      }
    }
  }

  // 3. Science Gathering & Telemetry Downlink during scienceOps
  let nextDataStored = state.dataStoredMB;
  let nextDataDownlinked = state.dataDownlinkedMB;

  if (currentPhase === 'scienceOps' && instPart) {
    const inst = instPart.perfProfile as InstrumentPerf;
    // Time compression factor: 1 compressed second represents ~400 operational seconds (~6.7 minutes)
    const compressionFactor = 400;
    const effectiveSeconds = deltaSeconds * compressionFactor;

    const dataGatheredMB = calculateDataVolumeMB(inst.dataRateKbps, effectiveSeconds) * inst.dutyCycleDefault;
    nextDataStored += dataGatheredMB;

    // Downlink data if comms link is active
    if (state.commsLinkOk) {
      const commsPart = design.selectedParts.comms ? partMap.get(design.selectedParts.comms) : null;
      const downlinkRateKbps = commsPart ? (commsPart.perfProfile as CommsPerf).transmitPowerW * 1500 : 30000;
      const downlinkCapacityMB = calculateDataVolumeMB(downlinkRateKbps, effectiveSeconds);
      const downlinkedMB = Math.min(nextDataStored, downlinkCapacityMB);

      nextDataDownlinked += downlinkedMB;
      nextDataStored -= downlinkedMB;
    }
  }

  // 4. Decision Card Event Triggers (spaced across phases)
  let nextCard: DecisionCard | null = null;
  let nextTimer = 0;

  // Trigger 1: Launch Window event in Launch phase (~T+25s)
  if (
    state.elapsedSeconds < 25 &&
    nextElapsed >= 25 &&
    state.totalDecisionsMade === 0
  ) {
    nextCard = createLaunchWindowEvent(mission);
    nextTimer = nextCard.timeoutSeconds;
    newLogs.push({
      id: `log-event-lw-${Date.now()}`,
      timestampMET: nextElapsed,
      message: `${formatMET(nextElapsed)} PRIORITY EVENT: ${nextCard.prompt}`,
      type: 'warn',
    });
  }

  // Trigger 2: Subsystem failure anomaly in Cruise phase (~T+110s)
  else if (
    state.elapsedSeconds < 110 &&
    nextElapsed >= 110 &&
    state.totalDecisionsMade <= 1
  ) {
    // Probability scaled by Section 6 reliability
    const derived = computeDerivedGauges(design, mission, catalog);
    const failureThreshold = (1 - derived.reliabilityEstimate) * mission.eventProfile.baseFailureRateMultiplier;
    // Always fire if failure probability warrants or deterministic test
    if (customRng() < Math.max(0.4, failureThreshold)) {
      nextCard = createFailureEvent(mission, design, catalog);
      nextTimer = nextCard.timeoutSeconds;
      newLogs.push({
        id: `log-event-fail-${Date.now()}`,
        timestampMET: nextElapsed,
        message: `${formatMET(nextElapsed)} WARNING: ${nextCard.prompt}`,
        type: 'error',
      });
    }
  }

  // Trigger 3: Budget / Opportunity event in Arrival phase (~T+200s)
  else if (
    state.elapsedSeconds < 200 &&
    nextElapsed >= 200 &&
    state.totalDecisionsMade <= 2
  ) {
    nextCard = createBudgetScheduleEvent(mission);
    nextTimer = nextCard.timeoutSeconds;
    newLogs.push({
      id: `log-event-opp-${Date.now()}`,
      timestampMET: nextElapsed,
      message: `${formatMET(nextElapsed)} OPPORTUNITY: ${nextCard.prompt}`,
      type: 'info',
    });
  }

  // Trigger 4: Comms Blackout event in Science Ops (~T+290s)
  else if (
    state.elapsedSeconds < 290 &&
    nextElapsed >= 290 &&
    state.totalDecisionsMade <= 3
  ) {
    nextCard = createCommsBlackoutEvent(mission);
    nextTimer = nextCard.timeoutSeconds;
    newLogs.push({
      id: `log-event-comms-${Date.now()}`,
      timestampMET: nextElapsed,
      message: `${formatMET(nextElapsed)} COMM ANOMALY: ${nextCard.prompt}`,
      type: 'warn',
    });
  }

  // 5. Final End-of-Mission Pass / Fail Evaluation
  if (currentPhase === 'endOfMission' && nextOutcome === null) {
    const sciencePass = nextDataDownlinked >= mission.minScienceDataMB;
    const fuelPass = nextFuel >= 0;
    const powerPass = state.powerBalanceW >= -10; // Tolerates minor battery drain
    const hasLV = Boolean(design.selectedParts.launchVehicle);

    if (!hasLV) {
      nextOutcome = 'fail';
      failureReason = 'Mission failed: Spacecraft never reached orbit due to lack of launch vehicle.';
    } else if (!sciencePass) {
      nextOutcome = 'fail';
      failureReason = `Scientific objectives unfulfilled: downlinked ${Math.round(nextDataDownlinked).toLocaleString()} MB out of ${mission.minScienceDataMB.toLocaleString()} MB required.`;
    } else if (!fuelPass) {
      nextOutcome = 'fail';
      failureReason = 'Stationkeeping failed: Spacecraft fuel exhausted.';
    } else if (!powerPass) {
      nextOutcome = 'fail';
      failureReason = 'Electrical power blackout: Battery depleted in cold shadow.';
    } else {
      nextOutcome = 'pass';
      newLogs.push({
        id: `log-pass-${Date.now()}`,
        timestampMET: nextElapsed,
        message: `${formatMET(nextElapsed)} MISSION ACCOMPLISHED: All flight objectives successfully completed.`,
        type: 'success',
      });
    }
  }

  return {
    ...state,
    phase: currentPhase,
    elapsedSeconds: nextElapsed,
    fuelRemainingKg: Math.round(nextFuel * 10) / 10,
    dataStoredMB: Math.round(nextDataStored),
    dataDownlinkedMB: Math.round(nextDataDownlinked),
    activeDecisionCard: nextCard,
    decisionTimerRemaining: nextTimer,
    totalBurnDeltaVms: Math.round(nextBurnDeltaV),
    outcome: nextOutcome,
    failureReason,
    eventLog: [...state.eventLog, ...newLogs],
  };
}
