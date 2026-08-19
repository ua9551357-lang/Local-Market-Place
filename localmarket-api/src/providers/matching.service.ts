import { Injectable } from '@nestjs/common';

interface ScorableProvider {
  id: string;
  rating: number;
  priceFrom: any;
  verified: boolean;
  location?: string | null;
}

@Injectable()
export class MatchingService {
  /**
   * v1 AI matching — rules-based scoring, NOT machine learning.
   * Score = weighted combination of rating, verification, price proximity, location match.
   * Documented explicitly as v1 per project plan — upgrade path is a real ML ranking model later.
   */
  scoreProviders(providers: ScorableProvider[], preferredCity?: string, maxBudget?: number) {
    return providers
      .map((p) => {
        let score = 0;

        // Rating weight (0-5 scale -> 0-40 points)
        score += (p.rating / 5) * 40;

        // Verified bonus
        if (p.verified) score += 15;

        // Price proximity (closer to budget = better, within reason)
        if (maxBudget) {
          const price = Number(p.priceFrom);
          if (price <= maxBudget) {
            score += 25;
          } else {
            const overBudgetPenalty = Math.min(25, ((price - maxBudget) / maxBudget) * 25);
            score += Math.max(0, 25 - overBudgetPenalty);
          }
        } else {
          score += 15; // neutral if no budget specified
        }

        // Location match (simple text contains check)
        if (preferredCity && p.location) {
          if (p.location.toLowerCase().includes(preferredCity.toLowerCase())) {
            score += 20;
          }
        } else {
          score += 10;
        }

        return { ...p, matchScore: Math.round(score) };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}