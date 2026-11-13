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
- Live Production Deployment: Deployed on Vercel at `https://borrowbox-lime.vercel.app`.
- Live Cloud Database: Connected to Supabase project `https://nayvfsgvmwqgfphaxuzr.supabase.co`.
- Environment Configuration: Configured in `06_SRC/frontend/.env.local` and in Vercel Production Environment with dual support for `VITE_` and `NEXT_PUBLIC_` conventions.
- Theme System: Full Dark and Light mode support with CSS variables, ThemeProvider context, and system preference detection.
- Compliance & Legal: Comprehensive Terms and Conditions (`/terms`) and Privacy Policy (`/privacy`) pages tailored to Chandigarh University student borrowing.
- Error Handling: Custom 404 Not Found page (`/404` and wildcard catch-all).
- Copy & Design: Zero AI slop, direct university student focus, authentic hero section, and 0 emojis repo-wide.
- Brand Asset: Official 'BorrowBox Community Lending Logo.png' integrated across all views.
- Remote Repository: Pushed to `https://github.com/ShashwatVatsyayan/BorrowBox.git` on branch `main`.
- Frontend: Fully built with React 18 / Vite / Tailwind CSS / React Router / Lucide React in `06_SRC/frontend`. Local development server active at `http://localhost:3000`.
- Dual-Mode Persistence: Operating against live cloud PostgreSQL instance.

## Current Phase
Production Deployed & Enhanced (Dark Mode, Terms, Privacy, Custom 404)

## Key Principles
- Mobile-first responsive UI (320px to desktop) with accessible touch targets (44x44px).
- Strict trust boundaries: RLS and database-level transaction validation for approvals and returns.
- Atomic double-booking prevention (no overlapping approved date ranges for the same item).
- Zero emojis anywhere in the codebase, UI, or documentation.
- High contrast accessibility across both light and dark themes.
- Production-grade code quality with complete test coverage.

## Last Updated
2026-11-13 11:37:00
