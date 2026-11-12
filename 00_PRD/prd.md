# BorrowBox --- Product Requirements Document & Development Blueprint

**Version:** 1.0\
**Date:** 12 November 2026\
**Product type:** Mobile-first, responsive campus borrowing web
application\
**Initial audience:** Chandigarh University students\
**Target delivery:** Functional MVP in 2--3 days (with scope
discipline)\
**Status:** Build-ready project blueprint

------------------------------------------------------------------------

## Document purpose

This PRD defines what BorrowBox does, who can use it, how the interface
should work, how the frontend and backend are organized, how
authentication and authorization work, how the database is structured,
and how the project is tested and deployed.

It is intended to be the single working blueprint for the class project.
The folder tree is the target structure; create files as the
corresponding feature is implemented rather than creating dozens of
empty files on day one.

## 1. Product summary

### 1.1 Product concept

BorrowBox is a campus-focused peer-to-peer borrowing platform. Students
can list useful items they are willing to lend, discover items listed by
other students, request to borrow them for a date range, and track the
return.

Example items: - Textbooks and reference books - Scientific
calculators - Lab coats and safety equipment - Sports equipment -
Project tools and accessories - Extension boards and stationery

### 1.2 Problem

Students sometimes need an item for a short period but do not want to
purchase it. Finding a trusted student who owns that item can be
inconvenient. General marketplaces focus on buying and selling and do
not provide a simple campus borrowing workflow.

### 1.3 Proposed solution

BorrowBox provides: - A student-focused account system. - Item listings
with images, condition, category and general pickup location. - Search
and filters. - Borrow requests with start and end dates. - Owner
approval or rejection. - Return confirmation and transaction history. -
Reporting and basic moderation.

### 1.4 Product goals

1.  Make borrowing and lending straightforward on a phone.
2.  Restrict initial registration to verified university email
    mailboxes.
3.  Give owners control over their own listings and requests.
4.  Keep a clear record of request, approval and return states.
5.  Protect personal information and prevent unauthorized actions.
6.  Deliver a demonstrable full-stack MVP within the class deadline.

### 1.5 Success criteria

MVP is considered successful when: - A student can register, verify
email and log in. - A student can create, edit and deactivate their own
listing. - Another student can find the listing and submit a valid
request. - The owner can approve or reject the request. - The borrower
can initiate a return and the owner can confirm it. - Both users can see
the correct transaction status. - Unauthorized users cannot read or
modify protected records. - Core pages work at 360px mobile width and on
desktop. - The application can be deployed and demonstrated using test
accounts.

### 1.6 Non-goals for the MVP

Do not build these in the first release: - Payments, deposits or
refunds. - Delivery, shipping or courier tracking. - Real-time chat. -
Native Android/iOS apps. - Automated CUIMS login or scraping. -
University enrollment API integration unless CU formally provides one. -
AI recommendations. - Complex dispute resolution. - Public exposure of
phone numbers, email addresses or exact addresses.

------------------------------------------------------------------------

## 2. Users, roles and permissions

### 2.1 Student

A verified student can: - Browse active listings. - Search and filter
items. - View public listing and limited public profile information. -
Create, edit and deactivate their own listings. - Request another
student's item. - Cancel their own pending request. - View requests they
submitted. - View requests received for their own items. - Approve or
reject pending requests for their own items. - Initiate a return for an
approved borrowing. - Confirm return only if they own the item. - View
their borrowing and lending history. - Submit reports. - Manage
permitted profile fields and preferences.

A student cannot: - Request their own item. - Edit or delete another
student's listing. - Approve or reject a request for another owner's
item. - Change another user's request status. - Mark their own
transaction as completed. - Assign themselves an admin role. - Change
their verified status through a profile form.

### 2.2 Administrator / moderator

Admin functions are optional for the first demo but should be designed
for: - Reviewing reports. - Deactivating inappropriate listings. -
Suspending accounts where justified. - Recording moderation actions. -
Viewing limited platform statistics.

Admin access must be assigned through a trusted process, not a
client-editable `role` field. Every admin operation must be authorized
server-side or by database policies.

### 2.3 Trust boundary

The browser is untrusted. Hiding a button or protecting a React route is
not security. All sensitive permissions must be checked by PostgreSQL
RLS policies and trusted database functions.

------------------------------------------------------------------------

## 3. Product scope and feature priority

  Priority   Feature                                MVP requirement
  ---------- -------------------------------------- ----------------------------
  P0         Signup, email verification and login   Required
  P0         Student profile creation               Required
  P0         Create/edit/deactivate listing         Required
  P0         Explore, search and category filter    Required
  P0         Item detail page                       Required
  P0         Borrow request and owner decision      Required
  P0         Return workflow                        Required
  P0         RLS and database authorization         Required
  P0         Mobile responsive navigation           Required
  P1         Notifications                          Basic in-app notifications
  P1         Report listing/user                    Basic reporting
  P1         Admin moderation page                  Minimal
  P2         Reviews and ratings                    Later
  P2         Saved/favourite items                  Later
  P2         Chat                                   Later
  P2         PWA install support                    Later

**Scope rule:** If time is short, finish P0 end-to-end before starting
P1 or P2.

------------------------------------------------------------------------

## 4. Technology and architecture

### 4.1 Recommended stack

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  UI                      React                   Components and pages

  Build                   Vite                    Local development and
                                                  production build

  Styling                 Tailwind CSS            Mobile-first responsive
                                                  styling

  Routing                 React Router            Page navigation

  Forms                   React Hook Form + Zod   Form state and
                                                  validation

  Icons                   Lucide React            Consistent icons

  Backend platform        Supabase                Managed backend
                                                  services

  Authentication          Supabase Auth           Email verification,
                                                  login and sessions

  Database                PostgreSQL via Supabase Persistent data and
                                                  access policies

  File storage            Supabase Storage        Listing and avatar
                                                  images

  Hosting                 Vercel                  Frontend deployment

  Version control         Git + GitHub            Source history and
                                                  collaboration
  -----------------------------------------------------------------------

