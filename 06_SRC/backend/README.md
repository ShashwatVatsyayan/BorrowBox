# BorrowBox Backend Specifications

## Overview
This directory contains database schemas, migrations, security policies, and atomic RPC functions designed for PostgreSQL on Supabase.

## Structure
- `migrations/`: Sequential migration files from 001 to 011
  - `001_create_profiles.sql`
  - `002_create_items.sql`
  - `003_create_item_images.sql`
  - `004_create_borrow_requests.sql`
  - `005_create_notifications.sql`
  - `006_create_reports.sql`
  - `007_create_admin_roles.sql`
  - `008_enable_rls.sql`
  - `009_create_policies.sql`
  - `010_create_functions.sql`
  - `011_create_indexes.sql`
- `seed.sql`: Initial seed data for test students and listings
- `tests/`: Automated integration tests enforcing RLS and state machine rules

## Security Model
- Row Level Security (RLS) is enabled on all tables.
- Approvals and returns are executed through atomic `SECURITY DEFINER` functions with search path isolation to eliminate concurrency race conditions.

