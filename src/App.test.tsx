import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import { useProfileStore } from './app/profileStore';
import { useUiStore } from './app/uiStore';

describe('FoodShuffle Design System Foundation', () => {
  beforeEach(() => {
    // Mock profile onboarding as complete to allow access to routes
    useProfileStore.setState({
      profile: {
        id: 'primary',
        name: 'Test User',
        onboardingComplete: true,
        dietTags: ['none'],
        allergies: [],
        favoriteFoods: [],
        currency: 'NGN',
        includeSnacks: false,
        createdAt: '',
        updatedAt: '',
        goal: 'general_health',
      },
      dailyTarget: { calories: 2000, isEstimate: false },
      macroTargets: { proteinG: 150, carbsG: 200, fatG: 70 },
    });

    // Mock DB initialized to skip loading spinner
    useUiStore.setState({
      isDbInitialized: true,
    });
  });

  const renderSink = () => {
    return render(
      <MemoryRouter initialEntries={['/sink']}>
        <AppRoutes />
      </MemoryRouter>
    );
  };

  it('renders the kitchen sink page with title and sections', () => {
    renderSink();
    
    // Check main title
    const heading = screen.getByText(/UI Primitives & Kitchen Sink/i);
    expect(heading).toBeInTheDocument();

    // Check specific section titles
    expect(screen.getByText(/1\. Buttons & Tags/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Form Fields/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Steppers & Progress Bars/i)).toBeInTheDocument();
  });

  it('renders design system primitive variants', () => {
    renderSink();

    // Check buttons
    expect(screen.getByRole('button', { name: /Primary Action/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Accent Action/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Danger Action/i })).toBeInTheDocument();

    // Check tags
    expect(screen.getByText(/Primary Tag/i)).toBeInTheDocument();
    expect(screen.getByText(/Sunshine Accent/i)).toBeInTheDocument();
    expect(screen.getByText(/Kiwi Accent/i)).toBeInTheDocument();
  });

  it('handles dialog modal open, close, and cancels', () => {
    renderSink();

    // Initially, there shouldn't be an open dialog showing the confirmation content
    const dialogElement = screen.getByRole('dialog', { hidden: true });
    expect(dialogElement).not.toHaveAttribute('open');

    // Click to open modal
    const openButton = screen.getByRole('button', { name: /Open Modal Window/i });
    fireEvent.click(openButton);
    expect(dialogElement).toHaveAttribute('open');

    // Click cancel button inside modal to close
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(dialogElement).not.toHaveAttribute('open');
  });

  it('triggers toast notifications', () => {
    renderSink();

    // Initially no toasts are displayed
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Click to trigger a success toast
    const successToastBtn = screen.getByRole('button', { name: /Trigger Success Toast/i });
    
    act(() => {
      fireEvent.click(successToastBtn);
    });

    // Toast status should be displayed
    const toast = screen.getByRole('status');
    expect(toast).toHaveTextContent(/Successfully generated plan!/i);
  });
});
