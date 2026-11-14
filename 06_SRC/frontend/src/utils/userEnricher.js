/**
 * User Profile Enrichment & Greeting Utility
 * Normalizes user data from Supabase Auth metadata, profiles table, and local database.
 * Computes personalized greetings (e.g. "Hello Shashwat", "Hello Aditi").
 */

export const enrichUserData = (rawUser) => {
  if (!rawUser) return null;
  const meta = rawUser.user_metadata || {};
  const email = rawUser.email || rawUser.university_email || '';

  // 1. Resolve full_name from direct property or metadata
  let full_name = (rawUser.full_name || meta.full_name || '').trim();

  // 2. If no full_name, derive formatted name from email prefix (e.g. shashwat.vatsyayan -> Shashwat Vatsyayan)
  if (!full_name && email.includes('@')) {
    const prefix = email.split('@')[0];
    const words = prefix.replace(/[0-9]/g, '').split(/[._-]/).filter(Boolean);
    if (words.length > 0) {
      full_name = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  // 3. Resolve university_uid
  let university_uid = rawUser.university_uid || meta.university_uid || '';
  if (!university_uid && email.includes('@')) {
    university_uid = email.split('@')[0].toUpperCase();
  }

  // 4. Check local DB users for saved profile edits
  try {
    const dbStr = typeof localStorage !== 'undefined' ? localStorage.getItem('borrowbox_prod_v1') : null;
    if (dbStr) {
      const db = JSON.parse(dbStr);
      const localUser = (db.users || []).find((u) => u.id === rawUser.id || (u.email && u.email.toLowerCase() === email.toLowerCase()));
      if (localUser) {
        return {
          ...rawUser,
          ...localUser,
          full_name: localUser.full_name || full_name || 'Student User',
          university_uid: localUser.university_uid || university_uid || 'CU-USER'
        };
      }
    }
  } catch {
    // Local storage read fallback
  }

  return {
    ...rawUser,
    full_name: full_name || 'Student User',
    university_uid: university_uid || 'CU-USER',
    department: rawUser.department || meta.department || 'Computer Science & Engineering',
    avatar_url: rawUser.avatar_url || meta.avatar_url || '/default_avatar_male.svg',
    bio: rawUser.bio || meta.bio || '',
    hostel_room: rawUser.hostel_room || meta.hostel_room || 'Chandigarh University Campus'
  };
};

export const getStudentFirstName = (user) => {
  const raw = user?.full_name || user?.user_metadata?.full_name || '';
  if (raw && raw.trim()) {
    const first = raw.trim().split(' ')[0];
    return first.charAt(0).toUpperCase() + first.slice(1);
  }
  const email = user?.email || user?.university_email || '';
  if (email && email.includes('@')) {
    const prefix = email.split('@')[0].replace(/[0-9]/g, '').split(/[._-]/).filter(Boolean)[0];
    if (prefix) {
      return prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
    }
  }
  return 'Student';
};
