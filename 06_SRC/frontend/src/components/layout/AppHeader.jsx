import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Bell, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

export const AppHeader = () => {
  const { user, switchAccount, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSwitch = async (roleName) => {
    await switchAccount(roleName);
    setDropdownOpen(false);
    navigate('/app');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-card border-b border-surface-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/app" className="flex items-center gap-2 font-bold text-ink-primary hover:text-brand-600 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100">
            <Package size={20} />
          </div>
          <span className="text-base tracking-tight font-extrabold">BorrowBox</span>
        </Link>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Account Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-ink-primary transition-colors min-h-[32px]"
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
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between"
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
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between"
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
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between"
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
                  className="w-full text-left px-3 py-1.5 text-state-danger hover:bg-red-50 font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <Link
            to="/app/notifications"
            className="relative p-2 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
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

