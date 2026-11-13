# PROJECT CONTEXT

This file represents the current, shared understanding of the project.
It evolves as decisions are made or understanding deepens.

## Rules
- Must always align with the latest PRD
- Updated automatically after design, implementation, or scope changes
- Written for humans and AI continuity
- Zero emoji policy and no boilerplate fluff

## Current Understanding
BorrowBox is a mobile-first, responsive campus peer-to-peer borrowing platform designed for university students (initially Chandigarh University). The application facilitates listing items (calculators, lab coats, textbooks, electronics, tools), requesting them for defined date ranges, atomic approval by owners with double-booking prevention, borrower return initiation, owner return confirmation, in-app notifications, and basic moderation.

Architecture & Status:
- Brand Asset: Official 'BorrowBox Community Lending Logo.png' integrated across public pages, application header, and favicon.
- Remote Repository: Pushed to `https://github.com/ShashwatVatsyayan/BorrowBox.git` on branch `main`.
- Frontend: Fully built with React 18 / Vite / Tailwind CSS / React Router / Lucide React in `06_SRC/frontend`. Local development server active at `http://localhost:3000`.
- Backend: Supabase PostgreSQL migrations (001 through 011 SQL files), RLS policies, atomic functions (`approve_borrow_request`, `confirm_return`), seed data, and automated integration test suite in `06_SRC/backend`.
- ML: Categorization, quality scoring, and BM25 search ranking helpers in `06_SRC/ml` with passing benchmark tests.
- Dual-Mode Persistence: Supabase client with local storage fallback engine ensuring deterministic presentation and offline usability.

## Current Phase
Brand Integration & Build Verification

## Key Principles
- Mobile-first responsive UI (320px to desktop) with accessible touch targets (44x44px).
- Strict trust boundaries: RLS and database-level transaction validation for approvals and returns.
- Atomic double-booking prevention (no overlapping approved date ranges for the same item).
- No emojis anywhere in the codebase, UI, or documentation.
- Production-grade code quality with complete test coverage.

## Last Updated
2026-11-13 10:30:30
