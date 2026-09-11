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
  Compass
} from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';
import { useAuth, ROLES } from '../../context/AuthContext';

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
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #0284c7, #0f172a)', 
            border: '1px solid #38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
          }}>
            <ShieldAlert size={22} color="#00f0ff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.04em', color: '#f8fafc' }}>
                CROWD<span style={{ color: '#00f0ff' }}>PULSE</span>
              </span>
              <span className="cyber-badge cyber-badge-emerald" style={{ fontSize: '0.65rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                ONLINE
              </span>
              <span className="cyber-badge cyber-badge-purple" style={{ fontSize: '0.62rem' }}>
                FastAPI + PyTorch AI
              </span>
            </div>
            <div className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              AI Crowd Management & Safety System
            </div>
          </div>
        </div>

        {/* Live Telemetry KPI Ticker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Headcount */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.8rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <Users size={16} color="#38bdf8" />
            <div>
              <div className="font-mono" style={{ fontSize: '0.68rem', color: '#94a3b8' }}>OCCUPANCY</div>
              <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                {totalHeadcount.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ {venueCapacity.toLocaleString()} ({overallOccupancyPct}%)</span>
              </div>
            </div>
          </div>

          {/* Inflow / Outflow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.8rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <Activity size={16} color="#10b981" />
            <div>
              <div className="font-mono" style={{ fontSize: '0.68rem', color: '#94a3b8' }}>FLOW VELOCITY</div>
              <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                <span style={{ color: '#10b981' }}>+{turnstileStats.entriesPerMin}</span>
                <span style={{ color: '#64748b', margin: '0 4px' }}>/</span>
                <span style={{ color: '#f87171' }}>-{turnstileStats.exitsPerMin}</span>
                <span style={{ fontSize: '0.68rem', color: '#64748b', marginLeft: '3px' }}>pax/m</span>
              </div>
            </div>
          </div>

          {/* Stampede Risk Index */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            padding: '0.35rem 0.85rem', 
            background: compositeSriResult.sri >= 75 ? 'rgba(239, 68, 68, 0.2)' : compositeSriResult.sri >= 45 ? 'rgba(245, 158, 11, 0.18)' : 'rgba(16, 185, 129, 0.15)', 
            borderRadius: '8px', 
            border: `1px solid ${compositeSriResult.color}` 
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
              background: isSirenActive ? 'linear-gradient(135deg, #ef4444, #991b1b)' : 'rgba(30, 41, 59, 0.6)',
              borderColor: isSirenActive ? '#ef4444' : 'var(--border-subtle)',
              color: isSirenActive ? '#fff' : '#f87171',
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
            {isMuted ? <VolumeX size={17} color="#94a3b8" /> : <Volume2 size={17} color="#38bdf8" />}
          </button>

          {/* Clock */}
          <div className="font-mono" style={{ fontSize: '0.85rem', color: '#94a3b8', padding: '0 0.5rem' }}>
            {timeStr}
          </div>

          {/* Role Switcher Pill */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowRoleMenu(!showRoleMenu)} 
              className="cyber-btn"
              style={{ 
                background: 'rgba(15, 23, 42, 0.85)', 
                borderColor: currentRole.color,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem'
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentRole.color }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>{userName}</div>
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
                background: '#0a1222', 
                border: '1px solid #334155', 
                padding: '0.5rem', 
                zIndex: 100 
              }}>
                <div className="font-mono" style={{ fontSize: '0.68rem', color: '#94a3b8', padding: '0.35rem 0.5rem', borderBottom: '1px solid #1e293b' }}>
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
                        background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                        border: isSelected ? `1px solid ${role.color}` : '1px solid transparent',
                        borderRadius: '6px',
                        color: '#f8fafc',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{role.title}</div>
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
