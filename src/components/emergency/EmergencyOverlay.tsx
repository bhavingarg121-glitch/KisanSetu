import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  Volume2, 
  Radio, 
  PhoneCall, 
  Navigation, 
  HeartHandshake,
  CheckCircle2,
  Users
} from 'lucide-react';

export const EmergencyOverlay: React.FC = () => {
  const { emergencyMode, toggleEmergencyMode, zones, securityTeams, totalPeople } = useSimulation();
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [medicalDispatched, setMedicalDispatched] = useState(false);

  if (!emergencyMode) return null;

  const criticalZones = zones.filter(z => z.riskLevel === 'CRITICAL' || z.riskLevel === 'HIGH');
  const safeExits = zones.filter(z => z.category === 'EXIT' || (z.category === 'GATE' && z.riskLevel === 'SAFE'));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border-2 border-rose-500 bg-[#0c0507] p-6 shadow-2xl shadow-rose-950/80 animate-alert-border text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-rose-500/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white animate-pulse">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-mono tracking-wider text-rose-300 uppercase">
                  ?? EMERGENCY MODE ACTIVE
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-600/30 border border-rose-500 text-rose-200">
                  CODE RED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Priority venue evacuation & rapid incident response orchestration
              </p>
            </div>
          </div>

          <button
            onClick={toggleEmergencyMode}
            className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900 border border-rose-500/40 text-rose-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Emergency Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          {/* Critical Hazard Zones */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase mb-3">
              <AlertTriangle className="h-4 w-4" />
              <span>Critical Risk Zones ({criticalZones.length})</span>
            </div>
            <div className="space-y-2">
              {criticalZones.map(z => (
                <div key={z.id} className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/40 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="font-bold text-rose-200 block">{z.name}</span>
                    <span className="text-[11px] text-rose-300/80">Occupancy: {z.density}% ({z.currentPeople} pax)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                    EVACUATE
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Safe Evacuation Exits */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-3">
              <Navigation className="h-4 w-4" />
              <span>Recommended Safe Evac Exits ({safeExits.length})</span>
            </div>
            <div className="space-y-2">
              {safeExits.map(z => (
                <div key={z.id} className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="font-bold text-emerald-200 block">{z.name}</span>
                    <span className="text-[11px] text-emerald-300/80">Available Buffer: {z.maxCapacity - z.currentPeople} pax</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                    CLEAR ROUTE
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Medical Dispatch Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
                Security Squad Mobilization
              </span>
              <span className="text-xs font-mono text-cyan-400 mt-0.5 block">
                {securityTeams.length} Squads on perimeter protocol
              </span>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              DEPLOYED
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
                Medical & Triage Readiness
              </span>
              <span className="text-xs font-mono text-emerald-400 mt-0.5 block">
                Station Alpha Paramedics on Standby
              </span>
            </div>
            <button
              onClick={() => setMedicalDispatched(true)}
              className="text-xs font-mono px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
            >
              {medicalDispatched ? 'DISPATCHED' : 'DISPATCH MED'}
            </button>
          </div>
        </div>

        {/* Public Warning Broadcast Controller */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase text-slate-200 font-bold flex items-center gap-1.5">
              <Radio className="h-4 w-4 text-rose-400" />
              Public Evacuation Wayfinding Broadcast
            </span>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Push mass audio PA sirens and digital exit arrows to all venue attendee screens.
            </p>
          </div>

          <button
            onClick={() => setBroadcastSent(true)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-colors shrink-0 ${
              broadcastSent
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {broadcastSent ? '? BROADCAST BROADCASTING' : 'TRIGGER MASS BROADCAST'}
          </button>
        </div>

        {/* Decision Support Disclaimer */}
        <div className="mt-4 pt-3 border-t border-rose-950/80 text-[10px] font-mono text-slate-500 text-center">
          * Prototype decision-support interface. Does not transmit to external 911/emergency physical radio networks.
        </div>
      </div>
    </div>
  );
};