Use the Tailwind installation instructions matching the installed
Tailwind version. Do not blindly mix configuration instructions from
different major versions.

### 4.2 High-level architecture

``` text
Student's mobile browser
        |
        v
React + Vite frontend
        |
        +---- Supabase Auth
        |       +-- Signup
        |       +-- Email OTP verification
        |       +-- Login / logout
        |       +-- Password reset
        |
        +---- Supabase PostgreSQL
        |       +-- profiles
        |       +-- items
        |       +-- borrow_requests
        |       +-- notifications
        |       +-- reports
        |       +-- RLS policies and database functions
        |
        +---- Supabase Storage
                +-- item images
                +-- profile avatars

React production build ---> Vercel hosting
Source code -------------> GitHub
```

### 4.3 Backend design principle

For the MVP, Supabase provides the backend services. React calls
Supabase using the publishable/anon client key. PostgreSQL RLS
determines which rows a signed-in user can access. Sensitive multi-step
operations, such as approving a request without a date conflict, must
run in a database transaction or trusted database function.

Do not put the Supabase service-role key in browser code, Vite
variables, GitHub or screenshots.

------------------------------------------------------------------------

## 5. Information architecture and routes

### 5.1 Public routes

  Route                Page                     Access
  -------------------- ------------------------ ---------------------
  `/`                  Landing page             Public
  `/signup`            Signup                   Public
  `/login`             Login                    Public
  `/verify-email`      OTP verification         Signup flow
  `/forgot-password`   Password reset request   Public
  `/reset-password`    Set new password         Valid reset session

### 5.2 Protected student routes

  Route                   Page
  ----------------------- --------------------------------------
  `/app`                  Dashboard
  `/app/explore`          Explore listings
  `/app/items/new`        Add listing
  `/app/items/:id`        Item details
  `/app/items/:id/edit`   Edit own listing
  `/app/listings`         My listings
  `/app/activity`         Activity overview
  `/app/requests`         Requests received and sent
  `/app/borrowings`       Borrowing history/current borrowings
  `/app/lending`          Lending history/current lending
  `/app/notifications`    Notifications
  `/app/profile`          Public/private profile view
  `/app/profile/edit`     Edit permitted profile fields
  `/app/settings`         Account and privacy settings

### 5.3 Admin routes

  Route               Page
  ------------------- --------------------
  `/admin`            Admin dashboard
  `/admin/reports`    Report queue
  `/admin/users`      User moderation
  `/admin/listings`   Listing moderation

Admin routes require server/database authorization. A client-side
`isAdmin` check is only a presentation convenience.

------------------------------------------------------------------------

## 6. Mobile-first UI/UX specification

### 6.1 Design direction

Visual style: - Clean campus marketplace. - Light background with white
cards. - Dark navy primary text. - Teal primary action color. - Rounded
cards and restrained shadows. - Clear typography and consistent
spacing. - Accessible contrast and visible focus states.

Suggested tokens:

  Token           Value
  --------------- -----------
  Primary         `#0D9488`
  Primary hover   `#0F766E`
  Text            `#172033`
  Muted text      `#64748B`
  Background      `#F8FAFC`
  Surface         `#FFFFFF`
  Border          `#E2E8F0`
  Success         `#16A34A`
  Warning         `#D97706`
  Danger          `#DC2626`

### 6.2 Responsive breakpoints

Use mobile-first CSS: - 320--374px: compact phone. - 375--599px:
standard phone. - 600--767px: large phone / small tablet. - 768--1023px:
tablet. - 1024px and above: desktop.

Test at 320px, 360px, 390px, 768px and 1280px.

### 6.3 Global mobile navigation

Fixed bottom navigation on authenticated mobile pages:

1.  Home
2.  Explore
3.  Add
4.  Activity
5.  Profile

Behaviour: - Active route uses the primary teal color. - Each icon has a
text label. - Add is visually prominent but remains accessible. - Use a
safe-area inset for devices with gesture navigation. - Add bottom
padding to page content so the navigation never covers content. - Keep
touch targets at least approximately 44 × 44 CSS pixels.

On desktop, use a top navigation or sidebar and hide the mobile bottom
bar.

### 6.4 Header

Mobile: - Logo/wordmark on the left. - Notification bell on the right. -
Optional compact avatar/menu. - Avoid crowded header actions.

Desktop: - Logo. - Explore. - My Listings. - Activity. - Profile. -
Notifications.

### 6.5 Page-level layout and controls

#### Landing page

-   Header: logo, Login, Get Started.
-   Hero: concise value proposition and primary Get Started CTA.
-   How it works: List → Request → Borrow → Return.
-   Categories preview.
-   Benefits and safety notes.
-   Footer with contact, terms and privacy links.

#### Signup

-   Single-column form.
-   Full name.
-   University email.
-   Password and confirm password.
-   UID only if the project genuinely needs it; if collected, keep it
    private and protected.
-   Terms acknowledgement.
-   Primary Create Account button.
-   Login link.
-   Inline validation and loading state.

#### Email verification

-   Masked email address.
-   OTP input with paste support.
-   Verify button.
-   Resend code with cooldown.
-   Change email action.
-   Helpful message to check Inbox and Junk/Spam.
-   Do not expose the OTP in logs or analytics.

#### Login

