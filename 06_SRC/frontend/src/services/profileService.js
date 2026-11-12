import { isConfigured, supabase, getLocalDB, saveLocalDB } from '../lib/supabase';

export const profileService = {
  async getProfile(userId) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    }

    const db = getLocalDB();
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error('Profile not found');
    return user;
  },

  async updateProfile(userId, updates) {
    // Only allow updating permitted fields as mandated by PRD
    const allowed = ['full_name', 'bio'];
    const filteredUpdates = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update(filteredUpdates)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const db = getLocalDB();
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    Object.assign(user, filteredUpdates);
    saveLocalDB(db);

    // Also update session user if current
    const sessionStr = localStorage.getItem('borrowbox_auth_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session.user?.id === userId) {
        Object.assign(session.user, filteredUpdates);
        localStorage.setItem('borrowbox_auth_session', JSON.stringify(session));
      }
    }

    return user;
  },

  async getUserStats(userId) {
    if (isConfigured && supabase) {
      const [itemsRes, borrowingsRes, lendingsRes] = await Promise.all([
        supabase.from('items').select('id', { count: 'exact' }).eq('owner_id', userId),
        supabase.from('borrow_requests').select('id', { count: 'exact' }).eq('borrower_id', userId).eq('status', 'completed'),
        supabase.from('borrow_requests').select('id', { count: 'exact' }).eq('status', 'completed')
      ]);

      return {
        listings: itemsRes.count || 0,
        borrowings: borrowingsRes.count || 0,
        lendings: 0 // In real Supabase, would filter by join
      };
    }

    const db = getLocalDB();
    const listingsCount = db.items.filter((i) => i.owner_id === userId).length;
    const completedBorrowings = db.borrow_requests.filter(
      (r) => r.borrower_id === userId && r.status === 'completed'
    ).length;

    // Completed lendings: where user owns the item
    const userItemIds = new Set(db.items.filter((i) => i.owner_id === userId).map((i) => i.id));
    const completedLendings = db.borrow_requests.filter(
      (r) => userItemIds.has(r.item_id) && r.status === 'completed'
    ).length;

    return {
      listings: listingsCount,
      borrowings: completedBorrowings,
      lendings: completedLendings
    };
  }
};

