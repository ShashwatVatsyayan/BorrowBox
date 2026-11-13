import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { InkTransition, applyTheme as applyDomThemeHelper } from '../lib/inkBleed';

const ThemeContext = createContext();

export const THEME_STORAGE_KEY = 'borrowbox_theme';

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    if (theme === 'dark') return 'dark';
    if (theme === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const inkTransitionRef = useRef(null);

  const applyDomTheme = (activeTheme) => {
    let effective = activeTheme;
    if (activeTheme === 'system') {
      effective =
        typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    }
    setResolvedTheme(effective);
    applyDomThemeHelper(effective);
  };

  useEffect(() => {
    applyDomTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyDomTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  // Initialize WebGL2 Ink Transition from https://github.com/codemure-official/ink-bleed-theme-changer
  useEffect(() => {
    const canvas = document.getElementById('ink-canvas');
    if (canvas) {
      try {
        inkTransitionRef.current = new InkTransition(canvas, null, {
          onThemeChange: (newTheme) => {
            setResolvedTheme(newTheme);
            setThemeState(newTheme);
            try {
              localStorage.setItem(THEME_STORAGE_KEY, newTheme);
            } catch {
              // Ignore storage errors
            }
          },
        });
      } catch (err) {
        console.warn('Ink transition initialization skipped:', err);
      }
    }

    return () => {
      inkTransitionRef.current?.destroy();
    };
  }, []);

  const extractPoint = (eventOrPoint) => {
    if (!eventOrPoint) return undefined;
    if (
      typeof eventOrPoint.clientX === 'number' &&
      typeof eventOrPoint.clientY === 'number' &&
      (eventOrPoint.clientX !== 0 || eventOrPoint.clientY !== 0)
    ) {
      return { x: eventOrPoint.clientX, y: eventOrPoint.clientY };
    }
    if (typeof eventOrPoint.x === 'number' && typeof eventOrPoint.y === 'number') {
      return { x: eventOrPoint.x, y: eventOrPoint.y };
    }
    if (eventOrPoint.currentTarget && typeof eventOrPoint.currentTarget.getBoundingClientRect === 'function') {
      const rect = eventOrPoint.currentTarget.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return undefined;
  };

  const toggleTheme = (eventOrPoint) => {
    const point = extractPoint(eventOrPoint);
    if (inkTransitionRef.current) {
      inkTransitionRef.current.toggle(point);
    } else {
      const next = resolvedTheme === 'dark' ? 'light' : 'dark';
      applyDomTheme(next);
      setThemeState(next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Ignore storage errors
      }
    }
  };

  const setTheme = (newTheme, eventOrPoint) => {
    if (newTheme !== 'light' && newTheme !== 'dark' && newTheme !== 'system') return;
    const target =
      newTheme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : newTheme;

    if (target === resolvedTheme && newTheme === theme) return;

    if (target !== resolvedTheme && inkTransitionRef.current) {
      const point = extractPoint(eventOrPoint);
      inkTransitionRef.current.toggle(point);
      setThemeState(newTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {
        // Ignore storage errors
      }
    } else {
      setThemeState(newTheme);
      applyDomTheme(newTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {
        // Ignore storage errors
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme, inkTransition: inkTransitionRef.current }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
