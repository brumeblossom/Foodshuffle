import type { Recipe, MealPlan, MealType, UserProfile, Goal } from '../data/types';

export interface MacroTargets {
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface RecommendationContext {
  profile: UserProfile;
  targetCaloriesPerDay: number;
  cuisineFilter?: string;
}

export interface PlanInput {
  profile: UserProfile;
  candidates: Recipe[];
  startDate: string;
  targetCaloriesPerDay: number;
  existingPlan?: MealPlan;
}

export interface ScoredRecipe {
  recipe: Recipe;
  score: number;
  breakdown: {
    calorieFit: number;
    budgetFit: number;
    skillFit: number;
    timeFit: number;
    favMatch: number;
    varietyPenalty: number;
  };
}

export interface RecommendationProvider {
  /**
   * Evaluates candidate recipes against user preferences and planning context,
   * returning scored recipes sorted from highest recommendation score to lowest.
   */
  scoreRecipes(
    candidates: Recipe[],
    ctx: RecommendationContext,
    slot: MealType,
    alreadySelectedIds: string[]
  ): ScoredRecipe[];

  /**
   * Generates a 7-day meal plan based on constraints and candidate recipes.
   * Respects already-locked meals in the existing plan.
   */
  generateWeeklyPlan(input: PlanInput): MealPlan;

  /**
   * Suggests top replacement candidates for a specific plan slot on a given day.
   */
  suggestSwap(
    dayIndex: number,
    slot: MealType,
    currentPlan: MealPlan,
    candidates: Recipe[],
    profile: UserProfile
  ): Recipe[];
}

export interface NutritionProvider {
  /**
   * Calculates the user's daily calorie requirement.
   */
  dailyTarget(profile: UserProfile): { calories: number; isEstimate: boolean };

  /**
   * Calculates the recommended macronutrient breakdown.
   */
  macroTargets(calories: number, goal: Goal): MacroTargets;
}
