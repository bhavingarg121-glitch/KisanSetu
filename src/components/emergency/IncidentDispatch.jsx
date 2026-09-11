import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertCircle, CheckSquare, Square, Radio, Send } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

const INITIAL_UNITS = [
  { id: 'UNIT-ALPHA', name: 'Alpha Squad (Perimeter)', lead: 'Sgt. Vance', sector: 'Gate A - North Entry Plaza', status: 'ON SCENE', personnel: 8, radioChannel: 'CH-01' },
  { id: 'UNIT-BRAVO', name: 'Bravo Squad (Floor Marshall)', lead: 'Lt. Ramos', sector: 'Main Stage Arena Floor', status: 'ENGAGED', personnel: 12, radioChannel: 'CH-02' },
  { id: 'UNIT-CHARLIE', name: 'Charlie Squad (Corridor Control)', lead: 'Officer Wu', sector: 'West Egress Corridor', status: 'ON SCENE', personnel: 6, radioChannel: 'CH-03' },
  { id: 'UNIT-DELTA', name: 'Delta Quick Response (QRF)', lead: 'Capt. Miller', sector: 'Central Staging Area', status: 'STANDBY', personnel: 10, radioChannel: 'CH-04' },
  { id: 'UNIT-MEDIC', name: 'Mobile Paramedic Unit 1', lead: 'Dr. Alva', sector: 'South Medical Tent', status: 'STANDBY', personnel: 4, radioChannel: 'MED-9' },
];

const INITIAL_SOP_CHECKLIST = [
  { id: 'sop-1', label: 'Halt ingress turnstiles at Gate A to eliminate incoming pressure waves', completed: true },
  { id: 'sop-2', label: 'Manually unlatch and secure all emergency double doors along West Corridor', completed: true },
  { id: 'sop-3', label: 'Deploy physical crowd barrier baffles to divide surge into parallel lanes', completed: false },
  { id: 'sop-4', label: 'Activate dynamic high-intensity green egress floor lighting strobes', completed: false },
  { id: 'sop-5', label: 'Position Rapid Response QRF at Arena Stage floor barrier intersection', completed: false },
  { id: 'sop-6', label: 'Establish direct line with Municipal Emergency Dispatch & Traffic Police', completed: false },
];

export function IncidentDispatch() {
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [sopChecklist, setSopChecklist] = useState(INITIAL_SOP_CHECKLIST);
  const [deployFeedback, setDeployFeedback] = useState('');

  const toggleSop = (id) => {
    setSopChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handleDeployQrf = (unitId) => {
    setUnits(prev => prev.map(u => u.id === unitId ? { ...u, status: 'DEPLOYED TO ARENA' } : u));
    setDeployFeedback(`Dispatched ${unitId} to Sector Main Stage.`);
    setTimeout(() => setDeployFeedback(''), 4000);
  };

  const completedSopCount = sopChecklist.filter(s => s.completed).length;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--accent-gold)" />
          <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            TACTICAL INCIDENT DISPATCH & STAMPEDE MITIGATION SOP
          </span>
        </div>

        {deployFeedback && (
          <div className="cyber-badge cyber-badge-emerald">
            {deployFeedback}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Security Units Roster */}
        <div>
          <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
            FIELD SECURITY UNITS & POSITIONING:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {units.map(u => {
              const isEngaged = u.status === 'ENGAGED' || u.status === 'DEPLOYED TO ARENA';
              return (
                <div
                  key={u.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${isEngaged ? '#dc262660' : 'var(--border-subtle)'}`,
                    borderRadius: '14px',
                    padding: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    boxShadow: 'var(--shadow-glass)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                        {u.id}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {u.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      Lead: {u.lead} • {u.personnel} Officers • Radio: {u.radioChannel}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      Sector: <strong>{u.sector}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                    <span className={`cyber-badge ${isEngaged ? 'cyber-badge-red' : u.status === 'ON SCENE' ? 'cyber-badge-emerald' : 'cyber-badge-blue'}`} style={{ fontSize: '0.62rem' }}>
                      {u.status}
                    </span>
                    {u.status === 'STANDBY' && (
                      <button
                        onClick={() => handleDeployQrf(u.id)}
                        className="cyber-btn cyber-btn-primary"
                        style={{ fontSize: '0.68rem', padding: '0.25rem 0.6rem' }}
                      >
                        Deploy
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Standard Operating Procedure (SOP) Checklist */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              STAMPEDE CRISIS MITIGATION PROTOCOL (SOP-401):
            </span>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
              {completedSopCount} / {sopChecklist.length} COMPLETE
            </span>
          </div>

          <div style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '16px', 
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-glass)'
          }}>
            {sopChecklist.map(item => (
              <div
                key={item.id}
                onClick={() => toggleSop(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: item.completed ? 'rgba(5, 150, 105, 0.12)' : 'var(--bg-card-elevated)',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {item.completed ? (
                  <CheckSquare size={17} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <Square size={17} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                )}
                <span style={{ 
                  fontSize: '0.78rem', 
                  color: item.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                  textDecoration: item.completed ? 'line-through' : 'none',
                  lineHeight: 1.35
                }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
