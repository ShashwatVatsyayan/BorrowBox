/**
 * Automated Verification Suite for Social Features:
 * 1. Liking / unliking items & count integrity
 * 2. Questions & Comments persistence and owner notifications
 * 3. Save for later bookmarking
 * 4. Automatic peer notification when saved items are borrowed or traded
 */

import assert from 'node:assert';

console.log('--- STARTING SOCIAL INTERACTIONS & SAVED ITEM NOTIFICATIONS TEST SUITE ---');

// Mock database simulating Supabase / Local storage state
const db = {
  users: [
    { id: 'usr-owner', full_name: 'Aarav Sharma', university_email: 'aarav.sharma@cuchd.in' },
    { id: 'usr-saver1', full_name: 'Priya Patel', university_email: 'priya.patel@cuchd.in' },
    { id: 'usr-saver2', full_name: 'Rohan Verma', university_email: 'rohan.verma@cuchd.in' },
    { id: 'usr-borrower', full_name: 'Neha Gupta', university_email: 'neha.gupta@cuchd.in' }
  ],
  items: [
    {
      id: 'item-navy-blazer',
      owner_id: 'usr-owner',
      title: 'Formal Navy Blue Blazer (Size 38)',
      category: 'Clothes & Formals',
      condition: 'Like New',
      location_label: 'Boys Hostel 3 (BH-3)',
      listing_type: 'borrow',
      lending_duration: '1 - 3 Days',
      is_active: true
    },
    {
      id: 'item-casio-calc',
      owner_id: 'usr-owner',
      title: 'Casio fx-991CW Scientific Calculator',
      category: 'Electronics & Gadgets',
      condition: 'Excellent',
      location_label: 'Block B-1',
      listing_type: 'trade',
      trade_preference: 'Graphic tablet or drafter',
      is_active: true
    }
  ],
  likes: [],
  comments: [],
  saved_items: [],
  requests: [],
  notifications: []
};

function pass(msg) {
  console.log(`[PASS] ${msg}`);
}

