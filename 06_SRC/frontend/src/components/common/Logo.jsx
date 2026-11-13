import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'md', showText = false, to = '/app', className = '' }) => {
  const sizeClasses = {
    sm: 'h-9 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-20 sm:h-24 w-auto',
    xl: 'h-28 sm:h-32 w-auto'
  };

  const content = (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="BorrowBox"
        className={`${sizeClasses[size] || sizeClasses.md} object-contain shrink-0 transition-transform duration-200 hover:scale-105`}
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
