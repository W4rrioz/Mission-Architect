# Backend Schema — Mission Architect

There is no backend and no database (see App Brief and TRD — the leaderboard/Supabase were explicitly dropped). This document instead defines the **client-side data model**: the static content shape (missions, parts) and the in-memory run state, using the same rigor a real schema would need, because the formulas in `07-domain-reference.md` depend on these shapes being exact.

## 1. Data Overview
- **Storage type:** Static TypeScript/JSON modules bundled at build time (`src/data/`) + one optional `localStorage` key for a personal-best score.
- **Main data domains:** Missions, Parts (catalog), Spacecraft Design (player's in-progress build), Mission Run (real-time state), Score Result.
- **Ownership model:** Single local session — nothing is shared between players, nothing is synced.

## 2. Authentication and Authorization
None. No identity concept exists in the app.

## 3. Data Shapes

### `Mission`
| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `id` | string | yes | — | `'earth-orbit' \| 'moon' \| 'mars' \| 'asteroid'` |
| `name` | string | yes | — | e.g. "Earth-Observing Satellite" |
| `difficulty` | number (1–4) | yes | — | drives Mission Select ordering/display |
| `isTutorial` | boolean | yes | `false` | true only for `earth-orbit` |
| `objective` | string | yes | — | shown on Briefing |
| `budgetCapUSD` | number | yes | — | hard limit enforced at Pre-flight |
| `minScienceDataMB` | number | yes | — | pass condition: must downlink at least this much science data |
| `realMission` | `RealMissionReference` | yes | — | see below |
| `orbit` | object | yes | — | target orbit parameters (altitude, inclination, or interplanetary transfer type) used by the delta-v and link-budget formulas |
| `eventProfile` | object | yes | — | tuning for that mission's random-event frequency/severity (harder missions = more/worse events) |

### `RealMissionReference` (real NASA data, baked in — see `07-domain-reference.md` for sourcing)
| Field | Type | Notes |
|---|---|---|
| `name` | string | e.g. "MAVEN" |
| `launchMassKg` | number | |
| `dryMassKg` | number | |
| `powerW` | number | |
| `costUSD` | number | |
| `deltaVms` | number | where published |
| `launchVehicle` | string | |
| `summary` | string | 1–2 sentence description for the comparison table |
| `sourceNote` | string | which public fact sheet the numbers came from |

### `PartCatalogEntry`
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | unique within its category |
| `category` | enum | yes | `launchVehicle \| bus \| power \| propulsion \| comms \| instrument \| thermal \| redundancy` |
| `name` | string | yes | |
| `costUSD` | number | yes | base cost |
| `massKg` | number | yes | base mass (before slider scaling, if any) |
| `sliderRanges` | `SliderRange[]` | no | e.g. solar array area 4–20 m², fuel load 0–X kg |
| `perfProfile` | object | yes | category-specific performance fields the formulas read (see below) |

`perfProfile` by category (fields consumed by `07-domain-reference.md` formulas):
- `launchVehicle`: `{ maxPayloadKg, c3CapableKm2s2 }`
- `power`: `{ panelEfficiency, cellDegradationPerYear, batteryWhPerKg }` (solar) or `{ ratedWatts }` (RTG)
- `propulsion`: `{ ispSeconds, thrustN, propellantType }`
- `comms`: `{ antennaGainDbi (fn. of dish diameter slider), transmitPowerW, frequencyGHz }`
- `instrument`: `{ powerDrawW, dataRateKbps, dutyCycleDefault }`
- `thermal`: `{ absorptivity, emissivity, insulationFactor }`
- `redundancy`: `{ failureRateMultiplier }` (applied to the base failure probability in the event model)

### `SpacecraftDesign` (player's in-progress/finalized build)
| Field | Type | Notes |
|---|---|---|
| `missionId` | string | |
| `selectedParts` | `Record<category, PartCatalogEntry['id']>` | one per category (some optional, e.g. redundancy) |
| `sliderValues` | `Record<string, number>` | keyed by `partId.sliderKey` |
| `derived` | `DerivedGauges` | recomputed on every change, never stored independently of the inputs above |

### `DerivedGauges` (pure function output — see `07-domain-reference.md` §7 for exact formulas)
`{ massKg, powerW, costUSD, deltaVms, linkMarginDb, thermalEquilibriumK, reliabilityEstimate }` — each paired with its limit for that mission, so gauges can compute percentage-of-limit.

### `MissionRunState` (Live Mission Control, in-memory only)
| Field | Type | Notes |
|---|---|---|
| `phase` | enum | `launch \| cruise \| arrival \| scienceOps \| endOfMission` |
| `elapsedSeconds` | number | mission-compressed clock |
| `fuelRemainingKg` | number | decremented by burns |
| `powerBalanceW` | number | generation − consumption, live |
| `dataStoredMB` | number | increases with active instruments, decreases on downlink |
| `dataDownlinkedMB` | number | counts toward `minScienceDataMB` |
| `commsLinkOk` | boolean | false during a blackout event |
| `temperatureK` | number | from the thermal formula, drifts with events |
| `activeDecisionCard` | `DecisionCard \| null` | |
| `eventLog` | `LogEntry[]` | append-only |
| `outcome` | `'pass' \| 'fail' \| null` | set at end of mission |

### `DecisionCard`
| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `type` | enum | `failure \| launchWindow \| commsBlackout \| budgetSchedule` |
| `prompt` | string | |
| `responses` | `{ id, label, effect }[]` | 2–3 options |
| `timeoutSeconds` | number | ~10–30, relaxed in tutorial |
| `defaultResponseId` | string | applied automatically on timeout |

### `ScoreResult`
| Field | Type | Notes |
|---|---|---|
| `outcome` | `'pass' \| 'fail'` | |
| `total` | number (0–100) | sum of the 5 components |
| `scienceReturn` | number (0–40) | |
| `budgetEfficiency` | number (0–20) | |
| `resilience` | number (0–20) | |
| `decisionSpeed` | number (0–10) | |
| `designEfficiency` | number (0–10) | |
| `whatWentWrong` | string \| null | populated when `outcome === 'fail'` or any component scores below ~50% |

## 4. Relationships
- One `Mission` has one `RealMissionReference` (1:1, embedded).
- One `Mission` references many `PartCatalogEntry` items indirectly (the full part catalog is shared across missions; a mission's `budgetCapUSD` and `orbit` are what make certain parts infeasible, not a hard-coded per-mission part list).
- One `SpacecraftDesign` belongs to exactly one `Mission` (`missionId`), for exactly one in-memory play session.
- One `MissionRunState` is derived from exactly one finalized `SpacecraftDesign`.
- One `ScoreResult` is produced from exactly one completed `MissionRunState`.
- "Delete" behavior: none of this is persisted, so there's no delete operation — a fresh run simply replaces the in-memory objects.

## 5. Access Rules
Not applicable — everything lives in the local browser session, in one player's memory. There is no create/read/update/delete by "who" — only by "what screen is currently active," governed by the App Flow document.

## 6. Core Data Operations
- `computeDerivedGauges(design, mission)` → `DerivedGauges` — pure function, called on every design change.
- `startMissionRun(design, mission)` → `MissionRunState` — initializes the run.
- `advanceClock(state, deltaSeconds)` → `MissionRunState` — ticks the simulation, may trigger a decision card.
- `resolveDecisionCard(state, responseId | 'timeout')` → `MissionRunState` — applies the chosen (or default) effect.
- `computeScore(finalState, design, mission)` → `ScoreResult` — pure function, called once at end of mission.
- `savePersonalBest(missionId, score)` / `getPersonalBest(missionId)` — the only functions that touch `localStorage`, and only if this nice-to-have is built.

## 7. File Storage
None (no uploads, no user-generated files). All SVG/art assets are static files bundled with the app at build time, not "storage" in the data sense.

## 8. Data Integrity and Security
- **Validation:** Slider values clamped to their `SliderRange` on every update, in the same pure functions that compute gauges — never trust a value from UI state without clamping.
- **Transactions:** N/A (single-threaded client state, no concurrent writers).
- **Sensitive data:** None exists in this app.
- **Audit:** N/A.

## 9. Migration and Seed Data
"Seed data" here means the mission and part catalogs themselves (`src/data/missions.ts`, `src/data/parts.ts`), populated from `07-domain-reference.md`. There is no migration concept since there's no database — updating a mission's numbers is a code change and a redeploy.

## 10. Risks and Open Questions
- Risk: if a future feature reintroduces a leaderboard, this schema would need real tables and access rules (out of scope now, but noted so it isn't forgotten if priorities change again).
- Open question: whether `localStorage` personal-best gets built at all — it's a nice-to-have, not required for the PRD's success criteria.
