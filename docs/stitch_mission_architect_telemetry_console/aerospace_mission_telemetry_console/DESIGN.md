---
name: Aerospace Mission Telemetry Console
colors:
  surface: '#001330'
  surface-dim: '#001330'
  surface-bright: '#283958'
  surface-container-lowest: '#000e26'
  surface-container-low: '#071b38'
  surface-container: '#0c1f3d'
  surface-container-high: '#182a48'
  surface-container-highest: '#243553'
  on-surface: '#d7e2ff'
  on-surface-variant: '#bfc7d3'
  inverse-surface: '#d7e2ff'
  inverse-on-surface: '#1f304e'
  outline: '#89919c'
  outline-variant: '#3f4851'
  surface-tint: '#98cbff'
  primary: '#98cbff'
  on-primary: '#003354'
  primary-container: '#3da5f5'
  on-primary-container: '#00395d'
  inverse-primary: '#00639c'
  secondary: '#bdc7dd'
  on-secondary: '#273142'
  secondary-container: '#3d475a'
  on-secondary-container: '#abb5cb'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#ac8bff'
  on-tertiary-container: '#42009f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#98cbff'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#004a77'
  secondary-fixed: '#d9e3fa'
  secondary-fixed-dim: '#bdc7dd'
  on-secondary-fixed: '#121c2c'
  on-secondary-fixed-variant: '#3d475a'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5422b2'
  background: '#001330'
  on-background: '#d7e2ff'
  surface-variant: '#243553'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: 0.08em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: 0.06em
  headline-panel:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.06em
  subhead-tech:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.05em
  body-default:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.01em
  body-dense:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  body-caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 15px
    letterSpacing: 0.02em
  telemetry-readout-xl:
    fontFamily: JetBrains Mono
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.02em
  telemetry-readout-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  telemetry-clock:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  telemetry-label:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.08em
spacing:
  gutter: 0.75rem
  gutter-desktop: 1rem
  margin: 0.75rem
  margin-desktop: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system embodies the calculated precision, absolute reliability, and high-density legibility of flight operations consoles at NASA Jet Propulsion Laboratory and Johnson Space Center. Crafted for spacecraft systems engineers, orbital mechanics researchers, and mission directors, the interface translates high-velocity telemetry, delta-v budgets, and subsystem health into instantaneous situational awareness.

The design movement is **Tactile Industrial Precision**: a structured union of dark-mode aerospace telemetry, technical data density, and physical instrument ergonomics. It consciously rejects soft glassmorphism, vaporous neon glows, and casual mobile conventions. Depth is generated through rigid mechanical grouping, subtle interior bevels, and hairline structural bulkheads. Every pixel serves a mission-critical purpose; visual hierarchy directly signals risk tiers, system states, and executive orbital commands.

## Colors

The palette is engineered for prolonged operation under reduced ambient lighting, maximizing signal-to-noise ratio and guaranteeing WCAG AA compliance across data states.

### Console Architecture Surfaces
- **Canvas Base (`#0B1020`)**: Deep interstellar navy-black serving as the foundation of the mission environment.
- **Instrument Panel Surface (`#131A30`)**: Elevated structural chassis for primary console modules, docking displays, and data bays.
- **Sub-panel Surface (`#192342`)**: Secondary structural recess for grouped readouts, inset data matrices, and telemetry trays.
- **Structural Bulkhead (`#2A3350`)**: Crisp, 1px structural framing defining physical boundary splits between hardware channels.

### Typography & Readout Values
- **Telemetry Primary (`#E6ECF8`)**: High-contrast cool white for mission-critical metrics, primary readouts, and active flight modes.
- **Telemetry Secondary / Muted (`#8FA0C4`)**: Instrument metadata, engineering units, axis indicators, and secondary parameters.

