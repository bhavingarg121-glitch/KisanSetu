import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Map, 
  AlertOctagon, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck, 
  Settings, 
  ShieldAlert,
  Cpu,
  Radio,
  BellRing
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface SidebarProps {
  currentPage: string;
  onSelectPage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onSelectPage }) => {
  const { activeAlertsCount, stage, emergencyMode } = useSimulation();

  const navItems = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'live-cameras', label: 'Live Cameras', icon: Video },
    { id: 'venue-map', label: 'Venue Map', icon: Map },
    { 
      id: 'alerts', 
      label: 'Alerts & Incidents', 
      icon: AlertOctagon, 
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'security-teams', label: 'Security Teams', icon: ShieldCheck },
    { id: 'settings', label: 'Event Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#090e1a] border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 select-none z-30">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${emergencyMode ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm tracking-wider font-mono text-white">
                  CROWDGUARD AI
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 tracking-wider uppercase font-semibold">
                  LIVE SYSTEM
                </span>
                {stage !== 'NORMAL' && stage !== 'SAFE' && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 uppercase">
                    {stage}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium font-mono transition-all duration-200 group ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Section */}
      <div className="p-4 border-t border-slate-800/80 bg-[#070b14]/60">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2.5 flex items-center gap-1.5">
          <Radio className="h-3 w-3 text-cyan-400" />
          System Status
        </div>
        <div className="space-y-2 text-[11px] font-mono">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              AI Engine
            </span>
            <span className="text-emerald-400">Online</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Camera Network
            </span>
            <span className="text-emerald-400">4 / 4 Live</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Alert System
            </span>
            <span className="text-emerald-400">Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
