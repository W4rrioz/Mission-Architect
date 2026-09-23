# Google Stitch AI — Mission Architect Telemetry Console

**Project Title**: Mission Architect Telemetry Console  
**Project ID**: `16718427961455261646`  
**Generated Via**: Google Stitch AI (stitch.withgoogle.com)

---

## 🖥️ Screen Catalog & Code Inventory

| # | Screen Name | Stitch Screen ID | Local Code File | Key Assets Referenced |
|---|---|---|---|---|
| **01** | **Design System Tokens** | `asset-stub-assets_ca3a1015613d4979a51dad8a09b86cd3` | [`01-design-system.md`](./01-design-system.md) | Colors, Typography, Bento HUD Grids |
| **02** | **Mission Architect Patch Insignia** | `57edd4e22ffd4daa87656401c2d760ed` | [`02-patch-insignia.html`](./02-patch-insignia.html) | `/assets/stitch/patch-insignia.png` |
| **03** | **Title & Flight Initialization** | `611bc2c2d60b4e27bc9a689efcb71111` | [`03-title-screen.html`](./03-title-screen.html) | `/assets/stitch/patch-insignia.png` |
| **04** | **Flight Profile Catalog** | `d70c0ab819fd4198a114ab7f49f09ab5` | [`04-flight-catalog.html`](./04-flight-catalog.html) | `/assets/stitch/maven-insignia.png` |
| **05** | **Mission Briefing Dossier (MAVEN)** | `ac9cc328e9ba43ba9d35368646e6b974` | [`05-mission-briefing.html`](./05-mission-briefing.html) | `/assets/stitch/maven-insignia.png` |
| **06** | **Flight Debrief (MAVEN)** | `9f5fc1d0fc2e4d56bf887b8bd5618a31` | [`06-flight-debrief.html`](./06-flight-debrief.html) | `/assets/stitch/maven-orbit.png`, `/assets/stitch/auroral-spectrogram.png` |
| **07** | **Spacecraft CAD Workbench** | `eb20bc7f6c0d4a3d90d4fd8bb5f2114c` | [`07-cad-workbench.html`](./07-cad-workbench.html) | Procedural SVG Spacecraft Bus & Panels |
| **08** | **Live Mission Control Telemetry** | `db5385802eab4da9846c2ef636b9862d` | [`08-live-mission-control.html`](./08-live-mission-control.html) | Real-time Orbit SVG & Matrix Telemetry |
| **09** | **Flight Readiness Review (FRR)** | `frr-clearance-console-2026` | [`09-flight-readiness-review.html`](./09-flight-readiness-review.html) | 7-Constraint Checklist & Go/No-Go Poll |
| **10** | **Signal Loss Terminal (404)** | `dsn-404-signal-loss` | [`10-signal-loss-404.html`](./10-signal-loss-404.html) | Radar Beacon Sweep & DSN Matrix |

---

## 📦 Downloaded Image Assets

All images were retrieved with `curl -L` from Google's hosted endpoints and saved into the app's public assets folder:

1. **`public/assets/stitch/patch-insignia.png`** (231.8 KB)
   - Official Mission Architect flight insignia vector patch.
2. **`public/assets/stitch/maven-orbit.png`** (36.4 KB)
   - Artistic NASA render of MAVEN with solar panels deployed in Martian orbit.
3. **`public/assets/stitch/auroral-spectrogram.png`** (34.8 KB)
   - Atmospheric UV spectrogram visualization of Martian auroral and ion loss plume.
4. **`public/assets/stitch/maven-insignia.png`** (42.1 KB)
   - NASA MAVEN mission insignia badge vector graphic.

---

## 🚀 How to Preview

You can open any of the HTML mockups directly in your browser or run a static HTTP server:

```powershell
# In PowerShell:
Start-Process "e:\Aman\NASA Project\docs\stitch\03-title-screen.html"
# Or CAD workbench:
Start-Process "e:\Aman\NASA Project\docs\stitch\07-cad-workbench.html"
```
