import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CrowdDataProvider, useCrowdData } from './context/CrowdDataContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Dashboard components
import { MetricsGrid } from './components/dashboard/MetricsGrid';
import { HeatmapCanvas } from './components/dashboard/HeatmapCanvas';
import { CameraFeedGrid } from './components/dashboard/CameraFeedGrid';
import { AlertsPanel } from './components/dashboard/AlertsPanel';

// Prediction & Heuristics
import { PeakForecastChart } from './components/prediction/PeakForecastChart';
import { BottleneckAnalyzer } from './components/prediction/BottleneckAnalyzer';

// Routing & Flow
import { SmartRouteMap } from './components/routing/SmartRouteMap';
import { ZoneTrafficTable } from './components/routing/ZoneTrafficTable';

// Ticketing & QR
import { PassGenerator } from './components/ticketing/PassGenerator';
import { QRScannerTerminal } from './components/ticketing/QRScannerTerminal';

// Emergency Management
import { EmergencyBroadcast } from './components/emergency/EmergencyBroadcast';
import { IncidentDispatch } from './components/emergency/IncidentDispatch';

// Simulation Sandbox
import { SurgeSimulator } from './components/sandbox/SurgeSimulator';

// Attendee View
import { AttendeePortal } from './components/attendee/AttendeePortal';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentRole } = useAuth();

  // Adapt view if role changes
  useEffect(() => {
    if (currentRole.id === 'attendee') {
      setActiveTab('attendee');
    } else if (currentRole.id === 'security_guard') {
      setActiveTab('ticketing');
    }
  }, [currentRole.id]);

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-content-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="workspace-area">
          {activeTab === 'dashboard' && (
            <div>
              <MetricsGrid />
              <HeatmapCanvas />
              <CameraFeedGrid />
              <AlertsPanel onDispatchClick={() => setActiveTab('emergency')} />
            </div>
          )}

          {activeTab === 'prediction' && (
            <div>
              <PeakForecastChart />
              <BottleneckAnalyzer onRerouteClick={() => setActiveTab('routing')} />
            </div>
          )}

          {activeTab === 'routing' && (
            <div>
              <SmartRouteMap />
              <ZoneTrafficTable />
            </div>
          )}

          {activeTab === 'ticketing' && (
            <div>
              <QRScannerTerminal />
              <PassGenerator />
            </div>
          )}

          {activeTab === 'emergency' && (
            <div>
              <EmergencyBroadcast />
              <IncidentDispatch />
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div>
              <SurgeSimulator />
              <MetricsGrid />
              <HeatmapCanvas />
            </div>
          )}

          {activeTab === 'attendee' && (
            <div>
              <AttendeePortal />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CrowdDataProvider>
        <MainApp />
      </CrowdDataProvider>
    </AuthProvider>
  );
}
