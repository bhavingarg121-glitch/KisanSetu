import React, { useState } from 'react';
import { Navigation, ArrowRight, CheckCircle2, AlertTriangle, Radio, Sparkles, Send } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

export function SmartRouteMap() {
  const { zones, triggerEmergencyBroadcast, triggerSimulationPreset } = useCrowdData();
  const [broadcastSent, setBroadcastSent] = useState(false);

  const arenaZone = zones.find(z => z.id === 'zone-arena-bowl') || zones[1];
  const westZone = zones.find(z => z.id === 'zone-west-concourse') || zones[2];
  const northZone = zones.find(z => z.id === 'zone-north-gate') || zones[0];

  const handleBroadcastReroute = () => {
    triggerEmergencyBroadcast(
      'WARNING',
      'SMART REROUTE ADVISORY: Main Stage & Gate A are congested. Please follow green illuminated signs through West Egress Corridor W1-W3. Minimal wait time.'
    );
    triggerSimulationPreset('evacuation_reroute');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={18} color="#00f0ff" />
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              SMART WAYFINDING & DYNAMIC EVACUATION REROUTING
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Algorithmic crowd dispersal balancing flow pressure across all stadium arteries and emergency portals.
          </p>
        </div>

        <button
          onClick={handleBroadcastReroute}
          className="cyber-btn cyber-btn-primary"
          style={{ fontSize: '0.8rem' }}
        >
          <Send size={14} />
          {broadcastSent ? 'Reroute Broadcast Sent!' : 'Push Reroute to Signage & Mobile'}
        </button>
      </div>

      {/* Dynamic Route Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Congested Route */}
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.08)', 
          border: '1px solid rgba(239, 68, 68, 0.5)', 
          borderRadius: '10px', 
          padding: '1.1rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} color="#ef4444" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f87171' }}>
                CURRENT CONGESTED CORRIDOR
              </span>
            </div>
            <span className="cyber-badge cyber-badge-red" style={{ fontSize: '0.65rem' }}>
              AVOID / BOTTLENECK
            </span>
          </div>

          <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Gate A Plaza ➔ Arena Central Concourse
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', margin: '0.8rem 0' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem', borderRadius: '6px' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>DENSITY</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444' }}>
                {arenaZone.density} p/m²
              </div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem', borderRadius: '6px' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>WAIT TIME</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444' }}>
                18 - 22 min
              </div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem', borderRadius: '6px' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>VELOCITY</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444' }}>
                0.35 m/s
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Severe bidirectional stagnation occurring at Arena Floor entrance. High crowd crush vulnerability if inflow continues.
          </p>
        </div>

        {/* AI Recommended Route */}
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.08)', 
          border: '1px solid rgba(16, 185, 129, 0.5)', 
          borderRadius: '10px', 
          padding: '1.1rem',
          boxShadow: 'var(--glow-emerald)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="#10b981" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>
                AI RECOMMENDED RELIEF CORRIDOR
              </span>
            </div>
            <span className="cyber-badge cyber-badge-emerald" style={{ fontSize: '0.65rem' }}>
              OPTIMAL FLOW
            </span>
          </div>

          <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
            West Egress Bypass ➔ Gates W1 - W3
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', margin: '0.8rem 0' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem', borderRadius: '6px' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>DENSITY</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>
                {westZone.density} p/m²
              </div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem', borderRadius: '6px' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>WAIT TIME</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>
                &lt; 3 min
              </div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem', borderRadius: '6px' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>VELOCITY</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>
                1.25 m/s
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Underutilized corridor with 3 open automated double gates. Rerouting reduces arena choke pressure by <strong>42%</strong>.
          </p>
        </div>
      </div>

      {/* Reroute Execution Stepper */}
      <div style={{ background: 'rgba(10, 17, 32, 0.7)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <div className="font-mono" style={{ fontSize: '0.72rem', color: '#38bdf8', marginBottom: '0.65rem' }}>
          AUTOMATED EVACUATION & DIVERSION WORKFLOW:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>1</span>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>Digital Signage Inversion</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Overhead displays flip directional arrows towards West Corridors.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>2</span>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>Mobile Geo-Fenced Push</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Attendees in Sector Arena receive haptic routing notification.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>3</span>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>Turnstile Metering</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Gate A turnstiles slow intake by 60% to dissipate backpressure.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
