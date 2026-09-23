# Google Stitch AI Prompts — Missing Screens

These prompts are tailored specifically for **Google Stitch AI** (`stitch.withgoogle.com`) to generate high-fidelity, production-grade UI/UX mockups matching the exact design tokens, typography, colors, and aerospace HUD aesthetic of the **Mission Architect Telemetry Console** project (`ID: 16718427961455261646`).

---

## Screen 09: Flight Readiness Review (FRR) & Launch Clearance Console

### Prompt:
```markdown
Create a high-density, mission-critical aerospace Flight Readiness Review (FRR) and Launch Clearance Console web dashboard for "NASA Mission Architect" (Project ID: 16718427961455261646). 

### Visual Style & Design System:
- Dark-sky interstellar aerospace aesthetic. Background: deep interstellar navy `#0B1020`. Panel containers: `#10172B` and `#131A30`. 1px hairline structural frames: `#2A3350` with subtle border glow `#3E4D78`.
- Mission accent color: Mars Rust `#E0703D` (or Earth Cyan `#3DA5F5`). Telemetry status colors: Nominal Green `#3DBE7A`, Caution Amber `#E0A030`, Critical Red `#E0453D`.
- Typography: Display titles in Orbitron/Space Grotesk, technical subtitles in Rajdhani, numeric metrics and clocks in JetBrains Mono, body text in Inter.

### Top Header Bar (Height: 52px):
- Left: Circular NASA Mission Architect vector patch insignia thumbnail with subtle blue glow, breadcrumbs: `MISSION ARCHITECT // PROFILE 03: MAVEN // FLIGHT READINESS REVIEW REV 4.2`.
- Right: Real-time mission telemetry clock `MET: T-MINUS 00:08:45.00`, DSN 43 Canberra tracking status with pulsing green LED, and "[ RETURN TO CAD WORKBENCH ]" secondary button.

### Zone 1: Flight Director Clearance Hero Banner:
- Large modular card displaying overall launch clearance state.
- If all constraints are satisfied: Glowing green shield badge `FLIGHT CLEARED FOR DEEP SPACE // ALL 7 CONSTRAINTS NOMINAL`.
- If budget exceeded: Pulsing critical red alert banner `LAUNCH HOLD: CONGRESSIONAL BUDGET CAP EXCEEDED ($585M / $550M) // HARD BLOCK: RETURN TO CAD WORKBENCH`.
- If non-budget warning: Amber banner `OPERATIONAL RISK WARNING: MARGINAL PROPULSION/POWER ENVELOPE // HIGH-RISK TEST FLIGHT AUTHORIZATION REQUIRED`.

### Zone 2: 7-Point Engineering Margin Checklist (Bento Grid / Vertical Stack):
Render 7 detailed modular constraint cards with status LEDs (● NOMINAL, ▲ WARNING, ■ CRITICAL), monospace value readouts (current vs limit and margin reserve), horizontal micro-progress bars, and an actionable right-aligned button `[ TUNE IN CAD ↗ ]` linking to the responsible CAD category:
1. Booster Lift Capacity: Wet Mass `2,120 kg` vs Atlas V 401 limit `2,500 kg` (+380 kg margin, 84.8% capacity). Action: `[ Tune Launch Vehicle ↗ ]`.
2. Congressional Budget Cap: Total Cost `$585.0M` vs `$650.0M` cap (+$65.0M reserve, 90.0% utilization). Action: `[ Tune Hardware CAD ↗ ]`.
3. Trajectory Insertion Velocity (Δv): Delivered `2,280 m/s` vs Required `2,050 m/s` (+230 m/s margin via Tsiolkovsky equation). Action: `[ Tune Propulsion ↗ ]`.
4. Photovoltaic Power Balance: Generated `1,050 W` at 1.52 AU vs Demand `920 W` (+130 W margin). Action: `[ Tune Power System ↗ ]`.
5. Deep Space Network RF Link Margin: Downlink `+4.2 dB` vs `3.0 dB` minimum threshold (+1.2 dB link margin to 70m Goldstone dish). Action: `[ Tune Communications ↗ ]`.
6. Stefan-Boltzmann Thermal Equilibrium: Radiative equilibrium `-42°C` (231 K) inside nominal MLI envelope `[-150°C .. +120°C]`. Action: `[ Tune Thermal ↗ ]`.
7. Avionics Reliability Rating: Subsystem MTBF reliability `94.2%` vs `85.0%` mission success ceiling. Action: `[ Tune Redundancy ↗ ]`.

