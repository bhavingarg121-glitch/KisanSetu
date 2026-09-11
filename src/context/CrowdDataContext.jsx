import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calculateStampedeRisk, generatePredictiveHourlyCurve } from '../services/stampedeRiskEngine';
import { soundService } from '../services/soundAlerts';
import { getTicketRegistry, validateTicketPayload, registerNewPass } from '../services/qrService';
import { apiService } from '../services/apiService';

const CrowdDataContext = createContext(null);

const INITIAL_ZONES = [
  {
    id: 'zone-north-gate',
    name: 'Gate A - North Entry Plaza',
    shortName: 'Gate A Plaza',
    capacity: 5000,
    currentCount: 3950,
    areaSqMeters: 1000,
    density: 3.95, // people / m²
    velocity: 0.65, // m/s
    turbulence: 0.38,
    status: 'WARNING',
    cameraFeedId: 'CAM-01',
    x: 260,
    y: 130,
    radius: 65,
    evacPriority: 2,
    exitGate: 'North Gate 1-4'
  },
  {
    id: 'zone-arena-bowl',
    name: 'Main Stage Arena Floor',
    shortName: 'Arena Floor',
    capacity: 12000,
    currentCount: 9400,
    areaSqMeters: 2200,
    density: 4.27,
    velocity: 0.42,
    turbulence: 0.58,
    status: 'CRITICAL',
    cameraFeedId: 'CAM-02',
    x: 500,
    y: 310,
    radius: 95,
    evacPriority: 1,
    exitGate: 'Emergency Tunnel 1 & 2'
  },
  {
    id: 'zone-west-concourse',
    name: 'West Egress Corridor',
    shortName: 'West Corridor',
    capacity: 4000,
    currentCount: 1350,
    areaSqMeters: 1200,
    density: 1.12,
    velocity: 1.25,
    turbulence: 0.12,
    status: 'NOMINAL',
    cameraFeedId: 'CAM-03',
    x: 180,
    y: 360,
    radius: 65,
    evacPriority: 4,
    exitGate: 'West Gates W1-W3 (Underutilized)'
  },
  {
    id: 'zone-east-food',
    name: 'East Food Court & Concourse',
    shortName: 'East Concourse',
    capacity: 4500,
    currentCount: 2850,
    areaSqMeters: 1100,
    density: 2.59,
    velocity: 0.85,
    turbulence: 0.28,
    status: 'MODERATE',
    cameraFeedId: 'CAM-04',
    x: 820,
    y: 320,
    radius: 70,
    evacPriority: 3,
    exitGate: 'East Gates E1-E3'
  },
  {
    id: 'zone-south-turnstiles',
    name: 'South Transit Concourse & Exit Hub',
    shortName: 'South Transit Hub',
    capacity: 6500,
    currentCount: 2600,
    areaSqMeters: 1500,
    density: 1.73,
    velocity: 1.10,
    turbulence: 0.18,
    status: 'NOMINAL',
    cameraFeedId: 'CAM-01',
    x: 500,
    y: 530,
    radius: 80,
    evacPriority: 5,
    exitGate: 'Metro & Bus Plaza'
  }
];

const INITIAL_ALERTS = [
  {
    id: 'ALT-101',
    time: '01:42:15',
    severity: 'CRITICAL',
    zoneId: 'zone-arena-bowl',
    zoneName: 'Main Stage Arena Floor',
    title: 'High Density Surge Detected',
    message: 'Density reached 4.27 p/m². Velocity dropped by 38%. Early bottleneck formation near Stage Barrier A.',
    acknowledged: false,
    autoDispatched: true
  },
  {
    id: 'ALT-102',
    time: '01:40:02',
    severity: 'WARNING',
    zoneId: 'zone-north-gate',
    zoneName: 'Gate A - North Entry Plaza',
    title: 'Turnstile Queue Accumulation',
    message: 'Turnstiles 1-4 operating at 92% capacity. Queue spillback approaching 45 meters.',
    acknowledged: true,
    autoDispatched: true
  },
  {
    id: 'ALT-103',
    time: '01:35:19',
    severity: 'INFO',
    zoneId: 'zone-west-concourse',
    zoneName: 'West Egress Corridor',
    title: 'Optimal Flow Corridor Identified',
    message: 'West corridor operating under 35% capacity. Recommended as primary evacuation & egress relief path.',
    acknowledged: true,
    autoDispatched: false
  }
];

