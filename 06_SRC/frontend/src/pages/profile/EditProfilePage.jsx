import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';

export const EditProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const p = await profileService.getProfile(user.id);
        setFullName(p.full_name || '');
        setBio(p.bio || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Full name cannot be empty.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await profileService.updateProfile(user.id, {
        full_name: fullName.trim(),
        bio: bio.trim()
      });
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
          <Input
            label="Full Name"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bio" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              About / Bio
            </label>
            <textarea
              id="bio"
              rows={4}
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

