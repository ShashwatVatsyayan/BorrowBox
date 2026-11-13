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
      email: '23bcs12850@cuchd.in',
      full_name: 'Aarav Sharma',
      university_uid: '23BCS12850',
      role: 'student',
      is_verified: true,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Computer Science student, 3rd year. Happy to lend lab kits, interview clothes and calculators.',
      department: 'Computer Science & Engineering',
      hostel_room: 'Boys Hostel 3 (BH-3), Room 412',
      phone: '+91 98765 43210',
      created_at: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      email: '24bcs12850@cuchd.in',
      full_name: 'Priya Verma',
      university_uid: '24BCS12850',
      role: 'student',
      is_verified: true,
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      bio: 'Mechanical Engineering student. Avid reader and badminton player.',
      department: 'Mechanical Engineering',
      hostel_room: 'Girls Hostel 2 (GH-2), Room 208',
      phone: '+91 98765 87654',
      created_at: new Date(Date.now() - 86400000 * 20).toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'admin@cuchd.in',
      full_name: 'Campus Admin',
      university_uid: 'ADMIN01',
      role: 'admin',
      is_verified: true,
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      bio: 'BorrowBox Campus Moderation Team',
      department: 'Dean of Student Welfare',
      hostel_room: 'Administrative Block A-1',
      phone: '+91 98765 00000',
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
      trade_item_desired: 'Casio fx-991EX Calculator or Formal Blazer Size 42',
      trade_preference: 'Willing to trade for size 42 formal blazer or Casio 991EX calculator',
      is_permanent_trade: true,
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
    },
    {
      id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      owner_id: '11111111-1111-1111-1111-111111111111',
      title: 'Data Structures & Algorithms in Java (Robert Lafore)',
      description: 'Clean reference textbook for DSA algorithms and data structures course. Traded with student peer for Galvin OS book.',
      category: 'Textbooks & Notes',
      condition: 'Good',
      location_label: 'Central Library Handoff Point',
      listing_type: 'trade',
      trade_item_desired: 'Operating Systems Concepts (Galvin)',
      trade_preference: 'Permanent book trade for Galvin 9th edition',
      is_permanent_trade: true,
      is_active: false,
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
  borrow_requests: [
    {
      id: 'req-001',
      item_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      borrower_id: '22222222-2222-2222-2222-222222222222',
      start_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      end_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      message: 'Need this for the calculus midterm exam on Friday. Will return right after.',
      status: 'pending',
      request_type: 'borrow',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'req-trade-001',
      item_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      borrower_id: '22222222-2222-2222-2222-222222222222',
      start_date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      end_date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      message: 'Swapped my copy of Operating Systems Concepts for this DSA Java book. Exchange completed at Library.',
      offer_item: 'Operating Systems Concepts (Silberschatz Galvin)',
      status: 'completed',
      request_type: 'trade',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'req-borrow-001',
      item_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      borrower_id: '11111111-1111-1111-1111-111111111111',
      start_date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
      end_date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0],
      message: 'Borrowed for hostel room use during semester exam week.',
      status: 'completed',
      request_type: 'borrow',
      created_at: new Date(Date.now() - 86400000 * 11).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 6).toISOString()
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

    // Auto-migrate user records to ensure immutable UID matches university email username
    if (db.users) {
      db.users.forEach((u) => {
        if (!u.avatar_url) {
          if (u.id === '11111111-1111-1111-1111-111111111111') {
            u.avatar_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
          } else if (u.id === '22222222-2222-2222-2222-222222222222') {
            u.avatar_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80';
          } else if (u.id === '33333333-3333-3333-3333-333333333333') {
            u.avatar_url = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80';
          }
        }
        if (u.id === '11111111-1111-1111-1111-111111111111' && (u.email === 'aarav.sharma@cuchd.in' || u.university_uid === '21BCS1001')) {
          u.email = '23bcs12850@cuchd.in';
          u.university_uid = '23BCS12850';
        }
        if (u.id === '22222222-2222-2222-2222-222222222222' && (u.email === 'priya.verma@cuchd.in' || u.university_uid === '21BCS1002')) {
          u.email = '24bcs12850@cuchd.in';
          u.university_uid = '24BCS12850';
        }
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
