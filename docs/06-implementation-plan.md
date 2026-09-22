# Implementation Plan — Mission Architect

## 1. Current Project State
- **Existing code:** None yet — greenfield project.
- **Reusable parts:** None.
- **Missing foundations:** Everything — project scaffold, data model, formula module, UI components, screens, state machine.
- **Risks:** Solo build, hard deadline (Nov 14–15, 2026), full challenge statement not released until Oct 28 (see PRD §10). Building foundations before polish is critical so a late scope change doesn't require a rewrite.

## 2. Build Principles
- Preserve the approved scope in `01-prd.md` — do not add or drop features mid-build without updating the PRD first.
- Work in small, verifiable phases — each phase below should be one to a few Antigravity prompts, not one giant prompt.
- Test after every phase using the "Completion criteria" listed for it, before starting the next.
- Do not begin a later phase while an earlier phase's required checks fail.
- Every formula implementation must cite the exact section of `07-domain-reference.md` it implements — no invented simplified formulas.

## 3. Suggested Sequence (Ordered Phases)

### Phase 0 — Project Foundation
- **Goal:** A running, deployed "hello world" React + Vite app.
- **Requirements covered:** TRD §2 (stack), §8 (deployment).
- **Components/systems:** Vite project scaffold, TypeScript config, basic routing (React Router), CSS variable theme file with the tokens from `04-ui-ux-brief.md` §3, Vercel project connected to the repo.
- **Files:** `package.json`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/theme.css`, `src/routes/*`.
- **Data/API work:** none yet.
- **UI states:** a placeholder route for each screen in `03-app-flow.md` §3, even if empty.
- **Tests/verification:** app builds (`vite build`) with no errors; deploys to a Vercel preview URL; all placeholder routes are reachable.
- **Completion criteria:** live Vercel URL shows a navigable (empty) shell matching the route list.
- **Dependencies:** none.
- **Risks:** routing choices made here are hard to change later — confirm the route list matches `03-app-flow.md` exactly before moving on.

### Phase 1 — Domain Data & Formula Module
- **Goal:** All real mission/part data and all real formulas exist and are unit-tested, before any UI touches them.
- **Requirements covered:** Backend Schema §3 (data shapes), Domain Reference (all sections).
- **Components/systems:** `src/data/missions.ts` (4 missions + `RealMissionReference` from `07-domain-reference.md` §8), `src/data/parts.ts` (part catalog per category from Backend Schema §3), `src/domain/formulas.ts` (Tsiolkovsky, Kepler/vis-viva, power, Friis link budget, Stefan-Boltzmann, reliability — each formula implementing exactly one section of `07-domain-reference.md`), `src/domain/constants.ts` (the `CONSTANTS` block from `07-domain-reference.md` §9).
- **Data/API work:** none at runtime; all data is static.
- **UI states:** none — this phase is pure logic.
- **Tests/verification:** unit tests (Vitest) plugging each real mission's real numbers (from `07-domain-reference.md` §1 and §8) into the corresponding formula and checking the output is close to the mission's real Δv/power/etc. (e.g., LRO's Isp + propellant mass through the rocket equation should land near 1,270 m/s).
- **Completion criteria:** all formula unit tests pass; `tsc --noEmit` is clean.
- **Dependencies:** Phase 0.
- **Risks:** this is the phase most likely to get a subtly wrong formula from an AI coding agent — do not skip the unit tests here even under time pressure.

### Phase 2 — Design-Screen State & Gauges (logic only)
- **Goal:** A working, testable state layer for `SpacecraftDesign` → `DerivedGauges`, with no visual polish yet.
- **Requirements covered:** PRD §4.3, Backend Schema §3 (`SpacecraftDesign`, `DerivedGauges`), §6 (`computeDerivedGauges`).
- **Components/systems:** `src/domain/design.ts` (`computeDerivedGauges`, slider clamping), a React Context/reducer for the active design.
- **Data/API work:** consumes Phase 1's data/formulas only.
- **UI states:** none yet — can be verified via console/unit tests.
- **Tests/verification:** unit tests: selecting parts and moving sliders produces gauge values matching hand-calculated expectations using the Phase 1 formulas.
- **Completion criteria:** gauge outputs are correct and update predictably for a scripted sequence of part/slider changes.
- **Dependencies:** Phase 1.
- **Risks:** low — this is mostly wiring.

### Phase 3 — Design Screen UI
- **Goal:** The actual Spacecraft Design screen, matching `04-ui-ux-brief.md` §6 layout and §5 components.
- **Requirements covered:** PRD §4.3, App Flow §3 (Spacecraft Design), UI/UX Brief §5–6.
- **Components/systems:** gauge component, slider component, category tabs, part card, spacecraft preview panel (can be a simple SVG silhouette that swaps per bus part, not a full render).
- **Data/API work:** wires Phase 2's state to the UI.
- **UI states:** default, gauge warning (amber ≥85%), gauge critical (≥100%), "no launch vehicle selected" disabled state on the Pre-flight button.
- **Tests/verification:** manual — build a spacecraft, confirm gauges update live and thresholds change color correctly; keyboard-only pass on all controls.
- **Completion criteria:** a full design can be built end-to-end through the UI alone.
- **Dependencies:** Phase 2.

### Phase 4 — Mission Run State Machine (logic only)
- **Goal:** `MissionRunState` transitions, decision-card generation/resolution, and pass/fail determination — before Live Mission Control's visuals exist.
- **Requirements covered:** PRD §4.5, Backend Schema §3 (`MissionRunState`, `DecisionCard`), §6 (`startMissionRun`, `advanceClock`, `resolveDecisionCard`).
- **Components/systems:** `src/domain/missionRun.ts` — phase transitions (launch→cruise→arrival→scienceOps→endOfMission), the 4 decision-card types with real-formula-driven probabilities (§6 of the domain reference for failure events; §4 for comms blackouts as link-margin dropouts; §3 for power-budget–linked events), timeout-default resolution.
- **Data/API work:** consumes a finalized `SpacecraftDesign` and its `DerivedGauges`.
- **UI states:** none yet.
- **Tests/verification:** unit tests — simulate a run with a strong design (should tend to pass) and a weak/underfueled design (should fail predictably, e.g., fuel hits 0 mid-cruise); verify a decision card always resolves (by response or timeout) before the clock advances.
- **Completion criteria:** scripted good/bad designs produce correct pass/fail outcomes with no UI.
- **Dependencies:** Phase 1, Phase 2 (for a finalized design as input).
- **Risks:** this is the most complex logic in the app — protect the schedule by not starting visuals until this is solid.

### Phase 5 — Live Mission Control UI
- **Goal:** The real-time screen, matching `04-ui-ux-brief.md` §6.
- **Requirements covered:** PRD §4.5, App Flow §3 (Live Mission Control), UI/UX Brief §5 (decision card, event log).
- **Components/systems:** top bar (mission/phase/clock), 2D orbit/trajectory view (SVG/Canvas, timed per §2 of the domain reference for that mission's real period), gauge sidebar, controls (power allocation, instrument toggles, downlink schedule, burn buttons), decision-card overlay with countdown ring, event log.
- **Data/API work:** wires Phase 4's state machine to the UI, `requestAnimationFrame` loop driving `advanceClock`.
- **UI states:** healthy/warning/critical gauges, decision-card open with countdown, screen-edge tint by severity, reduced-motion fallback (UI/UX Brief §7).
- **Tests/verification:** manual full run-through for each of the 4 event types; verify timeout defaults actually apply when a card is ignored; verify `prefers-reduced-motion` disables the animated countdown ring correctly.
- **Completion criteria:** a full mission can be flown from launch to end-of-mission through the UI alone, ending in a correct pass/fail.
- **Dependencies:** Phase 3, Phase 4.

### Phase 6 — Scoring & Debrief
- **Goal:** `computeScore` and the Debrief screen.
- **Requirements covered:** PRD §4.6, Backend Schema §3 (`ScoreResult`), §6 (`computeScore`).
- **Components/systems:** `src/domain/score.ts` (5-component scoring per `07-domain-reference.md` §7's traceability table), Debrief screen (PASS/FAIL banner, 5-bar breakdown, comparison table using `07-domain-reference.md` §8, "what went wrong" text generator).
- **Data/API work:** consumes `MissionRunState` + `SpacecraftDesign` + `Mission.realMission`.
- **UI states:** pass vs. fail banner styling, "what went wrong" shown/hidden.
- **Tests/verification:** unit test — a known-good run scores high on all 5 components; a known-bad run (e.g., ran out of comms margin) scores low specifically on `scienceReturn`, proving the traceability.
- **Completion criteria:** debrief numbers are always explainable from the run that produced them.
- **Dependencies:** Phase 5.

### Phase 7 — Remaining Screens & Tutorial
- **Goal:** Title, Mission Select, Mission Briefing, Pre-flight Review, and the tutorial overlay.
- **Requirements covered:** PRD §4.1, §4.2, §4.4, §4.7; App Flow §3.
- **Components/systems:** the four screens per UI/UX Brief §6; tutorial overlay state (React Context, `isTutorial` gated) with relaxed decision-card timeouts (Backend Schema `DecisionCard.timeoutSeconds`, mission-1-specific override).
- **Data/API work:** mission unlock logic (earth-orbit unlocked by default; others unlock after any earth-orbit run completes).
- **UI states:** locked mission cards, checklist green/amber/red rows linking back to Design categories.
- **Tests/verification:** manual — full playthrough of the tutorial mission start to finish; confirm all 4 missions are reachable after tutorial completion.
- **Completion criteria:** the entire App Flow diagram (`03-app-flow.md` §9) is walkable start to finish for all 4 missions.
- **Dependencies:** Phases 0–6.

### Phase 8 — Responsive, Accessibility & Performance Pass
- **Goal:** Meet PRD §8's non-functional requirements.
- **Requirements covered:** PRD §8, UI/UX Brief §8.
- **Components/systems:** responsive breakpoint fixes (UI/UX Brief §4), keyboard-only pass across every screen, contrast check on theme tokens, bundle-size check (<500KB gz target from TRD §6).
- **Data/API work:** none.
- **UI states:** verify mobile layouts for Design and Mission Control specifically (the two most complex screens).
- **Tests/verification:** manual device/viewport testing at 360px, 768px, 1024px+; Lighthouse or similar for performance/accessibility scoring as a sanity check (not a hard gate).
- **Completion criteria:** app is fully usable on a phone-width viewport and via keyboard alone.
- **Dependencies:** Phase 7.

### Phase 9 — Polish & Submission Readiness
- **Goal:** Final visual polish, optional nice-to-haves if time allows, demo prep.
- **Requirements covered:** PRD §9 (success criteria), App Brief nice-to-haves.
- **Components/systems:** launch animation polish (UI/UX Brief §7), optional sound effects, optional `localStorage` personal-best, logo/wordmark finalization, README, 1–2 minute demo video/script.
- **Data/API work:** none beyond the optional personal-best localStorage calls.
- **UI states:** final pass on every state listed in earlier phases.
- **Tests/verification:** a full run-through timed at under 5 minutes (PRD §9); production build deployed and tested on the actual Vercel URL, not just localhost.
- **Completion criteria:** the app is submission-ready — deployed, playable end to end, real NASA data and real formulas visibly driving every constraint, matching every element of the official challenge statement once it's released Oct 28.
- **Dependencies:** all prior phases.

## 4. Requirement Traceability (PRD feature → phase → verification)
| PRD feature | Phase | Verification |
|---|---|---|
| Mission Select (§4.1) | 7 | manual walkthrough |
| Mission Briefing (§4.2) | 7 | manual walkthrough |
| Spacecraft Design (§4.3) | 2, 3 | unit tests (gauges) + manual (UI) |
| Pre-flight Review (§4.4) | 7 | manual walkthrough |
| Live Mission Control (§4.5) | 4, 5 | unit tests (state machine) + manual (UI) |
| Debrief (§4.6) | 6 | unit tests (score traceability) |
| Tutorial (§4.7) | 7 | manual walkthrough |
| Real formulas (Domain Reference) | 1 | unit tests against real mission numbers |

## 5. Final Verification
- **Functional:** all 4 missions completable, both pass and fail paths reachable and correctly explained.
- **Responsive:** verified at mobile/tablet/desktop breakpoints.
- **Accessibility:** keyboard-only pass, contrast check, reduced-motion respected.
- **Security:** N/A (no backend) — confirm no stray API keys are bundled into the client build.
- **Production build:** deployed Vercel URL tested fresh (not just dev server), on both desktop and a phone.

---

## Recommended First Phase
**Phase 0 — Project Foundation.** Do not start Phase 1 (data/formulas) inside a half-configured project — get the scaffold, routing, and a deployed placeholder live first, so every subsequent phase has a working target to build into and verify against.