-   Email and password.
-   Show/hide password.
-   Forgot password link.
-   Full-width Login button.
-   Signup link.
-   Clear invalid-credentials and unverified-account messages.

#### Dashboard

-   Header and notification bell.
-   Greeting.
-   Search bar.
-   Category shortcuts.
-   Recently added items.
-   Small summary cards: active listings, active borrowings, pending
    requests.
-   No large dashboard charts in MVP.

#### Explore

-   Search at top.
-   Filter button beside search.
-   Filter bottom sheet on mobile.
-   Two-column card grid where space permits; switch to one column on
    very narrow screens.
-   Sort by newest.
-   Empty state with Clear filters action.

#### Item card

-   Consistent image ratio.
-   Item title.
-   Category and condition.
-   General location.
-   Owner display name.
-   Availability label.
-   Card tap opens details.
-   Avoid tiny nested buttons inside the card.

#### Item details

-   Image gallery or single hero image.
-   Title and condition.
-   Category.
-   Description.
-   General pickup area, not exact home address.
-   Limited owner profile preview.
-   Request to Borrow primary CTA.
-   Report Listing in a secondary menu.
-   Hide request CTA for the owner.
-   Explain unavailable date ranges clearly.

#### Add/edit listing

-   Single-column form.
-   Title, description, category, condition, location.
-   Image picker with preview, remove and upload progress.
-   Publish Listing primary action.
-   Cancel secondary action.
-   Sticky bottom action only if it does not obscure form fields or
    mobile keyboard.
-   Confirm before leaving with unsaved changes.

#### My listings

-   Stacked cards on mobile.
-   Listing status.
-   Pending request count.
-   View, Edit and Deactivate actions.
-   Put destructive actions inside a menu and require confirmation.

#### Activity

-   Tabs: Borrowing and Lending.
-   Status chips.
-   Request cards with dates and item details.
-   Owner actions: Approve / Reject.
-   Borrower action: Cancel pending request.
-   Return actions appear only in valid states.

#### Profile

-   Avatar, display name and verified email badge.
-   University affiliation label.
-   Edit Profile button.
-   Statistics: listings, borrowings, completed transactions.
-   Sections: About, My Listings, Borrowing History, Lending History,
    Settings, Privacy & Security, Logout.
-   Do not show UID, private email or authentication data publicly.

#### Notifications

-   Full-width notification rows.
-   Read/unread state.
-   Timestamp.
-   Related item/request link.
-   Mark as read.
-   Empty state.

#### Settings

-   Account settings.
-   Password reset/change flow.
-   Notification preferences.
-   Privacy information.
-   Terms and privacy policy.
-   Logout.

#### Admin

-   Mobile cards rather than wide tables.
-   Report details.
-   Review action.
-   Deactivate listing / suspend account actions with confirmation.
-   Moderation reason and audit record.

### 6.6 Interaction and accessibility rules

-   Use labels for every form field.
-   Do not communicate status by color alone; include text.
-   Provide visible focus indicators.
-   Use semantic buttons and links.
-   Ensure keyboard navigation works.
-   Use sufficient contrast.
-   Avoid hover-only interactions.
-   Show loading, success, empty and error states.
-   Disable submit while a request is processing, but enforce duplicate
    prevention in the backend too.
-   Respect reduced-motion preferences.
-   Do not let fixed navigation cover page content.

------------------------------------------------------------------------

## 7. Core user journeys

### 7.1 New student registration

1.  Student opens BorrowBox.
2.  Selects Get Started.
3.  Enters name and university email.
4.  Frontend performs basic format validation.
5.  Supabase Auth sends the configured email verification code.
6.  Student opens Outlook or their university email client.
7.  Student enters the code in BorrowBox.
8.  Supabase verifies the code.
9.  A profile record is created through a trusted database trigger or
    safe server-side flow.
10. Student enters the dashboard.

Important distinction: email OTP proves control of that mailbox. It does
not prove that the person is currently enrolled. Do not claim official
university verification unless an authorized CU integration or registry
check exists.

### 7.2 Create a listing

1.  Student opens Add.
2.  Completes item details.
3.  Selects image(s).
4.  Frontend validates for usability.
5.  Storage policy checks the authenticated owner and permitted file
    path.
6.  Listing record is inserted with `owner_id` derived from the
    authenticated session, not trusted from a form field.
7.  Listing appears in Explore.

### 7.3 Request an item

1.  Borrower opens item details.
2.  Selects dates and adds an optional message.
3.  Database validates date order, ownership and request eligibility.
4.  Request is inserted as `pending`.
5.  Owner receives an in-app notification.
6.  Request appears in owner's Lending/Requests view.

### 7.4 Approve a request

1.  Owner opens the request.
2.  Selects Approve.
3.  A database function checks the authenticated user is the owner.
4.  Function locks/serializes the item-level approval operation.
5.  Function confirms request is still pending.
6.  Function checks for overlapping approved date ranges.
7.  If conflict exists, approval fails with a clear message.
8.  Otherwise status changes to `approved`.
9.  Other pending requests may remain pending or be marked
    unavailable/rejected according to the chosen product rule. For MVP,
    do not silently change them; show the item as booked for those dates
    and let the owner decide.
10. Notification is created for the borrower.

### 7.5 Reject or cancel

-   Owner can reject only a pending request for their own item.
-   Borrower can cancel only their own pending request.
-   Rejected/cancelled requests cannot be approved later.
-   Every transition is checked by the database.

### 7.6 Return

1.  Borrower selects Mark as Returned for an approved transaction.
2.  Status becomes `return_pending`.
3.  Owner inspects the item.
4.  Owner selects Confirm Return.
5.  Database confirms owner identity and valid status.
6.  Status becomes `completed`.
7.  Both parties see the completed transaction.

