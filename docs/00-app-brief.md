# App Brief

**App name:** Mission Architect

**One-line idea:** A browser game where you design a real spacecraft, launch it, and fly the mission in real time under pressure, then see how you stack up against the real NASA mission it's based on.

**Problem it solves:** Space mission design involves constant trade-offs — mass vs. power vs. budget vs. communications vs. fuel — but students almost never get to feel those trade-offs firsthand. Mission Architect makes the trade-offs interactive: every part you pick and every slider you move changes whether your mission can actually fly.

**Who it is for:** Students and space enthusiasts playing the game; NASA Space Apps Challenge 2026 judges evaluating it against the "Space Missions Game Design" challenge.

**The main action a user should complete:** Design a spacecraft for a chosen mission within its budget and constraints, launch it, get through the real-time mission phase, and reach the debrief screen with a pass and a good score.

**Must-have features:**
- Four real-mission-based scenarios: Earth-orbit satellite (tutorial), lunar orbiter, Mars orbiter, asteroid sample-return probe
- Spacecraft design screen: preset parts + tunable sliders across launch vehicle, bus, power, propulsion, communications, instruments, thermal/radiation protection, redundancy
- Live constraint gauges: mass, power, budget, communications, fuel/delta-v, thermal/radiation, reliability
- Pre-flight review checklist
- Real-time mission control phase: launch → cruise → arrival → science ops → end of mission, with timed decision cards (failures, comms blackouts, launch-window pressure, budget/schedule surprises)
- Pass/fail outcome, 100-point score breakdown, and a side-by-side comparison against the real NASA mission
- Guided tutorial on the first (Earth-orbit) mission

**Nice-to-have features:**
- Light sound effects (countdown, alerts, launch) — added last, only if time allows
- A "personal best" score per mission stored in the browser (localStorage), no account needed

**Explicitly out of scope for this build:**
- Leaderboard / any database or backend (dropped to keep the app fully static)
- User accounts or sign-in
- Mission tips / trade-off explainer panels
- Save & share custom designs
- Multiplayer
- 3D models or a full physics engine

**Platform:** Web app (desktop and mobile browsers), static site.

**Business model:** None — a free hackathon submission, not a commercial product.

**Important constraints:**
- Deadline: NASA Space Apps Challenge 2026, event on Nov 14–15, 2026. Full official challenge statement (with any required NASA datasets) releases Oct 28, 2026 — the game must be able to absorb that statement without a redesign.
- Budget: $0 — free-tier tools and hosting only.
- Required tools/services: React + Vite, hosted on Vercel. Built with Antigravity (AI coding assistant) using a Google Gemini Flash model. No database — fully client-side.
- Privacy/security requirements: No accounts, no personal data collected, no backend to secure.

**References or existing products:** Kerbal Space Program (feel of resource-constrained mission building); real NASA missions used as the four scenarios — Landsat 9, Lunar Reconnaissance Orbiter (LRO), MAVEN, OSIRIS-REx.
