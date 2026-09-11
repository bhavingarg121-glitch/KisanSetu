import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle2, ShieldCheck, Trash2, Send } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

export function AlertsPanel({ onDispatchClick }) {
  const { alerts, acknowledgeAlert, clearAllAlerts } = useCrowdData();
  const [filter, setFilter] = useState('ALL'); // ALL, CRITICAL, UNREAD

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'CRITICAL') return a.severity === 'CRITICAL';
    if (filter === 'UNREAD') return !a.acknowledged;
    return true;
  });

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={18} color="var(--accent-gold)" />
          <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            REAL-TIME INCIDENT & SURGE ALERTS ({alerts.length})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {['ALL', 'UNREAD', 'CRITICAL'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="cyber-btn"
              style={{
                fontSize: '0.72rem',
                padding: '0.25rem 0.55rem',
                background: filter === f ? 'rgba(217, 119, 6, 0.18)' : 'transparent',
                borderColor: filter === f ? 'var(--accent-gold)' : 'var(--border-subtle)',
                color: filter === f ? 'var(--accent-gold)' : 'var(--text-primary)'
              }}
            >
              {f}
            </button>
          ))}

          {alerts.length > 0 && (
            <button
              onClick={clearAllAlerts}
              className="cyber-btn"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', color: 'var(--text-secondary)' }}
              title="Clear all alerts"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
          <ShieldCheck size={32} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>No active incident alerts in this filter.</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All perimeter sectors are operating within standard tolerance.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredAlerts.map(alert => {
            const isCrit = alert.severity === 'CRITICAL';
            const isWarn = alert.severity === 'WARNING';
            const badgeClass = isCrit ? 'cyber-badge-red' : isWarn ? 'cyber-badge-amber' : 'cyber-badge-blue';

            return (
              <div
                key={alert.id}
                style={{
                  background: isCrit ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.55)',
                  border: `1px solid ${isCrit ? '#ef444460' : isWarn ? '#f59e0b50' : 'var(--border-subtle)'}`,
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  opacity: alert.acknowledged ? 0.75 : 1
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <span className={`cyber-badge ${badgeClass}`}>
                      {alert.severity}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {alert.time}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                      [{alert.zoneName}]
                    </span>
                    {alert.acknowledged && (
                      <span className="cyber-badge cyber-badge-emerald" style={{ fontSize: '0.62rem' }}>
                        ACKNOWLEDGED
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    {alert.title}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    {alert.message}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flexShrink: 0 }}>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="cyber-btn cyber-btn-emerald"
                      style={{ fontSize: '0.7rem', padding: '0.3rem 0.55rem' }}
                    >
                      <CheckCircle2 size={13} />
                      Acknowledge
                    </button>
                  )}

                  {onDispatchClick && (
                    <button
                      onClick={onDispatchClick}
                      className="cyber-btn"
                      style={{ fontSize: '0.7rem', padding: '0.3rem 0.55rem', background: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8' }}
                    >
                      <Send size={12} color="#38bdf8" />
                      Dispatch
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
