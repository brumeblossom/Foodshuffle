import { create } from 'zustand';
import { db } from '../data/db';

export type Theme = 'light' | 'dark' | 'system';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'info';
}

interface UiState {
  // Theme state
  theme: Theme;
  isThemeInitialized: boolean;
  setTheme: (theme: Theme) => Promise<void>;
  initTheme: () => Promise<void>;
  applyTheme: (theme: Theme) => void;

  // Toast state
  toasts: ToastItem[];
  addToast: (message: string, type?: 'success' | 'danger' | 'info') => void;
  removeToast: (id: string) => void;

  // Db Initialization State
  isDbInitialized: boolean;
  setIsDbInitialized: (val: boolean) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  // Theme Initial State
  theme: 'system',
  isThemeInitialized: false,

  setTheme: async (theme: Theme) => {
    set({ theme });
    localStorage.setItem('color-scheme', theme);

    try {
      const meta = await db.appMeta.get('meta');
      await db.appMeta.put({
        id: 'meta',
        schemaVersion: meta?.schemaVersion || 1,
        seedVersion: meta?.seedVersion || 0,
        theme: theme,
      });
    } catch (err) {
      console.error('Failed to save theme to Dexie:', err);
    }

    get().applyTheme(theme);
  },

  initTheme: async () => {
    if (get().isThemeInitialized) return;

    let savedTheme: Theme = 'system';
    try {
      const meta = await db.appMeta.get('meta');
      if (meta && (meta.theme === 'light' || meta.theme === 'dark' || meta.theme === 'system')) {
        savedTheme = meta.theme;
      } else {
        const local = localStorage.getItem('color-scheme');
        if (local === 'light' || local === 'dark' || local === 'system') {
          savedTheme = local;
        }
      }
    } catch (err) {
      console.error('Failed to load theme from Dexie, checking localStorage:', err);
      const local = localStorage.getItem('color-scheme');
      if (local === 'light' || local === 'dark' || local === 'system') {
        savedTheme = local;
      }
    }

    set({ theme: savedTheme, isThemeInitialized: true });
    get().applyTheme(savedTheme);
  },

  applyTheme: (theme: Theme) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    let isDark = false;
    if (theme === 'dark') {
      isDark = true;
    } else if (theme === 'system') {
      isDark = mediaQuery.matches;
    }

    if (isDark) {
      root.classList.add('dark');
      document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', 'dark');
    } else {
      root.classList.remove('dark');
      document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', 'light');
    }
  },

  // Toast Initial State
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Db Initialization State
  isDbInitialized: false,
  setIsDbInitialized: (val: boolean) => set({ isDbInitialized: val }),
}));

// Setup media listener for system changes when the theme is set to 'system'
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = useUiStore.getState().theme;
    if (currentTheme === 'system') {
      useUiStore.getState().applyTheme('system');
    }
  });
}
