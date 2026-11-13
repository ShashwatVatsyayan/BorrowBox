/**
 * Automated test suite for BorrowBox password validation rules.
 * Requirements:
 * - At least 8 letters long
 * - At least one capital letter (A-Z)
 * - At least one small letter (a-z)
 * - At least one special character
 * - At least one number (0-9)
 */

import { validatePassword, getPasswordCriteria } from '../../frontend/src/utils/validators.js';

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
  console.log(`[PASS] ${message}`);
  passedCount++;
}

console.log('--- RUNNING PASSWORD VALIDATOR TEST SUITE ---');

// Test 1: Empty or null password
const t1 = validatePassword('');
assert(!t1.valid && t1.error === 'Password is required.', 'Rejects empty password');

const t1b = validatePassword(null);
assert(!t1b.valid && t1b.error === 'Password is required.', 'Rejects null password');

// Test 2: Less than 8 characters (even if has upper, lower, num, special)
const t2 = validatePassword('Aa1!bcd'); // 7 chars
assert(!t2.valid && t2.error.includes('8 characters'), 'Rejects password shorter than 8 characters (7 chars)');

// Test 3: Missing capital letter
const t3 = validatePassword('password123!');
assert(!t3.valid && t3.error.includes('capital letter'), 'Rejects password without uppercase letter');

// Test 4: Missing small letter
const t4 = validatePassword('PASSWORD123!');
assert(!t4.valid && t4.error.includes('small letter'), 'Rejects password without lowercase letter');

// Test 5: Missing number
const t5 = validatePassword('Password!@#$');
assert(!t5.valid && t5.error.includes('number'), 'Rejects password without number');

// Test 6: Missing special character
const t6 = validatePassword('Password123');
assert(!t6.valid && t6.error.includes('special character'), 'Rejects password without special character');

// Test 7: Valid passwords meeting all 5 requirements
const validCases = [
  'BorrowBox#2026',
  'P@ssword1',
  'ChandigarhUniv#24',
  'Student@123',
  'Pass_word99',
  'Admin$999!',
  'CuChd.in#2026'
];

for (const pass of validCases) {
  const result = validatePassword(pass);
  assert(result.valid === true, `Accepts valid password: "${pass}"`);
}

// Test 8: getPasswordCriteria breakdown
const crit = getPasswordCriteria('Ab1!');
assert(crit.minLength === false, 'Criteria reports minLength false for 4 chars');
assert(crit.hasUpper === true, 'Criteria reports hasUpper true');
assert(crit.hasLower === true, 'Criteria reports hasLower true');
assert(crit.hasNumber === true, 'Criteria reports hasNumber true');
assert(crit.hasSpecial === true, 'Criteria reports hasSpecial true');

console.log(`\nALL ${passedCount}/${totalCount} PASSWORD VALIDATOR TESTS PASSED.`);
