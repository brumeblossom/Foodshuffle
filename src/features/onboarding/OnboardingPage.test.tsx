import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { OnboardingPage } from './OnboardingPage';
import { useProfileStore } from '../../app/profileStore';
import { usePlanStore } from '../../app/planStore';
import { useUiStore } from '../../app/uiStore';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('OnboardingPage Multi-Step Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Clear Zustand stores
    useProfileStore.setState({
      profile: null,
      isLoading: false
    });
    usePlanStore.setState({
      currentPlan: null
    });
    useUiStore.setState({
      isDbInitialized: true,
      toasts: []
    });
  });

  const renderOnboarding = () => {
    return render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );
  };

  it('validates Step 1 and blocks next progression if name is empty', async () => {
    renderOnboarding();

    // Check we are on Step 1
    expect(screen.getByText(/What is your name\?/i)).toBeInTheDocument();

    // Click Next without entering a name
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    // Should display validation error
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
  });

  it('navigates to Step 2 when Name is provided', async () => {
    renderOnboarding();

    const nameInput = screen.getByPlaceholderText(/e.g. Blossom/i);
    fireEvent.change(nameInput, { target: { value: 'Blossom' } });

    const nextBtn = screen.getByRole('button', { name: /Next/i });
    
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    // Should progress to Step 2 (Gender, Age)
    expect(screen.getByText(/Tell us a bit about yourself/i)).toBeInTheDocument();
  });

  it('allows skipping Step 3 (body metrics)', async () => {
    renderOnboarding();

    // Enter name to go to Step 2
    fireEvent.change(screen.getByPlaceholderText(/e.g. Blossom/i), { target: { value: 'Blossom' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    });

    // Press Next on Step 2 to go to Step 3
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    });

    // Verify we are on Step 3
    expect(screen.getByText(/Body Metrics \(Optional\)/i)).toBeInTheDocument();

    // Click skip on Step 3
    const skipBtn = screen.getByRole('button', { name: /Skip/i });
    await act(async () => {
      fireEvent.click(skipBtn);
    });

    // Should be on Step 4 (favorite foods)
    expect(screen.getByText(/Any favorite ingredients\?/i)).toBeInTheDocument();
  });
});
