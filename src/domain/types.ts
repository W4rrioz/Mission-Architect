/**
 * Client-Side Data Shapes & Domain Interfaces
 * Source: 05-backend-schema.md §3 & 07-domain-reference.md
 */

export type MissionId = 'earth-orbit' | 'moon' | 'mars' | 'asteroid';

export type PartCategory =
  | 'launchVehicle'
  | 'bus'
  | 'power'
  | 'propulsion'
  | 'comms'
  | 'instrument'
  | 'thermal'
  | 'redundancy';

export interface SliderRange {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
}

export interface LaunchVehiclePerf {
  maxPayloadKg: number;
  c3CapableKm2s2: number;
  fairingDiameterM: number;
}

export interface BusPerf {
  structuralMassKg: number;
  crossSectionAreaM2: number;
  surfaceAreaM2: number;
  baseMTBFHours: number;
}

export interface PowerPerf {
  type: 'solar' | 'rtg';
  panelEfficiency?: number; // e.g. 0.28 to 0.30
  cellDegradationPerYear?: number; // e.g. 0.025
  batteryWhPerKg?: number; // e.g. 150 Wh/kg
  ratedWatts?: number; // for RTG
  baseMTBFHours: number;
}

export interface PropulsionPerf {
  ispSeconds: number; // e.g. 212.2 to 320
  thrustN: number;
  propellantType: string;
  dryMassKg: number;
  maxPropellantKg: number;
  baseMTBFHours: number;
}

export interface CommsPerf {
  transmitPowerW: number;
  frequencyGHz: number; // e.g. 8.4 GHz for X-band
  receiverGainDbi: number; // Earth DSN dish gain (~65 dBi for 70m dish)
  receiverThresholdDbm: number; // required receiver sensitivity (-120 dBm)
  apertureEfficiency?: number; // default 0.55
  baseMTBFHours: number;
}

export interface InstrumentPerf {
  powerDrawW: number;
  dataRateKbps: number;
  dutyCycleDefault: number;
  scienceValueMultiplier: number;
  baseMTBFHours: number;
}

export interface ThermalPerf {
  absorptivity: number; // alpha: 0.2 (white paint) to 0.9 (dark)
  emissivity: number; // epsilon: 0.8 to 0.9
  insulationFactor: number; // expands safe temperature band
  baseMTBFHours: number;
}

export interface RedundancyPerf {
  failureRateMultiplier: number;
  redundantSubsystems: string[];
}

export type PerfProfile =
  | LaunchVehiclePerf
  | BusPerf
  | PowerPerf
  | PropulsionPerf
  | CommsPerf
  | InstrumentPerf
  | ThermalPerf
  | RedundancyPerf;

export interface PartCatalogEntry {
  id: string;
  category: PartCategory;
  name: string;
  description: string;
  costUSD: number;
  massKg: number;
  sliderRanges?: SliderRange[];
  perfProfile: PerfProfile;
}

export interface RealMissionReference {
  name: string;
  launchMassKg: number;
  dryMassKg: number;
  powerW: number;
  costUSD: number;
  deltaVms: number;
  launchVehicle: string;
  orbit: string;
  summary: string;
  sourceNote: string;
}

export interface OrbitParameters {
  centralBody: 'earth' | 'moon' | 'mars' | 'asteroid';
  regime: string;
  altitudeKm: number;
  periapsisKm?: number;
  apoapsisKm?: number;
  semiMajorAxisM: number;
  inclinationDeg: number;
  periodMinutes: number;
  requiredDeltaVms: number;
  solarDistanceAU: number;
  distanceToEarthKm: number;
  eclipseDurationMinutes: number;
}

export interface EventProfile {
  eventFrequencyMultiplier: number;
  baseFailureRateMultiplier: number;
  difficultyRating: number;
}

export interface Mission {
  id: MissionId;
  name: string;
  difficulty: number;
  isTutorial: boolean;
  objective: string;
  budgetCapUSD: number;
  minScienceDataMB: number;
  realMission: RealMissionReference;
  orbit: OrbitParameters;
  eventProfile: EventProfile;
}

export interface DerivedGauges {
  massKg: { current: number; limit: number; percentage: number; isOver: boolean };
  powerW: { current: number; limit: number; percentage: number; isOver: boolean };
  costUSD: { current: number; limit: number; percentage: number; isOver: boolean };
  deltaVms: { current: number; limit: number; percentage: number; isOver: boolean };
  linkMarginDb: { current: number; limit: number; percentage: number; isOver: boolean };
  thermalEquilibriumK: { current: number; minLimit: number; maxLimit: number; isSafe: boolean };
  reliabilityEstimate: number; // 0 to 1 (probability)
}

export interface SpacecraftDesign {
  missionId: MissionId;
  selectedParts: Partial<Record<PartCategory, string>>;
  sliderValues: Record<string, number>;
  derived?: DerivedGauges;
}

export type MissionPhase = 'launch' | 'cruise' | 'arrival' | 'scienceOps' | 'endOfMission';

export type DecisionCardType = 'failure' | 'launchWindow' | 'commsBlackout' | 'budgetSchedule';

export interface DecisionCardResponse {
  id: string;
  label: string;
  description?: string;
  fuelCostKg?: number;
  powerCostW?: number;
  dataLossMB?: number;
  scienceBonusMB?: number;
  temperatureDriftK?: number;
}

export interface DecisionCard {
  id: string;
  type: DecisionCardType;
  prompt: string;
  responses: DecisionCardResponse[];
  timeoutSeconds: number;
  defaultResponseId: string;
}

export interface LogEntry {
  id: string;
  timestampMET: number;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

export interface MissionRunState {
  missionId: MissionId;
  phase: MissionPhase;
  elapsedSeconds: number;
  fuelRemainingKg: number;
  powerBalanceW: number;
  dataStoredMB: number;
  dataDownlinkedMB: number;
  commsLinkOk: boolean;
  temperatureK: number;
  activeDecisionCard: DecisionCard | null;
  eventLog: LogEntry[];
  outcome: 'pass' | 'fail' | null;
  failureReason?: string;
  decisionTimerRemaining: number;
  totalDecisionsMade: number;
  fastDecisionsCount: number;
  totalBurnDeltaVms: number;
  requiredBurnDeltaVms: number;
}

export interface ScoreResult {
  outcome: 'pass' | 'fail';
  total: number; // 0–100 sum of the 5 components
  scienceReturn: number; // 0–40
  budgetEfficiency: number; // 0–20
  resilience: number; // 0–20
  decisionSpeed: number; // 0–10
  designEfficiency: number; // 0–10
  whatWentWrong: string | null; // populated when outcome === 'fail' or any component scores below ~50%
}

