import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { EarlyWarningCard } from '../components/dashboard/EarlyWarningCard';
import { RiskEngineBreakdown } from '../components/dashboard/RiskEngineBreakdown';
import { RiskBadge } from '../components/common/RiskBadge';
import { TrendingUp, AlertTriangle, Zap, Cpu, Sparkles, Compass } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const PredictionsPage: React.FC = () => {
  const { zones, selectedZone, selectZone, stage } = useSimulation();

  const multiZoneForecast = [
    { time: 'T-0 (Now)', 'Gate A': 42, 'Gate B': selectedZone?.id === 'gate-b' ? selectedZone.density : 68, 'Gate C': 28, 'Main Stage': 74 },
    { time: '+2 Min', 'Gate A': 44, 'Gate B': Math.min(100, Math.round((selectedZone?.density || 68) * 1.06)), 'Gate C': 30, 'Main Stage': 76 },
    { time: '+4 Min', 'Gate A': 45, 'Gate B': Math.min(105, Math.round((selectedZone?.density || 68) * 1.12)), 'Gate C': 32, 'Main Stage': 78 },
    { time: '+6 Min', 'Gate A': 46, 'Gate B': Math.min(115, Math.round((selectedZone?.density || 68) * 1.18)), 'Gate C': 33, 'Main Stage': 80 },
    { time: '+8 Min', 'Gate A': 48, 'Gate B': Math.min(120, Math.round((selectedZone?.density || 68) * 1.22)), 'Gate C': 35, 'Main Stage': 82 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-white">
              AI Predictive Congestion & Surge Forecasting
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            LSTM Neural Sequence Models � Pre-empting Crowd Hazard Events 4�8 Minutes Before Emergence
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          Prototype Simulated Forecast Models
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Multi-zone Surge Projection Line Chart (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Multi-Sector 8-Minute Congestion Trajectory
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Confidence: 94.2%
              </span>
            </div>

            <div className="h-72 w-full my-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={multiZoneForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 120]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d18',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <Line type="monotone" dataKey="Gate B" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Main Stage" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Gate A" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Gate C" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs font-mono pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-300">Gate B (Surge Spike)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span className="text-slate-300">Main Stage (Plateau)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Gate A (Safe)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                <span className="text-slate-300">Gate C (Nominal)</span>
              </div>
            </div>
          </div>

          {/* Zone Prediction Diagnostic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.slice(0, 4).map((z) => (
              <div
                key={z.id}
                onClick={() => selectZone(z.id)}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">{z.name}</span>
                  <RiskBadge level={z.riskLevel} size="sm" />
                </div>
                <div className="mt-2 text-xs font-mono text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">Current Occupancy:</span>
                    <span className="font-bold text-white">{z.density}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">+4 Min Prediction:</span>
                    <span className="font-bold text-amber-400">{z.predictedDensityIn4Min || z.density}%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Hazard Window:</span>
                    <span className="font-bold text-cyan-400">~04:00 mins</span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  Reason: {z.predictionText}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Early Warning & Transparent Risk Math (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          <EarlyWarningCard />
          <RiskEngineBreakdown />
        </div>
      </div>
    </div>
  );
};
