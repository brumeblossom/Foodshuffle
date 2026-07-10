import React, { useEffect } from 'react';
import { useUiStore } from './uiStore';
import { useProfileStore } from './profileStore';
import { initAppMetaAndSeeds } from '../data/repo';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { initTheme, isDbInitialized, setIsDbInitialized } = useUiStore();
  const loadProfile = useProfileStore((state) => state.loadProfile);

  useEffect(() => {
    async function init() {
      // 1. Initialize CSS colors & classes based on preferences
      await initTheme();
      
      // 2. Apply first-run Dexie database recipe seeds
      try {
        await initAppMetaAndSeeds();
      } catch (err) {
        console.error('Failed to initialize seeds:', err);
      }

      // 3. Load user profile configuration settings
      try {
        await loadProfile();
      } catch (err) {
        console.error('Failed to load user profile:', err);
      }

      // 4. Flag application ready
      setIsDbInitialized(true);
    }

    init();
  }, [initTheme, loadProfile, setIsDbInitialized]);

  if (!isDbInitialized) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 font-sans text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-text-muted">Initializing FoodShuffle Database...</p>
      </div>
    );
  }

  return <>{children}</>;
};
