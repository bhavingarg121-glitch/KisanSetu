import React, { useState } from 'react';
import { X, CheckCircle, Shield, ArrowRight, Calendar, Users, Building, Mail, User } from 'lucide-react';

export function RequestDemoModal({ isOpen, onClose, onLaunchConsole }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    venueCapacity: '10000_50000',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="cg-modal-backdrop" onClick={onClose}>
      <div className="cg-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="cg-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {!submitted ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: '#e0f2fe', color: '#0066ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b192c', letterSpacing: '-0.02em' }}>
                Request CrowdGuard Demo
              </h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              See how CrowdGuard AI predicts bottlenecks, prevents stampedes, and coordinates emergency teams in real time.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Sanchita Moundekar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Work Email
                </label>
                <input 
                  type="email"
                  required
                  placeholder="name@event-organization.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Organization / Venue
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Metro Arena Security or Festival Operations"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Venue Attendance Scale
                </label>
                <select
                  value={formData.venueCapacity}
                  onChange={(e) => setFormData({ ...formData, venueCapacity: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    background: '#fff',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="under_5000">Up to 5,000 attendees</option>
                  <option value="5000_20000">5,000 - 20,000 attendees</option>
                  <option value="20000_50000">20,000 - 50,000 attendees (Stadium/Festival)</option>
                  <option value="50000_plus">50,000+ mega-gatherings</option>
                </select>
              </div>

              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="cg-btn-blue" style={{ flex: 1, justifyContent: 'center' }}>
                  Schedule Live Walkthrough <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b192c', marginBottom: '0.5rem' }}>
              Demo Request Received!
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              Thank you, <strong>{formData.name}</strong>. Our crowd safety engineering team has dispatched your demo sandbox credentials to <strong>{formData.email}</strong>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                className="cg-btn-blue" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  handleReset();
                  onLaunchConsole();
                }}
              >
                Launch Instant Live Sandbox Now <ArrowRight size={16} />
              </button>
              <button 
                className="cg-btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleReset}
              >
                Back to Overview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
