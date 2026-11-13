import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'md', showText = false, to = '/app', className = '' }) => {
  const sizeClasses = {
    xs: 'h-8 w-auto',
    sm: 'h-10 sm:h-11 w-auto',
    md: 'h-10 sm:h-12 md:h-14 w-auto',
    lg: 'h-20 sm:h-24 w-auto',
    xl: 'h-28 sm:h-32 w-auto'
  };

  const content = (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* Light mode: user's exact logo with transparent background */}
      <img
        src="/logo.png"
        alt="BorrowBox - Community Borrowing Platform"
        className={`block dark:hidden ${sizeClasses[size] || sizeClasses.md} object-contain shrink-0 transition-transform duration-200 hover:scale-105`}
      />
      {/* Dark mode: user's exact logo with crisp white text & emerald accents on transparent background */}
      <img
        src="/logo-dark.png"
        alt="BorrowBox - Community Borrowing Platform"
        className={`hidden dark:block ${sizeClasses[size] || sizeClasses.md} object-contain shrink-0 transition-transform duration-200 hover:scale-105 drop-shadow-[0_0_12px_rgba(13,184,166,0.35)]`}
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
