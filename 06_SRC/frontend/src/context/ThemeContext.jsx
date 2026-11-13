import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

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

  const isTransitioningRef = useRef(false);

  const applyDomTheme = (activeTheme) => {
    const root = document.documentElement;
    let effective = activeTheme;
    if (activeTheme === 'system') {
      effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setResolvedTheme(effective);
    if (effective === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
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

  /**
   * Organic Ink Bleed theme transition
   * Inspired by https://github.com/codemure-official/ink-bleed-theme-changer
   */
  const executeInkBleed = (targetTheme, eventOrPoint) => {
    if (isTransitioningRef.current) return;

    // Determine click/touch origin coordinates
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (eventOrPoint) {
      if (typeof eventOrPoint.clientX === 'number' && typeof eventOrPoint.clientY === 'number' && (eventOrPoint.clientX !== 0 || eventOrPoint.clientY !== 0)) {
        x = eventOrPoint.clientX;
        y = eventOrPoint.clientY;
      } else if (typeof eventOrPoint.x === 'number' && typeof eventOrPoint.y === 'number') {
        x = eventOrPoint.x;
        y = eventOrPoint.y;
      } else if (eventOrPoint.currentTarget && typeof eventOrPoint.currentTarget.getBoundingClientRect === 'function') {
        const rect = eventOrPoint.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    // Distance to farthest viewport corner
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Save state
    setThemeState(targetTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, targetTheme);
    } catch {
      // Ignore write errors
    }

    // Native View Transition with tactile SVG ink bleed filter
    if (typeof document.startViewTransition === 'function' && !prefersReducedMotion) {
      isTransitioningRef.current = true;

      // Seed variety for procedural ink variation on every click
      const turbulence = document.querySelector('#ink-bleed-filter feTurbulence');
      if (turbulence) {
        turbulence.setAttribute('seed', String(Math.floor(Math.random() * 9999)));
      }

      const transition = document.startViewTransition(() => {
        applyDomTheme(targetTheme);
      });

      transition.ready
        .then(() => {
          const animation = document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius * 1.05}px at ${x}px ${y}px)`
              ]
            },
            {
              duration: 800,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
          return animation.finished;
        })
        .catch(() => {
          // Fallback if animation rejected
        })
        .finally(() => {
          isTransitioningRef.current = false;
        });
    } else {
      // Codemure CSS Cross-Fade Fallback
      const root = document.documentElement;
      root.classList.add('theme-fade');
      root.style.setProperty('--theme-fade', '0.45s');
      applyDomTheme(targetTheme);
      window.setTimeout(() => {
        root.classList.remove('theme-fade');
      }, 500);
    }
  };

  const setTheme = (newTheme, eventOrPoint) => {
    if (newTheme !== 'light' && newTheme !== 'dark' && newTheme !== 'system') return;
    executeInkBleed(newTheme, eventOrPoint);
  };

  const toggleTheme = (eventOrPoint) => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    executeInkBleed(next, eventOrPoint);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
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
