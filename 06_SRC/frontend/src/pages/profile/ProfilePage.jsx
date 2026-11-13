import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Package, Clock, Settings, LogOut, ChevronRight, User } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { ProfileStats } from '../../components/profile/ProfileStats';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { ProfileCardModal } from '../../components/profile/ProfileCardModal';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';
import { usePageTitle } from '../../hooks/usePageTitle';

export const ProfilePage = () => {
  usePageTitle('My Profile');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const [prof, userStats] = await Promise.all([
          profileService.getProfile(user.id),
          profileService.getUserStats(user.id)
        ]);
        setProfile(prof);
        setStats(userStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <PageContainer>
        <Loader label="Loading profile..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">Student Profile</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={() => setCardModalOpen(true)} className="gap-1.5 shadow-xs">
            <User size={14} />
            <span>Holographic ID Pass</span>
          </Button>
          <Link to="/app/profile/edit">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Edit2 size={14} />
              <span>Edit Profile</span>
            </Button>
          </Link>
        </div>
      </div>

      <ProfileCardModal
        isOpen={cardModalOpen}
        onClose={() => {
          setCardModalOpen(false);
          // Refresh profile data if updated in modal
          if (user?.id) {
            profileService.getProfile(user.id).then(setProfile).catch(() => {});
          }
        }}
      />

      <ProfileHeader profile={profile} />
      <ProfileStats stats={stats} />

      {/* Menu Sections */}
      <div className="flex flex-col gap-2 mt-6">
        <Link
          to="/app/listings"
          className="p-4 rounded-xl bg-surface-card border border-surface-border hover:border-brand-200 flex items-center justify-between transition-colors shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50 text-brand-600">
              <Package size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-primary">My Listed Items</p>
              <p className="text-xs text-ink-muted">View, edit, or deactivate your active listings</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </Link>

        <Link
          to="/app/activity"
          className="p-4 rounded-xl bg-surface-card border border-surface-border hover:border-brand-200 flex items-center justify-between transition-colors shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-primary">Activity & History</p>
              <p className="text-xs text-ink-muted">Complete records of borrowings and lendings</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </Link>

        <Link
          to="/app/settings"
          className="p-4 rounded-xl bg-surface-card border border-surface-border hover:border-brand-200 flex items-center justify-between transition-colors shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-ink-primary">
              <Settings size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-primary">Account & Privacy Settings</p>
              <p className="text-xs text-ink-muted">Security preferences and university email controls</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </Link>
      </div>

      {/* Logout button */}
      <div className="mt-8 pt-4 border-t border-surface-border">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full text-state-danger hover:bg-red-50 hover:border-red-200 gap-2"
        >
          <LogOut size={16} />
          <span>Sign Out of BorrowBox</span>
        </Button>
      </div>
    </PageContainer>
  );
};

