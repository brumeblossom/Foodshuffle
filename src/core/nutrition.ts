import type { Gender, ActivityLevel, Goal, UserProfile, Nutrition } from '../data/types';

/**
 * Calculates the Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 */
export function mifflinStJeorBMR(
  gender: Gender,
  age: number,
  heightCm: number,
  weightKg: number
): number {
  const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * age;
  
  switch (gender) {
    case 'male':
      return baseBMR + 5;
    case 'female':
      return baseBMR - 161;
    case 'non_binary':
    case 'prefer_not_to_say':
    default:
      // Midpoint between male (+5) and female (-161)
      return baseBMR - 78;
  }
}

/**
 * Maps the user's activity level to their physical activity factor multiplier.
 */
export function activityFactor(level: ActivityLevel): number {
  switch (level) {
    case 'sedentary':
      return 1.2;
    case 'lightly_active':
      return 1.375;
    case 'moderately_active':
      return 1.55;
    case 'very_active':
      return 1.725;
    case 'athlete':
      return 1.9;
    default:
      return 1.2;
  }
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 */
export function tdee(bmr: number, level: ActivityLevel): number {
  return bmr * activityFactor(level);
}

/**
 * Adjusts the user's TDEE based on their primary nutrition goal.
 * Clamps the target to a minimum of 1200 kcal for basic metabolic safety.
 */
export function goalAdjustedTarget(tdee: number, goal: Goal): number {
  let adjustment = 0;
  
  switch (goal) {
    case 'weight_loss':
      adjustment = -500;
      break;
    case 'weight_gain':
      adjustment = 400; // e.g. +400 within range of +300..500
      break;
    case 'fitness':
      adjustment = 300;
      break;
    case 'maintain':
    case 'general_health':
    default:
      adjustment = 0;
      break;
  }
  
  const target = tdee + adjustment;
  return Math.max(1200, Math.round(target));
}

/**
 * Determines a heuristic fallback calorie target when height and weight are absent.
 */
export function estimateCalorieBandWithoutBodyMetrics(
  age: number | undefined,
  gender: Gender | undefined,
  activityLevel: ActivityLevel | undefined,
  goal: Goal
): { calories: number; isEstimate: true } {
  // Base BMR defaults by gender
  let baseBMR = 1550; // default for non-binary, prefer not to say, or undefined
  if (gender === 'male') {
    baseBMR = 1700;
  } else if (gender === 'female') {
    baseBMR = 1400;
  }

  // Age adjustments (relative to standard adult base of 30)
  let ageAdjustment = 0;
  if (age !== undefined) {
    const referenceAge = 30;
    // Handle extreme/youth ages
    if (age < 18) {
      // Youth bonus for growth/higher active metabolism
      ageAdjustment += 100;
      // Clamp the baseline calculation to age 18 to avoid extreme positive values
      const clampedAge = 18;
      ageAdjustment += -(clampedAge - referenceAge) * 5;
    } else {
      const clampedAge = Math.min(80, age);
      ageAdjustment += -(clampedAge - referenceAge) * 5;
    }
  }

  const bmrEstimate = baseBMR + ageAdjustment;
  
  // Use lightly_active (1.375) as a default middle ground if activity level is missing
  const activeLevel = activityLevel || 'lightly_active';
  const tdeeEstimate = bmrEstimate * activityFactor(activeLevel);
  
  const calories = goalAdjustedTarget(tdeeEstimate, goal);

  return {
    calories: Math.round(calories),
    isEstimate: true,
  };
}

/**
 * Computes the daily calorie target for a user profile, utilizing BMR/TDEE calculations
 * if body metrics are present, or falling back to a heuristic estimate if they are not.
 */
export function computeDailyTarget(profile: UserProfile): { calories: number; isEstimate: boolean } {
  const { gender, age, heightCm, weightKg, activityLevel, goal } = profile;

  // Check if we have the minimum metrics required for Mifflin-St Jeor BMR
  if (
    gender !== undefined &&
    age !== undefined &&
    heightCm !== undefined &&
    weightKg !== undefined &&
    activityLevel !== undefined
  ) {
    const bmrVal = mifflinStJeorBMR(gender, age, heightCm, weightKg);
    const tdeeVal = tdee(bmrVal, activityLevel);
    const caloriesVal = goalAdjustedTarget(tdeeVal, goal);
    return {
      calories: Math.round(caloriesVal),
      isEstimate: false,
    };
  }

  // Fall back to heuristic estimate
  return estimateCalorieBandWithoutBodyMetrics(age, gender, activityLevel, goal);
}

/**
 * Calculates macronutrient target distributions in grams based on calorie target and goal.
 */
export function macroTargets(
  calories: number,
  goal: Goal
): { proteinG: number; carbsG: number; fatG: number } {
  let proteinPct = 0.20;
  let carbsPct = 0.50;
  let fatPct = 0.30;

  switch (goal) {
    case 'weight_loss':
      // Higher protein to spare lean muscle mass, lower carbs
      proteinPct = 0.30;
      carbsPct = 0.40;
      fatPct = 0.30;
      break;
    case 'weight_gain':
      // Standard balance but higher overall calorie surplus
      proteinPct = 0.20;
      carbsPct = 0.50;
      fatPct = 0.30;
      break;
    case 'fitness':
      // High protein, moderate carbs, lower fat
      proteinPct = 0.30;
      carbsPct = 0.45;
      fatPct = 0.25;
      break;
    case 'maintain':
    case 'general_health':
    default:
      proteinPct = 0.20;
      carbsPct = 0.50;
      fatPct = 0.30;
      break;
  }

  // Protein: 4 kcal/g
  // Carbs: 4 kcal/g
  // Fat: 9 kcal/g
  const proteinG = Math.round((calories * proteinPct) / 4);
  const carbsG = Math.round((calories * carbsPct) / 4);
  const fatG = Math.round((calories * fatPct) / 9);

  return { proteinG, carbsG, fatG };
}

/**
 * Sums up nutritional values for a day or week from a list of planned meals.
 */
export function sumNutrition(meals: (Nutrition | undefined)[]): Nutrition {
  const sum: Nutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  };

  let hasFiber = false;
  let hasSugar = false;
  let hasSodium = false;

  for (const meal of meals) {
    if (!meal) continue;
    
    sum.calories += meal.calories;
    sum.protein += meal.protein;
    sum.carbs += meal.carbs;
    sum.fat += meal.fat;

    if (meal.fiber !== undefined) {
      hasFiber = true;
      sum.fiber = (sum.fiber || 0) + meal.fiber;
    }
    if (meal.sugar !== undefined) {
      hasSugar = true;
      sum.sugar = (sum.sugar || 0) + meal.sugar;
    }
    if (meal.sodium !== undefined) {
      hasSodium = true;
      sum.sodium = (sum.sodium || 0) + meal.sodium;
    }
  }

  // Round values appropriately
  sum.calories = Math.round(sum.calories);
  sum.protein = Math.round(sum.protein * 10) / 10;
  sum.carbs = Math.round(sum.carbs * 10) / 10;
  sum.fat = Math.round(sum.fat * 10) / 10;

  if (hasFiber) {
    sum.fiber = Math.round((sum.fiber || 0) * 10) / 10;
  } else {
    delete sum.fiber;
  }

  if (hasSugar) {
    sum.sugar = Math.round((sum.sugar || 0) * 10) / 10;
  } else {
    delete sum.sugar;
  }

  if (hasSodium) {
    sum.sodium = Math.round(sum.sodium || 0);
  } else {
    delete sum.sodium;
  }

  return sum;
}

/**
 * Scales all nutrition details of a single serving by the number of servings.
 */
export function scaleNutrition(nutrition: Nutrition, servings: number): Nutrition {
  const scaled: Nutrition = {
    calories: Math.round(nutrition.calories * servings),
    protein: Math.round(nutrition.protein * servings * 10) / 10,
    carbs: Math.round(nutrition.carbs * servings * 10) / 10,
    fat: Math.round(nutrition.fat * servings * 10) / 10,
  };

  if (nutrition.fiber !== undefined) {
    scaled.fiber = Math.round(nutrition.fiber * servings * 10) / 10;
  }
  if (nutrition.sugar !== undefined) {
    scaled.sugar = Math.round(nutrition.sugar * servings * 10) / 10;
  }
  if (nutrition.sodium !== undefined) {
    scaled.sodium = Math.round(nutrition.sodium * servings);
  }

  return scaled;
}
