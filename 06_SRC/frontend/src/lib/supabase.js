import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Real client when credentials exist
export const supabaseReal = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// DETERMINISTIC LOCAL REPOSITORY (FALLBACK & DEMO)
// Ensures 100% offline functionality and class demo readiness
// ==========================================

const LOCAL_STORAGE_KEY = 'borrowbox_prod_v1';

const INITIAL_SEED = {
  users: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'BorrowBoxAdmin@cuchd.in',
      full_name: 'BorrowBox Administrator',
      university_uid: 'ADMIN-CU',
      role: 'admin',
      is_verified: true,
      email_confirmed_at: '2026-11-14T00:00:00.000Z',
      avatar_url: '',
      bio: 'BorrowBox Campus Operations & Security Administrator',
      department: 'Department of Computer Science & Engineering',
      created_at: new Date().toISOString()
    }
  ],
  items: [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      owner_id: '00000000-0000-0000-0000-000000000001',
      title: 'Casio fx-991EX ClassWiz Calculator',
      description: 'Genuine scientific calculator with high-resolution LCD display and 552 functions. Essential for engineering mathematics, physics and semester exams.',
      category: 'Scientific Calculators',
      condition: 'Like New',
      location_label: 'Block B-3, Academic Block',
      listing_type: 'rent',
      daily_price: 20,
      rental_durations: ['1 day', '3 days', '7 days', '14 days'],
      duration_discounts: { '3': 5, '7': 10, '14': 20 },
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      images: [
        'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      owner_id: '00000000-0000-0000-0000-000000000001',
      title: 'Formal Black Interview Blazer (Size 40)',
      description: 'Slim-fit single-breasted charcoal black formal blazer. Dry-cleaned and ready for campus placement interviews, seminar presentations, or formal convocations.',
      category: 'Clothes & Formals',
      condition: 'Like New',
      location_label: 'North Campus Library Entrance',
      listing_type: 'rent',
      daily_price: 30,
      rental_durations: ['1 day', '3 days', '7 days'],
      duration_discounts: { '3': 10, '7': 15 },
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      owner_id: '00000000-0000-0000-0000-000000000001',
      title: 'Formal Oxford Leather Derby Shoes (Size UK 9)',
      description: 'Polished black lace-up derby shoes with cushioned insoles. Ideal for placement drives and dress codes.',
      category: 'Shoes & Footwear',
      condition: 'Good',
      location_label: 'Student Center Cafe',
      listing_type: 'rent',
      daily_price: 25,
      rental_durations: ['1 day', '3 days', '7 days'],
      duration_discounts: { '3': 5, '7': 10 },
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      images: [
        'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      owner_id: '00000000-0000-0000-0000-000000000001',
      title: 'Philips 1.5L Stainless Steel Electric Kettle',
      description: 'Fast-boiling cordless electric kettle with auto-cutoff. Essential for hostel late-night tea, coffee, and noodles.',
      category: 'Hostel & Room Essentials',
      condition: 'Like New',
      location_label: 'Hostel Block H1 Ground Floor',
      listing_type: 'rent',
      daily_price: 15,
      rental_durations: ['1 day', '3 days', '7 days', '14 days'],
      duration_discounts: { '7': 10, '14': 20 },
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      images: [
        'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      owner_id: '00000000-0000-0000-0000-000000000001',
      title: 'Looking for Engineering Mini Drafter with Sheet Tube',
      description: 'Need an engineering mini drafter with sheet holder tube for Monday drawing practical exam. Budget is INR 10/day.',
      category: 'Stationery',
      condition: 'Good',
      location_label: 'Engineering Workshop Building',
      listing_type: 'wanted',
      budget_per_day: 10,
      needed_by: 'Needed by Friday afternoon for evaluation',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      owner_id: '00000000-0000-0000-0000-000000000001',
      title: 'Data Structures & Algorithms in Java (Robert Lafore)',
      description: 'Clean reference textbook for DSA algorithms and data structures course. Available for rent during semester exams.',
      category: 'Books & Textbooks',
      condition: 'Good',
      location_label: 'Central Library Handoff Point',
      listing_type: 'rent',
      daily_price: 12,
      rental_durations: ['1 day', '3 days', '7 days', '14 days'],
      duration_discounts: { '7': 10, '14': 25 },
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1532012164546-f432f2e37257?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80'
      ]
    }
  ],
  borrow_requests: [],
  conversations: [],
  messages: [],
  notifications: [],
  reports: [],
  likes: [],
  comments: [],
  saved_items: []
};

export const getLocalDB = () => {
  const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED));
    return JSON.parse(JSON.stringify(INITIAL_SEED));
  }
  try {
    const db = JSON.parse(existing);
    if (!db.likes) db.likes = [];
    if (!db.comments) db.comments = [];
    if (!db.saved_items) db.saved_items = [];
    if (!db.conversations) db.conversations = JSON.parse(JSON.stringify(INITIAL_SEED.conversations));
    if (!db.messages) db.messages = JSON.parse(JSON.stringify(INITIAL_SEED.messages));

    // Ensure items have daily_price
    if (db.items) {
      db.items.forEach((item) => {
        if (!item.daily_price) {
          if (item.category === 'Scientific Calculators') item.daily_price = 20;
          else if (item.category === 'Clothes & Formals') item.daily_price = 30;
          else if (item.category === 'Shoes & Footwear') item.daily_price = 25;
          else if (item.category === 'Hostel & Room Essentials') item.daily_price = 15;
          else if (item.category === 'Books & Textbooks' || item.category === 'Textbooks & Notes') item.daily_price = 12;
          else item.daily_price = 15;
        }
        if (item.listing_type === 'borrow') {
          item.listing_type = 'rent';
        }
      });
    }

    // Auto-normalize user records
    if (db.users) {
      db.users.forEach((u) => {
        if (!u.university_uid && u.email) {
          u.university_uid = u.email.split('@')[0].toUpperCase();
        }
      });
    }

    return db;
  } catch (e) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED));
    return JSON.parse(JSON.stringify(INITIAL_SEED));
  }
};

export const saveLocalDB = (db) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
};

export const resetLocalDB = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED));
  return JSON.parse(JSON.stringify(INITIAL_SEED));
};

export const supabase = supabaseReal;
