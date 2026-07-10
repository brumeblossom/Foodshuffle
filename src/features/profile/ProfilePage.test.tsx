import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfilePage } from './ProfilePage';
import { useProfileStore } from '../../app/profileStore';
import { useUiStore } from '../../app/uiStore';

vi.mock('../../data/db', () => {
  return {
    db: {
      transaction: vi.fn(),
      profile: { clear: vi.fn() },
      recipes: { clear: vi.fn(), bulkPut: vi.fn() },
      mealPlans: { clear: vi.fn() },
      pantry: { clear: vi.fn() },
      appMeta: { clear: vi.fn() },
    }
  };
});

describe('Profile Page Features & Calculations', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock stores
    useProfileStore.setState({
      profile: {
        id: 'primary',
        name: 'Blossom',
        onboardingComplete: true,
        gender: 'female',
        age: 25,
        heightCm: 170,
        weightKg: 70,
        dietTags: ['vegetarian'],
        allergies: ['peanuts'],
        favoriteFoods: ['plantain'],
        currency: 'NGN',
        includeSnacks: false,
        createdAt: '',
        updatedAt: '',
        goal: 'general_health',
        monthlyBudget: 50000,
      },
      dailyTarget: { calories: 2100, isEstimate: false },
      macroTargets: { proteinG: 105, carbsG: 260, fatG: 50 },
      saveProfile: vi.fn(),
      loadProfile: vi.fn(),
    });

    useUiStore.setState({
      theme: 'system',
      setTheme: vi.fn(),
      addToast: vi.fn(),
    });
  });

  it('renders onboarding fields and updates user profile parameters', async () => {
    const saveMock = vi.fn();
    useProfileStore.setState({ saveProfile: saveMock });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Name \*/i)).toHaveValue('Blossom');
    expect(screen.getByLabelText(/Age/i)).toHaveValue(25);

    // Update name
    fireEvent.change(screen.getByLabelText(/Name \*/i), { target: { value: 'New Name' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Save Profile Configuration/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(saveMock).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Name',
      gender: 'female',
      age: 25
    }));
  });

  it('displays Heuristic Estimate indicator when height & weight parameters are empty', async () => {
    useProfileStore.setState({
      dailyTarget: { calories: 2000, isEstimate: true },
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Heuristic Estimate/i)).toBeInTheDocument();
  });

  it('triggers theme changes when theme appearance buttons are clicked', async () => {
    const setThemeMock = vi.fn();
    useUiStore.setState({ setTheme: setThemeMock });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    // Click dark theme button
    const darkBtn = screen.getByRole('button', { name: /^dark$/i });
    await act(async () => {
      fireEvent.click(darkBtn);
    });

    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('shows reset and regeneration confirmation dialogs', async () => {
    // Mock HTMLDialogElement properties in jsdom environment
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    // Open Seed dialog
    const seedBtn = screen.getByRole('button', { name: /Regenerate Seed Recipes/i });
    fireEvent.click(seedBtn);

    // Open Reset dialog
    const resetBtn = screen.getByRole('button', { name: /Reset All Application Data/i });
    fireEvent.click(resetBtn);

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(2);
  });
});
