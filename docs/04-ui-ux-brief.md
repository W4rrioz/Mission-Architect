# UI/UX Design Brief — Mission Architect

## 1. Experience Goal
- **Desired feeling:** Focused, high-stakes, "real mission control" — like sitting at a console, not playing a casual mobile game.
- **Three visual adjectives:** Precise, dark, alive (gauges and glows respond instantly to the player).
- **What the design must avoid:** Generic glassmorphism, excessive gradients or rounded "friendly app" cards, decorative motion that doesn't communicate state, neon-everywhere without hierarchy.

## 2. Users and Context
- **Primary user:** Students / hackathon judges, playing in short sessions (minutes), likely first time seeing the app.
- **Device and environment:** Mix of desktop (judges, likely) and mobile (casual players); variable lighting, so contrast must hold up.
- **Accessibility needs:** Keyboard operability, color not the sole carrier of status information, WCAG AA contrast.

## 3. Visual Direction

### Colour palette and roles
Base is a clean, dark navy-black with cool-white text. There is no single fixed accent color — the accent shifts with context (per-mission tint, and status colors override both):

| Token | Value | Role |
|---|---|---|
| `--bg-base` | `#0B1020` | App background |
| `--bg-surface` | `#131A30` | Cards, panels |
| `--border-subtle` | `#2A3350` | Card/panel borders |
| `--text-primary` | `#E6ECF8` | Body text |
| `--text-muted` | `#8FA0C4` | Secondary/label text |
| `--mission-earth` | `#3DA5F5` | Earth-orbit mission tint |
| `--mission-moon` | `#C9D3EA` | Moon mission tint (silver-white) |
| `--mission-mars` | `#E0703D` | Mars mission tint (orange-red) |
| `--mission-asteroid` | `#8B5CF6` | Asteroid mission tint (violet) |
| `--status-good` | `#3DBE7A` | Gauge healthy / PASS |
| `--status-warn` | `#E0A030` | Gauge ≥85% of limit |
| `--status-critical` | `#E0453D` | Gauge ≥100% of limit / FAIL |

Rule: the active mission's tint colors headers, active tabs, and the orbit view. Status colors always override the mission tint on a gauge, because safety information must never be ambiguous. During launch and while a decision card is open, glow intensity on the relevant elements increases (a brighter box-shadow using the current status/mission color), to heighten urgency without changing hue meaning.

### Typography
- **Headings / display:** Orbitron or Rajdhani (techy, geometric) — Google Fonts, loaded with `font-display: swap`.
- **Body:** Inter.
- **Numbers (gauges, countdowns, budget figures):** a monospace font (e.g., `ui-monospace`/`JetBrains Mono` stack) so digits don't jitter in width as they update.

### Icon direction
Simple line icons (a free set such as Lucide), consistent 1.5px stroke, no filled icon/line icon mixing.

### Image/illustration direction
All spacecraft, part, and planet art as hand-built inline SVG in a consistent flat/geometric style (no photographic textures) so it stays lightweight and matches the sci-fi UI rather than looking like a mismatched asset pack. Starfield is procedurally generated (Canvas or SVG), not an image file.

### Surface and border treatment
Flat surfaces, 1px hairline borders in `--border-subtle`, subtle glow (box-shadow) only on the currently-relevant element (selected tab, open decision card, critical gauge) — glow is a signal, not decoration, so it should not appear everywhere at once.

## 4. Layout System
- **Content width:** Max 1200px on desktop, centered; full-bleed on mobile.
- **Grid:** 12-column on desktop for the Design and Mission Control screens (gauges/controls in a top bar, main content center, summary panel right); single column, stacked, on mobile.
- **Spacing scale:** 4px base unit (4, 8, 12, 16, 24, 32, 48).
- **Section rhythm:** Consistent 16–24px gaps between panels; gauge cards internally padded 8–12px to stay compact (there are up to 7 constraint gauges to show).
- **Responsive breakpoints:** `<640px` mobile, `640–1024px` tablet (gauges wrap to 2×2 or 2×4 grid), `>1024px` desktop (top bar layout).

## 5. Component Language

