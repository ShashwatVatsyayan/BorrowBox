import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, BookOpen, Cpu, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface-base flex flex-col">
      {/* Navigation Header */}
      <header className="w-full bg-surface-card border-b border-surface-border sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="md" to="/" />
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-ink-primary hover:text-brand-600 px-3 py-2 transition-colors">
              Log In
            </Link>
            <Link to="/signup">
              <Button size="sm" variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6">
          <ShieldCheck size={14} />
          <span>Restricted to Verified University Students</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-primary tracking-tight leading-tight mb-5">
          Campus Borrowing, <span className="text-brand-600">Simplified</span>.
        </h1>
        <p className="text-base sm:text-lg text-ink-muted max-w-2xl mb-8 leading-relaxed">
          Need a scientific calculator for exams, a lab coat for chemistry practicals, or a textbook for a quick assignment? Borrow directly from peers on campus with clear date accountability.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2">
              <span>Create Student Account</span>
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Explore Demo Platform
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 bg-surface-card border-y border-surface-border px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-ink-primary tracking-tight">How BorrowBox Works</h2>
            <p className="text-sm text-ink-muted mt-1">A transparent, owner-controlled lifecycle</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm mb-3">1</div>
              <h3 className="text-sm font-bold text-ink-primary mb-1">List</h3>
              <p className="text-xs text-ink-muted">List items you are willing to lend with condition and general campus pickup area.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm mb-3">2</div>
              <h3 className="text-sm font-bold text-ink-primary mb-1">Request</h3>
              <p className="text-xs text-ink-muted">Discover items and submit a request with start and end dates.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm mb-3">3</div>
              <h3 className="text-sm font-bold text-ink-primary mb-1">Approve</h3>
              <p className="text-xs text-ink-muted">Owner reviews and approves the request. Double-booking is atomically prevented.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm mb-3">4</div>
              <h3 className="text-sm font-bold text-ink-primary mb-1">Return</h3>
              <p className="text-xs text-ink-muted">Borrower initiates return, and owner inspects and confirms receipt to complete.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-14 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-ink-primary">Student Safety & Privacy First</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border">
            <CheckCircle2 size={20} className="text-brand-600 mb-2" />
            <h4 className="text-sm font-semibold text-ink-primary mb-1">University Mailbox Verified</h4>
            <p className="text-xs text-ink-muted">Registration is verified via official student email OTP. Only verified campus peers can interact.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border">
            <CheckCircle2 size={20} className="text-brand-600 mb-2" />
            <h4 className="text-sm font-semibold text-ink-primary mb-1">No Phone or Room Leaks</h4>
            <p className="text-xs text-ink-muted">General campus landmarks only (e.g. Academic Block, Library entrance). Personal contact details remain private.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border">
            <CheckCircle2 size={20} className="text-brand-600 mb-2" />
            <h4 className="text-sm font-semibold text-ink-primary mb-1">Owner Confirmation</h4>
            <p className="text-xs text-ink-muted">Borrowers cannot complete transactions alone. Owners have full authority over approval and return confirmation.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-surface-card border-t border-surface-border text-center text-xs text-ink-muted">
        <p className="font-medium text-ink-primary">BorrowBox - Campus Peer Borrowing Platform</p>
        <p className="mt-1">Chandigarh University Class Project MVP. Built with React, Tailwind CSS and PostgreSQL.</p>
      </footer>
    </div>
  );
};

