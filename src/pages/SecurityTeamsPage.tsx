import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ShieldCheck, Shield, Radio, Navigation, Clock, UserCheck, Send, CheckCircle2 } from 'lucide-react';

export const SecurityTeamsPage: React.FC = () => {
  const { securityTeams, dispatchSecurityTeam, zones } = useSimulation();
  const [selectedTeam, setSelectedTeam] = useState<string>('team-04');
  const [targetZone, setTargetZone] = useState<string>('gate-b');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ACTIVE':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'MOVING':
      case 'DISPATCHED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
      case 'ARRIVED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-white">
              Tactical Security Squad Dispatch & Tracking
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Rapid response unit positioning, real-time GPS telemetry, and perimeter enforcement
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-semibold flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-400" />
          4 Squads Online & Encrypted Comms
        </span>
      </div>

      {/* Security Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityTeams.map((team) => (
          <div
            key={team.id}
            onClick={() => setSelectedTeam(team.id)}
            className={`p-5 rounded-2xl border bg-[#090e1a] shadow-xl cursor-pointer transition-all duration-200 ${
              selectedTeam === team.id
                ? 'border-cyan-500/60 ring-1 ring-cyan-500/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono text-white">{team.name}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Leader: {team.leader}</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase ${getStatusBadge(team.status)}`}>
                {team.status === 'MOVING' ? 'EN ROUTE' : team.status}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs font-mono border-t border-slate-800/80 pt-3">
              <div className="flex justify-between text-slate-400">
                <span>Assigned Sector:</span>
                <span className="text-slate-200 font-semibold">{team.assignedZone}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Squad Strength:</span>
                <span className="text-slate-200 font-semibold">{team.membersCount} Officers</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Distance:</span>
                <span className="text-cyan-400 font-bold">{team.distanceMeters}m</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ETA:</span>
                <span className={`font-bold ${team.etaSeconds > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {team.etaSeconds > 0 ? `00:${String(team.etaSeconds).padStart(2, '0')}` : 'ON SITE'}
                </span>
              </div>
            </div>

            {/* Quick Dispatch Button on Team Card */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatchSecurityTeam(team.id, 'gate-b');
                }}
                disabled={team.status === 'MOVING' || team.status === 'ARRIVED'}
                className={`w-full py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-colors ${
                  team.status === 'ARRIVED'
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 cursor-default'
                    : team.status === 'MOVING'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-md shadow-cyan-600/20'
                }`}
              >
                {team.status === 'ARRIVED'
                  ? 'ARRIVED ON SITE'
                  : team.status === 'MOVING'
                  ? `MOVING (${team.etaSeconds}s)`
                  : 'DISPATCH TO GATE B'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Dispatch Terminal */}
      <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Send className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Manual Squad Dispatch & Radio Waypoint Control
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Select Security Squad</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {securityTeams.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.status})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Target Venue Sector</label>
            <select
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {zones.map(z => (
                <option key={z.id} value={z.id}>{z.name} (Risk: {z.riskLevel})</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => dispatchSecurityTeam(selectedTeam, targetZone)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              TRANSMIT DISPATCH ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
