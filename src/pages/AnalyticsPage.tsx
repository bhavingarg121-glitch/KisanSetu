import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { MetricCard } from '../components/common/MetricCard';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { zones, totalPeople, activeAlertsCount } = useSimulation();

  // Density over time series
  const densityHistory = [
    { time: '18:00', overall: 32, gateB: 28, stage: 45 },
    { time: '18:30', overall: 44, gateB: 38, stage: 56 },
    { time: '19:00', overall: 58, gateB: 52, stage: 68 },
    { time: '19:30', overall: 65, gateB: 68, stage: 72 },
    { time: '20:00', overall: 72, gateB: 84, stage: 78 },
    { time: '20:30 (Peak)', overall: 81, gateB: 94, stage: 85 },
    { time: '21:00', overall: 68, gateB: 72, stage: 79 },
    { time: '21:30', overall: 54, gateB: 48, stage: 64 },
  ];

  // Inflow vs Outflow Comparison Data
  const flowData = zones.map(z => ({
    name: z.shortName,
    Inflow: z.inflow,
    Outflow: z.outflow,
  }));

  // Zone Occupancy Bar Data
  const occupancyData = zones.map(z => ({
    name: z.shortName,
    Occupancy: z.density,
    Capacity: 100,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-white">
              Event Telemetry & Crowd Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Post-incident diagnostics, peak density distributions, and ingress/egress throughput
          </p>
        </div>
      </div>

      {/* Incident Summary Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Incidents"
          value="12"
          subValue="Past 6 hours"
          icon={Activity}
          statusColor="cyan"
        />
        <MetricCard
          label="Resolved Countermeasures"
          value="10"
          subValue="83.3% clearance"
          icon={CheckCircle2}
          statusColor="emerald"
        />
        <MetricCard
          label="Active Alarms"
          value={activeAlertsCount}
          subValue="Security dispatch"
          icon={AlertTriangle}
          statusColor={activeAlertsCount > 1 ? 'rose' : 'amber'}
        />
        <MetricCard
          label="Avg Response Time"
          value="01:42"
          subValue="Target < 03:00"
          icon={Clock}
          statusColor="emerald"
        />
      </div>

      {/* Peak Period Callout */}
      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-300">
              Peak Crowd Period Detected: 20:30 � 21:15 (Main Stage Headline & East Gate Ingress)
            </h4>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Venue occupancy peaked at 81% overall with Gate B hitting 94% surge threshold.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Crowd Density Over Time */}
        <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Crowd Density Over Time (%)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Hourly Intervals</span>
          </div>

          <div className="h-64 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={densityHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d18',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Line type="monotone" dataKey="overall" stroke="#38bdf8" strokeWidth={2.5} name="Venue Overall" />
                <Line type="monotone" dataKey="gateB" stroke="#ef4444" strokeWidth={2} name="Gate B" />
                <Line type="monotone" dataKey="stage" stroke="#f59e0b" strokeWidth={2} name="Main Stage" />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Inflow vs Outflow Comparison */}
        <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Inflow vs Outflow Rates (Pax / Min)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Turnstile Telemetry</span>
          </div>

          <div className="h-64 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d18',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Outflow" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Zone Occupancy Distribution */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Sector Occupancy Saturation Distribution (%)
              </span>
            </div>
          </div>

          <div className="h-64 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d18',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="Occupancy" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
