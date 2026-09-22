# Product Requirements Document — Mission Architect

## 1. Product Overview
- **Product name:** Mission Architect
- **One-sentence description:** A web game where you design, launch, and fly a real space mission under real engineering constraints, then compare your result to the actual NASA mission that inspired it.
- **Problem being solved:** NASA Space Apps Challenge 2026's "Space Missions Game Design" challenge asks for an interactive game that lets participants design, manage, and simulate a complete space mission, making engineering decisions and managing limited resources, and see how each choice shapes mission success — because students rarely get hands-on experience with a whole mission's trade-offs.
- **Why this product should exist:** No existing hackathon-scale tool combines (a) real NASA mission data, (b) genuine multi-constraint spacecraft design, and (c) a real-time operations phase with time pressure, in one lightweight, no-install, browser-based experience.

## 2. Target Users
- **Primary user:** A student or space enthusiast playing casually in a browser, with no space-engineering background required to start (tutorial mission) but real depth available to explore.
- **Their current problem:** Trade-offs in mission design (mass vs. power vs. fuel vs. comms vs. budget) are abstract facts in a textbook, not something they've ever had to balance themselves.
- **Their desired outcome:** Understand, by direct experience, why real missions are designed the way they are — and enjoy doing it.
- **Secondary users:** NASA Space Apps judges evaluating challenge fit, creativity, use of NASA data/resources, and validity.

## 3. Core User Outcome
A player picks a mission, builds a spacecraft that fits within mass, power, budget, fuel, comms, thermal, and reliability limits, survives the real-time launch-through-science-ops phase by responding to timed events, and reaches a debrief that tells them whether the mission passed, what their score was, and how their design compares to the real NASA mission it's modeled on.

## 4. Core Features

### 4.1 Mission Select
- **User need:** Choose which mission to attempt, understand difficulty and unlock state.
- **What it does:** Shows four mission cards (Earth orbit, Moon, Mars, Asteroid) with difficulty, short description, and lock state.
- **Inputs:** Tap/click a mission card.
- **Expected output:** Navigates to Mission Briefing for that mission.
- **Acceptance criteria:** Locked missions are visibly locked and cannot be entered until the Earth-orbit tutorial mission is completed at least once (pass or fail). All four missions are visible from the start so the player can see the full scope.
- **Error/empty states:** N/A (static data, no network).

### 4.2 Mission Briefing
- **User need:** Understand the mission objective and constraints before committing design time.
- **What it does:** Displays mission objective, budget cap, hard requirements (e.g., minimum payload), and a short real-mission reference blurb (e.g., "Modeled on NASA's MAVEN").
- **Inputs:** "Begin design" button.
- **Expected output:** Navigates to Spacecraft Design.
- **Acceptance criteria:** All numeric limits shown here (budget, mass cap if any) must match the limits enforced on the Design screen.

### 4.3 Spacecraft Design
- **User need:** Build a spacecraft that can complete the mission within constraints, with real control over trade-offs.
- **What it does:** Player picks parts (launch vehicle, bus, power source, propulsion, communications, instruments, thermal/radiation protection, redundancy) from a catalog per category, and tunes each with sliders (e.g., solar array area, fuel load, antenna diameter). Live gauges recalculate mass, power, budget spent, fuel/delta-v margin, comms link margin, thermal/radiation margin, and a derived reliability estimate after every change.
- **Inputs:** Part selections, slider values.
- **Expected output:** A `SpacecraftDesign` object (see Backend Schema for shape) and updated gauges.
- **Acceptance criteria:** Every gauge updates within one render frame of a change. Gauges turn amber above 85% of their limit and red at/above 100%. The player can proceed to Pre-flight Review even while over a limit (a warning, not a hard block), except budget, which is a hard block (cannot exceed allocated budget).
- **Error/empty states:** If no launch vehicle is selected, "Pre-flight review" is disabled with an inline message.

### 4.4 Pre-flight Review
- **User need:** A final sanity check before an irreversible launch decision.
- **What it does:** Shows a checklist (green/amber/red) of every constraint, plus a total score preview is NOT shown here (that stays for debrief only, to preserve suspense). Amber/red items show which decision caused them.
- **Inputs:** "Back to design" or "Launch."
- **Expected output:** Launch proceeds to Live Mission Control regardless of amber/red state (the game allows risky launches — it just warns).
- **Acceptance criteria:** Every amber/red checklist item links back to the specific design category responsible.

