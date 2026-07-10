import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RecipesPage } from './RecipesPage';
import { RecipeDetailPage } from './RecipeDetailPage';
import { useProfileStore } from '../../app/profileStore';
import { usePlanStore } from '../../app/planStore';
import { useUiStore } from '../../app/uiStore';
import { getRecipes, getRecipeById } from '../../data/repo';
import type { Recipe, MealPlan } from '../../data/types';

// Mock DB repo functions
vi.mock('../../data/repo', () => {
  const actual = vi.importActual('../../data/repo');
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
    mealTypes: ['breakfast', 'lunch'],
    ingredients: [
      { name: 'Rice', quantity: 2, unit: 'cups' },
      { name: 'Peanut oil', quantity: 3, unit: 'tbsp' }
    ],
    steps: ['Boil rice', 'Add spice'],
    prepTimeMins: 15,
    cookTimeMins: 30,
    servings: 4,
    nutritionPerServing: { calories: 400, protein: 10, carbs: 70, fat: 8 },
    dietTags: ['vegetarian'],
    allergens: ['peanuts'],
    estimatedCostPerServing: 800,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: [],
  },
  {
    id: 'recipe-2',
    name: 'Steamed Beans Cake',
    description: 'Steamed protein',
    cuisine: 'nigerian',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Beans', quantity: 3, unit: 'cups' }
    ],
    steps: ['Blend beans', 'Steam'],
    prepTimeMins: 10,
    cookTimeMins: 20,
    servings: 2,
    nutritionPerServing: { calories: 300, protein: 20, carbs: 45, fat: 3 },
    dietTags: ['vegetarian', 'vegan'],
    allergens: [],
    estimatedCostPerServing: 500,
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

describe('Recipes Page & Details Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getRecipes).mockResolvedValue(mockRecipes);
    vi.mocked(getRecipeById).mockImplementation(async (id) => {
      return mockRecipes.find(r => r.id === id) || null;
    });

    // Mock Zustand Stores
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
    });

    usePlanStore.setState({
      currentPlan: mockPlan,
      swapMeal: vi.fn(),
    });

    useUiStore.setState({
      isDbInitialized: true,
      toasts: [],
      addToast: vi.fn(),
    });
  });

  it('renders recipes list and filters by name search input', async () => {
    render(
      <MemoryRouter>
        <RecipesPage />
      </MemoryRouter>
    );

    // Wait for recipes list to load
    const searchInput = await screen.findByPlaceholderText(/Search recipes by name/i);
    expect(screen.getByText(/Spiced Jollof Rice/i)).toBeInTheDocument();
    expect(screen.getByText(/Steamed Beans Cake/i)).toBeInTheDocument();

    // Type beans search
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'beans' } });
    });

    expect(screen.queryByText(/Spiced Jollof Rice/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Steamed Beans Cake/i)).toBeInTheDocument();
  });

  it('filters out peanut allergen triggering recipe when safe checkbox is toggled', async () => {
    // Set user allergies to peanuts for this test
    useProfileStore.setState({
      profile: {
        ...useProfileStore.getState().profile!,
        allergies: ['peanuts'],
      },
    });

    render(
      <MemoryRouter>
        <RecipesPage />
      </MemoryRouter>
    );

    // By default, safe allergen check is toggle-on
    const triggerItem = await screen.findByText(/Steamed Beans Cake/i);
    expect(triggerItem).toBeInTheDocument();
    // Peanut recipe contains 'peanuts' allergen warning which matches profile.allergies = ['peanuts']
    expect(screen.queryByText(/Spiced Jollof Rice/i)).not.toBeInTheDocument();

    // Untoggle safe for allergies
    const cb = screen.getByLabelText(/Safe for my allergies/i);
    await act(async () => {
      fireEvent.click(cb);
    });

    // Should display both recipes now
    expect(screen.getByText(/Spiced Jollof Rice/i)).toBeInTheDocument();
  });

  it('renders RecipeDetailPage and scales quantities with the servings stepper', async () => {
    render(
      <MemoryRouter initialEntries={['/recipes/recipe-1']}>
        <Routes>
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for name to load
    const heading = await screen.findByRole('heading', { name: /Spiced Jollof Rice/i });
    expect(heading).toBeInTheDocument();

    // Servings is 4. Quantities are: Rice 2 cups, Peanut oil 3 tbsp
    expect(screen.getByText(/2 cups/i)).toBeInTheDocument();

    // Change stepper range slider directly to 8 servings
    const slider = screen.getByRole('slider');
    await act(async () => {
      fireEvent.change(slider, { target: { value: '8' } });
    });

    // Should dynamically scale Rice quantity to 4 cups (2 qty * 8 target serv / 4 original serv)
    expect(screen.getByText(/4 cups/i)).toBeInTheDocument();
  });

  it('schedules recipe into meal plan when submit button clicked', async () => {
    const swapMock = vi.fn();
    usePlanStore.setState({
      currentPlan: mockPlan,
      swapMeal: swapMock,
    });

    render(
      <MemoryRouter initialEntries={['/recipes/recipe-2']}>
        <Routes>
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByRole('heading', { name: /Steamed Beans Cake/i });

    // Select Day Wednesday (index 2)
    const daySelect = screen.getByLabelText(/Target Day/i);
    fireEvent.change(daySelect, { target: { value: '2' } });

    // Select Lunch slot
    const slotSelect = screen.getByLabelText(/Target Slot/i);
    fireEvent.change(slotSelect, { target: { value: 'lunch' } });

    // Add to plan button
    const addBtn = screen.getByRole('button', { name: /Add to My Week/i });
    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(swapMock).toHaveBeenCalledWith(2, 'lunch', expect.objectContaining({ id: 'recipe-2' }));
  });
});