### Mission Target Profiles
- **Earth Orbit (`#3DA5F5`)**: Electric cyan-blue used for LEO/GEO operations, active power telemetry, and standard vectors.
- **Moon Polar (`#C9D3EA`)**: Lunar titanium silver reserved for cislunar trajectories, surface altimetry, and passive structures.
- **Mars Aeronomy (`#E0703D`)**: Martian rust orange designated for atmospheric entry, thermal shields, and deceleration profiles.
- **Asteroid Return (`#9D74FF`)**: Deep-space asteroid violet for deep-space cruise, ion propulsion, and sample integrity.

### Telemetry Status System (ISA-18.2 / MIL-STD-1472G Aligned)
- **Nominal / Go (`#3DBE7A`)**: Emerald green indicating steady-state performance and completed verification sequences.
- **Caution / Alert (`#E0A030`)**: High-visibility amber for budget threshold crossings, thermal warnings, and degraded redundancy.
- **Critical / Abort (`#E0453D`)**: Ruby alert red for containment breaches, negative trajectory drift, and unrecoverable subsystem failures.

## Typography

The typographic hierarchy enforces immediate legibility through functional role separation:

1. **Display & Panel Titles (`Space Grotesk`)**: Technical, uppercase-biased, geometric structural headers. Provides crisp aerospace branding across mission phases and main sub-system frames.
2. **Operational Text (`Inter`)**: Humanist neutral body typeface engineered for complex payload logs, mission briefing manuals, and parameter descriptions. Prevents reading fatigue during high-stress operations.
3. **Telemetry & Instrumentation (`JetBrains Mono`)**: Monospaced tabular numerals strictly applied to clocks (Mission Elapsed Time - MET), propellant mass (kg), electrical loads (kW), velocities (m/s), and currency balances ($). Tabular spacing ensures that fluctuating values produce zero horizontal jitter. All micro-labels, hardware bus designations, and state identifiers use JetBrains Mono in uppercase.

## Layout & Spacing

The layout model simulates a multi-screen Flight Operations Directorate workstation. It maximizes informational density while retaining structural clarity.

### Grid & Density Rules
- **Desktop (>= 1280px)**: 12-column rigid modular grid with 1rem (16px) gutters and 1.5rem (24px) outer edge margins. Accommodates three-pane operational splits: Trajectory Canvas / Orbit Visualizer (8 cols) flanked by Subsystem Telemetry Stack (4 cols).
- **Tablet / Portable Console (768px - 1279px)**: 8-column layout with 0.75rem (12px) gutters. Subsystem bays collapse into stacked diagnostic shelves accessible via quick-switch hardware tabs.
- **Mobile (<= 767px)**: 4-column layout strictly enforcing vertical rack-mount ordering. Interactive viewport defaults to critical flight alarms and countdown timers; detailed telemetry tables collapse into segmented panels.

### Component Internal Geometry
Spacing between structural indicators is condensed:
- Telemetry labels are spaced 0.25rem (`space-xs`) above numerical readouts.
- Instrument parameter pairs maintain 0.5rem (`space-sm`) vertical cadence.
- Sub-panel interior padding maintains 0.75rem (`space-md`) to ensure zero wasted display real estate.

## Elevation & Depth

Visual hierarchy does not use diffuse drop shadows or glowing blurs. Instead, depth is achieved through structural layering and physical panel recession:

1. **Level 0 (Space Void Canvas)**: `#0B1020` base layer. Represents the root interface backdrop.
2. **Level 1 (Console Chassis)**: `#131A30` panel with a crisp, 1px solid border in `#2A3350`. Serves as the structural shell for complete functional instruments (e.g., Propulsion Bay, Attitude Control).
3. **Level 2 (Recessed Data Inset)**: `#192342` inset container with a 1px border (`#2A3350`). Features an inset top shadow (`inset 0 1px 3px rgba(0, 0, 0, 0.45)`) to replicate physical milled dashboard slots.
4. **Level 3 (Tactile Actuators & Switchgear)**: Elevated push-buttons and toggles with a micro-highlight top border (`1px solid rgba(230, 236, 248, 0.15)`) and a sharp directional bottom edge shadow (`0 2px 0 rgba(0, 0, 0, 0.6)`), giving controls an authoritative mechanical presence.
5. **Level 4 (Critical Alert Interrupters)**: Emergency modals and trajectory abort flags maintain an unyielding 1px solid border in status alert colors (`#E0453D` or `#E0A030`) accompanied by an ambient containment ring (`0 0 0 1px #0B1020`).

