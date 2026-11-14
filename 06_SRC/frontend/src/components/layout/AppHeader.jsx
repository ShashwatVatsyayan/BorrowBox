import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  SlidersHorizontal,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { ProfileCardModal } from '../profile/ProfileCardModal';
import { getStudentFirstName } from '../../utils/userEnricher';

export const AppHeader = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const headerFirstName = getStudentFirstName(user);

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-card border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Prominent Visible Standalone Logo - No Box, No Circle */}
        <div className="flex items-center shrink-0 py-1">
          <Logo size="md" to="/app" />
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Student Profile Avatar & ID Card Trigger Button */}
          <div className="relative">
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-ink-primary transition-all min-h-[34px] shadow-xs group"
              title="Click to view your Holographic Campus ID Pass"
              aria-label="Student Holographic ID Pass"
            >
              <img
                src={user?.avatar_url || '/default_avatar_male.svg'}
                alt={user?.full_name || 'Profile'}
                className="w-5 h-5 rounded-full object-cover border border-emerald-600/30 shrink-0"
                onError={(e) => { e.currentTarget.src = '/default_avatar_male.svg'; }}
              />
              <span className="max-w-[100px] truncate">{headerFirstName}</span>
              <ChevronDown size={12} className="text-ink-muted group-hover:text-ink-primary transition-transform" />
            </button>
          </div>

          {/* Interactive Holographic Student Profile Card & Editor Modal */}
          <ProfileCardModal
            isOpen={profileModalOpen}
            onClose={() => setProfileModalOpen(false)}
          />

          {/* Theme Toggle Button */}
          <ThemeToggle size="sm" />

          {/* Direct Messages */}
          <Link
            to="/app/messages"
            className="relative p-2 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Direct Messages"
            title="Messages and Negotiation Offers"
          >
            <MessageSquare size={18} />
          </Link>

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
