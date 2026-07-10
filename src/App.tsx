import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './app/ThemeProvider';
import { AppShell } from './components/AppShell';
import { useProfileStore } from './app/profileStore';

// Feature Pages
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { ThisWeekPage } from './features/plan/ThisWeekPage';
import { FridgePage } from './features/fridge/FridgePage';
import { ProfilePage } from './features/profile/ProfilePage';
import { RecipesPage } from './features/recipes/RecipesPage';
import { RecipeDetailPage } from './features/recipes/RecipeDetailPage';
import { SinkPage } from './features/sink/SinkPage';

/**
 * Route guard ensuring profile onboarding is complete.
 */
const OnboardingBarrier: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profile = useProfileStore((state) => state.profile);

  if (!profile || !profile.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

/**
 * Route guard preventing onboarded users from re-entering onboarding page.
 */
const OnboardingPageGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profile = useProfileStore((state) => state.profile);

  if (profile && profile.onboardingComplete) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export function AppRoutes() {
  return (
    <Routes>
      {/* Public/Onboarding Entry */}
      <Route
        path="/onboarding"
        element={
          <OnboardingPageGuard>
            <div className="min-h-screen bg-bg text-text p-4 sm:p-6 transition-colors duration-200">
              <OnboardingPage />
            </div>
          </OnboardingPageGuard>
        }
      />

      {/* Main Protected Application Layout Shell */}
      <Route
        path="/"
        element={
          <OnboardingBarrier>
            <AppShell />
          </OnboardingBarrier>
        }
      >
        <Route index element={<ThisWeekPage />} />
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="recipes/:id" element={<RecipeDetailPage />} />
        <Route path="fridge" element={<FridgePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="sink" element={<SinkPage />} />
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