## Shapes

The design system enforces a **Sharp (`0`)** shape profile with selective 45-degree geometric chamfers (2px to 4px) on primary bay headers and alert banners. 

- Panels, status chips, data cells, and physical buttons use exact 0px border radii.
- This zero-radius mandate evokes machined avionics chassis and military-spec display terminal enclosures.
- Chamfered cut corners (implemented via CSS clip-path or angled borders) are strictly reserved for flight mode tags, active stage triggers, and the primary Master Alarm indicator.

## Components

### 1. Actuators & Push-Buttons
- **Primary Flight Controls**: Machined rectangular buttons with `#192342` surface, 1px `#3DA5F5` frame, and primary white typography in `Space Grotesk`. Hover state shifts surface to `#3DA5F5` with dark `#0B1020` text. Active state triggers a 1px inset depression.
- **Stage Execution / Abort Trigger**: High-consequence switchgear. Background utilizes a 45-degree hazard stripe pattern (Ruby `#E0453D` and `#131A30`) with a spring-loaded cover latch guard state. Requires continuous 2-second hold-to-confirm.
- **Ghost / Utility Controls**: 1px border `#2A3350`, transparent background, text in muted silver `#8FA0C4`.

### 2. Telemetry Readout Cells
- Standard component for numeric monitoring. Packaged in a Level 2 recessed chassis.
- Top row displays the parameter tag (e.g., `APOAPSIS`, `RCS_PRESSURE_A`) in `JetBrains Mono` 10px uppercase `#8FA0C4`.
- Center value displays instantaneous reading in `JetBrains Mono` 18px–26px `#E6ECF8`.
- Inline right shows engineering units (e.g., `km`, `bar`, `m/s`, `kg`) aligned to baseline in `#8FA0C4`.
- A 2px vertical indicator bar along the left edge dynamically displays status color (`Nominal`, `Caution`, `Critical`).

### 3. Flight Status Chips & Indicators
- Compact, zero-radius pills with 1px border.
- Composed of an 8px square LED status pip followed by state text in `JetBrains Mono` 10px bold uppercase.
- Three standardized states:
  - `GO / NOMINAL`: Pip `#3DBE7A`, background `rgba(61, 190, 122, 0.08)`, border `rgba(61, 190, 122, 0.35)`.
  - `WARN / DRIFT`: Pip `#E0A030`, background `rgba(224, 160, 48, 0.08)`, border `rgba(224, 160, 48, 0.35)`.
  - `CRIT / FAIL`: Pip `#E0453D`, background `rgba(224, 69, 61, 0.12)`, border `rgba(224, 69, 61, 0.6)`.

### 4. Telemetry Data Matrices & Lists
- Strict alternating rows (`#131A30` and `#0E1428`) with zero border radius.
- Hairline column dividers (`#2A3350`).
- Text in `Inter` 13px, values in `JetBrains Mono` 13px right-aligned.
- Sticky column headers with uppercase labeling and sort toggles indicated by directional micro-arrows (`▲` / `▼`).

### 5. Numerical Steppers & Thrust Input Fields
- Dark input field `#0B1020` recessed inside `#131A30` console panel.
- Permanent 1px border in `#2A3350`, transitioning to `#3DA5F5` on focus.
- Embedded stepper increment buttons (`-` / `+`) positioned at the right margin with tactile click depression.
- Value rendered in tabular `JetBrains Mono`.

### 6. Subsystem Instrument Cards
- Complete instrument module (e.g., Electrical Power System, Guidance & Navigation).
- Header bar features a chamfered top-right corner with module serial number, system title in `Space Grotesk`, and operational mode indicator.
- Body wrapped in 1px `#2A3350` boundary with recessed sub-panels (`#192342`) grouping specific diagnostic clusters.