// 1. Test Like and Unlike
console.log('\n[Scenario 1: Like and Unlike]');
function toggleLike(userId, itemId) {
  const existingIndex = db.likes.findIndex((l) => l.item_id === itemId && l.user_id === userId);
  let liked = false;
  if (existingIndex !== -1) {
    db.likes.splice(existingIndex, 1);
    liked = false;
  } else {
    db.likes.push({
      id: `like-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      item_id: itemId,
      user_id: userId,
      created_at: new Date().toISOString()
    });
    liked = true;
  }
  const count = db.likes.filter((l) => l.item_id === itemId).length;
  return { liked, count };
}

const like1 = toggleLike('usr-saver1', 'item-navy-blazer');
assert.strictEqual(like1.liked, true, 'First like should return liked: true');
assert.strictEqual(like1.count, 1, 'Like count should be 1');
pass('User liked item successfully');

const like2 = toggleLike('usr-saver2', 'item-navy-blazer');
assert.strictEqual(like2.liked, true);
assert.strictEqual(like2.count, 2, 'Like count should be 2 after second user');
pass('Second user liked item, total count is 2');

const unlike1 = toggleLike('usr-saver1', 'item-navy-blazer');
assert.strictEqual(unlike1.liked, false, 'Unliking should return liked: false');
assert.strictEqual(unlike1.count, 1, 'Like count should decrease to 1');
pass('First user unliked item, count decreased back to 1');

// 2. Test Comments and Owner Notifications
console.log('\n[Scenario 2: Campus Questions & Comments]');
function addComment(userId, itemId, text) {
  const user = db.users.find((u) => u.id === userId);
  const item = db.items.find((i) => i.id === itemId);
  assert(user, 'User must exist');
  assert(item, 'Item must exist');
  assert(text && text.trim(), 'Comment text cannot be empty');

  const comment = {
    id: `cmt-${Date.now()}`,
    item_id: itemId,
    user_id: userId,
    user_name: user.full_name,
    text: text.trim(),
    created_at: new Date().toISOString()
  };
  db.comments.push(comment);

  if (item.owner_id !== userId) {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: item.owner_id,
      title: 'New Question on Your Listing',
      message: `${user.full_name} commented on "${item.title}": "${text.trim().slice(0, 80)}"`,
      type: 'item_comment',
      related_item_id: itemId,
      is_read: false,
      created_at: new Date().toISOString()
    });
  }
  return comment;
}

const comment1 = addComment('usr-saver1', 'item-navy-blazer', 'Does this fit someone who is 5ft 9in?');
assert.strictEqual(comment1.user_name, 'Priya Patel');
assert.strictEqual(db.comments.length, 1);
const ownerNotif = db.notifications.find((n) => n.user_id === 'usr-owner' && n.type === 'item_comment');
assert(ownerNotif, 'Item owner must receive a notification for the comment');
assert(ownerNotif.message.includes('5ft 9in'), 'Notification must include excerpt of comment');
assert.strictEqual(ownerNotif.related_item_id, 'item-navy-blazer', 'Notification must link to item');
pass('Comment added and owner notified successfully');

// 3. Test Save for Later
console.log('\n[Scenario 3: Save for Later]');
function toggleSave(userId, itemId) {
  const existingIndex = db.saved_items.findIndex((s) => s.item_id === itemId && s.user_id === userId);
  let saved = false;
  if (existingIndex !== -1) {
    db.saved_items.splice(existingIndex, 1);
    saved = false;
  } else {
    db.saved_items.push({
      id: `save-${Date.now()}`,
      item_id: itemId,
      user_id: userId,
      created_at: new Date().toISOString()
    });
    saved = true;
  }
  return { saved };
}

const saveRes1 = toggleSave('usr-saver1', 'item-navy-blazer');
assert.strictEqual(saveRes1.saved, true);
const saveRes2 = toggleSave('usr-saver2', 'item-navy-blazer');
assert.strictEqual(saveRes2.saved, true);
const saveRes3 = toggleSave('usr-saver1', 'item-casio-calc');
assert.strictEqual(saveRes3.saved, true);
pass('Priya and Rohan saved blazer; Priya saved calculator');

// 4. Test Notification on Item Borrow / Trade Approval
console.log('\n[Scenario 4: Saved Item Alerts on Borrow / Trade Approval]');
function approveRequest(ownerId, requestId) {
  const req = db.requests.find((r) => r.id === requestId);
  assert(req, 'Request not found');
  const item = db.items.find((i) => i.id === req.item_id);
  assert(item, 'Item not found');
  assert.strictEqual(item.owner_id, ownerId, 'Only owner can approve');

  req.status = 'approved';

  // Notify borrower
  db.notifications.unshift({
    id: `notif-${Date.now()}-borrower`,
    user_id: req.borrower_id,
    title: 'Request Approved!',
    message: `Your request for "${item.title}" was approved.`,
    type: 'request_approved',
    related_item_id: item.id,
    is_read: false,
    created_at: new Date().toISOString()
  });

  // Notify all students who saved this item
  const savers = db.saved_items.filter((s) => s.item_id === item.id && s.user_id !== req.borrower_id && s.user_id !== item.owner_id);
  const actionType = item.listing_type === 'trade' ? 'traded' : 'borrowed';

  savers.forEach((s) => {
    db.notifications.unshift({
      id: `notif-${Date.now()}-${s.user_id}`,
      user_id: s.user_id,
      title: `Saved Item Update: "${item.title}"`,
      message: `An item you saved for later ("${item.title}") has just been ${actionType} by another student on campus.`,
      type: 'saved_item_borrowed',
      related_item_id: item.id,
      is_read: false,
      created_at: new Date().toISOString()
    });
  });
}

// Create a borrow request for the blazer by Neha Gupta
db.requests.push({
  id: 'req-blazer-1',
  item_id: 'item-navy-blazer',
  borrower_id: 'usr-borrower',
  start_date: '2026-11-20',
  end_date: '2026-11-23',
  status: 'pending'
});

// Owner Aarav approves Neha's request
approveRequest('usr-owner', 'req-blazer-1');

// Verify that Priya (usr-saver1) and Rohan (usr-saver2) received the alert notification!
const priyaSavedAlert = db.notifications.find(
  (n) => n.user_id === 'usr-saver1' && n.type === 'saved_item_borrowed' && n.related_item_id === 'item-navy-blazer'
);
assert(priyaSavedAlert, 'Priya must receive saved item borrowed notification');
assert(priyaSavedAlert.message.includes('has just been borrowed by another student on campus'));
pass('Priya received saved item borrowed alert: ' + priyaSavedAlert.message);

const rohanSavedAlert = db.notifications.find(
  (n) => n.user_id === 'usr-saver2' && n.type === 'saved_item_borrowed' && n.related_item_id === 'item-navy-blazer'
);
assert(rohanSavedAlert, 'Rohan must receive saved item borrowed notification');
pass('Rohan received saved item borrowed alert');

// Verify borrower Neha did not receive the "saved item" alert, only the approval alert
const nehaSavedAlert = db.notifications.find(
  (n) => n.user_id === 'usr-borrower' && n.type === 'saved_item_borrowed'
);
assert.strictEqual(nehaSavedAlert, undefined, 'Borrower should not receive saved item alert');
pass('Borrower did not receive duplicate saver alert');

console.log('\n--- ALL SOCIAL INTERACTIONS & NOTIFICATION TESTS PASSED SUCCESSFULLY ---');

