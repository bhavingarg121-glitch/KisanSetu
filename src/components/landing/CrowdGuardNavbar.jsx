import React, { useState } from 'react';
import { Shield, ChevronDown, Activity, Play, Sparkles } from 'lucide-react';

export function CrowdGuardNavbar({ onOpenDemoModal, onLaunchConsole, activeSection, onNavigateSection }) {
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="cg-header">
      <div className="cg-header-inner">
        {/* Brand Logo */}
        <div className="cg-logo-link" onClick={() => onNavigateSection('hero')}>
          <div className="cg-logo-icon">
            <Shield size={22} fill="currentColor" strokeWidth={1.5} />
          </div>
          <div className="cg-logo-title">
            CrowdGuard<span>AI</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav>
          <ul className="cg-nav-menu">
            <li 
              className={`cg-nav-item ${activeSection === 'product' ? 'active' : ''}`}
              onClick={() => onNavigateSection('hero')}
            >
              Product
            </li>
            <li 
              className={`cg-nav-item ${activeSection === 'solutions' ? 'active' : ''}`}
              onClick={() => onNavigateSection('features')}
            >
              Solutions
            </li>
            <li 
              className={`cg-nav-item ${activeSection === 'how-it-works' ? 'active' : ''}`}
              onClick={() => onNavigateSection('how-it-works')}
            >
              How It Works
            </li>
            <li 
              className={`cg-nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={onLaunchConsole}
            >
              Analytics
            </li>
            <li 
              className="cg-nav-item"
              style={{ position: 'relative' }}
              onClick={() => setResourcesOpen(!resourcesOpen)}
            >
              Resources <ChevronDown size={14} />
              {resourcesOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '0.75rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '0.5rem',
                  minWidth: '180px',
                  zIndex: 200
                }}>
                  <div 
                    onClick={() => { setResourcesOpen(false); onNavigateSection('how-it-works'); }}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#334155', borderRadius: '6px', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    Documentation
                  </div>
                  <div 
                    onClick={() => { setResourcesOpen(false); onLaunchConsole(); }}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#334155', borderRadius: '6px', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    API & Webhooks
                  </div>
                  <div 
                    onClick={() => { setResourcesOpen(false); onOpenDemoModal(); }}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#334155', borderRadius: '6px', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    Safety Case Studies
                  </div>
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* CTA Actions */}
        <div className="cg-header-actions">
          <a 
            href="./SIH_AGRICULTURE.html" 
            className="cg-btn-secondary" 
            style={{ borderColor: '#10B981', color: '#10B981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Open KisanSetu Subsidized Agri-Inputs and Procurement Portal"
          >
            <span>🌾</span>
            <span>KisanSetu Portal</span>
          </a>
          <button 
            className="cg-btn-secondary" 
            onClick={onLaunchConsole}
            title="Open Live Crowd Management Command Center"
          >
            <Activity size={16} color="#0066ff" />
            Live Console
          </button>
          <button 
            className="cg-btn-primary" 
            onClick={onOpenDemoModal}
          >
            Request Demo
          </button>
        </div>
      </div>
    </header>
  );
}
