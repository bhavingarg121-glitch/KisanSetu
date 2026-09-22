import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { VenueMapCanvas } from '../components/dashboard/VenueMapCanvas';
import { ZoneDetailsDrawer } from '../components/dashboard/ZoneDetailsDrawer';
import { RiskBadge } from '../components/common/RiskBadge';
import { Map, Layers, Navigation, Shield, AlertTriangle } from 'lucide-react';

export const VenueMapPage: React.FC = () => {
  const { zones, selectedZoneId, selectZone } = useSimulation();

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-white">
              Venue Spatial & Evacuation Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Full-scale vector blueprint with dynamic crowd density and emergency evacuation corridors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Vector Map (7 Cols) */}
        <div className="xl:col-span-7 space-y-4">
          <VenueMapCanvas />
        </div>

        {/* Zone Details Drawer (5 Cols) */}
        <div className="xl:col-span-5 space-y-4">
          <ZoneDetailsDrawer />
        </div>
      </div>

      {/* Zone Overview Grid List */}
      <div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          All Monitored Venue Sectors ({zones.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {zones.map((zone) => (
            <div
              key={zone.id}
              onClick={() => selectZone(zone.id)}
              className={`p-4 rounded-xl border bg-slate-900/70 cursor-pointer transition-all duration-200 hover:border-slate-600 ${
                selectedZoneId === zone.id ? 'border-cyan-500/60 ring-1 ring-cyan-500/30' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white">{zone.name}</span>
                <RiskBadge level={zone.riskLevel} size="sm" />
              </div>

              <div className="mt-3 flex items-baseline justify-between text-xs font-mono">
                <span className="text-slate-400">People: {zone.currentPeople.toLocaleString()} / {zone.maxCapacity.toLocaleString()}</span>
                <span className="text-cyan-400 font-bold">{zone.density}%</span>
              </div>

              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    zone.density >= 85 ? 'bg-rose-500' : zone.density >= 70 ? 'bg-orange-500' : zone.density >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, zone.density)}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>In: {zone.inflow}/m</span>
                <span>Out: {zone.outflow}/m</span>
                <span className={zone.densityTrend > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                  {zone.densityTrend > 0 ? `+${zone.densityTrend}%` : `${zone.densityTrend}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
