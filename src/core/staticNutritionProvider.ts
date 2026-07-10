import type { UserProfile, Goal } from '../data/types';
import type { NutritionProvider, MacroTargets } from './providers';
import { computeDailyTarget, macroTargets } from './nutrition';

export class StaticNutritionProvider implements NutritionProvider {
  dailyTarget(profile: UserProfile): { calories: number; isEstimate: boolean } {
    return computeDailyTarget(profile);
  }

  macroTargets(calories: number, goal: Goal): MacroTargets {
    return macroTargets(calories, goal);
  }
}
