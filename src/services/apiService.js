// API Client connecting React to Python FastAPI Backend & Firebase Firestore
const API_BASE_URL = 'http://127.0.0.1:8000';
const WS_URL = 'ws://127.0.0.1:8000/ws/telemetry';

export const apiService = {
  // Check backend & tech stack health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/`);
      if (!res.ok) throw new Error('Backend HTTP error');
      return await res.json();
    } catch (err) {
      console.warn('[CrowdIQ API] Backend offline, utilizing local simulation engine:', err);
      return null;
    }
  },

  // Fetch live telemetry (headcount, occupancy, SRI from PyTorch)
  async getTelemetry() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/telemetry`);
      if (!res.ok) throw new Error('Telemetry fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Fetch zones with AI density metrics
  async getZones() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/zones`);
      if (!res.ok) throw new Error('Zones fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Fetch PyTorch LSTM peak crowd predictions
  async getPeakPredictions() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/predictions/peak`);
      if (!res.ok) throw new Error('Predictions fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Generate ticket and persist to Firebase
  async generateTicket(ticketPayload) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tickets/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketPayload)
      });
      if (!res.ok) throw new Error('Ticket generation failed');
      return await res.json();
    } catch (err) {
      console.warn('[CrowdIQ API] Ticket gen fallback to local:', err);
      return null;
    }
  },

  // Validate ticket against Firebase Firestore
  async validateTicket(code, gate = 'Gate North-A') {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tickets/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, gate })
      });
      if (!res.ok) throw new Error('Validation failed');
      return await res.json();
    } catch (err) {
      console.warn('[CrowdIQ API] Validate fallback to local:', err);
      return null;
    }
  },

  // Trigger emergency broadcast in Firebase
  async broadcastEmergency(level, message = '') {
    try {
      const res = await fetch(`${API_BASE_URL}/api/emergency/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, message })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Inject simulation surge into PyTorch engine
  async simulateSurge(preset, multiplier = 1.0) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/simulation/surge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset, multiplier })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Connect to live WebSocket stream
  connectWebSocket(onMessage, onError) {
    let ws = null;
    try {
      ws = new WebSocket(WS_URL);
      ws.onopen = () => {
        console.log('[CrowdIQ WS] Connected to FastAPI telemetry stream');
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error('[CrowdIQ WS] Parse error', e);
        }
      };
      ws.onerror = (e) => {
        if (onError) onError(e);
      };
      ws.onclose = () => {
        console.log('[CrowdIQ WS] Telemetry stream disconnected. Retrying in 4s...');
        setTimeout(() => {
          this.connectWebSocket(onMessage, onError);
        }, 4000);
      };
    } catch (e) {
      console.warn('[CrowdIQ WS] Could not open WebSocket:', e);
    }
    return ws;
  }
};
