/**
 * Theme state and application for Ink Bleed
 * Ported from https://github.com/codemure-official/ink-bleed-theme-changer
 */

export function getTheme() {
  if (typeof document === 'undefined') return 'light';
  const root = document.documentElement;
  return root.classList.contains('dark') || root.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function otherTheme(theme) {
  return theme === 'dark' ? 'light' : 'dark';
}

/**
 * Instantly applies a theme to the live DOM and updates dataset/class.
 */
export function applyTheme(theme, toggleButton) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  if (toggleButton) {
    toggleButton.setAttribute('aria-pressed', String(theme === 'dark'));
  }
}

