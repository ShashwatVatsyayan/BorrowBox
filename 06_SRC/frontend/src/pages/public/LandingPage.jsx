import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, Calculator, FlaskConical, Shield, CheckCircle2, Clock, MapPin, ExternalLink, Play } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { PillNav } from '../../components/common/PillNav';
import { SiteIntroSplash } from '../../components/common/SiteIntroSplash';
import { useTheme } from '../../context/ThemeContext';

let hasShownIntroOnOpen = false;

export const LandingPage = () => {
  const { resolvedTheme } = useTheme();
  const location = useLocation();

  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('intro')) {
      return true;
    }
    if (!hasShownIntroOnOpen) {
      hasShownIntroOnOpen = true;
      return true;
    }
    return false;
  });

  const landingNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Essentials', href: '#essentials' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Safety', href: '#safety' },
    { label: 'Sign In', href: '/login' },
    { label: 'Create Account', href: '/signup' }
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-surface-base flex flex-col">
      {/* Intro Splash with React Bits StrokeText & Cinematic Zoom Blend */}
      {showIntro && <SiteIntroSplash onFinish={() => setShowIntro(false)} />}

      {/* Navigation Header with React Bits PillNav */}
      <header className="w-full bg-surface-card/85 backdrop-blur-md border-b border-surface-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Prominent Visible Standalone Logo - No Box, No Circle */}
          <div className="flex items-center shrink-0 py-1">
            <Logo size="md" to="/" />
          </div>

          <div className="flex-1 min-w-0 flex items-center justify-center sm:justify-start">
            <PillNav
              items={landingNavItems}
              activeHref={location.pathname}
              theme={resolvedTheme}
              itemStyle="pill"
              hoverEffect="fill"
              indicator="dot"
              surface="glass"
              size="md"
              collapse="auto"
              ariaLabel="Public Site Navigation"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle size="sm" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 text-center max-w-4xl mx-auto flex flex-col items-center">
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
      <section id="essentials" className="py-12 px-4 max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-ink-primary tracking-tight">
            Popular Campus Essentials
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Common items frequently needed for coursework and practicals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl glass-block">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center mb-3">
              <Calculator size={20} />
            </div>
            <h3 className="text-base font-bold text-ink-primary mb-1">Calculators & Electronics</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Casio fx-991EX scientific calculators for semester exams, laptop chargers, and Arduino developer kits.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-block">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center mb-3">
              <FlaskConical size={20} />
            </div>
            <h3 className="text-base font-bold text-ink-primary mb-1">Lab Coats & Equipment</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Standard white cotton chemistry lab coats, safety goggles, and dissection/drafting tool kits.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-block">
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
      <section id="how-it-works" className="py-14 bg-surface-card border-y border-surface-border px-4">
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
      <section id="safety" className="py-14 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-ink-primary">Built for Campus Security</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl glass-block">
            <Shield size={20} className="text-brand-600 mb-2" />
            <h4 className="text-sm font-semibold text-ink-primary mb-1">Verified Mailboxes</h4>
            <p className="text-xs text-ink-muted">Only active students with verified @cuchd.in accounts can access and transact.</p>
          </div>
          <div className="p-4 rounded-xl glass-block">
            <MapPin size={20} className="text-brand-600 mb-2" />
            <h4 className="text-sm font-semibold text-ink-primary mb-1">Public Campus Zones</h4>
            <p className="text-xs text-ink-muted">Handoffs take place at campus landmarks (Academic Block, Central Library, Student Center).</p>
          </div>
          <div className="p-4 rounded-xl glass-block">
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

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link to="/terms" className="hover:text-brand-600 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/privacy" className="hover:text-brand-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="hover:text-brand-600 transition-colors">
              Cookie Policy
            </Link>
            <a
              href="https://portfolio-v2-alpha-ten-71.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-brand-600 transition-colors font-medium text-ink-primary"
            >
              <span>Portfolio</span>
              <ExternalLink size={12} />
            </a>
            <Link to="/login" className="hover:text-brand-600 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-brand-600 transition-colors">
              Register
            </Link>
            <button
              type="button"
              onClick={() => setShowIntro(true)}
              className="inline-flex items-center gap-1 hover:text-brand-600 transition-colors font-medium cursor-pointer"
              title="Replay opening intro animation"
            >
              <Play size={11} className="text-brand-600" />
              <span>Replay Intro</span>
            </button>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1">
            <p className="text-center sm:text-right font-medium text-ink-primary">
              © 2026 BorrowBox. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-ink-light">
              <span>Developed by</span>
              <a
                href="https://portfolio-v2-alpha-ten-71.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline font-medium inline-flex items-center gap-0.5"
              >
                <span>Shashwat Vatsyayan</span>
                <ExternalLink size={10} />
              </a>
              <span>&amp; Harshit Kulhari</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