The owner confirmation is the completion point. A borrower must not be
able to mark the transaction completed alone.

------------------------------------------------------------------------

## 8. Database design

Use UUID primary keys and `timestamptz` for event timestamps. Add
`created_at` and `updated_at` where useful. Use foreign keys and
database constraints, not only frontend validation.

### 8.1 `profiles`

  -----------------------------------------------------------------------
  Column                  Type                    Notes
  ----------------------- ----------------------- -----------------------
  `id`                    UUID PK                 References
                                                  `auth.users(id)`

  `full_name`             TEXT                    Required

  `university_uid`        TEXT nullable           Optional; private;
                                                  unique if collected

  `university_email`      TEXT                    Prefer source from
                                                  verified auth identity

  `bio`                   TEXT nullable           Public, length-limited

  `avatar_path`           TEXT nullable           Storage path, not
                                                  arbitrary user URL

  `created_at`            TIMESTAMPTZ             Default now

  `updated_at`            TIMESTAMPTZ             Updated on change
  -----------------------------------------------------------------------

Do not store a user-editable `is_verified` or `role` value as the source
of truth. Use Supabase Auth's verified identity and trusted role
assignment.

### 8.2 `items`

  Column             Type          Notes
  ------------------ ------------- ----------------------------
  `id`               UUID PK       Generated
  `owner_id`         UUID FK       References profiles
  `title`            TEXT          Required, length-limited
  `description`      TEXT          Required, length-limited
  `category`         TEXT          Controlled category
  `condition`        TEXT          Controlled values
  `location_label`   TEXT          General campus pickup area
  `is_active`        BOOLEAN       Listing publication state
  `created_at`       TIMESTAMPTZ   Default now
  `updated_at`       TIMESTAMPTZ   Updated on change

For multiple images, use an `item_images` table rather than storing an
arbitrary array of URLs.

### 8.3 `item_images` (recommended)

  Column           Type          Notes
  ---------------- ------------- ---------------------------
  `id`             UUID PK       Generated
  `item_id`        UUID FK       References items
  `storage_path`   TEXT          Path in item image bucket
  `sort_order`     INTEGER       Display order
  `created_at`     TIMESTAMPTZ   Default now

### 8.4 `borrow_requests`

  Column          Type            Notes
  --------------- --------------- ---------------------
  `id`            UUID PK         Generated
  `item_id`       UUID FK         References items
  `borrower_id`   UUID FK         References profiles
  `start_date`    DATE            Required
  `end_date`      DATE            Required
  `message`       TEXT nullable   Length-limited
  `status`        TEXT            Controlled status
  `created_at`    TIMESTAMPTZ     Default now
  `updated_at`    TIMESTAMPTZ     Updated on change

Constraints: - `start_date <= end_date`. - `borrower_id` must not equal
the item's `owner_id`. - Status must be one of the allowed values. -
Prevent duplicate active requests as defined by the product rule. -
Overlapping approved date ranges must be prevented atomically.

### 8.5 `notifications`

  Column                 Type            Notes
  ---------------------- --------------- -----------------------
  `id`                   UUID PK         Generated
  `user_id`              UUID FK         Recipient
  `title`                TEXT            Required
  `message`              TEXT            Required
  `type`                 TEXT            Controlled event type
  `related_request_id`   UUID nullable   Related request
  `is_read`              BOOLEAN         Default false
  `created_at`           TIMESTAMPTZ     Default now

Notifications should be created by trusted database functions/triggers
or a trusted backend process, not by allowing one student to insert
arbitrary notifications for another.

### 8.6 `reports`

  Column               Type                   Notes
  -------------------- ---------------------- ----------------------------------------------
  `id`                 UUID PK                Generated
  `reporter_id`        UUID FK                Reporting user
  `reported_user_id`   UUID nullable FK       Optional
  `item_id`            UUID nullable FK       Optional
  `reason`             TEXT                   Controlled reason
  `description`        TEXT nullable          Length-limited
  `status`             TEXT                   `open`, `reviewing`, `resolved`, `dismissed`
  `reviewed_by`        UUID nullable          Admin
  `created_at`         TIMESTAMPTZ            Default now
  `reviewed_at`        TIMESTAMPTZ nullable   Review timestamp

### 8.7 `admin_roles`

  Column         Type          Notes
  -------------- ------------- ---------------------------
  `user_id`      UUID PK/FK    References auth user
  `role`         TEXT          e.g. `admin`, `moderator`
  `created_at`   TIMESTAMPTZ   Default now

Only trusted project administration can insert or change these records.

### 8.8 Relationships

-   One profile owns many items.
-   One profile submits many borrow requests.
-   One item has many borrow requests over time.
-   One item has many image records.
-   One user receives many notifications.
-   One user can submit many reports.
-   One admin can review many reports.

### 8.9 Indexes

Create indexes for common filters and joins: - `items(owner_id)` -
`items(category, is_active)` - `items(created_at)` -
`borrow_requests(item_id, status)` -
`borrow_requests(borrower_id, status)` -
`notifications(user_id, is_read, created_at)` -
`reports(status, created_at)`

Use a unique constraint on normalized university UID only if UID
collection is necessary and the university identifier format has been
confirmed.

------------------------------------------------------------------------

## 9. Authentication and email verification

### 9.1 Recommended method

Use Supabase Auth email OTP or its supported email verification flow. Do
not build custom password hashing or a homemade authentication system.

### 9.2 University domain validation

Before launch: 1. Confirm the actual student email domain used by the
intended CU cohort. 2. Test delivery to real student Outlook mailboxes
with permission. 3. Configure an allowlist for the confirmed domain(s).
4. Enforce the domain rule in a trusted server/database flow, not only
in React. 5. Keep the allowlist configurable so it can be changed
without rewriting the app.

