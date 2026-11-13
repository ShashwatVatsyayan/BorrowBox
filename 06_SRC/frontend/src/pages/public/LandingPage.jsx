import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calculator, FlaskConical, Shield, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface-base flex flex-col">
      {/* Navigation Header */}
      <header className="w-full bg-surface-card border-b border-surface-border sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="md" to="/" />
          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" />
            <Link
              to="/login"
              className="text-sm font-semibold text-ink-primary hover:text-brand-600 px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link to="/signup">
              <Button size="sm" variant="primary">Create Account</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 px-3 py-1 rounded-full mb-6">
          Chandigarh University Student Network
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-primary tracking-tight leading-tight mb-5">
          Campus Peer Borrowing for Students
        </h1>

        <p className="text-base sm:text-lg text-ink-muted max-w-2xl mb-8 leading-relaxed">
          Borrow scientific calculators for exams, lab coats for practicals, drafting tools, and course textbooks directly from peers. Verified student accounts with scheduled return accountability.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2">
              <span>Sign Up with @cuchd.in</span>
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign In to Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Academic Essentials Categories */}
      <section className="py-12 px-4 max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-ink-primary tracking-tight">
            Popular Campus Essentials
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Common items frequently needed for coursework and practicals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center mb-3">
              <Calculator size={20} />
            </div>
            <h3 className="text-base font-bold text-ink-primary mb-1">Calculators & Electronics</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Casio fx-991EX scientific calculators for semester exams, laptop chargers, and Arduino developer kits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center mb-3">
              <FlaskConical size={20} />
            </div>
            <h3 className="text-base font-bold text-ink-primary mb-1">Lab Coats & Equipment</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Standard white cotton chemistry lab coats, safety goggles, and dissection/drafting tool kits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center mb-3">
              <BookOpen size={20} />
            </div>
            <h3 className="text-base font-bold text-ink-primary mb-1">Textbooks & Reference Notes</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Engineering mathematics textbooks, GATE preparation guides, and core semester reference manuals.
            </p>
          </div>
        </div>
      </section>

      {/* Lifecycle Steps */}
      <section className="py-14 bg-surface-card border-y border-surface-border px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-ink-primary tracking-tight">How the Lending Flow Works</h2>
            <p className="text-sm text-ink-muted mt-1">Owner-controlled approval with schedule locking</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="p-4 rounded-xl bg-surface-base border border-surface-border">
              <div className="text-xs font-mono font-bold text-brand-600 mb-2">STEP 01</div>
              <h3 className="text-sm font-bold text-ink-primary mb-1">List an Item</h3>
              <p className="text-xs text-ink-muted">Specify condition, pickup landmark, and photos. No private room numbers required.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-base border border-surface-border">
              <div className="text-xs font-mono font-bold text-brand-600 mb-2">STEP 02</div>
              <h3 className="text-sm font-bold text-ink-primary mb-1">Request Window</h3>
              <p className="text-xs text-ink-muted">Borrowers select start and end dates according to academic exam schedules.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-base border border-surface-border">
              <div className="text-xs font-mono font-bold text-brand-600 mb-2">STEP 03</div>
              <h3 className="text-sm font-bold text-ink-primary mb-1">Owner Approves</h3>
              <p className="text-xs text-ink-muted">Approval locks the item and rejects conflicting overlapping requests automatically.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-base border border-surface-border">
              <div className="text-xs font-mono font-bold text-brand-600 mb-2">STEP 04</div>
              <h3 className="text-sm font-bold text-ink-primary mb-1">Verify Return</h3>
              <p className="text-xs text-ink-muted">Borrower initiates return; owner inspects condition and confirms completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-14 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-ink-primary">Built for Campus Security</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border">
            <Shield size={20} className="text-brand-600 mb-2" />
            <h4 className="text-sm font-semibold text-ink-primary mb-1">Verified Mailboxes</h4>
            <p className="text-xs text-ink-muted">Only active students with verified @cuchd.in accounts can access and transact.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border">
            <MapPin size={20} className="text-brand-600 mb-2" />
            <h4 className="text-sm font-semibold text-ink-primary mb-1">Public Campus Zones</h4>
            <p className="text-xs text-ink-muted">Handoffs take place at campus landmarks (Academic Block, Central Library, Student Center).</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border">
            <Clock size={20} className="text-brand-600 mb-2" />
            <h4 className="text-sm font-semibold text-ink-primary mb-1">Clear Accountability</h4>
            <p className="text-xs text-ink-muted">Every transaction has an audit trail. Delinquent returns are escalated to campus admin.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-surface-card border-t border-surface-border text-xs text-ink-muted">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <Logo size="sm" to="/" />
            <p className="mt-1 text-ink-muted">Campus Peer Lending Platform</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/terms" className="hover:text-brand-600 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="hover:text-brand-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/login" className="hover:text-brand-600 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-brand-600 transition-colors">
              Register
            </Link>
          </div>

          <p className="text-center sm:text-right">
            Chandigarh University Student Community
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
