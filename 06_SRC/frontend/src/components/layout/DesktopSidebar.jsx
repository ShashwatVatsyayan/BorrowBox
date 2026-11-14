import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Package, MessageSquare, Clock, Plus, User, SlidersHorizontal, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const DesktopSidebar = () => {
  const { user } = useAuth();

  const links = [
    { to: '/app', label: 'Dashboard', icon: Home, end: true },
    { to: '/app/explore', label: 'Explore Items', icon: Compass },
    { to: '/app/listings', label: 'My Listings', icon: Package },
    { to: '/app/messages', label: 'Messages & Offers', icon: MessageSquare },
    { to: '/app/activity', label: 'Activity & Requests', icon: Clock },
    { to: '/app/profile', label: 'My Profile', icon: User },
    { to: '/app/settings', label: 'Settings', icon: Settings },
  ];

  if (user?.role === 'admin') {
    links.push({ to: '/admin', label: 'Admin Portal', icon: SlidersHorizontal });
  }

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-surface-border bg-surface-card p-4 shrink-0 min-h-[calc(100vh-3.5rem)]">
      <div className="mb-4">
        <NavLink
          to="/app/items/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#0F382A] to-[#061F17] hover:from-[#164e3b] hover:to-[#0B2C21] text-[#F5F2EB] font-semibold text-sm transition-all shadow-[0_4px_16px_rgba(15,56,42,0.35)] hover:-translate-y-0.5 border border-emerald-600/30"
        >
          <Plus size={18} className="text-[#D4A853]" />
          <span>List an Item</span>
        </NavLink>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-950/10 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold border-l-2 border-[#D4A853]'
                    : 'text-ink-muted hover:text-ink-primary hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-3 border-t border-surface-border text-xs text-ink-muted">
        <p className="font-bold text-ink-primary truncate">{user?.full_name}</p>
        <p className="truncate text-[11px] text-ink-muted">{user?.email}</p>
        <div className="mt-2.5 pt-2 border-t border-surface-border/50 flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800 text-[10px] whitespace-nowrap">
            Verified Student
          </span>
        </div>
      </div>
    </aside>
  );
};

