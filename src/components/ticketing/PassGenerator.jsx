import React, { useState, useEffect } from 'react';
import { QrCode, Sparkles, Download, Check, Ticket, User, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQRCodeDataURL, registerNewPass } from '../../services/qrService';

export function PassGenerator() {
  const [attendeeName, setAttendeeName] = useState('Elena Rostova');
  const [tier, setTier] = useState('VIP Access');
  const [zone, setZone] = useState('zone-arena-bowl');
  const [gate, setGate] = useState('Gate VIP-1');
  const [seat, setSeat] = useState('Section A - Row 04 - Seat 18');
  const [generatedPass, setGeneratedPass] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate initial pass on load
  useEffect(() => {
    handleCreatePass();
  }, []);

  const handleCreatePass = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    const passId = `TKT-${Math.floor(1000 + Math.random() * 9000)}-${tier.slice(0, 3).toUpperCase()}`;
    const payload = {
      id: passId,
      attendee: attendeeName,
      tier,
      zone,
      gate,
      seat,
      issuedAt: new Date().toISOString()
    };

    try {
      const dataUrl = await generateQRCodeDataURL(payload);
      setQrDataUrl(dataUrl);

      const registered = registerNewPass({
        id: passId,
        attendee: attendeeName,
        tier,
        zone,
        gate,
        seat
      });

      setGeneratedPass(registered);

      // Trigger celebratory confetti
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Ticket size={18} color="var(--accent-gold)" />
        <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          DIGITAL QR TICKET PASS ISSUANCE
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Pass Creator Form */}
        <form onSubmit={handleCreatePass} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
              ATTENDEE FULL NAME
            </label>
            <input
              type="text"
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 0.95rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                ACCESS TIER
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="VIP Access">VIP Access</option>
                <option value="General Admission">General Admission</option>
                <option value="Security / Field Staff">Security / Field Staff</option>
              </select>
            </div>

            <div>
              <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                GATE ASSIGNMENT
              </label>
              <select
                value={gate}
                onChange={(e) => setGate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Gate VIP-1">Gate VIP-1 (Northwest)</option>
                <option value="Gate North-A">Gate North-A (Turnstiles 1-6)</option>
                <option value="Gate West-B">Gate West-B (Egress Walkway)</option>
                <option value="Gate East-C">Gate East-C (Food Concourse)</option>
                <option value="Gate South-Transit">Gate South-Transit (Metro Link)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
              SEAT / SECTOR DESIGNATION
            </label>
            <input
              type="text"
              value={seat}
              onChange={(e) => setSeat(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.95rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="cyber-btn cyber-btn-primary"
            style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem' }}
          >
            <Sparkles size={16} />
            Generate Cryptographic Digital Pass
          </button>
        </form>

        {/* Holographic Rendered Pass Card */}
        {generatedPass && (
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12), var(--bg-card))', 
            border: '1px solid var(--accent-gold)', 
            borderRadius: '20px', 
            padding: '1.5rem',
            boxShadow: 'var(--shadow-hover)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={16} color="var(--accent-gold)" />
                  <span className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    CROWDPULSE PASS
                  </span>
                </div>
                <span className="cyber-badge cyber-badge-gold" style={{ fontSize: '0.65rem' }}>
                  VERIFIED TICKET
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1rem' }}>
                {qrDataUrl && (
                  <div style={{ background: '#ffffff', padding: '8px', borderRadius: '12px', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <img 
                      src={qrDataUrl} 
                      alt="Ticket QR Code" 
                      style={{ width: '120px', height: '120px', display: 'block' }} 
                    />
                  </div>
                )}

                <div>
                  <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    {generatedPass.id}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                    {generatedPass.attendee}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Tier:</strong> {generatedPass.tier}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Entry:</strong> {generatedPass.gate}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                    {generatedPass.seat}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                SECURE SHA-256 ENCRYPTED
              </span>
              <a
                href={qrDataUrl}
                download={`${generatedPass.id}.png`}
                className="cyber-btn"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem', background: 'rgba(217, 119, 6, 0.15)', borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}
              >
                <Download size={13} />
                Save Pass
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
