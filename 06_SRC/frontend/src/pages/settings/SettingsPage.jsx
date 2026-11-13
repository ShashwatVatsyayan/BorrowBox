import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/common/Button';
import { Shield, Bell, Lock, FileText, CheckCircle2, Sun, Moon, Laptop, ExternalLink } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSavePreferences = () => {
    setSavedMessage('Preferences updated successfully.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <PageContainer maxWidth="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">Account & Settings</h1>
        <p className="text-xs text-ink-muted mt-0.5">Privacy, appearance, security, and notification settings</p>
      </div>

      {savedMessage && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{savedMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* Appearance / Theme Settings */}
        <div className="bg-surface-card p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={18} className="text-brand-600" />
            <h2 className="text-sm font-bold text-ink-primary uppercase tracking-wider">Appearance & Theme</h2>
          </div>
          <p className="text-xs text-ink-muted mb-4">
            Select your preferred display mode or synchronize with your system settings.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 ring-2 ring-brand-600/20'
                  : 'border-surface-border bg-surface-card hover:bg-slate-50 dark:hover:bg-slate-800 text-ink-primary'
              }`}
            >
              <Sun size={18} className={theme === 'light' ? 'text-brand-600' : 'text-ink-muted'} />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 ring-2 ring-brand-600/20'
                  : 'border-surface-border bg-surface-card hover:bg-slate-50 dark:hover:bg-slate-800 text-ink-primary'
              }`}
            >
              <Moon size={18} className={theme === 'dark' ? 'text-brand-600' : 'text-ink-muted'} />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'system'
                  ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 ring-2 ring-brand-600/20'
                  : 'border-surface-border bg-surface-card hover:bg-slate-50 dark:hover:bg-slate-800 text-ink-primary'
              }`}
            >
              <Laptop size={18} className={theme === 'system' ? 'text-brand-600' : 'text-ink-muted'} />
              <span>System</span>
            </button>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-surface-card p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-brand-600" />
            <h2 className="text-sm font-bold text-ink-primary uppercase tracking-wider">Account Credentials</h2>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-surface-border">
              <span className="text-ink-muted">University Email</span>
              <span className="font-semibold text-ink-primary">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-surface-border">
              <span className="text-ink-muted">Verification Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Verified Mailbox</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-ink-muted">Account Role</span>
              <span className="font-semibold text-ink-primary capitalize">{user?.role || 'Student'}</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface-card p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={18} className="text-brand-600" />
            <h2 className="text-sm font-bold text-ink-primary uppercase tracking-wider">Notification Preferences</h2>
          </div>
          <div className="flex flex-col gap-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-ink-primary">In-App Activity Notifications</p>
                <p className="text-ink-muted">Receive alerts for borrow requests, approvals, and returns</p>
              </div>
              <input
                type="checkbox"
                checked={inAppNotifs}
                onChange={(e) => setInAppNotifs(e.target.checked)}
                className="h-4 w-4 rounded text-brand-600 focus:ring-brand-600"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-surface-border">
              <div>
                <p className="font-semibold text-ink-primary">University Email Summaries</p>
                <p className="text-ink-muted">Receive email digests for urgent return deadlines</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="h-4 w-4 rounded text-brand-600 focus:ring-brand-600"
              />
            </label>
            <div className="pt-2">
              <Button size="sm" variant="secondary" onClick={handleSavePreferences}>
                Save Notification Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Legal Policies and Campus Rules */}
        <div className="bg-surface-card p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-brand-600" />
            <h2 className="text-sm font-bold text-ink-primary uppercase tracking-wider">Policies & Terms</h2>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <Link
              to="/terms"
              className="flex items-center justify-between p-3 rounded-xl border border-surface-border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div>
                <p className="font-semibold text-ink-primary">Terms and Conditions</p>
                <p className="text-ink-muted">Campus lending code, return liabilities, and damage rules</p>
              </div>
              <ExternalLink size={16} className="text-ink-muted" />
            </Link>

            <Link
              to="/privacy"
              className="flex items-center justify-between p-3 rounded-xl border border-surface-border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div>
                <p className="font-semibold text-ink-primary">Privacy Policy</p>
                <p className="text-ink-muted">Data protection, campus landmark privacy, and zero trackers</p>
              </div>
              <ExternalLink size={16} className="text-ink-muted" />
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
