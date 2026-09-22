import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Shield, 
  Share2, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Zap,
  Activity
} from 'lucide-react';

export const ZoneDetailsDrawer: React.FC = () => {
  const { 
    selectedZone, 
    dispatchSecurityTeam, 
    redirectCrowd, 
    securityTeams, 
    stage 
  } = useSimulation();

  if (!selectedZone) return null;

  const team04 = securityTeams.find(t => t.id === 'team-04');
  const isTeam04Moving = team04?.status === 'MOVING';
  const isTeam04Arrived = team04?.status === 'ARRIVED';

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base font-mono tracking-wide text-white uppercase">
                {selectedZone.name}
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Category: {selectedZone.category} | Zone ID: {selectedZone.id}
            </p>
          </div>
          <RiskBadge level={selectedZone.riskLevel} size="md" />
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Current People</span>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {selectedZone.currentPeople.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Cap: {selectedZone.maxCapacity.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Occupancy</span>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {selectedZone.density}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedZone.density >= 85
                    ? 'bg-rose-500'
                    : selectedZone.density >= 70
                    ? 'bg-orange-500'
                    : selectedZone.density >= 50
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, selectedZone.density)}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Inflow Rate</span>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
              {selectedZone.inflow} / min
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Turnstile Inflow</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Outflow Rate</span>
            <div className="text-sm font-bold font-mono text-cyan-400 mt-0.5">
              {selectedZone.outflow} / min
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Exit Throughput</span>
          </div>
        </div>

        {/* Movement Vector & Trend */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs font-mono mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Movement Vector:</span>
            <span className="text-slate-200 font-semibold">{selectedZone.flowDirection}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Density Trend (3m):</span>
            <span className={`font-semibold ${selectedZone.densityTrend > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {selectedZone.densityTrend > 0 ? `? +${selectedZone.densityTrend}%` : `? ${selectedZone.densityTrend}%`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Flow Balance Ratio:</span>
            <span className="text-slate-200 font-semibold">
              {(selectedZone.inflow / Math.max(1, selectedZone.outflow)).toFixed(2)}x
            </span>
          </div>
        </div>

        {/* AI Predictive Insight Box */}
        <div className={`p-3.5 rounded-xl border mb-4 ${
          selectedZone.riskLevel === 'CRITICAL'
            ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
            : selectedZone.riskLevel === 'HIGH'
            ? 'bg-orange-950/20 border-orange-500/30 text-orange-200'
            : 'bg-slate-900/80 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              AI Forecast & Early Warning
            </span>
          </div>
          <p className="text-xs font-mono leading-relaxed">
            {selectedZone.predictionText || 'Nominal flow. No congestion events forecasted.'}
          </p>
        </div>

        {/* Recommended Intervention List */}
        <div className="mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">
            Recommended Interventions:
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300 font-mono bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">�</span>
              <span>Redirect incoming visitors to Gate C (West Plaza)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">�</span>
              <span>Deploy Security Team 04 (Rapid Response Squad)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">�</span>
              <span>Pace turnstiles to reduce inflow by 40%</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">�</span>
              <span>Broadcast dynamic digital wayfinding banner</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Decision-Support Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="grid grid-cols-2 gap-2">
          {/* DISPATCH TEAM */}
          <button
            onClick={() => dispatchSecurityTeam('team-04', selectedZone.id)}
            disabled={isTeam04Moving || isTeam04Arrived}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
              isTeam04Arrived
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                : isTeam04Moving
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 animate-pulse'
                : 'bg-cyan-600 hover:bg-cyan-500 border border-cyan-400 text-slate-950 shadow-md shadow-cyan-600/20 active:scale-95'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>
              {isTeam04Arrived
                ? 'TEAM ARRIVED'
                : isTeam04Moving
                ? `DISPATCHED (${team04?.etaSeconds}s)`
                : 'DISPATCH TEAM'}
            </span>
          </button>

          {/* REDIRECT CROWD */}
          <button
            onClick={() => redirectCrowd(selectedZone.id, 'gate-c')}
            disabled={stage === 'INTERVENTION' || stage === 'RECOVERY' || stage === 'SAFE'}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
              stage === 'SAFE' || stage === 'RECOVERY'
                ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:brightness-110 border border-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{stage === 'SAFE' ? 'STABILIZED' : 'REDIRECT CROWD'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
