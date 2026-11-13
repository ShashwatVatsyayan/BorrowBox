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
import { ProfileCardModal } from '../profile/ProfileCardModal';

export const AppHeader = () => {
  const { user, switchAccount, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { resolvedTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
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
          {/* Student Profile Avatar & ID Card Trigger Button */}
          <div className="relative">
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-ink-primary transition-all min-h-[34px] shadow-xs group"
              title="Click to view & edit your Holographic Campus ID Card"
              aria-label="Student Profile & ID Card"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user?.full_name || 'Profile'}
                  className="w-5 h-5 rounded-full object-cover border border-brand-500 shrink-0"
                />
              ) : (
                <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
              <span className="max-w-[100px] truncate">{user?.full_name?.split(' ')[0] || 'User'}</span>
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
