import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  SUPER_ADMIN: {
    id: 'super_admin',
    title: 'Incident Commander',
    badge: 'SUPER ADMIN',
    description: 'Full operational control, threshold overrides, emergency klaxon activation & security dispatch.',
    color: '#ef4444'
  },
  SECURITY_GUARD: {
    id: 'security_guard',
    title: 'Field Security Officer',
    badge: 'FIELD GUARD',
    description: 'Turnstile QR pass scanner, perimeter alerts, fast incident acknowledgment & sector coordination.',
    color: '#3b82f6'
  },
  VENUE_DIRECTOR: {
    id: 'venue_director',
    title: 'Operations Director',
    badge: 'VENUE EXEC',
    description: 'Macro capacity metrics, influx forecasts, compliance audit logging & high-level reporting.',
    color: '#8b5cf6'
  },
  ATTENDEE: {
    id: 'attendee',
    title: 'Event Attendee',
    badge: 'PUBLIC PASS',
    description: 'Personal digital entry pass, least-crowded egress route recommendation & real-time safety advisories.',
    color: '#10b981'
  }
};

export function AuthProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(ROLES.SUPER_ADMIN);
  const [userName, setUserName] = useState('Cmdr. Marcus Vance');

  const switchRole = (roleKey) => {
    const role = ROLES[roleKey];
    if (!role) return;
    setCurrentRole(role);
    if (role.id === 'super_admin') setUserName('Cmdr. Marcus Vance');
    else if (role.id === 'security_guard') setUserName('Officer K. Reyes (Sector A)');
    else if (role.id === 'venue_director') setUserName('Director Helen Vance');
    else if (role.id === 'attendee') setUserName('Elena Rostova');
  };

  return (
    <AuthContext.Provider value={{ currentRole, userName, switchRole, roles: ROLES }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
