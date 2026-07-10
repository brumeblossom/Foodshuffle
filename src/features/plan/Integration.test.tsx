import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { OnboardingPage } from '../onboarding/OnboardingPage';
import { ThisWeekPage } from '../plan/ThisWeekPage';
import { FridgePage } from '../fridge/FridgePage';
import { useProfileStore } from '../../app/profileStore';
import { usePlanStore } from '../../app/planStore';
import { usePantryStore } from '../../app/pantryStore';
import { useUiStore } from '../../app/uiStore';
import { getRecipes, saveProfile, getProfile } from '../../data/repo';
import { container } from '../../core/compositionRoot';
import type { Recipe, DietTag } from '../../data/types';

// Mock repo
vi.mock('../../data/repo', () => {
  return {
    getRecipes: vi.fn(),
    getRecipeById: vi.fn(),
    getPlans: vi.fn().mockResolvedValue([]),
    savePlan: vi.fn().mockResolvedValue(undefined),
    saveProfile: vi.fn(),
    getProfile: vi.fn(),
  };
});

const mockRecipes: Recipe[] = [
  {
    id: 'rec-1',
    name: 'Spiced Jollof Rice',
    description: 'Flavorful rice',
    cuisine: 'nigerian',
    mealTypes: ['breakfast', 'lunch', 'dinner'],
    ingredients: [
      { name: 'Rice', quantity: 2, unit: 'cups' },
      { name: 'Tomato', quantity: 3, unit: 'pieces' }
    ],
    steps: ['Boil rice'],
    prepTimeMins: 15,
    cookTimeMins: 30,
    servings: 4,
    nutritionPerServing: { calories: 400, protein: 10, carbs: 70, fat: 8 },
    dietTags: ['vegetarian'],
    allergens: [],
    estimatedCostPerServing: 800,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: [],
  },
  {
    id: 'rec-2',
    name: 'Peanut Butter Oatmeal',
    description: 'Rich oats',
    cuisine: 'american',
    mealTypes: ['breakfast'],
    ingredients: [
      { name: 'Oats', quantity: 1, unit: 'cup' },
      { name: 'Peanut Butter', quantity: 2, unit: 'tbsp' }
    ],
    steps: ['Mix and eat'],
    prepTimeMins: 5,
    cookTimeMins: 5,
    servings: 1,
    nutritionPerServing: { calories: 350, protein: 12, carbs: 30, fat: 20 },
    dietTags: ['vegetarian', 'vegan'],
    allergens: ['peanuts'],
    estimatedCostPerServing: 300,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: [],
  },
  {
    id: 'rec-3',
    name: 'Suya Skewer',
    description: 'Spicy grilled meat',
    cuisine: 'nigerian',
    mealTypes: ['dinner'],
    ingredients: [
      { name: 'Beef', quantity: 200, unit: 'g' }
    ],
    steps: ['Grill meat'],
    prepTimeMins: 10,
    cookTimeMins: 15,
    servings: 2,
    nutritionPerServing: { calories: 500, protein: 40, carbs: 2, fat: 35 },
    dietTags: ['none'],
    allergens: [],
    estimatedCostPerServing: 1200,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: [],
  }
];

