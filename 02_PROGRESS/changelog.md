# CHANGELOG

This file logs every meaningful change in the project.

## Rules
- Append-only
- Every decision, scope change, or milestone is logged
- Used for reviews, evaluation, and retrospectives
- Zero emoji usage

---

## 2026-11-12
- Completed full PRD analysis and architectural design mapping.
- Established repository structure utilizing 06_SRC/frontend, 06_SRC/backend, and 06_SRC/ml.
- Defined Supabase migrations 001 through 011 with atomic PostgreSQL RPC functions for concurrency-safe approval and return.
- Configured task tracker, context, and decisions log.
- Implemented backend migrations, seed script, and automated lifecycle security test suite (`workflow_test.mjs`).
- Implemented ML utilities: taxonomy category prediction, quality assessment, and BM25 search ranking (`06_SRC/ml`).
- Configured Vite and Tailwind CSS with PRD color tokens in `06_SRC/frontend`.
- Built all frontend components, hooks, services, and pages:
  - Common: Button, Input, Modal, Loader, EmptyState, ErrorMessage, ConfirmDialog.
  - Layout: AppHeader, BottomNav, DesktopSidebar, PageContainer, ProtectedRoute.
  - Public: Landing, Signup, Login, Email Verification with OTP, Forgot Password, Reset Password.
  - Dashboard: Greeting, summary statistics, category shortcuts, recent listings.
  - Items: Explore with filters, Details with borrowing request modal, Add Listing, Edit Listing, My Listings management.
  - Activity: Request approval, decline, borrower cancellation, return initiation, and owner confirmation.
  - Notifications: Notification center with read/unread tracking.
  - Profile & Settings: Student profile, stats, editing, privacy policies, and admin portal.
- Passed 100% of automated tests across backend and ML modules.
- Executed production build (`npm run build`) with optimized chunk distribution.
- Started Vite development server in daemon mode on port 3000 (`http://localhost:3000`).
- Configured root `.gitignore` excluding `node_modules`, `dist`, local environment files, and system artifacts.
- Initialized Git repository, staged all 103 project files, committed, integrated remote main, and pushed cleanly to `https://github.com/ShashwatVatsyayan/BorrowBox.git`.
- Documented Supabase Auth setup for Microsoft 365 / Outlook OTP deliverability on `@cuchd.in` student domains.
- Analyzed zero-cost high-volume alternatives (Gmail SMTP relay and native Microsoft SSO).

---

## 2026-11-13
- Incorporated official brand asset from `Images/BorrowBox Community Lending Logo.png`.
- Distributed logo to `06_SRC/frontend/public/logo.png` and `06_SRC/frontend/src/assets/images/logo.png`.
- Created standardized reusable `Logo` component in `06_SRC/frontend/src/components/common/Logo.jsx`.
- Updated navigation headers, login, signup, forgot password, and email verification pages with official branding.
- Updated HTML favicon and touch icons.
- Verified production build (`npm run build`) with zero errors.
- Installed `gravitas` reliability runtime skill to `.agents/skills/gravitas` for Antigravity agent execution.
- Configured `06_SRC/frontend/.env.local` with live Supabase project credentials (`https://nayvfsgvmwqgfphaxuzr.supabase.co`).
- Enhanced `06_SRC/frontend/vite.config.js` with `envPrefix: ['VITE_', 'NEXT_PUBLIC_']` to support both Next.js and Vite environment variable naming.
- Updated `06_SRC/frontend/src/lib/supabase.js` to dynamically bind to either prefix.
- Hot-reloaded Vite dev server on port 3000.
- Created `06_SRC/frontend/vercel.json` with client-side SPA routing rewrites.
- Configured production environment variables on Vercel (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
- Deployed production release on Vercel at `https://borrowbox-lime.vercel.app`.
- Purged all emojis from the entire repository (verified 0 emojis in code, docs, and skill templates).
- Redesigned landing page hero section, removing generic AI template badges and SaaS fluff.
- Created standalone Terms and Conditions page (`/terms`, `/terms-and-conditions`).
- Created student-centric Privacy Policy page (`/privacy`, `/privacy-policy`).
- Created custom 404 Not Found error page (`/404` and wildcard catch-all).
- Built comprehensive Dark / Light mode system with ThemeProvider, useTheme hook, ThemeToggle component, and CSS variable color mapping.
- Added ThemeToggle to application header, public navigation headers, and authentication screens.
- Added theme appearance switcher and legal document links to Settings page.
- Validated production build (`npm run build`) in 4.57s.
- Redeployed updated production build to Vercel at `https://borrowbox-lime.vercel.app`.
- Updated `Logo.jsx` to render the official brand logo emblem at increased scale (`h-9` up to `h-28 sm:h-32`), removing redundant text beside the logo.
- Rebuilt and redeployed production release to Vercel at `https://borrowbox-lime.vercel.app`.
- Integrated organic Ink Bleed theme transition inspired by `codemure-official/ink-bleed-theme-changer`:
  - Embedded SVG fractal noise displacement filter (`#ink-bleed-filter`) for fibrous, organic droplet contours.
  - View Transitions API integration with click-coordinate origin tracking (`(clientX, clientY)`).
  - Animate expanding circular clip-path using `cubic-bezier(0.22, 1, 0.36, 1)` with 800ms duration.
  - Implemented Codemure CSS cross-fade fallback (`html.theme-fade`) with `--theme-fade: 0.45s` for non-supporting browsers and reduced-motion environments.
  - Validated production build (`npm run build`) in 5.26s.
  - Redeployed production release to Vercel at `https://borrowbox-lime.vercel.app`.
