import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export const Logo = ({ size = 'md', showText = false, to = '/app', className = '' }) => {
  let isDark = false;
  try {
    const themeCtx = useTheme();
    isDark = themeCtx?.resolvedTheme === 'dark';
  } catch {
    isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  }

  const sizeClasses = {
    xs: 'h-8 w-auto',
    sm: 'h-10 sm:h-11 w-auto',
    md: 'h-11 sm:h-12 md:h-14 w-auto',
    lg: 'h-20 sm:h-24 w-auto',
    xl: 'h-28 sm:h-32 w-auto'
  };

  const imageSrc = isDark ? '/logo-dark.png' : '/logo.png';

  const content = (
    <div className={`inline-flex items-center select-none bg-transparent border-0 p-0 m-0 ${className}`}>
      {/* Standalone Logo: user's exact logo from public/ without circle or box */}
      <img
        src={imageSrc}
        alt="BorrowBox - Community Borrowing Platform"
        className={`${sizeClasses[size] || sizeClasses.md} object-contain shrink-0 transition-transform duration-200 hover:scale-105`}
        draggable={false}
      />
      {showText && (
        <span className="sr-only">BorrowBox</span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center bg-transparent border-0 p-0 m-0 hover:opacity-95 transition-opacity" aria-label="BorrowBox Home">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
