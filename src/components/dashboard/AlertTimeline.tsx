import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { AlertTriangle, CheckCircle, ShieldAlert, Zap, ArrowDownCircle, CheckCircle2 } from 'lucide-react';

export const AlertTimeline: React.FC = () => {
  const { alerts, acknowledgeAlert } = useSimulation();

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />,
          dot: 'bg-rose-500',
        };
      case 'HIGH':
        return {
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          icon: <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />,
          dot: 'bg-orange-500',
        };
      case 'WARNING':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />,
          dot: 'bg-amber-500',
        };
      case 'ACTION':
        return {
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: <Zap className="h-3.5 w-3.5 text-cyan-400" />,
          dot: 'bg-cyan-400',
        };
      case 'RECOVERY':
        return {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: <ArrowDownCircle className="h-3.5 w-3.5 text-blue-400" />,
          dot: 'bg-blue-400',
        };
      case 'RESOLVED':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
          dot: 'bg-emerald-400',
        };
      default:
        return {
          badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          icon: <CheckCircle className="h-3.5 w-3.5 text-slate-400" />,
          dot: 'bg-slate-400',
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl flex flex-col h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Live Incident & Alert Timeline
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {alerts.length} events recorded
        </span>
      </div>

      {/* Timeline Scroll List */}
      <div className="flex-1 overflow-y-auto pr-1 mt-3 space-y-3">
        {alerts.map((alert) => {
          const style = getSeverityStyle(alert.severity);
          return (
            <div
              key={alert.id}
              className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {alert.timeFormatted}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold uppercase flex items-center gap-1 ${style.badge}`}>
                    {style.icon}
                    {alert.severity}
                  </span>
                  <span className="text-xs font-mono text-white font-semibold">
                    {alert.title}
                  </span>
                </div>

                {alert.status === 'ACTIVE' ? (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    ACK
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {alert.status}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 font-mono mt-1.5 leading-relaxed">
                {alert.description}
              </p>

              {alert.actionTaken && (
                <div className="mt-1.5 text-[11px] text-cyan-400/90 font-mono bg-slate-950/50 px-2 py-1 rounded border border-slate-800/60">
                  <span className="text-slate-500">Action: </span>
                  {alert.actionTaken}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
