export type RiskLevel = 'SAFE' | 'WATCH' | 'HIGH' | 'CRITICAL';

export type SimulationStage = 
  | 'NORMAL' 
  | 'BUILDING' 
  | 'WARNING' 
  | 'CRITICAL' 
  | 'INTERVENTION' 
  | 'RECOVERY' 
  | 'SAFE';

export interface Zone {
  id: string;
  name: string;
  shortName: string;
  category: 'GATE' | 'STAGE' | 'FACILITY' | 'EXIT' | 'SECURITY';
  currentPeople: number;
  maxCapacity: number;
  density: number; // percentage 0 - 100+
  inflow: number;  // people/min
  outflow: number; // people/min
  flowDirection: string;
  densityTrend: number; // percentage change e.g. +31%
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  coordinates: { x: number; y: number; width: number; height: number };
  predictionText?: string;
  predictedDensityIn4Min?: number;
  isBlocked?: boolean;
}

export interface SecurityTeam {
  id: string;
  name: string;
  assignedZone: string;
  status: 'AVAILABLE' | 'ACTIVE' | 'DISPATCHED' | 'MOVING' | 'ARRIVED';
  targetZone?: string;
  distanceMeters: number;
  etaSeconds: number;
  membersCount: number;
  leader: string;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  timeFormatted: string;
  zoneId: string;
  zoneName: string;
  severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL' | 'ACTION' | 'RECOVERY' | 'RESOLVED';
  title: string;
  description: string;
  actionTaken?: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface CameraFeed {
  id: string;
  camNumber: string;
  name: string;
  zoneId: string;
  status: 'ONLINE' | 'STANDBY' | 'OFFLINE';
  fps: number;
  resolution: string;
  simulatedDetections: number;
  density: number;
  flowRate: number;
  flowDirection: string;
  riskLevel: RiskLevel;
}

export interface RiskFactorBreakdown {
  crowdDensityWeight: number; // 35%
  crowdDensityScore: number;
  densityGrowthWeight: number; // 25%
  densityGrowthScore: number;
  flowImbalanceWeight: number; // 20%
  flowImbalanceScore: number;
  movementPatternWeight: number; // 10%
  movementPatternScore: number;
  zoneCapacityWeight: number; // 10%
  zoneCapacityScore: number;
  totalScore: number; // 87/100
  riskLevel: RiskLevel;
}

export interface PredictionInsight {
  zoneId: string;
  zoneName: string;
  currentDensity: number;
  predicted2Min: number;
  predicted4Min: number;
  predicted6Min: number;
  riskLevel: RiskLevel;
  timeToCongestionMin: number;
  confidence: number;
  primaryReason: string;
  recommendedAction: string;
}

export interface EventSettings {
  eventName: string;
  venueCapacity: number;
  totalGates: number;
  activeSecurityTeams: number;
  criticalDensityThreshold: number; // default 85%
  warningDensityThreshold: number;  // default 65%
  simulationSpeed: number;          // 1x, 2x, 5x
  soundAlertsEnabled: boolean;
}

