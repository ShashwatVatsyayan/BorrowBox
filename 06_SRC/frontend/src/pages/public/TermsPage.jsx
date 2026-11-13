import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const TermsPage = () => {
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
              <FileText size={14} className="text-brand-600" />
              <span>Campus Community Agreement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
              Terms and Conditions
            </h1>
            <p className="text-xs text-ink-muted mt-2">
              Effective Date: November 13, 2026 | Last Revised: Version 1.2
            </p>
          </div>

          <div className="space-y-8 text-sm text-ink-primary leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">1.</span> Campus Eligibility & Verification
              </h2>
              <p className="text-ink-muted">
                BorrowBox is an exclusive, closed-community peer-to-peer lending utility created for registered university students, faculty, and campus staff. To access and use BorrowBox, you must verify an authorized institutional email mailbox ending in <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">@cuchd.in</code>.
              </p>
              <p className="text-ink-muted">
                By creating an account, you represent and warrant that you are currently enrolled or employed in good standing with the university. Accounts linked to graduated, withdrawn, or suspended institutional credentials are automatically revoked upon credential expiration.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">2.</span> Ownership & Lending Obligations
              </h2>
              <p className="text-ink-muted">
                Students listing items on BorrowBox ("Owners") retain full legal ownership, title, and intellectual property rights to their property. By listing an item, the Owner agrees to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
                <li>Accurately declare the condition, functionality, cosmetic flaws, and included accessories of the item.</li>
                <li>Designate safe, public campus meeting zones (e.g., Central Library Lobby, Student Center, Academic Block Reception) for handoffs.</li>
                <li>Ensure the item is mechanically and electrically safe for student usage.</li>
                <li>Inspect returned items promptly and record confirmation through the platform without unreasonable delay.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">3.</span> Borrower Responsibilities & Timely Returns
              </h2>
              <p className="text-ink-muted">
                Students requesting and receiving items ("Borrowers") accept temporary custody and custody obligations. Borrowers explicitly agree:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
                <li>To exercise duty of care, preventing damage, liquid spills, drops, severe wear, or structural alterations.</li>
                <li>Not to sublet, lend, transfer, or pawn the borrowed item to any third party under any circumstances.</li>
                <li>To return the item directly to the Owner at the agreed university location on or before the approved end date and time.</li>
                <li>To mark the return initiated in the application and meet in person for physical handover.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">4.</span> Double-Booking & Atomic Approvals
              </h2>
              <p className="text-ink-muted">
                All borrowing reservations are governed by deterministic transactional scheduling. An item request remains tentative until explicitly approved by the Owner. Upon approval, all overlapping requests for the same date range are atomically rejected to protect both parties from schedule conflicts.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">5.</span> Prohibited Items & Activities
              </h2>
              <p className="text-ink-muted">
                The following categories are strictly forbidden from listing or transaction on BorrowBox:
              </p>
              <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-xs text-red-900 dark:text-red-200 space-y-1.5">
                <p>• Unauthorized university property (departmental lab equipment, projector remotes, campus library books with active library barcodes).</p>
                <p>• Hazardous chemicals, uninsulated high-voltage apparatus, flammable fluids, or prohibited pyrotechnics.</p>
                <p>• Weapons, simulated weapons, knives, self-defense sprays, or tactical implements.</p>
                <p>• Academic dishonesty devices, covert micro-earpieces, or unauthorized examination aids.</p>
                <p>• Controlled substances, pharmaceuticals, nicotine, or alcoholic beverages.</p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">6.</span> Damage, Loss & Disciplinary Escalation
              </h2>
              <p className="text-ink-muted">
                If an item is returned damaged, non-functional, or incomplete, the Borrower is financially liable for reasonable repair costs or equivalent fair-market replacement.
              </p>
              <p className="text-ink-muted">
                Unreturned items exceeding 48 hours past the approved return deadline without prior Owner consent will be marked as delinquent. The incident will be submitted to the Campus Administration team and may be referred to university authorities under the Student Code of Conduct for theft or misappropriation of peer property.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">7.</span> Limitation of Platform Liability
              </h2>
              <p className="text-ink-muted">
                BorrowBox functions exclusively as a communication and transaction-scheduling software platform. BorrowBox does not inspect, guarantee, warrant, or insure items listed by peers, and shall not be held liable for personal injury, property damage, academic loss, or exam disqualifications resulting from equipment borrowed through the platform.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <span className="text-brand-600">8.</span> Inquiries and Dispute Support
              </h2>
              <p className="text-ink-muted">
                For questions regarding these Terms or to report an unresolved lending dispute, contact the platform student administration team at <a href="mailto:support@cuchd.in" className="text-brand-600 font-semibold underline">support@cuchd.in</a> or visit the <Link to="/app/settings" className="text-brand-600 font-semibold underline">Settings</Link> page.
              </p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
            <p>BorrowBox Campus Lending Platform</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
              <span>•</span>
              <Link to="/" className="text-brand-600 hover:underline">Home</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;

