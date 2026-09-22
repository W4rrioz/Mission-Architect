/**
 * Real Mission Comparison Table Component
 * Source: 04-ui-ux-brief.md §6 and 07-domain-reference.md §8
 *
 * Side-by-side comparison table contrasting the player's design telemetry
 * against the real historical NASA spacecraft metrics.
 */

import React from 'react';
import { Mission, SpacecraftDesign } from '../domain/types';
import { PARTS } from '../data/parts';
import { ExternalLink, Check, AlertCircle } from 'lucide-react';

export interface RealMissionComparisonTableProps {
  mission: Mission;
  design: SpacecraftDesign;
}

export const RealMissionComparisonTable: React.FC<RealMissionComparisonTableProps> = ({
  mission,
  design,
}) => {
  const real = mission.realMission;
  const derived = design.derived;
  const partMap = new Map(PARTS.map((p) => [p.id, p]));

  const lvPart = design.selectedParts.launchVehicle
    ? partMap.get(design.selectedParts.launchVehicle)
    : null;

  // Player design metrics
  const playerWetMass = derived ? derived.massKg.current : 0;
  const playerDryMass = derived
    ? Math.round(derived.massKg.current - (design.sliderValues['prop-hydrazine-mono.propellantLoadKg'] ?? 200))
    : 0;
  const playerPower = derived ? derived.powerW.limit : 0;
  const playerCostUSD = derived ? derived.costUSD.current : 0;
  const playerDeltaV = derived ? derived.deltaVms.current : 0;
  const playerLVName = lvPart ? lvPart.name : 'None Selected';

  const rows = [
    {
      metric: 'Launch Vehicle',
      player: playerLVName,
      real: real.launchVehicle,
      match: playerLVName.toLowerCase().includes(real.launchVehicle.toLowerCase().slice(0, 5)),
      note: 'Booster class selection',
    },
    {
      metric: 'Launch Wet Mass',
      player: `${playerWetMass.toLocaleString()} kg`,
      real: `${real.launchMassKg.toLocaleString()} kg`,
      match: Math.abs(playerWetMass - real.launchMassKg) / real.launchMassKg <= 0.3,
      note: `Δ: ${(playerWetMass - real.launchMassKg > 0 ? '+' : '')}${(playerWetMass - real.launchMassKg).toLocaleString()} kg`,
    },
    {
      metric: 'Spacecraft Dry Mass',
      player: `~${playerDryMass.toLocaleString()} kg`,
      real: typeof real.dryMassKg === 'number' ? `~${real.dryMassKg.toLocaleString()} kg` : `${real.dryMassKg}`,
      match: typeof real.dryMassKg === 'number' && Math.abs(playerDryMass - real.dryMassKg) / real.dryMassKg <= 0.35,
      note: 'Structure + avionics + instruments',
    },
    {
      metric: 'Electrical Power',
      player: `${playerPower.toLocaleString()} W`,
      real: typeof real.powerW === 'number' ? `${real.powerW.toLocaleString()} W` : `${real.powerW}`,
      match: typeof real.powerW === 'number' && playerPower >= real.powerW * 0.7,
      note: 'Solar or RTG generation',
    },
    {
      metric: 'Total Program Cost',
      player: `$${(playerCostUSD / 1_000_000).toFixed(1)}M`,
      real: `$${(real.costUSD / 1_000_000).toFixed(1)}M`,
      match: playerCostUSD <= mission.budgetCapUSD,
      note: `Cap: $${(mission.budgetCapUSD / 1_000_000).toFixed(1)}M`,
    },
    {
      metric: 'Target Orbit Regime',
      player: mission.orbit.regime,
      real: real.orbit,
      match: true,
      note: `${mission.orbit.altitudeKm} km altitude`,
    },
    {
      metric: 'Propulsion Δv Capability',
      player: `${playerDeltaV.toLocaleString()} m/s`,
      real: typeof real.deltaVms === 'number' ? `${real.deltaVms.toLocaleString()} m/s` : `${real.deltaVms || 'Stationkeeping'}`,
      match: derived ? !derived.deltaVms.isOver : false,
      note: `Required: ${mission.orbit.requiredDeltaVms} m/s`,
    },
  ];

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <div>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          HISTORICAL BENCHMARK // REAL NASA MISSION SPECS
        </span>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginTop: '2px' }}>
          {`Your Design vs. Real NASA ${real.name}`}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {real.summary}
        </p>
      </div>

      {/* Two-Column Responsive Table */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
        <table
          style={{
            width: '100%',
            minWidth: '520px',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.85rem',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>SPECIFICATION</th>
              <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--mission-accent)' }}>
                YOUR DESIGN
              </th>
              <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {`REAL ${real.name.toUpperCase()}`}
              </th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>BENCHMARK NOTES</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.metric}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  background: idx % 2 === 0 ? 'rgba(19, 26, 48, 0.4)' : 'transparent',
                }}
              >
                <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {row.metric}
                </td>
                <td style={{ padding: '10px 12px' }} className="number-mono">
                  <span style={{ fontWeight: 700, color: 'var(--mission-accent)' }}>
                    {row.player}
                  </span>
                </td>
                <td style={{ padding: '10px 12px' }} className="number-mono">
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {row.real}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {row.match ? (
                      <Check size={14} color="var(--status-good)" strokeWidth={2.5} />
                    ) : (
                      <AlertCircle size={14} color="var(--status-warn)" />
                    )}
                    <span>{row.note}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NASA Citations footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <ExternalLink size={14} style={{ flexShrink: 0 }} />
        <span>
          <strong>NASA Benchmark Reference: </strong>
          {real.sourceNote}
        </span>
      </div>
    </div>
  );
};
