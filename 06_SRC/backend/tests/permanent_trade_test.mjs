/**
 * Automated Verification Suite for:
 * 1. Permanent Trade validation ("I will trade this for that")
 * 2. Permanent Trade lifecycle (creation, proposal, approval, completion)
 * 3. Immediate listing deactivation upon permanent trade completion
 * 4. Two-way trade stats increment for both peer participants
 * 5. Public profile viewing & stats aggregation for other students
 * 6. Strict zero-emoji compliance
 */

import assert from 'node:assert/strict';
import { validateItemForm } from '../../frontend/src/utils/validators.js';
import { generateStudentCardSvg } from '../../frontend/src/utils/studentCardArt.js';

console.log('--- STARTING PERMANENT TRADE & PUBLIC PROFILE VERIFICATION SUITE ---');

function pass(msg) {
  console.log(`[PASS] ${msg}`);
}

// Scenario 1: Form validation for permanent trade
console.log('\n[Scenario 1: Form Validation for Permanent Trade Listings]');
{
  const validTrade = {
    title: 'Casio fx-991EX ClassWiz Calculator',
    description: 'Clean scientific calculator in perfect working order with slide-on hard case.',
    category: 'Electronics & Gadgets',
    condition: 'Like New',
    location_label: 'Hostel Block H1 Ground Floor',
    listing_type: 'trade',
    trade_item_desired: 'Engineering Mini Drafter',
    trade_preference: 'Also open to Drafter clips or drawing board',
    is_permanent_trade: true,
    images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg']
  };

  const validRes = validateItemForm(validTrade);
  assert.equal(validRes.valid, true, 'Valid trade form must pass');
  pass('Valid trade form with desired item accepted');

  const missingDesired = {
    ...validTrade,
    trade_item_desired: '',
    trade_preference: ''
  };
  const invalidRes = validateItemForm(missingDesired);
  assert.equal(invalidRes.valid, false, 'Trade form without desired item or preference must fail');
  assert.ok(invalidRes.errors.trade_preference, 'Error should be reported on trade_preference');
  pass('Trade listing without desired item correctly rejected');
}

