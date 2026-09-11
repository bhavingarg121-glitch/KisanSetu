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
          <Scan size={18} color="#10b981" />
          <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
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
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
            <label className="font-mono" style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>
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
                  padding: '0.65rem 0.85rem',
                  background: '#070c17',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.85rem'
                }}
              />
              <button
                onClick={() => executeScan()}
                className="cyber-btn cyber-btn-primary"
                style={{ padding: '0.65rem 1.1rem' }}
              >
                Scan Pass
              </button>
            </div>

            {/* Quick Test Presets */}
            <div className="font-mono" style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '0.4rem' }}>
              QUICK VALIDATION TEST CODES:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <button
                onClick={() => executeScan('TKT-8841-VIP')}
                className="cyber-btn"
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', borderColor: '#10b981' }}
              >
                ✓ Valid VIP Pass
              </button>
              <button
                onClick={() => executeScan('TKT-7729-GEN')}
                className="cyber-btn"
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', borderColor: '#ef4444' }}
              >
                ⚠️ Duplicate Used Pass
              </button>
              <button
                onClick={() => executeScan('TKT-9999-FAKE')}
                className="cyber-btn"
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', borderColor: '#f59e0b' }}
              >
                ✕ Unrecognized Ticket
              </button>
            </div>
          </div>

          {/* Turnstile throughput card */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>GATE INGRESS RATE</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>
                {turnstileStats.entriesPerMin} <span style={{ fontSize: '0.68rem' }}>pax/min</span>
              </div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>BLOCKED / FRAUD</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f87171' }}>
                {turnstileStats.deniedToday} <span style={{ fontSize: '0.68rem' }}>attempts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Scan Gate Result Monitor */}
        <div style={{ 
          background: lastResult?.status === 'GRANTED' 
            ? 'rgba(16, 185, 129, 0.12)' 
            : lastResult?.status === 'DUPLICATE' 
            ? 'rgba(239, 68, 68, 0.15)' 
            : 'rgba(15, 23, 42, 0.8)',
          border: `1.5px solid ${lastResult?.status === 'GRANTED' ? '#10b981' : lastResult?.status === 'DUPLICATE' ? '#ef4444' : 'var(--border-subtle)'}`,
          borderRadius: '10px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {lastResult ? (
            <div>
              {lastResult.status === 'GRANTED' ? (
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={42} color="#10b981" />
                </div>
              ) : (
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', marginBottom: '0.75rem' }}>
                  <XCircle size={42} color="#ef4444" />
                </div>
              )}

              <div className="font-display" style={{ 
                fontSize: '1.35rem', 
                fontWeight: 700, 
                color: lastResult.status === 'GRANTED' ? '#34d399' : '#f87171',
                marginBottom: '0.4rem'
              }}>
                {lastResult.status === 'GRANTED' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600, marginBottom: '0.3rem' }}>
                {lastResult.message}
              </div>

              {lastResult.ticket && (
                <div className="font-mono" style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                  [{lastResult.ticket.id}] • {lastResult.ticket.tier} • {lastResult.ticket.gate}
                </div>
              )}

              <div style={{ 
                marginTop: '1rem', 
                padding: '0.4rem 0.85rem', 
                borderRadius: '6px', 
                background: lastResult.status === 'GRANTED' ? '#065f46' : '#7f1d1d',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}>
                {lastResult.status === 'GRANTED' ? 'TURNSTILE BARRIER UNLOCKED (3 SEC)' : 'BARRIER LOCKED - ALERT DISPATCHED'}
              </div>
            </div>
          ) : (
            <div style={{ color: '#64748b' }}>
              <Scan size={38} color="#38bdf8" style={{ margin: '0 auto 0.75rem', opacity: 0.7 }} />
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Awaiting Turnstile Pass Scan</div>
              <div style={{ fontSize: '0.75rem' }}>Scan attendee barcode / NFC ticket to verify admission</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scan History */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
          <History size={15} color="#38bdf8" />
          <span className="font-mono" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            RECENT TURNSTILE SCAN AUDIT TRAIL
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b', color: '#64748b' }}>
                <th style={{ padding: '0.5rem' }}>PASS ID</th>
                <th style={{ padding: '0.5rem' }}>ATTENDEE</th>
                <th style={{ padding: '0.5rem' }}>GATE</th>
                <th style={{ padding: '0.5rem' }}>STATUS</th>
                <th style={{ padding: '0.5rem' }}>TIME</th>
              </tr>
            </thead>
            <tbody>
              {scanHistory.map((h, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.4)' }}>
                  <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{h.id}</td>
                  <td style={{ padding: '0.5rem', fontWeight: 600, color: '#f8fafc' }}>{h.name}</td>
                  <td style={{ padding: '0.5rem', color: '#94a3b8' }}>{h.gate}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <span className={`cyber-badge ${h.status === 'GRANTED' ? 'cyber-badge-emerald' : 'cyber-badge-red'}`} style={{ fontSize: '0.65rem' }}>
                      {h.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>{h.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
