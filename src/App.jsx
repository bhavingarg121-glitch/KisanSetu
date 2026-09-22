import React, { useState } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { EmergencyOverlay } from './components/emergency/EmergencyOverlay.tsx';

// Pages
import { CommandCenterPage } from './pages/CommandCenterPage.tsx';
import { LiveCamerasPage } from './pages/LiveCamerasPage.tsx';
import { VenueMapPage } from './pages/VenueMapPage.tsx';
import { AlertsPage } from './pages/AlertsPage.tsx';
import { PredictionsPage } from './pages/PredictionsPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { SecurityTeamsPage } from './pages/SecurityTeamsPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('command-center');

  const renderPage = () => {
    switch (currentPage) {
      case 'command-center':
        return <CommandCenterPage />;
      case 'live-cameras':
        return <LiveCamerasPage />;
      case 'venue-map':
        return <VenueMapPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'security-teams':
        return <SecurityTeamsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <CommandCenterPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080c14] text-slate-100 font-sans">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar currentPage={currentPage} onSelectPage={setCurrentPage} />

      {/* Main Command Center Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 p-6 overflow-y-auto max-w-[1720px] w-full mx-auto">
          {renderPage()}
        </main>
      </div>

      {/* Emergency Overlay Modal */}
      <EmergencyOverlay />

      {/* Global Real-time Toast Stack */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}