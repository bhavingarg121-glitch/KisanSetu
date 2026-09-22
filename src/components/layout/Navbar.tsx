import React from 'react';
import { 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Clock, 
  Radio, 
  Calendar,
  Layers
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const Navbar: React.FC = () => {
  const { 
    settings, 
    stage, 
    emergencyMode, 
    isSimulating, 
    soundEnabled, 
    currentTime,
    startSurgeSimulation, 
    toggleEmergencyMode, 
    toggleSound, 
    resetSimulation 
  } = useSimulation();

  return (
    <header className="h-16 border-b border-slate-800 bg-[#090e1a]/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Event & Title Context */}
      <div className="flex items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono tracking-wide text-white">
              CrowdGuard AI
            </span>
            <span className="text-xs text-slate-500 font-mono">|</span>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline-block">
              AI Crowd Safety Command Center
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-cyan-400" />
              <span className="text-slate-200">{settings.eventName}</span>
            </span>
            <span>�</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE TELEMETRY
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions and Controls */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-300">
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          <span>{currentTime}</span>
          <span className="text-slate-500 text-[10px]">UTC+5:30</span>
        </div>

        {/* Audio Alert Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute audio alerts' : 'Enable audio alerts'}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled 
              ? 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20 hover:bg-cyan-900/30' 
              : 'border-slate-800 text-slate-500 bg-slate-900/50 hover:bg-slate-800'
          }`}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        {/* Reset State Button */}
        <button
          onClick={resetSimulation}
          title="Reset Simulation State"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* SIMULATE CROWD SURGE (Highlighted Main Trigger) */}
        <button
          onClick={startSurgeSimulation}
          disabled={isSimulating || (stage !== 'NORMAL' && stage !== 'SAFE')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold tracking-wider transition-all duration-300 ${
            stage === 'NORMAL' || stage === 'SAFE'
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 border-amber-400 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 active:scale-95'
              : 'bg-slate-800/80 border-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Play className={`h-3.5 w-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'SIMULATING...' : 'SIMULATE CROWD SURGE'}</span>
        </button>

        {/* EMERGENCY MODE TOGGLE */}
        <button
          onClick={toggleEmergencyMode}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold tracking-wider transition-all duration-300 ${
            emergencyMode
              ? 'bg-rose-600 border-rose-400 text-white animate-pulse shadow-lg shadow-rose-600/40'
              : 'border-rose-500/40 bg-rose-950/20 text-rose-400 hover:bg-rose-900/30'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>{emergencyMode ? 'EMERGENCY ACTIVE' : 'EMERGENCY MODE'}</span>
        </button>
      </div>
    </header>
  );
};
