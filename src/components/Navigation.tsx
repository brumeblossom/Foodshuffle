import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUiStore } from '../app/uiStore';
import {
  Calendar01Icon,
  BookOpen01Icon,
  SearchList01Icon,
  Settings01Icon,
  Sun02Icon,
  Moon02Icon,
  ComputerIcon,
  PaintBrush01Icon,
} from 'hugeicons-react';

export const Navigation: React.FC = () => {
  const { theme, setTheme } = useUiStore();

  const cycleTheme = () => {
    const themes = ['system', 'light', 'dark'] as const;
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const navItems = [
    { to: '/', label: 'This Week', icon: Calendar01Icon },
    { to: '/recipes', label: 'Recipes', icon: BookOpen01Icon },
    { to: '/fridge', label: 'Fridge Matcher', icon: SearchList01Icon },
    { to: '/profile', label: 'Profile', icon: Settings01Icon },
    { to: '/sink', label: 'Kitchen Sink', icon: PaintBrush01Icon },
  ];

  return (
    <>
      {/* Desktop Sidebar Nav (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-primary/10 min-h-screen p-6 fixed left-0 top-0 text-text shrink-0 z-20 transition-colors duration-200">
        {/* Header/Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span className="font-display font-black text-2xl tracking-tight text-primary">FoodShuffle</span>
          <div className="px-1.5 py-0.5 rounded text-[9px] font-sans font-bold uppercase tracking-wider bg-accent/10 border border-accent/20 text-accent">
            v1.0
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-2" aria-label="Desktop main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-sans text-sm font-semibold transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px] ${
                    isActive
                      ? 'bg-primary text-primary-fg shadow-sm'
                      : 'hover:bg-primary/5 text-text hover:text-primary'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer/Theme Toggle */}
        <div className="pt-4 border-t border-primary/10">
          <button
            onClick={cycleTheme}
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-primary/5 font-sans text-sm font-semibold text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px] transition-all"
            aria-label={`Current theme: ${theme}. Click to cycle theme.`}
          >
            <div className="flex items-center gap-2">
              {theme === 'light' && <Sun02Icon className="w-4 h-4 text-accent" />}
              {theme === 'dark' && <Moon02Icon className="w-4 h-4 text-primary" />}
              {theme === 'system' && <ComputerIcon className="w-4 h-4 text-text-muted" />}
              <span>Theme</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-text-muted px-1.5 py-0.5 rounded bg-primary/5">
              {theme}
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-primary/10 px-4 py-2 flex justify-around items-center z-20 shadow-lg transition-colors duration-200"
        aria-label="Mobile main navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-lg font-sans text-[10px] font-bold transition-all min-h-[48px] min-w-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive ? 'text-primary scale-110' : 'text-text-muted hover:text-text'
                }`
              }
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[60px]">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Theme Toggle Button for Mobile */}
        <button
          onClick={cycleTheme}
          type="button"
          className="flex flex-col items-center justify-center p-2 rounded-lg text-text-muted hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[48px] min-w-[48px]"
          aria-label={`Cycle theme. Current theme: ${theme}`}
        >
          {theme === 'light' && <Sun02Icon className="w-5 h-5 text-accent" />}
          {theme === 'dark' && <Moon02Icon className="w-5 h-5 text-primary" />}
          {theme === 'system' && <ComputerIcon className="w-5 h-5" />}
          <span className="text-[10px] font-bold mt-0.5">Theme</span>
        </button>
      </nav>
    </>
  );
};
