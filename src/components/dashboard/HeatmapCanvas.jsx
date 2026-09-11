import React, { useRef, useEffect, useState } from 'react';
import { Layers, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Radio, ShieldAlert } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

export function HeatmapCanvas() {
  const canvasRef = useRef(null);
  const { zones, selectedZoneId, setSelectedZoneId, compositeSriResult } = useCrowdData();
  const [hoveredZone, setHoveredZone] = useState(null);
  const [showParticles, setShowParticles] = useState(true);
  const [showDensityHalos, setShowDensityHalos] = useState(true);

  // Particle simulation for dynamic crowd flow
  const particlesRef = useRef([]);

  useEffect(() => {
    // Initialize flow particles
    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: 260 + (Math.random() * 40 - 20),
        y: 130 + (Math.random() * 40 - 20),
        targetX: 500 + (Math.random() * 80 - 40),
        targetY: 310 + (Math.random() * 80 - 40),
        speed: 0.8 + Math.random() * 1.2,
        progress: Math.random(),
        type: 'ingress'
      });
    }
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: 500 + (Math.random() * 70 - 35),
        y: 310 + (Math.random() * 70 - 35),
        targetX: 180 + (Math.random() * 40 - 20),
        targetY: 360 + (Math.random() * 40 - 20),
        speed: 0.7 + Math.random() * 1.0,
        progress: Math.random(),
        type: 'egress_west'
      });
    }
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: 500 + (Math.random() * 70 - 35),
        y: 310 + (Math.random() * 70 - 35),
        targetX: 500 + (Math.random() * 40 - 20),
        targetY: 530 + (Math.random() * 40 - 20),
        speed: 0.6 + Math.random() * 0.9,
        progress: Math.random(),
        type: 'egress_south'
      });
    }
    particlesRef.current = particles;
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Blueprint Background Grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Draw Venue Architectural Boundaries & Corridors
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      // North Gate Corridor
      ctx.strokeRect(210, 80, 100, 110);

      // Arena Outer Ring
      ctx.beginPath();
      ctx.arc(500, 310, 140, 0, Math.PI * 2);
      ctx.stroke();

      // Corridors to West & East
      ctx.beginPath();
      ctx.moveTo(360, 310);
      ctx.lineTo(180, 360);
      ctx.moveTo(640, 310);
      ctx.lineTo(820, 320);
      ctx.moveTo(500, 450);
      ctx.lineTo(500, 530);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // 3. Render Heatmap Density Halos
      if (showDensityHalos) {
        zones.forEach(zone => {
          const isCritical = zone.density >= 4.0;
          const isWarning = zone.density >= 2.8;

          const gradient = ctx.createRadialGradient(
            zone.x, zone.y, 10,
            zone.x, zone.y, zone.radius * 1.45
          );

          if (isCritical) {
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
            gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.35)');
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
          } else if (isWarning) {
            gradient.addColorStop(0, 'rgba(245, 158, 11, 0.6)');
            gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
            gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
          } else {
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
            gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(zone.x, zone.y, zone.radius * 1.45, 0, Math.PI * 2);
          ctx.fill();

          // Pulsing warning ring if critical
          if (isCritical) {
            const time = Date.now() / 400;
            const pulseRadius = zone.radius + Math.sin(time) * 12;
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(zone.x, zone.y, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();
          }
        });
      }

      // 4. Render Dynamic Flow Particles
      if (showParticles) {
        particlesRef.current.forEach(p => {
          p.progress += (p.speed * 0.005);
          if (p.progress >= 1.0) p.progress = 0;

          const currX = p.x + (p.targetX - p.x) * p.progress;
          const currY = p.y + (p.targetY - p.y) * p.progress;

          ctx.fillStyle = p.type === 'ingress' ? '#38bdf8' : p.type === 'egress_west' ? '#34d399' : '#a855f7';
          ctx.beginPath();
          ctx.arc(currX, currY, 2.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 5. Render Zone Nodes & Labels
      zones.forEach(zone => {
        const isSelected = selectedZoneId === zone.id;
        const isCritical = zone.density >= 4.0;
        const isWarning = zone.density >= 2.8;

        // Base circle
        ctx.fillStyle = isSelected ? 'rgba(15, 23, 42, 0.95)' : 'rgba(10, 17, 32, 0.85)';
        ctx.strokeStyle = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';
        ctx.lineWidth = isSelected ? 3 : 2;

        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Label box
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(zone.shortName, zone.x, zone.y - 12);

        // Density readout
        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        ctx.fillStyle = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';
        ctx.fillText(`${zone.density} p/m²`, zone.x, zone.y + 6);

        // Occupancy count
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`${zone.currentCount.toLocaleString()} pax`, zone.x, zone.y + 22);

        // Camera tag
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`[${zone.cameraFeedId}]`, zone.x, zone.y + 36);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [zones, selectedZoneId, showParticles, showDensityHalos]);

  // Handle canvas click to select zone
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check hit test
    for (const zone of zones) {
      const dist = Math.hypot(zone.x - clickX, zone.y - clickY);
      if (dist <= zone.radius) {
        setSelectedZoneId(zone.id);
        break;
      }
    }
  };

  const activeZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', position: 'relative' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="#00f0ff" />
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              LIVE VENUE DENSITY & SPATIAL HEATMAP
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Real-time multi-zone crowd concentration (Fruin Level of Service Model) with dynamic optical vectors.
          </p>
        </div>

        {/* View toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setShowDensityHalos(!showDensityHalos)}
            className="cyber-btn"
            style={{ 
              fontSize: '0.75rem', 
              padding: '0.35rem 0.65rem',
              borderColor: showDensityHalos ? '#38bdf8' : 'var(--border-subtle)',
              background: showDensityHalos ? 'rgba(56, 189, 248, 0.15)' : 'transparent'
            }}
          >
            Density Halos: {showDensityHalos ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setShowParticles(!showParticles)}
            className="cyber-btn"
            style={{ 
              fontSize: '0.75rem', 
              padding: '0.35rem 0.65rem',
              borderColor: showParticles ? '#10b981' : 'var(--border-subtle)',
              background: showParticles ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
            }}
          >
            Vector Particles: {showParticles ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div style={{ position: 'relative', width: '100%', background: '#070c17', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1e293b' }}>
        <canvas
          ref={canvasRef}
          width={1000}
          height={620}
          onClick={handleCanvasClick}
          style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
        />

        {/* Floating Zone Detail Card */}
        {activeZone && (
          <div 
            className="glass-panel" 
            style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              width: '280px', 
              background: 'rgba(11, 19, 36, 0.95)', 
              borderColor: activeZone.density >= 4.0 ? '#ef4444' : '#38bdf8',
              padding: '1rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: '#94a3b8' }}>SECTOR TELEMETRY</span>
              <span className={`cyber-badge ${activeZone.density >= 4.0 ? 'cyber-badge-red' : activeZone.density >= 2.8 ? 'cyber-badge-amber' : 'cyber-badge-emerald'}`}>
                {activeZone.status}
              </span>
            </div>

            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.6rem' }}>
              {activeZone.name}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem', borderRadius: '6px' }}>
                <div className="font-mono" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>DENSITY</div>
                <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: activeZone.density >= 4.0 ? '#ef4444' : '#34d399' }}>
                  {activeZone.density} <span style={{ fontSize: '0.65rem' }}>p/m²</span>
                </div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem', borderRadius: '6px' }}>
                <div className="font-mono" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>VELOCITY</div>
                <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: activeZone.velocity < 0.5 ? '#ef4444' : '#38bdf8' }}>
                  {activeZone.velocity} <span style={{ fontSize: '0.65rem' }}>m/s</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
              <strong>Occupancy:</strong> {activeZone.currentCount.toLocaleString()} / {activeZone.capacity.toLocaleString()} ({Math.round((activeZone.currentCount / activeZone.capacity) * 100)}%)
            </div>
            <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginBottom: '0.65rem' }}>
              <strong>Egress Gate:</strong> {activeZone.exitGate}
            </div>

            {activeZone.density >= 4.0 && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.2)', 
                border: '1px solid rgba(239, 68, 68, 0.4)', 
                borderRadius: '6px', 
                padding: '0.5rem',
                fontSize: '0.72rem',
                color: '#fca5a5'
              }}>
                ⚠️ <strong>Stampede Hazard:</strong> People per m² exceeds critical threshold (4.0). Initiate smart diversion to West corridor.
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div style={{ 
          position: 'absolute', 
          bottom: '12px', 
          left: '12px', 
          background: 'rgba(10, 17, 32, 0.88)', 
          padding: '0.5rem 0.85rem', 
          borderRadius: '8px', 
          border: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          fontSize: '0.72rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
            <span>Fluid (&lt; 2.0 p/m²)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
            <span>Moderate (2.0 - 3.9 p/m²)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
            <span>Critical Hazard (&gt;= 4.0 p/m²)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
