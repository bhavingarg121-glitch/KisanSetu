// API Client connecting React to Python FastAPI Backend & Firebase Firestore
// Supports dynamic cloud deployment URLs with graceful standalone simulation fallback

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname === '0.0.0.0'
);

// Read environment variables (injected at build/runtime in Vite)
const envApi = import.meta.env?.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : '';
const envWs = import.meta.env?.VITE_WS_URL || '';

// Fallback strategy:
// 1. If VITE_API_BASE_URL is set, use it.
// 2. If running on localhost, use local FastAPI on port 8000.
// 3. Otherwise in cloud production (Vercel, Netlify, GitHub Pages) without backend env,
//    gracefully operate in client-side simulation mode (no mixed-content errors or 404s).
export const API_BASE_URL = envApi || (isLocalhost ? 'http://127.0.0.1:8000' : '');

export const WS_URL = envWs || (
  isLocalhost
    ? 'ws://127.0.0.1:8000/ws/telemetry'
    : (API_BASE_URL ? API_BASE_URL.replace(/^http/, 'ws') + '/ws/telemetry' : '')
);

let wsRetryCount = 0;
const MAX_WS_RETRIES = 3;

export const apiService = {
  isConfigured() {
    return Boolean(API_BASE_URL);
  },

  // Check backend & tech stack health
  async checkHealth() {
    if (!API_BASE_URL) {
      // Running standalone on cloud static host
      return null;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[CrowdIQ API] Backend offline/cold start, utilizing local simulation engine:', err.message);
      return null;
    }
  },

  // Fetch live telemetry (headcount, occupancy, SRI from PyTorch)
  async getTelemetry() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/telemetry`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
      });
      if (!res.ok) throw new Error('Telemetry fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Fetch zones with AI density metrics
  async getZones() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/zones`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
      });
      if (!res.ok) throw new Error('Zones fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Fetch PyTorch LSTM peak crowd predictions
  async getPeakPredictions() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/predictions/peak`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
      });
      if (!res.ok) throw new Error('Predictions fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Generate ticket and persist to Firebase
  async generateTicket(ticketPayload) {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tickets/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketPayload),
        signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
      });
      if (!res.ok) throw new Error('Ticket generation failed');
      return await res.json();
    } catch (err) {
      console.warn('[CrowdIQ API] Ticket gen fallback to local:', err.message);
      return null;
    }
  },

  // Validate ticket against Firebase Firestore
  async validateTicket(code, gate = 'Gate North-A') {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tickets/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, gate }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
      });
      if (!res.ok) throw new Error('Validation failed');
      return await res.json();
    } catch (err) {
      console.warn('[CrowdIQ API] Validate fallback to local:', err.message);
      return null;
    }
  },

  // Trigger emergency broadcast in Firebase
  async broadcastEmergency(level, message = '') {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/emergency/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, message }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Inject simulation surge into PyTorch engine
  async simulateSurge(preset, multiplier = 1.0) {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/simulation/surge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset, multiplier }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Connect to live WebSocket stream
  connectWebSocket(onMessage, onError) {
    if (!WS_URL) {
      return null;
    }
    let ws = null;
    try {
      ws = new WebSocket(WS_URL);
      ws.onopen = () => {
        wsRetryCount = 0;
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
        if (wsRetryCount < MAX_WS_RETRIES) {
          wsRetryCount++;
          const delay = wsRetryCount * 3000;
          console.log(`[CrowdIQ WS] Stream disconnected. Reconnect attempt ${wsRetryCount}/${MAX_WS_RETRIES} in ${delay}ms...`);
          setTimeout(() => {
            this.connectWebSocket(onMessage, onError);
          }, delay);
        } else {
          console.info('[CrowdIQ WS] Operating in autonomous client-side simulation mode.');
        }
      };
    } catch (e) {
      console.warn('[CrowdIQ WS] WebSocket unavailable:', e.message);
    }
    return ws;
  }
};
