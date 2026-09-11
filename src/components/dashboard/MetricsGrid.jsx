import React from 'react';
import { Users, AlertTriangle, Activity, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

export function MetricsGrid() {
  const { 
    totalHeadcount, 
    venueCapacity, 
    overallOccupancyPct, 
    compositeSriResult, 
    turnstileStats,
    zones 
  } = useCrowdData();

  const criticalZoneCount = zones.filter(z => z.density >= 4.0 || z.status === 'CRITICAL').length;
  const netFlow = turnstileStats.entriesPerMin - turnstileStats.exitsPerMin;

  const cards = [
    {
      title: 'TOTAL IN-VENUE HEADCOUNT',
      value: totalHeadcount.toLocaleString(),
      subtext: `${overallOccupancyPct}% of ${venueCapacity.toLocaleString()} max capacity`,
      icon: Users,
      color: '#38bdf8',
      trend: netFlow >= 0 ? `+${netFlow} pax/min net surge` : `${netFlow} pax/min outflow`,
      trendPositive: netFlow <= 0,
      glow: 'var(--glow-cyan)'
    },
    {
      title: 'STAMPEDE RISK INDEX (SRI)',
      value: `${compositeSriResult.sri}%`,
      subtext: `${compositeSriResult.statusText}`,
      icon: AlertTriangle,
      color: compositeSriResult.color,
      trend: compositeSriResult.level,
      trendPositive: compositeSriResult.sri < 40,
      glow: compositeSriResult.sri >= 70 ? 'var(--glow-red)' : 'none',
      isAlert: compositeSriResult.sri >= 70
    },
    {
      title: 'ENTRY & EXIT VELOCITY',
      value: `${turnstileStats.entriesPerMin} IN / ${turnstileStats.exitsPerMin} OUT`,
      subtext: `Total Scanned Today: ${turnstileStats.totalScannedToday.toLocaleString()}`,
      icon: Activity,
      color: '#10b981',
      trend: `${turnstileStats.deniedToday} turnstile rejections`,
      trendPositive: turnstileStats.deniedToday < 20,
      glow: 'var(--glow-emerald)'
    },
    {
      title: 'ACTIVE CHOKE POINTS',
      value: `${criticalZoneCount} / ${zones.length} ZONES`,
      subtext: criticalZoneCount > 0 ? `${criticalZoneCount} sectors exceed 4.0 p/m² threshold` : 'All sectors within fluid flow parameters',
      icon: ShieldCheck,
      color: criticalZoneCount > 0 ? '#ef4444' : '#10b981',
      trend: criticalZoneCount > 0 ? 'INTERVENTION REQUIRED' : 'NORMAL FLOW',
      trendPositive: criticalZoneCount === 0,
      glow: criticalZoneCount > 0 ? 'var(--glow-red)' : 'none'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div 
            key={i} 
            className={`glass-panel ${c.isAlert ? 'pulse-threat' : ''}`}
            style={{ 
              padding: '1.15rem', 
              position: 'relative', 
              overflow: 'hidden',
              borderColor: c.isAlert ? '#ef4444' : 'var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span className="font-mono" style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
                {c.title}
              </span>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: `${c.color}20`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Icon size={17} color={c.color} />
              </div>
            </div>

            <div className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {c.value}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
              {c.subtext}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              {c.trendPositive ? (
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                  ✓ {c.trend}
                </span>
              ) : (
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                  ⚠️ {c.trend}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
