# PROMPT HISTORY (AUTO-APPENDED)

This file logs all significant prompts and instructions used during the project.

## Why this matters
- Reproducibility
- Transparency
- Evaluation clarity
- AI handover safety

---

## 2026-11-12 23:05:17
**Prompt:**  
read the prd and follow the structure , use all the folders for desired tasks and complete the project withou any ai slops and emojis

**Context:**  
Project kickoff and execution instruction following the PRD and orchestration contract.

**Outcome:**  
Initiated full autonomous execution: updated memory, task tracking, decisions, and completed implementation of frontend, backend, and ml components in 06_SRC without emojis or boilerplate slop.

---

## 2026-11-12 23:25:42
**Prompt:**  
run local host

**Context:**  
User requested launching the local development server for live browser inspection.

**Outcome:**  
Started Vite development server on port 3000 in background daemon mode with network access enabled.

---

## 2026-11-12 23:30:57
**Prompt:**  
push the project to git repo - https://github.com/ShashwatVatsyayan/BorrowBox.git

with all and also add gitignore and etc

**Context:**  
User requested initializing git repository, configuring gitignore, staging project files, committing, and pushing to the remote repository.

**Outcome:**  
Added root .gitignore, initialized git repository, created initial commit, and pushed to remote origin main.

---

## 2026-11-12 23:35:51
**Prompt:**  
how to make supabase auth for outlook otp for cuchd.in mail ids

**Context:**  
Technical architecture inquiry regarding configuring Supabase Auth, Custom SMTP, Outlook deliverability, and domain validation for Chandigarh University student mailboxes.

**Outcome:**  
Provided step-by-step architectural guide covering Supabase email settings, custom SMTP configuration for Microsoft 365 / Outlook spam bypass, OTP template setup, PostgreSQL domain restriction triggers, and React SDK integration.

---

## 2026-11-12 23:38:22
**Prompt:**  
any other free and unlimited way for otp signin mail from outlook for @cuchd mail

**Context:**  
Inquiry regarding zero-cost, high-volume alternatives for authenticating @cuchd.in Outlook users without paid SMTP services or strict rate limits.

**Outcome:**  
Provided actionable alternatives: (1) Free Gmail SMTP with App Passwords (500 free emails/day, zero domain required, high Microsoft deliverability), (2) Microsoft Azure AD SSO (truly unlimited, zero email delivery friction, authenticates natively with university Microsoft 365 credentials), and (3) Brevo free tier (300 emails/day).

---

## 2026-11-13 10:27:18
**Prompt:**  
use the logo for the Borrowbox stored in @[c:\HITMAN\TECHNICAL\PROJECTS\Personal Projects\BorrowBox\Images]

**Context:**  
User provided official brand asset 'BorrowBox Community Lending Logo.png' in the Images folder.

**Outcome:**  
Copied logo asset to public/logo.png and src/assets/images/logo.png. Created reusable Logo component. Updated AppHeader, LandingPage, LoginPage, SignupPage, ForgotPasswordPage, VerifyEmailPage, and index.html favicon/app icons. Pushed to remote main.

---

## 2026-11-13 10:32:07
**Prompt:**  
npx skills add udaysharmadev/Gravitas --skill gravitas --agent antigravity --yes

**Context:**  
User requested installation of the Gravitas engineering reliability runtime skill for Antigravity.

**Outcome:**  
Executed package installer and successfully installed 'gravitas' to .agents/skills/gravitas.

---

## 2026-11-13 10:40:31
**Prompt:**  
/gravitas what i have to do now for backend?

**Context:**  
User invoked /gravitas requesting actionable, evidence-based direction on remaining backend steps for connecting live Supabase PostgreSQL.

**Outcome:**  
Generated single-file migration bundle (combined_migration.sql). Formulated rigorous Gravitas-compliant execution checklist covering project creation, SQL schema execution, storage bucket policies, frontend environment configuration, and live verification.

---

## 2026-11-13 10:47:45
**Prompt:**  
/gravitas done till step 3 , created avatars also , now step 4 - NEXT_PUBLIC_SUPABASE_URL=https://nayvfsgvmwqgfphaxuzr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_tW6Q0L3kFPruJWcHK2r90A_MZiUEdSn

**Context:**  
User completed Supabase database setup and storage bucket creation, supplying live project URL and publishable key.

**Outcome:**  
Created .env.local with live Supabase credentials. Updated vite.config.js with envPrefix for both VITE_ and NEXT_PUBLIC_ prefixes. Updated supabase.js to accept both key variants. Verified production build and hot-reloaded dev server.

---

## 2026-11-13 10:54:07
**Prompt:**  
deploy this git repo to my vercel - https://github.com/ShashwatVatsyayan/BorrowBox.git

**Context:**  
User requested deploying the project to their authenticated Vercel account.

**Outcome:**  
Deployed project via Vercel CLI to production. Configured production environment variables for Supabase (VITE_ and NEXT_PUBLIC_ keys). Live at https://borrowbox-lime.vercel.app. Added vercel.json for SPA routing rewrites.

---

## 2026-11-13 11:19:25
**Prompt:**  
/gravitas remove all the ai slops , ai emojis , add terms and conditions , add privacy policy , add custom 404 page , add dark light mode

**Context:**  
User invoked /gravitas requesting complete elimination of AI tropes and emojis, creation of dedicated Terms & Conditions and Privacy Policy pages, a custom 404 error page, and a full Dark / Light mode system.

**Outcome:**  
Applied Gravitas reliability runtime principles. Purged all emoji occurrences repo-wide (verified 0 emojis). Redesigned landing page hero, removing AI pill badge and boilerplate templates. Created TermsPage (/terms), PrivacyPage (/privacy), and NotFoundPage (/404 and wildcard catch-all). Built ThemeContext, useTheme hook, ThemeToggle component, and CSS variable color mapping. Added theme controls to headers, auth views, and settings page. Verified production build and tests. Redeployed production release to Vercel.