Do not assume `@cuchd.in` is the universal current student domain
without testing/official confirmation. Do not collect CUIMS passwords or
attempt to authenticate through CUIMS.

### 9.3 Supabase setup

1.  Create a Supabase project.
2.  Open Authentication settings.
3.  Enable the supported email sign-in/OTP method.
4.  Configure the email template.
5.  Configure the correct redirect URLs for local and production
    environments.
6.  For reliable production delivery, configure an approved SMTP
    provider in Supabase.
7.  Set sensible OTP expiry and resend limits.
8.  Test correct, incorrect, expired and reused codes.
9.  Test delivery to the university Outlook environment.
10. Confirm unverified accounts cannot use protected features.

Supabase's default email service may have testing or delivery
limitations. Verify current project limits and configure custom SMTP for
production rather than assuming unrestricted delivery.

### 9.4 Authentication states

The UI should handle: - Signed out. - Signup submitted / awaiting
verification. - Verified and signed in. - Session loading. - Session
expired. - Password reset in progress. - Auth error.

### 9.5 Profile creation

Create a profile after signup using a trusted database trigger or safe
server-side workflow. Make the process idempotent so retries do not
create duplicate profiles.

### 9.6 Environment variables

Example `.env.example`:

``` env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Use the current Supabase publishable key if the project dashboard
provides one. These frontend values are visible to users; RLS is
mandatory.

Never add: - Service-role key. - SMTP password. - Database password. -
Private API secret.

Keep secrets only in trusted server-side environment settings. Add
`.env.local` to `.gitignore`.

------------------------------------------------------------------------

## 10. Authorization and security blueprint

### 10.1 RLS baseline

Enable Row Level Security on every table exposed through the Supabase
API. Review grants as well as policies. A policy is not a substitute for
carefully controlled table privileges.

### 10.2 Policy matrix

  ---------------------------------------------------------------------------------
  Table             Read           Insert             Update         Delete
  ----------------- -------------- ------------------ -------------- --------------
  profiles          Public fields  Trusted profile    Own permitted  Normally
                    only, as       creation           fields         restricted
                    designed                                         

  items             Active         Authenticated      Owner only     Prefer
                    listings       verified owner                    deactivate;
                                                                     owner only

  item_images       Images for     Owner of item      Owner of item  Owner of item
                    visible items                                    

  borrow_requests   Borrower or    Borrower for       Only valid     Normally
                    item owner     another owner's    role/state     restricted
                                   item               transitions    

  notifications     Recipient only Trusted            Recipient can  Restricted
                                   function/process   mark read      

  reports           Reporter sees  Authenticated      Admin only     Restricted
                    own; admins    reporter                          
                    see queue                                        

  admin_roles       Admin-only or  Trusted admin      Trusted admin  Trusted admin
                    no client read process            process        process
  ---------------------------------------------------------------------------------

This is a design matrix, not copy-paste SQL. Exact policies must account
for related-row ownership and avoid recursive policy logic.

### 10.3 Important security rules

-   Derive identity from `auth.uid()`, never from a submitted user ID.
-   Never trust `owner_id`, `borrower_id`, `role` or verification flags
    supplied by the browser.
-   Restrict profile updates to an explicit column allowlist.
-   Protect UID and private email fields.
-   Do not expose phone numbers or exact addresses.
-   Validate all inputs in the database/trusted backend.
-   Use parameterized queries through the Supabase client; never
    concatenate untrusted SQL.
-   Enforce request state transitions in trusted functions.
-   Add rate limits and anti-spam controls.
-   Use secure, appropriate session handling.
-   Keep dependencies updated.
-   Do not log passwords, OTPs, access tokens or private data.
-   Use HTTPS in production.
-   Add a privacy policy and clear data-use explanation.

### 10.4 Image security

-   Allow only JPEG, PNG and WebP.
-   Enforce file size limits.
-   Validate actual file content/MIME, not only filename extension.
-   Generate unique object paths.
-   Ensure a user can upload only into their own permitted path.
-   Prevent one user from overwriting another user's objects.
-   Prefer private buckets and signed URLs where images are not intended
    to be public.
-   Delete orphaned files when a listing/image is removed.
-   Consider image resizing/compression for mobile performance.

### 10.5 Double-booking prevention

A frontend check is not sufficient because two owners/actions may happen
concurrently.

Approval must run atomically: 1. Confirm authenticated user owns the
item. 2. Confirm request is pending. 3. Serialize/lock approval for the
item. 4. Check approved requests for date overlap. 5. Reject if a
conflict exists. 6. Otherwise update the request to approved. 7. Create
notification in the same transaction where practical.

For date ranges that include both start and end dates, overlap condition
is:

``` sql
existing.start_date <= requested.end_date
AND existing.end_date >= requested.start_date
```

For stronger enforcement, consider a PostgreSQL exclusion constraint
using a date range and a partial condition for approved records. If
using this approach, confirm the required extension/operator support in
the Supabase project and test migrations.

### 10.6 Account suspension

A suspension flag must be controlled by administrators.
Policies/functions should check suspension for actions such as creating
listings or requests. Do not rely only on hiding buttons.

### 10.7 Privacy and consent

-   Collect the minimum personal information needed.
-   Explain why university email/UID is collected.
-   Avoid retaining UID if it is not needed.
-   Define a deletion/retention process.
-   Provide a way to report abuse.
-   Do not imply that BorrowBox is officially endorsed by CU unless
    authorization exists.

------------------------------------------------------------------------

## 11. Frontend folder structure

Target structure:

``` text
borrowbox/
├── public/
│   ├── favicon.svg
│   └── images/
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppHeader.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   ├── DesktopSidebar.jsx
│   │   │   ├── PageContainer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── items/
│   │   │   ├── ItemCard.jsx
│   │   │   ├── ItemGrid.jsx
│   │   │   ├── ItemFilters.jsx
│   │   │   ├── ItemForm.jsx
│   │   │   └── ImageUploader.jsx
│   │   │
│   │   ├── requests/
│   │   │   ├── RequestCard.jsx
│   │   │   ├── RequestStatusBadge.jsx
│   │   │   └── RequestActions.jsx
│   │   │
│   │   └── profile/
│   │       ├── ProfileHeader.jsx
│   │       └── ProfileStats.jsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── VerifyEmailPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx
│   │   │
│   │   ├── items/
│   │   │   ├── ExplorePage.jsx
│   │   │   ├── ItemDetailsPage.jsx
│   │   │   ├── AddItemPage.jsx
│   │   │   ├── EditItemPage.jsx
│   │   │   └── MyListingsPage.jsx
│   │   │
│   │   ├── activity/
│   │   │   ├── ActivityPage.jsx
│   │   │   ├── RequestsPage.jsx
│   │   │   ├── BorrowingsPage.jsx
│   │   │   └── LendingPage.jsx
│   │   │
│   │   ├── notifications/
│   │   │   └── NotificationsPage.jsx
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfilePage.jsx
│   │   │   └── EditProfilePage.jsx
│   │   │
│   │   ├── settings/
│   │   │   └── SettingsPage.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboardPage.jsx
│   │       └── ReportsPage.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useItems.js
│   │   ├── useRequests.js
│   │   └── useNotifications.js
│   │
│   ├── lib/
│   │   └── supabase.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── profileService.js
│   │   ├── itemService.js
│   │   ├── requestService.js
│   │   └── notificationService.js
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   ├── constants.js
│   │   ├── dateUtils.js
│   │   └── formatters.js
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_items.sql
│   │   ├── 003_create_item_images.sql
│   │   ├── 004_create_borrow_requests.sql
│   │   ├── 005_create_notifications.sql
│   │   ├── 006_create_reports.sql
│   │   ├── 007_create_admin_roles.sql
│   │   ├── 008_enable_rls.sql
│   │   ├── 009_create_policies.sql
│   │   ├── 010_create_functions.sql
│   │   └── 011_create_indexes.sql
│   └── config.toml
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
└── tailwind.config.js
```

### 11.1 Folder responsibilities

-   `components/`: reusable UI pieces.
-   `pages/`: route-level screens.
-   `context/`: global authentication state.
-   `hooks/`: reusable React data/state logic.
-   `lib/`: Supabase client and shared integrations.
-   `services/`: functions that call Supabase for a specific domain.
-   `utils/`: validation, formatting and constants.
-   `styles/`: global styles and design tokens.
-   `supabase/migrations/`: version-controlled database schema, policies
    and functions.

Do not put database authorization rules in React services. Services
organize calls; PostgreSQL enforces access.

------------------------------------------------------------------------

## 12. Suggested implementation details

### 12.1 Install project

Install Node.js LTS and VS Code, then run:

``` bash
npm create vite@latest borrowbox -- --template react
cd borrowbox
npm install
npm run dev
```

Install core packages:

``` bash
npm install react-router-dom
npm install @supabase/supabase-js
npm install lucide-react
npm install react-hook-form zod @hookform/resolvers
```

Install and configure Tailwind using the current official instructions
for the selected version.

### 12.2 Supabase client

Create `src/lib/supabase.js`:

``` js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

