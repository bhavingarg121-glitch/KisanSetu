import React, { useState } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { EmergencyOverlay } from './components/emergency/EmergencyOverlay.tsx';

// Product Landing Page Components (matching reference design)
import { CrowdGuardNavbar } from './components/landing/CrowdGuardNavbar';
import { CrowdGuardHero } from './components/landing/CrowdGuardHero';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { RequestDemoModal } from './components/landing/RequestDemoModal';

// Command Center Pages
import { CommandCenterPage } from './pages/CommandCenterPage.tsx';
import { LiveCamerasPage } from './pages/LiveCamerasPage.tsx';
import { VenueMapPage } from './pages/VenueMapPage.tsx';
import { AlertsPage } from './pages/AlertsPage.tsx';
import { PredictionsPage } from './pages/PredictionsPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { SecurityTeamsPage } from './pages/SecurityTeamsPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

import { Shield, ArrowLeft } from 'lucide-react';

function AppContent() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'console'
  const [currentPage, setCurrentPage] = useState('command-center');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('product');

  const handleLaunchConsole = (page = 'command-center') => {
    // Map feature shortcuts to pages
    const pageMap = {
      'dashboard': 'command-center',
      'command-center': 'command-center',
      'live-cameras': 'live-cameras',
      'prediction': 'predictions',
      'predictions': 'predictions',
      'routing': 'venue-map',
      'venue-map': 'venue-map',
      'emergency': 'alerts',
      'alerts': 'alerts',
      'analytics': 'analytics',
      'security-teams': 'security-teams',
      'settings': 'settings'
    };
    setCurrentPage(pageMap[page] || 'command-center');
    setViewMode('console');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId) => {
    setActiveSection(sectionId);
    if (viewMode !== 'landing') {
      setViewMode('landing');
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

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
    <div className="min-h-screen">
      {/* ===================================================================
          1. PRODUCT OVERVIEW MODE (Matches Reference Image Exactly)
          =================================================================== */}
      {viewMode === 'landing' ? (
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Top SaaS Header */}
          <CrowdGuardNavbar 
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
            onLaunchConsole={() => handleLaunchConsole('command-center')}
            activeSection={activeSection}
            onNavigateSection={handleNavigateSection}
          />

          <main style={{ flex: 1 }}>
            {/* Hero Section with AI Computer Vision Screen */}
            <CrowdGuardHero 
              onOpenDemoModal={() => setIsDemoModalOpen(true)}
              onViewLiveDemo={() => handleLaunchConsole('command-center')}
            />

            {/* How CrowdGuard Works & 4 Feature Showcase Cards */}
            <HowItWorksSection 
              onNavigateToTab={(tab) => handleLaunchConsole(tab)}
            />
          </main>

          {/* Simple SaaS Footer */}
          <footer style={{ borderTop: '1px solid #e2e8f0', background: '#ffffff', padding: '2rem', textAlign: 'center' }}>
            <div style={{ maxWidth: 1360, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0b192c', fontSize: '1rem' }}>
                <Shield size={18} color="#0066ff" fill="#0066ff" />
                CrowdGuard AI Platform
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                © {new Date().getFullYear()} CrowdGuard AI Technologies. Autonomous computer vision & stampede prevention systems.
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.82rem', color: '#64748b' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setIsDemoModalOpen(true)}>Security Architecture</span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleLaunchConsole('command-center')}>Command Center</span>
              </div>
            </div>
          </footer>

          {/* Lead Capture Modal */}
          <RequestDemoModal 
            isOpen={isDemoModalOpen} 
            onClose={() => setIsDemoModalOpen(false)}
            onLaunchConsole={() => handleLaunchConsole('command-center')}
          />
        </div>
      ) : (
        /* ===================================================================
           2. LIVE COMMAND CENTER / OPERATIONAL CONSOLE MODE
           =================================================================== */
        <div className="flex flex-col min-h-screen bg-[#080c14] text-slate-100 font-sans">
          {/* Quick Header Banner to return to Landing */}
          <div className="bg-[#0b192c] border-b border-slate-800 px-6 py-2.5 flex justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewMode('landing')}
                className="bg-slate-800/80 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition cursor-pointer"
                title="Return to CrowdGuard AI Product Page"
              >
                <ArrowLeft size={13} /> Back to Product Overview
              </button>
              <span className="flex items-center gap-2 text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                CrowdGuard AI Command Center • Live Telemetry Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md font-semibold cursor-pointer transition"
              >
                Request Custom Deployment
              </button>
            </div>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Fixed Left Navigation Sidebar */}
            <Sidebar currentPage={currentPage} onSelectPage={setCurrentPage} />

            {/* Main Command Center Viewport */}
            <div className="flex-1 flex flex-col min-w-0">
              <Navbar />
              
              <main className="flex-1 p-6 overflow-y-auto max-w-[1720px] w-full mx-auto">
                {renderPage()}
              </main>
            </div>
          </div>

          {/* Emergency Overlay Modal */}
          <EmergencyOverlay />

          {/* Global Real-time Toast Stack */}
          <ToastContainer />

          {/* Lead Capture Modal available in console */}
          <RequestDemoModal 
            isOpen={isDemoModalOpen} 
            onClose={() => setIsDemoModalOpen(false)}
            onLaunchConsole={() => {}}
          />
        </div>
      )}
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