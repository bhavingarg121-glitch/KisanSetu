/**
 * Queue calculation service using multi-server queueing principles.
 */

const VEHICLE_SERVICE_MULTIPLIERS = {
  'Tractor-Trolley': 1.2,
  'Mini-Truck / Pickup': 0.8,
  'Heavy Commercial Truck': 1.8,
  'Bullock Cart': 1.0
};

/**
 * Calculates estimated waiting time dynamically.
 * @param {number} farmersAhead - Number of farmers currently ahead in the queue
 * @param {number} avgProcessingMinutes - Average processing time per vehicle (default 7 mins)
 * @param {number} activeCounters - Number of operational weighbridges/counters
 * @param {string} vehicleType - Type of vehicle
 * @returns {number} Estimated waiting time in minutes
 */
function calculateEstimatedWaitTime(farmersAhead, avgProcessingMinutes = 7, activeCounters = 2, vehicleType = 'Tractor-Trolley') {
  if (farmersAhead <= 0) return 3; // Baseline gate overhead
  
  const multiplier = VEHICLE_SERVICE_MULTIPLIERS[vehicleType] || 1.0;
  const servers = Math.max(1, activeCounters);
  const adjustedTimePerUnit = avgProcessingMinutes * multiplier;
  
  const estimated = (farmersAhead * adjustedTimePerUnit) / servers;
  return Math.max(5, Math.round(estimated));
}

function getCrowdLevel(capacityPercent, waitMinutes) {
  if (capacityPercent >= 80 || waitMinutes >= 45) {
    return { level: 'HIGH', label: 'High Crowd', color: 'red' };
  }
  if (capacityPercent >= 40 || waitMinutes >= 25) {
    return { level: 'MODERATE', label: 'Moderate Crowd', color: 'amber' };
  }
  return { level: 'LOW', label: 'Low Crowd', color: 'green' };
}

module.exports = {
  calculateEstimatedWaitTime,
  getCrowdLevel
};
