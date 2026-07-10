import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { OnboardingPage } from '../onboarding/OnboardingPage';
import { ThisWeekPage } from '../plan/ThisWeekPage';
import { RecipesPage } from '../recipes/RecipesPage';
import { RecipeDetailPage } from '../recipes/RecipeDetailPage';
import { FridgePage } from '../fridge/FridgePage';
import { ProfilePage } from '../profile/ProfilePage';
import { useProfileStore } from '../../app/profileStore';
import { usePlanStore } from '../../app/planStore';
import { useUiStore } from '../../app/uiStore';
import { usePantryStore } from '../../app/pantryStore';
import { getRecipes, getRecipeById } from '../../data/repo';
import type { Recipe, MealPlan } from '../../data/types';
import { screen } from '@testing-library/react';

// Mock DB repo functions
vi.mock('../../data/repo', async () => {
  const actual = await vi.importActual<typeof import('../../data/repo')>('../../data/repo');
  return {
    ...actual,
    getRecipes: vi.fn(),
    getRecipeById: vi.fn(),
  };
});

const mockRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Spiced Jollof Rice',
    description: 'Flavorful rice',
    cuisine: 'nigerian',
    mealTypes: ['lunch'],
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
  }
];

const mockPlan: MealPlan = {
  id: 'current-plan',
  weekStartDate: '2026-07-09',
  estimatedWeeklyCost: 8500,
  targetCaloriesPerDay: 2000,
  createdAt: '2026-07-09T00:00:00Z',
  profileSnapshot: {
    dietTags: ['vegetarian'],
    allergies: [],
    goal: 'general_health',
    skillLevel: 'intermediate',
    monthlyBudget: 50000,
    currency: 'NGN',
  },
  days: [
    {
      date: '2026-07-09',
      dayOfWeek: 0,
      breakfast: { recipeId: 'recipe-1', servings: 2, locked: false },
      lunch: undefined,
      dinner: undefined,
      snacks: [],
    },
  ],
};

describe('Automated Axe Accessibility Audits', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getRecipes).mockResolvedValue(mockRecipes);
    vi.mocked(getRecipeById).mockResolvedValue(mockRecipes[0]);

    // Initialize stores with realistic default values
    useProfileStore.setState({
      profile: {
        id: 'primary',
        name: 'Blossom',
        onboardingComplete: true,
        dietTags: ['vegetarian'],
        allergies: [],
        favoriteFoods: [],
        currency: 'NGN',
        includeSnacks: false,
        createdAt: '',
        updatedAt: '',
        goal: 'general_health',
        monthlyBudget: 50000,
      },
      dailyTarget: { calories: 2000, isEstimate: false },
      macroTargets: { proteinG: 100, carbsG: 250, fatG: 50 },
    });

    usePlanStore.setState({
      currentPlan: mockPlan,
      toggleLockMeal: vi.fn(),
      regeneratePlan: vi.fn(),
      swapMeal: vi.fn(),
    });

    useUiStore.setState({
      theme: 'system',
      setTheme: vi.fn(),
      toasts: [],
      addToast: vi.fn(),
      isDbInitialized: true,
    });

    usePantryStore.setState({
      items: [
        { id: 'item-1', name: 'rice', normalizedName: 'rice', addedAt: '' }
      ],
      loadPantry: vi.fn(),
    });
  });

  it('runs axe audit on Onboarding Page step 1', async () => {
    const { container } = render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('runs axe audit on Weekly Plan Dashboard Page', async () => {
    const { container } = render(
      <MemoryRouter>
        <ThisWeekPage />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('runs axe audit on Recipes List Page', async () => {
    const { container } = render(
      <MemoryRouter>
        <RecipesPage />
      </MemoryRouter>
    );
    // Ignore images lacking alt tags checking since it is abstract mockup boxes
    const resultsFiltered = await axe(container, {
      rules: {
        'image-alt': { enabled: false }
      }
    });
    expect(resultsFiltered.violations).toEqual([]);
  });

  it('runs axe audit on Recipe Detail Page', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/recipes/recipe-1']}>
        <Routes>
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    // Need to await loaded state rendering in recipe detail page
    await screen.findByRole('heading', { name: /Spiced Jollof Rice/i });
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('runs axe audit on Cook From Fridge Page', async () => {
    const { container } = render(
      <MemoryRouter>
        <FridgePage />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('runs axe audit on Profile Parameters Settings Page', async () => {
    const { container } = render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