### 4.5 Live Mission Control
- **User need:** Operate the mission in real time and respond to unfolding events, the way real mission controllers do.
- **What it does:** Advances through phases (launch, cruise, arrival, science operations, end of mission) on a compressed clock. Live gauges track power, fuel, data stored, comms link, and temperature/radiation, all changing over time and in response to player actions (power allocation, instrument on/off, downlink scheduling, engine burns). Decision cards appear for the four event types (random failure/anomaly, launch-window/countdown pressure, communications blackout/delay, budget/schedule surprise), each with 2–3 responses and a visible countdown (roughly 10–30 seconds); if the timer runs out, a defined worse-case default response is applied automatically.
- **Inputs:** Control buttons, decision-card responses (including "let the timer run out").
- **Expected output:** State changes to gauges, event log entries, and eventually a pass/fail determination.
- **Acceptance criteria:** A decision card is always resolved (by player choice or by timeout default) before the mission clock advances past it. Failure odds for random events are a function of the player's design (redundancy and shielding measurably reduce them — see Backend Schema for the formula).
- **Error/empty states:** If the player closes the tab mid-mission, the run is lost (no save/resume — explicitly out of scope).

### 4.6 Debrief
- **User need:** Understand the outcome and learn from it.
- **What it does:** Shows PASS/FAIL, a 100-point score with a 5-category breakdown (science return, budget efficiency, resilience, decision speed, design efficiency), a side-by-side comparison of the player's spacecraft to the real NASA mission's real specs, and a short "what went wrong" note when the mission failed or scored low in a category.
- **Inputs:** "Retry mission," "Mission select," (optionally) "Save personal best."
- **Expected output:** Navigates accordingly; if a personal-best feature is included, writes to localStorage.
- **Acceptance criteria:** Every score component's number is traceable to a specific in-game value (e.g., science return ties directly to data volume collected and downlinked).

### 4.7 Tutorial Overlay
- **User need:** A first-time player needs to understand the controls without reading a manual.
- **What it does:** A guided overlay across Mission Select → Design → Pre-flight → Mission Control → Debrief, shown only during the Earth-orbit mission, with relaxed decision-card timers.
- **Acceptance criteria:** Tutorial can be skipped at any step. Tutorial state (seen/not seen) can be tracked in memory or localStorage; not seeing it again is a nice-to-have, not a requirement.

## 5. Scope

### Included in version one
- All 4 missions, full design system (presets + sliders, 8 constraint categories), full real-time mission phase with all 4 event types, pass/fail + 5-category scoring, real-mission comparison, tutorial on mission 1.

### Explicitly excluded from version one
- Leaderboard, database/backend, accounts, save/share of designs, multiplayer, 3D models, full physics engine, sound (unless time remains).

### Possible later additions
- Personal-best via localStorage, sound effects, additional missions, a sandbox/no-limits mode.

## 6. User Stories
- As a player with no space background, I want a guided first mission, so that I understand the controls before being timed under pressure.
- As a player, I want to see my mass/power/budget/fuel/comms usage update live as I design, so that I understand the trade-off I just made.
- As a player, I want timed decisions during the mission, so that it feels like real operations, not a static quiz.
- As a player, I want to see how my design compares to the real mission, so that I learn something true about spaceflight, not just win a score.
- As a judge, I want to clearly see NASA data and real formulas driving the simulation, so that I can evaluate scientific validity.

## 7. Functional Requirements
- The app must run fully client-side with no network calls required to play (mission and part data ship with the app as static JSON).
- All physics/engineering calculations (delta-v, link budget, power budget, thermal) must use the real-world formulas defined in `07-domain-reference.md`, not placeholder arithmetic.
- Every mission's real-world comparison data must come from public NASA/mission fact sheets, cited in that reference file.

## 8. Non-Functional Requirements
- **Performance:** Initial load under 3 seconds on a typical broadband connection; interactions (slider drag, decision response) must feel instant (<100ms to visual update).
- **Accessibility:** All interactive controls reachable by keyboard; countdown rings paired with a numeric readout (not color alone); text contrast meets WCAG AA against the dark background.
- **Privacy:** No data leaves the browser. No analytics required.
- **Security:** N/A — no backend, no user data storage beyond optional localStorage.
- **Browser/device support:** Latest two versions of Chrome, Safari, Firefox, Edge; responsive from ~360px mobile width to desktop.

## 9. Success Criteria
- A judge can complete one full mission (design → launch → debrief) in under 5 minutes.
- Every one of the challenge statement's named elements (objectives, spacecraft design, instruments, launch vehicles, budgets, power, mass, communications, orbital constraints) is visibly represented as a mechanic.
- The app loads and runs with zero backend, deployable as a static Vercel site.

## 10. Assumptions and Open Questions
- Assumption: the official Oct 28 challenge statement will not require features beyond what's scoped here; if it does, this PRD must be revisited before Nov 14.
- Assumption: judges will play in a desktop browser primarily, but mobile must still work.
- Open question: exact wording/branding requirements (if any) from the official challenge statement, not yet released.
