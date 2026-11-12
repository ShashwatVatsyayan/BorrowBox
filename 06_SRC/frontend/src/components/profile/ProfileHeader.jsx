import React from 'react';
import { User, CheckCircle, Mail } from 'lucide-react';

export const ProfileHeader = ({ profile }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 bg-surface-card rounded-2xl border border-surface-border">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center text-brand-700 shrink-0 font-bold text-xl sm:text-2xl shadow-xs">
        {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <User size={32} />}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-ink-primary">{profile?.full_name || 'Student User'}</h2>
          <span className="inline-flex items-center gap-1 self-center sm:self-auto px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle size={12} />
            Verified University Mailbox
          </span>
        </div>
        <p className="text-xs text-ink-muted flex items-center justify-center sm:justify-start gap-1 mb-2">
          <Mail size={12} />
          {profile?.email || profile?.university_email}
        </p>
        {profile?.bio ? (
          <p className="text-xs text-ink-primary leading-relaxed max-w-xl">{profile.bio}</p>
        ) : (
          <p className="text-xs text-ink-muted italic">No bio provided.</p>
        )}
      </div>
    </div>
  );
};

