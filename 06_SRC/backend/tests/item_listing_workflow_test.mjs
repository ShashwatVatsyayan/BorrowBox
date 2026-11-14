/**
 * Integration Test for Item Listing with 4 Photos
 * Tests image compression handling, validation, auth session fallback,
 * persistence in local/hybrid repository, and visibility in Explore and My Listings.
 */

import assert from 'node:assert';

// Mock localStorage and sessionStorage for Node runtime
const storage = new Map();
global.localStorage = {
  getItem: (k) => storage.get(k) || null,
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear()
};

const sessionStore = new Map();
global.sessionStorage = {
  getItem: (k) => sessionStore.get(k) || null,
  setItem: (k, v) => sessionStore.set(k, String(v)),
  removeItem: (k) => sessionStore.delete(k),
  clear: () => sessionStore.clear()
};

// Import services and validators
import { validateItemForm, validateRentalPrice } from '../../frontend/src/utils/validators.js';
import { itemService } from '../../frontend/src/services/itemService.js';
import { authService } from '../../frontend/src/services/authService.js';
import { getLocalDB, resetLocalDB } from '../../frontend/src/lib/supabase.js';

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

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

console.log('=== BORROWBOX ITEM LISTING WORKFLOW VERIFICATION ===\n');

// 1. Validation Tests
runTest('ItemForm validation rejects fewer than 4 photos', () => {
  const invalidListing = {
    title: 'Casio fx-991CW Calculator',
    description: 'High-speed scientific calculator for campus exams and classes.',
    category: 'Scientific Calculators',
    condition: 'Like New',
    location_label: 'Block B3 Central Library',
    daily_price: 20,
    listing_type: 'rent',
    images: ['photo1.jpg', 'photo2.jpg'] // Only 2 photos
  };

  const result = validateItemForm(invalidListing);
  assert.strictEqual(result.valid, false);
  assert(result.errors.images.includes('at least 4 photos'));
});

runTest('ItemForm validation accepts exactly 4 valid photos', () => {
  const validListing = {
    title: 'Casio fx-991CW Calculator',
    description: 'High-speed scientific calculator for campus exams and classes.',
    category: 'Scientific Calculators',
    condition: 'Like New',
    location_label: 'Block B3 Central Library',
    daily_price: 20,
    listing_type: 'rent',
    images: [
      'data:image/jpeg;base64,sampleAngleTop',
      'data:image/jpeg;base64,sampleAngleBottom',
      'data:image/jpeg;base64,sampleAngleLeftSide',
      'data:image/jpeg;base64,sampleAngleRightSide'
    ]
  };

  const result = validateItemForm(validListing);
  assert.strictEqual(result.valid, true);
  assert.strictEqual(Object.keys(result.errors).length, 0);
});

runTest('ItemForm validation rejects arrays with empty slots', () => {
  const listingWithEmptySlots = {
    title: 'Casio fx-991CW Calculator',
    description: 'High-speed scientific calculator for campus exams and classes.',
    category: 'Scientific Calculators',
    condition: 'Like New',
    location_label: 'Block B3 Central Library',
    daily_price: 20,
    listing_type: 'rent',
    images: ['photo1.jpg', '', 'photo3.jpg', '   '] // 2 empty slots
  };

  const result = validateItemForm(listingWithEmptySlots);
  assert.strictEqual(result.valid, false);
  assert(result.errors.images);
});

// 2. Auth Session Fallback Test
await runAsyncTest('Auth session properly resolves from local session storage when Supabase is unconfigured/empty', async () => {
  // Set up student user session in CURRENT_USER_SESSION_KEY
  const studentUser = {
    id: 'user-cuchd-12345',
    email: '21bcs9999@cuchd.in',
    full_name: 'Shashwat Vatsyayan',
    university_uid: '21BCS9999',
    role: 'student',
    is_verified: true
  };

  localStorage.setItem('borrowbox_auth_session', JSON.stringify({
    user: studentUser,
    access_token: 'test-student-token'
  }));

  const user = await authService.getUser();
  assert(user, 'User should not be null');
  assert.strictEqual(user.id, 'user-cuchd-12345');
  assert.strictEqual(user.email, '21bcs9999@cuchd.in');
});

