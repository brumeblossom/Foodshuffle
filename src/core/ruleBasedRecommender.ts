import type { Recipe, MealPlan, MealType, UserProfile, PlannedMeal, MealPlanDay } from '../data/types';
import type { RecommendationProvider, RecommendationContext, PlanInput, ScoredRecipe } from './providers';

export class RuleBasedRecommender implements RecommendationProvider {
  /**
   * Scores all candidates for a specific meal slot, applying hard filters and scoring weights.
   */
  scoreRecipes(
    candidates: Recipe[],
    ctx: RecommendationContext,
    slot: MealType,
    alreadySelectedIds: string[]
  ): ScoredRecipe[] {
    const { profile, targetCaloriesPerDay, cuisineFilter } = ctx;
    const scored: ScoredRecipe[] = [];

    // Pre-process user allergies for case-insensitive matching
    const userAllergies = (profile.allergies || []).map(a => a.toLowerCase().trim()).filter(Boolean);

    // Pre-process active diet tags (exclude 'none')
    const activeDietTags = (profile.dietTags || []).filter(t => t !== 'none');

    // User cooking skill mapped to a numeric rank
    const skillRankMap: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 };
    const userSkillRank = skillRankMap[profile.skillLevel || 'intermediate'] || 2;

    for (const recipe of candidates) {
      // ----------------------------------------------------
      // 1. HARD FILTERS
      // ----------------------------------------------------

      // A. Meal Type Match: Recipe must be valid for the requested slot
      if (!recipe.mealTypes.includes(slot)) {
        continue;
      }

      // B. Absolute Allergen Exclusion (Bulletproof Safety)
      let containsAllergen = false;
      const recipeAllergens = (recipe.allergens || []).map(a => a.toLowerCase().trim());
      const recipeTags = (recipe.tags || []).map(t => t.toLowerCase().trim());
      const recipeNameLower = recipe.name.toLowerCase();
      const recipeDescLower = recipe.description.toLowerCase();

      for (const allergen of userAllergies) {
        // Match in allergens list
        if (recipeAllergens.some(a => a.includes(allergen) || allergen.includes(a))) {
          containsAllergen = true;
          break;
        }
        // Match in recipe tags
        if (recipeTags.some(t => t.includes(allergen))) {
          containsAllergen = true;
          break;
        }
        // Match in recipe name/description
        if (recipeNameLower.includes(allergen) || recipeDescLower.includes(allergen)) {
          containsAllergen = true;
          break;
        }
        // Match in ingredients
        if (recipe.ingredients.some(ing => ing.name.toLowerCase().includes(allergen))) {
          containsAllergen = true;
          break;
        }
      }
      if (containsAllergen) {
        continue;
      }

      // C. Strict Diet Tag Compliance
      if (activeDietTags.length > 0) {
        const hasAllDiets = activeDietTags.every(diet => recipe.dietTags.includes(diet));
        if (!hasAllDiets) {
          continue;
        }
      }

      // D. Cuisine Filter (Case-Insensitive Match)
      if (cuisineFilter) {
        const filterLower = cuisineFilter.toLowerCase().trim();
        if (recipe.cuisine.toLowerCase().trim() !== filterLower) {
          continue;
        }
      }

      // E. Cooking Skill Match (recipe difficulty <= user skill)
      const difficultyRankMap: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
      const recipeDiffRank = difficultyRankMap[recipe.difficulty || 'easy'] || 1;
      if (recipeDiffRank > userSkillRank) {
        continue;
      }

      // ----------------------------------------------------
      // 2. WEIGHTED SCORING
      // ----------------------------------------------------

      // A. Calorie/Goal Fit (Weight: 30)
      // Determine target calories for this slot
      let slotCalorieTarget = 0;
      if (profile.includeSnacks) {
        if (slot === 'breakfast') slotCalorieTarget = targetCaloriesPerDay * 0.25;
        else if (slot === 'lunch') slotCalorieTarget = targetCaloriesPerDay * 0.35;
        else if (slot === 'snack') slotCalorieTarget = targetCaloriesPerDay * 0.05;
        else if (slot === 'dinner') slotCalorieTarget = targetCaloriesPerDay * 0.35;
      } else {
        if (slot === 'breakfast') slotCalorieTarget = targetCaloriesPerDay * 0.30;
        else if (slot === 'lunch') slotCalorieTarget = targetCaloriesPerDay * 0.35;
        else if (slot === 'dinner') slotCalorieTarget = targetCaloriesPerDay * 0.35;
      }

      // Allow overriding calorie target (e.g. dinner resolving remaining calories)
      // passed as a temporary field if custom context is structured.
      const customSlotTarget = (ctx as any).slotCalorieTarget;
      const targetForSlot = customSlotTarget !== undefined ? customSlotTarget : slotCalorieTarget;

      const recipeCalories = recipe.nutritionPerServing.calories;
      const calorieDiff = Math.abs(recipeCalories - targetForSlot);
      // Score decreases as distance from target increases
      const calorieFitScore = Math.max(0, 30 * (1 - (targetForSlot > 0 ? calorieDiff / targetForSlot : 0)));

      // B. Budget Fit (Weight: 20)
      let budgetFitScore = 20; // default perfect score if no budget specified
      if (profile.monthlyBudget && profile.monthlyBudget > 0) {
        const weeklyBudget = profile.monthlyBudget / 4.33;
        const dailyBudget = weeklyBudget / 7;
        
        let slotBudgetWeight = 0.35; // default to lunch/dinner budget share
        if (profile.includeSnacks) {
          if (slot === 'breakfast') slotBudgetWeight = 0.25;
          else if (slot === 'snack') slotBudgetWeight = 0.05;
        } else {
          if (slot === 'breakfast') slotBudgetWeight = 0.30;
        }
        
        const slotBudgetLimit = dailyBudget * slotBudgetWeight;
        const recipeCost = recipe.estimatedCostPerServing;
        
        if (recipeCost <= slotBudgetLimit) {
          budgetFitScore = 20;
        } else {
          const excessCost = recipeCost - slotBudgetLimit;
          budgetFitScore = Math.max(0, 20 * (1 - excessCost / slotBudgetLimit));
        }
      }

      // C. Skill Fit (Weight: 15)
      // Recipes meeting difficulty limit score 15 points
      const skillFitScore = 15;

      // D. Time Fit (Weight: 15)
      let timeLimit = 60; // default threshold
      if (profile.willingnessToCook === 'prefer_not') {
        timeLimit = 30;
      } else if (profile.willingnessToCook === 'sometimes') {
        timeLimit = 60;
      } else if (profile.willingnessToCook === 'love') {
        timeLimit = 120;
      }
      
      const totalRecipeTime = recipe.prepTimeMins + recipe.cookTimeMins;
      let timeFitScore = 15;
      if (totalRecipeTime > timeLimit) {
        const excessTime = totalRecipeTime - timeLimit;
        timeFitScore = Math.max(0, 15 * (1 - excessTime / 60));
      }

      // E. Favorite Food Match (Weight: 20)
      let favMatchScore = 0;
      const favoriteFoods = (profile.favoriteFoods || []).map(f => f.toLowerCase().trim()).filter(Boolean);
      if (favoriteFoods.length > 0) {
        const matchesFav = favoriteFoods.some(fav => {
          return (
            recipeNameLower.includes(fav) ||
            recipeDescLower.includes(fav) ||
            recipeTags.some(t => t.includes(fav)) ||
            recipe.ingredients.some(ing => ing.name.toLowerCase().includes(fav))
          );
        });
        if (matchesFav) {
          favMatchScore = 20;
        }
      }

      // F. Variety Penalty (Subtracted dynamically)
      let varietyPenalty = 0;
      if (alreadySelectedIds.includes(recipe.id)) {
        // Counts duplicates of this recipe in the active build plan
        const duplicates = alreadySelectedIds.filter(id => id === recipe.id).length;
        varietyPenalty = duplicates * 20;
      }

      // Combined base score (max 100)
      const baseScore = calorieFitScore + budgetFitScore + skillFitScore + timeFitScore + favMatchScore;
      const finalScore = Math.round(Math.max(0, baseScore - varietyPenalty));

      scored.push({
        recipe,
        score: finalScore,
        breakdown: {
          calorieFit: Math.round(calorieFitScore),
          budgetFit: Math.round(budgetFitScore),
          skillFit: skillFitScore,
          timeFit: Math.round(timeFitScore),
          favMatch: favMatchScore,
          varietyPenalty,
        },
      });
    }

