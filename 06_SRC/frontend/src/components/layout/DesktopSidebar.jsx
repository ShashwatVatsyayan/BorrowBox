import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Package, Clock, Plus, User, SlidersHorizontal, Settings, FileText, ExternalLink } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const DesktopSidebar = () => {
  const { user } = useAuth();

  const links = [
    { to: '/app', label: 'Dashboard', icon: Home, end: true },
    { to: '/app/explore', label: 'Explore Items', icon: Compass },
    { to: '/app/listings', label: 'My Listings', icon: Package },
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
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-xs hover:-translate-y-0.5"
        >
          <Plus size={18} />
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
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400 font-semibold'
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

      <div className="pt-4 border-t border-surface-border text-xs text-ink-muted">
        <p className="font-semibold text-ink-primary truncate">{user?.full_name}</p>
        <p className="truncate text-ink-muted">{user?.email}</p>
        <div className="mt-2.5 flex flex-col gap-2">
          <div className="flex items-center">
            <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px] border border-emerald-200 dark:border-emerald-800 tracking-wide">
              Verified Student
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-1.5 text-[10px] text-ink-light">
            <a
              href="https://portfolio-v2-alpha-ten-71.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors inline-flex items-center gap-0.5"
            >
              <span>Portfolio</span>
              <ExternalLink size={9} />
            </a>
            <span>•</span>
            <NavLink to="/terms" className="hover:text-brand-600">Terms</NavLink>
            <span>•</span>
            <NavLink to="/privacy" className="hover:text-brand-600">Privacy</NavLink>
            <span>•</span>
            <NavLink to="/cookies" className="hover:text-brand-600">Cookies</NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};