If using the newer publishable key, name the environment variable
accordingly and update the client configuration. The key is public by
design; RLS is the security boundary.

### 12.3 Authentication context

`AuthContext` should: - Read the current Supabase session on app
startup. - Subscribe to authentication state changes. - Expose `user`,
`session`, `loading` and auth methods. - Clean up the auth listener. -
Avoid treating a client-side profile field as proof of verification.

### 12.4 Route protection

`ProtectedRoute` should: - Show a loading screen while session state is
being determined. - Redirect signed-out users to login. - Redirect
unverified users to the verification flow where appropriate. - Render
the requested page only when the expected auth state is present.

This is UX protection only. RLS still protects database records.

### 12.5 Service layer

Example responsibilities:

`authService.js` - signup - verify OTP - login - logout - reset password

`itemService.js` - list active items - search/filter items - get item
details - create item - update own item - deactivate own item

`requestService.js` - create request - list sent requests - list
received requests - approve request through trusted database function -
reject request - cancel request - initiate return - confirm return

`notificationService.js` - list current user's notifications - mark own
notification as read

Services should return clear errors and should not silently swallow
failures.

------------------------------------------------------------------------

## 13. Database functions and transaction requirements

Implement trusted database functions for operations that need multiple
checks or atomic state changes.

Recommended functions: - `approve_borrow_request(request_id)` -
`reject_borrow_request(request_id)` -
`cancel_borrow_request(request_id)` -
`mark_return_pending(request_id)` - `confirm_return(request_id)` -
Optional `create_borrow_request(...)` if creation needs complex
validation.

Each function must: 1. Identify the caller using the authenticated
database context. 2. Validate caller permissions. 3. Validate current
record state. 4. Validate related item state. 5. Validate date overlap
where relevant. 6. Update records atomically. 7. Create the
corresponding notification safely. 8. Return a predictable success/error
result.

Use carefully reviewed `SECURITY DEFINER` functions only when needed.
Set a safe `search_path`, fully qualify referenced objects, revoke
default public execution where appropriate, and grant execution only to
the intended authenticated role. Never use `SECURITY DEFINER` as a
shortcut around authorization.

