export const RENTAL_CATEGORIES = [
  'Books & Textbooks',
  'Stationery',
  'Scientific Calculators',
  'Lab Equipment',
  'Sports Equipment',
  'Electronics & Accessories',
  'Photography Equipment',
  'Project Tools'
];

export const CATEGORIES = [
  'Books & Textbooks',
  'Stationery',
  'Scientific Calculators',
  'Lab Equipment',
  'Sports Equipment',
  'Electronics & Accessories',
  'Photography Equipment',
  'Project Tools',
  // Backward compatibility aliases
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

export const CATEGORY_PRICE_LIMITS = {
  'Books & Textbooks': 15,
  'Stationery': 10,
  'Scientific Calculators': 25,
  'Lab Equipment': 30,
  'Sports Equipment': 40,
  'Electronics & Accessories': 75,
  'Photography Equipment': 100,
  'Project Tools': 50,
  // Backward compatibility aliases
  'Textbooks & Notes': 15,
  'Stationery & Drafting': 10,
  'Lab & Safety Equipment': 30,
  'Sports & Fitness': 40,
  'Electronics & Gadgets': 75,
  'Tools & Hardware': 50,
  'Clothes & Formals': 35,
  'Shoes & Footwear': 30,
  'Hostel & Room Essentials': 25,
  'Other': 30
};

export const MIN_RENTAL_PRICE = 5;
export const DEFAULT_COMMISSION_PERCENTAGE = 20;

export const RENTAL_DURATIONS = [
  { id: '1d', label: '1 Day', days: 1, defaultDiscount: 0 },
  { id: '3d', label: '3 Days', days: 3, defaultDiscount: 5 },
  { id: '7d', label: '7 Days', days: 7, defaultDiscount: 10 },
  { id: '14d', label: '14 Days', days: 14, defaultDiscount: 15 },
  { id: 'custom', label: 'Custom Duration', days: null, defaultDiscount: 0 }
];

export const LISTING_TYPES = [
  {
    id: 'rent',
    label: 'List for Rent',
    badge: 'Available for Rent',
    color: 'emerald',
    description: 'Rent your item to campus peers and earn income'
  },
  {
    id: 'wanted',
    label: 'Request an Item',
    badge: 'Requested Item',
    color: 'emerald',
    description: 'Request an item you need to rent with your daily budget'
  },
  {
    id: 'trade',
    label: 'Available for Trade / Barter',
    badge: 'Open for Trade',
    color: 'amber',
    description: 'Exchange or trade items directly with student peers'
  }
];

export const LENDING_DURATIONS = [
  '1 Day',
  '3 Days',
  '7 Days (1 Week)',
  '14 Days (2 Weeks)',
  'Custom Duration'
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
  PAID: 'paid',
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
