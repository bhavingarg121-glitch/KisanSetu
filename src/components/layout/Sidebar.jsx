import React from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  Navigation, 
  QrCode, 
  Megaphone, 
  Sliders, 
  Smartphone,
  Shield,
  Layers,
  AlertOctagon
} from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Sidebar({ activeTab, setActiveTab }) {
  const { alerts, compositeSriResult, emergencyLevel } = useCrowdData();
  const { currentRole } = useAuth();
  const { isGoldenAura } = useTheme();

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Operations Command',
      icon: LayoutDashboard,
      badge: unreadAlerts > 0 ? `${unreadAlerts} Alerts` : null,
      badgeType: 'red'
    },
    {
      id: 'prediction',
      label: 'Stampede & Peak AI',
      icon: LineChart,
      badge: `${compositeSriResult.sri}% SRI`,
      badgeType: compositeSriResult.sri >= 70 ? 'red' : compositeSriResult.sri >= 40 ? 'amber' : 'emerald'
    },
    {
      id: 'routing',
      label: 'Smart Wayfinding',
      icon: Navigation,
      badge: 'Active',
      badgeType: 'blue'
    },
    {
      id: 'ticketing',
      label: 'QR Access & Turnstiles',
      icon: QrCode,
      badge: null
    },
    {
      id: 'emergency',
      label: 'Emergency Broadcast',
      icon: Megaphone,
      badge: emergencyLevel !== 'NORMAL' ? emergencyLevel : null,
      badgeType: emergencyLevel === 'CRITICAL_EVACUATION' ? 'red' : 'amber'
    },
    {
      id: 'sandbox',
      label: 'Simulation Sandbox',
      icon: Sliders,
      badge: 'Live',
      badgeType: 'purple'
    },
    {
      id: 'attendee',
      label: 'Attendee Mobile Pass',
      icon: Smartphone,
      badge: 'Public',
      badgeType: 'emerald'
    }
  ];

  return (
    <aside className="sidebar-container">
      {/* Role Banner */}
      <div style={{ 
        padding: '0.85rem', 
        background: 'var(--bg-card)', 
        borderRadius: '14px', 
        border: `1px solid ${currentRole.color}40`,
        marginBottom: '0.75rem',
        boxShadow: 'var(--shadow-glass)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
          <Shield size={14} color={currentRole.color} />
          <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: currentRole.color }}>
            {currentRole.title}
          </span>
        </div>
        <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
          {currentRole.description}
        </p>
      </div>

      <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem 0.25rem', fontWeight: 600 }}>
        NAVIGATION MODULES
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="cyber-btn"
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                padding: '0.7rem 0.95rem',
                borderRadius: '9999px',
                background: isActive 
                  ? (isGoldenAura ? 'var(--accent-gold-gradient)' : 'linear-gradient(90deg, rgba(14, 116, 144, 0.35), rgba(15, 23, 42, 0.6))')
                  : 'transparent',
                borderColor: isActive ? (isGoldenAura ? 'rgba(255,255,255,0.4)' : '#38bdf8') : 'transparent',
                boxShadow: isActive ? (isGoldenAura ? 'var(--glow-gold)' : '0 0 14px rgba(56, 189, 248, 0.2)') : 'none',
                color: isActive ? '#ffffff !important' : 'var(--text-primary)',
              }}
            >
              <Icon size={17} color={isActive ? '#ffffff' : 'var(--text-secondary)'} />
              <span style={{ fontSize: '0.82rem', fontWeight: isActive ? 700 : 500, flex: 1, textAlign: 'left', color: isActive ? '#ffffff' : 'var(--text-primary)' }}>
                {item.label}
              </span>
              {item.badge && (
                <span className={`cyber-badge cyber-badge-${item.badgeType}`} style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Threat Status Card */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        <div className="glass-panel" style={{ padding: '0.85rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertOctagon size={15} color={compositeSriResult.color} />
              <span className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 700, color: compositeSriResult.color }}>
                HAZARD LEVEL
              </span>
            </div>
            <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: compositeSriResult.color }}>
              {compositeSriResult.level}
            </span>
          </div>
          <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${compositeSriResult.sri}%`, 
                background: compositeSriResult.color,
                transition: 'width 0.4s ease, background 0.4s ease'
              }} 
            />
          </div>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.3 }}>
            {compositeSriResult.recommendation.split('.')[0]}.
          </p>
        </div>
      </div>
    </aside>
  );
}
