export const CATEGORIES = [
  'Clothes & Formals',
  'Shoes & Footwear',
  'Electronics & Gadgets',
  'Hostel & Room Essentials',
  'Textbooks & Notes',
  'Lab & Safety Equipment',
  'Sports & Fitness',
  'Tools & Hardware',
  'Stationery & Drafting',
  'Other'
];

export const LISTING_TYPES = [
  {
    id: 'borrow',
    label: 'Lend for Borrowing',
    badge: 'Available to Borrow',
    color: 'emerald',
    description: 'Temporary lending with scheduled return date'
  },
  {
    id: 'trade',
    label: 'Available for Trade / Barter',
    badge: 'Open for Trade',
    color: 'amber',
    description: 'Exchange or barter for other clothes, shoes, electronics, or gear'
  },
  {
    id: 'wanted',
    label: 'Wanted Request',
    badge: 'Looking for Item',
    color: 'emerald',
    description: 'Ask campus peers if anyone has this item available'
  }
];

export const LENDING_DURATIONS = [
  'A few hours (Same Day Return)',
  '1 - 3 Days (Weekend / Quick Need)',
  'Up to 1 Week (Standard Borrowing)',
  '2 Weeks (Exam Preparation)',
  '1 Month (Project Work)',
  'Flexible / Contact to Discuss'
];

export const CONDITIONS = [
  'Like New',
  'Good',
  'Fair',
  'Well Used'
];

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  RETURN_PENDING: 'return_pending',
  COMPLETED: 'completed'
};

export const REPORT_REASONS = [
  'Inappropriate Content',
  'Item Never Returned',
  'Item Damaged',
  'Misleading Description',
  'Harassment or Spam',
  'Other'
];

export const DEFAULT_ALLOWED_DOMAINS = ['cuchd.in', 'cumail.in'];
