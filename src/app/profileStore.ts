import { create } from 'zustand';
import type { UserProfile } from '../data/types';
import type { MacroTargets } from '../core/providers';
import { getProfile, saveProfile as repoSaveProfile } from '../data/repo';
import { container } from '../core/compositionRoot';

interface ProfileState {
  profile: UserProfile | null;
  dailyTarget: { calories: number; isEstimate: boolean } | null;
  macroTargets: MacroTargets | null;
  isLoading: boolean;
  loadProfile: () => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  dailyTarget: null,
  macroTargets: null,
  isLoading: false,

  loadProfile: async () => {
    set({ isLoading: true });
    try {
      const profile = await getProfile();
      if (profile) {
        const dailyTarget = container.nutritionProvider.dailyTarget(profile);
        const macros = container.nutritionProvider.macroTargets(dailyTarget.calories, profile.goal);
        set({ profile, dailyTarget, macroTargets: macros });
      } else {
        set({ profile: null, dailyTarget: null, macroTargets: null });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  saveProfile: async (newProfile: UserProfile) => {
    set({ isLoading: true });
    try {
      await repoSaveProfile(newProfile);
      const dailyTarget = container.nutritionProvider.dailyTarget(newProfile);
      const macros = container.nutritionProvider.macroTargets(dailyTarget.calories, newProfile.goal);
      set({ profile: newProfile, dailyTarget, macroTargets: macros });
    } catch (err) {
      console.error('Failed to save profile:', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  clearProfile: () => {
    set({ profile: null, dailyTarget: null, macroTargets: null });
  }
}));
