import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Bot, CheckCircle2, XCircle, ArrowRight, Shield, Share2, Sparkles } from 'lucide-react';

export const AIRecommendationBanner: React.FC = () => {
  const { 
    stage, 
    recommendationApproved, 
    recommendationDismissed, 
    approveRecommendation, 
    dismissRecommendation,
    selectedZone 
  } = useSimulation();

  if (stage === 'NORMAL' || stage === 'SAFE') {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-300">
              System State: Stable Flow
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              All venue gates operating within normal capacity limits. No intervention required.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold uppercase">
          Autonomous Safety Guard Active
        </span>
      </div>
    );
  }

  if (recommendationDismissed) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-slate-500" />
          <span className="text-xs font-mono text-slate-400">
            AI Recommendation dismissed by operator override. Manual monitoring active.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-[#09152b] to-[#0b1b36] p-5 shadow-2xl relative overflow-hidden animate-alert-border">
      {/* Background Accent */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Info & Actions */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shrink-0 mt-0.5">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
                AI RECOMMENDATION & PROACTIVE DECISION SUPPORT
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40 uppercase">
                {selectedZone?.shortName || 'Gate B'} Congestion Risk
              </span>
            </div>

            <p className="text-xs text-slate-300 font-mono mt-1">
              High density accumulation forecasted in ~4 minutes. Proposed automated stabilization plan:
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-cyan-300 flex items-center gap-1.5">
                <Share2 className="h-3 w-3" />
                Redirect incoming visitors ? Gate C (West Plaza)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-cyan-300 flex items-center gap-1.5">
                <Shield className="h-3 w-3" />
                Deploy Security Team 04 (Rapid Response)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-slate-300">
                Pace turnstile entry flow by -40%
              </span>
            </div>
          </div>
        </div>

        {/* Right Decision Buttons */}
        <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
          <button
            onClick={dismissRecommendation}
            className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            DISMISS
          </button>

          <button
            onClick={approveRecommendation}
            disabled={recommendationApproved}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
              recommendationApproved
                ? 'bg-emerald-600 text-white border border-emerald-400'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border border-cyan-300 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 active:scale-95'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{recommendationApproved ? 'ACTIONS APPROVED & ACTIVE' : 'APPROVE & EXECUTE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
