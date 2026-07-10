import { describe, it, expect } from 'vitest';
import {
  normalizeIngredient,
  parsePantryInput,
  matchRecipes,
} from './fridgeMatcher';
import type { Recipe, UserProfile } from '../data/types';

describe('Fridge Matcher Core', () => {
  describe('normalizeIngredient', () => {
    it('normalizes casing and trims whitespace', () => {
      expect(normalizeIngredient('  TOMAto  ')).toBe('tomato');
    });

    it('removes quantities, decimals, fractions and prepositions', () => {
      expect(normalizeIngredient('2 cups of tomatoes')).toBe('tomato');
      expect(normalizeIngredient('1/2 tbsp olive oil')).toBe('oil');
      expect(normalizeIngredient('0.5 grams of garlic cloves')).toBe('garlic');
      expect(normalizeIngredient('1.5 kg chicken breast')).toBe('chicken');
      expect(normalizeIngredient('½ cup red onions')).toBe('onion');
    });

    it('removes trailing parenthetical comments', () => {
      expect(normalizeIngredient('bell pepper (finely chopped)')).toBe('pepper');
    });

    it('performs basic singularization', () => {
      expect(normalizeIngredient('tomatoes')).toBe('tomato');
      expect(normalizeIngredient('potatoes')).toBe('potato');
      expect(normalizeIngredient('strawberries')).toBe('strawberry');
      expect(normalizeIngredient('onions')).toBe('onion');
    });

    it('resolves common synonyms to their canonical name', () => {
      expect(normalizeIngredient('bell pepper')).toBe('pepper');
      expect(normalizeIngredient('habanero pepper')).toBe('pepper');
      expect(normalizeIngredient('chili')).toBe('pepper');
      expect(normalizeIngredient('scallion')).toBe('onion');
      expect(normalizeIngredient('spring onions')).toBe('onion');
      expect(normalizeIngredient('chicken breast')).toBe('chicken');
      expect(normalizeIngredient('olive oil')).toBe('oil');
      expect(normalizeIngredient('vegetable oil')).toBe('oil');
      expect(normalizeIngredient('ground beef')).toBe('beef');
    });
  });

  describe('parsePantryInput', () => {
    it('splits inputs, normalizes each item, and deduplicates', () => {
      const text = `
        1/2 cup of tomatoes,
        2 red onions,
        onion,
        ground beef
      `;
      const result = parsePantryInput(text);
      expect(result).toEqual(['tomato', 'onion', 'beef']);
    });

    it('returns empty array for empty inputs', () => {
      expect(parsePantryInput('')).toEqual([]);
    });
  });

  describe('matchRecipes', () => {
    const mockRecipes: Recipe[] = [
      {
        id: 'r1',
        name: 'Tomato Soup',
        description: 'Warm soup.',
        cuisine: 'Italian',
        mealTypes: ['lunch'],
        ingredients: [
          { name: 'tomatoes', quantity: 4, unit: 'pieces' },
          { name: 'garlic', quantity: 2, unit: 'cloves' },
        ],
        steps: [],
        prepTimeMins: 5,
        cookTimeMins: 15,
        servings: 2,
        nutritionPerServing: { calories: 150, protein: 3, carbs: 20, fat: 4 },
        dietTags: ['vegan', 'vegetarian', 'gluten_free'],
        allergens: [],
        estimatedCostPerServing: 200,
        costCurrency: 'NGN',
        difficulty: 'easy',
        tags: [],
      },
      {
        id: 'r2',
        name: 'Beef Stew',
        description: 'Hearty stew.',
        cuisine: 'Nigerian',
        mealTypes: ['dinner'],
        ingredients: [
          { name: 'beef', quantity: 300, unit: 'g' },
          { name: 'tomatoes', quantity: 2, unit: 'pieces' },
          { name: 'onions', quantity: 1, unit: 'piece' },
        ],
        steps: [],
        prepTimeMins: 15,
        cookTimeMins: 45,
        servings: 3,
        nutritionPerServing: { calories: 400, protein: 30, carbs: 10, fat: 25 },
        dietTags: ['none', 'gluten_free'],
        allergens: [],
        estimatedCostPerServing: 1500,
        costCurrency: 'NGN',
        difficulty: 'medium',
        tags: [],
      },
      {
        id: 'r3',
        name: 'Peanut Rice',
        description: 'Rice cooked with peanuts.',
        cuisine: 'International',
        mealTypes: ['dinner'],
        ingredients: [
          { name: 'rice', quantity: 200, unit: 'g' },
          { name: 'peanuts', quantity: 50, unit: 'g' },
        ],
        steps: [],
        prepTimeMins: 10,
        cookTimeMins: 20,
        servings: 2,
        nutritionPerServing: { calories: 350, protein: 8, carbs: 55, fat: 12 },
        dietTags: ['vegetarian'],
        allergens: ['peanuts'],
        estimatedCostPerServing: 400,
        costCurrency: 'NGN',
        difficulty: 'easy',
        tags: [],
      },
      {
        id: 'r4',
        name: 'Fancy Herb Chicken',
        description: 'Chicken with optional rosemary.',
        cuisine: 'French',
        mealTypes: ['dinner'],
        ingredients: [
          { name: 'chicken breast', quantity: 2, unit: 'pieces' },
          { name: 'rosemary', quantity: 1, unit: 'sprig', optional: true },
        ],
        steps: [],
        prepTimeMins: 10,
        cookTimeMins: 30,
        servings: 2,
        nutritionPerServing: { calories: 250, protein: 28, carbs: 1, fat: 14 },
        dietTags: ['gluten_free'],
        allergens: [],
        estimatedCostPerServing: 800,
        costCurrency: 'NGN',
        difficulty: 'easy',
        tags: [],
      },
    ];

    const defaultProfile: UserProfile = {
      id: 'primary',
      name: 'John Doe',
      gender: 'male',
      age: 30,
      favoriteFoods: [],
      allergies: [],
      dietTags: ['none'],
      goal: 'general_health',
      currency: 'NGN',
      skillLevel: 'advanced',
      includeSnacks: false,
      onboardingComplete: true,
      createdAt: '',
      updatedAt: '',
    };

    it('correctly calculates matches percentages and ranks recipes', () => {
      const pantry = ['tomatoes', 'garlic clove', 'red onion'];
      const ctx = { profile: defaultProfile, targetCaloriesPerDay: 2000 };

      const matches = matchRecipes(pantry, mockRecipes, ctx);

      // Tomato Soup: needs tomato, garlic. Have both -> 100%
      expect(matches[0].recipe.id).toBe('r1');
      expect(matches[0].matchPct).toBe(100);
      expect(matches[0].missing).toEqual([]);

      // Beef Stew: needs beef, tomato, onion. Have tomato, onion -> 66.7%
      expect(matches[1].recipe.id).toBe('r2');
      expect(matches[1].matchPct).toBe(66.7);
      expect(matches[1].missing).toEqual(['beef']);
    });

    it('excludes recipes containing user allergens', () => {
      const pantry = ['rice', 'peanuts'];
      const ctx = {
        profile: { ...defaultProfile, allergies: ['peanuts'] },
        targetCaloriesPerDay: 2000,
      };

      const matches = matchRecipes(pantry, mockRecipes, ctx);
      
      // Peanut Rice (r3) has peanuts allergen, must be completely excluded
      const ids = matches.map(m => m.recipe.id);
      expect(ids).not.toContain('r3');
    });

    it('excludes recipes violating user diet tags', () => {
      const pantry = ['beef', 'tomatoes', 'onions'];
      const ctx = {
        profile: { ...defaultProfile, dietTags: ['vegan'] as any[] },
        targetCaloriesPerDay: 2000,
      } as any;

      const matches = matchRecipes(pantry, mockRecipes, ctx);

      // Beef Stew (r2) is not vegan, must be excluded. Only Tomato Soup (r1) is vegan.
      const ids = matches.map(m => m.recipe.id);
      expect(ids).not.toContain('r2');
      expect(ids).toContain('r1');
    });

    it('excludes recipes exceeding user cooking skill level', () => {
      const pantry = ['beef', 'tomatoes', 'onions'];
      const ctx = {
        profile: { ...defaultProfile, skillLevel: 'beginner' as any },
        targetCaloriesPerDay: 2000,
      } as any;

      const matches = matchRecipes(pantry, mockRecipes, ctx);

      // Beef stew is 'medium' difficulty, so it is excluded for a 'beginner' user.
      const ids = matches.map(m => m.recipe.id);
      expect(ids).not.toContain('r2');
    });

    it('ignores optional ingredients in match counts and missing lists', () => {
      const pantry = ['chicken breast']; // missing optional rosemary
      const ctx = { profile: defaultProfile, targetCaloriesPerDay: 2000 };

      const matches = matchRecipes(pantry, mockRecipes, ctx);
      
      const chickenMatch = matches.find(m => m.recipe.id === 'r4');
      expect(chickenMatch).toBeDefined();
      expect(chickenMatch!.matchPct).toBe(100); // 1/1 required matched
      expect(chickenMatch!.missing).toEqual([]); // rosemary shouldn't be listed as missing
    });
  });
});
