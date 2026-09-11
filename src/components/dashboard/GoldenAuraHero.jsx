import React from 'react';
import { Sparkles, Shield, ArrowRight, Activity, Users, Radio, CheckCircle2 } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

export function GoldenAuraHero({ onNavigate }) {
  const { totalHeadcount, overallOccupancyPct, compositeSriResult, turnstileStats } = useCrowdData();

  const services = [
    {
      title: 'Luxury Weddings',
      subtitle: 'VIP Gatherings & Galas',
      description: 'Elegant weddings with premium décor, guest capacity tracking and flawless spatial planning.',
      image: './assets/luxury_weddings.jpg',
      badge: 'Zero Congestion',
      metric: 'Max Capacity: 1,200',
      actionTab: 'routing'
    },
    {
      title: 'Corporate Events',
      subtitle: 'Global Summits & Conventions',
      description: 'Professional conferences, launches, summits and intelligent gate turnstile metering.',
      image: './assets/corporate_events.jpg',
      badge: 'Fluid Flow',
      metric: `${turnstileStats.entriesPerMin} pax/min ingress`,
      actionTab: 'ticketing'
    },
    {
      title: 'Birthday Parties & Concerts',
      subtitle: 'High-Density Arenas & Live Stages',
      description: 'Creative celebrations tailored to large crowds with dynamic evacuation paths and surge mitigation.',
      image: './assets/birthday_parties.jpg',
      badge: `SRI ${compositeSriResult.sri}% Safe`,
      metric: `${overallOccupancyPct}% Occupancy`,
      actionTab: 'prediction'
    }
  ];

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Hero Section directly matching the Golden Aura Referral Layout */}
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          padding: '3rem 3rem',
          borderRadius: '32px',
          overflow: 'hidden',
          marginBottom: '2.5rem',
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-glass)'
        }}
      >
        {/* Soft background ambient radial lighting */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(217, 119, 6, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)'
        }} />

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '3rem', 
          alignItems: 'center', 
          position: 'relative', 
          zIndex: 1 
        }}>
          {/* Left Column: Typography & Pill Action Button */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <span className="cyber-badge cyber-badge-gold" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                <Sparkles size={14} color="var(--accent-gold)" />
                Golden Aura Crowd Safety Architecture
              </span>
            </div>

            <h1 className="font-display" style={{ 
              fontSize: '3.1rem', 
              fontWeight: 800, 
              lineHeight: 1.15, 
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em'
            }}>
              Create<br />
              <span className="text-gold-gradient">Unforgettable Events With</span><br />
              Style & Safety
            </h1>

            <p style={{ 
              fontSize: '1.05rem', 
              lineHeight: 1.65, 
              color: 'var(--text-secondary)', 
              maxWidth: '520px',
              marginBottom: '2rem' 
            }}>
              Luxury weddings, corporate events, birthday celebrations and grand experiences planned with elegance and protected with real-time AI crowd density, stampede prevention, and turnstile intelligence.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {/* Golden Pill CTA matching "Book Consultation" */}
              <button 
                className="cyber-btn cyber-btn-primary" 
                onClick={() => onNavigate && onNavigate('simulation')}
                style={{ 
                  padding: '0.85rem 1.85rem', 
                  fontSize: '0.95rem', 
                  letterSpacing: '0.01em',
                  boxShadow: 'var(--glow-gold)'
                }}
              >
                <span>Book Safety Consultation</span>
                <ArrowRight size={17} />
              </button>

              <button 
                className="cyber-btn" 
                onClick={() => onNavigate && onNavigate('ticketing')}
                style={{ 
                  padding: '0.85rem 1.6rem', 
                  fontSize: '0.95rem',
                  background: 'rgba(255, 255, 255, 0.75)'
                }}
              >
                <span>Issue Digital QR Passes</span>
              </button>

              <button 
                className="cyber-btn" 
                onClick={() => onNavigate && onNavigate('emergency')}
                style={{ 
                  padding: '0.85rem 1.5rem', 
                  fontSize: '0.95rem',
                  borderColor: 'rgba(220, 38, 38, 0.35)', 
                  color: '#dc2626' 
                }}
              >
                <span>Emergency Broadcast</span>
              </button>
            </div>
          </div>

          {/* Right Column: Arched Architectural Venue Visual (Direct match to referral's right photo) */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{
                width: '100%',
                maxWidth: '460px',
                borderRadius: '42px 42px 28px 28px',
                padding: '0.85rem',
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1.5px solid var(--border-glass)',
                boxShadow: 'var(--shadow-hover)',
                backdropFilter: 'blur(24px)',
                position: 'relative'
              }}
            >
              {/* Arched Venue Image Container */}
              <div 
                style={{
                  borderRadius: '34px 34px 20px 20px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '340px',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)'
                }}
              >
                <img 
                  src="./assets/hero_ballroom.jpg" 
                  alt="Golden Aura Grand Ballroom" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s ease'
                  }}
                />

                {/* Overlaid Live AI Telemetry Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(16px)',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}>
                  <Radio size={13} color="#059669" className="pulse-threat" />
                  <span className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    LIVE VENUE AI ACTIVE
                  </span>
                </div>

                {/* Overlaid Floating Metrics Glass Card */}
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  padding: '1rem 1.25rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 10px 28px rgba(0, 0, 0, 0.12)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      ACTIVE VENUE HEADCOUNT
                    </div>
                    <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {totalHeadcount.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600 }}>({overallOccupancyPct}%)</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="cyber-badge cyber-badge-emerald" style={{ fontSize: '0.68rem' }}>
                      <CheckCircle2 size={12} />
                      Zero Bottlenecks
                    </span>
                    <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      SRI: {compositeSriResult.sri}% Optimal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Our Services" Section (Directly mirroring the 3-card layout of the referral image) */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="font-display" style={{ 
            fontSize: '2.2rem', 
            fontWeight: 800, 
            color: 'var(--accent-gold)', 
            letterSpacing: '-0.01em'
          }}>
            Our Services
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Tailored crowd safety architecture engineered for luxury celebrations, summits, and grand entertainment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
          {services.map((item, idx) => (
            <div 
              key={idx}
              className="glass-panel"
              style={{
                borderRadius: '26px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-glass)',
                boxShadow: 'var(--shadow-glass)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onClick={() => onNavigate && onNavigate(item.actionTab)}
            >
              {/* Card Photo matching the referral cards */}
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px'
                }}>
                  <span className="cyber-badge cyber-badge-gold" style={{ 
                    background: 'rgba(255, 255, 255, 0.88)', 
                    backdropFilter: 'blur(10px)',
                    fontSize: '0.68rem',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Card Content with warm golden typography */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <h3 className="font-display" style={{ 
                    fontSize: '1.35rem', 
                    fontWeight: 700, 
                    color: 'var(--accent-gold)', 
                    marginBottom: '0.5rem',
                    textAlign: 'center'
                  }}>
                    {item.title}
                  </h3>

                  <p style={{ 
                    fontSize: '0.88rem', 
                    color: 'var(--text-secondary)', 
                    lineHeight: 1.55, 
                    textAlign: 'center',
                    marginBottom: '1.25rem' 
                  }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ 
                  paddingTop: '0.85rem', 
                  borderTop: '1px solid var(--border-subtle)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {item.metric}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Open Module →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
