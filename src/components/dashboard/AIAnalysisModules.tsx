import React from 'react';
import { Cpu, Check, Activity, Radar, Eye, ShieldCheck, Zap } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const AIAnalysisModules: React.FC = () => {
  const { stage } = useSimulation();

  const modules = [
    { name: 'Person Detection (YOLOv8s)', status: 'Active', latency: '14ms', icon: Eye },
    { name: 'Person Tracking (ByteTrack)', status: 'Active', latency: '8ms', icon: Activity },
    { name: 'Density Analysis (Spatial Grid)', status: 'Active', latency: '6ms', icon: Radar },
    { name: 'Movement Vector Analysis', status: 'Active', latency: '11ms', icon: Activity },
    { name: 'Bottleneck Detection Engine', status: 'Active', latency: '12ms', icon: ShieldCheck },
    { name: 'Dynamic Risk Assessment', status: 'Active', latency: '5ms', icon: Zap },
    { name: 'Congestion Prediction (LSTM)', status: 'Active', latency: '18ms', icon: Cpu },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              AI Crowd Analysis Pipeline
            </span>
            <p className="text-[11px] text-slate-400 font-mono">
              Real-time inference pipeline status � 7 Subsystems Active
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          INFERENCE ENGINE 60 FPS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 my-3.5">
        {modules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded bg-slate-800 text-cyan-400">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-semibold text-slate-200 block truncate max-w-[150px]">
                    {m.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Latency: {m.latency}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-medium">
                <Check className="h-3.5 w-3.5" />
                <span>Active</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
