import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { AlertOctagon, Search, Filter, ShieldAlert, CheckCircle2, AlertTriangle, Zap, ArrowDownCircle } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert } = useSimulation();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter(a => {
    const matchesFilter = filterSeverity === 'ALL' 
      ? true 
      : filterSeverity === 'RESOLVED'
      ? a.status === 'RESOLVED'
      : a.severity === filterSeverity;
    
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.zoneName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'ACTION':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'RECOVERY':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'RESOLVED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-rose-400" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-white">
              Incident Registry & Alert Dispatch Log
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Audit trail of anomalies, predictive alarms, and executed countermeasures
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search alerts, zones, actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center">
          {['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'ACTION', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterSeverity(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filterSeverity === f
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table / List */}
      <div className="rounded-2xl border border-slate-800 bg-[#090e1a] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-4">Countermeasure / Action</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No incidents matching selected filter.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-300 whitespace-nowrap">
                      {alert.timeFormatted}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-white font-semibold whitespace-nowrap">
                      {alert.zoneName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="font-bold text-slate-100 block mb-0.5">{alert.title}</span>
                      <span className="text-slate-400 text-[11px]">{alert.description}</span>
                    </td>
                    <td className="py-3.5 px-4 text-cyan-300 text-[11px]">
                      {alert.actionTaken || 'Monitoring baseline'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {alert.status === 'ACTIVE' ? (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-bold"
                        >
                          ACKNOWLEDGE
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                          ? {alert.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
