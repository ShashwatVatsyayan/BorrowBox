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
    // Extract coordinates from Android & mobile touch events
    if (eventOrPoint.touches && eventOrPoint.touches.length > 0) {
      const touch = eventOrPoint.touches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    if (eventOrPoint.changedTouches && eventOrPoint.changedTouches.length > 0) {
      const touch = eventOrPoint.changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
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

  const createRippleFallback = (point, targetTheme) => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const x = point?.x ?? window.innerWidth / 2;
    const y = point?.y ?? window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const ripple = document.createElement('div');
    ripple.className = 'theme-switch-ripple-fallback';
    ripple.style.position = 'fixed';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '999999';
    ripple.style.backgroundColor = targetTheme === 'dark' ? '#080C0A' : '#FAFAF9';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.transition = 'width 460ms cubic-bezier(0.4, 0, 0.2, 1), height 460ms cubic-bezier(0.4, 0, 0.2, 1), opacity 460ms ease';
    ripple.style.opacity = '0.92';

    document.body.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.width = `${endRadius * 2}px`;
      ripple.style.height = `${endRadius * 2}px`;
      setTimeout(() => {
        ripple.style.opacity = '0';
        setTimeout(() => {
          ripple.remove();
        }, 250);
      }, 350);
    });
  };

  const toggleTheme = (eventOrPoint) => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    const point = extractPoint(eventOrPoint);

    // Prioritize native View Transitions with expanding circular clip-path for 100% zero-shift GPU transitions
    if (typeof document !== 'undefined' && document.startViewTransition) {
      const x = point?.x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
      const y = point?.y ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
      const endRadius = typeof window !== 'undefined'
        ? Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
          )
        : 1000;

      const transition = document.startViewTransition(() => {
        applyDomTheme(next);
        setThemeState(next);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
          // Ignore storage errors
        }
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 480,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      }).catch(() => {
        // Fallback gracefully if ready promise rejects
      });
      return;
    }

    // Fallback circular animation for browsers without document.startViewTransition
    createRippleFallback(point, next);
    applyDomTheme(next);
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignore storage errors
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

    if (target !== resolvedTheme) {
      const point = extractPoint(eventOrPoint);
      if (typeof document !== 'undefined' && document.startViewTransition) {
        const x = point?.x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
        const y = point?.y ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
        const endRadius = typeof window !== 'undefined'
          ? Math.hypot(
              Math.max(x, window.innerWidth - x),
              Math.max(y, window.innerHeight - y)
            )
          : 1000;

        const transition = document.startViewTransition(() => {
          setThemeState(newTheme);
          applyDomTheme(newTheme);
          try {
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
          } catch {
            // Ignore storage errors
          }
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
              ]
            },
            {
              duration: 480,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        }).catch(() => {});
        return;
      }

      createRippleFallback(point, target);
      setThemeState(newTheme);
      applyDomTheme(newTheme);
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

export const useTheme = useThemeContext;
