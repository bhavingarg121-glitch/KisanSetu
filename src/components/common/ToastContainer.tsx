import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useSimulation();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          info: <Info className="h-4 w-4 text-cyan-400 shrink-0" />,
          warning: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,
          error: <XCircle className="h-4 w-4 text-rose-400 shrink-0" />,
          success: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
        };

        const borderColors = {
          info: 'border-cyan-500/30 bg-slate-900/95 text-slate-200',
          warning: 'border-amber-500/40 bg-amber-950/90 text-amber-100',
          error: 'border-rose-500/50 bg-rose-950/90 text-rose-100 animate-bounce',
          success: 'border-emerald-500/40 bg-slate-900/95 text-emerald-100',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-xl transition-all duration-300 ${
              borderColors[toast.type]
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">{icons[toast.type]}</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider font-mono">
                  {toast.title}
                </p>
                <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                  {toast.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
