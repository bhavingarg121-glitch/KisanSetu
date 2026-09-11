import React from 'react';
import { AlertOctagon, Gauge, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

export function BottleneckAnalyzer({ onRerouteClick }) {
  const { zones, compositeSriResult, triggerSimulationPreset } = useCrowdData();

  // Sort zones by stampede vulnerability (highest density & lowest velocity)
  const rankedZones = [...zones].sort((a, b) => (b.density / (b.velocity || 0.1)) - (a.density / (a.velocity || 0.1)));

  const factors = [
    { name: 'Spatial Density (p/m²)', score: compositeSriResult.densityScore, weight: '40%', desc: 'People concentrated per square meter' },
    { name: 'Directional Turbulence', score: compositeSriResult.turbulenceScore, weight: '25%', desc: 'Counter-flow vectors and collision friction' },
    { name: 'Flow Stagnation Index', score: compositeSriResult.stagnationScore, weight: '20%', desc: 'Deceleration in movement speed (< 0.4 m/s)' },
    { name: 'Inflow Surge Ratio', score: compositeSriResult.surgeScore, weight: '15%', desc: 'Ingress turnstile volume exceeding egress rate' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gauge size={18} color="#f59e0b" />
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              STAMPEDE RISK INDEX (SRI) & BOTTLENECK HEURISTICS
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Multi-dimensional crowd pressure analysis detecting micro-shockwaves before macroscopic crush hazards occur.
          </p>
        </div>

        <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: compositeSriResult.color }}>
          COMPOSITE SRI: {compositeSriResult.sri} / 100
        </div>
      </div>

      {/* SRI Factor Breakdown Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {factors.map((f, idx) => {
          const isHigh = f.score >= 70;
          const isMed = f.score >= 40;
          const barColor = isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981';

          return (
            <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>{f.name}</span>
                <span className="font-mono" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>[{f.weight}]</span>
              </div>

              <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.4rem' }}>
                <div style={{ height: '100%', width: `${f.score}%`, background: barColor, transition: 'width 0.4s ease' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{f.desc}</span>
                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: barColor }}>{f.score}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sector Bottleneck Vulnerability Table */}
      <div style={{ overflowX: 'auto' }}>
        <div className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
          SECTOR BOTTLENECK RISK RANKING
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b', color: '#64748b' }}>
              <th style={{ padding: '0.6rem 0.5rem' }}>SECTOR</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>DENSITY</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>VELOCITY</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>TURBULENCE</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>HAZARD RATING</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>AI ACTION</th>
            </tr>
          </thead>
          <tbody>
            {rankedZones.map((z, idx) => {
              const isCrit = z.density >= 4.0;
              const isWarn = z.density >= 2.8;

              return (
                <tr key={z.id} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.5)', background: isCrit ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                  <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600, color: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="font-mono" style={{ color: '#64748b', fontSize: '0.75rem' }}>#{idx + 1}</span>
                      {z.name}
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    <span className="font-mono" style={{ fontWeight: 700, color: isCrit ? '#ef4444' : isWarn ? '#f59e0b' : '#10b981' }}>
                      {z.density} p/m²
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    <span className="font-mono" style={{ color: z.velocity < 0.5 ? '#ef4444' : '#38bdf8' }}>
                      {z.velocity} m/s
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    <span className="font-mono" style={{ color: z.turbulence > 0.4 ? '#f59e0b' : '#94a3b8' }}>
                      {Math.round(z.turbulence * 100)}%
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    <span className={`cyber-badge ${isCrit ? 'cyber-badge-red' : isWarn ? 'cyber-badge-amber' : 'cyber-badge-emerald'}`}>
                      {isCrit ? 'CRITICAL SURGE' : isWarn ? 'WARNING CHOKE' : 'STABLE'}
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    {isCrit ? (
                      <button
                        onClick={() => triggerSimulationPreset('evacuation_reroute')}
                        className="cyber-btn cyber-btn-danger"
                        style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}
                      >
                        Dissipate Bottleneck
                      </button>
                    ) : (
                      <span className="font-mono" style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Monitoring
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
