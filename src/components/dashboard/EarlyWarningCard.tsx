import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const EarlyWarningCard: React.FC = () => {
  const { selectedZone, stage } = useSimulation();

  const zone = selectedZone || {
    name: 'Gate B (Main East Concourse)',
    shortName: 'Gate B',
    density: 91,
    predictedDensityIn4Min: 101,
  };

  const currentD = zone.density;
  const pred2m = Math.min(105, Math.round(currentD * 1.05));
  const pred4m = Math.min(115, Math.round(currentD * 1.11));
  const pred6m = Math.min(125, Math.round(currentD * 1.18));

  const chartData = [
    { time: '-4m', density: Math.max(30, currentD - 28) },
    { time: '-2m', density: Math.max(40, currentD - 14) },
    { time: 'NOW', density: currentD },
    { time: '+2m (Est)', density: pred2m, isProjected: true },
    { time: '+4m (Est)', density: pred4m, isProjected: true },
    { time: '+6m (Est)', density: pred6m, isProjected: true },
  ];

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-[#0c1220] p-5 shadow-xl relative overflow-hidden">
      {/* Background Warning Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              ? EARLY WARNING SYSTEM
            </span>
            <p className="text-[11px] text-slate-400 font-mono">
              Target: {zone.shortName} � Real-time Predictive Modeling
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold uppercase animate-pulse">
          HIGH CONGESTION RISK
        </span>
      </div>

      {/* Projection Comparison Columns */}
      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Current (NOW)</span>
          <div className="text-xl font-bold font-mono text-white mt-0.5">
            {currentD}%
          </div>
          <span className="text-[10px] text-amber-400 font-mono">Active telemetry</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">+2 Min Forecast</span>
          <div className="text-xl font-bold font-mono text-orange-400 mt-0.5">
            {pred2m}%
          </div>
          <span className="text-[10px] text-orange-400 font-mono">? Rapid accumulation</span>
        </div>

        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40">
          <span className="text-[10px] font-mono uppercase text-rose-300">+4 Min Bottleneck</span>
          <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">
            {pred4m}%
          </div>
          <span className="text-[10px] text-rose-400 font-mono">? Threshold Breach</span>
        </div>
      </div>

      {/* Recharts Area Chart for Trend */}
      <div className="h-32 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="warningGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
            <YAxis domain={[0, 120]} stroke="#64748b" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d18',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            />
            <Area
              type="monotone"
              dataKey="density"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#warningGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Assessment */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
        <p className="flex items-start gap-1.5">
          <span className="text-amber-400 font-bold">�</span>
          <span>
            Rapid inflow combined with reduced outflow indicates a potential congestion event within ~4 minutes.
          </span>
        </p>
      </div>

      {/* Prototype Simulated Data Disclaimer */}
      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
        <span className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          Model Confidence: 94.2% (LSTM Ensemble)
        </span>
        <span className="uppercase text-amber-500/80 font-semibold">
          [Simulated Hackathon Prototype Data]
        </span>
      </div>
    </div>
  );
};
