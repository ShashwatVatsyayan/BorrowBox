import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Upload } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';

export const EditProfilePage = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('');
  const [hostelRoom, setHostelRoom] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const studentEmail = user?.email || user?.university_email || '';
  const studentUid = user?.university_uid || (studentEmail ? studentEmail.split('@')[0].toUpperCase() : 'STUDENT');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const p = await profileService.getProfile(user.id);
        setFullName(p.full_name || '');
        setAvatarUrl(p.avatar_url || '');
        setBio(p.bio || '');
        setDepartment(p.department || 'Computer Science & Engineering');
        setHostelRoom(p.hostel_room || 'Hostel BH-3, Room 412');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError('Image must be under 3 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setAvatarUrl(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Full name cannot be empty.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const updates = {
        full_name: fullName.trim(),
        avatar_url: avatarUrl,
        bio: bio.trim(),
        department: department.trim(),
        hostel_room: hostelRoom.trim()
      };
      await profileService.updateProfile(user.id, updates);
      if (updateUserData) {
        updateUserData(updates);
      }
      navigate('/app/profile');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Loader label="Loading profile..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="max-w-xl">
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">Edit Profile</h1>
        <p className="text-xs text-ink-muted mt-0.5">Manage your public campus name and bio</p>
      </div>

      <div className="bg-surface-card p-6 rounded-2xl border border-surface-border shadow-xs">
        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar Photo Selection */}
          <div className="p-3.5 rounded-xl bg-surface-base border border-surface-border flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-500 bg-slate-900 shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-white bg-brand-600 text-lg">
                  {fullName.charAt(0).toUpperCase() || 'S'}
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-xs font-bold text-ink-primary">Profile Photo</span>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-ink-primary transition-colors">
                  <Upload size={13} />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="text-xs text-ink-muted hover:text-state-danger underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          <Input
            label="Full Name"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          {/* Immutable Student UID (Derived from university email username) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="immutableUid" className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1">
                <Lock size={12} className="text-amber-600" />
                <span>Student UID (University Roll Number)</span>
              </label>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                Immutable
              </span>
            </div>
            <input
              id="immutableUid"
              type="text"
              value={studentUid}
              readOnly
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-slate-100 dark:bg-slate-900 text-ink-muted font-mono font-bold text-xs cursor-not-allowed select-all"
            />
            <p className="text-[11px] text-ink-muted">
              UID cannot be changed. It is permanently derived from your university email username (<code className="text-ink-primary font-mono">{studentEmail}</code>).
            </p>
          </div>

          {/* University Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="immutableEmail" className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1">
              <Mail size={12} className="text-brand-600" />
              <span>University Email</span>
            </label>
            <input
              id="immutableEmail"
              type="email"
              value={studentEmail}
              readOnly
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-slate-100 dark:bg-slate-900 text-ink-muted text-xs cursor-not-allowed select-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Department / Program"
              id="dept"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
            />
            <Input
              label="Hostel Room / Campus Landmark"
              id="hostel"
              value={hostelRoom}
              onChange={(e) => setHostelRoom(e.target.value)}
              placeholder="e.g. Boys Hostel 3 (BH-3), Room 412"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bio" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              About / Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              maxLength={300}
              placeholder="e.g. 3rd year Computer Science student. Willing to lend lab kits, graphing calculators, and programming books..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-surface-border text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
            <span className="text-[11px] text-ink-muted text-right">{bio.length}/300 characters</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-ink-muted">
            <p className="font-semibold text-ink-primary mb-1">Protected University Identity</p>
            <p>Your university email ({user?.email}) and student UID are bound to your verified identity and cannot be edited manually.</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
            <Button variant="outline" size="sm" onClick={() => navigate('/app/profile')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

