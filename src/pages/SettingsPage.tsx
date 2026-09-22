import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Settings, Save, Sliders, Volume2, ShieldCheck, Gauge, Layers } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSimulation();

  const [formData, setFormData] = useState({
    eventName: settings.eventName,
    venueCapacity: settings.venueCapacity,
    totalGates: settings.totalGates,
    activeSecurityTeams: settings.activeSecurityTeams,
    criticalDensityThreshold: settings.criticalDensityThreshold,
    warningDensityThreshold: settings.warningDensityThreshold,
    simulationSpeed: settings.simulationSpeed,
    soundAlertsEnabled: settings.soundAlertsEnabled,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-white">
              Event Configuration & AI Safety Thresholds
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Configure venue capacity ceilings, early warning sensitivities, and simulation pacer parameters
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Venue & Event Info */}
        <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              General Venue & Operation Parameters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Event Name / Title</label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Venue Maximum Capacity (Pax)</label>
              <input
                type="number"
                value={formData.venueCapacity}
                onChange={(e) => setFormData({ ...formData, venueCapacity: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Active Gates Configured</label>
              <input
                type="number"
                value={formData.totalGates}
                onChange={(e) => setFormData({ ...formData, totalGates: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Active Security Squads</label>
              <input
                type="number"
                value={formData.activeSecurityTeams}
                onChange={(e) => setFormData({ ...formData, activeSecurityTeams: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AI Sensitivity Thresholds */}
        <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <Sliders className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              AI Risk & Anomaly Trigger Thresholds
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                Warning Density Threshold: <span className="text-amber-400 font-bold">{formData.warningDensityThreshold}%</span>
              </label>
              <input
                type="range"
                min="40"
                max="80"
                value={formData.warningDensityThreshold}
                onChange={(e) => setFormData({ ...formData, warningDensityThreshold: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono">Triggers yellow watch state and inflow queue monitoring.</span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                Critical Danger Threshold: <span className="text-rose-400 font-bold">{formData.criticalDensityThreshold}%</span>
              </label>
              <input
                type="range"
                min="75"
                max="98"
                value={formData.criticalDensityThreshold}
                onChange={(e) => setFormData({ ...formData, criticalDensityThreshold: Number(e.target.value) })}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono">Triggers high-priority early warning, AI recommendation, and auto-dispatch prompts.</span>
            </div>
          </div>
        </div>

        {/* Section 3: Simulation & Audio Pacer */}
        <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <Gauge className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Simulation Playback & Audio Synthesizer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Simulation Pacing Speed</label>
              <div className="flex items-center gap-2">
                {[1, 2, 5].map((speed) => (
                  <button
                    type="button"
                    key={speed}
                    onClick={() => setFormData({ ...formData, simulationSpeed: speed })}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-colors ${
                      formData.simulationSpeed === speed
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {speed}x Realtime
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Sound Synthesizer Alerts</label>
              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.soundAlertsEnabled}
                  onChange={(e) => setFormData({ ...formData, soundAlertsEnabled: e.target.checked })}
                  className="accent-cyan-500 h-4 w-4"
                />
                <span className="text-xs font-mono text-slate-300">
                  Enable Web Audio chime for alarms & dispatches
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </form>
    </div>
  );
};
