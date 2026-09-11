import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Bell, 
  UserCheck, 
  Activity, 
  AlertTriangle, 
  Radio, 
  Siren,
  Users,
  Compass,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Navbar({ activeTab, setActiveTab }) {
  const { 
    totalHeadcount, 
    venueCapacity, 
    overallOccupancyPct, 
    compositeSriResult,
    turnstileStats,
    isMuted, 
    toggleMute,
    isSirenActive,
    toggleSiren,
    emergencyLevel,
    broadcastMessage,
    alerts
  } = useCrowdData();

  const { currentRole, userName, switchRole } = useAuth();
  const { isGoldenAura, toggleTheme } = useTheme();
  const [timeStr, setTimeStr] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '0.65rem 1.25rem', zIndex: 50 }}>
      {/* Emergency Marquee if Warning or Evacuation is active */}
      {emergencyLevel !== 'NORMAL' && broadcastMessage && (
        <div style={{ 
          background: emergencyLevel === 'CRITICAL_EVACUATION' ? 'linear-gradient(90deg, #dc2626, #b91c1c)' : 'linear-gradient(90deg, #d97706, #b45309)',
          padding: '0.35rem 1rem', 
          marginBottom: '0.5rem',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          overflow: 'hidden',
          fontSize: '0.82rem',
          fontWeight: 700,
          letterSpacing: '0.05em'
        }}>
          <AlertTriangle size={18} className="pulse-threat" />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <span className="animate-marquee">
              ⚠️ [EMERGENCY PROTOCOL ACTIVE - LEVEL: {emergencyLevel}] : {broadcastMessage}
            </span>
          </div>
          <button 
            onClick={() => setActiveTab('emergency')} 
            className="cyber-btn"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Manage Protocol
          </button>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Logo & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '12px', 
            background: isGoldenAura ? 'var(--accent-gold-gradient)' : 'linear-gradient(135deg, #0284c7, #0f172a)', 
            border: `1px solid ${isGoldenAura ? 'var(--accent-gold)' : '#38bdf8'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isGoldenAura ? 'var(--glow-gold)' : '0 0 15px rgba(56, 189, 248, 0.4)'
          }}>
            <ShieldAlert size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                CROWD<span style={{ color: 'var(--accent-gold)' }}>PULSE</span>
              </span>
              <span className="cyber-badge cyber-badge-emerald" style={{ fontSize: '0.65rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
                ONLINE
              </span>
              <span className={`cyber-badge ${isGoldenAura ? 'cyber-badge-gold' : 'cyber-badge-purple'}`} style={{ fontSize: '0.62rem' }}>
                FastAPI + PyTorch AI
              </span>
            </div>
            <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              AI Crowd Management & Safety System
            </div>
          </div>
        </div>

        {/* Live Telemetry KPI Ticker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Headcount */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.85rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-glass)' }}>
            <Users size={16} color="var(--accent-gold)" />
            <div>
              <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>OCCUPANCY</div>
              <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {totalHeadcount.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/ {venueCapacity.toLocaleString()} ({overallOccupancyPct}%)</span>
              </div>
            </div>
          </div>

          {/* Inflow / Outflow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.85rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-glass)' }}>
            <Activity size={16} color="#059669" />
            <div>
              <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>FLOW VELOCITY</div>
              <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                <span style={{ color: '#059669' }}>+{turnstileStats.entriesPerMin}</span>
                <span style={{ color: 'var(--text-secondary)', margin: '0 4px' }}>/</span>
                <span style={{ color: '#dc2626' }}>-{turnstileStats.exitsPerMin}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginLeft: '3px' }}>pax/m</span>
              </div>
            </div>
          </div>

          {/* Stampede Risk Index */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            padding: '0.35rem 0.85rem', 
            background: compositeSriResult.sri >= 75 ? 'rgba(220, 38, 38, 0.15)' : compositeSriResult.sri >= 45 ? 'rgba(217, 119, 6, 0.15)' : 'rgba(5, 150, 105, 0.12)', 
            borderRadius: '12px', 
            border: `1px solid ${compositeSriResult.color}`,
            boxShadow: 'var(--shadow-glass)'
          }}>
            <Radio size={16} color={compositeSriResult.color} className={compositeSriResult.sri >= 75 ? 'pulse-threat' : ''} />
            <div>
              <div className="font-mono" style={{ fontSize: '0.68rem', color: compositeSriResult.color }}>STAMPEDE RISK (SRI)</div>
              <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: compositeSriResult.color }}>
                {compositeSriResult.sri}% <span style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>[{compositeSriResult.level}]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Siren Button */}
          <button 
            onClick={() => toggleSiren()} 
            className="cyber-btn"
            title={isSirenActive ? "Stop Emergency Siren" : "Sound Emergency Siren"}
            style={{ 
              background: isSirenActive ? 'linear-gradient(135deg, #ef4444, #991b1b)' : 'var(--bg-card)',
              borderColor: isSirenActive ? '#ef4444' : 'var(--border-subtle)',
              color: isSirenActive ? '#fff' : '#dc2626',
              padding: '0.5rem 0.75rem'
            }}
          >
            <Siren size={17} className={isSirenActive ? "pulse-threat" : ""} />
            <span className="font-mono" style={{ fontSize: '0.75rem' }}>
              {isSirenActive ? 'SIREN ON' : 'SIREN'}
            </span>
          </button>

          {/* Sound Mute Toggle */}
          <button 
            onClick={toggleMute} 
            className="cyber-btn"
            title={isMuted ? "Unmute Audio" : "Mute Audio Alerts"}
            style={{ padding: '0.5rem' }}
          >
            {isMuted ? <VolumeX size={17} color="var(--text-secondary)" /> : <Volume2 size={17} color="var(--accent-gold)" />}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="cyber-btn"
            title={`Switch to ${isGoldenAura ? 'Midnight Cyber Glass' : 'Golden Aura Glass'}`}
            style={{
              padding: '0.45rem 0.85rem',
              background: isGoldenAura ? 'rgba(217, 119, 6, 0.15)' : 'rgba(30, 41, 59, 0.6)',
              borderColor: isGoldenAura ? 'var(--accent-gold)' : 'var(--border-glass)',
              color: isGoldenAura ? 'var(--accent-gold)' : '#f8fafc',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            {isGoldenAura ? (
              <>
                <Sparkles size={15} color="var(--accent-gold)" />
                <span>Golden Aura</span>
              </>
            ) : (
              <>
                <Moon size={15} color="#38bdf8" />
                <span>Midnight Glass</span>
              </>
            )}
          </button>

          {/* Role Switcher Pill */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowRoleMenu(!showRoleMenu)} 
              className="cyber-btn"
              style={{ 
                background: 'var(--bg-card)', 
                borderColor: currentRole.color,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem'
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentRole.color }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{userName}</div>
                <div className="font-mono" style={{ fontSize: '0.65rem', color: currentRole.color }}>{currentRole.badge}</div>
              </div>
            </button>

            {/* Role dropdown */}
            {showRoleMenu && (
              <div className="glass-panel" style={{ 
                position: 'absolute', 
                right: 0, 
                top: '115%', 
                width: '260px', 
                background: 'var(--bg-card-elevated)', 
                border: '1px solid var(--border-glass)', 
                borderRadius: '16px',
                padding: '0.65rem', 
                zIndex: 100,
                boxShadow: 'var(--shadow-hover)'
              }}>
                <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600 }}>
                  SWITCH ACCESS ROLE:
                </div>
                {Object.keys(ROLES).map(roleKey => {
                  const role = ROLES[roleKey];
                  const isSelected = currentRole.id === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        switchRole(roleKey);
                        setShowRoleMenu(false);
                      }}
                      style={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '0.6rem 0.5rem', 
                        margin: '0.2rem 0',
                        background: isSelected ? 'rgba(217, 119, 6, 0.12)' : 'transparent',
                        border: isSelected ? `1px solid ${role.color}` : '1px solid transparent',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{role.title}</div>
                        <div className="font-mono" style={{ fontSize: '0.68rem', color: role.color }}>{role.badge}</div>
                      </div>
                      {isSelected && <UserCheck size={16} color={role.color} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
