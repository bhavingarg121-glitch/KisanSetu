import React from 'react';
import { Sparkles, Shield, ArrowRight, Activity, Compass, Users } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

export function GoldenAuraHero({ onNavigate }) {
  const { totalHeadcount, overallOccupancyPct, compositeSriResult } = useCrowdData();

  const services = [
    {
      title: 'Grand Ballroom & Pavilion',
      subtitle: 'Luxury Capacity & Spatial Density',
      description: 'Multi-zone spatial heatmapping tracking micro-clusters and preventing bottleneck thresholds.',
      icon: Users,
      metric: `${overallOccupancyPct}% Capacity`,
      accent: 'var(--accent-gold)'
    },
    {
      title: 'Concourse & Turnstiles',
      subtitle: 'AI Optical Flow & Throughput',
      description: 'Single-use cryptographic QR validation preventing gate surges and pass duplication.',
      icon: Activity,
      metric: 'Fluid Flow',
      accent: '#059669'
    },
    {
      title: 'VIP & Emergency Corridors',
      subtitle: 'Dynamic Evacuation Routing',
      description: 'Autonomous Dijkstra rerouting with intelligent digital signage inversion.',
      icon: Compass,
      metric: 'Zero Hazard',
      accent: '#0284c7'
    }
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Top Luxury Banner inspired by Golden Aura Referral */}
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          padding: '2.5rem 2.5rem',
          borderRadius: '28px',
          overflow: 'hidden',
          marginBottom: '2rem',
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-glass)'
        }}
      >
        {/* Soft background ambient gradient */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.05) 50%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)'
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="cyber-badge cyber-badge-gold" style={{ padding: '0.35rem 0.9rem', fontSize: '0.78rem' }}>
                <Sparkles size={13} color="var(--accent-gold)" />
                Golden Aura Architecture
              </span>
              <span className="cyber-badge cyber-badge-emerald" style={{ padding: '0.35rem 0.9rem', fontSize: '0.78rem' }}>
                <Shield size={13} color="#059669" />
                Live AI Safeguards Active
              </span>
            </div>

            <h1 className="font-display" style={{ 
              fontSize: '2.4rem', 
              fontWeight: 800, 
              lineHeight: 1.2, 
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Host <span className="text-gold-gradient">Unforgettable Events</span> With Absolute Safety & Style
            </h1>

            <p style={{ 
              fontSize: '1.02rem', 
              lineHeight: 1.6, 
              color: 'var(--text-secondary)', 
              maxWidth: '560px',
              marginBottom: '1.75rem' 
            }}>
              Luxury galas, packed amphitheaters, and premier exhibitions planned with elegance and monitored with sub-second AI spatial density, SRI stampede prediction, and dynamic turnstile metering.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              <button 
                className="cyber-btn cyber-btn-primary" 
                onClick={() => onNavigate && onNavigate('simulation')}
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.9rem', letterSpacing: '0.01em' }}
              >
                <span>Simulate Surge Scenario</span>
                <ArrowRight size={16} />
              </button>

              <button 
                className="cyber-btn" 
                onClick={() => onNavigate && onNavigate('ticketing')}
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
              >
                <span>Issue Holographic Passes</span>
              </button>

              <button 
                className="cyber-btn" 
                onClick={() => onNavigate && onNavigate('emergency')}
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', borderColor: 'rgba(220, 38, 38, 0.3)', color: '#dc2626' }}
              >
                <span>Emergency Broadcast</span>
              </button>
            </div>
          </div>

          {/* Arched Architectural Visual Container inspired by Referral */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{
                width: '100%',
                maxWidth: '420px',
                borderRadius: '36px 36px 24px 24px',
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid var(--border-glass)',
                boxShadow: 'var(--shadow-hover)',
                backdropFilter: 'blur(20px)',
                position: 'relative'
              }}
            >
              {/* Inner frame with luxury venue representation */}
              <div 
                style={{
                  borderRadius: '28px 28px 18px 18px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
                  padding: '1.5rem',
                  border: '1px solid rgba(217, 119, 6, 0.25)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    LIVE VENUE TELEMETRY
                  </div>
                  <span className="cyber-badge cyber-badge-gold">
                    SRI {compositeSriResult.sri}%
                  </span>
                </div>

                <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                  <div className="font-display" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {totalHeadcount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.2rem' }}>
                    Patrons Actively Monitored Across All Sectors
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.7)', padding: '0.75rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.8)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CCTV SENSORS</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>4 4K Streams</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.7)', padding: '0.75rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.8)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SAFETY STATUS</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>Optimal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: "Our Safe Sectors" (Directly mirroring the referral's "Our Services" 3-card layout) */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Crowd Management Architecture
          </span>
          <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-gold)', marginTop: '0.25rem' }}>
            Our Monitored Sectors & Safety Services
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  boxShadow: 'var(--shadow-glass)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '16px',
                      background: 'rgba(217, 119, 6, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(217, 119, 6, 0.25)'
                    }}>
                      <Icon size={22} color="var(--accent-gold)" />
                    </div>

                    <span className="cyber-badge cyber-badge-gold" style={{ fontSize: '0.7rem' }}>
                      {item.metric}
                    </span>
                  </div>

                  <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h3>

                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
                    {item.subtitle}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    AI Guard Matrix
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Active Telemetry →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
