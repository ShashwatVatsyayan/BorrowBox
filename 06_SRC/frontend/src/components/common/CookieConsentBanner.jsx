import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import { getConsent, setConsent, CONSENT_STATUS } from '../../lib/analytics';

export const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const status = getConsent();
    if (status === CONSENT_STATUS.UNDECIDED) {
      // Small delay so page renders smoothly first
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setConsent(CONSENT_STATUS.ACCEPTED);
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    setConsent(CONSENT_STATUS.ESSENTIAL);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie and storage preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="glass-block p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-ink-primary font-bold text-sm">
            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600">
              <Cookie size={18} />
            </span>
            <span>Campus Privacy & Storage</span>
          </div>
          <button
            type="button"
            onClick={handleEssentialOnly}
            className="p-1 rounded-md text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Dismiss cookie notice (Essential only)"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-ink-muted leading-relaxed">
          We use strictly essential local storage to keep your university account authenticated and remember your theme. We never run third-party advertising cookies or trackers. Learn more in our{' '}
          <Link to="/cookies" className="text-brand-600 font-semibold underline hover:text-brand-700">
            Cookie Policy
          </Link>.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={handleEssentialOnly}
            className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-ink-primary hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs transition-colors border border-surface-border focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Essential Only
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsentBanner;
