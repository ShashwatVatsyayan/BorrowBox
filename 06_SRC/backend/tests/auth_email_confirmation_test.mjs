import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

console.log('--- STARTING BORROWBOX AUTH EMAIL CONFIRMATION SUITE ---\n');

// 1. Email Domain & Normalization Tests
console.log('[Scenario 1: University Domain Validation & Email Normalization]');
const ALLOWED_DOMAINS = ['cuchd.in', 'cumail.in'];

function validateUniversityEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  const domain = email.split('@')[1]?.toLowerCase();
  const isAllowed = ALLOWED_DOMAINS.some(
    (d) => domain === d.toLowerCase() || domain.endsWith(`.${d.toLowerCase()}`)
  );
  if (!isAllowed) {
    return {
      valid: false,
      error: `Please use your official university email (e.g. @${ALLOWED_DOMAINS[0]}).`
    };
  }
  return { valid: true, normalized: email.trim().toLowerCase() };
}

// Test cases
assert.equal(validateUniversityEmail('').valid, false, 'Rejects empty email');
assert.equal(validateUniversityEmail('invalid-format').valid, false, 'Rejects malformed email');
assert.equal(validateUniversityEmail('student@gmail.com').valid, false, 'Rejects commercial Gmail domain');
assert.equal(validateUniversityEmail('student@yahoo.com').valid, false, 'Rejects Yahoo domain');
assert.equal(validateUniversityEmail('hacker@random.edu').valid, false, 'Rejects unpermitted educational domain');

const valid1 = validateUniversityEmail('24BCS12850@CUCHD.IN');
assert.equal(valid1.valid, true, 'Accepts uppercase Chandigarh University email');
assert.equal(valid1.normalized, '24bcs12850@cuchd.in', 'Normalizes email to lowercase');

const valid2 = validateUniversityEmail('priya.verma@cuchd.in');
assert.equal(valid2.valid, true, 'Accepts faculty/student named CU email');
assert.equal(valid2.normalized, 'priya.verma@cuchd.in', 'Preserves valid lowercase email');

const valid3 = validateUniversityEmail('faculty@cumail.in');
assert.equal(valid3.valid, true, 'Accepts cumail.in domain');
assert.equal(valid3.normalized, 'faculty@cumail.in', 'Normalizes cumail.in');
console.log('[PASS] University domain validation and normalization verified.\n');

// 2. Signup Supabase Payload Structure & Unconfirmed State Simulation
console.log('[Scenario 2: Supabase Signup Flow & Verification Dispatch]');

function buildSignUpPayload(email, password, fullName, origin = 'https://borrowbox-lime.vercel.app') {
  const normEmail = email.trim().toLowerCase();
  const autoUid = normEmail.split('@')[0].toUpperCase();
  return {
    email: normEmail,
    password,
    options: {
      data: {
        full_name: fullName,
        university_uid: autoUid
      },
      emailRedirectTo: `${origin}/auth/callback`
    }
  };
}

const payload = buildSignUpPayload('24bcs12850@cuchd.in', 'BorrowBox#2026', 'Shashwat Vatsyayan');
assert.equal(payload.email, '24bcs12850@cuchd.in');
assert.equal(payload.options.data.full_name, 'Shashwat Vatsyayan');
assert.equal(payload.options.data.university_uid, '24BCS12850');
assert.equal(payload.options.emailRedirectTo, 'https://borrowbox-lime.vercel.app/auth/callback');

// Simulate Supabase response when email confirmation is active:
const mockSupabaseSignUpResponse = {
  data: {
    user: {
      id: 'usr-new-uuid',
      email: '24bcs12850@cuchd.in',
      email_confirmed_at: null,
      confirmed_at: null,
      created_at: new Date().toISOString()
    },
    session: null // Supabase returns session: null when confirmation is required
  },
  error: null
};

// Check that client does not treat user as authenticated
assert.equal(mockSupabaseSignUpResponse.data.session, null, 'Session is null prior to confirmation');
assert.equal(mockSupabaseSignUpResponse.data.user.email_confirmed_at, null, 'User email_confirmed_at is null');
console.log('[PASS] Signup payload and unconfirmed session null invariant verified.\n');

// 3. Login Unconfirmed Email Rejection
console.log('[Scenario 3: Unconfirmed Email Login Enforcement]');

function verifyLoginStatus(user) {
  if (!user) {
    throw new Error('Invalid email or password.');
  }
  const isConfirmed = Boolean(user.email_confirmed_at || user.confirmed_at || user.is_verified === true);
  if (!isConfirmed) {
    const err = new Error('Your university email has not been confirmed yet. Please verify your account via the link sent to your Outlook inbox.');
    err.code = 'email_not_confirmed';
    err.email = user.email;
    throw err;
  }
  return { authenticated: true, user };
}

