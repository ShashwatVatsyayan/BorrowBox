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

const LOCAL_STORAGE_KEY = 'borrowbox_local_db_v1';

const INITIAL_SEED = {
  users: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'aarav.sharma@cuchd.in',
      full_name: 'Aarav Sharma',
      university_uid: '21BCS1001',
      role: 'student',
      is_verified: true,
      bio: 'Computer Science student, 3rd year. Happy to lend lab kits and calculators.',
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
      category: 'Electronics & Calculators',
      condition: 'Like New',
      location_label: 'Block B-3, Academic Block',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80']
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      owner_id: '11111111-1111-1111-1111-111111111111',
      title: 'White Chemistry Lab Coat (Size M)',
      description: 'Clean 100% heavy cotton lab coat with two side pockets and chest pocket. Mandatory for Chemistry and Biotech labs.',
      category: 'Lab & Safety Equipment',
      condition: 'Good',
      location_label: 'North Campus Library Entrance',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80']
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      owner_id: '11111111-1111-1111-1111-111111111111',
      title: 'Engineering Mechanics Textbook (Hibbeler)',
      description: '14th edition hardbound textbook covering statics and dynamics with illustrated problem sets and solved examples.',
      category: 'Textbooks & Notes',
      condition: 'Good',
      location_label: 'Student Center Cafe',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80']
    },
    {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      owner_id: '22222222-2222-2222-2222-222222222222',
      title: 'Yonex Carbonex Badminton Racket with Cover',
      description: 'Pre-strung carbon graphite racket with padded carry case and grip wrap. Ideal for hostel badminton court or sports complex.',
      category: 'Sports & Fitness',
      condition: 'Good',
      location_label: 'Hostel Block H1 Ground Floor',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80']
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      owner_id: '22222222-2222-2222-2222-222222222222',
      title: 'Arduino Uno R3 Starter Kit with Sensors',
      description: 'Original ATmega328P microcontroller board, solderless breadboard, ultrasonic distance sensor, relay module and assortment of DuPont wires.',
      category: 'Tools & Hardware',
      condition: 'Like New',
      location_label: 'Engineering Workshop Building',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80']
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
  reports: []
};

export const getLocalDB = () => {
  const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED));
    return JSON.parse(JSON.stringify(INITIAL_SEED));
  }
  try {
    return JSON.parse(existing);
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

