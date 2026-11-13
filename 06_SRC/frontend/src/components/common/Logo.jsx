import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'md', showText = true, to = '/app', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-xl font-extrabold',
    xl: 'text-2xl font-black'
  };

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.png"
        alt="BorrowBox Logo"
        className={`${sizeClasses[size]} object-contain rounded-lg shrink-0`}
      />
      {showText && (
        <span className={`tracking-tight text-ink-primary ${textSizes[size]}`}>
          BorrowBox
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
