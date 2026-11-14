/**
 * Verification test for Holographic Campus Pass Dynamic Name & Personalized Greeting
 */

import assert from 'node:assert';

// Mock localStorage and sessionStorage
const storage = new Map();
global.localStorage = {
  getItem: (k) => storage.get(k) || null,
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear()
};

import { generateStudentCardSvg } from '../../frontend/src/utils/studentCardArt.js';
import { enrichUserData, getStudentFirstName } from '../../frontend/src/utils/userEnricher.js';

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

console.log('=== HOLOGRAPHIC CARD NAME & GREETING TEST SUITE ===\n');

// 1. Personalized Greeting Computation Logic
const computeGreeting = (user) => `Hello ${getStudentFirstName(user)}`;

runTest('Greeting says "Hello Shashwat" when Shashwat Vatsyayan is logged in', () => {
  const user = { full_name: 'Shashwat Vatsyayan', email: 'shashwat@cuchd.in' };
  const greeting = computeGreeting(user);
  assert.strictEqual(greeting, 'Hello Shashwat');
});

runTest('Greeting says "Hello Aditi" when aditi logs in (lowercase handled)', () => {
  const user = { full_name: 'aditi', email: 'aditi@cuchd.in' };
  const greeting = computeGreeting(user);
  assert.strictEqual(greeting, 'Hello Aditi');
});

runTest('Greeting says "Hello Aditi" when Aditi Sharma logs in', () => {
  const user = { full_name: 'Aditi Sharma', email: 'aditi.sharma@cuchd.in' };
  const greeting = computeGreeting(user);
  assert.strictEqual(greeting, 'Hello Aditi');
});

runTest('Greeting properly resolves from Supabase user_metadata when full_name is in metadata', () => {
  const supabaseUser = {
    id: 'user-sb-1',
    email: '21bcs1001@cuchd.in',
    user_metadata: {
      full_name: 'Shashwat Vatsyayan'
    }
  };
  const greeting = computeGreeting(supabaseUser);
  assert.strictEqual(greeting, 'Hello Shashwat');
});

runTest('Greeting derives clean first name from university email if name not yet set', () => {
  const userWithoutName = {
    id: 'user-sb-2',
    email: 'aditi.verma@cuchd.in'
  };
  const greeting = computeGreeting(userWithoutName);
  assert.strictEqual(greeting, 'Hello Aditi');
});

// 2. AuthContext User Enrichment Tests
runTest('enrichUserData extracts full_name and UID from Supabase user_metadata', () => {
  const rawSupabaseUser = {
    id: 'sb-uuid-456',
    email: '21bcs9999@cuchd.in',
    user_metadata: {
      full_name: 'Shashwat Vatsyayan',
      university_uid: '21BCS9999'
    }
  };

  const enriched = enrichUserData(rawSupabaseUser);
  assert.strictEqual(enriched.full_name, 'Shashwat Vatsyayan');
  assert.strictEqual(enriched.university_uid, '21BCS9999');
});

runTest('enrichUserData merges edited profile from local DB when updated', () => {
  const localDB = {
    users: [
      {
        id: 'user-aditi-789',
        email: 'aditi@cuchd.in',
        full_name: 'Aditi Sharma',
        university_uid: '22BCS14000',
        department: 'Department of Computer Science & Engineering'
      }
    ],
    items: []
  };
  localStorage.setItem('borrowbox_prod_v1', JSON.stringify(localDB));

  const rawUser = {
    id: 'user-aditi-789',
    email: 'aditi@cuchd.in'
  };

  const enriched = enrichUserData(rawUser);
  assert.strictEqual(enriched.full_name, 'Aditi Sharma');
  assert.strictEqual(enriched.university_uid, '22BCS14000');
});

// 3. Holographic Card SVG Generation with Student Name
runTest('Holographic Card SVG displays student name "Shashwat Vatsyayan"', () => {
  const dataUrl = generateStudentCardSvg({
    fullName: 'Shashwat Vatsyayan',
    uid: '21BCS9999',
    email: '21bcs9999@cuchd.in',
    department: 'Computer Science & Engineering'
  });
  const svg = decodeURIComponent(dataUrl);

  assert(svg.includes('Shashwat Vatsyayan'), 'Card SVG must contain the student name Shashwat Vatsyayan');
  assert(svg.includes('UID: 21BCS9999'), 'Card SVG must contain the student UID');
  assert(!svg.includes('Student User'), 'Card SVG must not contain default generic fallback');
});

runTest('Holographic Card SVG displays student name "Aditi Sharma"', () => {
  const dataUrl = generateStudentCardSvg({
    fullName: 'Aditi Sharma',
    uid: '22BCS14000',
    email: 'aditi.sharma@cuchd.in',
    department: 'Computer Science & Engineering'
  });
  const svg = decodeURIComponent(dataUrl);

  assert(svg.includes('Aditi Sharma'), 'Card SVG must contain the student name Aditi Sharma');
  assert(svg.includes('UID: 22BCS14000'), 'Card SVG must contain the student UID');
});

runTest('Holographic Card dynamically updates when profile name is changed', () => {
  // Initial profile card
  const initialCard = decodeURIComponent(generateStudentCardSvg({
    fullName: 'Aditi',
    email: 'aditi@cuchd.in'
  }));
  assert(initialCard.includes('Aditi'));

  // User edits profile to add surname
  const updatedCard = decodeURIComponent(generateStudentCardSvg({
    fullName: 'Aditi Sharma',
    email: 'aditi@cuchd.in'
  }));
  assert(updatedCard.includes('Aditi Sharma'));
});

runTest('Holographic Card adjusts font size for long names to avoid layout overflow', () => {
  const longName = 'Shashwatharyavrat Vatsyayan';
  const svg = decodeURIComponent(generateStudentCardSvg({
    fullName: longName,
    email: 'longname@cuchd.in'
  }));

  assert(svg.includes(longName));
  // Long names use font-size="22" or "26" instead of "30" or "32"
  assert(svg.includes('font-size="22"'));
});

console.log(`\n=== SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) process.exit(1);
