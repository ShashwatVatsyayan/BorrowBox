import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, Clock, User } from 'lucide-react';

export const BottomNav = () => {
  const navItems = [
    { to: '/app', label: 'Home', icon: Home, end: true },
    { to: '/app/explore', label: 'Explore', icon: Compass },
    { to: '/app/items/new', label: 'List Item', icon: PlusCircle, isPrimary: true },
    { to: '/app/activity', label: 'Activity', icon: Clock },
    { to: '/app/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-card border-t border-surface-border pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
                  item.isPrimary
                    ? 'text-brand-600 font-semibold'
                    : isActive
                    ? 'text-brand-600 font-semibold'
                    : 'text-ink-muted hover:text-ink-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={item.isPrimary ? 'p-1 rounded-full bg-brand-50 text-brand-600' : ''}>
                    <Icon size={item.isPrimary ? 24 : 20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

