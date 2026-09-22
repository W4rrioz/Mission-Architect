# Technical Requirements Document — Mission Architect

## 1. Technical Overview
- **Architecture summary:** Fully static, client-side single-page app. All mission/part data and domain formulas ship as bundled TypeScript/JSON. No backend, no database, no auth.
- **Platforms:** Web (desktop + mobile browsers), deployed as a static site.
- **Main technical constraints:** Zero budget (free tiers only), solo developer, hackathon deadline (Nov 14–15, 2026), must be buildable incrementally with an AI coding assistant (Antigravity + Gemini Flash).

## 2. Technology Stack
| Layer | Choice | Reason | Rejected alternative |
|---|---|---|---|
| Frontend framework | React + Vite | Fast dev server, huge ecosystem, matches Aman's existing skills | Next.js — rejected: SSR/server features are unneeded for a fully static, no-backend app and add build complexity |
| Language | TypeScript | Catches part/formula shape errors at compile time, important since parts data feeds real formulas | Plain JS — rejected: too easy to silently break a gauge calculation |
| Styling | CSS Modules / plain CSS with CSS variables for the theme tokens | No extra dependency, easy per-mission color theming via CSS variables | Tailwind — acceptable alternative if preferred, but not required |
| State management | React Context + `useReducer` for mission-run state | App-wide state is one active mission run; Redux/Zustand is unnecessary overhead | Redux — rejected: overkill for this scope |
| Animation | CSS transitions/keyframes + `requestAnimationFrame` for the orbit view | Lightweight, no extra library needed for 2D SVG/Canvas animation | Framer Motion — optional nice-to-have, not required |
| Database | None | Leaderboard was explicitly dropped to avoid a backend; all data is static or session-only | Supabase — rejected per explicit decision to stay backend-free |
| Authentication | None | No accounts in scope | — |
| File storage | None (all assets bundled as SVG/JSON in the repo) | Keeps hosting free and load fast | — |
| Local persistence | `localStorage`, optional, for a "personal best" score per mission only | Zero-cost, no backend needed for a nice-to-have | — |
| Hosting | Vercel (static build) | Free tier, git-connected auto-deploy, fast CDN | Netlify/GitHub Pages — equally valid, Vercel chosen per earlier decision |
| Testing | Manual verification checklist per phase (see Implementation Plan); optional Vitest unit tests for the formula module only | Hackathon time budget favors manual testing except for the one module (formulas) where a silent bug is costly | Full test suite — descoped for time |

## 3. System Architecture
- **Client responsibilities:** Everything. Rendering all screens, running the mission-run state machine, evaluating all design and mission-control formulas, generating random events (seeded per run for reproducibility during testing), computing the final score, rendering the real-mission comparison.
- **Server responsibilities:** None — Vercel only serves the static build output.
- **Database responsibilities:** None.
- **External service responsibilities:** None at runtime. NASA data is fetched once during development (from public fact sheets / open APIs) and baked into `src/data/missions.ts` as static constants — not fetched live during play, so the app works fully offline.

## 4. APIs and Integrations
None required at runtime. Optional, dev-time only:
- **NASA Open APIs (api.nasa.gov):** optionally used during development to pull supplementary imagery (e.g., a Mars rover photo for flavor) or to double-check a numeric fact. Not a runtime dependency.
  - Purpose: flavor content / fact-checking only.
  - Data sent/received: none at runtime (no calls from the shipped app).
  - Authentication: DEMO_KEY or personal key, dev-time only, never bundled into client code if a real key is used.
  - Rate/usage limits: irrelevant at runtime.
  - Failure handling: irrelevant at runtime; if used at dev time, fall back to the cited static fact sheets already gathered (see `07-domain-reference.md`).

## 5. Security and Privacy
- **Authentication/authorization:** N/A, no accounts.
- **Input validation:** All slider values are clamped client-side to their defined min/max in the part-catalog data; no free-text input anywhere except the optional nickname for a locally-stored personal best (sanitize to strip HTML before rendering, even though it never leaves the browser, as good practice).
- **Secrets management:** None needed — no API keys ship in the client bundle.
- **Sensitive data handling:** None collected.
- **Abuse prevention:** N/A — no shared state, no backend to abuse.

## 6. Performance Requirements
- **Expected usage:** Single-user sessions, a few minutes each, bursty around judging.
- **Loading targets:** First contentful paint <1.5s, interactive <3s on broadband; total JS bundle target <500KB gzipped (SVG/JSON assets kept small per the "simple, fast-loading" asset decision).
- **Caching approach:** Standard Vercel static asset caching (immutable, hashed filenames from Vite's build).
- **Media optimization:** All spacecraft/part art as inline SVG (no raster images); starfield generated in code (Canvas/SVG), not a loaded image; fonts loaded from Google Fonts with `font-display: swap`.

## 7. Testing and Quality
- **Unit tests:** The domain-formula module (`src/domain/formulas.ts` — delta-v, link budget, power budget, thermal balance, mass budget, score) should have unit tests against the four real missions' known numbers as sanity checks (e.g., "MAVEN's design, run through the delta-v formula with MAVEN's real Isp and propellant mass, should produce ~1.4 km/s"). This is the one place hackathon time is worth spending on tests, because a silently wrong formula undermines the whole "real math" claim.
- **Integration tests:** Manual — a full run-through of each mission at least once before submission.
- **End-to-end tests:** Manual.
- **Accessibility checks:** Manual keyboard-only pass + a contrast check on the final color tokens.

## 8. Development and Deployment
- **Environments:** Local dev (Vite dev server) → Vercel preview deploys (automatic per branch/PR) → Vercel production (main branch).
- **Environment variables:** None required for the shipped app (no secrets, no backend).
- **CI checks:** Vercel's built-in build check on every push is sufficient at this scale; a GitHub Action running `tsc --noEmit` and the formula unit tests before merge is a nice-to-have if time allows.
- **Deployment approach:** Push to `main` → Vercel auto-builds (`vite build`) → deploys static output. No manual deploy steps.

## 9. Technical Risks and Open Questions
- **Risk:** Real-time decision-card timers plus animation can be a lot of simultaneous state for a solo, time-boxed build — mitigate by building the state machine (Implementation Plan Phase 4) before any visual polish.
- **Risk:** AI-generated code can produce plausible-looking but numerically wrong physics formulas — mitigate with the unit-test sanity checks in Section 7 and by keeping `07-domain-reference.md` as the single source of truth the AI must be pointed to for every formula.
- **Open question:** Whether the Oct 28 official challenge statement adds a required data source or format that isn't covered by this TRD — revisit this document if so.
