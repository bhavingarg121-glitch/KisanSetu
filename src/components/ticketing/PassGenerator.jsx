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
        <Ticket size={18} color="#00f0ff" />
        <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
          DIGITAL QR TICKET PASS ISSUANCE
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Pass Creator Form */}
        <form onSubmit={handleCreatePass} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
              ATTENDEE FULL NAME
            </label>
            <input
              type="text"
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: '#070c17',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                ACCESS TIER
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  background: '#070c17',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.85rem'
                }}
              >
                <option value="VIP Access">VIP Access</option>
                <option value="General Admission">General Admission</option>
                <option value="Security / Field Staff">Security / Field Staff</option>
              </select>
            </div>

            <div>
              <label className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                GATE ASSIGNMENT
              </label>
              <select
                value={gate}
                onChange={(e) => setGate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  background: '#070c17',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
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
            <label className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
              SEAT / SECTOR DESIGNATION
            </label>
            <input
              type="text"
              value={seat}
              onChange={(e) => setSeat(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: '#070c17',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                color: '#f8fafc',
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
            background: 'linear-gradient(135deg, rgba(14, 116, 144, 0.25), rgba(15, 23, 42, 0.95))', 
            border: '1px solid #38bdf8', 
            borderRadius: '12px', 
            padding: '1.25rem',
            boxShadow: '0 8px 30px rgba(56, 189, 248, 0.25)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={16} color="#00f0ff" />
                  <span className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                    CROWDGUARD PASS
                  </span>
                </div>
                <span className="cyber-badge cyber-badge-emerald" style={{ fontSize: '0.65rem' }}>
                  VERIFIED TICKET
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                {qrDataUrl && (
                  <div style={{ background: '#ffffff', padding: '6px', borderRadius: '8px', flexShrink: 0 }}>
                    <img 
                      src={qrDataUrl} 
                      alt="Ticket QR Code" 
                      style={{ width: '120px', height: '120px', display: 'block' }} 
                    />
                  </div>
                )}

                <div>
                  <div className="font-mono" style={{ fontSize: '0.72rem', color: '#00f0ff', fontWeight: 700 }}>
                    {generatedPass.id}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: '0.2rem 0' }}>
                    {generatedPass.attendee}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    <strong>Tier:</strong> {generatedPass.tier}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    <strong>Entry:</strong> {generatedPass.gate}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {generatedPass.seat}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                SECURE SHA-256 ENCRYPTED
              </span>
              <a
                href={qrDataUrl}
                download={`${generatedPass.id}.png`}
                className="cyber-btn"
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem', background: 'rgba(56, 189, 248, 0.2)', borderColor: '#38bdf8' }}
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
