import { describe, it, expect } from 'vitest';
import {
  mifflinStJeorBMR,
  activityFactor,
  tdee,
  goalAdjustedTarget,
  estimateCalorieBandWithoutBodyMetrics,
  computeDailyTarget,
  macroTargets,
  sumNutrition,
  scaleNutrition,
} from './nutrition';
import type { UserProfile, Nutrition } from '../data/types';

describe('Nutrition Utility Core', () => {
  describe('mifflinStJeorBMR', () => {
    it('calculates BMR for males correctly', () => {
      // 10 * 80 + 6.25 * 180 - 5 * 25 + 5 = 800 + 1125 - 125 + 5 = 1805
      const result = mifflinStJeorBMR('male', 25, 180, 80);
      expect(result).toBe(1805);
    });

    it('calculates BMR for females correctly', () => {
      // 10 * 60 + 6.25 * 160 - 5 * 30 - 161 = 600 + 1000 - 150 - 161 = 1289
      const result = mifflinStJeorBMR('female', 30, 160, 60);
      expect(result).toBe(1289);
    });

    it('calculates BMR for non_binary/prefer_not_to_say correctly using midpoint offset', () => {
      // 10 * 70 + 6.25 * 170 - 5 * 28 - 78 = 700 + 1062.5 - 140 - 78 = 1544.5
      const result = mifflinStJeorBMR('non_binary', 28, 170, 70);
      expect(result).toBe(1544.5);
    });
  });

  describe('activityFactor', () => {
    it('returns the correct multiplier for defined levels', () => {
      expect(activityFactor('sedentary')).toBe(1.2);
      expect(activityFactor('lightly_active')).toBe(1.375);
      expect(activityFactor('moderately_active')).toBe(1.55);
      expect(activityFactor('very_active')).toBe(1.725);
      expect(activityFactor('athlete')).toBe(1.9);
    });

    it('defaults to sedentary factor for invalid/fallback values', () => {
      expect(activityFactor('unknown' as any)).toBe(1.2);
    });
  });

  describe('tdee', () => {
    it('multiplies BMR by activity multiplier', () => {
      // 1500 * 1.375 = 2062.5
      expect(tdee(1500, 'lightly_active')).toBe(2062.5);
    });
  });

  describe('goalAdjustedTarget', () => {
    it('applies general_health/maintain goal without adjustments', () => {
      expect(goalAdjustedTarget(2000, 'general_health')).toBe(2000);
      expect(goalAdjustedTarget(2000, 'maintain')).toBe(2000);
    });

    it('applies weight loss deficit', () => {
      expect(goalAdjustedTarget(2000, 'weight_loss')).toBe(1500);
    });

    it('applies weight gain surplus', () => {
      expect(goalAdjustedTarget(2000, 'weight_gain')).toBe(2400);
    });

    it('applies fitness surplus', () => {
      expect(goalAdjustedTarget(2000, 'fitness')).toBe(2300);
    });

    it('clamps adjusted calories to a safe minimum of 1200 kcal', () => {
      expect(goalAdjustedTarget(1400, 'weight_loss')).toBe(1200);
      expect(goalAdjustedTarget(1100, 'maintain')).toBe(1200);
    });
  });

  describe('estimateCalorieBandWithoutBodyMetrics', () => {
    it('estimates for a standard age 30 profile', () => {
      // Female base BMR = 1400. Age 30 = 0 adjustment.
      // Lightly active multiplier = 1.375. TDEE = 1400 * 1.375 = 1925.
      // Goal weight_loss = -500. Adjusted = 1425.
      const result = estimateCalorieBandWithoutBodyMetrics(30, 'female', 'lightly_active', 'weight_loss');
      expect(result.calories).toBe(1425);
      expect(result.isEstimate).toBe(true);
    });

    it('handles youth age adjustment (under 18)', () => {
      // Male base BMR = 1700.
      // Age 15: under 18 gets +100 bonus, and clamp baseline to 18.
      // baseline adjustment: -(18-30)*5 = +60.
      // Total BMR estimate = 1700 + 100 + 60 = 1860.
      // Lightly active = 1.375. TDEE = 1860 * 1.375 = 2557.5.
      // Goal general_health = 2557.5 -> round to 2558.
      const result = estimateCalorieBandWithoutBodyMetrics(15, 'male', 'lightly_active', 'general_health');
      expect(result.calories).toBe(2558);
    });

    it('handles older age adjustment (e.g. age 60)', () => {
      // Female base BMR = 1400.
      // Age 60 adjustment: -(60-30)*5 = -150.
      // Total BMR estimate = 1400 - 150 = 1250.
      // Sedentary factor = 1.2. TDEE = 1250 * 1.2 = 1500.
      // Goal maintain = 1500.
      const result = estimateCalorieBandWithoutBodyMetrics(60, 'female', 'sedentary', 'maintain');
      expect(result.calories).toBe(1500);
    });

    it('handles missing age, gender, or activity level inputs gracefully', () => {
      // Defaults: gender midpoint base = 1550, age 30 = 0 adjustment, lightly active factor = 1.375.
      // TDEE = 1550 * 1.375 = 2131.25.
      // Goal maintain = 2131.25 -> 2131.
      const result = estimateCalorieBandWithoutBodyMetrics(undefined, undefined, undefined, 'maintain');
      expect(result.calories).toBe(2131);
      expect(result.isEstimate).toBe(true);
    });
  });

  describe('computeDailyTarget', () => {
    const fullProfile: UserProfile = {
      id: 'primary',
      name: 'Tester',
      gender: 'male',
      age: 25,
      heightCm: 180,
      weightKg: 80,
      activityLevel: 'lightly_active',
      goal: 'general_health',
      favoriteFoods: [],
      allergies: [],
      dietTags: [],
      currency: 'NGN',
      includeSnacks: false,
      onboardingComplete: true,
      createdAt: '',
      updatedAt: '',
    };

    it('uses Mifflin-St Jeor and TDEE calculation when all metrics are present', () => {
      // BMR = 1805 (from earlier test).
      // TDEE = 1805 * 1.375 = 2481.875.
      // Goal general_health = 2482.
      const result = computeDailyTarget(fullProfile);
      expect(result.calories).toBe(2482);
      expect(result.isEstimate).toBe(false);
    });

    it('falls back to estimate when heightCm is missing', () => {
      const partialProfile = { ...fullProfile, heightCm: undefined };
      const result = computeDailyTarget(partialProfile);
      expect(result.isEstimate).toBe(true);
    });

    it('falls back to estimate when weightKg is missing', () => {
      const partialProfile = { ...fullProfile, weightKg: undefined };
      const result = computeDailyTarget(partialProfile);
      expect(result.isEstimate).toBe(true);
    });

    it('falls back to estimate when age is missing', () => {
      const partialProfile = { ...fullProfile, age: undefined };
      const result = computeDailyTarget(partialProfile);
      expect(result.isEstimate).toBe(true);
    });
  });

  describe('macroTargets', () => {
    it('calculates correct macros for weight_loss goal', () => {
      // 2000 calories with weight_loss (40% carbs, 30% protein, 30% fat):
      // Protein: 2000 * 0.3 / 4 = 150g
      // Carbs: 2000 * 0.4 / 4 = 200g
      // Fat: 2000 * 0.3 / 9 = 66.67 -> 67g
      const result = macroTargets(2000, 'weight_loss');
      expect(result).toEqual({ proteinG: 150, carbsG: 200, fatG: 67 });
    });

    it('calculates correct macros for weight_gain goal', () => {
      // 2000 calories with weight_gain (50% carbs, 20% protein, 30% fat):
      // Protein: 2000 * 0.2 / 4 = 100g
      // Carbs: 2000 * 0.5 / 4 = 250g
      // Fat: 2000 * 0.3 / 9 = 66.67 -> 67g
      const result = macroTargets(2000, 'weight_gain');
      expect(result).toEqual({ proteinG: 100, carbsG: 250, fatG: 67 });
    });

    it('calculates correct macros for fitness goal', () => {
      // 2000 calories with fitness (45% carbs, 30% protein, 25% fat):
      // Protein: 2000 * 0.3 / 4 = 150g
      // Carbs: 2000 * 0.45 / 4 = 225g
      // Fat: 2000 * 0.25 / 9 = 55.56 -> 56g
      const result = macroTargets(2000, 'fitness');
      expect(result).toEqual({ proteinG: 150, carbsG: 225, fatG: 56 });
    });

    it('calculates correct macros for general_health/maintain goals', () => {
      // 2000 calories (50% carbs, 20% protein, 30% fat)
      const result = macroTargets(2000, 'general_health');
      expect(result).toEqual({ proteinG: 100, carbsG: 250, fatG: 67 });
    });
  });

  describe('sumNutrition', () => {
    it('returns zeroes for an empty list of meals', () => {
      const result = sumNutrition([]);
      expect(result).toEqual({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    });

    it('correctly sums and rounds multiple meals nutrition values', () => {
      const meal1: Nutrition = {
        calories: 350.2,
        protein: 20.5,
        carbs: 40.1,
        fat: 10.4,
        fiber: 5.2,
        sugar: 12.1,
        sodium: 300,
      };
      const meal2: Nutrition = {
        calories: 450.6,
        protein: 30.2,
        carbs: 55.4,
        fat: 12.8,
        fiber: 6.1,
        sugar: 8.5,
        sodium: 450,
      };

      const result = sumNutrition([meal1, undefined, meal2]);
      expect(result).toEqual({
        calories: 801, // 350.2 + 450.6 = 800.8 -> 801
        protein: 50.7,
        carbs: 95.5,
        fat: 23.2,
        fiber: 11.3,
        sugar: 20.6,
        sodium: 750,
      });
    });

    it('excludes optional fields from the output if not present in any input meal', () => {
      const meal1: Nutrition = { calories: 300, protein: 20, carbs: 40, fat: 10 };
      const meal2: Nutrition = { calories: 400, protein: 25, carbs: 45, fat: 12 };

      const result = sumNutrition([meal1, meal2]);
      expect(result.fiber).toBeUndefined();
      expect(result.sugar).toBeUndefined();
      expect(result.sodium).toBeUndefined();
    });
  });

  describe('scaleNutrition', () => {
    const baseNutrition: Nutrition = {
      calories: 500,
      protein: 20.4,
      carbs: 50.5,
      fat: 15.6,
      fiber: 4.2,
      sugar: 10,
      sodium: 250,
    };

    it('scales and rounds fields correctly for 1.5 servings', () => {
      const result = scaleNutrition(baseNutrition, 1.5);
      expect(result).toEqual({
        calories: 750,
        protein: 30.6, // 20.4 * 1.5 = 30.6
        carbs: 75.8,   // 50.5 * 1.5 = 75.75 -> 75.8
        fat: 23.4,     // 15.6 * 1.5 = 23.4
        fiber: 6.3,    // 4.2 * 1.5 = 6.3
        sugar: 15,
        sodium: 375,
      });
    });

    it('omits optional fields if they are undefined in target', () => {
      const simpleNutrition: Nutrition = {
        calories: 300,
        protein: 15,
        carbs: 35,
        fat: 8,
      };
      const result = scaleNutrition(simpleNutrition, 2);
      expect(result).toEqual({
        calories: 600,
        protein: 30,
        carbs: 70,
        fat: 16,
      });
      expect(result.fiber).toBeUndefined();
      expect(result.sugar).toBeUndefined();
      expect(result.sodium).toBeUndefined();
    });
  });
});
