# Mission Architect 🚀
### NASA Space Apps Challenge 2026 — Space Missions Game Design

> **Mission Architect** is an interactive, browser-based space mission engineering simulation where players design an authentic robotic spacecraft, launch it, and pilot real-time operations under engineering and environmental pressure — directly grounded in real NASA mission architectures and aerospace engineering physics.

[![NASA Space Apps](https://img.shields.io/badge/NASA_Space_Apps-2026-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)](https://www.spaceappschallenge.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Bundle Size](https://img.shields.io/badge/Bundle_Gzip-122.4_KB-3DBE7A?style=for-the-badge)](https://vercel.com/)
[![Tests](https://img.shields.io/badge/Vitest-85_Passed-3DBE7A?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

---

## Table of Contents
1. [Challenge Statement Mapping](#1-challenge-statement-mapping)
2. [Real NASA Missions Reference](#2-real-nasa-missions-reference)
3. [Aerospace Engineering Mathematics & Formulas](#3-aerospace-engineering-mathematics--formulas)
4. [5-Minute Playthrough Timeline](#4-5-minute-playthrough-timeline)
5. [Key Features & Architecture](#5-key-features--architecture)
6. [Local Development & Verification](#6-local-development--verification)

---

## 1. Challenge Statement Mapping

The NASA Space Apps Challenge **"Space Missions Game Design"** asks participants to design an interactive game where users experience the interconnected realities of mission planning, resource balancing, and real-time operations.

Mission Architect translates every core requirement of the challenge into explicit, interactive game systems:

| Challenge Statement Dimension | In-Game System / Mechanic | Scientific & Operational Grounding |
|---|---|---|
| **Mission Objectives** | 4 Campaign Profiles: Earth Observation, Lunar Mapping, Mars Atmospheric Science, Asteroid Sample Return | Formulated from actual NASA primary science objectives for Landsat 9, LRO, MAVEN, and OSIRIS-REx. |
| **Spacecraft Design** | 8 Subsystem Categories: Launch Vehicle, Bus Structure, Power, Propulsion, Comms, Instruments, Thermal/Radiation, Redundancy | Component catalog parameterized by real mass, power draw, cost, $I_{sp}$, and reliability statistics. |
| **Instruments & Science Payloads** | Multispectral Imagers (OLI-2/TIRS-2), Lunar Radar (Mini-RF/LOLA), Neutral Gas Mass Spectrometers (NGIMS), Sample Mechanisms (TAGSAM) | Minimum science data quotas (`minScienceDataMB`) and instrument power demands directly determine mission pass/fail. |
| **Launch Vehicles** | Falcon 9, Atlas V 401, Atlas V 411, SLS Block 1 | Enforces real payload mass limits to orbit and costs; prevents launch if vehicle capacity is exceeded. |
| **Budget Management** | Hard Budget Cap ($150M to $1,000M) | Every chosen part and subsystem adds development and launch costs; launch is blocked if over budget. |
| **Mass Budget & Contingency** | Dry Mass + Propellant Load + 20% Phase A/B Growth Margin | Adheres to aerospace standard mass growth allowances ($totalDryMass = \sum m_i \times 1.20$). |
| **Power Management** | Solar Flux Inverse-Square Law & RTG Generation vs. Subsystem Draw | Dynamic power generation based on solar distance ($d_{\text{AU}}$); battery depth-of-discharge constraints. |
| **Communications & Downlink** | Friis Link Budget, Free-Space Path Loss, Parabolic Gain, Deep Space Network | Link margin in dB ($EIRP + G_{rx} - FSPL - L_{other} - S_{req}$); negative margin interrupts science data telemetry. |
| **Orbital Constraints** | Keplerian Mechanics, Target Orbit Altitudes, Required Burn $\Delta v$ | Vis-Viva orbital velocities, Kepler's 3rd Law orbital period animations, and Tsiolkovsky $\Delta v$ requirements. |
| **Real-Time Operations & Anomalies** | Compressed Mission Clock, Phase Transitions, 4 Anomaly Event Types | Timed decision cards with default worse-case resolution upon timer expiry; failure rates derived from exponential reliability. |

---

## 2. Real NASA Missions Reference

Mission Architect features four authentic missions calibrated against official NASA and USGS technical data sheets:

| Metric | Landsat 9 (Earth Orbit) | LRO (Lunar Orbiter) | MAVEN (Mars Orbiter) | OSIRIS-REx (Asteroid Sample) |
|---|---|---|---|---|
| **NASA Center / Partner** | NASA Goddard / USGS | NASA Goddard Space Flight Center | NASA Goddard / LASP | NASA Goddard / Univ. of Arizona |
| **Target Regime** | 705 km Sun-synchronous (98.2°) | 50 km Polar Mapping Orbit | 150 × 6,200 km Elliptical (75°) | 0.68–2.1 km Proximity Orbit (Bennu) |
| **Real Launch Mass** | 2,711 kg | 1,846 kg (max liftoff 1,965 kg) | 2,454 kg | 2,110 kg |
| **Real Dry Mass** | ~2,390 kg | 949 kg | 809 kg (903 kg max design limit) | 880 kg |
| **Real Propellant Load** | Stationkeeping only | 897 kg Hydrazine | 1,640 kg Hydrazine | 1,095 kg Bipropellant |
| **Required Mission $\Delta v$** | Stationkeeping only (~50 m/s) | 1,270 m/s (LOI sequence) | ~1,200 m/s (Mars Orbit Insertion) | ~1,400 m/s (Deep Space Maneuvers) |
| **Power Generation** | 4,300 W (Deployable array) | 824 W average / 1,500 W peak | 1,135 W (at Mars apohelion) | 1,226–3,000 W (solar-distance dynamic) |
| **Real Mission Cost** | ~$153.8M launch / $129.9M dev | ~$500M project life | ~$582.5M build + launch + ops | ~$800M + $183.5M launch |
| **Real Launch Vehicle** | Atlas V 401 | Atlas V 401 | Atlas V 401 | Atlas V 411 |
| **Downlink Band** | X-band (ground stations) | S-band / Ka-band (572 Gbit/day) | X-band DSN (twice-weekly passes) | X-band DSN High-Gain Antenna |

### Official NASA Sources & Citations
- **Landsat 9**: NASA/USGS Landsat 9 Fact Sheet and Technical Specification Guide (NASA Goddard Space Flight Center).
- **Lunar Reconnaissance Orbiter (LRO)**: Goddard Flight Dynamics Analysis Branch, *LRO $\Delta v$ Budget and Trajectory Memo*; ESA eoPortal LRO Spacecraft Architecture Overview.
- **MAVEN**: NASA Mars Atmosphere and Volatile EvolutioN Mission Fact Sheet; Spaceflight101 *MAVEN Propulsion & Spacecraft Overview*.
- **OSIRIS-REx**: NASA / University of Arizona OSIRIS-REx Asteroid Sample Return Fact Sheet; Spaceflight101 *OSIRIS-REx – A Mission with Options*.

---

## 3. Aerospace Engineering Mathematics & Formulas

Mission Architect avoids game-like arbitrary formulas. Every gauge and event calculation directly implements the standard equations of aerospace systems engineering:

### 1. Propulsion & Velocity — Tsiolkovsky Rocket Equation
$$\Delta v = I_{sp} \cdot g_0 \cdot \ln\left(\frac{m_0}{m_f}\right)$$
- $I_{sp}$: Specific impulse of the propulsion engine (s).
- $g_0$: Standard Earth gravitational acceleration constant ($9.80665\text{ m/s}^2$).
- $m_0$: Spacecraft wet mass (dry mass + propellant mass).
- $m_f$: Spacecraft dry burnout mass ($m_0 - m_{\text{propellant}}$).
- **Phase A/B Mass Growth Allowance**: Real spacecraft mass budgets account for design maturity growth. A 20% margin is enforced:
  $$m_{\text{dry, total}} = 1.20 \times \sum m_{\text{parts}}$$

### 2. Orbital Mechanics — Kepler's Third Law & Vis-Viva
$$\text{Orbital Period: } T = 2\pi \sqrt{\frac{a^3}{\mu}}$$
$$\text{Orbital Velocity: } v = \sqrt{\mu \left(\frac{2}{r} - \frac{1}{a}\right)}$$
- $a$: Semi-major axis of the target orbit (m).
- $\mu$: Standard gravitational parameter ($G \cdot M$) for the primary body:
  - $\mu_{\text{Earth}} = 3.986004 \times 10^{14}\text{ m}^3/\text{s}^2$
  - $\mu_{\text{Moon}} = 4.904800 \times 10^{12}\text{ m}^3/\text{s}^2$
  - $\mu_{\text{Mars}} = 4.282837 \times 10^{13}\text{ m}^3/\text{s}^2$
- Used to synchronize the real-time 2D orbital animation canvas so bodies orbit at accurate Keplerian relative periods.

### 3. Power Generation — Solar Inverse-Square Law & Cell Degradation
$$P_{\text{gen}} = \frac{S_0}{d_{\text{AU}}^2} \cdot A_{\text{panel}} \cdot \eta_{\text{cell}} \cdot \cos\theta \cdot (1 - k_{\text{deg}})^y$$
- $S_0$: Solar irradiance at 1 AU ($1,361\text{ W/m}^2$).
- $d_{\text{AU}}$: Distance to the Sun in Astronomical Units ($1.00\text{ AU}$ at Earth, $1.52\text{ AU}$ at Mars, dynamic at Bennu).
- $\eta_{\text{cell}}$: Space-grade triple-junction photovoltaic efficiency ($28\%\text{ to }30\%$).
- $k_{\text{deg}}$: Radiation degradation factor per mission operating year (~2–3%/yr).
- **Battery Sizing for Eclipse Passes**:
  $$\text{Capacity}_{\text{Wh}} = \frac{P_{\text{load}} \times t_{\text{eclipse}}}{\text{Depth of Discharge (DoD)}}$$

### 4. Communications Link Budget — Friis Transmission Equation
$$\text{FSPL (dB)} = 20\log_{10}(d_{\text{km}}) + 20\log_{10}(f_{\text{MHz}}) + 32.44$$
$$\text{Antenna Gain (dBi)} = 20\log_{10}(D) + 20\log_{10}(f_{\text{GHz}}) + 17.8$$
$$\text{Link Margin (dB)} = \text{EIRP} + G_{\text{receiver}} - \text{FSPL} - L_{\text{other}} - S_{\text{threshold}}$$
- Operating in Deep Space Network X-band ($8.4\text{ GHz}$).
- Parabolic reflector aperture efficiency modeled at 55%.
- $L_{\text{other}}$: 3.5 dB combined atmospheric attenuation and pointing errors.
- Positive margin indicates data downlink closure; negative margin halts telemetry and reduces scientific score.

### 5. Thermal Radiative Equilibrium — Stefan-Boltzmann Equation
$$T_{\text{eq}} = \left[ \frac{\alpha \cdot S_0 \cdot A_{\text{absorb}}}{\epsilon \cdot \sigma \cdot A_{\text{emit}} \cdot d_{\text{AU}}^2} \right]^{1/4}$$
- $\alpha$: Solar absorptivity of exterior coating (0.2 for white silicone paint to 0.9 for carbon).
- $\epsilon$: Infrared thermal emissivity (0.80 to 0.88).
- $\sigma$: Stefan-Boltzmann constant ($5.670374 \times 10^{-8}\text{ W}/(\text{m}^2\cdot\text{K}^4)$).

### 6. Subsystem Reliability & Parallel Redundancy
$$R(t) = e^{-\lambda \cdot t}$$
$$P(\text{system failure}) = [1 - R_{\text{unit}}(t)]^2$$
- $\lambda$: Subsystem failure rate per hour ($1 / \text{MTBF}$).
- Parallel redundancy squares the single-unit failure probability, accurately reflecting how cross-strapped redundant architectures dramatically improve mission survival.

---

## 4. 5-Minute Playthrough Timeline

A complete run-through from mission select to final debrief takes approximately **3.5 to 4.0 minutes**, well under the NASA Space Apps 5-minute evaluation benchmark:

```
[0:00] ─── MISSION SELECTION & BRIEFING (30s)
           • Select campaign profile (e.g., Lunar Reconnaissance Orbiter).
           • Review mission objectives, budget cap ($500M), and required burn Δv (1,270 m/s).

[0:30] ─── SPACECRAFT INTEGRATION & DESIGN (90s)
           • Choose Atlas V 401 launch vehicle and standard bus.
           • Pick Hydrazine Monopropellant propulsion system; tune fuel slider to ~900 kg.
           • Balance 10.7 m² solar arrays and battery capacity for lunar night eclipses.
           • Select High-Gain X-band parabolic dish (1.2m) to achieve positive link margin.
           • Mount radar and camera payloads within mass and power limits.
           • Observe real-time gauge responses (green/amber status).

[2:00] ─── PRE-FLIGHT READINESS REVIEW (30s)
           • Inspect pre-flight checklist verifying mass, power, Δv, and thermal bounds.
           • Confirm GO for launch.

[2:30] ─── LIVE MISSION CONTROL & REAL-TIME OPS (90s)
           • Watch the animated launch vehicle ascent from pad to orbital insertion.
           • Trajectory advances across Mission Phases (Launch → Cruise → Arrival → Science Ops).
           • Decision Card 1 (T+45s): Solar flare warning — choose "Reorient panels edge-on" (15s timer).
           • Decision Card 2 (T+75s): DSN ground station handover — choose "Buffer to onboard solid-state memory".
           • Monitor telemetry: propellant depletion, power draw, and science data accumulation.

[4:00] ─── MISSION DEBRIEF & HISTORICAL COMPARISON (30s)
           • Review Mission Pass/Fail verdict and 100-Point Composite Score breakdown:
             - Science Return (30 pts)
             - Budget Efficiency (20 pts)
             - Resilience & Redundancy (20 pts)
             - Decision Speed (15 pts)
             - Design Efficiency & Mass Margin (15 pts)
           • Inspect the side-by-side comparison with the real NASA mission.
           • New personal best automatically recorded in browser local storage.
```

---

## 5. Key Features & Architecture

- **100% Static & Client-Side**: Zero server-side API or database requirements. Deployable instantly to any static host (Vercel, GitHub Pages, Netlify).
- **Sub-500 KB Performance Target**:
  - Raw JS Bundle: `418.58 kB`
  - Gzipped JS Bundle: **`122.44 kB`** (only 24.5% of the 500 kB budget limit).
  - Gzipped CSS: `1.48 kB`.
- **Accessibility & Inclusive Design**:
  - WCAG 2.1 AA compliant color contrast across dark mission control themes.
  - Full keyboard navigation (`Tab`, `Enter`, `Space`, Arrows) with high-contrast `:focus-visible` rings.
  - Screen-reader accessible countdown timers and live alerts via `role="status"` and `role="alert"`.
  - Respects `prefers-reduced-motion` across orbital animations and launch effects.
- **Local Progression & Personal Bests**: Tracks mission unlocks (starting with the Earth tutorial) and records highest scores locally via `localStorage` without tracking or account requirements.

---

## 6. Local Development & Verification

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### 1. Installation
```bash
git clone https://github.com/your-org/mission-architect.git
cd mission-architect
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

### 3. Run Automated Unit Test Suite
Execute the 85-test suite covering physics formulas, design state reducers, mission control state machines, scoring algorithms, and screen rendering:
```bash
npm test -- --run
```

### 4. Build for Production
```bash
npm run build
```
Creates an optimized static production bundle in `dist/` ready for Vercel deployment (`vercel.json` rewrite routing pre-configured).

---

## License & Credits
Built for the **NASA Space Apps Challenge 2026**. Designed and engineered with open NASA mission documentation, USGS data sheets, and public-domain orbital mechanics reference literature.
