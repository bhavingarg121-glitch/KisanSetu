/**
 * Smart Recommendation Engine
 * Evaluates regional procurement centers and slots based on a transparent scoring algorithm.
 */

function recommendBestCenter(centersList, userCrop = 'Wheat', userDistanceKm = 5) {
  if (!centersList || centersList.length === 0) return null;

  const scoredCenters = centersList.map(center => {
    // 1. Capacity Score (0-30 points): lower capacity load = higher score
    const capacityLoad = center.capacityPercent || 50;
    const capacityScore = Math.max(0, (100 - capacityLoad) * 0.3);

    // 2. Waiting Time Score (0-30 points): lower wait time = higher score
    const waitTime = center.avgWaitMinutes || 30;
    const waitScore = Math.max(0, (90 - waitTime) * (30 / 90));

    // 3. Distance Score (0-20 points): closer distance = higher score
    const distance = center.distanceKm || 5;
    const distanceScore = Math.max(0, (25 - distance) * (20 / 25));

    // 4. Available Slots Score (0-20 points): more available slots = higher score
    const availableSlots = center.slots?.filter(s => (s.maxCapacity - s.bookedCount) > 0).length || 2;
    const slotScore = Math.min(20, availableSlots * 4);

    const totalScore = Math.round(capacityScore + waitScore + distanceScore + slotScore);

    // Find best open slot in this center
    const bestSlot = center.slots?.find(s => (s.maxCapacity - s.bookedCount) > 5) || center.slots?.[0];

    return {
      center,
      totalScore,
      capacityLoad,
      waitTime,
      distance,
      recommendedSlot: bestSlot ? bestSlot.timeWindow : '10:00 AM - 12:00 PM',
      scores: {
        capacity: Math.round(capacityScore),
        waitingTime: Math.round(waitScore),
        distance: Math.round(distanceScore),
        slots: Math.round(slotScore)
      }
    };
  });

  // Sort descending by total score
  scoredCenters.sort((a, b) => b.totalScore - a.totalScore);
  const best = scoredCenters[0];

  return {
    recommendedCenter: best.center,
    score: best.totalScore,
    recommendedSlot: best.recommendedSlot,
    expectedWaitingTime: `${best.waitTime} Minutes`,
    distance: `${best.distance} KM`,
    capacity: `${best.capacityLoad}%`,
    reason: `Optimal capacity (${best.capacityLoad}%) and lowest congestion with ${best.recommendedSlot} available slot.`,
    scoreBreakdown: best.scores,
    alternativeCenters: scoredCenters.slice(1)
  };
}

module.exports = {
  recommendBestCenter
};
