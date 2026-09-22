import React from 'react';
import { 
  Video, 
  Brain, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Bell, 
  AlertTriangle,
  Flame,
  Clock
} from 'lucide-react';

export function HowItWorksSection({ onNavigateToTab }) {
  return (
    <section className="cg-works-section" id="how-it-works">
      {/* Section Header */}
      <div className="cg-works-header">
        <h2 className="cg-works-title">How CrowdGuard Works</h2>
        <p className="cg-works-subtitle">
          From real-time data to proactive action — our AI transforms crowd intelligence 
          into safer, smarter events.
        </p>
      </div>

      {/* 4-Step Horizontal Workflow */}
      <div className="cg-steps-flow">
        {/* Step 1 */}
        <div className="cg-step-card">
          <div className="cg-step-icon-box">
            <Video size={22} />
          </div>
          <div>
            <h3 className="cg-step-num-title">1. Detect</h3>
            <p className="cg-step-desc">
              Monitor crowd density, movement and behavior using computer vision and edge AI.
            </p>
          </div>
        </div>

        <div className="cg-step-arrow">→</div>

        {/* Step 2 */}
        <div className="cg-step-card">
          <div className="cg-step-icon-box">
            <Brain size={22} />
          </div>
          <div>
            <h3 className="cg-step-num-title">2. Understand</h3>
            <p className="cg-step-desc">
              Analyze patterns, identify bottlenecks and emerging risks in real time.
            </p>
          </div>
        </div>

        <div className="cg-step-arrow">→</div>

        {/* Step 3 */}
        <div className="cg-step-card">
          <div className="cg-step-icon-box">
            <TrendingUp size={22} />
          </div>
          <div>
            <h3 className="cg-step-num-title">3. Predict</h3>
            <p className="cg-step-desc">
              Forecast congestion and potential safety issues before they escalate.
            </p>
          </div>
        </div>

        <div className="cg-step-arrow">→</div>

        {/* Step 4 */}
        <div className="cg-step-card">
          <div className="cg-step-icon-box">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="cg-step-num-title">4. Intervene</h3>
            <p className="cg-step-desc">
              Alert security teams and recommend actions to keep events safe and smooth.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Feature Showcase Cards */}
      <div className="cg-features-grid" id="features">
        {/* Card 1: Live Monitoring */}
        <div className="cg-feature-card" onClick={() => onNavigateToTab('dashboard')}>
          <div>
            <div className="cg-feature-top">
              <div className="cg-feature-icon-box cyan">
                <Video size={20} />
              </div>
              <h4 className="cg-feature-title">Live Monitoring</h4>
            </div>
            <p className="cg-feature-desc">
              Real-time video analytics with AI-powered crowd detection and tracking.
            </p>
          </div>
          <div className="cg-feature-img-box">
            <img 
              src="./assets/crowd_detection_cctv.jpg" 
              alt="Live Monitoring CCTV" 
              onError={(e) => { e.target.src = '/CrowdIQ/assets/crowd_detection_cctv.jpg'; }}
            />
          </div>
          <span className="cg-feature-link">
            Learn more <ArrowRight size={14} />
          </span>
        </div>

        {/* Card 2: Risk Prediction */}
        <div className="cg-feature-card" onClick={() => onNavigateToTab('prediction')}>
          <div>
            <div className="cg-feature-top">
              <div className="cg-feature-icon-box blue">
                <TrendingUp size={20} />
              </div>
              <h4 className="cg-feature-title">Risk Prediction</h4>
            </div>
            <p className="cg-feature-desc">
              Accurate forecasting of congestion and high-risk zones using historical and live data.
            </p>
          </div>
          <div className="cg-feature-img-box">
            <img 
              src="./assets/risk_prediction_chart.jpg" 
              alt="Risk Prediction Forecast" 
              onError={(e) => { e.target.src = '/CrowdIQ/assets/risk_prediction_chart.jpg'; }}
            />
          </div>
          <span className="cg-feature-link">
            Learn more <ArrowRight size={14} />
          </span>
        </div>

        {/* Card 3: Intelligent Alerts */}
        <div className="cg-feature-card" onClick={() => onNavigateToTab('emergency')}>
          <div>
            <div className="cg-feature-top">
              <div className="cg-feature-icon-box cyan">
                <Bell size={20} />
              </div>
              <h4 className="cg-feature-title">Intelligent Alerts</h4>
            </div>
            <p className="cg-feature-desc">
              Get instant notifications for bottlenecks, unusual movement and rising risk levels.
            </p>
          </div>
          <div className="cg-feature-img-box" style={{ padding: '0.5rem', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.35rem', justifyContent: 'center' }}>
            <div style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: '6px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#dc2626', fontWeight: 600 }}>
              <Flame size={12} color="#dc2626" /> High Density (Gate B)
            </div>
            <div style={{ background: '#fff', border: '1px solid #fef3c7', borderRadius: '6px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#d97706', fontWeight: 600 }}>
              <AlertTriangle size={12} color="#d97706" /> Bottleneck (Main Stage)
            </div>
            <div style={{ background: '#fff', border: '1px solid #e0f2fe', borderRadius: '6px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#0284c7', fontWeight: 600 }}>
              <Clock size={12} color="#0284c7" /> Risk Alert (In 4 Min)
            </div>
          </div>
          <span className="cg-feature-link">
            Learn more <ArrowRight size={14} />
          </span>
        </div>

        {/* Card 4: Security Response */}
        <div className="cg-feature-card" onClick={() => onNavigateToTab('routing')}>
          <div>
            <div className="cg-feature-top">
              <div className="cg-feature-icon-box blue">
                <ShieldCheck size={20} />
              </div>
              <h4 className="cg-feature-title">Security Response</h4>
            </div>
            <p className="cg-feature-desc">
              Coordinate teams, manage resources and intervene faster with actionable insights.
            </p>
          </div>
          <div className="cg-feature-img-box">
            <img 
              src="./assets/security_response_center.jpg" 
              alt="Security Response Center" 
              onError={(e) => { e.target.src = '/CrowdIQ/assets/security_response_center.jpg'; }}
            />
          </div>
          <span className="cg-feature-link">
            Learn more <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </section>
  );
}
