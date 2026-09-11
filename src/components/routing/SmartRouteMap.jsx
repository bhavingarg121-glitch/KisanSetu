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
            <Navigation size={18} color="var(--accent-gold)" />
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              SMART WAYFINDING & DYNAMIC EVACUATION REROUTING
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
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
          border: '1px solid rgba(239, 68, 68, 0.4)', 
          borderRadius: '16px', 
          padding: '1.25rem',
          boxShadow: 'var(--shadow-glass)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} color="#dc2626" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#dc2626' }}>
                CURRENT CONGESTED CORRIDOR
              </span>
            </div>
            <span className="cyber-badge cyber-badge-red" style={{ fontSize: '0.65rem' }}>
              AVOID / BOTTLENECK
            </span>
          </div>

          <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Gate A Plaza ➔ Arena Central Concourse
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', margin: '0.8rem 0' }}>
            <div style={{ background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>DENSITY</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#dc2626' }}>
                {arenaZone.density} p/m²
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>WAIT TIME</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#dc2626' }}>
                18 - 22 min
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>VELOCITY</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#dc2626' }}>
                0.22 m/s
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            High compression observed. Recommend immediate flow diversion to prevent macroscopic pressure wave.
          </p>
        </div>

        {/* Recommended Bypass Route */}
        <div style={{ 
          background: 'rgba(5, 150, 105, 0.08)', 
          border: '1px solid rgba(5, 150, 105, 0.4)', 
          borderRadius: '16px', 
          padding: '1.25rem',
          boxShadow: 'var(--shadow-glass)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="#059669" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                AI RECOMMENDED RELIEF CORRIDOR
              </span>
            </div>
            <span className="cyber-badge cyber-badge-emerald" style={{ fontSize: '0.65rem' }}>
              OPTIMAL FLOW
            </span>
          </div>

          <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            West Egress Bypass ➔ Gates W1 - W3
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', margin: '0.8rem 0' }}>
            <div style={{ background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>DENSITY</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669' }}>
                {westZone.density} p/m²
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>WAIT TIME</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669' }}>
                &lt; 3 min
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>VELOCITY</div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669' }}>
                1.25 m/s
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Underutilized corridor with 3 open automated double gates. Rerouting reduces arena choke pressure by <strong>42%</strong>.
          </p>
        </div>
      </div>

      {/* Reroute Execution Stepper */}
      <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
        <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', marginBottom: '0.65rem', fontWeight: 700 }}>
          AUTOMATED EVACUATION & DIVERSION WORKFLOW:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>1</span>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>Digital Signage Inversion</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Overhead displays flip directional arrows towards West Corridors.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>2</span>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>Mobile Geo-Fenced Push</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Attendees in Sector Arena receive haptic routing notification.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>3</span>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>Turnstile Metering</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Gate A turnstiles slow intake by 60% to dissipate backpressure.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
