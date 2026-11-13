import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  User,
  Mail,
  MapPin,
  Package,
  BookOpen,
  CheckCheck,
  ArrowLeftRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { HoloCard } from '../common/HoloCard';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import { profileService } from '../../services/profileService';
import { itemService } from '../../services/itemService';
import { generateStudentCardSvg } from '../../utils/studentCardArt';

export const PublicProfileModal = ({ userId, isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchPeerData = async () => {
      setLoading(true);
      try {
        const [prof, userStats, allItems] = await Promise.all([
          profileService.getProfile(userId),
          profileService.getUserStats(userId),
          itemService.getItems({ ownerId: userId, includeInactive: false })
        ]);
        setProfile(prof);
        setStats(userStats);
        setUserItems(allItems || []);
      } catch (err) {
        console.error('Error loading peer profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeerData();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const studentEmail = profile?.email || profile?.university_email || '';
  const studentUid = profile?.university_uid || (studentEmail ? studentEmail.split('@')[0].toUpperCase() : 'STUDENT');

  const cardArt = profile
    ? generateStudentCardSvg({
        fullName: profile.full_name || 'Verified Student',
        uid: studentUid,
        email: studentEmail,
        avatarUrl: profile.avatar_url || '',
        department: profile.department || 'Chandigarh University',
        hostelRoom: profile.hostel_room || 'Campus Resident',
        role: profile.role || 'student',
        trustScore: stats?.trust_score || '5.0'
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pb-[env(safe-area-inset-bottom,0px)] bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-surface-card border border-surface-border rounded-2xl shadow-2xl overflow-hidden my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="peer-profile-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between bg-surface-card/95">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <User size={16} />
            </span>
            <div>
              <h2 id="peer-profile-title" className="text-base sm:text-lg font-bold text-ink-primary">
                Campus Student Profile &amp; Trust Record
              </h2>
              <p className="text-[11px] text-ink-muted">
                Verified peer borrowing, lending, and trade history
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader label="Loading peer track record..." />
          </div>
        ) : !profile ? (
          <div className="p-8 text-center text-xs text-ink-muted">
            Student profile not found.
          </div>
        ) : (
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[82vh] max-h-[82dvh] overflow-y-auto">
            {/* Left Column: Interactive HoloCard */}
            <div className="lg:col-span-5 flex flex-col items-center justify-start gap-3">
              <div className="w-full flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Peer Holographic Pass
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Verified Identity
                </span>
              </div>

              <div className="py-2 flex items-center justify-center w-full">
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
              </div>

              <p className="text-[11px] text-center text-ink-muted max-w-xs leading-tight">
                Holographic security pass linked to student UID <strong>{studentUid}</strong>.
              </p>
            </div>

            {/* Right Column: Verified Stats & Activity */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Peer Bio & Header */}
              <div className="p-4 rounded-xl bg-surface-base border border-surface-border flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-50 border-2 border-brand-500 flex items-center justify-center text-brand-700 shrink-0 font-bold text-lg shadow-xs">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    profile.full_name?.charAt(0).toUpperCase() || 'S'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h3 className="text-base font-bold text-ink-primary truncate">{profile.full_name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      UID: {studentUid}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted truncate mb-1.5">{studentEmail}</p>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {profile.bio || 'Student participating in campus peer sharing and barter.'}
                  </p>
                </div>
              </div>

              {/* Verified Activity Stats Grid (Borrows, Lendings, Permanent Trades, Listings) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Peer Fulfillment &amp; Trade Record
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-surface-card border border-surface-border text-center shadow-xs">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mx-auto mb-1">
                      <BookOpen size={15} />
                    </div>
                    <span className="text-base font-extrabold text-ink-primary">{stats?.borrowings || 0}</span>
                    <p className="text-[10px] text-ink-muted leading-tight mt-0.5">Borrows Done</p>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-card border border-surface-border text-center shadow-xs">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                      <CheckCheck size={15} />
                    </div>
                    <span className="text-base font-extrabold text-ink-primary">{stats?.lendings || 0}</span>
                    <p className="text-[10px] text-ink-muted leading-tight mt-0.5">Lendings Done</p>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-card border border-surface-border text-center shadow-xs ring-1 ring-[#D4A853]/30">
                    <div className="w-7 h-7 rounded-lg bg-[#D4A853]/15 text-[#D4A853] flex items-center justify-center mx-auto mb-1">
                      <ArrowLeftRight size={15} />
                    </div>
                    <span className="text-base font-extrabold text-ink-primary">{stats?.trades || 0}</span>
                    <p className="text-[10px] text-ink-muted leading-tight mt-0.5">Trades Done</p>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-card border border-surface-border text-center shadow-xs">
                    <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center mx-auto mb-1">
                      <Package size={15} />
                    </div>
                    <span className="text-base font-extrabold text-ink-primary">{stats?.listings || userItems.length}</span>
                    <p className="text-[10px] text-ink-muted leading-tight mt-0.5">Active Items</p>
                  </div>
                </div>
              </div>

              {/* Location Landmark */}
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border flex items-center gap-2.5 text-xs text-ink-muted">
                <MapPin size={16} className="text-brand-600 shrink-0" />
                <div className="flex-1 truncate">
                  <span className="font-semibold text-ink-primary">Preferred Meetup Point: </span>
                  <span>{profile.hostel_room || 'Campus Library / Block B Academic Area'}</span>
                </div>
              </div>

              {/* Active Listings by this Student */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Available Items From {profile.full_name?.split(' ')[0]} ({userItems.length})
                  </span>
                </div>

                {userItems.length === 0 ? (
                  <p className="text-xs text-ink-muted italic p-3 rounded-xl bg-surface-base text-center border border-surface-border">
                    No other active listings at the moment.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {userItems.map((item) => (
                      <Link
                        key={item.id}
                        to={`/app/items/${item.id}`}
                        onClick={onClose}
                        className="p-2.5 rounded-xl border border-surface-border bg-surface-card hover:border-brand-400 flex items-center gap-2.5 transition-colors shadow-xs group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                          <img
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-ink-primary truncate group-hover:text-brand-600">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {item.listing_type === 'trade' ? (
                              <span className="text-[10px] font-bold text-[#916C16] dark:text-[#E8CA7A] flex items-center gap-0.5">
                                <ArrowLeftRight size={10} className="text-[#D4A853]" /> Trade
                              </span>
                            ) : item.listing_type === 'wanted' ? (
                              <span className="text-[10px] font-bold text-indigo-600">Wanted</span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                <Clock size={10} /> Borrow
                              </span>
                            )}
                            <span className="text-[10px] text-ink-muted truncate">- {item.condition}</span>
                          </div>
                        </div>
                        <ExternalLink size={13} className="text-ink-muted group-hover:text-ink-primary shrink-0 mr-1" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Zero-Fault Peer Policy Footer */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-surface-border text-[11px] text-ink-muted">
                <strong>Campus Policy:</strong> Meet only in public campus areas and verify all 4 photo angles before accepting permanent trades or loans.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfileModal;
