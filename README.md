# BorrowBox

Mobile-first, responsive campus peer-to-peer borrowing application designed for university students.

BorrowBox provides a permission-controlled borrowing lifecycle: student account verification, item listings with pickup area specifications, date-range borrow requests, atomic owner approvals with double-booking prevention, borrower return initiation, owner return confirmation, and moderation.

---

## Workspace Structure

The project adheres to the following directory layout:

```text
BorrowBox/
├── 00_PRD/
│   └── prd.md                     # Product Requirements Document and Blueprint
├── 01_MEMORY/
│   ├── context.md                 # Shared project understanding and principles
│   └── state.json                 # Machine-readable execution state
├── 02_PROGRESS/
│   ├── changelog.md               # Chronological log of project milestones
│   └── tasks.md                   # Task checklist reflecting implementation state
├── 03_DECISIONS/
│   └── decisions.md               # Architectural and technical decision records
├── 04_PROMPTS/
│   ├── history.md                 # Log of prompts and execution history
│   └── system.txt                 # Autonomous orchestration guidelines
├── 05_ORCHESTRATION/
│   └── orchestrator.md            # Orchestration contract and persistence rules
└── 06_SRC/
    ├── backend/
    │   ├── migrations/            # SQL migrations 001 through 011 for PostgreSQL / Supabase
    │   ├── tests/                 # End-to-end integration and security test suite
    │   └── seed.sql               # Seed data for demo students (Aarav, Priya, Admin)
    ├── frontend/                  # React 18, Vite, Tailwind CSS mobile-first application
    └── ml/                        # Category classification, quality scoring, and ranking
```

---

## Key Capabilities

1. **University Mailbox Authentication**: Registration requires email OTP verification. Domain restrictions are configurable.
2. **Atomic Approval & Double-Booking Prevention**: PostgreSQL RPC function `approve_borrow_request` ensures two conflicting requests for the same date range cannot both be approved concurrently.
3. **Owner-Confirmed Returns**: Transactions cannot be marked completed by borrowers unilaterally. The borrower initiates a return (`return_pending`), and the owner confirms physical receipt to transition to `completed`.
4. **Privacy Protection**: General campus landmarks are shown for pickup. Contact numbers and room numbers are never published.
5. **Deterministic Offline Demo & Supabase Dual-Mode**: Functions identically with live Supabase credentials or offline via a localStorage-backed client engine.

---

## Getting Started

### 1. Frontend Development

Navigate to the frontend directory:
```bash
cd 06_SRC/frontend
npm install
npm run dev
```

To build for production:
```bash
npm run build
```

### 2. Backend & Database Migrations

Apply the migration scripts sequentially in Supabase or any standard PostgreSQL 15+ database:
```bash
cd 06_SRC/backend/migrations
```
Migration files:
- `001_create_profiles.sql`: User profile schema and auto-insert triggers
- `002_create_items.sql`: Item catalog with category and condition constraints
- `003_create_item_images.sql`: Image storage references
- `004_create_borrow_requests.sql`: Request lifecycle and self-borrow prevention trigger
- `005_create_notifications.sql`: Notification event logging
- `006_create_reports.sql`: Campus moderation reports
- `007_create_admin_roles.sql`: Role-based admin authorization
- `008_enable_rls.sql`: Row Level Security activation
- `009_create_policies.sql`: RLS access rules for profiles, items, and requests
- `010_create_functions.sql`: Atomic PL/pgSQL RPC routines (`approve_borrow_request`, `confirm_return`)
- `011_create_indexes.sql`: Performance indexes on lookup and foreign key columns

To seed demo data:
```bash
psql -d <database_url> -f 06_SRC/backend/seed.sql
```

### 3. Running Automated Tests

Run the backend workflow and authorization test suite:
```bash
node 06_SRC/backend/tests/workflow_test.mjs
```

Run the ML category classifier benchmark:
```bash
python 06_SRC/ml/evaluate.py
```

---

## Demo Script Walkthrough (PRD Section 19)

1. Open the application at `http://localhost:3000`.
2. The app loads with Student A (Aarav Sharma) active in the header account switcher.
3. Student A can view their listed items: "Casio fx-991EX Calculator", "White Lab Coat", and "Engineering Mechanics Textbook".
4. Use the account switcher in the top right to switch to **Student B (Priya Verma)**.
5. Browse **Explore**, search for "calculator", and click on the Casio fx-991EX.
6. Click **Request to Borrow**, select future start and end dates, and submit.
7. Switch back to **Student A**. Check the notification bell or navigate to **Activity & Requests -> Lending**.
8. Click **Approve Request**. The item is locked for those dates.
9. Attempting to approve an overlapping request will be rejected by the concurrency prevention check.
10. Switch back to **Student B**. Under **Activity -> Borrowing**, click **Mark as Returned**. Status updates to `Return Initiated`.
11. Switch back to **Student A**. Inspect and click **Confirm Return Received**. Status updates to `Completed`.

