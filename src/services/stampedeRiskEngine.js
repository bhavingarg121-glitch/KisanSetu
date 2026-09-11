// Stampede Risk Index (SRI) & Crowd Dynamics Engine
// Based on empirical crowd dynamics research (Helbing et al., Fruin Level of Service)

/**
 * Calculate Stampede Risk Index (0 - 100)
 * @param {Object} metrics 
 * @param {number} metrics.density - People per square meter (0 - 8 p/m²)
 * @param {number} metrics.velocity - Average walking velocity in m/s (0 - 1.5 m/s)
 * @param {number} metrics.turbulence - Directional conflict / angular variance (0 - 1.0)
 * @param {number} metrics.inflowSurgeRatio - Current inflow vs normal capacity (0.5 - 3.0)
 * @returns {Object} { sri: number, level: string, color: string, recommendation: string }
 */
export function calculateStampedeRisk({ density, velocity, turbulence, inflowSurgeRatio = 1.0 }) {
  // Density factor (normalized: 0 at <= 1.0 p/m², 1.0 at >= 5.0 p/m²)
  const densityScore = Math.min(Math.max((density - 1.0) / 4.0, 0), 1.0) * 100;

  // Stagnation factor: low velocity (< 0.4 m/s) when density is moderate or high creates dangerous shockwaves
  const stagnationScore = Math.min(Math.max((1.2 - velocity) / 1.0, 0), 1.0) * 100;

  // Turbulence factor: cross-directional pushing (0 - 100)
  const turbulenceScore = Math.min(Math.max(turbulence, 0), 1.0) * 100;

  // Surge factor: inflow rate exceeding exit capacity
  const surgeScore = Math.min(Math.max((inflowSurgeRatio - 1.0) / 1.5, 0), 1.0) * 100;

  // Weighted formula:
  // Density: 40%, Turbulence: 25%, Stagnation: 20%, Inflow Surge: 15%
  const rawSri = (
    0.40 * densityScore +
    0.25 * turbulenceScore +
    0.20 * stagnationScore +
    0.15 * surgeScore
  );

  const sri = Math.round(Math.min(Math.max(rawSri, 0), 100));

  let level = 'LOW';
  let color = '#10b981'; // emerald
  let statusText = 'Nominal / Free Flow';
  let recommendation = 'Standard perimeter monitoring active. No intervention needed.';

  if (sri >= 80) {
    level = 'CRITICAL';
    color = '#ef4444'; // red
    statusText = 'CRITICAL STAMPEDE HAZARD';
    recommendation = 'IMMEDIATE ACTION: Halt inflow at entry turnstiles. Deploy Sector Alpha & Bravo. Open Emergency Egress Gate 3 & 4. Trigger automated PA calm egress broadcast.';
  } else if (sri >= 60) {
    level = 'HIGH';
    color = '#f97316'; // orange
    statusText = 'High Congestion / Choke Risk';
    recommendation = 'Throttle inflow by 50%. Activate dynamic smart reroute displays toward West corridor. Alert sector marshals.';
  } else if (sri >= 35) {
    level = 'MODERATE';
    color = '#eab308'; // yellow
    statusText = 'Moderate Density Surge';
    recommendation = 'Monitor concourse choke points. Stagger escalator intake and encourage directional queueing.';
  }

  return {
    sri,
    level,
    color,
    statusText,
    densityScore: Math.round(densityScore),
    stagnationScore: Math.round(stagnationScore),
    turbulenceScore: Math.round(turbulenceScore),
    surgeScore: Math.round(surgeScore),
    recommendation
  };
}

/**
 * Heuristic prediction of crowd count for the next N hours
 */
export function generatePredictiveHourlyCurve(currentHeadcount, maxCapacity, eventPhase = 'in_progress') {
  const hours = [
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'
  ];

  // Base profile for stadium/festival: gates open -> peak before headline -> encore surge -> egress
  const baseCurve = [0.35, 0.55, 0.72, 0.88, 0.96, 0.98, 0.94, 0.65, 0.20];

  return hours.map((hour, index) => {
    const fraction = baseCurve[index];
    const projectedCount = Math.round(fraction * maxCapacity);
    const densityEstimate = +(projectedCount / (maxCapacity * 0.25)).toFixed(1);
    const isPeak = fraction >= 0.90;
    const isChokeHazard = projectedCount > (maxCapacity * 0.92);

    return {
      hour,
      projectedCount,
      occupancyPct: Math.round(fraction * 100),
      densityEstimate,
      isPeak,
      isChokeHazard,
      dangerThreshold: Math.round(maxCapacity * 0.90)
    };
  });
}
