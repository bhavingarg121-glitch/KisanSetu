import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { MetricCard } from '../components/common/MetricCard';
import { VenueMapCanvas } from '../components/dashboard/VenueMapCanvas';
import { ZoneDetailsDrawer } from '../components/dashboard/ZoneDetailsDrawer';
import { EarlyWarningCard } from '../components/dashboard/EarlyWarningCard';
import { RiskEngineBreakdown } from '../components/dashboard/RiskEngineBreakdown';
import { AIRecommendationBanner } from '../components/dashboard/AIRecommendationBanner';
import { AlertTimeline } from '../components/dashboard/AlertTimeline';
import { AIAnalysisModules } from '../components/dashboard/AIAnalysisModules';
import { Users, AlertTriangle, ShieldAlert, Activity, Clock } from 'lucide-react';

export const CommandCenterPage: React.FC = () => {
  const { 
    totalPeople, 
    activeAlertsCount, 
    highRiskZonesCount, 
    averageDensity, 
    responseTime,
    stage 
  } = useSimulation();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Aggregated Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <MetricCard
          label="Total People"
          value={totalPeople.toLocaleString()}
          subValue="/ 25,000 cap"
          trend="up"
          trendValue="+12%"
          icon={Users}
          statusColor="cyan"
        />
        <MetricCard
          label="Active Alerts"
          value={activeAlertsCount}
          subValue="2 critical"
          trend={activeAlertsCount > 2 ? 'up' : 'neutral'}
          trendValue={activeAlertsCount > 2 ? '+2 new' : 'stable'}
          icon={AlertTriangle}
          statusColor={activeAlertsCount > 2 ? 'rose' : 'amber'}
          pulse={activeAlertsCount > 2}
        />
        <MetricCard
          label="High-Risk Zones"
          value={highRiskZonesCount}
          subValue="Gate B, Stage"
          trend="neutral"
          trendValue="0"
          icon={ShieldAlert}
          statusColor={highRiskZonesCount > 0 ? 'rose' : 'emerald'}
        />
        <MetricCard
          label="Average Density"
          value={`${averageDensity}%`}
          subValue="Venue wide"
          trend={averageDensity > 65 ? 'up' : 'down'}
          trendValue={averageDensity > 65 ? '+8%' : '-2%'}
          icon={Activity}
          statusColor={averageDensity > 70 ? 'rose' : averageDensity > 50 ? 'amber' : 'emerald'}
        />
        <MetricCard
          label="Response Time"
          value={responseTime}
          subValue="Target < 03:00"
          trend="down"
          trendValue="-24s"
          icon={Clock}
          statusColor="emerald"
        />
      </div>

      {/* AI Recommendation Banner */}
      <AIRecommendationBanner />

      {/* Main Command Center Interactive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Venue Map Canvas (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          <VenueMapCanvas />
          <AIAnalysisModules />
          <AlertTimeline />
        </div>

        {/* Right Column: Zone Inspector & Prediction Engines (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          <ZoneDetailsDrawer />
          <EarlyWarningCard />
          <RiskEngineBreakdown />
        </div>
      </div>
    </div>
  );
};
