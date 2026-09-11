import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

export function ZoneTrafficTable() {
  const { zones, setSelectedZoneId, selectedZoneId } = useCrowdData();

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Layers size={18} color="#38bdf8" />
        <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
          ZONE ARTERY TRAFFIC & EVACUATION PRIORITY AUDIT
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b', color: '#64748b' }}>
              <th style={{ padding: '0.6rem 0.5rem' }}>ZONE SECTOR</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>HEADCOUNT</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>OCCUPANCY %</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>DENSITY</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>FLOW SPEED</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>EVAC PRIORITY</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>ASSIGNED EXIT</th>
            </tr>
          </thead>
          <tbody>
            {zones.map(z => {
              const occ = Math.round((z.currentCount / z.capacity) * 100);
              const isCrit = z.density >= 4.0;
              const isWarn = z.density >= 2.8;

              return (
                <tr 
                  key={z.id}
                  onClick={() => setSelectedZoneId(z.id)}
                  style={{ 
                    borderBottom: '1px solid rgba(30, 41, 59, 0.4)',
                    background: selectedZoneId === z.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600, color: '#f8fafc' }}>
                    {z.name}
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    <span className="font-mono">{z.currentCount.toLocaleString()} / {z.capacity.toLocaleString()}</span>
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '60px', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${occ}%`, height: '100%', background: occ > 85 ? '#ef4444' : occ > 65 ? '#f59e0b' : '#10b981' }} />
                      </div>
                      <span className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{occ}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    <span className="font-mono" style={{ fontWeight: 700, color: isCrit ? '#ef4444' : isWarn ? '#f59e0b' : '#34d399' }}>
                      {z.density} p/m²
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    <span className="font-mono" style={{ color: z.velocity < 0.5 ? '#ef4444' : '#38bdf8' }}>
                      {z.velocity} m/s
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    <span className={`cyber-badge ${z.evacPriority === 1 ? 'cyber-badge-red' : z.evacPriority === 2 ? 'cyber-badge-amber' : 'cyber-badge-blue'}`}>
                      Priority {z.evacPriority}
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                    {z.exitGate}
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