describe('MVP Integration Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getRecipes).mockResolvedValue(mockRecipes);
    vi.mocked(saveProfile).mockResolvedValue('primary');
    vi.mocked(getProfile).mockResolvedValue(null);

    // Initial state reset
    useProfileStore.setState({
      profile: null,
      dailyTarget: null,
      macroTargets: null,
    });
    usePlanStore.setState({
      currentPlan: null,
    });
    usePantryStore.setState({
      items: [],
      loadPantry: vi.fn().mockResolvedValue(undefined),
      addItemsFromText: vi.fn().mockResolvedValue(undefined),
      removeItem: vi.fn().mockResolvedValue(undefined),
      clearPantry: vi.fn().mockResolvedValue(undefined),
    });
    useUiStore.setState({
      theme: 'system',
      toasts: [],
      addToast: vi.fn(),
    });
  });

  it('runs integration: onboarding -> finish -> generate plan respects constraints', async () => {
    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <OnboardingPage />
      </MemoryRouter>
    );

    // Step 1: Name
    const nameInput = screen.getByPlaceholderText(/e.g. Blossom/i);
    fireEvent.change(nameInput, { target: { value: 'Blossom' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 2: Gender/Age
    expect(await screen.findByText(/Tell us a bit about yourself/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 3: Height & Weight (Skip)
    expect(await screen.findByText(/Body Metrics \(Optional\)/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Skip/i }));

    // Step 4: Favorites
    expect(await screen.findByText(/Any favorite ingredients\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 5: Allergies
    expect(await screen.findByText(/Do you have food allergies\?/i)).toBeInTheDocument();
    // Select peanut allergy
    const peanutBtn = screen.getByRole('button', { name: /peanuts/i });
    fireEvent.click(peanutBtn);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 6: Diet type
    expect(await screen.findByText(/Do you follow a specific diet\?/i)).toBeInTheDocument();
    // Select vegetarian diet
    const vegBtn = screen.getByRole('button', { name: /vegetarian/i });
    fireEvent.click(vegBtn);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 7: Activity
    expect(await screen.findByText(/How active are you\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 8: Goal
    expect(await screen.findByText(/What is your weekly health goal\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 9: Budget
    expect(await screen.findByText(/Set your grocery budget/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 10: Cooking preferences
    expect(await screen.findByText(/Lastly, cooking preferences/i)).toBeInTheDocument();
    
    // Complete Onboarding
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Complete Onboarding/i }));
    });

    // Check complete screen
    expect(await screen.findByText(/Onboarding Complete/i)).toBeInTheDocument();

    // Click generate plan button
    const generateBtn = screen.getByRole('button', { name: /Generate my first week/i });
    await act(async () => {
      fireEvent.click(generateBtn);
    });

    // Verify generated plan state
    const plan = usePlanStore.getState().currentPlan;
    expect(plan).toBeDefined();
    expect(plan?.days.length).toBe(7);

    // Verify constraints: no peanuts (rec-2 excluded), vegetarian only (rec-3 excluded)
    plan?.days.forEach(day => {
      // Check breakfast
      if (day.breakfast) {
        const recipe = mockRecipes.find(r => r.id === day.breakfast?.recipeId);
        expect(recipe?.allergens).not.toContain('peanuts');
        expect(recipe?.dietTags).toContain('vegetarian');
      }
      // Check lunch
      if (day.lunch) {
        const recipe = mockRecipes.find(r => r.id === day.lunch?.recipeId);
        expect(recipe?.allergens).not.toContain('peanuts');
        expect(recipe?.dietTags).toContain('vegetarian');
      }
      // Check dinner
      if (day.dinner) {
        const recipe = mockRecipes.find(r => r.id === day.dinner?.recipeId);
        expect(recipe?.allergens).not.toContain('peanuts');
        expect(recipe?.dietTags).toContain('vegetarian');
      }
    });
  });

  it('runs integration: swap suggestions respect user allergies and diet constraints', async () => {
    // Setup profile store with peanut allergy & vegetarian diet
    const profile = {
      id: 'primary' as const,
      name: 'Blossom',
      gender: 'female' as const,
      age: 25,
      favoriteFoods: [] as string[],
      allergies: ['peanuts'] as string[],
      dietTags: ['vegetarian'] as DietTag[],
      goal: 'general_health' as const,
      currency: 'NGN',
      skillLevel: 'intermediate' as const,
      includeSnacks: false,
      onboardingComplete: true,
      createdAt: '',
      updatedAt: '',
    };
    useProfileStore.setState({
      profile,
      dailyTarget: { calories: 2000, isEstimate: false },
    });

    // Initialize mock plan
    const plan = {
      id: 'current-plan',
      weekStartDate: '2026-07-09',
      estimatedWeeklyCost: 5000,
      targetCaloriesPerDay: 2000,
      createdAt: '',
      profileSnapshot: profile,
      days: [
        {
          date: '2026-07-09',
          dayOfWeek: 0,
          breakfast: { recipeId: 'rec-1', servings: 1, locked: false },
          lunch: undefined,
          dinner: undefined,
          snacks: [],
        }
      ]
    };
    usePlanStore.setState({ currentPlan: plan });

    render(
      <MemoryRouter>
        <ThisWeekPage />
      </MemoryRouter>
    );

    // Open swap menu or run suggestion swaps directly to check suggestions output
    const suggestions = container.recommendationProvider.suggestSwap(0, 'breakfast', plan, mockRecipes, profile);

    // Assert candidates list excludes peanuts (rec-2) and non-vegetarian (rec-3)
    const ids = suggestions.map(r => r.id);
    expect(ids).not.toContain('rec-2'); // peanuts
    expect(ids).not.toContain('rec-3'); // non-vegetarian
  });

  it('runs integration: fridge recipe results respect allergies and diet tags', async () => {
    // Setup profile store with peanut allergy & vegetarian diet
    useProfileStore.setState({
      profile: {
        id: 'primary' as const,
        name: 'Blossom',
        gender: 'female' as const,
        age: 25,
        favoriteFoods: [] as string[],
        allergies: ['peanuts'] as string[],
        dietTags: ['vegetarian'] as DietTag[],
        goal: 'general_health' as const,
        currency: 'NGN',
        skillLevel: 'intermediate' as const,
        includeSnacks: false,
        onboardingComplete: true,
        createdAt: '',
        updatedAt: '',
      },
      dailyTarget: { calories: 2000, isEstimate: false },
    });

    render(
      <MemoryRouter>
        <FridgePage />
      </MemoryRouter>
    );

    // Type text and search
    const textInput = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(textInput, { target: { value: 'rice, oats' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Find Matching Recipes/i }));
    });

    // Check rendered result cards
    expect(screen.getByText(/Spiced Jollof Rice/i)).toBeInTheDocument();
    
    // Peanut butter oatmeal contains peanuts, should NOT be rendered
    expect(screen.queryByText(/Peanut Butter Oatmeal/i)).not.toBeInTheDocument();
  });
});
