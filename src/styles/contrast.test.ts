import { describe, it, expect } from 'vitest';

function getLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const transform = (val: number) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
}

function getContrast(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
}

describe('Theme Contrast Ratios (WCAG 2.1 AA Compliance)', () => {
  const lightColors = {
    bg: '#fdfbf5',
    surface: '#f7f2e4',
    text: '#1a1a1a',
    textMuted: '#5c5c52',
    primary: '#18542a',
    accent: '#ce4409',
    danger: '#d52518',
    highlight: '#ffc926',
    highlightFg: '#18542a',
    success: '#a4c70d',
    successFg: '#18542a',
    border: '#8b8370',
  };

  const darkColors = {
    bg: '#10140b',
    surface: '#1b2116',
    text: '#f3e8cc',
    textMuted: '#b9c2a8',
    primary: '#7fce8f',
    accent: '#ff8a4d',
    danger: '#ff6a5c',
    highlight: '#ffc926',
    highlightFg: '#10140b',
    success: '#b6dc3a',
    successFg: '#10140b',
    border: '#647051',
  };

  it('verifies Light Mode contrast matches WCAG AA (>= 4.5:1)', () => {
    // Normal text contrast on background
    expect(getContrast(lightColors.bg, lightColors.text)).toBeGreaterThanOrEqual(4.5);
    expect(getContrast(lightColors.bg, lightColors.textMuted)).toBeGreaterThanOrEqual(4.5);
    expect(getContrast(lightColors.bg, lightColors.primary)).toBeGreaterThanOrEqual(4.5);
    expect(getContrast(lightColors.bg, lightColors.accent)).toBeGreaterThanOrEqual(4.5);
    expect(getContrast(lightColors.bg, lightColors.danger)).toBeGreaterThanOrEqual(4.5);

    // Sunshine Tag contrast (Highlight)
    expect(getContrast(lightColors.highlight, lightColors.highlightFg)).toBeGreaterThanOrEqual(4.5);

    // Kiwi Tag contrast (Success)
    expect(getContrast(lightColors.success, lightColors.successFg)).toBeGreaterThanOrEqual(4.5);
  });

  it('verifies Dark Mode contrast matches WCAG AA (>= 4.5:1)', () => {
    // Normal text contrast on background
    expect(getContrast(darkColors.bg, darkColors.text)).toBeGreaterThanOrEqual(4.5);
    expect(getContrast(darkColors.bg, darkColors.textMuted)).toBeGreaterThanOrEqual(4.5);
    expect(getContrast(darkColors.bg, darkColors.primary)).toBeGreaterThanOrEqual(4.5);
    expect(getContrast(darkColors.bg, darkColors.accent)).toBeGreaterThanOrEqual(4.5);
    expect(getContrast(darkColors.bg, darkColors.danger)).toBeGreaterThanOrEqual(4.5);

    // Sunshine Tag contrast (Highlight)
    expect(getContrast(darkColors.highlight, darkColors.highlightFg)).toBeGreaterThanOrEqual(4.5);

    // Kiwi Tag contrast (Success)
    expect(getContrast(darkColors.success, darkColors.successFg)).toBeGreaterThanOrEqual(4.5);
  });

  it('verifies UI borders match WCAG AA graphical component contrast (>= 3:1)', () => {
    // Border vs Bg & Surface contrast
    expect(getContrast(lightColors.bg, lightColors.border)).toBeGreaterThanOrEqual(3.0);
    expect(getContrast(lightColors.surface, lightColors.border)).toBeGreaterThanOrEqual(3.0);
    expect(getContrast(darkColors.bg, darkColors.border)).toBeGreaterThanOrEqual(3.0);
    expect(getContrast(darkColors.surface, darkColors.border)).toBeGreaterThanOrEqual(3.0);
  });

  it('verifies Sunshine and Kiwi tags never carry light text', () => {
    // Tag foregrounds should be dark forest green (not white/cream)
    expect(lightColors.highlightFg).toBe('#18542a');
    expect(lightColors.successFg).toBe('#18542a');
    expect(darkColors.highlightFg).toBe('#10140b');
    expect(darkColors.successFg).toBe('#10140b');
  });
});