### Zone 3: Sticky Bottom Launch Authorization Action Bar:
- Bottom docked console bar with glassmorphism backdrop blur (`rgba(16, 23, 43, 0.95)`).
- Left: Pre-flight readiness summary pill `7 / 7 SYSTEMS VERIFIED // FLIGHT ENVELOPE LOCKED`.
- Right: Large primary call-to-action button with rocket launch icon and glowing halo:
  `[ AUTHORIZE LAUNCH & ENTER MISSION CONTROL 🚀 ]` (Disabled with red lock tooltip if budget cap is violated).
```

---

## Screen 10: 404 Orbital Trajectory Lost // Tactical Telemetry Loss Console

### Prompt:
```markdown
Create a high-impact, dark aerospace tactical 404 error and signal loss terminal screen for "NASA Mission Architect" (Project ID: 16718427961455261646).

### Visual Style & Design System:
- Dark-sky interstellar background: `#0B1020` with a subtle procedural SVG blueprint coordinate grid (`#0A0F1D`) and faint drifting background stars.
- Panel surface: Chamfered aerospace card container `#131A30` with 1px hairline border `#2A3350` and faint caution-amber drop shadow `rgba(224, 160, 48, 0.2)`.
- Colors: Primary warning amber `#E0A030`, signal loss red `#E0453D`, cool white `#E6ECF8`, muted telemetry blue `#8FA0C4`.
- Typography: Display title in Orbitron/Space Grotesk, telemetry log readout in JetBrains Mono.

### Centered Tactical Terminal Card (Max Width: 600px):
- Central Radar Beacon Graphic: Glowing circular radar display with concentric distance rings, rotating 360° sweep beam, and a pulsing caution amber beacon icon representing a lost transponder signal.
- Header Tag: Monospace pill badge with blinking amber LED: `● SIGNAL LOSS // DEEP SPACE NETWORK CARRIER DROP`.
- Primary Headline: Bold Orbitron headline: `404 — TRAJECTORY LOST`.
- Telemetry Coordinate Readout Matrix (Monospace 3-column box with dark background `#0A0F1D` and border `#2A3350`):
  - `TARGET EPHEMERIS: UNRESOLVED / NULL`
  - `SECTOR: DEEP SPACE TRANSIT ZONE 09`
  - `UPLINK STATUS: NO CARRIER DETECTED`
- Descriptive Message:
  "The requested orbital trajectory, flight profile, or planetary coordinates do not exist in the Mission Architect flight manifest. Uplink carrier lock failed across all DSN ground stations (Goldstone, Madrid, Canberra)."
- Tactical Navigation Action Buttons (Side-by-Side):
  1. Primary Button (Cyan/Earth accent `#3DA5F5` with glow):
     `[ 🧭 RE-ACQUIRE FLIGHT PROFILE CATALOG ]` (Links to `/missions`)
  2. Secondary Outline Button (Hairline border `#2A3350` hover `#3E4D78`):
     `[ 🏠 RETURN TO FLIGHT INITIALIZATION TITLE ]` (Links to `/`)
- Bottom Technical Stamp:
  `ERROR_CODE: ERR_ORBITAL_PLANE_OUT_OF_BOUNDS // JPL DACS-7 TRANSCEIVER`
```
