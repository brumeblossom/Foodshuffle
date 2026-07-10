import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { FridgePage } from './FridgePage';
import { usePantryStore } from '../../app/pantryStore';
import { useProfileStore } from '../../app/profileStore';
import { usePlanStore } from '../../app/planStore';
import { useUiStore } from '../../app/uiStore';
import { getRecipes } from '../../data/repo';
import type { Recipe, MealPlan } from '../../data/types';

// Mock DB repo functions
vi.mock('../../data/repo', () => {
  const actual = vi.importActual('../../data/repo');
  return {
    ...actual,
    getRecipes: vi.fn(),
  };
});

const mockRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Tomato Rice',
    description: 'Quick lunch dish',
    cuisine: 'italian',
    mealTypes: ['lunch'],
    ingredients: [
      { name: 'Rice', quantity: 2, unit: 'cups' },
      { name: 'Tomato', quantity: 3, unit: 'pieces' }
    ],
    steps: ['Boil rice', 'Add tomato'],
    prepTimeMins: 15,
    cookTimeMins: 15,
    servings: 2,
    nutritionPerServing: { calories: 350, protein: 6, carbs: 65, fat: 4 },
    dietTags: ['vegetarian', 'vegan'],
    allergens: [],
    estimatedCostPerServing: 600,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: [],
  },
  {
    id: 'recipe-2',
    name: 'Spiced Chicken Pot',
    description: 'Hearty protein meal',
    cuisine: 'nigerian',
    mealTypes: ['dinner'],
    ingredients: [
      { name: 'Chicken breast', quantity: 400, unit: 'g' },
      { name: 'Peanut oil', quantity: 2, unit: 'tbsp' }
    ],
    steps: ['Fry chicken'],
    prepTimeMins: 10,
    cookTimeMins: 20,
    servings: 4,
    nutritionPerServing: { calories: 500, protein: 45, carbs: 10, fat: 28 },
    dietTags: [],
    allergens: ['peanuts'],
    estimatedCostPerServing: 1500,
    costCurrency: 'NGN',
    difficulty: 'medium',
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
    dietTags: [],
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
      breakfast: undefined,
      lunch: undefined,
      dinner: undefined,
      snacks: [],
    },
  ],
};

describe('Fridge Page Fridge Matcher Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getRecipes).mockResolvedValue(mockRecipes);

    // Mock Zustand Stores
    useProfileStore.setState({
      profile: {
        id: 'primary',
        name: 'Blossom',
        onboardingComplete: true,
        dietTags: [],
        allergies: ['peanuts'],
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

    usePantryStore.setState({
      items: [
        { id: 'item-1', name: 'rice', normalizedName: 'rice', addedAt: '' },
      ],
      loadPantry: vi.fn(),
      addItemsFromText: vi.fn(),
      removeItem: vi.fn(),
      clearPantry: vi.fn(),
    });
  });

  it('renders matching recipes when ingredients text is typed and searched', async () => {
    render(
      <MemoryRouter>
        <FridgePage />
      </MemoryRouter>
    );

    // Input text field
    const textarea = screen.getByLabelText(/Enter ingredients you currently have/i);
    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'rice, tomato' } });
    });

    // Find recipes button
    const findBtn = screen.getByRole('button', { name: /Find Matching Recipes/i });
    await act(async () => {
      fireEvent.click(findBtn);
    });

    // Spiced Chicken is excluded due to Peanut allergen under safe mode.
    // Tomato Rice should be found as a 100% match.
    expect(screen.getByText(/Tomato Rice/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
    expect(screen.queryByText(/Spiced Chicken Pot/i)).not.toBeInTheDocument();
  });

  it('bypasses allergen check filters when safe tag checkbox is untoggled', async () => {
    render(
      <MemoryRouter>
        <FridgePage />
      </MemoryRouter>
    );

    const textarea = screen.getByLabelText(/Enter ingredients you currently have/i);
    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'chicken breast, peanut oil' } });
    });

    // Untoggle safe for allergies
    const cb = screen.getByLabelText(/Respect my allergy & diet tags/i);
    await act(async () => {
      fireEvent.click(cb);
    });

    const findBtn = screen.getByRole('button', { name: /Find Matching Recipes/i });
    await act(async () => {
      fireEvent.click(findBtn);
    });

    // Now Spiced Chicken Pot (which has peanuts allergen) should display
    expect(screen.getByText(/Spiced Chicken Pot/i)).toBeInTheDocument();
  });

  it('handles saved virtual pantry operations', async () => {
    const saveMock = vi.fn();
    usePantryStore.setState({
      items: [
        { id: 'item-1', name: 'rice', normalizedName: 'rice', addedAt: '' },
        { id: 'item-2', name: 'tomato', normalizedName: 'tomato', addedAt: '' },
      ],
      addItemsFromText: saveMock,
      loadPantry: vi.fn(),
    });

    render(
      <MemoryRouter>
        <FridgePage />
      </MemoryRouter>
    );

    // Click "Load Pantry" button
    const loadBtn = screen.getByRole('button', { name: /Load Pantry/i });
    await act(async () => {
      fireEvent.click(loadBtn);
    });

    const textarea = screen.getByLabelText(/Enter ingredients you currently have/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('rice, tomato');

    // Click "Save Pantry" button
    const saveBtn = screen.getByRole('button', { name: /Save Pantry/i });
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    expect(saveMock).toHaveBeenCalledWith('rice, tomato');
  });

  it('schedules matching recipe into weekly plan', async () => {
    const swapMock = vi.fn();
    usePlanStore.setState({
      currentPlan: mockPlan,
      swapMeal: swapMock,
    });

    render(
      <MemoryRouter>
        <FridgePage />
      </MemoryRouter>
    );

    const textarea = screen.getByLabelText(/Enter ingredients you currently have/i);
    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'rice, tomato' } });
    });

    const findBtn = screen.getByRole('button', { name: /Find Matching Recipes/i });
    await act(async () => {
      fireEvent.click(findBtn);
    });

    // Click "Schedule This Week" button
    const scheduleToggleBtn = screen.getByRole('button', { name: /Schedule This Week/i });
    await act(async () => {
      fireEvent.click(scheduleToggleBtn);
    });

    // Click "Confirm Add" button
    const confirmBtn = screen.getByRole('button', { name: /Confirm Add/i });
    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    // Defaults to Monday (idx 0) breakfast
    expect(swapMock).toHaveBeenCalledWith(0, 'breakfast', expect.objectContaining({ id: 'recipe-1' }));
  });
});
