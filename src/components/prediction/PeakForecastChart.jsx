import React from 'react';
import { LineChart, TrendingUp, AlertTriangle, Clock, Calendar, Zap } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

export function PeakForecastChart() {
  const { predictiveCurve, venueCapacity, totalHeadcount } = useCrowdData();

  // SVG chart dimensions
  const width = 760;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 40, left: 55 };

  const graphW = width - padding.left - padding.right;
  const graphH = height - padding.top - padding.bottom;

  // Max value on Y axis
  const maxY = venueCapacity * 1.1;

  // Build points for SVG polyline
  const points = predictiveCurve.map((item, index) => {
    const x = padding.left + (index / (predictiveCurve.length - 1)) * graphW;
    const y = padding.top + graphH - (item.projectedCount / maxY) * graphH;
    return { ...item, x, y };
  });

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');

  // Danger threshold line Y
  const dangerY = padding.top + graphH - (venueCapacity * 0.9 / maxY) * graphH;

  // Peak item
  const peakItem = [...predictiveCurve].sort((a, b) => b.projectedCount - a.projectedCount)[0];

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="#a855f7" />
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              AI PREDICTIVE CROWD SURGE & PEAK FORECASTING
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Multi-factor time-series projection modeling turnstile rates, transit schedules, and event timeline milestones.
          </p>
        </div>

        <div className="cyber-badge cyber-badge-purple" style={{ fontSize: '0.75rem' }}>
          <Zap size={13} />
          LSTM / Neural Time-Series Active
        </div>
      </div>

      {/* KPI callout row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: '#94a3b8' }}>PROJECTED PEAK WINDOW</div>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#a855f7' }}>
            {peakItem?.hour || '21:00'} - 22:30
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Headline Event & Finale Surge</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: '#94a3b8' }}>ESTIMATED PEAK ATTENDANCE</div>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
            {peakItem?.projectedCount.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#f87171' }}>({peakItem?.occupancyPct}%)</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Capacity Threshold: {venueCapacity.toLocaleString()}</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: '#94a3b8' }}>PRE-EMPTIVE ACTION</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fbbf24' }}>
            Activate West Relief Gate 45m Prior
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Prevents Stage Floor Choke Wave</div>
        </div>
      </div>

      {/* SVG Forecast Chart */}
      <div style={{ width: '100%', overflowX: 'auto', background: '#070d1a', borderRadius: '10px', padding: '0.5rem', border: '1px solid #1e293b' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Y Axis Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
            const y = padding.top + graphH * (1 - ratio);
            const val = Math.round(maxY * ratio);
            return (
              <g key={i}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#1e293b" strokeDasharray="3,3" />
                <text x={padding.left - 8} y={y + 4} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="'JetBrains Mono', monospace">
                  {val.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Danger threshold line (90% capacity) */}
          <line
            x1={padding.left}
            y1={dangerY}
            x2={width - padding.right}
            y2={dangerY}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="5,5"
          />
          <text x={width - padding.right - 5} y={dangerY - 6} fill="#ef4444" fontSize="9" textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
            ⚠️ 90% STAMPEDE CRITICAL LIMIT
          </text>

          {/* Area fill under projected curve */}
          <polygon
            points={`${padding.left},${padding.top + graphH} ${polylineStr} ${points[points.length - 1].x},${padding.top + graphH}`}
            fill="url(#forecastGradient)"
          />

          {/* Forecast Polyline */}
          <polyline
            points={polylineStr}
            fill="none"
            stroke="#a855f7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Nodes */}
          {points.map((p, i) => {
            const isDanger = p.isChokeHazard;
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isDanger ? 6 : 4}
                  fill={isDanger ? '#ef4444' : '#a855f7'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={p.x}
                  y={height - 12}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {p.hour}
                </text>
                <text
                  x={p.x}
                  y={p.y - 10}
                  fill={isDanger ? '#f87171' : '#c084fc'}
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="bold"
                >
                  {p.occupancyPct}%
                </text>
              </g>
            );
          })}

          <defs>
            <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
