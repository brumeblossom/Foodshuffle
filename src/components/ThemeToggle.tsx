import React from 'react';
import { useUiStore } from '../app/uiStore';
import type { Theme } from '../app/uiStore';
import { Sun02Icon, Moon02Icon, ComputerIcon } from 'hugeicons-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useUiStore();

  const cycleTheme = () => {
    const themes: Theme[] = ['system', 'light', 'dark'];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Contrast Selfcheck:
  // - Border: border-primary/20
  // - Hover: bg-primary/5
  // - Focus-visible ring: focus-visible:ring-accent
  // - Size: min-h-[44px] min-w-[44px]

  return (
    <button
      onClick={cycleTheme}
      type="button"
      className="inline-flex items-center gap-2.5 px-4 py-2 border border-border hover:bg-primary/5 rounded font-sans text-sm font-semibold text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg min-h-[44px] select-none active:scale-95 transition-all motion-reduce:active:scale-100 motion-reduce:transition-none"
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      {theme === 'light' && (
        <>
          <Sun02Icon className="w-5 h-5 text-accent" />
          <span>Light Mode</span>
        </>
      )}
      {theme === 'dark' && (
        <>
          <Moon02Icon className="w-5 h-5 text-primary" />
          <span>Dark Mode</span>
        </>
      )}
      {theme === 'system' && (
        <>
          <ComputerIcon className="w-5 h-5 text-text-muted" />
          <span>System Default</span>
        </>
      )}
    </button>
  );
};
