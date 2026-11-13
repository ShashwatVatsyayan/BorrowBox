import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  Shield,
  ChevronDown,
  Home,
  Compass,
  Package,
  Clock,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../context/ThemeContext';
import { PillNav } from '../common/PillNav';
import { ThemeToggle } from '../common/ThemeToggle';

export const AppHeader = () => {
  const { user, switchAccount, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { resolvedTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitch = async (roleName) => {
    await switchAccount(roleName);
    setDropdownOpen(false);
    navigate('/app');
  };

  const navItems = [
    { label: 'Dashboard', href: '/app', icon: <Home size={13} /> },
    { label: 'Explore', href: '/app/explore', icon: <Compass size={13} /> },
    { label: 'Listings', href: '/app/listings', icon: <Package size={13} /> },
    { label: 'Activity', href: '/app/activity', icon: <Clock size={13} /> },
    { label: 'List Item', href: '/app/items/new', icon: <PlusCircle size={13} /> }
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin', href: '/admin', icon: <Shield size={13} /> });
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-card border-b border-surface-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* React Bits PillNav Interactive Navigation */}
        <div className="flex-1 min-w-0 flex items-center">
          <PillNav
            logo="/icon_mark.png"
            logoAlt="BorrowBox"
            logoHref="/app"
            items={navItems}
            activeHref={location.pathname}
            theme={resolvedTheme}
            itemStyle="pill"
            hoverEffect="fill"
            indicator="dot"
            surface="glass"
            size="sm"
            collapse="auto"
            ariaLabel="Campus App Navigation"
          />
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Demo Account Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-ink-primary transition-colors min-h-[32px]"
              title="Click to toggle demo user"
            >
              <span className="w-2 h-2 rounded-full bg-brand-600"></span>
              <span className="max-w-[100px] truncate">{user?.full_name?.split(' ')[0] || 'User'}</span>
              <ChevronDown size={12} className="text-ink-muted" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-card rounded-xl border border-surface-border shadow-lg py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-surface-border text-ink-muted font-semibold uppercase tracking-wider text-[10px]">
                  Switch Demo Account
                </div>
                <button
                  onClick={() => handleSwitch('Student A')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-ink-primary">Student A (Aarav)</p>
                    <p className="text-[11px] text-ink-muted">Owner of calculator, lab coat</p>
                  </div>
                  {user?.id === '11111111-1111-1111-1111-111111111111' && (
                    <span className="text-brand-600 font-bold">Active</span>
                  )}
                </button>
                <button
                  onClick={() => handleSwitch('Student B')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-ink-primary">Student B (Priya)</p>
                    <p className="text-[11px] text-ink-muted">Borrower / owner of racket</p>
                  </div>
                  {user?.id === '22222222-2222-2222-2222-222222222222' && (
                    <span className="text-brand-600 font-bold">Active</span>
                  )}
                </button>
                <button
                  onClick={() => handleSwitch('Admin')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} className="text-amber-600" />
                    <div>
                      <p className="font-semibold text-ink-primary">Campus Admin</p>
                      <p className="text-[11px] text-ink-muted">Moderator</p>
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <span className="text-brand-600 font-bold">Active</span>
                  )}
                </button>
                <div className="border-t border-surface-border my-1"></div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-1.5 text-state-danger hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle size="sm" />

          {/* Notifications Bell */}
          <Link
            to="/app/notifications"
            className="relative p-2 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
