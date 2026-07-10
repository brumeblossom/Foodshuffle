import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './db';
import {
  getProfile,
  saveProfile,
  getRecipes,
  getRecipeById,
  bulkAddRecipes,
  getPlans,
  savePlan,
  deletePlan,
  getPantry,
  addPantryItem,
  deletePantryItem,
  getMeta,
  saveMeta,
  initAppMetaAndSeeds,
  SEED_RECIPES
} from './repo';
import type { UserProfile, Recipe, MealPlan, PantryItem, AppMeta } from './types';

describe('FoodShuffle Database Repository Helpers', () => {
  beforeEach(async () => {
    // Clear all tables before each test block for isolated test state
    await Promise.all([
      db.profile.clear(),
      db.recipes.clear(),
      db.mealPlans.clear(),
      db.pantry.clear(),
      db.appMeta.clear()
    ]);
  });

  // ---------- Profile Helper Tests ----------
  describe('UserProfile Repository Helpers', () => {
    it('should return null when no profile has been saved', async () => {
      const profile = await getProfile();
      expect(profile).toBeNull();
    });

    it('should save and retrieve user profile correctly', async () => {
      const mockProfile: UserProfile = {
        id: 'primary',
        name: 'Fatima',
        gender: 'female',
        age: 28,
        favoriteFoods: ['jollof', 'plantain'],
        allergies: ['peanuts'],
        dietTags: ['vegetarian'],
        goal: 'weight_loss',
        currency: 'NGN',
        includeSnacks: false,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveProfile(mockProfile);
      const profile = await getProfile();
      
      expect(profile).not.toBeNull();
      expect(profile?.name).toBe('Fatima');
      expect(profile?.goal).toBe('weight_loss');
      expect(profile?.allergies).toContain('peanuts');
    });
  });

  // ---------- Recipes Helper Tests ----------
  describe('Recipes Repository Helpers', () => {
    it('should return an empty array if no recipes are loaded', async () => {
      const recipes = await getRecipes();
      expect(recipes).toEqual([]);
    });

    it('should bulk put and retrieve recipes', async () => {
      const mockRecipes: Recipe[] = [
        {
          id: 'rec-1',
          name: 'Pasta Salad',
          description: 'Cold salad',
          cuisine: 'Italian',
          mealTypes: ['lunch'],
          ingredients: [{ name: 'pasta', quantity: 200, unit: 'g' }],
          steps: ['Boil pasta', 'Mix salad'],
          prepTimeMins: 10,
          cookTimeMins: 10,
          servings: 2,
          nutritionPerServing: { calories: 250, protein: 6, carbs: 45, fat: 4 },
          dietTags: ['vegetarian'],
          allergens: ['gluten'],
          estimatedCostPerServing: 300,
          costCurrency: 'NGN',
          difficulty: 'easy',
          tags: ['cold']
        }
      ];

      await bulkAddRecipes(mockRecipes);
      
      const allRecipes = await getRecipes();
      expect(allRecipes.length).toBe(1);
      expect(allRecipes[0].name).toBe('Pasta Salad');

      const single = await getRecipeById('rec-1');
      expect(single).not.toBeNull();
      expect(single?.cuisine).toBe('Italian');
    });
  });

  // ---------- Meal Plans Helper Tests ----------
  describe('Meal Plans Repository Helpers', () => {
    it('should save, list, and delete meal plans', async () => {
      const mockPlan: MealPlan = {
        id: 'plan-week-1',
        weekStartDate: '2026-07-06T00:00:00.000Z',
        days: [],
        targetCaloriesPerDay: 2000,
        estimatedWeeklyCost: 5600,
        createdAt: new Date().toISOString(),
        profileSnapshot: {
          dietTags: ['none'],
          allergies: [],
          goal: 'fitness',
          currency: 'NGN'
        }
      };

      await savePlan(mockPlan);

      const plans = await getPlans();
      expect(plans.length).toBe(1);
      expect(plans[0].targetCaloriesPerDay).toBe(2000);

      await deletePlan('plan-week-1');
      const emptyPlans = await getPlans();
      expect(emptyPlans.length).toBe(0);
    });
  });

  // ---------- Pantry Helper Tests ----------
  describe('Pantry Repository Helpers', () => {
    it('should handle pantry item creation, fetch, and removal', async () => {
      const item: PantryItem = {
        id: 'pantry-1',
        name: 'Whole Milk',
        normalizedName: 'milk',
        addedAt: new Date().toISOString()
      };

      await addPantryItem(item);

      const pantry = await getPantry();
      expect(pantry.length).toBe(1);
      expect(pantry[0].normalizedName).toBe('milk');

      await deletePantryItem('pantry-1');
      const emptyPantry = await getPantry();
      expect(emptyPantry.length).toBe(0);
    });
  });

  // ---------- Seeding & Metadata Tests ----------
  describe('Seeding & Metadata Lifecycle', () => {
    it('should save and get metadata', async () => {
      const mockMeta: AppMeta = {
        id: 'meta',
        schemaVersion: 1,
        seedVersion: 2,
        theme: 'dark'
      };

      await saveMeta(mockMeta);
      const meta = await getMeta();
      expect(meta).not.toBeNull();
      expect(meta?.theme).toBe('dark');
      expect(meta?.seedVersion).toBe(2);
    });

    it('should initialize seeds on first run and toggle flags', async () => {
      // First run: Metadata table is empty
      const isSeededFirst = await initAppMetaAndSeeds();
      expect(isSeededFirst).toBe(true);

      // Verify metadata records exist
      const meta = await getMeta();
      expect(meta).not.toBeNull();
      expect(meta?.seedVersion).toBe(1);

      // Verify recipes exist
      const recipes = await getRecipes();
      expect(recipes.length).toBe(SEED_RECIPES.length);
      
      const sortedRecipes = [...recipes].sort((a, b) => a.id.localeCompare(b.id));
      const sortedSeeds = [...SEED_RECIPES].sort((a, b) => a.id.localeCompare(b.id));
      expect(sortedRecipes[0].name).toBe(sortedSeeds[0].name);

      // Second run: should return false as seedVersion is already current
      const isSeededSecond = await initAppMetaAndSeeds();
      expect(isSeededSecond).toBe(false);
    });
  });
});
