import React, { useState } from 'react';
import { QrCode, CheckCircle2, XCircle, AlertTriangle, Scan, ShieldAlert, History } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

export function QRScannerTerminal() {
  const { handleScanTicket, turnstileStats } = useCrowdData();
  const [scanInput, setScanInput] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([
    { id: 'TKT-8841-VIP', name: 'Elena Rostova', status: 'GRANTED', gate: 'Turnstile 01', time: '01:44:12' },
    { id: 'TKT-7729-GEN', name: 'Marcus Chen', status: 'DUPLICATE', gate: 'Turnstile 02', time: '01:42:08' },
    { id: 'TKT-9912-STF', name: 'Sarah Jenkins', status: 'GRANTED', gate: 'Staff Turnstile', time: '01:39:55' }
  ]);

  const executeScan = (codeToScan) => {
    const code = codeToScan || scanInput;
    if (!code) return;

    const res = handleScanTicket(code);
    setLastResult(res);

    const historyEntry = {
      id: res.ticket?.id || code,
      name: res.ticket?.attendee || 'Unknown Attendee',
      status: res.status,
      gate: 'Turnstile 03 (North Gate)',
      time: new Date().toLocaleTimeString()
    };

    setScanHistory(prev => [historyEntry, ...prev.slice(0, 7)]);
    setScanInput('');
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Scan size={18} color="var(--accent-gold)" />
          <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            TURNSTILE SECURITY SCANNER TERMINAL (GATE NORTH-A)
          </span>
        </div>

        <div className="cyber-badge cyber-badge-emerald" style={{ fontSize: '0.72rem' }}>
          Turnstile Flap: ARMED & ACTIVE
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Scanner Input & Quick Simulation buttons */}
        <div>
          <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
            <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              SCAN OR INPUT PASS QR PAYLOAD
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <input
                type="text"
                placeholder="Scan QR or enter TKT-XXXX-XXX..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeScan()}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.95rem',
                  background: 'var(--bg-card-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
              <button
                onClick={() => executeScan()}
                className="cyber-btn cyber-btn-primary"
                style={{ padding: '0.75rem 1.25rem' }}
              >
                Scan Pass
              </button>
            </div>

            {/* Quick Test Presets */}
            <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              QUICK VALIDATION TEST CODES:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <button
                onClick={() => executeScan('TKT-8841-VIP')}
                className="cyber-btn"
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem', borderColor: '#059669', color: '#059669' }}
              >
                ✓ Valid VIP Pass
              </button>
              <button
                onClick={() => executeScan('TKT-7729-GEN')}
                className="cyber-btn"
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem', borderColor: '#dc2626', color: '#dc2626' }}
              >
                ⚠️ Duplicate Used Pass
              </button>
              <button
                onClick={() => executeScan('TKT-9999-FAKE')}
                className="cyber-btn"
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem', borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}
              >
                ✕ Unrecognized Ticket
              </button>
            </div>
          </div>

          {/* Turnstile throughput card */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>GATE INGRESS RATE</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>
                {turnstileStats.entriesPerMin} <span style={{ fontSize: '0.68rem' }}>pax/min</span>
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>BLOCKED / FRAUD</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#dc2626' }}>
                {turnstileStats.deniedToday} <span style={{ fontSize: '0.68rem' }}>attempts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Scan Gate Result Monitor */}
        <div style={{ 
          background: lastResult?.status === 'GRANTED' 
            ? 'rgba(5, 150, 105, 0.12)' 
            : lastResult?.status === 'DUPLICATE' 
            ? 'rgba(220, 38, 38, 0.12)' 
            : 'var(--bg-card)',
          border: `1.5px solid ${lastResult?.status === 'GRANTED' ? '#059669' : lastResult?.status === 'DUPLICATE' ? '#dc2626' : 'var(--border-subtle)'}`,
          borderRadius: '20px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: 'var(--shadow-glass)'
        }}>
          {lastResult ? (
            <div>
              {lastResult.status === 'GRANTED' ? (
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.2)', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={42} color="#059669" />
                </div>
              ) : (
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(220, 38, 38, 0.2)', marginBottom: '0.75rem' }}>
                  <XCircle size={42} color="#dc2626" />
                </div>
              )}

              <div className="font-display" style={{ 
                fontSize: '1.35rem', 
                fontWeight: 700, 
                color: lastResult.status === 'GRANTED' ? '#059669' : '#dc2626',
                marginBottom: '0.4rem'
              }}>
                {lastResult.status === 'GRANTED' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.3rem' }}>
                {lastResult.message}
              </div>

              {lastResult.ticket && (
                <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  [{lastResult.ticket.id}] • {lastResult.ticket.tier} • {lastResult.ticket.gate}
                </div>
              )}

              <div style={{ 
                marginTop: '1rem', 
                padding: '0.45rem 1rem', 
                borderRadius: '9999px', 
                background: lastResult.status === 'GRANTED' ? '#059669' : '#dc2626',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                {lastResult.status === 'GRANTED' ? 'TURNSTILE BARRIER UNLOCKED (3 SEC)' : 'BARRIER LOCKED - ALERT DISPATCHED'}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>
              <Scan size={38} color="var(--accent-gold)" style={{ margin: '0 auto 0.75rem', opacity: 0.85 }} />
              <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>Awaiting Turnstile Pass Scan</div>
              <div style={{ fontSize: '0.78rem' }}>Scan attendee barcode / NFC ticket to verify admission</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scan History */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
          <History size={15} color="var(--accent-gold)" />
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            RECENT TURNSTILE SCAN AUDIT TRAIL
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.5rem' }}>PASS ID</th>
                <th style={{ padding: '0.5rem' }}>ATTENDEE</th>
                <th style={{ padding: '0.5rem' }}>GATE</th>
                <th style={{ padding: '0.5rem' }}>STATUS</th>
                <th style={{ padding: '0.5rem' }}>TIME</th>
              </tr>
            </thead>
            <tbody>
              {scanHistory.map((h, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', fontWeight: 600 }}>{h.id}</td>
                  <td style={{ padding: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{h.name}</td>
                  <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{h.gate}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <span className={`cyber-badge ${h.status === 'GRANTED' ? 'cyber-badge-emerald' : 'cyber-badge-red'}`} style={{ fontSize: '0.65rem' }}>
                      {h.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{h.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
