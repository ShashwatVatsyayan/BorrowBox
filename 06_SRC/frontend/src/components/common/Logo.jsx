import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export const Logo = ({
  size = 'md',
  variant,
  showText = false,
  to = '/app',
  className = ''
}) => {
  let isDark = false;
  try {
    const themeCtx = useTheme();
    isDark = themeCtx?.resolvedTheme === 'dark';
  } catch {
    // Graceful fallback if outside ThemeProvider
  }

  const effectiveVariant = variant || (isDark ? 'dark' : 'light');
  const logoSrc = effectiveVariant === 'dark' ? '/logo-dark.svg' : '/logo.svg';

  // Responsive mobile and desktop sizing for horizontal lockup (1120x300 aspect ratio)
  const sizeClasses = {
    xs: 'h-8 sm:h-9 w-auto max-w-[150px] sm:max-w-[170px]',
    sm: 'h-9 sm:h-10 md:h-11 w-auto max-w-[170px] sm:max-w-[200px]',
    md: 'h-10 sm:h-12 md:h-13 w-auto max-w-[200px] sm:max-w-[260px]',
    lg: 'h-14 sm:h-18 md:h-22 w-auto max-w-[280px] sm:max-w-[360px]',
    xl: 'h-18 sm:h-24 md:h-28 w-auto max-w-[340px] sm:max-w-[440px]'
  };

  const content = (
    <div className={`inline-flex items-center select-none bg-transparent border-0 p-0 m-0 ${className}`}>
      <img
        src={logoSrc}
        alt="BorrowBox - Community Borrowing Platform"
        className={`${sizeClasses[size] || sizeClasses.md} object-contain shrink-0 transition-transform duration-200 hover:scale-105`}
        draggable={false}
      />
      {showText && <span className="sr-only">BorrowBox</span>}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="inline-flex items-center bg-transparent border-0 p-0 m-0 hover:opacity-95 transition-opacity"
        aria-label="BorrowBox Home"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
