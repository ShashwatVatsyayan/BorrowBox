import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Plus, Clock, User } from 'lucide-react';

export const BottomNav = () => {
  const navItems = [
    { to: '/app', label: 'Home', icon: Home, end: true },
    { to: '/app/explore', label: 'Explore', icon: Compass },
    { to: '/app/items/new', label: 'List', icon: Plus, isPrimary: true },
    { to: '/app/activity', label: 'Activity', icon: Clock },
    { to: '/app/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-card/95 backdrop-blur-md border-t border-surface-border pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-5 h-14 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-h-[44px] py-0.5 transition-all select-none ${
                  item.isPrimary
                    ? 'text-white'
                    : isActive
                    ? 'text-[#0F382A] dark:text-[#10B981] font-bold'
                    : 'text-ink-muted hover:text-ink-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.isPrimary ? (
                    <div className="w-9 h-9 rounded-full bg-[#0F382A] text-[#F5F2EB] border border-[#D4A853] shadow-xs flex items-center justify-center -mt-2">
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="relative flex flex-col items-center">
                      <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
                      {isActive && (
                        <span className="w-1 h-1 rounded-full bg-[#D4A853] mt-0.5" />
                      )}
                    </div>
                  )}
                  <span className={`text-[10px] mt-0.5 tracking-tight ${item.isPrimary ? 'font-semibold text-ink-primary' : ''}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

