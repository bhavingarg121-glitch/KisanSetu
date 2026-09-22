import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { Video, Maximize2, Activity, Eye, Shield, Radio, Sparkles } from 'lucide-react';

export const LiveCamerasPage: React.FC = () => {
  const { cameraFeeds, zones, stage } = useSimulation();
  const [selectedCam, setSelectedCam] = useState<string>('cam-02');

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-white">
              CCTV AI Multi-Stream Vision Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time Edge Vision � YOLOv8s Person Detection & ByteTrack Kinematic Vectors
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-emerald-400" />
            4 Active RTSP Streams
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
            SIMULATED AI ANALYSIS
          </span>
        </div>
      </div>

      {/* 4-Camera CCTV Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {cameraFeeds.map((cam) => {
          const isGateB = cam.id === 'cam-02';
          const zone = zones.find(z => z.id === cam.zoneId);

          return (
            <div
              key={cam.id}
              onClick={() => setSelectedCam(cam.id)}
              className={`relative rounded-2xl border bg-[#080d19] overflow-hidden shadow-2xl transition-all duration-200 cursor-pointer ${
                selectedCam === cam.id
                  ? 'border-cyan-500/60 ring-1 ring-cyan-500/40'
                  : 'border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {/* Camera Header Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-400">{cam.camNumber}</span>
                  <span className="text-slate-400">�</span>
                  <span className="text-slate-200 font-medium">{cam.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">{cam.resolution}</span>
                  <RiskBadge level={cam.riskLevel} size="sm" />
                </div>
              </div>

              {/* Simulated Camera Video Canvas with Computer Vision Overlays */}
              <div className="relative h-64 bg-[#050811] flex items-center justify-center overflow-hidden select-none">
                {/* Visual Grid Lines & Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                {/* Simulated Crowd Silhouettes & YOLO Bounding Boxes */}
                <svg className="w-full h-full absolute inset-0">
                  {isGateB ? (
                    /* Gate B Dense Detection Clusters */
                    <g>
                      {/* Bounding Box 1 */}
                      <rect x="50" y="60" width="45" height="110" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                      <text x="50" y="54" fill="#ef4444" fontSize="9" fontFamily="monospace">ID:1402 [0.94]</text>
                      <line x1="72" y1="115" x2="110" y2="115" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow)" />

                      {/* Bounding Box 2 */}
                      <rect x="120" y="70" width="50" height="120" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                      <text x="120" y="64" fill="#ef4444" fontSize="9" fontFamily="monospace">ID:1403 [0.97]</text>

                      {/* Bounding Box 3 */}
                      <rect x="190" y="50" width="45" height="105" fill="none" stroke="#f97316" strokeWidth="1.5" />
                      <text x="190" y="44" fill="#f97316" fontSize="9" fontFamily="monospace">ID:1404 [0.91]</text>

                      {/* Bounding Box 4 */}
                      <rect x="260" y="80" width="52" height="125" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                      <text x="260" y="74" fill="#ef4444" fontSize="9" fontFamily="monospace">ID:1405 [0.98]</text>

                      {/* Bounding Box 5 */}
                      <rect x="335" y="65" width="48" height="115" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                      <text x="335" y="59" fill="#ef4444" fontSize="9" fontFamily="monospace">ID:1406 [0.95]</text>

                      {/* Flow Vector Congestion Arrow Overlay */}
                      <path
                        d="M 60 120 L 380 120"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="3"
                        strokeDasharray="6 4"
                        className="animate-pulse"
                      />
                    </g>
                  ) : (
                    /* Other Cameras Normal Bounding Boxes */
                    <g>
                      <rect x="90" y="80" width="42" height="95" fill="none" stroke="#10b981" strokeWidth="1.2" />
                      <text x="90" y="74" fill="#10b981" fontSize="9" fontFamily="monospace">ID:0812 [0.96]</text>

                      <rect x="210" y="75" width="46" height="105" fill="none" stroke="#10b981" strokeWidth="1.2" />
                      <text x="210" y="69" fill="#10b981" fontSize="9" fontFamily="monospace">ID:0813 [0.92]</text>

                      <rect x="340" y="90" width="44" height="100" fill="none" stroke="#10b981" strokeWidth="1.2" />
                      <text x="340" y="84" fill="#10b981" fontSize="9" fontFamily="monospace">ID:0814 [0.89]</text>
                    </g>
                  )}
                </svg>

                {/* Simulated CCTV Camera Crosshair Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>REC � LIVE {cam.fps} FPS</span>
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-700">
                  <span>AI INFERENCE: 14ms</span>
                </div>

                {/* Bottom Overlay Telemetry Pill */}
                <div className="absolute bottom-3 inset-x-3 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono z-10">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">People Detected</span>
                    <span className="text-white font-bold">{cam.simulatedDetections.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">Density</span>
                    <span className={`font-bold ${cam.density >= 85 ? 'text-rose-400' : cam.density >= 70 ? 'text-orange-400' : 'text-emerald-400'}`}>
                      {cam.density}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">Flow Rate</span>
                    <span className="text-cyan-400 font-bold">{cam.flowRate}/min</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">Direction</span>
                    <span className="text-slate-200 font-bold">{cam.flowDirection}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">Risk</span>
                    <span className={`font-bold ${cam.riskLevel === 'CRITICAL' ? 'text-rose-400' : cam.riskLevel === 'HIGH' ? 'text-orange-400' : 'text-emerald-400'}`}>
                      {cam.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
