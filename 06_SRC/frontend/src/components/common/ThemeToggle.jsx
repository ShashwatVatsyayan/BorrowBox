import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = ({ className = '', size = 'md', showLabel = false }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const iconSize = size === 'sm' ? 16 : 18;

  const handleClick = (e) => {
    toggleTheme(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center justify-center gap-2 p-2 min-h-[40px] min-w-[40px] rounded-lg text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 touch-manipulation ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
        {isDark ? (
          <Sun size={iconSize} className="text-[#D4A853] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-90" />
        ) : (
          <Moon size={iconSize} className="text-slate-600 dark:text-slate-300 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-12" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-ink-primary">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