------------------------------------------------------------------------

## 14. Validation rules

### Signup

-   Name required and length-limited.
-   Email syntactically valid.
-   Domain must match configured allowlist.
-   Password meets Supabase/project policy.
-   Confirmation matches password.
-   Email verification required for protected use.

### Listing

-   Title required and length-limited.
-   Description required and length-limited.
-   Category from an allowed set.
-   Condition from an allowed set.
-   General location only.
-   Image type and size validated.
-   Owner identity derived from session.

### Borrow request

-   Item exists and is active.
-   Requester is authenticated and verified.
-   Requester is not owner.
-   Start date is not after end date.
-   Dates satisfy the project's booking policy.
-   No duplicate request that violates the active-request rule.
-   Approval checks overlapping approved bookings atomically.

### Profile

-   Only permitted fields editable.
-   UID and verified identity not editable through ordinary profile
    form.
-   Bio length-limited.
-   Avatar upload follows storage policies.

### Reports

-   Reason selected from allowed categories.
-   Description length-limited.
-   Reporter identity derived from session.
-   Users cannot set their own report status to resolved.

------------------------------------------------------------------------

## 15. Error, loading and empty states

Every data-driven page should have: - Initial loading state. -
Refresh/retry state. - Empty state. - Validation errors. - Permission
denied state. - Network error state. - Success feedback.

Examples: - "No items found. Try another search." - "This item is no
longer available for those dates." - "Your request was submitted." -
"You don't have permission to perform this action." - "We couldn't load
your listings. Try again."

Never show raw database errors or stack traces to normal users. Log only
safe diagnostic information.

------------------------------------------------------------------------

## 16. Testing and quality assurance

### 16.1 Test accounts

Create at least two separate verified test users: - Student A: item
owner. - Student B: borrower.

Create a third account for unauthorized-access tests if possible.

Never use real student passwords or sensitive personal details in demo
data.

### 16.2 Functional test checklist

**Authentication** - \[ \] Signup works. - \[ \] Invalid email is
rejected. - \[ \] Unapproved domain is rejected. - \[ \] OTP arrives in
test mailbox. - \[ \] Incorrect OTP is rejected. - \[ \] Expired OTP is
rejected. - \[ \] Resend cooldown works. - \[ \] Login works. - \[ \]
Logout works. - \[ \] Password reset works. - \[ \] Unverified user
cannot use protected features.

**Listings** - \[ \] Create listing. - \[ \] Upload allowed image. - \[
\] Reject oversized image. - \[ \] Reject unsupported file type. - \[ \]
Edit own listing. - \[ \] Deactivate own listing. - \[ \] Cannot edit
another user's listing. - \[ \] Inactive listing is not shown in
Explore.

**Borrowing** - \[ \] Submit request. - \[ \] Cannot request own item. -
\[ \] Owner sees incoming request. - \[ \] Owner can approve. - \[ \]
Owner can reject. - \[ \] Borrower can cancel pending request. - \[ \]
Invalid state transition is rejected. - \[ \] Overlapping approvals
cannot both succeed. - \[ \] Borrower can initiate return. - \[ \] Owner
can confirm return. - \[ \] Borrower cannot confirm their own return.

**Privacy and authorization** - \[ \] User A cannot read User B's
private profile fields. - \[ \] User A cannot modify User B's listing. -
\[ \] User A cannot read unrelated private requests. - \[ \] User cannot
create admin role for themselves. - \[ \] User cannot create
notifications for another user. - \[ \] Suspended user cannot perform
restricted actions.

**Responsive** - \[ \] 320px screen. - \[ \] 360px screen. - \[ \] 390px
screen. - \[ \] Tablet layout. - \[ \] Desktop layout. - \[ \] Bottom
navigation does not cover content. - \[ \] Forms remain usable with
mobile keyboard. - \[ \] Images do not overflow. - \[ \] No horizontal
scrolling on normal pages.

### 16.3 Security test method

Use two accounts and attempt forbidden operations directly through the
Supabase client/API, not only through the UI. Confirm the database
denies them. A hidden or disabled button does not count as a successful
security test.

------------------------------------------------------------------------

## 17. Deployment

### 17.1 Pre-deployment

-   Run local production build.
-   Check browser console.
-   Verify RLS policies.
-   Verify no secret keys in Git history.
-   Confirm allowed email domain.
-   Test real Outlook delivery with consenting testers.
-   Add production redirect URLs to Supabase Auth.
-   Add environment variables in Vercel.
-   Confirm storage policies and bucket visibility.
-   Add privacy policy and terms.

### 17.2 Build

``` bash
npm run build
```

Fix all build errors before deployment.

### 17.3 GitHub

``` bash
git init
git add .
git commit -m "Initial BorrowBox implementation"
```

Create a GitHub repository and push the code. Ensure `.env.local` is
ignored.

### 17.4 Vercel

1.  Sign in to Vercel.
2.  Import the GitHub repository.
3.  Confirm Vite build settings.
4.  Add frontend environment variables.
5.  Deploy.
6.  Copy the production URL.
7.  Add that URL to Supabase Auth redirect settings.
8.  Test signup, OTP, login and all core workflows on the deployed site.

### 17.5 Post-deployment

-   Test on a real Android phone.
-   Test mobile data and slower network.
-   Verify email delivery.
-   Verify image upload.
-   Test two-user borrowing.
-   Check logs for errors without exposing sensitive information.

------------------------------------------------------------------------

## 18. 2--3 day execution plan

A complete, polished platform with every feature in this document is not
realistically guaranteed in 2--3 days for a beginner. The schedule below
prioritizes a demonstrable, secure core MVP. Admin moderation, advanced
notifications and polish may need additional time.

