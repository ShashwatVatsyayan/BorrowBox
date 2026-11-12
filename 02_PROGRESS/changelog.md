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
- Configured root `.gitignore` and prepared git repository for push to GitHub.
