import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, ShieldCheck, Database, Check, ExternalLink } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-surface-base flex flex-col">
      {/* Top Header */}
      <header className="w-full bg-surface-card border-b border-surface-border sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Back to Home"
            >
              <ArrowLeft size={18} />
            </Link>
            <Logo size="sm" to="/" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />
            <Link
              to="/signup"
              className="text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full">
        <div className="glass-block rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="border-b border-surface-border pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-ink-muted text-xs font-semibold mb-3 border border-surface-border">
              <Cookie size={14} className="text-brand-600" />
              <span>Campus Data & Storage Transparency</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
              Cookie & Local Storage Policy
            </h1>
            <p className="text-xs text-ink-muted mt-2">
              Effective Date: November 13, 2026 | Version 1.2
            </p>
          </div>

          <div className="space-y-8 text-sm text-ink-primary leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">1.</span> Principle of Minimal Storage
              </h2>
              <p className="text-ink-muted">
                BorrowBox respects student privacy. We operate on a strict minimal-data doctrine. We do not use third-party marketing cookies, cross-site trackers, or commercial advertising pixels. All client-side storage is utilized exclusively to maintain your active university login session and persist your display theme preferences.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">2.</span> Technologies We Use
              </h2>
              <p className="text-ink-muted">
                BorrowBox uses HTML5 <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">localStorage</code> and <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">sessionStorage</code> rather than opaque third-party tracking cookies. The table below lists all storage keys used by the application:
              </p>

              <div className="overflow-x-auto border border-surface-border rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-surface-border font-bold text-ink-primary">
                      <th className="p-3">Key Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Lifespan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-ink-muted">
                    <tr>
                      <td className="p-3 font-mono text-ink-primary font-semibold">borrowbox_token</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold">Essential</span></td>
                      <td className="p-3">Cryptographic JWT bearer token authenticating your verified @cuchd.in student session.</td>
                      <td className="p-3">Session / 7 Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-ink-primary font-semibold">borrowbox_user</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold">Essential</span></td>
                      <td className="p-3">Cached basic student identity (UID, display name, verified campus mailbox) for seamless UI rendering.</td>
                      <td className="p-3">Session / 7 Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-ink-primary font-semibold">borrowbox_theme</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold">Functional</span></td>
                      <td className="p-3">Stores your light/dark mode preference ('light', 'dark', or 'system') for instant paint without flash.</td>
                      <td className="p-3">Persistent</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-ink-primary font-semibold">borrowbox_cookie_consent</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold">Functional</span></td>
                      <td className="p-3">Records your cookie banner consent preference ('all' or 'essential').</td>
                      <td className="p-3">Persistent (1 Year)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-ink-primary font-semibold">borrowbox_telemetry_events</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-[#D4A853]/15 text-[#916C16] dark:text-[#E8CA7A] font-semibold">Analytics</span></td>
                      <td className="p-3">First-party campus performance telemetry (page transitions, search queries). Cleared on browser close.</td>
                      <td className="p-3">Session Only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">3.</span> Zero Third-Party Advertising
              </h2>
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5">
                <p className="flex items-center gap-2 font-bold">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>No Tracking Networks or Marketing Pixels</span>
                </p>
                <p>
                  BorrowBox has zero integration with Google Ads, Meta Pixel, TikTok Pixel, Criteo, or data brokers. Your campus activity, searches, item views, and trade discussions are never shared, sold, or profiled.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">4.</span> Managing Your Preferences & Clearing Storage
              </h2>
              <p className="text-ink-muted">
                You can reset or clear all stored campus data at any moment:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
                <li>Log out from the application navigation bar, which automatically flushes authentication tokens from browser storage.</li>
                <li>Clear browsing data and cookies through your browser settings for <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">borrowbox-lime.vercel.app</code>.</li>
                <li>Toggle your consent preference through the cookie banner displayed at the bottom of the page.</li>
              </ul>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
            <p>BorrowBox Campus Lending Platform</p>
            <div className="flex items-center gap-4">
              <a
                href="https://portfolio-v2-alpha-ten-71.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Portfolio</span>
                <ExternalLink size={12} />
              </a>
              <span>•</span>
              <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms" className="text-brand-600 hover:underline">Terms & Conditions</Link>
              <span>•</span>
              <Link to="/" className="text-brand-600 hover:underline">Home</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CookiePolicyPage;

