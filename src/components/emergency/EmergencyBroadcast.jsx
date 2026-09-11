import React, { useState } from 'react';
import { Megaphone, AlertTriangle, Siren, Volume2, Radio, Send, Check, ShieldAlert } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';
import { soundService } from '../../services/soundAlerts';

export function EmergencyBroadcast() {
  const { 
    emergencyLevel, 
    broadcastMessage, 
    triggerEmergencyBroadcast, 
    isSirenActive, 
    toggleSiren 
  } = useCrowdData();

  const [customMsg, setCustomMsg] = useState('');

  const PRESETS = [
    {
      level: 'CRITICAL_EVACUATION',
      title: 'Full Venue Evacuation Klaxon',
      message: 'ATTENTION ALL ATTENDEES: A MANDATORY EVACUATION PROTOCOL IS ACTIVE. PLEASE PROCEED CALMLY TOWARDS WEST EGRESS AND SOUTH METRO EXITS. DO NOT RUN OR PUSH.',
      color: '#ef4444'
    },
    {
      level: 'WARNING',
      title: 'Arena Floor Bottleneck Dissipation',
      message: 'SECURITY NOTICE: MAIN STAGE AND GATE A ARE EXPERIENCING HEAVY CROWD PRESSURE. PLEASE FOLLOW GREEN LIT SIGNS TOWARD WEST CORRIDORS W1-W3.',
      color: '#f59e0b'
    },
    {
      level: 'ADVISORY',
      title: 'Concourse Queue Flow Advisory',
      message: 'CROWD UPDATE: PLEASE MAINTAIN STEADY PACING THROUGH THE TURNSTILES. HAVE YOUR DIGITAL PASS READY FOR RAPID SCANNING.',
      color: '#38bdf8'
    }
  ];

  const handleTriggerPreset = (preset) => {
    triggerEmergencyBroadcast(preset.level, preset.message);
  };

  const handleSendCustom = (e) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    triggerEmergencyBroadcast('WARNING', customMsg);
    setCustomMsg('');
  };

  const handleReturnToNormal = () => {
    triggerEmergencyBroadcast('NORMAL', '');
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={18} color="#ef4444" />
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              PUBLIC ADDRESS & EMERGENCY BROADCAST COMMAND
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Multi-channel emergency coordination across acoustic PA systems, digital jumbotrons, and field radio dispatch.
          </p>
        </div>

        {/* Current status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`cyber-badge ${emergencyLevel === 'CRITICAL_EVACUATION' ? 'cyber-badge-red' : emergencyLevel === 'WARNING' ? 'cyber-badge-amber' : 'cyber-badge-emerald'}`}>
            CURRENT LEVEL: {emergencyLevel}
          </span>
          {emergencyLevel !== 'NORMAL' && (
            <button
              onClick={handleReturnToNormal}
              className="cyber-btn cyber-btn-emerald"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              Stand Down to Normal
            </button>
          )}
        </div>
      </div>

      {/* Emergency Siren & Quick Action Controls */}
      <div style={{ 
        background: 'rgba(15, 23, 42, 0.7)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: '10px', 
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: isSirenActive ? 'rgba(239, 68, 68, 0.25)' : 'rgba(30, 41, 59, 0.5)',
            border: `1px solid ${isSirenActive ? '#ef4444' : '#334155'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isSirenActive ? 'var(--glow-red)' : 'none'
          }}>
            <Siren size={26} color={isSirenActive ? '#ef4444' : '#94a3b8'} className={isSirenActive ? 'pulse-threat' : ''} />
          </div>
          <div>
            <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
              STADIUM ACOUSTIC ALARM KLAXON
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Synthesizes low-frequency modulated evacuation tones (440Hz - 720Hz warble).
            </div>
          </div>
        </div>

        <button
          onClick={() => toggleSiren()}
          className={`cyber-btn ${isSirenActive ? 'cyber-btn-danger' : 'cyber-btn-primary'}`}
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
        >
          <Siren size={18} />
          {isSirenActive ? 'SILENCE EMERGENCY KLAXON' : 'ACTIVATE EMERGENCY KLAXON'}
        </button>
      </div>

      {/* Preset Broadcast Dispatch */}
      <div className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.6rem' }}>
        STANDARDIZED EMERGENCY BROADCAST PROTOCOLS:
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {PRESETS.map((p, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(10, 17, 32, 0.8)',
              border: `1px solid ${p.color}50`,
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: p.color, fontWeight: 700 }}>
                  {p.level}
                </span>
                <Radio size={14} color={p.color} />
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                {p.title}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.35, marginBottom: '0.85rem' }}>
                "{p.message}"
              </p>
            </div>

            <button
              onClick={() => handleTriggerPreset(p)}
              className="cyber-btn"
              style={{
                width: '100%',
                fontSize: '0.78rem',
                borderColor: p.color,
                background: `${p.color}20`,
                color: '#f8fafc'
              }}
            >
              <Send size={13} color={p.color} />
              Trigger Protocol & Speech PA
            </button>
          </div>
        ))}
      </div>

      {/* Custom Broadcast Form */}
      <form onSubmit={handleSendCustom} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <label className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>
          CUSTOM SPEECH SYNTHESIS & SIGNAGE OVERRIDE MESSAGE
        </label>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <input
            type="text"
            placeholder="Type live announcement for stadium speakers..."
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            style={{
              flex: 1,
              padding: '0.65rem 0.85rem',
              background: '#070c17',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.85rem'
            }}
          />
          <button type="submit" className="cyber-btn cyber-btn-primary">
            <Volume2 size={16} />
            Transmit PA Speech
          </button>
        </div>
      </form>

      {/* Digital Jumbotron & Signage Preview */}
      <div>
        <div className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
          LIVE DIGITAL SIGNAGE & JUMBOTRON FEED:
        </div>
        <div style={{ 
          background: emergencyLevel === 'CRITICAL_EVACUATION' ? '#7f1d1d' : emergencyLevel === 'WARNING' ? '#78350f' : '#0f172a',
          border: `2px solid ${emergencyLevel === 'CRITICAL_EVACUATION' ? '#ef4444' : emergencyLevel === 'WARNING' ? '#f59e0b' : '#334155'}`,
          borderRadius: '8px',
          padding: '1.25rem',
          textAlign: 'center',
          boxShadow: emergencyLevel === 'CRITICAL_EVACUATION' ? 'var(--glow-red)' : 'none'
        }}>
          <div className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.06em' }}>
            {emergencyLevel === 'CRITICAL_EVACUATION' 
              ? '🚨 EMERGENCY EVACUATION: PROCEED CALMLY TO LIT GREEN EXITS'
              : emergencyLevel === 'WARNING' 
              ? '⚠️ REROUTE NOTICE: WEST EXITS OPEN • FOLLOW ARROWS'
              : 'WELCOME TO METRO ARENA • GATES OPERATING NORMALLY'}
          </div>
          <div className="font-mono" style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.4rem' }}>
            {broadcastMessage || 'Please keep aisles clear and follow venue marshal instructions.'}
          </div>
        </div>
      </div>
    </div>
  );
}
