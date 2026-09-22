# Domain Reference — Real Formulas & Real Mission Data

This is the source of truth for every number the game computes. It is not part of the standard 6-document set — it's an extra file because the brief specifically calls for real-world mathematics rather than simplified placeholder formulas. Point the coding agent at this file for every gauge/formula implementation; do not let it invent simplified versions.

All formulas below are the same ones used in real aerospace systems engineering (early-phase/conceptual design level — the level appropriate for a game, not a full finite-element/CFD simulation). Constants are given so nothing has to be re-derived.

---

## 1. Mass & Delta-v — the Tsiolkovsky Rocket Equation

This is the single equation every real mission's propellant budget comes from.

```
Δv = Isp · g0 · ln(m0 / mf)
```
- `Δv` — total velocity change available (m/s)
- `Isp` — specific impulse of the propulsion system (s) — from the selected engine's `perfProfile.ispSeconds`
- `g0` — standard gravity, **9.80665 m/s²** (constant, not the local planet's gravity — this is a propulsion-system reference constant)
- `m0` — wet mass (dry spacecraft mass + propellant mass), kg
- `mf` — dry mass after burn (m0 − propellant burned), kg

**Game use:** the fuel-load slider sets propellant mass; the delta-v gauge is `Isp · g0 · ln(m0/mf)` for the currently-selected engine, and the mission's `orbit` field carries the **required Δv** the player must reach or exceed:

| Mission | Real required Δv | Real Isp used | Real propellant mass | Source |
|---|---|---|---|---|
| Lunar orbiter (LRO) | 1,270 m/s (lunar orbit insertion sequence) | 212.2 s | 897 kg hydrazine, max liftoff mass 1,965 kg vs. dry 949 kg | Goddard Flight Dynamics Analysis Branch, LRO Δv budget memo |
| Mars orbiter (MAVEN) | ~1.0–1.3 km/s class Mars-orbit-insertion burn (main engines 229–235 s Isp) | 229–235 s | 1,640 kg hydrazine tank capacity; wet 2,454 kg, dry 809 kg | spaceflight101 MAVEN propulsion overview |
| Asteroid probe (OSIRIS-REx) | ~1.4 km/s total mission Δv | (chemical bipropellant, Atlas V 411 injected 1,955 kg at C3 = 29.3 km²/s²) | 1,095 kg propellant, dry mass capped at 860 kg | spaceflight101 "OSIRIS-REx – A Mission with Options" |
| Earth-orbit satellite (Landsat 9) | Small stationkeeping-only Δv (already in target SSO from launch vehicle) | N/A (reaction wheels + small thrusters for stationkeeping, not a large insertion burn) | — | Landsat 9 fact sheet |

**Mass budget margin:** real spacecraft mass budgets always carry a contingency, because mass grows during development. Apply a standard **20% mass growth allowance** on top of the summed dry-part mass for early-design gauges (`totalDryMass = Σ(partMass) × 1.20`), consistent with typical Phase A/B mass-margin philosophy (this mirrors why real dry masses — e.g., MAVEN's 809 kg vs. its 903 kg "max" dry mass figure in different sources — carry a margin band rather than one exact number).

---

## 2. Orbital Mechanics — Kepler's Third Law & Vis-Viva

Used to drive the 2D orbit view's timing and to compute orbital period/velocity for the mission's target orbit.

**Orbital period (Kepler's third law):**
```
T = 2π · √(a³ / μ)
```
- `a` — semi-major axis (m)
- `μ` — standard gravitational parameter of the central body (m³/s²): Earth `μ = 3.986004×10¹⁴`, Moon `μ = 4.9048×10¹²`, Mars `μ = 4.282837×10¹³`

**Orbital velocity at any point (vis-viva equation):**
```
v = √( μ · (2/r − 1/a) )
```
- `r` — current distance from the central body's center (m)

**Real reference values baked into the mission data:**
| Mission | Orbit regime | Altitude | Inclination | Period |
|---|---|---|---|---|
| Landsat 9 | Sun-synchronous | 705 km | 98.2° | 99.0 min |
| LRO (Moon) | Polar mapping orbit | 50 km circular | polar | ~2 hr class (derive via Kepler's law with Moon's μ) |
| MAVEN (Mars) | Elliptical | periareon 150 km / apoareon 6,200 km | 75° | ~4.5 hr |
| OSIRIS-REx (Bennu) | Close proximity orbit | 0.68–2.1 km altitude | — | 22–62 hr |

Use these real altitude/period pairs to calibrate the orbit-view animation speed for each mission so the "compressed time" still looks proportionally right (e.g., a lunar orbit visibly completing faster than a Mars orbit, matching the real period ratio).

---

## 3. Power Budget — Solar Flux, Inverse-Square Law, Panel Efficiency

```
P_generated = S₀ / d_AU² · A · η_panel · cos θ · (1 − k_degrade)^years
```
- `S₀` — solar constant at 1 AU, **1,361 W/m²**
- `d_AU` — distance from the Sun in astronomical units (Earth ≈ 1.0, Mars ≈ 1.52, a near-Earth asteroid like Bennu ≈ 0.9–1.36 AU depending on point in its orbit)
- `A` — solar panel area, m² (slider-controlled)
- `η_panel` — panel efficiency (typical real triple-junction space solar cells: **0.28–0.30**, i.e. 28–30%)
- `cos θ` — sun-incidence angle factor (use 1.0 for a simplified "best case," or drive it from the mission phase for more realism)
- `k_degrade` — annual degradation, typically **~2–3% per year** for radiation-exposed cells

**Why this matters and matches real numbers:** this is exactly why OSIRIS-REx's own fact sheet lists power as a *range* (1,226–3,000 W) rather than one number — it's the same panel area at different `d_AU`, plugged into this exact formula. Use this to make the asteroid mission's power gauge genuinely vary with mission phase (further from the sun = less power = a real trade-off the player must plan margin for), rather than a flat number.

**Real reference values:**
| Mission | Power source | Real generation |
|---|---|---|
| Landsat 9 | Deployable solar array | 4,300 W |
| LRO | Tri-panel solar array, 10.7 m² | 824 W average, 1.5 kW peak |
| MAVEN | Two solar panels | 1,135 W (at Mars' farthest point from Sun) |
| OSIRIS-REx | Two solar panels, 8.5 m² total | 1,226–3,000 W depending on solar distance |

**Battery sizing:** for eclipse/night periods, required battery capacity (Wh) = `average load (W) × eclipse duration (h) / depth-of-discharge limit` — use a real DoD limit of **~0.6–0.8 (60–80%)** for Li-ion, matching LRO's Li-ion battery (35 kg, 126 Ah capacity) as a sanity-check reference point.

---

## 4. Communications Link Budget — Friis Transmission Equation

This is the real equation behind every "will my downlink actually reach Earth" calculation.

**Free-space path loss:**
```
FSPL(dB) = 20·log₁₀(d) + 20·log₁₀(f) + 20·log₁₀(4π / c)
```
equivalently, with `d` in km and `f` in MHz:
```
FSPL(dB) = 20·log₁₀(d_km) + 20·log₁₀(f_MHz) + 32.44
```

**Parabolic dish antenna gain:**
```
G(dBi) ≈ 10·log₁₀( η_ant · (π · D · f / c)² )
```
approximated for a typical **55% aperture efficiency**:
```
G(dBi) ≈ 20·log₁₀(D) + 20·log₁₀(f_GHz) + 17.8
```
- `D` — dish diameter, m (slider-controlled)
- `f` — carrier frequency, Hz (or GHz in the approximation) — use a real deep-space band such as **X-band, 8.4 GHz**, matching real NASA Deep Space Network downlink practice

**Link margin (the actual gauge shown to the player):**
```
Link Margin (dB) = EIRP(dBm) + G_receiver(dBi) − FSPL(dB) − OtherLosses(dB) − RequiredThreshold(dBm)
EIRP(dBm) = TransmitPower(dBm) + G_transmitter(dBi)
```
- `OtherLosses` — real link budgets always include atmospheric loss, pointing loss, implementation loss; use a flat **~3–5 dB** allowance for the game rather than omitting losses entirely (a real link budget never assumes zero loss).
- `RequiredThreshold` — the receiver's required signal level for the target data rate/bit-error-rate, treat as a constant per mission difficulty tier (harder missions = higher required data rate = tighter margin at the same power).
- Positive margin = link closes (comms gauge healthy); negative margin = the mission fails to downlink, driving both the comms gauge and, directly, the `scienceReturn` score component, since undelivered data doesn't count.

**Data volume math (ties comms to the science-return score):**
```
DataVolumeDownlinked(bits) = DataRate(bits/s) × PassDuration(s)
```
Compare against `MissionRunState.dataStoredMB` and the mission's `minScienceDataMB` requirement.

**Real reference values:**
| Mission | Downlink capability |
|---|---|
| LRO | 572 Gbit/day total, max downlink rate 100 Mbit/s |
| MAVEN | High-gain antenna, Earth communication sessions roughly twice weekly |
| OSIRIS-REx | Standard NASA Deep Space Network-class X-band downlink |

---

## 5. Thermal Balance — Stefan-Boltzmann Radiative Equilibrium

Real spacecraft thermal design starts from a simple radiative energy balance, before any detailed thermal model:

```
Absorbed power = Emitted power
α · S₀/d_AU² · A_absorb = ε · σ · A_emit · T⁴
```
Solved for equilibrium temperature:
```
T_eq = [ (α · S₀ · A_absorb) / (ε · σ · A_emit · d_AU²) ] ^ (1/4)
```
- `α` — solar absorptivity of the spacecraft surface (typical real coatings: **0.2 (white paint) to 0.9 (dark surfaces)**)
- `ε` — infrared emissivity (typical: **0.8–0.9** for common thermal-control coatings)
- `σ` — Stefan-Boltzmann constant, **5.670374×10⁻⁸ W/(m²·K⁴)**
- `A_absorb` / `A_emit` — sunlit cross-section vs. total radiating area (a simplified spacecraft can treat these as proportional to a "size" stat derived from the bus part chosen)

**Game use:** thermal/radiation-protection parts move `α`, `ε`, or add an `insulationFactor` that widens the safe temperature band before the thermal gauge goes critical. `d_AU` ties this directly to the same solar-distance value used in the power formula — Mars and asteroid missions run colder by default (matches reality: Mars orbiters need active thermal control specifically because 1.5 AU means ~44% of Earth's solar flux, by the inverse-square law above).

---

## 6. Reliability — Exponential Failure Model & Redundancy

Real reliability engineering for spacecraft uses the exponential reliability function based on a constant failure rate:

```
R(t) = e^(−λ·t)
```
- `λ` — failure rate (failures per hour), the inverse of **MTBF (mean time between failures)**: `λ = 1 / MTBF`
- `t` — mission elapsed time

**Redundancy (parallel systems):** for a redundant pair of identical subsystems, both must fail for the system to fail, so:
```
P(system failure) = P(unit A fails) × P(unit B fails) = (1 − R_unit(t))²
```
This is the real mathematical reason redundancy dramatically improves reliability — a system with two independent 95%-reliable units has a combined failure probability of `0.05 × 0.05 = 0.0025` (99.75% reliable), not a simple average.

**Game use:** each part category carries a base MTBF-derived `λ`. The `redundancy` category's `failureRateMultiplier` is applied as the squared-failure-probability relationship above (not a flat percentage reduction — that would be the "simple formula" the brief specifically asked to avoid). Random-event probability during Live Mission Control is drawn using `R(t)` evaluated at the current mission-elapsed time against each active subsystem's `λ`, scaled up by the mission's `eventProfile` for difficulty.

---

## 7. Putting It Together — the Design-Screen Gauges

| Gauge | Formula source | Limit comes from |
|---|---|---|
| Mass | Σ part mass × 1.20 contingency (§1) | Launch vehicle's `maxPayloadKg` |
| Power | §3 solar power formula (or `ratedWatts` for RTG) | Σ instrument/subsystem `powerDrawW` |
| Fuel / Δv | §1 Tsiolkovsky equation | Mission's real required Δv (table in §1) |
| Comms | §4 Friis link budget → link margin | 0 dB (closes/doesn't close), shown as margin |
| Thermal/radiation | §5 Stefan-Boltzmann equilibrium | Mission-appropriate safe temperature band |
| Reliability | §6 exponential model + redundancy | Displayed as an estimated mission-success probability, not a hard pass/fail limit |
| Budget | Σ part `costUSD` | Mission's `budgetCapUSD` (hard limit) |

## 8. Real Mission Fact Sheet (for the Debrief comparison table)

| | Landsat 9 | LRO | MAVEN | OSIRIS-REx |
|---|---|---|---|---|
| Launch mass | 2,711 kg | 1,846 kg | 2,454 kg | 2,110 kg |
| Dry mass | ~2,390 kg | 949 kg | 809 kg | 880 kg |
| Power | 4,300 W | 824 W avg / 1.5 kW peak | 1,135 W | 1,226–3,000 W |
| Cost | ~$153.8M (launch) / ~$129.9M (dev.) | ~$500M (project life) | ~$582.5M (build+launch+ops) | ~$800M (+$183.5M launch) |
| Launch vehicle | Atlas V 401 | Atlas V 401 | Atlas V 401 | Atlas V 411 |
| Orbit | 705 km SSO, 98.2° | 50 km polar (mapping) | 150×6,200 km, 75° | 0.68–2.1 km around Bennu |
| Required Δv | stationkeeping only | 1,270 m/s | ~1.0–1.3 km/s class MOI | ~1.4 km/s |

Sources: NASA/USGS Landsat 9 fact sheets and mission pages; Goddard Space Flight Center LRO Δv budget memo and eoPortal LRO spacecraft summary; NASA MAVEN fact sheet and spaceflight101 MAVEN propulsion page; NASA/University of Arizona OSIRIS-REx mission fact sheet and spaceflight101 "OSIRIS-REx – A Mission with Options."

## 9. Constants Reference (for the code)

```ts
export const CONSTANTS = {
  g0: 9.80665,                 // m/s^2, standard gravity (Isp reference)
  SOLAR_CONSTANT: 1361,        // W/m^2 at 1 AU
  STEFAN_BOLTZMANN: 5.670374e-8, // W/(m^2 K^4)
  C: 2.998e8,                  // m/s, speed of light
  MU_EARTH: 3.986004e14,       // m^3/s^2
  MU_MOON: 4.9048e12,          // m^3/s^2
  MU_MARS: 4.282837e13,        // m^3/s^2
  AU_KM: 1.495978707e8,        // km per AU
};
```