export function CrowdDataProvider({ children }) {
  const [venueCapacity] = useState(32000);
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [isMuted, setIsMuted] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState('NORMAL');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [activeSimulationPreset, setActiveSimulationPreset] = useState('nominal');
  const [influxMultiplier, setInfluxMultiplier] = useState(1.0);
  const [selectedZoneId, setSelectedZoneId] = useState('zone-arena-bowl');
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Turnstile metrics
  const [turnstileStats, setTurnstileStats] = useState({
    entriesPerMin: 142,
    exitsPerMin: 86,
    totalScannedToday: 21840,
    deniedToday: 14
  });

  // Check FastAPI backend connection on mount & establish WebSocket stream
  useEffect(() => {
    let wsInstance = null;

    apiService.checkHealth().then(health => {
      if (health && health.status === 'ONLINE') {
        setIsBackendConnected(true);
        console.log('[CrowdIQ] Connected to FastAPI backend. Tech Stack:', health.tech_stack);

        // Connect WebSocket for live telemetry stream
        wsInstance = apiService.connectWebSocket(data => {
          if (data.type === 'TELEMETRY_TICK') {
            if (data.turnstile) {
              setTurnstileStats({
                entriesPerMin: data.turnstile.entries_per_min,
                exitsPerMin: data.turnstile.exits_per_min,
                totalScannedToday: data.turnstile.total_scanned_today,
                deniedToday: data.turnstile.denied_today
              });
            }
          }
        });
      }
    });

    return () => {
      if (wsInstance) {
        try { wsInstance.close(); } catch (_) {}
      }
    };
  }, []);

  // Calculate totals
  const totalHeadcount = zones.reduce((sum, z) => sum + z.currentCount, 0);
  const overallOccupancyPct = Math.round((totalHeadcount / venueCapacity) * 100);

  // Calculate composite Stampede Risk Index
  const criticalZones = zones.filter(z => z.density >= 4.0 || z.sri >= 70);
  const avgDensity = +(zones.reduce((sum, z) => sum + z.density, 0) / zones.length).toFixed(2);
  const avgTurbulence = +(zones.reduce((sum, z) => sum + z.turbulence, 0) / zones.length).toFixed(2);
  const avgVelocity = +(zones.reduce((sum, z) => sum + z.velocity, 0) / zones.length).toFixed(2);

  const compositeSriResult = calculateStampedeRisk({
    density: avgDensity * (criticalZones.length > 0 ? 1.25 : 1.0),
    velocity: avgVelocity,
    turbulence: avgTurbulence,
    inflowSurgeRatio: influxMultiplier
  });

  // Toggle audio mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      soundService.setMuted(next);
      return next;
    });
  }, []);

  // Trigger procedural siren
  const toggleSiren = useCallback((forceState = null) => {
    setIsSirenActive(prev => {
      const next = forceState !== null ? forceState : !prev;
      if (next) {
        soundService.startEmergencySiren();
      } else {
        soundService.stopSiren();
      }
      return next;
    });
  }, []);

  // Dispatch Emergency Broadcast
  const triggerEmergencyBroadcast = useCallback((level, customMessage = null) => {
    setEmergencyLevel(level);

    let message = customMessage;
    if (!message) {
      if (level === 'CRITICAL_EVACUATION') {
        message = 'ATTENTION ALL VISITORS: A CRITICAL DENSITY EVACUATION ORDER HAS BEEN ISSUED. PLEASE MOVE TOWARDS WEST EGRESS AND SOUTH METRO EXITS IMMEDIATELY IN A CALM AND ORDERLY MANNER. DO NOT RUN.';
      } else if (level === 'WARNING') {
        message = 'SECURITY ADVISORY: GATE A AND ARENA FLOOR CONGESTION IS HIGH. REROUTING IS ACTIVE. PROCEED THROUGH WEST PASSAGEWAY.';
      } else if (level === 'ADVISORY') {
        message = 'CROWD NOTICE: GATES OPERATING NORMALLY. PLEASE MAINTAIN UNIFORM PACING TOWARD ASSIGNED SECTOR.';
      } else {
        message = '';
      }
    }

    setBroadcastMessage(message);

    // Sync with FastAPI and Firebase
    apiService.broadcastEmergency(level, message);

    if (level === 'CRITICAL_EVACUATION') {
      toggleSiren(true);
      if (message) soundService.speakEmergencyBroadcast(message);
    } else if (level === 'WARNING') {
      soundService.playWarningPing();
      if (message) soundService.speakEmergencyBroadcast(message);
      toggleSiren(false);
    } else {
      toggleSiren(false);
    }

    // Add alert
    if (level !== 'NORMAL') {
      const newAlert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        time: new Date().toLocaleTimeString(),
        severity: level === 'CRITICAL_EVACUATION' ? 'CRITICAL' : 'WARNING',
        zoneId: 'ALL-ZONES',
        zoneName: 'Full Venue Broadcast',
        title: `Emergency Protocol: ${level.replace('_', ' ')}`,
        message: message,
        acknowledged: false,
        autoDispatched: true
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  }, [toggleSiren]);

  // Acknowledge alert
  const acknowledgeAlert = useCallback((id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }, []);

  // Clear all alerts
  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Chaos / Simulation presets
  const triggerSimulationPreset = useCallback((preset) => {
    setActiveSimulationPreset(preset);

    // Sync with FastAPI backend
    apiService.simulateSurge(preset, influxMultiplier);

    if (preset === 'nominal') {
      setInfluxMultiplier(1.0);
      setZones(INITIAL_ZONES);
      setEmergencyLevel('NORMAL');
      toggleSiren(false);
    } else if (preset === 'surge') {
      setInfluxMultiplier(2.4);
      setZones(prev => prev.map(z => {
        if (z.id === 'zone-arena-bowl') {
          return { ...z, currentCount: 11400, density: 5.18, velocity: 0.28, turbulence: 0.72, status: 'CRITICAL' };
        }
        if (z.id === 'zone-north-gate') {
          return { ...z, currentCount: 4750, density: 4.75, velocity: 0.35, turbulence: 0.62, status: 'CRITICAL' };
        }
        return z;
      }));
      soundService.playWarningPing();
    } else if (preset === 'stampede_hazard') {
      setInfluxMultiplier(3.8);
      setZones(prev => prev.map(z => {
        if (z.id === 'zone-arena-bowl') {
          return { ...z, currentCount: 11950, density: 5.43, velocity: 0.18, turbulence: 0.88, status: 'CRITICAL' };
        }
        if (z.id === 'zone-north-gate') {
          return { ...z, currentCount: 4980, density: 4.98, velocity: 0.22, turbulence: 0.78, status: 'CRITICAL' };
        }
        if (z.id === 'zone-east-food') {
          return { ...z, currentCount: 4200, density: 3.82, velocity: 0.50, turbulence: 0.55, status: 'WARNING' };
        }
        return z;
      }));
      triggerEmergencyBroadcast('CRITICAL_EVACUATION', 'STAMPEDE HAZARD ALERT: CRITICAL DENSITY AT MAIN ARENA AND GATE A. ALL SECURITY UNITS DEPLOY BOTTLENECK DISSIPATION PROTOCOLS IMMEDIATELY.');
    } else if (preset === 'evacuation_reroute') {
      setZones(prev => prev.map(z => {
        if (z.id === 'zone-arena-bowl') {
          return { ...z, currentCount: 8200, density: 3.72, velocity: 0.75, turbulence: 0.32, status: 'WARNING' };
        }
        if (z.id === 'zone-west-concourse') {
          return { ...z, currentCount: 2900, density: 2.41, velocity: 1.15, turbulence: 0.20, status: 'MODERATE' };
        }
        return z;
      }));
      triggerEmergencyBroadcast('WARNING', 'Dynamic Reroute Active: West Egress corridor is open. Bottleneck in Arena Floor reduced by 34%.');
    }
  }, [triggerEmergencyBroadcast, toggleSiren, influxMultiplier]);

  // Periodic heartbeat: subtle realistic fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(z => {
        const deltaCount = Math.floor((Math.random() * 24 - 10) * influxMultiplier);
        const newCount = Math.max(200, Math.min(z.capacity, z.currentCount + deltaCount));
        const newDensity = +(newCount / z.areaSqMeters).toFixed(2);
        
        let newStatus = 'NOMINAL';
        if (newDensity >= 4.0) newStatus = 'CRITICAL';
        else if (newDensity >= 3.0) newStatus = 'WARNING';
        else if (newDensity >= 2.0) newStatus = 'MODERATE';

        const risk = calculateStampedeRisk({
          density: newDensity,
          velocity: z.velocity,
          turbulence: z.turbulence,
          inflowSurgeRatio: influxMultiplier
        });

        return {
          ...z,
          currentCount: newCount,
          density: newDensity,
          status: newStatus,
          sri: risk.sri
        };
      }));

      setTurnstileStats(prev => ({
        ...prev,
        entriesPerMin: Math.max(50, Math.round(140 * influxMultiplier + (Math.random() * 20 - 10))),
        exitsPerMin: Math.max(30, Math.round(90 + (Math.random() * 16 - 8))),
        totalScannedToday: prev.totalScannedToday + Math.floor(Math.random() * 4)
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, [influxMultiplier]);

  // Helper to validate a ticket scan through Firebase / Backend
  const handleScanTicket = useCallback(async (code) => {
    // Attempt validation via FastAPI & Firebase Firestore
    const backendResult = await apiService.validateTicket(code);

    let result = backendResult;
    if (!result) {
      result = validateTicketPayload(code);
    }

    if (result.status === 'GRANTED') {
      soundService.playScanSuccess();
      setTurnstileStats(prev => ({
        ...prev,
        totalScannedToday: prev.totalScannedToday + 1
      }));
    } else {
      soundService.playScanDenied();
      setTurnstileStats(prev => ({
        ...prev,
        deniedToday: prev.deniedToday + 1
      }));
    }
    return result;
  }, []);

  const value = {
    venueCapacity,
    totalHeadcount,
    overallOccupancyPct,
    zones,
    selectedZoneId,
    setSelectedZoneId,
    alerts,
    acknowledgeAlert,
    clearAllAlerts,
    turnstileStats,
    handleScanTicket,
    registerNewPass,
    compositeSriResult,
    isMuted,
    toggleMute,
    isSirenActive,
    toggleSiren,
    emergencyLevel,
    broadcastMessage,
    triggerEmergencyBroadcast,
    activeSimulationPreset,
    influxMultiplier,
    setInfluxMultiplier,
    triggerSimulationPreset,
    isBackendConnected,
    predictiveCurve: generatePredictiveHourlyCurve(totalHeadcount, venueCapacity)
  };

  return (
    <CrowdDataContext.Provider value={value}>
      {children}
    </CrowdDataContext.Provider>
  );
}

export function useCrowdData() {
  const ctx = useContext(CrowdDataContext);
  if (!ctx) throw new Error('useCrowdData must be used within CrowdDataProvider');
  return ctx;
}
