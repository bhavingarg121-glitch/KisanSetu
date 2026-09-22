import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  level, 
  className = '', 
  showDot = true,
  size = 'md' 
}) => {
  const getStyles = () => {
    switch (level) {
      case 'SAFE':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          label: 'SAFE',
        };
      case 'WATCH':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400',
          label: 'WATCH',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          dot: 'bg-orange-400',
          label: 'HIGH RISK',
        };
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse',
          dot: 'bg-rose-500',
          label: 'CRITICAL',
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
          dot: 'bg-slate-400',
          label: 'NORMAL',
        };
    }
  };

  const config = getStyles();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-mono font-medium',
    md: 'px-2.5 py-1 text-xs font-mono font-semibold tracking-wider',
    lg: 'px-3.5 py-1.5 text-sm font-mono font-bold tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border backdrop-blur-sm ${config.bg} ${sizeClasses[size]} ${className}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot} ${level === 'CRITICAL' ? 'animate-ping' : ''}`} />
      )}
      {config.label}
    </span>
  );
};
