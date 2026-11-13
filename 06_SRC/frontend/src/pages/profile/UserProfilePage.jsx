import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Sparkles, BookOpen, CheckCheck, ArrowLeftRight, Package } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { HoloCard } from '../../components/common/HoloCard';
import { ItemGrid } from '../../components/items/ItemGrid';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { profileService } from '../../services/profileService';
import { itemService } from '../../services/itemService';
import { generateStudentCardSvg } from '../../utils/studentCardArt';

export const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prof, userStats, userItems] = await Promise.all([
          profileService.getProfile(userId),
          profileService.getUserStats(userId),
          itemService.getItems({ ownerId: userId, includeInactive: false })
        ]);
        setProfile(prof);
        setStats(userStats);
        setItems(userItems || []);
      } catch (err) {
        setError(err.message || 'Could not load student profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <PageContainer>
        <Loader label="Loading student profile..." fullPage />
      </PageContainer>
    );
  }

  if (error || !profile) {
    return (
      <PageContainer>
        <ErrorMessage message={error || 'Student not found.'} />
        <div className="mt-4">
          <Link to="/app/explore" className="text-xs font-semibold text-brand-600 hover:underline">
            Back to Explore
          </Link>
        </div>
      </PageContainer>
    );
  }

  const studentEmail = profile.email || profile.university_email || '';
  const studentUid = profile.university_uid || (studentEmail ? studentEmail.split('@')[0].toUpperCase() : 'STUDENT');

  const cardArt = generateStudentCardSvg({
    fullName: profile.full_name || 'Verified Student',
    uid: studentUid,
    email: studentEmail,
    avatarUrl: profile.avatar_url || '',
    department: profile.department || 'Chandigarh University',
    hostelRoom: profile.hostel_room || 'Campus Resident',
    role: profile.role || 'student',
    trustScore: stats?.trust_score || '5.0'
  });

  return (
    <PageContainer>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink-primary mb-4"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Profile Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-card p-5 sm:p-6 rounded-2xl border border-surface-border shadow-xs mb-6">
        {/* Left Column: HoloCard */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center gap-2">
          <HoloCard
            image={cardArt}
            alt={`${profile.full_name} Student Card`}
            preset="bursts"
            width={280}
            intensity={0.9}
            edgeSparkle={0.8}
            glare={0.55}
            radius={16}
          />
          <span className="text-[11px] text-ink-muted font-medium mt-1">
            Official Campus HoloPass - UID {studentUid}
          </span>
        </div>

        {/* Right Column: Bio & Stats */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-ink-primary">{profile.full_name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCheck size={12} />
                <span>Verified Peer</span>
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                UID: {studentUid}
              </span>
            </div>

            <p className="text-xs text-ink-muted flex items-center gap-1 mb-3">
              <Mail size={12} />
              <span>{studentEmail}</span>
            </p>

            <div className="p-3.5 rounded-xl bg-surface-base border border-surface-border mb-3 text-xs leading-relaxed text-ink-secondary">
              {profile.bio || 'Active participant in campus lending, trades, and textbook exchange.'}
            </div>

            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <MapPin size={14} className="text-brand-600 shrink-0" />
              <span>Preferred Meetup Area: <strong>{profile.hostel_room || 'Campus Academic Block / Library'}</strong></span>
            </div>
          </div>

          {/* Peer Stats Record Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-surface-border">
            <div className="p-3 rounded-xl bg-surface-base border border-surface-border text-center">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mx-auto mb-1">
                <BookOpen size={15} />
              </div>
              <span className="text-lg font-black text-ink-primary">{stats?.borrowings || 0}</span>
              <p className="text-[10px] text-ink-muted mt-0.5">Completed Borrows</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-base border border-surface-border text-center">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                <CheckCheck size={15} />
              </div>
              <span className="text-lg font-black text-ink-primary">{stats?.lendings || 0}</span>
              <p className="text-[10px] text-ink-muted mt-0.5">Completed Lendings</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-base border border-surface-border text-center ring-1 ring-amber-500/20">
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto mb-1">
                <ArrowLeftRight size={15} />
              </div>
              <span className="text-lg font-black text-ink-primary">{stats?.trades || 0}</span>
              <p className="text-[10px] text-ink-muted mt-0.5">Permanent Trades</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-base border border-surface-border text-center">
              <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center mx-auto mb-1">
                <Package size={15} />
              </div>
              <span className="text-lg font-black text-ink-primary">{items.length}</span>
              <p className="text-[10px] text-ink-muted mt-0.5">Active Listings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Items From Peer */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink-primary">
            Available Listings From {profile.full_name?.split(' ')[0]} ({items.length})
          </h2>
        </div>
        <ItemGrid items={items} emptyTitle="No Active Listings" emptyDescription="This student currently has no active listings available." />
      </div>
    </PageContainer>
  );
};

export default UserProfilePage;
