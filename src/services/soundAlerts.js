// Web Audio API procedural audio synthesizer & SpeechSynthesis PA broadcast
// Zero external audio dependencies needed

class SoundAlertService {
  constructor() {
    this.audioCtx = null;
    this.sirenOsc1 = null;
    this.sirenOsc2 = null;
    this.sirenGain = null;
    this.isSirenPlaying = false;
    this.muted = false;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted && this.isSirenPlaying) {
      this.stopSiren();
    }
  }

  // Scan confirmation sound (cheerful chime)
  playScanSuccess() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12); // E6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Scan rejection buzzer
  playScanDenied() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Mild warning ping (congestion advisory)
  playWarningPing() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.setValueAtTime(450, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // High-intensity continuous alarm / emergency siren
  startEmergencySiren() {
    if (this.muted || this.isSirenPlaying) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      this.sirenGain = this.audioCtx.createGain();
      this.sirenGain.gain.setValueAtTime(0.18, now);

      this.sirenOsc1 = this.audioCtx.createOscillator();
      this.sirenOsc1.type = 'sawtooth';
      this.sirenOsc1.frequency.setValueAtTime(440, now);

      // Low frequency modulator for warble
      const lfo = this.audioCtx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(1.5, now); // 1.5 Hz warble

      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(280, now); // frequency modulation depth

      lfo.connect(lfoGain);
      lfoGain.connect(this.sirenOsc1.frequency);

      this.sirenOsc1.connect(this.sirenGain);
      this.sirenGain.connect(this.audioCtx.destination);

      lfo.start(now);
      this.sirenOsc1.start(now);
      this.sirenLfo = lfo;
      this.isSirenPlaying = true;
    } catch (e) {
      console.warn('Siren audio error:', e);
    }
  }

  stopSiren() {
    try {
      if (this.sirenGain && this.audioCtx) {
        this.sirenGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);
        setTimeout(() => {
          if (this.sirenOsc1) {
            try { this.sirenOsc1.stop(); } catch (_) {}
            this.sirenOsc1.disconnect();
            this.sirenOsc1 = null;
          }
          if (this.sirenLfo) {
            try { this.sirenLfo.stop(); } catch (_) {}
            this.sirenLfo.disconnect();
            this.sirenLfo = null;
          }
          this.isSirenPlaying = false;
        }, 220);
      } else {
        this.isSirenPlaying = false;
      }
    } catch (e) {
      console.warn('Stop siren error:', e);
      this.isSirenPlaying = false;
    }
  }

  // Text to speech public address announcement
  speakEmergencyBroadcast(message) {
    if (this.muted) return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // clear previous
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      // Select an authoritative English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira') || v.name.includes('David')));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }
}

export const soundService = new SoundAlertService();
