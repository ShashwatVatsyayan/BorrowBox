import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'md', showText = false, iconOnly = false, to = '/app', className = '' }) => {
  const sizeClasses = {
    xs: 'h-7 w-auto',
    sm: 'h-9 sm:h-10 w-auto',
    md: 'h-12 sm:h-14 w-auto',
    lg: 'h-20 sm:h-24 w-auto',
    xl: 'h-28 sm:h-32 w-auto'
  };

  const lightSrc = iconOnly ? '/icon_mark.png' : '/logo.png';
  const darkSrc = iconOnly ? '/icon_mark_dark.png' : '/logo-dark.png';

  const content = (
    <div className={`inline-flex items-center ${className}`}>
      {/* Light mode: crisp vibrant logo */}
      <img
        src={lightSrc}
        alt="BorrowBox"
        className={`block dark:hidden ${sizeClasses[size] || sizeClasses.md} object-contain shrink-0 transition-transform duration-200 hover:scale-105`}
      />
      {/* Dark mode: crisp white body + vibrant orange accents with luminous orange glow */}
      <img
        src={darkSrc}
        alt="BorrowBox"
        className={`hidden dark:block ${sizeClasses[size] || sizeClasses.md} object-contain shrink-0 transition-transform duration-200 hover:scale-105 drop-shadow-[0_0_14px_rgba(255,107,0,0.5)]`}
      />
      {showText && (
        <span className="sr-only">BorrowBox</span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center hover:opacity-95 transition-opacity" aria-label="BorrowBox Home">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