### Day 1 --- Foundation and authentication

1.  Install tools and create Vite project.
2.  Install dependencies.
3.  Configure Tailwind and responsive design tokens.
4.  Create Supabase project.
5.  Create database tables and basic migrations.
6.  Enable RLS and write/test core policies.
7.  Configure email authentication.
8.  Build signup, verification and login.
9.  Build header and mobile bottom navigation.

**Day 1 deliverable:** A student can sign up, verify email and log in
securely.

### Day 2 --- Listings and requests

1.  Build dashboard.
2.  Build Explore and search.
3.  Build item card and details page.
4.  Build Add/Edit Listing.
5.  Configure Storage and upload policies.
6.  Build request creation.
7.  Build owner request management.
8.  Implement atomic approval and date conflict checks.

**Day 2 deliverable:** Two students can list an item and complete the
request/approval workflow.

### Day 3 --- Returns, testing and deployment

1.  Build borrowing/lending activity.
2.  Implement return-pending and owner confirmation.
3.  Add basic notifications.
4.  Build profile and settings.
5.  Test permissions using two accounts.
6.  Test mobile breakpoints.
7.  Fix critical bugs.
8.  Deploy to Vercel.
9.  Prepare demo data and project presentation.

**Day 3 deliverable:** A deployed, mobile-friendly MVP with the complete
core borrowing lifecycle.

------------------------------------------------------------------------

## 19. Demo script for class submission

Use two test accounts.

1.  Log in as Student A.
2.  Create a listing for a scientific calculator.
3.  Log out.
4.  Log in as Student B.
5.  Search for the calculator.
6.  Open item details.
7.  Submit a borrowing request with dates.
8.  Log out and return as Student A.
9.  Open incoming requests.
10. Approve the request.
11. Return as Student B.
12. Open active borrowings.
13. Mark the item as returned.
14. Return as Student A.
15. Confirm the return.
16. Show completed transaction history.
17. Demonstrate that Student B cannot edit Student A's listing.

This demonstrates the frontend, authentication, database, authorization
and core workflow in one coherent presentation.

------------------------------------------------------------------------

## 20. Risks and mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  CU email domain differs by cohort   Confirm domain with actual student
                                      accounts before allowlisting

  Outlook blocks or delays external   Test delivery; configure reliable
  email                               SMTP; provide clear resend/error UX

  Email verification mistaken for     Describe it accurately as mailbox
  enrollment proof                    verification

  Two users receive overlapping       Atomic database approval and
  approvals                           overlap constraint/check

  Users bypass frontend restrictions  Enforce RLS and database functions

  Image upload abuse                  Storage policies, file size/type
                                      checks and unique paths

  Scope too large for deadline        Finish P0 workflow before optional
                                      features

  Mobile layout breaks                Test real widths and real Android
                                      devices

  Admin role escalation               Trusted role assignment only

  Private data exposed                Minimize collection and restrict
                                      fields/policies
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 21. Future enhancements

After the MVP: - PWA installation and offline shell. - Saved items. -
Reviews after completed transactions. - Better notification delivery. -
Optional chat with safety controls. - Calendar availability view. -
QR-based handover confirmation. - Dispute/report workflow. -
Multi-university support. - Official university verification
integration, if authorized. - Analytics for platform usage.

------------------------------------------------------------------------

## 22. Definition of Done

BorrowBox MVP is ready for submission when:

-   [ ] React/Vite application runs locally.
-   [ ] Mobile-first UI is responsive.
-   [ ] Supabase project is connected.
-   [ ] Signup and email verification work.
-   [ ] Login, logout and reset flow work.
-   [ ] Profiles are created safely.
-   [ ] Listings can be created, browsed, edited and deactivated.
-   [ ] Borrow requests can be submitted.
-   [ ] Owners can approve/reject requests.
-   [ ] Overlapping approved bookings are prevented.
-   [ ] Return can be initiated and owner-confirmed.
-   [ ] RLS is enabled and tested on all exposed tables.
-   [ ] Storage permissions are tested.
-   [ ] Two-user authorization tests pass.
-   [ ] No secret key is committed or exposed.
-   [ ] No major mobile overflow or navigation issue remains.
-   [ ] Production build succeeds.
-   [ ] Vercel deployment works.
-   [ ] README contains setup and run instructions.
-   [ ] Demo accounts/data are safe and non-sensitive.

------------------------------------------------------------------------

## 23. Official technical references

Use current official documentation during implementation because
dashboard labels, package versions and service limits can change.

-   React: https://react.dev/
-   Vite: https://vite.dev/guide/
-   Tailwind CSS: https://tailwindcss.com/docs
-   React Router: https://reactrouter.com/
-   Supabase documentation: https://supabase.com/docs
-   Supabase Auth: https://supabase.com/docs/guides/auth
-   Supabase email OTP:
    https://supabase.com/docs/guides/auth/auth-email-passwordless
-   Supabase Row Level Security:
    https://supabase.com/docs/guides/database/postgres/row-level-security
-   Supabase Storage: https://supabase.com/docs/guides/storage
-   Vercel Vite deployment:
    https://vercel.com/docs/frameworks/frontend/vite

------------------------------------------------------------------------

# Final product statement

**BorrowBox is a mobile-first campus borrowing platform that helps
verified university-email users share useful resources through listings,
date-based borrowing requests and owner-confirmed returns.**

Its core value is not merely displaying items. It is providing a
complete, permission-controlled borrowing lifecycle with clear
accountability and privacy protections.

**Build priority:** Authentication → Listings → Borrow requests →
Approval → Return → Security testing → Deployment.
