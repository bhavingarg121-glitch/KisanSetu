import React, { useState, useEffect } from 'react';
import { Smartphone, Navigation, QrCode, AlertTriangle, ShieldCheck, MapPin, Compass, Info } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';
import { generateQRCodeDataURL } from '../../services/qrService';

export function AttendeePortal() {
  const { emergencyLevel, broadcastMessage, zones } = useCrowdData();
  const [qrUrl, setQrUrl] = useState('');

  const westZone = zones.find(z => z.id === 'zone-west-concourse') || zones[2];
  const arenaZone = zones.find(z => z.id === 'zone-arena-bowl') || zones[1];

  useEffect(() => {
    generateQRCodeDataURL({
      id: 'TKT-8841-VIP',
      attendee: 'Elena Rostova',
      tier: 'VIP Access',
      gate: 'Gate VIP-1',
      seat: 'Section A - Row 04'
    }).then(setQrUrl);
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Smartphone size={18} color="var(--accent-gold)" />
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ATTENDEE MOBILE PASS & SAFE WAYFINDING COMPANION
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Mobile web app companion distributed to ticket holders via SMS/WhatsApp for frictionless entry and stampede evasion.
          </p>
        </div>

        <span className="cyber-badge cyber-badge-gold" style={{ fontSize: '0.72rem' }}>
          Attendee Viewport: Mobile (390 x 780)
        </span>
      </div>

      {/* Center the smartphone frame */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
        <div style={{ 
          width: '380px', 
          background: '#0a0f1d', 
          border: '4px solid #1e293b', 
          borderRadius: '36px', 
          boxShadow: 'var(--shadow-hover)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Phone Speaker & Camera Notch */}
          <div style={{ background: '#070c17', padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-mono" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>01:45</span>
            <div style={{ width: '90px', height: '14px', background: '#1e293b', borderRadius: '10px' }} />
            <span className="font-mono" style={{ fontSize: '0.65rem', color: '#10b981' }}>5G ● 98%</span>
          </div>

          {/* Emergency Alert Banner inside App if active */}
          {emergencyLevel !== 'NORMAL' && (
            <div style={{ 
              background: emergencyLevel === 'CRITICAL_EVACUATION' ? '#dc2626' : '#d97706', 
              padding: '0.65rem 0.85rem',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertTriangle size={16} />
              <div>
                <div>SAFETY ALERT: {emergencyLevel}</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 500 }}>
                  {broadcastMessage || 'Please proceed towards designated green exits calmly.'}
                </div>
              </div>
            </div>
          )}

          {/* Mobile App Header */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                  CROWDPULSE COMPANION
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Welcome, Elena Rostova</div>
              </div>
              <span className="cyber-badge cyber-badge-emerald" style={{ fontSize: '0.62rem' }}>
                LIVE SECURE
              </span>
            </div>
          </div>

          {/* Mobile Body Content */}
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto', maxHeight: '520px' }}>
            {/* Digital Pass Card */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.22), #0f172a)', 
              borderRadius: '16px', 
              padding: '1rem', 
              border: '1px solid #d97706',
              boxShadow: '0 8px 20px rgba(217, 119, 6, 0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="font-mono" style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>
                  TKT-8841-VIP
                </span>
                <span className="cyber-badge cyber-badge-gold" style={{ fontSize: '0.6rem' }}>
                  VIP ACCESS
                </span>
              </div>

              {qrUrl && (
                <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                  <img 
                    src={qrUrl} 
                    alt="Attendee QR" 
                    style={{ width: '130px', height: '130px', margin: '0 auto', borderRadius: '8px', background: '#fff', padding: '6px' }} 
                  />
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                    Scan at Gate VIP-1 (Northwest)
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', paddingTop: '0.4rem', borderTop: '1px solid #334155' }}>
                <span><strong>Section:</strong> A - Row 04</span>
                <span><strong>Seat:</strong> 18</span>
              </div>
            </div>

            {/* Smart Safe Route Navigation Card */}
            <div style={{ background: '#0f172a', borderRadius: '12px', padding: '0.85rem', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Navigation size={14} color="#10b981" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                  LIVE SAFE ROUTE FINDER
                </span>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.65rem' }}>
                AI real-time crowd avoidance path to transit & exits:
              </div>

              {/* Recommended Exit */}
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', padding: '0.6rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>
                    ✓ West Exit Walkway (Gate W1)
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: '#34d399' }}>
                    &lt; 3 min wait
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                  Density: {westZone.density} p/m² • Completely uncrowded
                </div>
              </div>

              {/* Congested Exit to Avoid */}
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef444450', borderRadius: '8px', padding: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f87171' }}>
                    ✕ Gate A Main Plaza
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: '#f87171' }}>
                    20+ min queue
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Heavy bottlenecking. Avoid until crowd dissipates.
                </div>
              </div>
            </div>

            {/* Amenities Crowd Status */}
            <div style={{ background: '#0f172a', borderRadius: '12px', padding: '0.85rem', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                SECTOR AMENITIES DENSITY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.7rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Restroom Block W-2</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>0 min queue (Low)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Water Refill Station 4</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>Available</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>East Food Hub</span>
                  <span style={{ color: '#fbbf24', fontWeight: 600 }}>Moderate (8m wait)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