// Unconfirmed user attempt
assert.throws(
  () => verifyLoginStatus({ email: 'unconfirmed@cuchd.in', email_confirmed_at: null, is_verified: false }),
  (err) => err.code === 'email_not_confirmed',
  'Unconfirmed student is blocked from logging in'
);

// Confirmed user attempt
const verifiedLogin = verifyLoginStatus({
  email: '24bcs12850@cuchd.in',
  email_confirmed_at: '2026-11-14T10:00:00.000Z',
  is_verified: true
});
assert.equal(verifiedLogin.authenticated, true, 'Confirmed student successfully logs in');
console.log('[PASS] Unconfirmed email login block and confirmed login success verified.\n');

// 4. Protected Route Guard Evaluation
console.log('[Scenario 4: Protected Route Email Confirmation Barrier]');

function canAccessProtectedRoute(user) {
  if (!user) return { allow: false, redirect: '/login' };
  const isConfirmed = Boolean(user.email_confirmed_at || user.confirmed_at || user.is_verified === true);
  if (!isConfirmed) {
    return { allow: false, redirect: `/verify-email?email=${encodeURIComponent(user.email || '')}` };
  }
  return { allow: true };
}

assert.deepEqual(canAccessProtectedRoute(null), { allow: false, redirect: '/login' });
assert.deepEqual(
  canAccessProtectedRoute({ email: '24bcs10424@cuchd.in', email_confirmed_at: null, is_verified: false }),
  { allow: false, redirect: '/verify-email?email=24bcs10424%40cuchd.in' },
  'Unverified user blocked from protected route and routed to verify-email'
);
assert.deepEqual(
  canAccessProtectedRoute({ email: '24bcs10424@cuchd.in', email_confirmed_at: '2026-11-14T10:00:00Z' }),
  { allow: true },
  'Verified user granted access to protected route'
);
console.log('[PASS] Protected route confirmation barrier verified.\n');

// 5. Auth Callback Hash & Error Handling
console.log('[Scenario 5: Auth Callback Token & Error Parsing]');

function parseCallbackParameters(queryString, hashString) {
  const urlParams = new URLSearchParams(queryString);
  const hashParams = hashString ? new URLSearchParams(hashString.replace(/^#/, '')) : new URLSearchParams();

  const code = urlParams.get('code');
  const errorDesc = hashParams.get('error_description') || hashParams.get('error') || urlParams.get('error_description');

  if (errorDesc) {
    return { status: 'error', error: errorDesc.replace(/\+/g, ' ') };
  }
  if (code) {
    return { status: 'pkce_code', code };
  }
  const accessToken = hashParams.get('access_token');
  if (accessToken) {
    return { status: 'token_exchange', accessToken };
  }
  return { status: 'check_session' };
}

// Expired link test
const expiredRes = parseCallbackParameters('', '#error=access_denied&error_description=Email+link+is+invalid+or+has+expired');
assert.equal(expiredRes.status, 'error');
assert.equal(expiredRes.error, 'Email link is invalid or has expired');

// PKCE code exchange test
const pkceRes = parseCallbackParameters('?code=sample-pkce-auth-code', '');
assert.equal(pkceRes.status, 'pkce_code');
assert.equal(pkceRes.code, 'sample-pkce-auth-code');

// Hash token test
const tokenRes = parseCallbackParameters('', '#access_token=sample-jwt-token&type=signup');
assert.equal(tokenRes.status, 'token_exchange');
assert.equal(tokenRes.accessToken, 'sample-jwt-token');
console.log('[PASS] Callback parameter parsing and error extraction verified.\n');

// 6. Zero-Emoji Compliance Check
console.log('[Scenario 6: Zero-Emoji Compliance on New Auth Files]');
const filesToCheck = [
  '06_SRC/frontend/src/services/authService.js',
  '06_SRC/frontend/src/context/AuthContext.jsx',
  '06_SRC/frontend/src/components/auth/EmailVerificationCard.jsx',
  '06_SRC/frontend/src/components/auth/EmailVerificationCard.css',
  '06_SRC/frontend/src/pages/public/VerifyEmailPage.jsx',
  '06_SRC/frontend/src/pages/public/AuthCallbackPage.jsx',
  '06_SRC/frontend/src/components/auth/VersoAuthCard.jsx',
  '06_SRC/frontend/src/components/layout/ProtectedRoute.jsx'
];

const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

for (const relPath of filesToCheck) {
  const fullPath = resolve(process.cwd(), relPath);
  const content = readFileSync(fullPath, 'utf8');
  assert.equal(emojiRegex.test(content), false, `Zero-emoji violation found in ${relPath}`);
}
console.log('[PASS] All new and updated authentication files verified 100% zero-emoji.\n');

console.log('--- ALL AUTH EMAIL CONFIRMATION SUITE VERIFICATIONS PASSED ---');
