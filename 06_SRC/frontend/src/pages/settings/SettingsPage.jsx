import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/common/Button';
import { Shield, Bell, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SettingsPage = () => {
  const { user } = useAuth();
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
        <p className="text-xs text-ink-muted mt-0.5">Privacy, security, and notification settings</p>
      </div>

      {savedMessage && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{savedMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* Account Details */}
        <div className="bg-surface-card p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-brand-600" />
            <h2 className="text-sm font-bold text-ink-primary uppercase tracking-wider">Account Credentials</h2>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-ink-muted">University Email</span>
              <span className="font-semibold text-ink-primary">{user?.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-ink-muted">Verification Status</span>
              <span className="font-semibold text-emerald-700">Verified Mailbox</span>
            </div>
            <div className="flex justify-between py-1.5">
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
            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100">
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

        {/* Privacy Policy and Conduct */}
        <div className="bg-surface-card p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-brand-600" />
            <h2 className="text-sm font-bold text-ink-primary uppercase tracking-wider">Campus Trust & Privacy Rules</h2>
          </div>
          <div className="text-xs text-ink-muted space-y-2 leading-relaxed">
            <p>
              1. <strong>Strict University Scoping:</strong> All accounts require verified university email address verification.
            </p>
            <p>
              2. <strong>No Personal Exposure:</strong> Contact numbers and hostel room numbers are never published publicly in the catalog.
            </p>
            <p>
              3. <strong>Accountability:</strong> Every borrowing transaction requires explicit owner approval and owner return confirmation. Unreturned items are escalated to campus administration.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

