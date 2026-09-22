import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { RiskBadge } from '../common/RiskBadge';
import { Gauge, Calculator, Info } from 'lucide-react';

export const RiskEngineBreakdown: React.FC = () => {
  const { selectedZone, riskBreakdown } = useSimulation();

  const factors = [
    {
      name: 'Crowd Density',
      weight: riskBreakdown.crowdDensityWeight,
      rawScore: riskBreakdown.crowdDensityScore,
      contribution: ((riskBreakdown.crowdDensityScore * riskBreakdown.crowdDensityWeight) / 100).toFixed(1),
      desc: 'Base occupant saturation',
    },
    {
      name: 'Density Growth Rate',
      weight: riskBreakdown.densityGrowthWeight,
      rawScore: riskBreakdown.densityGrowthScore,
      contribution: ((riskBreakdown.densityGrowthScore * riskBreakdown.densityGrowthWeight) / 100).toFixed(1),
      desc: '3-minute acceleration slope',
    },
    {
      name: 'Flow Imbalance',
      weight: riskBreakdown.flowImbalanceWeight,
      rawScore: riskBreakdown.flowImbalanceScore,
      contribution: ((riskBreakdown.flowImbalanceScore * riskBreakdown.flowImbalanceWeight) / 100).toFixed(1),
      desc: 'Inflow vs outflow delta',
    },
    {
      name: 'Movement Pattern',
      weight: riskBreakdown.movementPatternWeight,
      rawScore: riskBreakdown.movementPatternScore,
      contribution: ((riskBreakdown.movementPatternScore * riskBreakdown.movementPatternWeight) / 100).toFixed(1),
      desc: 'Vector converging choke vectors',
    },
    {
      name: 'Zone Capacity Margin',
      weight: riskBreakdown.zoneCapacityWeight,
      rawScore: riskBreakdown.zoneCapacityScore,
      contribution: ((riskBreakdown.zoneCapacityScore * riskBreakdown.zoneCapacityWeight) / 100).toFixed(1),
      desc: 'Proximity to absolute maximum ceiling',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Risk Engine Mathematical Breakdown
            </span>
            <p className="text-[11px] text-slate-400 font-mono">
              Transparent multi-factor scoring model for {selectedZone?.shortName || 'Zone'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xl font-bold font-mono text-white">
              {riskBreakdown.totalScore}
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </div>
          </div>
          <RiskBadge level={riskBreakdown.riskLevel} size="md" />
        </div>
      </div>

      {/* Factor Bars */}
      <div className="space-y-3.5 my-4">
        {factors.map((f, i) => (
          <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">{f.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  Weight: {f.weight}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Score: {f.rawScore}/100</span>
                <span className="font-bold text-cyan-400">+{f.contribution} pts</span>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${f.rawScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              {f.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Formula & Explanatory Footer */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
          <Info className="h-3.5 w-3.5 text-cyan-400" />
          <span>Transparent Formulation:</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
          Total Risk = (0.35 � Density) + (0.25 � Growth) + (0.20 � Flow Imbalance) + (0.10 � Movement) + (0.10 � Capacity) = <strong className="text-cyan-300">{riskBreakdown.totalScore}/100</strong>
        </p>
      </div>
    </div>
  );
};
