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

const LOCAL_STORAGE_KEY = 'borrowbox_local_db_v2';

const INITIAL_SEED = {
  users: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'aarav.sharma@cuchd.in',
      full_name: 'Aarav Sharma',
      university_uid: '21BCS1001',
      role: 'student',
      is_verified: true,
      bio: 'Computer Science student, 3rd year. Happy to lend lab kits, interview clothes and calculators.',
      created_at: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'priya.verma@cuchd.in',
      full_name: 'Priya Verma',
      university_uid: '21BCS1002',
      role: 'student',
      is_verified: true,
      bio: 'Mechanical Engineering student. Avid reader and badminton player.',
      created_at: new Date(Date.now() - 86400000 * 20).toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'admin@cuchd.in',
      full_name: 'Campus Admin',
      university_uid: 'ADMIN01',
      role: 'admin',
      is_verified: true,
      bio: 'BorrowBox Campus Moderation Team',
      created_at: new Date(Date.now() - 86400000 * 60).toISOString()
    }
  ],
  items: [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      owner_id: '11111111-1111-1111-1111-111111111111',
      title: 'Casio fx-991EX ClassWiz Calculator',
      description: 'Genuine scientific calculator with high-resolution LCD display and 552 functions. Essential for engineering mathematics, physics and semester exams.',
      category: 'Electronics & Gadgets',
      condition: 'Like New',
      location_label: 'Block B-3, Academic Block',
      listing_type: 'borrow',
      lending_duration: '1 - 3 Days (Weekend / Quick Need)',
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
      owner_id: '11111111-1111-1111-1111-111111111111',
      title: 'Formal Black Interview Blazer (Size 40)',
      description: 'Slim-fit single-breasted charcoal black formal blazer. Dry-cleaned and ready for campus placement interviews, seminar presentations, or formal convocations.',
      category: 'Clothes & Formals',
      condition: 'Like New',
      location_label: 'North Campus Library Entrance',
      listing_type: 'borrow',
      lending_duration: '1 - 3 Days (Weekend / Quick Need)',
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
      owner_id: '11111111-1111-1111-1111-111111111111',
      title: 'Formal Oxford Leather Derby Shoes (Size UK 9)',
      description: 'Polished black lace-up derby shoes with cushioned insoles. Ideal for placement drives and dress codes.',
      category: 'Shoes & Footwear',
      condition: 'Good',
      location_label: 'Student Center Cafe',
      listing_type: 'trade',
      trade_preference: 'Willing to trade for size 42 formal blazer or Casio 991EX calculator',
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
      owner_id: '22222222-2222-2222-2222-222222222222',
      title: 'Philips 1.5L Stainless Steel Electric Kettle',
      description: 'Fast-boiling cordless electric kettle with auto-cutoff. Essential for hostel late-night tea, coffee, and noodles.',
      category: 'Hostel & Room Essentials',
      condition: 'Like New',
      location_label: 'Hostel Block H1 Ground Floor',
      listing_type: 'borrow',
      lending_duration: 'Up to 1 Week (Standard Borrowing)',
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
      owner_id: '22222222-2222-2222-2222-222222222222',
      title: 'Looking for Engineering Mini Drafter with Sheet Tube',
      description: 'Need an engineering mini drafter with sheet holder tube for Monday drawing practical exam. Willing to borrow for 2 days or trade for scientific notes.',
      category: 'Stationery & Drafting',
      condition: 'Good',
      location_label: 'Engineering Workshop Building',
      listing_type: 'wanted',
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
    }
  ],
  borrow_requests: [
    {
      id: 'req-001',
      item_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      borrower_id: '22222222-2222-2222-2222-222222222222',
      start_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      end_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      message: 'Need this for the calculus midterm exam on Friday. Will return right after.',
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ],
  notifications: [
    {
      id: 'notif-001',
      user_id: '11111111-1111-1111-1111-111111111111',
      title: 'New Borrow Request Received',
      message: 'Priya Verma requested to borrow your "Casio fx-991EX ClassWiz Calculator".',
      type: 'request_received',
      related_request_id: 'req-001',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ],
  reports: [],
  likes: [
    {
      id: 'like-001',
      item_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      user_id: '22222222-2222-2222-2222-222222222222',
      created_at: new Date(Date.now() - 3600000 * 20).toISOString()
    },
    {
      id: 'like-002',
      item_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      user_id: '22222222-2222-2222-2222-222222222222',
      created_at: new Date(Date.now() - 3600000 * 15).toISOString()
    }
  ],
  comments: [
    {
      id: 'cmt-001',
      item_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      user_id: '22222222-2222-2222-2222-222222222222',
      user_name: 'Priya Verma',
      text: 'Does this calculator have the solar charging panel intact? Needed for math practicals on Monday!',
      created_at: new Date(Date.now() - 3600000 * 10).toISOString()
    },
    {
      id: 'cmt-002',
      item_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      user_id: '11111111-1111-1111-1111-111111111111',
      user_name: 'Aarav Sharma',
      text: 'Yes Priya! Solar panel and battery backup are 100% operational, and protective hard slip-on case is included.',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ],
  saved_items: [
    {
      id: 'save-001',
      item_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      user_id: '22222222-2222-2222-2222-222222222222',
      created_at: new Date(Date.now() - 3600000 * 25).toISOString()
    }
  ]
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
