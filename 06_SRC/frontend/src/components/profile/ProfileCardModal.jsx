import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  User,
  Lock,
  Mail,
  MapPin,
  Sparkles,
  Check,
  Upload,
  LogOut,
  ArrowRightLeft,
  ChevronDown
} from 'lucide-react';
import { HoloCard } from '../common/HoloCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';
import { generateStudentCardSvg } from '../../utils/studentCardArt';

const PRESET_AVATARS = [
  { label: 'Hosteler A', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Hosteler B', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
  { label: 'Scholar C', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Tech Lead D', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
  { label: 'Athlete E', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80' }
];

const HOLO_PRESETS = [
  { id: 'bursts', label: 'Bursts (Default)' },
  { id: 'rainbow', label: 'Rainbow' },
  { id: 'cosmos', label: 'Cosmos' },
  { id: 'gold', label: 'Gold Foil' },
  { id: 'shards', label: 'Shards' },
  { id: 'stars', label: 'Stars' }
];

export const ProfileCardModal = ({ isOpen, onClose }) => {
  const { user, updateUserData, switchAccount, logout } = useAuth();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [hostelRoom, setHostelRoom] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedHoloPreset, setSelectedHoloPreset] = useState('bursts');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Student UID is strictly immutable and derived directly from university email
  const studentEmail = user?.email || user?.university_email || '23bcs12850@cuchd.in';
  const immutableUid = user?.university_uid || studentEmail.split('@')[0].toUpperCase();

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setAvatarUrl(user.avatar_url || '');
      setBio(user.bio || '');
      setHostelRoom(user.hostel_room || 'Hostel BH-3, Room 412');
      setDepartment(user.department || 'Computer Science & Engineering');
      setSaveSuccess(false);
      setErrorMessage(null);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage('Image size should be under 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      if (typeof dataUrl === 'string') {
        setAvatarUrl(dataUrl);
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Full name cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);
    try {
      const updates = {
        full_name: fullName.trim(),
        avatar_url: avatarUrl,
        bio: bio.trim(),
        hostel_room: hostelRoom.trim(),
        department: department.trim()
      };

      if (user?.id) {
        await profileService.updateProfile(user.id, updates);
      }

      if (updateUserData) {
        updateUserData(updates);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Generate dynamic vector artwork for the HoloCard
  const cardArt = generateStudentCardSvg({
    fullName: fullName || user?.full_name || 'Student Peer',
    uid: immutableUid,
    email: studentEmail,
    avatarUrl,
    department,
    hostelRoom,
    role: user?.role || 'student',
    trustScore: '5.0'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pb-[env(safe-area-inset-bottom,0px)] bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-surface-card border border-surface-border rounded-2xl shadow-2xl overflow-hidden my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-card-title"
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between bg-surface-card/95">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 border border-brand-500/20">
              <Sparkles size={16} />
            </span>
            <div>
              <h2 id="profile-card-title" className="text-base sm:text-lg font-bold text-ink-primary">
                Student Profile &amp; Holographic ID Card
              </h2>
              <p className="text-[11px] text-ink-muted">
                Official Chandigarh University peer card and profile settings
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

        {/* Modal Content Columns */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[82vh] max-h-[82dvh] overflow-y-auto">
          {/* Left Column: Interactive HoloCard */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start gap-4">
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Interactive Holographic Pass
              </span>
              <span className="text-[11px] text-brand-600 font-semibold">
                React Bits Component
              </span>
            </div>

            {/* The HoloCard Container */}
            <div className="flex items-center justify-center w-full py-2">
              <HoloCard
                image={cardArt}
                alt={`${fullName} Student Card`}
                preset={selectedHoloPreset}
                width={280}
                intensity={0.9}
                edgeSparkle={0.8}
                glare={0.55}
                radius={16}
                hoverScale={1.05}
              />
            </div>

            <p className="text-[11px] text-center text-ink-muted max-w-xs leading-relaxed">
              Tilt or move your cursor across the card to catch the holographic foil reflections.
            </p>

            {/* Holo Preset Switcher */}
            <div className="w-full p-3 rounded-xl bg-surface-base border border-surface-border">
              <label htmlFor="holo-preset-select" className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                Holographic Foil Texture
              </label>
              <select
                id="holo-preset-select"
                value={selectedHoloPreset}
                onChange={(e) => setSelectedHoloPreset(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-surface-border bg-surface-card text-ink-primary outline-none focus:border-brand-500"
              >
                {HOLO_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column: Editable Profile Details */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <Check size={16} className="text-emerald-600 shrink-0" />
                <span>Profile and holographic card updated successfully.</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              {/* Avatar Selector Section */}
              <div className="p-3.5 rounded-xl bg-surface-base border border-surface-border flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Profile Photo / Avatar
                </span>

                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-500 bg-slate-900 shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-white bg-brand-600 text-lg">
                        {fullName.charAt(0).toUpperCase() || 'S'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1.5 text-xs"
                    >
                      <Upload size={13} />
                      <span>Upload Photo</span>
                    </Button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="text-xs text-ink-muted hover:text-state-danger underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Preset Avatars Row */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                  <span className="text-[10px] text-ink-muted shrink-0 mr-1">Presets:</span>
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(av.url)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                        avatarUrl === av.url ? 'border-brand-600 ring-2 ring-brand-500/30' : 'border-surface-border opacity-70 hover:opacity-100'
                      }`}
                      title={av.label}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name Field (Editable) */}
              <Input
                label="Full Name"
                id="fullNameInput"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                required
              />

              {/* Immutable Student UID (Derived from email, read-only) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="immutableUidInput" className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1">
                    <Lock size={12} className="text-amber-600" />
                    <span>Student UID (University Roll Number)</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                    Immutable
                  </span>
                </div>
                <input
                  id="immutableUidInput"
                  type="text"
                  value={immutableUid}
                  readOnly
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-slate-100 dark:bg-slate-900 text-ink-muted font-mono font-bold text-xs cursor-not-allowed select-all"
                  aria-describedby="uid-immutable-help"
                />
                <p id="uid-immutable-help" className="text-[11px] text-ink-muted">
                  Student UID cannot be modified. It is permanently bound to your university email address (<code className="text-ink-primary font-mono">{studentEmail}</code>).
                </p>
              </div>

              {/* University Email (Read-Only) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="emailDisplayInput" className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1">
                    <Mail size={12} className="text-brand-600" />
                    <span>Verified University Mailbox</span>
                  </label>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <Check size={11} />
                    <span>Domain Verified</span>
                  </span>
                </div>
                <input
                  id="emailDisplayInput"
                  type="email"
                  value={studentEmail}
                  readOnly
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-slate-100 dark:bg-slate-900 text-ink-muted text-xs cursor-not-allowed select-all"
                />
              </div>

              {/* Department & Hostel Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Department / Program"
                  id="deptInput"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                />
                <Input
                  label="Hostel Room / Campus Landmark"
                  id="hostelInput"
                  type="text"
                  value={hostelRoom}
                  onChange={(e) => setHostelRoom(e.target.value)}
                  placeholder="e.g. Boys Hostel 3 (BH-3), Room 412"
                />
              </div>

              {/* About / Bio */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="bioInput" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  About &amp; Peer Lending Bio
                </label>
                <textarea
                  id="bioInput"
                  rows={2}
                  maxLength={300}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Mention what items you can share, your exam schedules, or hostel availability..."
                  className="w-full px-3.5 py-2 rounded-xl border border-surface-border bg-surface-card text-ink-primary text-xs outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              {/* Save Button */}
              <div className="pt-2 border-t border-surface-border flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" loading={saving}>
                  Save Changes
                </Button>
              </div>
            </form>

            {/* Quick Demo Switcher & Session Controls */}
            <div className="p-3.5 rounded-xl bg-surface-base border border-surface-border mt-2 flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <ArrowRightLeft size={12} />
                <span>Quick Switch Demo Account</span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await switchAccount('Student A');
                    onClose();
                  }}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                    user?.id === '11111111-1111-1111-1111-111111111111'
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold'
                      : 'border-surface-border bg-surface-card text-ink-muted hover:text-ink-primary'
                  }`}
                >
                  <p className="font-semibold">Student A</p>
                  <p className="text-[10px] text-ink-muted">23BCS12850 (Aarav)</p>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await switchAccount('Student B');
                    onClose();
                  }}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                    user?.id === '22222222-2222-2222-2222-222222222222'
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold'
                      : 'border-surface-border bg-surface-card text-ink-muted hover:text-ink-primary'
                  }`}
                >
                  <p className="font-semibold">Student B</p>
                  <p className="text-[10px] text-ink-muted">24BCS12850 (Priya)</p>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await switchAccount('Admin');
                    onClose();
                  }}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                    user?.role === 'admin'
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold'
                      : 'border-surface-border bg-surface-card text-ink-muted hover:text-ink-primary'
                  }`}
                >
                  <p className="font-semibold">Admin</p>
                  <p className="text-[10px] text-ink-muted">ADMIN01</p>
                </button>
              </div>

              <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                <span className="text-[11px] text-ink-muted">End session on campus terminal:</span>
                <button
                  type="button"
                  onClick={async () => {
                    onClose();
                    await logout();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-state-danger hover:underline"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardModal;
