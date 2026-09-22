/**
 * Mission Data Catalog
 * Source: 07-domain-reference.md §1, §2, §3, §8 and 05-backend-schema.md §3
 *
 * All RealMissionReference numbers match 07-domain-reference.md section 8 exactly.
 */

import { Mission } from '../domain/types';

export const MISSIONS: Record<string, Mission> = {
  'earth-orbit': {
    id: 'earth-orbit',
    name: 'Earth-Observing Satellite',
    difficulty: 1,
    isTutorial: true,
    objective:
      'Deploy an advanced multispectral Earth-observation satellite into Sun-synchronous orbit to monitor global land use, surface temperature, and climate change.',
    budgetCapUSD: 300_000_000,
    minScienceDataMB: 50_000,
    realMission: {
      name: 'Landsat 9',
      launchMassKg: 2711,
      dryMassKg: 2390,
      powerW: 4300,
      costUSD: 283_700_000, // ~$153.8M (launch) + ~$129.9M (dev.)
      deltaVms: 50, // stationkeeping only
      launchVehicle: 'Atlas V 401',
      orbit: '705 km SSO, 98.2°',
      summary:
        'Earth-observing satellite in Sun-synchronous orbit, continuing the 50-year Landsat record of continuous global multispectral imaging.',
      sourceNote: 'NASA/USGS Landsat 9 fact sheets and mission pages.',
    },
    orbit: {
      centralBody: 'earth',
      regime: 'Sun-synchronous orbit (SSO)',
      altitudeKm: 705,
      semiMajorAxisM: 7_083_000, // R_earth (6,378 km) + 705 km
      inclinationDeg: 98.2,
      periodMinutes: 99.0,
      requiredDeltaVms: 50,
      solarDistanceAU: 1.0,
      distanceToEarthKm: 705,
      eclipseDurationMinutes: 35,
    },
    eventProfile: {
      eventFrequencyMultiplier: 0.5,
      baseFailureRateMultiplier: 0.5,
      difficultyRating: 1,
    },
  },

  moon: {
    id: 'moon',
    name: 'Lunar Reconnaissance Orbiter',
    difficulty: 2,
    isTutorial: false,
    objective:
      'Inject into a 50 km circular polar mapping orbit around the Moon to generate ultra-high-resolution 3D topography and scout future crewed landing sites.',
    budgetCapUSD: 550_000_000,
    minScienceDataMB: 150_000,
    realMission: {
      name: 'LRO',
      launchMassKg: 1846,
      dryMassKg: 949,
      powerW: 824, // 824 W avg / 1.5 kW peak
      costUSD: 500_000_000, // ~$500M (project life)
      deltaVms: 1270, // 1,270 m/s lunar orbit insertion sequence
      launchVehicle: 'Atlas V 401',
      orbit: '50 km polar (mapping)',
      summary:
        'Robotic spacecraft in a 50 km circular polar mapping orbit creating 3D lunar surface elevation models and identifying cold-trap water ice deposits.',
      sourceNote:
        'Goddard Space Flight Center LRO Δv budget memo and eoPortal LRO spacecraft summary.',
    },
    orbit: {
      centralBody: 'moon',
      regime: 'Polar lunar mapping orbit',
      altitudeKm: 50,
      semiMajorAxisM: 1_787_400, // R_moon (1,737.4 km) + 50 km
      inclinationDeg: 90.0,
      periodMinutes: 113.5, // Derived from Kepler's third law with Moon μ = 4.9048e12
      requiredDeltaVms: 1270,
      solarDistanceAU: 1.0,
      distanceToEarthKm: 384_400,
      eclipseDurationMinutes: 45,
    },
    eventProfile: {
      eventFrequencyMultiplier: 1.0,
      baseFailureRateMultiplier: 1.0,
      difficultyRating: 2,
    },
  },

  mars: {
    id: 'mars',
    name: 'Mars Atmosphere & Volatiles Evolution',
    difficulty: 3,
    isTutorial: false,
    objective:
      'Perform interplanetary transit to Mars and execute a high-energy Mars Orbit Insertion burn into an elliptical orbit to study upper atmosphere loss.',
    budgetCapUSD: 650_000_000,
    minScienceDataMB: 80_000,
    realMission: {
      name: 'MAVEN',
      launchMassKg: 2454,
      dryMassKg: 809,
      powerW: 1135, // at Mars farthest point from Sun (1.67 AU)
      costUSD: 582_500_000, // ~$582.5M (build+launch+ops)
      deltaVms: 1250, // ~1.0–1.3 km/s class MOI
      launchVehicle: 'Atlas V 401',
      orbit: '150×6,200 km, 75°',
      summary:
        'Mars orbiter investigating the loss of planetary atmospheric gases to space, revealing how the loss of water transformed Martian climate.',
      sourceNote:
        'NASA MAVEN fact sheet and spaceflight101 MAVEN propulsion page.',
    },
    orbit: {
      centralBody: 'mars',
      regime: 'Elliptical Mars orbit',
      altitudeKm: 150,
      periapsisKm: 150,
      apoapsisKm: 6200,
      semiMajorAxisM: 6_565_000, // R_mars (3,390 km) + (150 + 6,200)/2 km
      inclinationDeg: 75.0,
      periodMinutes: 270.0, // ~4.5 hours
      requiredDeltaVms: 1250,
      solarDistanceAU: 1.52,
      distanceToEarthKm: 225_000_000, // Average Earth-Mars distance
      eclipseDurationMinutes: 30,
    },
    eventProfile: {
      eventFrequencyMultiplier: 1.4,
      baseFailureRateMultiplier: 1.3,
      difficultyRating: 3,
    },
  },

  asteroid: {
    id: 'asteroid',
    name: 'Asteroid Sample Return',
    difficulty: 4,
    isTutorial: false,
    objective:
      'Rendezvous with near-Earth carbonaceous asteroid Bennu, navigate in microgravity close-proximity orbit, and return pristine geological samples to Earth.',
    budgetCapUSD: 1_050_000_000,
    minScienceDataMB: 30_000,
    realMission: {
      name: 'OSIRIS-REx',
      launchMassKg: 2110,
      dryMassKg: 880,
      powerW: 1226, // 1,226–3,000 W depending on solar distance
      costUSD: 983_500_000, // ~$800M (+$183.5M launch)
      deltaVms: 1400, // ~1.4 km/s total mission Δv
      launchVehicle: 'Atlas V 411',
      orbit: '0.68–2.1 km around Bennu',
      summary:
        'Near-Earth asteroid sample-return mission that mapped asteroid Bennu in millimeter detail and collected surface regolith for Earth laboratory return.',
      sourceNote:
        'NASA/University of Arizona OSIRIS-REx mission fact sheet and spaceflight101 "OSIRIS-REx – A Mission with Options".',
    },
    orbit: {
      centralBody: 'asteroid',
      regime: 'Microgravity close proximity orbit',
      altitudeKm: 1.5,
      periapsisKm: 0.68,
      apoapsisKm: 2.1,
      semiMajorAxisM: 1750, // Bennu radius ~250m + 1.5 km
      inclinationDeg: 45.0,
      periodMinutes: 2500.0, // 22–62 hours
      requiredDeltaVms: 1400,
      solarDistanceAU: 1.15, // Varies 0.9 to 1.36 AU
      distanceToEarthKm: 300_000_000, // Deep-space DSN distance
      eclipseDurationMinutes: 0,
    },
    eventProfile: {
      eventFrequencyMultiplier: 1.8,
      baseFailureRateMultiplier: 1.6,
      difficultyRating: 4,
    },
  },
};

export const MISSION_LIST: Mission[] = Object.values(MISSIONS);
