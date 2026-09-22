import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Play, 
  Check, 
  AlertTriangle, 
  Users, 
  Clock, 
  Radio, 
  Eye, 
  TrendingUp,
  Maximize2
} from 'lucide-react';

export function CrowdGuardHero({ onOpenDemoModal, onViewLiveDemo }) {
  // Live fluctuating telemetry for realistic AI effect
  const [telemetry, setTelemetry] = useState({
    densityPct: 78,
    inflow: 186,
    outflow: 72,
    predictionMinutes: 4
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => ({
        densityPct: Math.min(88, Math.max(72, prev.densityPct + (Math.random() > 0.5 ? 1 : -1))),
        inflow: Math.min(210, Math.max(160, prev.inflow + Math.floor(Math.random() * 5 - 2))),
        outflow: Math.min(90, Math.max(65, prev.outflow + Math.floor(Math.random() * 3 - 1))),
        predictionMinutes: 4
      }));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Compute donut stroke circumference
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (telemetry.densityPct / 100) * circumference;

  return (
    <section className="cg-hero-section" id="hero">
      <div className="cg-hero-grid">
        {/* Left Column: Headline & Value Proposition */}
        <div className="cg-hero-left">
          <div className="cg-badge-pill">
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#0284c7' }}></span>
            AI-POWERED CROWD INTELLIGENCE
          </div>

          <h1 className="cg-hero-title">
            PROACTIVE CROWD<br />
            SAFETY SOLUTIONS,<br />
            <span className="text-electric-blue">POWERED BY AI</span>
          </h1>

          <p className="cg-hero-subtitle">
            Predict crowd-density risks, detect bottlenecks, and help security teams 
            intervene before situations become dangerous.
          </p>

          <div className="cg-hero-actions">
            <button className="cg-btn-primary" onClick={onOpenDemoModal}>
              Request Demo <ArrowRight size={16} />
            </button>
            <button className="cg-btn-secondary" onClick={onViewLiveDemo}>
              <Play size={15} fill="#0b192c" /> View Live Demo
            </button>
          </div>

          <div className="cg-trust-points">
            <div className="cg-trust-point">
              <span className="check-icon"><Check size={12} strokeWidth={3} /></span>
              <span>Real-time monitoring</span>
            </div>
            <div className="cg-trust-point">
              <span className="check-icon"><Check size={12} strokeWidth={3} /></span>
              <span>Predictive alerts</span>
            </div>
            <div className="cg-trust-point">
              <span className="check-icon"><Check size={12} strokeWidth={3} /></span>
              <span>AI-assisted response</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live AI Computer Vision Display */}
        <div className="cg-hero-visual-card">
          {/* Base Crowd Photography */}
          <img 
            src="./assets/crowd_festival_aerial.jpg" 
            alt="CrowdGuard Live Drone AI Surveillance" 
            className="cg-hero-bg-img"
            onError={(e) => {
              // Fallback if local path differs
              e.target.src = '/CrowdIQ/assets/crowd_festival_aerial.jpg';
            }}
          />

          {/* Thermal Glow Overlays (Heatmaps) */}
          <div className="cg-thermal-glow-a"></div>
          <div className="cg-thermal-glow-b"></div>

          {/* SVG Overlay: Vector flows, Bounding Boxes & Zone Markers */}
          <svg className="cg-cv-overlay" viewBox="0 0 1000 625" preserveAspectRatio="none">
            {/* Detection boxes */}
            <g stroke="#00f0ff" strokeWidth="1.5" fill="rgba(0, 240, 255, 0.08)">
              <rect x="420" y="280" width="30" height="60" rx="3" />
              <rect x="470" y="295" width="28" height="55" rx="3" />
              <rect x="520" y="270" width="32" height="62" rx="3" />
              <rect x="560" y="310" width="30" height="58" rx="3" />
              <rect x="610" y="285" width="28" height="56" rx="3" />
              
              <rect x="360" y="340" width="34" height="68" rx="3" />
              <rect x="410" y="360" width="32" height="65" rx="3" />
              <rect x="490" y="350" width="36" height="70" rx="3" />
              <rect x="550" y="375" width="34" height="66" rx="3" />
            </g>

            {/* Dynamic Crowd Flow Arrows */}
            <g stroke="#00f0ff" strokeWidth="2" fill="none" opacity="0.85" strokeDasharray="6 4">
              <path d="M 435 440 C 440 380, 480 340, 530 320" />
              <path d="M 680 430 C 650 370, 600 340, 560 310" />
              <path d="M 530 310 L 530 250" />
            </g>
          </svg>

          {/* Zone Tags Directly on Visual */}
          <div className="cg-zone-tag" style={{ top: '24%', left: '55%' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }}></span>
            Gate B <strong style={{ color: '#f87171' }}>94%</strong>
          </div>

          <div className="cg-zone-tag" style={{ top: '18%', left: '68%' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }}></span>
            Main Stage <strong style={{ color: '#facc15' }}>78%</strong>
          </div>

          {/* Top Floating Alert Badges */}
          <div className="cg-cv-alerts-bar">
            {/* Danger: Bottleneck */}
            <div className="cg-alert-pill danger">
              <AlertTriangle size={16} />
              <div>
                <span className="pill-title">BOTTLENECK DETECTED</span>
                <span className="pill-sub">Gate B • High congestion risk</span>
              </div>
            </div>

            {/* Warning: High Density */}
            <div className="cg-alert-pill warning">
              <Users size={16} color="#fbbf24" />
              <div>
                <span className="pill-title" style={{ color: '#fbbf24' }}>HIGH DENSITY</span>
                <span className="pill-sub">Main Stage • 78%</span>
              </div>
            </div>

            {/* Timed: Risk Forecast */}
            <div className="cg-alert-pill timed">
              <Clock size={16} />
              <div>
                <span className="pill-title">RISK IN 04 MIN</span>
                <span className="pill-sub">Potential congestion</span>
              </div>
            </div>
          </div>

          {/* Bottom Left: Picture-in-Picture CCTV Feed */}
          <div className="cg-pip-cctv">
            <div className="cg-pip-header">
              <span>CAM 03 • Gate B</span>
              <div className="cg-pip-live-badge">
                <span className="cg-pip-live-dot"></span> LIVE
              </div>
            </div>
            <img 
              src="./assets/crowd_detection_cctv.jpg" 
              alt="Live CCTV Gate B" 
              className="cg-pip-img"
              onError={(e) => {
                e.target.src = '/CrowdIQ/assets/crowd_detection_cctv.jpg';
              }}
            />
          </div>

          {/* Bottom Right: Floating Telemetry HUD Card */}
          <div className="cg-hud-card">
            <div className="cg-hud-header">
              <Radio size={14} color="#00f0ff" />
              <span>Crowd Density</span>
            </div>

            <div className="cg-hud-gauge-wrap">
              <div className="cg-hud-donut">
                <svg width="82" height="82">
                  <circle
                    cx="41"
                    cy="41"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="41"
                    cy="41"
                    r={radius}
                    stroke="#ef4444"
                    strokeWidth="7"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div className="cg-hud-donut-center">
                  <span className="cg-hud-pct">{telemetry.densityPct}%</span>
                  <span className="cg-hud-status-badge">HIGH</span>
                </div>
              </div>
            </div>

            <div className="cg-hud-stats-list">
              <div className="cg-hud-stat-row">
                <span>Inflow</span>
                <span className="cg-hud-stat-val">{telemetry.inflow} /min</span>
              </div>
              <div className="cg-hud-stat-row">
                <span>Outflow</span>
                <span className="cg-hud-stat-val">{telemetry.outflow} /min</span>
              </div>
              <div className="cg-hud-stat-row">
                <span>Prediction</span>
                <span className="cg-hud-stat-val" style={{ color: '#38bdf8' }}>+{telemetry.predictionMinutes} min</span>
              </div>
            </div>

            <div className="cg-hud-heatmap-bar">
              <span>Density Heatmap</span>
              <div className="cg-hud-heatmap-gradient"></div>
              <div className="cg-hud-heatmap-labels">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