- **Buttons:** Primary (filled, mission/status tint), secondary (outline, `--border-subtle`), both with clear disabled state (reduced opacity + no pointer). States: default, hover (slight brighten), focus (visible outline ring — required for keyboard users), active (slight scale-down), disabled, loading (N/A — no async actions).
- **Sliders:** Track in `--border-subtle`, filled portion in the current mission tint, numeric readout to the right in monospace, updates live as dragged. States: default, focus (visible ring), disabled (e.g., a locked-in part with no tunable range).
- **Gauges (2×2 grid on Design, larger set on Mission Control):** Label + numeric value (monospace, "current / limit") + a horizontal bar. Bar color = status color (good/warn/critical) per the thresholds in Section 3. States: healthy, warning (≥85%), critical (≥100%).
- **Category tabs (Design screen):** Pill-shaped, inactive = outline, active = filled with mission tint and dark text for contrast.
- **Cards (mission select, selected-part panel):** `--bg-surface`, 1px border, 8–12px radius (soft but not "bubbly").
- **Decision card (Mission Control):** Slides up from bottom (mobile) or appears as a centered modal-like panel (desktop), with a countdown ring (SVG, animated stroke-dashoffset) plus a numeric seconds readout, 2–3 response buttons, and a screen-edge tint (amber/red by severity) so urgency is visible even in peripheral vision.
- **Checklist rows (Pre-flight Review):** Status dot (green/amber/red) + label + short reason text, entire row clickable to jump back to the relevant Design category.
- **Event log (Mission Control):** Small, auto-scrolling list, most recent entry at top, muted text, timestamps in mission-elapsed time.

Every component above needs default, hover, focus, active, disabled, and (where relevant) loading/error states defined in code, even where this brief only calls out the ones that differ from the obvious default.

## 6. Screen Direction

- **Title:** Full-bleed dark starfield, centered logo/wordmark, single primary CTA ("Play"). Minimal, cinematic.
- **Mission Select:** 4 cards in a responsive grid (2×2 desktop, 1-column mobile), each tinted with its mission color, difficulty shown as simple dots/stars, locked cards dimmed with a lock icon overlay.
- **Mission Briefing:** Single centered column — objective, budget, requirements as a short list, real-mission reference as a small "Inspired by [mission]" callout box.
- **Spacecraft Design:** Desktop — top bar (gauges + budget), left/center category tabs and selected-part panel, right column spacecraft preview + cost/mass summary. Mobile — gauges collapse to a 2×2 grid under the header, tabs scroll horizontally, preview moves below the part panel.
- **Pre-flight Review:** Single column checklist, prominent Launch button fixed at the bottom on mobile.
- **Live Mission Control:** Desktop — top bar (mission/phase/clock), main area split between the orbit view (left/center, larger) and gauges/controls (right sidebar), event log docked bottom-right, decision cards overlay centered. Mobile — orbit view on top (shorter), gauges below as a scrollable strip, controls as a bottom sheet, decision cards full-width slide-up.
- **Debrief:** PASS/FAIL banner at top (color-coded), score breakdown as 5 horizontal bars below it, real-mission comparison as a two-column table (Your design | Real mission), "what went wrong" as a short callout only when relevant.

## 7. Interaction and Motion
- **Purposeful transitions:** Screen changes use a quick fade/slide (150–250ms) — no elaborate page transitions that slow down a judge clicking through quickly.
- **Feedback moments:** Gauge bar color change is animated (color + width transition, ~200ms) so a change is noticeable, not just correct. Launch sequence gets one deliberate "moment" (a brief animated liftoff on the orbit view) as the single showcase animation of the app — everything else stays snappy and functional.
- **Reduced-motion behavior:** Respect `prefers-reduced-motion` — disable the countdown ring's animated stroke (replace with a static numeric countdown only) and skip decorative starfield motion/launch animation, keeping functional transitions but instant rather than eased.

## 8. Accessibility
- **Contrast:** All text/background pairs meet WCAG AA (4.5:1 for body text) — verify the muted text token and mission tint colors against `--bg-base` and `--bg-surface` specifically, since some (e.g., mission-moon silver on dark) are close to the line.
- **Keyboard use:** Every button, tab, slider, and decision-card response must be reachable and operable via Tab/Enter/Arrow keys; sliders adjustable with arrow keys.
- **Focus states:** A visible focus ring (not just a browser default outline removed with nothing replacing it) on every interactive element.
- **Tap targets:** Minimum 44×44px on mobile for all buttons and decision-card responses (these are the highest-stakes, most time-pressured taps in the app).
- **Text sizing:** Base 16px minimum for body text; countdown numerals large enough to read at a glance (≥24px).

## 9. Consistency Rules

### Always use
- The current mission's tint color for that mission's headers, active tab, and orbit view accents.
- Status colors (good/warn/critical) to override mission tint on any gauge or checklist item, without exception.
- Monospace for every numeric readout (gauges, countdowns, scores, budget figures).
- A visible focus ring on interactive elements.

### Never use
- Color alone to convey gauge/status meaning (always pair with numeric value and/or icon).
- Decorative animation during the timed decision-card window (it competes with the countdown for attention).
- More than one glowing/high-emphasis element on screen at the same time outside of the decision-card moment.
