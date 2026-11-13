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
