// QR Code generation, parsing, and digital ticket pass validation
import QRCode from 'qrcode';

// Mock initial database of valid tickets
const initialTickets = [
  { id: 'TKT-8841-VIP', attendee: 'Elena Rostova', tier: 'VIP Access', zone: 'zone-arena-bowl', gate: 'Gate VIP-1', valid: true, used: false, timestamp: null },
  { id: 'TKT-7729-GEN', attendee: 'Marcus Chen', tier: 'General Admission', zone: 'zone-north-gate', gate: 'Gate North-A', valid: true, used: true, timestamp: '18:22:10' },
  { id: 'TKT-9912-STF', attendee: 'Sarah Jenkins', tier: 'Security / Staff', zone: 'ALL-ZONES', gate: 'Gate All', valid: true, used: false, timestamp: null },
  { id: 'TKT-4410-GEN', attendee: 'Devin Thorne', tier: 'General Admission', zone: 'zone-east-food', gate: 'Gate East-C', valid: true, used: false, timestamp: null },
  { id: 'TKT-3105-GEN', attendee: 'Aria Patel', tier: 'General Admission', zone: 'zone-west-concourse', gate: 'Gate West-B', valid: true, used: false, timestamp: null },
];

let ticketRegistry = [...initialTickets];

/**
 * Generate a Data URL for a QR code representing the ticket payload
 */
export async function generateQRCodeDataURL(payload) {
  try {
    const stringPayload = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const dataUrl = await QRCode.toDataURL(stringPayload, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
    return dataUrl;
  } catch (err) {
    console.error('QR Generation failed', err);
    throw err;
  }
}

/**
 * Validate a scanned QR code payload
 */
export function validateTicketPayload(rawCode, activeGate = null) {
  let ticketId = rawCode;
  let metadata = null;

  try {
    if (rawCode.startsWith('{')) {
      const parsed = JSON.parse(rawCode);
      ticketId = parsed.id || parsed.ticketId;
      metadata = parsed;
    }
  } catch (_) {
    ticketId = rawCode;
  }

  const existing = ticketRegistry.find(t => t.id.toLowerCase() === ticketId.trim().toLowerCase());

  const nowStr = new Date().toLocaleTimeString();

  if (!existing) {
    // If not found in mock DB, check if it's a freshly user-generated pass
    if (ticketId.startsWith('TKT-')) {
      const newEntry = {
        id: ticketId,
        attendee: metadata?.attendee || 'Guest Attendee',
        tier: metadata?.tier || 'General Admission',
        zone: metadata?.zone || 'zone-north-gate',
        gate: metadata?.gate || 'Gate North-A',
        valid: true,
        used: true,
        timestamp: nowStr
      };
      ticketRegistry.push(newEntry);
      return {
        status: 'GRANTED',
        message: 'Access Granted - New Pass Registered',
        ticket: newEntry,
        timestamp: nowStr
      };
    }

    return {
      status: 'INVALID',
      message: 'Invalid Ticket - Code not recognized in security database',
      ticket: null,
      timestamp: nowStr
    };
  }

  if (existing.used) {
    return {
      status: 'DUPLICATE',
      message: `Access Denied - Ticket already scanned at ${existing.timestamp}! Potential fraudulent pass reuse.`,
      ticket: existing,
      timestamp: nowStr
    };
  }

  // Mark ticket as scanned/used
  existing.used = true;
  existing.timestamp = nowStr;

  return {
    status: 'GRANTED',
    message: `Access Granted - Verified ${existing.tier} (${existing.attendee})`,
    ticket: existing,
    timestamp: nowStr
  };
}

export function registerNewPass(passData) {
  const newPass = {
    ...passData,
    valid: true,
    used: false,
    timestamp: null
  };
  ticketRegistry.unshift(newPass);
  return newPass;
}

export function getTicketRegistry() {
  return [...ticketRegistry];
}
