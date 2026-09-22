import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CrowdDataProvider } from './context/CrowdDataContext';

// Landing Page Components (matching reference design)
import { CrowdGuardNavbar } from './components/landing/CrowdGuardNavbar';
import { CrowdGuardHero } from './components/landing/CrowdGuardHero';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { RequestDemoModal } from './components/landing/RequestDemoModal';

// Live Command Center Components
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MetricsGrid } from './components/dashboard/MetricsGrid';
import { HeatmapCanvas } from './components/dashboard/HeatmapCanvas';
import { CameraFeedGrid } from './components/dashboard/CameraFeedGrid';
import { AlertsPanel } from './components/dashboard/AlertsPanel';
import { PeakForecastChart } from './components/prediction/PeakForecastChart';
import { BottleneckAnalyzer } from './components/prediction/BottleneckAnalyzer';
import { SmartRouteMap } from './components/routing/SmartRouteMap';
import { ZoneTrafficTable } from './components/routing/ZoneTrafficTable';
import { PassGenerator } from './components/ticketing/PassGenerator';
import { QRScannerTerminal } from './components/ticketing/QRScannerTerminal';
import { EmergencyBroadcast } from './components/emergency/EmergencyBroadcast';
import { IncidentDispatch } from './components/emergency/IncidentDispatch';
import { SurgeSimulator } from './components/sandbox/SurgeSimulator';
import { AttendeePortal } from './components/attendee/AttendeePortal';

import { Shield, ArrowLeft, Activity, Radio, ExternalLink } from 'lucide-react';

function MainApp() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'console'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('product');
  const { currentRole } = useAuth();

  // Adapt view if role changes in console mode
  useEffect(() => {
    if (viewMode === 'console') {
      if (currentRole.id === 'attendee') {
        setActiveTab('attendee');
      } else if (currentRole.id === 'security_guard') {
        setActiveTab('ticketing');
      }
    }
  }, [currentRole.id, viewMode]);

  const handleLaunchConsole = (tab = 'dashboard') => {
    setActiveTab(tab);
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

  return (
    <div className="app-container">
      {/* ===================================================================
          1. PRODUCT OVERVIEW MODE (Matches Reference Image Exactly)
          =================================================================== */}
      {viewMode === 'landing' ? (
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Top SaaS Header */}
          <CrowdGuardNavbar 
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
            onLaunchConsole={() => handleLaunchConsole('dashboard')}
            activeSection={activeSection}
            onNavigateSection={handleNavigateSection}
          />

          <main style={{ flex: 1 }}>
            {/* Hero Section with AI Computer Vision Screen */}
            <CrowdGuardHero 
              onOpenDemoModal={() => setIsDemoModalOpen(true)}
              onViewLiveDemo={() => handleLaunchConsole('dashboard')}
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
                <span style={{ cursor: 'pointer' }} onClick={() => handleLaunchConsole('dashboard')}>Command Center</span>
              </div>
            </div>
          </footer>

          {/* Lead Capture Modal */}
          <RequestDemoModal 
            isOpen={isDemoModalOpen} 
            onClose={() => setIsDemoModalOpen(false)}
            onLaunchConsole={() => handleLaunchConsole('dashboard')}
          />
        </div>
      ) : (
        /* ===================================================================
           2. LIVE COMMAND CENTER / OPERATIONAL CONSOLE MODE
           =================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Quick Header Banner to return to Landing */}
          <div className="console-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <button 
                onClick={() => setViewMode('landing')}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  transition: 'background 0.15s ease'
                }}
                title="Return to CrowdGuard AI Product Page"
              >
                <ArrowLeft size={14} /> Back to Overview
              </button>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
                CrowdGuard AI Command Center • Live Telemetry Stream
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                style={{
                  background: '#0066ff',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Request Custom Deployment
              </button>
            </div>
          </div>

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

          {/* Lead Capture Modal available in console too */}
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
    <ThemeProvider>
      <AuthProvider>
        <CrowdDataProvider>
          <MainApp />
        </CrowdDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
