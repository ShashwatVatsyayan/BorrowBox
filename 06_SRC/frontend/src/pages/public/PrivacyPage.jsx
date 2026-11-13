import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Trash2, ExternalLink } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const PrivacyPage = () => {
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
        <div className="bg-surface-card rounded-2xl border border-surface-border p-6 sm:p-10 shadow-xs">
          <div className="border-b border-surface-border pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-ink-muted text-xs font-semibold mb-3 border border-surface-border">
              <Shield size={14} className="text-brand-600" />
              <span>Campus Privacy & Data Standards</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-ink-muted mt-2">
              Effective Date: November 13, 2026 | Last Revised: Version 1.2
            </p>
          </div>

          <div className="space-y-8 text-sm text-ink-primary leading-relaxed">
            {/* Introduction */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">1.</span> Student Privacy Commitment
              </h2>
              <p className="text-ink-muted">
                BorrowBox is designed from the ground up for university campus safety. We do not sell student data, we do not embed third-party advertising tracking scripts, and we do not monetize user activity. All data collected serves solely to facilitate peer-to-peer equipment borrowing safely within Chandigarh University.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">2.</span> Information We Collect
              </h2>
              <p className="text-ink-muted">
                To operate a trusted student community, we collect only necessary operational attributes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-surface-border space-y-1">
                  <p className="font-bold text-ink-primary">Account Credentials</p>
                  <p className="text-ink-muted">Your verified university email (<code className="font-mono text-[11px]">@cuchd.in</code>), full name, and hashed authentication token.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-surface-border space-y-1">
                  <p className="font-bold text-ink-primary">Profile Information</p>
                  <p className="text-ink-muted">Student UID, optional bio, academic major, and profile avatar stored securely in media storage.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-surface-border space-y-1">
                  <p className="font-bold text-ink-primary">Lending Listings</p>
                  <p className="text-ink-muted">Item title, category, description, photos, condition assessment, and general campus pickup landmark.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-surface-border space-y-1">
                  <p className="font-bold text-ink-primary">Borrowing Transaction Log</p>
                  <p className="text-ink-muted">Start/end dates, approval timestamps, return initiation, confirmation signatures, and user moderation reports.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">3.</span> Information We Never Collect
              </h2>
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
                <p>• <strong>No Precise GPS Tracking:</strong> We do not monitor your device coordinates or track your movements across campus.</p>
                <p>• <strong>No Sensitive Contact Exposure:</strong> Personal mobile phone numbers and residential/hostel room numbers are strictly kept off public listing cards.</p>
                <p>• <strong>No Financial Information:</strong> BorrowBox is a zero-fee peer sharing service; we do not collect or store bank accounts or payment cards.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">4.</span> Storage, Infrastructure & Security
              </h2>
              <p className="text-ink-muted">
                Data is stored in cloud PostgreSQL instances protected by PostgreSQL Row Level Security (RLS) policies. Only authorized users can mutate records:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
                <li>Borrow request statuses can only be modified by the respective item owner and borrowing requester.</li>
                <li>Notifications are visible solely to the recipient student.</li>
                <li>All data in transit is protected using modern TLS 1.3 cryptographic protocols.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">5.</span> Local Storage & Preferences
              </h2>
              <p className="text-ink-muted">
                We utilize standard browser <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">localStorage</code> to maintain your active authentication session and persist your display theme preferences (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">borrowbox_theme</code>). No tracking cookies are distributed to third parties.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">6.</span> Data Rights & Account Deletion
              </h2>
              <p className="text-ink-muted">
                Students retain the right to review, update, or permanently delete their account and associated listings. To request complete removal of your records, submit a request via <a href="mailto:privacy@cuchd.in" className="text-brand-600 font-semibold underline">privacy@cuchd.in</a> or through the account settings portal.
              </p>
            </section>

            {/* Section 7 - Explicit Non-Liability / Zero Fault for Trades & Physical Exchanges */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">7.</span> Peer Trades, Barters & Platform Non-Liability (Zero Fault)
              </h2>
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <p>
                  <strong>Complete Platform Non-Liability:</strong> BorrowBox operates purely as an online campus bulletin and communication tool to help university students connect with each other. After two or more users agree to trade, barter, swap, lend, or borrow physical items (such as clothes, shoes, electronics, books, appliances, or tools), the physical meetup, inspection, and transaction are executed strictly between those independent students.
                </p>
                <p>
                  <strong>It is explicitly understood and agreed that after users trade, exchange, or hand over any item, it is NOT the fault, responsibility, or liability of BorrowBox, its founders, student administrators, or Chandigarh University.</strong>
                </p>
                <p>
                  BorrowBox bears zero fault for post-trade dissatisfaction, defective goods, unreturned items, cosmetic discrepancies, damages, or disputes. All users are required to inspect items across all 4 mandatory photograph angles (top, bottom, and side views) in person before concluding any exchange.
                </p>
              </div>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
            <div className="flex flex-col items-center sm:items-start gap-0.5">
              <p className="font-medium text-ink-primary">BorrowBox Campus Lending Platform</p>
              <p className="text-[11px] text-ink-light">© 2026 BorrowBox. Developed by Shashwat Vatsyayan &amp; Harshit Kulhari. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
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
              <Link to="/terms" className="text-brand-600 hover:underline">Terms &amp; Conditions</Link>
              <span>•</span>
              <Link to="/cookies" className="text-brand-600 hover:underline">Cookie Policy</Link>
              <span>•</span>
              <Link to="/" className="text-brand-600 hover:underline">Home</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;

