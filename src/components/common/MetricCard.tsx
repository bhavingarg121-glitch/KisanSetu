import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: LucideIcon;
  statusColor?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'slate';
  pulse?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  trend,
  trendValue,
  icon: Icon,
  statusColor = 'cyan',
  pulse = false,
}) => {
  const iconBgMap = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border border-rose-500/40',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 backdrop-blur-md transition-all duration-300 hover:border-slate-600 bg-slate-900/80 border-slate-800 ${
        pulse ? 'ring-1 ring-rose-500/50 animate-pulse' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className={`rounded-lg p-2 ${iconBgMap[statusColor]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-slate-400 font-mono">
            {subValue}
          </span>
        )}
      </div>

      {trendValue && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-mono">
          {trend === 'up' && (
            <span className="text-rose-400 flex items-center">? {trendValue}</span>
          )}
          {trend === 'down' && (
            <span className="text-emerald-400 flex items-center">? {trendValue}</span>
          )}
          {trend === 'neutral' && (
            <span className="text-slate-400">? {trendValue}</span>
          )}
          <span className="text-slate-500 text-[11px]">vs baseline</span>
        </div>
      )}
    </div>
  );
};
