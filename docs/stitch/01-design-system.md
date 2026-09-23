# Mission Architect Telemetry Console — Design System

**Stitch Project ID**: `16718427961455261646`  
**Design System Token ID**: `asset-stub-assets_ca3a1015613d4979a51dad8a09b86cd3`  
**Theme**: Mission-Critical Aerospace Telemetry Console & CAD Engineering Workbench

---

## 1. Typography Hierarchy

| Style / Role | Font Family | Weights | Usage / Application |
|---|---|---|---|
| **Display / Headlines** | `Orbitron`, `Space Grotesk`, sans-serif | 600, 700 | Screen titles, mission headers, score callouts |
| **Technical Subheads** | `Rajdhani`, sans-serif | 600, 700 | Category pills, panel titles, subsystem badges |
| **Telemetry & Metrics** | `"JetBrains Mono"`, monospace | 400, 500, 700 | Numeric readouts, time clocks, mass/power/delta-v, matrix tables |
| **Body & UI Controls** | `Inter`, sans-serif | 400, 500, 600 | Descriptions, instructions, tooltips, dialogs |

---

## 2. Color Palette & Surface Tokens

### Core Neutral Surfaces
```css
--deepSpace:      #0B1020; /* Deep interstellar navy-black canvas */
--panelBase:      #10172B; /* Primary container and drawer background */
--panelElevated:  #131A30; /* Instrument console panel surface */
--panelSurface:   #18223E; /* Card and interactive tile background */
--blueprintBg:    #0A0F1D; /* CAD grid canvas background */
--borderHairline: #2A3350; /* 1px crisp structural frame */
--borderGlow:     #3E4D78; /* Active / focused border outline */
```

### Mission Accents
```css
--earthOrbit:     #3DA5F5; /* Landsat 9 (Cyan-Blue) */
--moonPolar:      #C9D3EA; /* LRO Lunar Reconnaissance (Silver-Blue) */
--marsRust:       #E0703D; /* MAVEN Mars Aeronomy (Rust-Orange) */
--asteroidViolet: #9D74FF; /* OSIRIS-REx Bennu (Deep Violet) */
```

### Telemetry Status Signals
```css
--telemetryGreen: #3DBE7A; /* Nominal / GO / Pass */
--telemetryAmber: #E0A030; /* Marginal / Warning / Throttle */
--telemetryRed:   #E0453D; /* Critical / Violation / Abort */
```

### High-Contrast Text
```css
--textPrimary:    #E6ECF8; /* High-contrast cool white */
--textMuted:      #8FA0C4; /* Subdued telemetry metadata label */
```

---

## 3. Component Design Patterns

1. **Aerospace HUD Bento Grid**:
   - High-density modular cards with 1px hairline borders (`--borderHairline`).
   - Monospace telemetry headers with blinking status LEDs (green/amber/red).
2. **Interactive CAD Blueprint Canvas**:
   - Hexagonal bus silhouette with coordinate crosshairs and dimension ticks.
   - SVG vector overlays for solar arrays, booms, thrusters, and antenna feeds.
3. **Flight Debrief Radial Gauges**:
   - Circular SVG score arcs with tick marks and target calibration overlays.
   - Dual-column telemetry mosaic with real-time log matrix and spectral imagery.
4. **Mission Briefing Dossiers**:
   - Orbital regime vector schematics (elliptic trajectory, bow shock, solar wind stream).
   - Technical parameter tables and flight flight director authorization badges.

---

## 4. Downloaded Asset Inventory

| Asset Name | Local Path | Dimensions / Type | Usage |
|---|---|---|---|
| **Mission Patch Insignia** | `/assets/stitch/patch-insignia.png` | 231 KB PNG | Mission Architect header badge & director avatar |
| **MAVEN in Mars Orbit** | `/assets/stitch/maven-orbit.png` | 36 KB PNG | Debrief screen spacecraft render in Martian orbit |
| **Atmospheric Spectrogram** | `/assets/stitch/auroral-spectrogram.png` | 34 KB PNG | Debrief UV aurora & ion escape spectrogram |
| **MAVEN Mission Patch** | `/assets/stitch/maven-insignia.png` | 42 KB PNG | Dossier header official NASA mission seal |
