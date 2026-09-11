import React, { useRef, useEffect, useState } from 'react';
import { Camera, Maximize2, ShieldAlert, Video, Eye, EyeOff, Radio } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

const CAMERAS = [
  {
    id: 'CAM-01',
    name: 'North Turnstiles Ingress',
    zone: 'Gate A - North Entry Plaza',
    pedestrianBase: 28,
    densityLabel: '3.95 p/m²',
    isCritical: false,
    color: '#38bdf8'
  },
  {
    id: 'CAM-02',
    name: 'Arena Stage Barrier',
    zone: 'Main Stage Arena Floor',
    pedestrianBase: 44,
    densityLabel: '4.27 p/m²',
    isCritical: true,
    color: '#ef4444'
  },
  {
    id: 'CAM-03',
    name: 'West Corridor Egress',
    zone: 'West Egress Corridor',
    pedestrianBase: 12,
    densityLabel: '1.12 p/m²',
    isCritical: false,
    color: '#10b981'
  },
  {
    id: 'CAM-04',
    name: 'East Food & Concourse',
    zone: 'East Food Court & Concourse',
    pedestrianBase: 22,
    densityLabel: '2.59 p/m²',
    isCritical: false,
    color: '#f59e0b'
  }
];

function CameraFeedCanvas({ camera, showBoxes, showVectors, isFocused, onFocus }) {
  const canvasRef = useRef(null);
  const pedestriansRef = useRef([]);

  useEffect(() => {
    // Generate simulated pedestrians
    const peds = [];
    for (let i = 0; i < camera.pedestrianBase; i++) {
      peds.push({
        x: Math.random() * 320,
        y: 40 + Math.random() * 140,
        vx: (Math.random() - 0.45) * 0.8,
        vy: (Math.random() - 0.5) * 0.4,
        boxW: 16 + Math.random() * 6,
        boxH: 34 + Math.random() * 10,
        confidence: +(0.88 + Math.random() * 0.11).toFixed(2),
        id: `P${100 + i}`
      });
    }
    pedestriansRef.current = peds;
  }, [camera.pedestrianBase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Dark camera background with subtle noise & perspective floor
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Perspective floor lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width * (i / 5), 80);
        ctx.lineTo(canvas.width * (i / 5) * 1.4 - 50, canvas.height);
        ctx.stroke();
      }

      // 2. Render pedestrians & AI Vision Bounding Boxes
      const peds = pedestriansRef.current;
      peds.forEach(p => {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 15 || p.x > canvas.width - 25) p.vx *= -1;
        if (p.y < 35 || p.y > canvas.height - 45) p.vy *= -1;

        // Render silhouette head/torso
        ctx.fillStyle = camera.isCritical ? 'rgba(239, 68, 68, 0.6)' : 'rgba(148, 163, 184, 0.5)';
        ctx.beginPath();
        ctx.arc(p.x + p.boxW / 2, p.y + 6, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(p.x + 3, p.y + 12, p.boxW - 6, p.boxH - 12);

        // Render AI Bounding Box
        if (showBoxes) {
          const boxColor = camera.isCritical ? '#ef4444' : '#00f0ff';
          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 1.2;
          ctx.strokeRect(p.x, p.y, p.boxW, p.boxH);

          // Top label
          ctx.fillStyle = boxColor;
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillText(`person ${Math.round(p.confidence * 100)}%`, p.x, p.y - 3);
        }

        // Optical flow velocity vector
        if (showVectors) {
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x + p.boxW / 2, p.y + p.boxH / 2);
          ctx.lineTo(p.x + p.boxW / 2 + p.vx * 15, p.y + p.boxH / 2 + p.vy * 15);
          ctx.stroke();
        }
      });

      // 3. Scanline effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      // 4. Live FPS & Camera Feed Timestamp HUD
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(`REC ● [LIVE]  30.0 FPS  1080p`, 12, 20);

      // AI inference tag
      ctx.fillStyle = '#00f0ff';
      ctx.fillText(`AI YOLO-v11 / CSRNet: ${peds.length} DETECTED`, 12, canvas.height - 12);

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [camera, showBoxes, showVectors]);

  return (
    <div 
      className="glass-panel" 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        border: camera.isCritical ? '1px solid rgba(239, 68, 68, 0.7)' : '1px solid var(--border-subtle)',
        boxShadow: camera.isCritical ? 'var(--glow-red)' : 'none'
      }}
    >
      {/* Reticles */}
      <div className="cctv-reticle-tl" />
      <div className="cctv-reticle-tr" />
      <div className="cctv-reticle-bl" />
      <div className="cctv-reticle-br" />

      {/* Camera Header Banner */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        padding: '0.4rem 0.75rem', 
        background: 'rgba(5, 8, 17, 0.85)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        zIndex: 20 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio size={12} color={camera.isCritical ? '#ef4444' : '#10b981'} className="pulse-threat" />
          <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>
            {camera.id} : {camera.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`cyber-badge ${camera.isCritical ? 'cyber-badge-red' : 'cyber-badge-emerald'}`} style={{ fontSize: '0.62rem' }}>
            {camera.densityLabel}
          </span>
          <button 
            onClick={onFocus} 
            className="cyber-btn"
            style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem', background: 'transparent' }}
            title="Toggle Focus"
          >
            <Maximize2 size={12} color="#94a3b8" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={360}
        height={210}
        style={{ width: '100%', height: isFocused ? '320px' : '180px', display: 'block', objectFit: 'cover' }}
      />
    </div>
  );
}

export function CameraFeedGrid() {
  const [showBoxes, setShowBoxes] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [focusedCam, setFocusedCam] = useState(null);

  const feedsToDisplay = focusedCam 
    ? CAMERAS.filter(c => c.id === focusedCam) 
    : CAMERAS;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Video size={18} color="#00f0ff" />
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              CCTV COMPUTER VISION TELEMETRY MATRIX
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Live edge neural inference with real-time bounding box detection, head-count, and optical flow vectors.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className="cyber-btn"
            style={{ 
              fontSize: '0.75rem', 
              padding: '0.35rem 0.65rem',
              borderColor: showBoxes ? '#00f0ff' : 'var(--border-subtle)',
              background: showBoxes ? 'rgba(0, 240, 255, 0.15)' : 'transparent'
            }}
          >
            AI Bounding Boxes: {showBoxes ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowVectors(!showVectors)}
            className="cyber-btn"
            style={{ 
              fontSize: '0.75rem', 
              padding: '0.35rem 0.65rem',
              borderColor: showVectors ? '#34d399' : 'var(--border-subtle)',
              background: showVectors ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
            }}
          >
            Velocity Vectors: {showVectors ? 'ON' : 'OFF'}
          </button>

          {focusedCam && (
            <button
              onClick={() => setFocusedCam(null)}
              className="cyber-btn cyber-btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              Show All Feeds (4x4)
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: focusedCam ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1rem' 
      }}>
        {feedsToDisplay.map(cam => (
          <CameraFeedCanvas
            key={cam.id}
            camera={cam}
            showBoxes={showBoxes}
            showVectors={showVectors}
            isFocused={focusedCam === cam.id}
            onFocus={() => setFocusedCam(focusedCam === cam.id ? null : cam.id)}
          />
        ))}
      </div>
    </div>
  );
}
