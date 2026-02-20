export interface TierInfo {
  level: number;
  label: string;
  color: string;
  minPoints: number;
  benefits: string[];
}

export const TIERS: TierInfo[] = [
  { 
    level: 1, 
    label: "Associate", 
    color: "text-gray-400", 
    minPoints: 0,
    benefits: ["Standard base yield", "Standard network priority"]
  },
  { 
    level: 2, 
    label: "Strategic", 
    color: "text-blue-400", 
    minPoints: 40,
    benefits: ["+0.5% Yield bonus", "Priority settlement access"]
  },
  { 
    level: 3, 
    label: "Institutional", 
    color: "text-purple-400", 
    minPoints: 100,
    benefits: ["+1.2% Yield bonus", "0.5% protocol fee discount"]
  },
  { 
    level: 4, 
    label: "Sovereign", 
    color: "text-primary", 
    minPoints: 160,
    benefits: ["+2.5% Yield bonus", "Maximum network weight", "Zero protocol fees"]
  },
];

/**
 * Calculates the protocol tier based on duration and penalty severity.
 * Logic: Score = (Duration in months * 2) + Penalty Severity Percentage
 * 
 * Example:
 * 12 months @ 25% penalty = (12 * 2) + 25 = 49 (Level 2: Strategic)
 * 48 months @ 70% penalty = (48 * 2) + 70 = 166 (Level 4: Sovereign)
 */
export function calculateTier(durationMonths: number, penaltySeverity: number): TierInfo {
  const score = (durationMonths * 2) + penaltySeverity;
  
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (score >= TIERS[i].minPoints) {
      return TIERS[i];
    }
  }
  return TIERS[0];
}

export function getTierByLevel(level: number): TierInfo {
  return TIERS.find(t => t.level === level) || TIERS[0];
}
