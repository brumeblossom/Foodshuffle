import { describe, it, expect } from 'vitest';
import { SEED_RECIPES } from './recipes';
import { RecipeSchema } from '../validation';

describe('FoodShuffle Recipe Seed Dataset & Validation Checks', () => {
  it('should validate every recipe against the strict Zod RecipeSchema', () => {
    // Assert that each recipe parses successfully with the Zod schema
    SEED_RECIPES.forEach((recipe) => {
      expect(() => RecipeSchema.parse(recipe)).not.toThrow();
    });
  });

  it('should contain exactly 40 recipes in the seed array', () => {
    expect(SEED_RECIPES.length).toBe(40);
  });

  it('should maintain a balanced regional mix (approx. 50% Nigerian/West African, 50% International)', () => {
    const nigerianRecipes = SEED_RECIPES.filter((r) => r.cuisine === 'Nigerian');
    const internationalRecipes = SEED_RECIPES.filter((r) => r.cuisine !== 'Nigerian');

    expect(nigerianRecipes.length).toBe(20);
    expect(internationalRecipes.length).toBe(20);
  });

  it('should satisfy essential allergen and diet filter coverage requirements', () => {
    // Collect counts for each diet filter tag
    const vegetarian = SEED_RECIPES.filter((r) => r.dietTags.includes('vegetarian'));
    const vegan = SEED_RECIPES.filter((r) => r.dietTags.includes('vegan'));
    const diabeticFriendly = SEED_RECIPES.filter((r) => r.dietTags.includes('diabetic_friendly'));
    const glutenFree = SEED_RECIPES.filter((r) => r.dietTags.includes('gluten_free'));
    const halal = SEED_RECIPES.filter((r) => r.dietTags.includes('halal'));
    const keto = SEED_RECIPES.filter((r) => r.dietTags.includes('keto'));

    // Assert that multiple options exist for each constraint filter
    expect(vegetarian.length).toBeGreaterThanOrEqual(10);
    expect(vegan.length).toBeGreaterThanOrEqual(8);
    expect(diabeticFriendly.length).toBeGreaterThanOrEqual(5);
    expect(glutenFree.length).toBeGreaterThanOrEqual(10);
    expect(halal.length).toBeGreaterThanOrEqual(15);
    expect(keto.length).toBeGreaterThanOrEqual(5);
  });

  it('should enforce NGN currency and positive cost constraints', () => {
    SEED_RECIPES.forEach((recipe) => {
      expect(recipe.costCurrency).toBe('NGN');
      expect(recipe.estimatedCostPerServing).toBeGreaterThan(0);
      expect(recipe.servings).toBeGreaterThan(0);
      
      // Basic nutritional validations
      expect(recipe.nutritionPerServing.calories).toBeGreaterThan(0);
      expect(recipe.nutritionPerServing.protein).toBeGreaterThanOrEqual(0);
      expect(recipe.nutritionPerServing.carbs).toBeGreaterThanOrEqual(0);
      expect(recipe.nutritionPerServing.fat).toBeGreaterThanOrEqual(0);
    });
  });

  it('should spread recipes across meal types and difficulty levels', () => {
    const breakfasts = SEED_RECIPES.filter((r) => r.mealTypes.includes('breakfast'));
    const lunches = SEED_RECIPES.filter((r) => r.mealTypes.includes('lunch'));
    const dinners = SEED_RECIPES.filter((r) => r.mealTypes.includes('dinner'));
    const snacks = SEED_RECIPES.filter((r) => r.mealTypes.includes('snack'));

    expect(breakfasts.length).toBeGreaterThanOrEqual(5);
    expect(lunches.length).toBeGreaterThanOrEqual(15);
    expect(dinners.length).toBeGreaterThanOrEqual(15);
    expect(snacks.length).toBeGreaterThanOrEqual(5);

    const easy = SEED_RECIPES.filter((r) => r.difficulty === 'easy');
    const medium = SEED_RECIPES.filter((r) => r.difficulty === 'medium');
    const hard = SEED_RECIPES.filter((r) => r.difficulty === 'hard');

    expect(easy.length).toBeGreaterThanOrEqual(10);
    expect(medium.length).toBeGreaterThanOrEqual(10);
    expect(hard.length).toBeGreaterThanOrEqual(3);
  });
});
