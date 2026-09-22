import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Zone, RiskLevel } from '../../types';
import { Layers, Shield, Navigation, AlertCircle, Eye, Flame, Users } from 'lucide-react';

export const VenueMapCanvas: React.FC = () => {
  const { zones, selectedZoneId, selectZone, securityTeams, emergencyMode, stage } = useSimulation();
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showEvacRoutes, setShowEvacRoutes] = useState(true);
  const [showSecuritySquads, setShowSecuritySquads] = useState(true);

  const getZoneRiskColor = (level: RiskLevel, density: number, isSelected: boolean) => {
    switch (level) {
      case 'CRITICAL':
        return {
          fill: isSelected ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.22)',
          stroke: '#ef4444',
          glow: 'drop-shadow(0 0 16px rgba(239, 68, 68, 0.8))',
          badgeBg: 'bg-rose-500 text-white animate-pulse',
          textColor: 'text-rose-300',
        };
      case 'HIGH':
        return {
          fill: isSelected ? 'rgba(249, 115, 22, 0.32)' : 'rgba(249, 115, 22, 0.20)',
          stroke: '#f97316',
          glow: 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.6))',
          badgeBg: 'bg-orange-500 text-slate-950 font-bold',
          textColor: 'text-orange-300',
        };
      case 'WATCH':
        return {
          fill: isSelected ? 'rgba(245, 158, 11, 0.28)' : 'rgba(245, 158, 11, 0.16)',
          stroke: '#f59e0b',
          glow: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))',
          badgeBg: 'bg-amber-500/80 text-slate-950 font-semibold',
          textColor: 'text-amber-300',
        };
      case 'SAFE':
      default:
        return {
          fill: isSelected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.12)',
          stroke: '#10b981',
          glow: isSelected ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' : 'none',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
          textColor: 'text-emerald-300',
        };
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-[#090d18] overflow-hidden shadow-2xl flex flex-col h-[520px]">
      {/* Map Header Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/90 bg-slate-950/70 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
            Interactive Venue Spatial Grid (Festival Map)
          </span>
          {emergencyMode && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-600 text-white font-bold animate-pulse">
              EMERGENCY LAYER ACTIVE
            </span>
          )}
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
              showHeatmap
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 border border-slate-800 bg-slate-900/40'
            }`}
          >
            <Flame className="h-3 w-3" />
            <span>Heatmap</span>
          </button>
          <button
            onClick={() => setShowEvacRoutes(!showEvacRoutes)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
              showEvacRoutes
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 border border-slate-800 bg-slate-900/40'
            }`}
          >
            <Navigation className="h-3 w-3" />
            <span>Evac Routes</span>
          </button>
          <button
            onClick={() => setShowSecuritySquads(!showSecuritySquads)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
              showSecuritySquads
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 border border-slate-800 bg-slate-900/40'
            }`}
          >
            <Shield className="h-3 w-3" />
            <span>Security</span>
          </button>
        </div>
      </div>

      {/* Main SVG Vector Canvas */}
      <div className="relative flex-1 bg-[#060911] w-full h-full p-2 flex items-center justify-center select-none overflow-hidden">
        {/* Background Coordinate Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <svg
          viewBox="0 0 850 540"
          className="w-full h-full max-h-[470px] transition-all duration-300"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))' }}
        >
          {/* Outer Venue Perimeter Boundary */}
          <rect
            x="20"
            y="20"
            width="810"
            height="500"
            rx="16"
            fill="none"
            stroke="#1e293b"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* Pedestrian Pathways & Corridors */}
          <path
            d="M 160 200 L 160 380 L 430 380 L 430 270 L 690 270 L 690 380"
            fill="none"
            stroke="#1e293b"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          <path
            d="M 430 150 L 430 380 M 160 200 L 310 270 M 690 200 L 550 270"
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />

          {/* Dynamic Evacuation / Redirection Path Vectors */}
          {showEvacRoutes && (
            <g className="transition-opacity duration-300">
              {/* Normal Flow Arrows */}
              <path
                d="M 160 200 L 310 270"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
                opacity="0.7"
              />
              <path
                d="M 550 270 L 690 380"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                opacity="0.7"
              />

              {/* Congestion Divert Line between Gate B and Gate C if in building/critical/intervention stage */}
              {(stage === 'CRITICAL' || stage === 'WARNING' || stage === 'INTERVENTION') && (
                <g>
                  <path
                    d="M 690 130 C 690 320, 300 340, 160 440"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="3.5"
                    strokeDasharray="8 6"
                    className="animate-scan"
                    style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }}
                  />
                  <text x="440" y="325" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    ? REDIRECTION CORRIDOR (GATE B ? GATE C)
                  </text>
                </g>
              )}

              {/* Emergency Exit Route Glow */}
              {emergencyMode && (
                <path
                  d="M 430 270 L 430 480 L 690 480"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeDasharray="8 4"
                  className="animate-pulse"
                />
              )}
            </g>
          )}

          {/* Zones Rendering */}
          {zones.map((zone) => {
            const isSelected = zone.id === selectedZoneId;
            const style = getZoneRiskColor(zone.riskLevel, zone.density, isSelected);
            const { x, y, width, height } = zone.coordinates;

            return (
              <g
                key={zone.id}
                onClick={() => selectZone(zone.id)}
                className="cursor-pointer transition-transform duration-200 group"
                style={{ filter: style.glow }}
              >
                {/* Zone Background Box */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="10"
                  fill={style.fill}
                  stroke={isSelected ? '#38bdf8' : style.stroke}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  className="transition-all duration-300"
                />

                {/* Heatmap Pulsing Rings on High/Critical Zones */}
                {showHeatmap && (zone.riskLevel === 'CRITICAL' || zone.riskLevel === 'HIGH') && (
                  <circle
                    cx={x + width / 2}
                    cy={y + height / 2}
                    r={width / 2.6}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth="1.5"
                    className="animate-ping opacity-30"
                  />
                )}

                {/* Zone Name Label */}
                <text
                  x={x + 12}
                  y={y + 24}
                  fill="#f8fafc"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="monospace"
                  className="tracking-wide"
                >
                  {zone.shortName}
                </text>

                {/* People Count & Capacity */}
                <text
                  x={x + 12}
                  y={y + 44}
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  {zone.currentPeople.toLocaleString()} / {zone.maxCapacity.toLocaleString()}
                </text>

                {/* Flow In/Out indicator */}
                <text
                  x={x + 12}
                  y={y + 62}
                  fill="#cbd5e1"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  IN: {zone.inflow}/m | OUT: {zone.outflow}/m
                </text>

                {/* Density Progress Bar Inside Zone */}
                <rect
                  x={x + 12}
                  y={y + height - 26}
                  width={width - 24}
                  height="6"
                  rx="3"
                  fill="#1e293b"
                />
                <rect
                  x={x + 12}
                  y={y + height - 26}
                  width={Math.min(width - 24, ((width - 24) * zone.density) / 100)}
                  height="6"
                  rx="3"
                  fill={style.stroke}
                  className="transition-all duration-500"
                />

                {/* Density Percentage Pill */}
                <g transform={`translate(${x + width - 68}, ${y + 12})`}>
                  <rect
                    width="56"
                    height="20"
                    rx="4"
                    fill={zone.riskLevel === 'CRITICAL' ? '#ef4444' : zone.riskLevel === 'HIGH' ? '#f97316' : zone.riskLevel === 'WATCH' ? '#f59e0b' : '#10b981'}
                    opacity={zone.riskLevel === 'SAFE' ? 0.25 : 0.9}
                  />
                  <text
                    x="28"
                    y="14"
                    fill={zone.riskLevel === 'SAFE' ? '#10b981' : '#090d16'}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {zone.density}%
                  </text>
                </g>

                {/* Critical Alert Icon on Zone */}
                {zone.riskLevel === 'CRITICAL' && (
                  <g transform={`translate(${x + width - 30}, ${y + height - 48})`}>
                    <circle cx="10" cy="10" r="12" fill="#ef4444" className="animate-ping opacity-75" />
                    <circle cx="10" cy="10" r="10" fill="#ef4444" />
                    <text x="10" y="14" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                      !
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Security Team Badges & Movement Tracking */}
          {showSecuritySquads && (
            <g>
              {securityTeams.map((team, idx) => {
                // Approximate team coordinates based on assigned or moving status
                let posX = 490;
                let posY = 450;
                if (team.id === 'team-01') { posX = 160; posY = 135; }
                if (team.id === 'team-02') { posX = 430; posY = 275; }
                if (team.id === 'team-03') { posX = 690; posY = 445; }
                if (team.id === 'team-04') {
                  if (team.status === 'MOVING') {
                    // Animating towards Gate B (580, 70)
                    posX = 570;
                    posY = 220;
                  } else if (team.status === 'ARRIVED') {
                    posX = 650;
                    posY = 140;
                  } else {
                    posX = 490;
                    posY = 450;
                  }
                }

                return (
                  <g key={team.id} className="transition-all duration-700">
                    {team.status === 'MOVING' && (
                      <circle
                        cx={posX}
                        cy={posY}
                        r="16"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}
                    <rect
                      x={posX - 40}
                      y={posY - 12}
                      width="80"
                      height="24"
                      rx="6"
                      fill="#0f172a"
                      stroke={team.status === 'MOVING' ? '#38bdf8' : team.status === 'ARRIVED' ? '#10b981' : '#64748b'}
                      strokeWidth="1.5"
                    />
                    <text
                      x={posX}
                      y={posY + 4}
                      fill={team.status === 'MOVING' ? '#38bdf8' : team.status === 'ARRIVED' ? '#10b981' : '#e2e8f0'}
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {team.name.split(' ')[0]} {team.name.split(' ')[1]} {team.status === 'MOVING' ? '??' : ''}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Legend Overlay in Map Bottom-Left */}
        <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 flex items-center gap-3 text-[11px] font-mono z-10">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Risk Index:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-400">&lt;50% Safe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-amber-400">50-70% Watch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            <span className="text-orange-400">70-85% High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-rose-400 font-bold">&gt;85% Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};