    // Sort descending by score
    return scored.sort((a, b) => b.score - a.score);
  }

  /**
   * Generates a weekly 7-day meal plan.
   */
  generateWeeklyPlan(input: PlanInput): MealPlan {
    const { profile, candidates, startDate, targetCaloriesPerDay, existingPlan } = input;
    const days: MealPlanDay[] = [];
    const recipeMap = new Map<string, Recipe>(candidates.map(r => [r.id, r]));

    // Keep track of all selected recipe IDs for global plan variety calculations
    const planSelectedIds: string[] = [];

    // Pre-populate already-selected IDs from locked meals in existingPlan to apply variety penalties
    if (existingPlan) {
      for (const day of existingPlan.days) {
        if (day.breakfast?.locked) planSelectedIds.push(day.breakfast.recipeId);
        if (day.lunch?.locked) planSelectedIds.push(day.lunch.recipeId);
        if (day.dinner?.locked) planSelectedIds.push(day.dinner.recipeId);
        if (day.snacks) {
          for (const s of day.snacks) {
            if (s.locked) planSelectedIds.push(s.recipeId);
          }
        }
      }
    }

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      // Find matching day in existingPlan to preserve locks
      const existingDay = existingPlan?.days[dayIndex];

      let breakfast: PlannedMeal | undefined = existingDay?.breakfast?.locked
        ? { ...existingDay.breakfast }
        : undefined;

      let lunch: PlannedMeal | undefined = existingDay?.lunch?.locked
        ? { ...existingDay.lunch }
        : undefined;

      let dinner: PlannedMeal | undefined = existingDay?.dinner?.locked
        ? { ...existingDay.dinner }
        : undefined;

      const snacks: PlannedMeal[] = [];
      if (profile.includeSnacks) {
        const existingSnacks = existingDay?.snacks || [];
        for (const s of existingSnacks) {
          if (s.locked) {
            snacks.push({ ...s });
          }
        }
      }

      // Track calories selected today so far to dynamically balance remaining calories
      const getCalories = (pm: PlannedMeal | undefined) => {
        if (!pm) return 0;
        const rec = recipeMap.get(pm.recipeId);
        return rec ? rec.nutritionPerServing.calories * pm.servings : 0;
      };

      // Helper function to pick slot recipe
      const pickSlotRecipe = (slot: MealType, targetOverride?: number): Recipe | undefined => {
        const context: RecommendationContext & { slotCalorieTarget?: number } = {
          profile,
          targetCaloriesPerDay,
        };
        if (targetOverride !== undefined) {
          context.slotCalorieTarget = targetOverride;
        }

        const scored = this.scoreRecipes(candidates, context, slot, planSelectedIds);
        
        if (scored.length > 0) {
          return scored[0].recipe;
        }

        // Fallback: If no candidate passed filters, try again ignoring skill limits
        const fallbackCtx = { ...context, profile: { ...profile, skillLevel: 'advanced' as any } };
        const fallbackScored = this.scoreRecipes(candidates, fallbackCtx, slot, planSelectedIds);
        if (fallbackScored.length > 0) {
          return fallbackScored[0].recipe;
        }

        // Deep fallback: just find the first recipe in candidate list that matching the meal slot
        // and doesn't contain user allergens (allergens safety must NEVER be bypassed).
        const userAllergies = (profile.allergies || []).map(a => a.toLowerCase().trim()).filter(Boolean);
        const safeCandidates = candidates.filter(r => {
          if (!r.mealTypes.includes(slot)) return false;
          return !r.allergens.some(a => userAllergies.includes(a.toLowerCase().trim()));
        });
        return safeCandidates[0];
      };

      // 1. Resolve Breakfast
      if (!breakfast) {
        const rec = pickSlotRecipe('breakfast');
        if (rec) {
          breakfast = { recipeId: rec.id, servings: 1, locked: false };
          planSelectedIds.push(rec.id);
        }
      }

      // 2. Resolve Lunch
      if (!lunch) {
        const rec = pickSlotRecipe('lunch');
        if (rec) {
          lunch = { recipeId: rec.id, servings: 1, locked: false };
          planSelectedIds.push(rec.id);
        }
      }

      // 3. Resolve Snacks (if requested, and not already populated from locked)
      if (profile.includeSnacks && snacks.length === 0) {
        const rec = pickSlotRecipe('snack');
        if (rec) {
          snacks.push({ recipeId: rec.id, servings: 1, locked: false });
          planSelectedIds.push(rec.id);
        }
      }

      // 4. Resolve Dinner
      // Calculate remaining calories for today to balance the daily target
      if (!dinner) {
        const breakfastCals = getCalories(breakfast);
        const lunchCals = getCalories(lunch);
        const snackCals = snacks.reduce((sum, s) => sum + getCalories(s), 0);
        
        const remainingCals = targetCaloriesPerDay - (breakfastCals + lunchCals + snackCals);
        // Ensure remaining target is positive
        const dinnerTarget = Math.max(100, remainingCals);
        
        const rec = pickSlotRecipe('dinner', dinnerTarget);
        if (rec) {
          dinner = { recipeId: rec.id, servings: 1, locked: false };
          planSelectedIds.push(rec.id);
        }
      }

      // Construct day
      const date = new Date(startDate);
      date.setDate(date.getDate() + dayIndex);

      days.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: date.getDay(),
        breakfast,
        lunch,
        dinner,
        snacks: profile.includeSnacks ? snacks : undefined,
      });
    }

    // Calculate total estimated plan cost
    let estimatedWeeklyCost = 0;
    for (const day of days) {
      const bMeal = day.breakfast ? recipeMap.get(day.breakfast.recipeId) : null;
      const lMeal = day.lunch ? recipeMap.get(day.lunch.recipeId) : null;
      const dMeal = day.dinner ? recipeMap.get(day.dinner.recipeId) : null;

      if (bMeal) estimatedWeeklyCost += bMeal.estimatedCostPerServing * (day.breakfast?.servings || 1);
      if (lMeal) estimatedWeeklyCost += lMeal.estimatedCostPerServing * (day.lunch?.servings || 1);
      if (dMeal) estimatedWeeklyCost += dMeal.estimatedCostPerServing * (day.dinner?.servings || 1);

      if (day.snacks) {
        for (const s of day.snacks) {
          const sMeal = recipeMap.get(s.recipeId);
          if (sMeal) estimatedWeeklyCost += sMeal.estimatedCostPerServing * s.servings;
        }
      }
    }

    return {
      id: Math.random().toString(36).substring(7),
      weekStartDate: startDate,
      days,
      targetCaloriesPerDay,
      estimatedWeeklyCost: Math.round(estimatedWeeklyCost),
      createdAt: new Date().toISOString(),
      profileSnapshot: {
        dietTags: profile.dietTags,
        allergies: profile.allergies,
        goal: profile.goal,
        skillLevel: profile.skillLevel,
        monthlyBudget: profile.monthlyBudget,
        currency: profile.currency,
      },
    };
  }

  /**
   * Suggests top swap recipes for a specific day and meal slot in a plan.
   */
  suggestSwap(
    dayIndex: number,
    slot: MealType,
    currentPlan: MealPlan,
    candidates: Recipe[],
    profile: UserProfile
  ): Recipe[] {
    // 1. Gather all currently selected recipe IDs in the plan, excluding the one we are swapping out
    const planSelectedIds: string[] = [];
    const day = currentPlan.days[dayIndex];
    const currentSlotMeal = day ? (day as any)[slot] : null;
    const currentRecipeId = Array.isArray(currentSlotMeal)
      ? (currentSlotMeal[0] ? currentSlotMeal[0].recipeId : '')
      : (currentSlotMeal ? currentSlotMeal.recipeId : '');

    for (const d of currentPlan.days) {
      if (d.breakfast) planSelectedIds.push(d.breakfast.recipeId);
      if (d.lunch) planSelectedIds.push(d.lunch.recipeId);
      if (d.dinner) planSelectedIds.push(d.dinner.recipeId);
      if (d.snacks) {
        for (const s of d.snacks) {
          planSelectedIds.push(s.recipeId);
        }
      }
    }

    // Filter out the current recipe to avoid recommending it as its own alternative
    const indexInSelected = planSelectedIds.indexOf(currentRecipeId);
    if (indexInSelected > -1) {
      planSelectedIds.splice(indexInSelected, 1);
    }

    // 2. Determine target calorie budget for this swap slot
    // If dinner, we balance against the rest of the day's actual meals
    let targetOverride: number | undefined;
    if (slot === 'dinner' && day) {
      const getCals = (pm: PlannedMeal | undefined) => {
        if (!pm) return 0;
        const rec = candidates.find(r => r.id === pm.recipeId);
        return rec ? rec.nutritionPerServing.calories * pm.servings : 0;
      };
      const bCals = getCals(day.breakfast);
      const lCals = getCals(day.lunch);
      const sCals = (day.snacks || []).reduce((sum, s) => sum + getCals(s), 0);
      targetOverride = Math.max(100, currentPlan.targetCaloriesPerDay - (bCals + lCals + sCals));
    }

    // 3. Score all candidates
    const context: RecommendationContext & { slotCalorieTarget?: number } = {
      profile,
      targetCaloriesPerDay: currentPlan.targetCaloriesPerDay,
    };
    if (targetOverride !== undefined) {
      context.slotCalorieTarget = targetOverride;
    }

    const scored = this.scoreRecipes(candidates, context, slot, planSelectedIds);

    // Filter out the exact same recipe if it managed to pass through
    const alternatives = scored
      .filter(s => s.recipe.id !== currentRecipeId)
      .map(s => s.recipe);

    return alternatives;
  }
}
