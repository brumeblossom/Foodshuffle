import { create } from 'zustand';
import type { MealPlan, MealType, Recipe } from '../data/types';
import { getPlans, savePlan, getRecipes } from '../data/repo';
import { useProfileStore } from './profileStore';
import { container } from '../core/compositionRoot';

interface PlanState {
  currentPlan: MealPlan | null;
  isLoading: boolean;
  loadCurrentPlan: () => Promise<void>;
  generateWeeklyPlan: (startDate: string) => Promise<void>;
  regeneratePlan: () => Promise<void>;
  swapMeal: (dayIndex: number, slot: MealType, recipe: Recipe) => Promise<void>;
  toggleLockMeal: (dayIndex: number, slot: MealType, snackIndex?: number) => Promise<void>;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  currentPlan: null,
  isLoading: false,

  loadCurrentPlan: async () => {
    set({ isLoading: true });
    try {
      const plans = await getPlans();
      if (plans.length > 0) {
        // Sort by start date desc to get the most recent weekly plan
        const sorted = plans.sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate));
        set({ currentPlan: sorted[0] });
      } else {
        set({ currentPlan: null });
      }
    } catch (err) {
      console.error('Failed to load current meal plan:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  generateWeeklyPlan: async (startDate: string) => {
    set({ isLoading: true });
    try {
      const profile = useProfileStore.getState().profile;
      const dailyTarget = useProfileStore.getState().dailyTarget;
      if (!profile || !dailyTarget) {
        throw new Error('User profile or nutrition targets not set.');
      }

      const recipes = await getRecipes();
      const plan = container.recommendationProvider.generateWeeklyPlan({
        profile,
        candidates: recipes,
        startDate,
        targetCaloriesPerDay: dailyTarget.calories,
      });

      await savePlan(plan);
      set({ currentPlan: plan });
    } catch (err) {
      console.error('Failed to generate weekly plan:', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  regeneratePlan: async () => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    set({ isLoading: true });
    try {
      const profile = useProfileStore.getState().profile;
      const dailyTarget = useProfileStore.getState().dailyTarget;
      if (!profile || !dailyTarget) {
        throw new Error('User profile or nutrition targets not set.');
      }

      const recipes = await getRecipes();
      const plan = container.recommendationProvider.generateWeeklyPlan({
        profile,
        candidates: recipes,
        startDate: currentPlan.weekStartDate,
        targetCaloriesPerDay: dailyTarget.calories,
        existingPlan: currentPlan,
      });

      await savePlan(plan);
      set({ currentPlan: plan });
    } catch (err) {
      console.error('Failed to regenerate plan:', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  swapMeal: async (dayIndex: number, slot: MealType, recipe: Recipe) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    set({ isLoading: true });
    try {
      const updatedDays = [...currentPlan.days];
      const day = { ...updatedDays[dayIndex] } as any;

      if (slot === 'snack') {
        if (day.snacks && day.snacks[0]) {
          day.snacks = [{ ...day.snacks[0], recipeId: recipe.id, locked: false }];
        } else {
          day.snacks = [{ recipeId: recipe.id, servings: 1, locked: false }];
        }
      } else {
        day[slot] = { 
          recipeId: recipe.id, 
          servings: day[slot]?.servings || recipe.servings || 2, 
          locked: false 
        };
      }
      updatedDays[dayIndex] = day;

      // Re-calculate plan estimated cost
      const recipes = await getRecipes();
      const recipeMap = new Map(recipes.map(r => [r.id, r]));
      let estimatedWeeklyCost = 0;
      for (const d of updatedDays) {
        if (d.breakfast) estimatedWeeklyCost += (recipeMap.get(d.breakfast.recipeId)?.estimatedCostPerServing || 0) * d.breakfast.servings;
        if (d.lunch) estimatedWeeklyCost += (recipeMap.get(d.lunch.recipeId)?.estimatedCostPerServing || 0) * d.lunch.servings;
        if (d.dinner) estimatedWeeklyCost += (recipeMap.get(d.dinner.recipeId)?.estimatedCostPerServing || 0) * d.dinner.servings;
        if (d.snacks) {
          for (const s of d.snacks) {
            estimatedWeeklyCost += (recipeMap.get(s.recipeId)?.estimatedCostPerServing || 0) * s.servings;
          }
        }
      }

      const updatedPlan: MealPlan = {
        ...currentPlan,
        days: updatedDays,
        estimatedWeeklyCost: Math.round(estimatedWeeklyCost),
      };

      await savePlan(updatedPlan);
      set({ currentPlan: updatedPlan });
    } catch (err) {
      console.error('Failed to swap meal:', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleLockMeal: async (dayIndex: number, slot: MealType, snackIndex?: number) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    try {
      const updatedDays = [...currentPlan.days];
      const day = { ...updatedDays[dayIndex] } as any;

      if (slot === 'snack') {
        const idx = snackIndex ?? 0;
        if (day.snacks && day.snacks[idx]) {
          const updatedSnacks = [...day.snacks];
          updatedSnacks[idx] = { ...updatedSnacks[idx], locked: !updatedSnacks[idx].locked };
          day.snacks = updatedSnacks;
        }
      } else {
        if (day[slot]) {
          day[slot] = { ...day[slot], locked: !day[slot].locked };
        }
      }
      updatedDays[dayIndex] = day;

      const updatedPlan: MealPlan = {
        ...currentPlan,
        days: updatedDays,
      };

      await savePlan(updatedPlan);
      set({ currentPlan: updatedPlan });
    } catch (err) {
      console.error('Failed to toggle lock:', err);
    }
  }
}));