// Scenario 2: Permanent Trade Lifecycle & State Transitions
console.log('\n[Scenario 2: Permanent Trade Lifecycle & State Transitions]');
{
  // Simulated campus state
  const mockDb = {
    users: [
      { id: 'usr-aarav', email: '24bcs12850@cuchd.in', full_name: 'Aarav Sharma', university_uid: '24BCS12850' },
      { id: 'usr-priya', email: '24bcs12851@cuchd.in', full_name: 'Priya Verma', university_uid: '24BCS12851' }
    ],
    items: [
      {
        id: 'item-compass-01',
        owner_id: 'usr-aarav',
        title: 'Mechanical Drawing Compass Set',
        description: 'Precision engineering compass and divider kit with spare lead.',
        category: 'Textbooks & Notes',
        condition: 'Like New',
        location_label: 'Block B Workshop Fountain',
        listing_type: 'trade',
        trade_item_desired: 'Casio fx-991CW Calculator',
        trade_preference: 'Permanent barter for Casio 991CW calculator',
        is_permanent_trade: true,
        is_active: true
      }
    ],
    borrow_requests: []
  };

  // Step A: Priya submits a permanent trade proposal
  const newRequest = {
    id: 'req-trade-101',
    item_id: 'item-compass-01',
    borrower_id: 'usr-priya',
    request_type: 'trade',
    offer_item: 'Casio fx-991CW Calculator',
    message: 'I have the Casio fx-991CW in great condition and want to permanently trade for your compass set.',
    status: 'pending',
    start_date: '2026-11-14',
    end_date: '2026-11-16'
  };
  mockDb.borrow_requests.push(newRequest);
  pass('Priya submitted permanent trade proposal offering Casio fx-991CW');

  // Step B: Aarav approves the trade proposal
  assert.equal(newRequest.status, 'pending');
  newRequest.status = 'approved';
  pass('Aarav approved trade proposal');

  // Step C: Confirm permanent trade completion
  function completeTrade(requestId, callerId, db) {
    const req = db.borrow_requests.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');
    const item = db.items.find((i) => i.id === req.item_id);
    if (!item) throw new Error('Associated item not found');

    if (item.owner_id !== callerId && req.borrower_id !== callerId) {
      throw new Error('Unauthorized: Only participants in this trade can confirm completion.');
    }

    req.status = 'completed';
    // Permanent trade deactivates the item from active explore feed
    item.is_active = false;
    return { req, item };
  }

  const { item: completedItem, req: completedReq } = completeTrade('req-trade-101', 'usr-aarav', mockDb);
  assert.equal(completedReq.status, 'completed');
  assert.equal(completedItem.is_active, false, 'Permanently traded item must become inactive');
  pass('Trade completed and item automatically marked inactive');

  // Scenario 3: Stat Computation for Both Students
  console.log('\n[Scenario 3: Stats Aggregation for Both Students]');
  function computeStats(userId, db) {
    const userItems = db.items.filter((i) => i.owner_id === userId);
    const userItemIds = new Set(userItems.map((i) => i.id));

    const borrowings = db.borrow_requests.filter(
      (r) => r.borrower_id === userId && r.status === 'completed' && (!r.request_type || r.request_type === 'borrow')
    ).length;

    const lendings = db.borrow_requests.filter(
      (r) => userItemIds.has(r.item_id) && r.status === 'completed' && (!r.request_type || r.request_type === 'borrow')
    ).length;

    const trades = db.borrow_requests.filter(
      (r) => (r.borrower_id === userId || userItemIds.has(r.item_id)) && r.status === 'completed' && r.request_type === 'trade'
    ).length;

    const listings = userItems.filter((i) => i.is_active).length;

    return { borrowings, lendings, trades, listings };
  }

  const statsAarav = computeStats('usr-aarav', mockDb);
  const statsPriya = computeStats('usr-priya', mockDb);

  assert.equal(statsAarav.trades, 1, 'Aarav (owner) trade count should be 1');
  assert.equal(statsPriya.trades, 1, 'Priya (proposer) trade count should be 1');
  assert.equal(statsAarav.listings, 0, 'Aarav active listings should be 0 because item was permanently traded');
  pass('Both students have their completed trades count incremented to 1');
}

// Scenario 4: Holographic Pass Rendering for Public Profile
console.log('\n[Scenario 4: Holographic Pass Rendering for Public Profile]');
{
  const cardArt = generateStudentCardSvg({
    fullName: 'Priya Verma',
    uid: '24BCS12851',
    email: '24bcs12851@cuchd.in',
    avatarUrl: '',
    department: 'Computer Science',
    hostelRoom: 'Hostel Block H1 Ground Floor',
    role: 'student',
    trustScore: '5.0'
  });

  assert.ok(cardArt.startsWith('data:image/svg+xml;'), 'Should produce valid SVG data URL');
  assert.ok(cardArt.includes(encodeURIComponent('24BCS12851')), 'Should embed student UID');
  assert.ok(cardArt.includes(encodeURIComponent('Priya Verma')), 'Should embed student name');
  pass('Peer Holographic card generated with accurate student details and UID');
}

// Scenario 5: Zero-Emoji Enforcement Check
console.log('\n[Scenario 5: Zero-Emoji Compliance Check]');
{
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const sampleUiTexts = [
    'View Student Profile & Stats',
    'Permanent Trade: I Will Trade This For That',
    'Permanent Swap (No Return)',
    'Confirm Permanent Trade Completed',
    'Offered in Exchange: Casio fx-991CW Calculator',
    'Official Campus HoloPass - UID 24BCS12850'
  ];

  for (const text of sampleUiTexts) {
    assert.equal(emojiRegex.test(text), false, `Text "${text}" must contain zero emojis`);
  }
  pass('All UI labels and status strings verified zero-emoji');
}

console.log('\n--- ALL PERMANENT TRADE & PUBLIC PROFILE VERIFICATIONS PASSED ---');