// 3. Item Creation with 4 Photos
let createdItemId = null;
await runAsyncTest('itemService.createItem successfully creates listing with 4 photos', async () => {
  const itemPayload = {
    title: 'Casio fx-991CW ClassWiz Scientific Calculator',
    description: 'Latest natural textbook display with 540+ functions. Required for math and physics.',
    category: 'Scientific Calculators',
    condition: 'Like New',
    location_label: 'Academic Block B-3 First Floor',
    listing_type: 'rent',
    daily_price: 20,
    rental_durations: ['1 day', '3 days', '7 days'],
    discount_3d: 5,
    discount_7d: 10,
    images: [
      'data:image/jpeg;base64,topViewAngle1',
      'data:image/jpeg;base64,bottomViewAngle2',
      'data:image/jpeg;base64,leftSideAngle3',
      'data:image/jpeg;base64,rightSideAngle4'
    ]
  };

  const created = await itemService.createItem(itemPayload);
  assert(created, 'Created item must be returned');
  assert(created.id, 'Item must have an id');
  assert.strictEqual(created.owner_id, 'user-cuchd-12345');
  assert.strictEqual(created.images.length, 4);
  assert.strictEqual(created.daily_price, 20);
  assert.strictEqual(created.is_active, true);

  createdItemId = created.id;
});

// 4. Verification in Explore Feed and Queries
await runAsyncTest('Created item appears immediately at top of getItems()', async () => {
  const allItems = await itemService.getItems();
  assert(allItems.length > 0, 'Items list should not be empty');

  const topItem = allItems[0];
  assert.strictEqual(topItem.id, createdItemId, 'Newly created item must be at index 0');
  assert.strictEqual(topItem.images.length, 4, 'Must retain all 4 angle photos');
  assert(topItem.owner, 'Owner info should be populated');
  assert.strictEqual(topItem.owner.full_name, 'Shashwat Vatsyayan');
});

await runAsyncTest('Created item is returned in My Listings query (ownerId filter)', async () => {
  const myListings = await itemService.getItems({ ownerId: 'user-cuchd-12345', includeInactive: true });
  assert(myListings.length >= 1, 'My listings must return the newly created item');
  const found = myListings.find((i) => i.id === createdItemId);
  assert(found, 'Item must be present in user listings');
  assert.strictEqual(found.images.length, 4);
});

await runAsyncTest('Created item is retrievable via getItemById()', async () => {
  const item = await itemService.getItemById(createdItemId);
  assert(item, 'Item must be found');
  assert.strictEqual(item.id, createdItemId);
  assert.strictEqual(item.title, 'Casio fx-991CW ClassWiz Scientific Calculator');
  assert.strictEqual(item.images.length, 4);
  assert.strictEqual(item.images[0], 'data:image/jpeg;base64,topViewAngle1');
  assert.strictEqual(item.images[1], 'data:image/jpeg;base64,bottomViewAngle2');
  assert.strictEqual(item.images[2], 'data:image/jpeg;base64,leftSideAngle3');
  assert.strictEqual(item.images[3], 'data:image/jpeg;base64,rightSideAngle4');
});

// 5. Item Update and Deactivation
await runAsyncTest('itemService.updateItem updates listing details and images', async () => {
  const updated = await itemService.updateItem(createdItemId, {
    title: 'Casio fx-991CW Calculator (Exam Tested)',
    daily_price: 22
  });

  assert.strictEqual(updated.title, 'Casio fx-991CW Calculator (Exam Tested)');
  assert.strictEqual(updated.daily_price, 22);
  assert.strictEqual(updated.images.length, 4, 'Images should persist across updates');
});

await runAsyncTest('itemService.toggleActive toggles item active status', async () => {
  const toggled = await itemService.toggleActive(createdItemId);
  assert.strictEqual(toggled.is_active, false, 'Item should be deactivated');

  const toggledBack = await itemService.toggleActive(createdItemId);
  assert.strictEqual(toggledBack.is_active, true, 'Item should be reactivated');
});

// 6. Admin Account Listing Test
await runAsyncTest('Admin user BorrowBoxAdmin@cuchd.in can list items with 4 photos', async () => {
  // Switch session to Admin
  const adminUser = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'BorrowBoxAdmin@cuchd.in',
    full_name: 'BorrowBox Administrator',
    university_uid: 'ADMIN-CU',
    role: 'admin',
    is_verified: true
  };

  localStorage.setItem('borrowbox_auth_session', JSON.stringify({
    user: adminUser,
    access_token: 'admin-token'
  }));

  const adminItem = await itemService.createItem({
    title: 'Official Campus Lab Multimeter & Probes',
    description: 'Precision digital multimeter with test leads and thermocouple for electronics lab practicals.',
    category: 'Lab Equipment',
    condition: 'Like New',
    location_label: 'Block A Electronics Workshop',
    listing_type: 'rent',
    daily_price: 25,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'
    ]
  });

  assert(adminItem, 'Admin item should be created');
  assert.strictEqual(adminItem.owner_id, '00000000-0000-0000-0000-000000000001');

  const items = await itemService.getItems();
  assert.strictEqual(items[0].id, adminItem.id);
  assert.strictEqual(items[0].owner.full_name, 'BorrowBox Administrator');
});

console.log(`\n=== SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) process.exit(1);

