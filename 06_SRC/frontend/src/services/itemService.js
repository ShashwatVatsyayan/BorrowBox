import { isConfigured, supabase, getLocalDB, saveLocalDB } from '../lib/supabase';
import { authService } from './authService';

export const itemService = {
  async getItems(filters = {}) {
    const { search, category, condition, ownerId, listingType, includeInactive } = filters;

    if (isConfigured && supabase) {
      let query = supabase.from('items').select('*, profiles:owner_id(full_name, university_email)');
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      if (ownerId) {
        query = query.eq('owner_id', ownerId);
      }
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      if (condition && condition !== 'All') {
        query = query.eq('condition', condition);
      }
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }

    // Local deterministic mode
    const db = getLocalDB();
    let result = [...db.items];

    if (!includeInactive) {
      result = result.filter((i) => i.is_active);
    }
    if (ownerId) {
      result = result.filter((i) => i.owner_id === ownerId);
    }
    if (category && category !== 'All') {
      result = result.filter((i) => i.category === category);
    }
    if (listingType && listingType !== 'All') {
      result = result.filter((i) => (i.listing_type || 'borrow') === listingType);
    }
    if (condition && condition !== 'All') {
      result = result.filter((i) => i.condition === condition);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }

    // Attach owner info & social stats
    const currentUser = await authService.getUser();
    const currentUserId = currentUser?.id;

    return result.map((item) => {
      const owner = db.users.find((u) => u.id === item.owner_id);
      const itemLikes = (db.likes || []).filter((l) => l.item_id === item.id);
      const itemComments = (db.comments || []).filter((c) => c.item_id === item.id);
      const isSaved = (db.saved_items || []).some((s) => s.item_id === item.id && s.user_id === currentUserId);
      const isLiked = itemLikes.some((l) => l.user_id === currentUserId);

      return {
        ...item,
        owner: owner ? { full_name: owner.full_name, university_email: owner.university_email } : null,
        likes_count: itemLikes.length,
        comments_count: itemComments.length,
        is_liked: isLiked,
        is_saved: isSaved
      };
    });
  },

  async getItemById(itemId) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('items')
        .select('*, profiles:owner_id(full_name, university_email, bio)')
        .eq('id', itemId)
        .single();
      if (error) throw error;
      return data;
    }

    const db = getLocalDB();
    const item = db.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    const owner = db.users.find((u) => u.id === item.owner_id);

    const currentUser = await authService.getUser();
    const currentUserId = currentUser?.id;

    const itemLikes = (db.likes || []).filter((l) => l.item_id === item.id);
    const itemComments = (db.comments || []).filter((c) => c.item_id === item.id);
    const isSaved = (db.saved_items || []).some((s) => s.item_id === item.id && s.user_id === currentUserId);
    const isLiked = itemLikes.some((l) => l.user_id === currentUserId);

    return {
      ...item,
      owner: owner ? { full_name: owner.full_name, university_email: owner.university_email, bio: owner.bio } : null,
      likes_count: itemLikes.length,
      comments_count: itemComments.length,
      is_liked: isLiked,
      is_saved: isSaved
    };
  },

  async createItem(itemData) {
    const user = await authService.getUser();
    if (!user) throw new Error('You must be logged in to create a listing.');

    const newItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}`,
      owner_id: user.id,
      title: itemData.title.trim(),
      description: itemData.description.trim(),
      category: itemData.category,
      condition: itemData.condition,
      location_label: itemData.location_label.trim(),
      listing_type: itemData.listing_type || 'borrow',
      lending_duration: itemData.lending_duration || '1 - 3 Days',
      trade_preference: itemData.trade_preference ? itemData.trade_preference.trim() : '',
      needed_by: itemData.needed_by ? itemData.needed_by.trim() : '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: itemData.images && itemData.images.length > 0 ? itemData.images : []
    };

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('items')
        .insert({
          id: newItem.id,
          owner_id: user.id,
          title: newItem.title,
          description: newItem.description,
          category: newItem.category,
          condition: newItem.condition,
          location_label: newItem.location_label,
          is_active: true
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const db = getLocalDB();
    db.items.unshift(newItem);
    saveLocalDB(db);
    return newItem;
  },

  async updateItem(itemId, itemData) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('items')
        .update({
          title: itemData.title,
          description: itemData.description,
          category: itemData.category,
          condition: itemData.condition,
          location_label: itemData.location_label,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .eq('owner_id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const db = getLocalDB();
    const item = db.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    if (item.owner_id !== user.id) throw new Error('Unauthorized to edit this item');

    Object.assign(item, {
      title: itemData.title,
      description: itemData.description,
      category: itemData.category,
      condition: itemData.condition,
      location_label: itemData.location_label,
      updated_at: new Date().toISOString()
    });

    saveLocalDB(db);
    return item;
  },

  async toggleActive(itemId) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    const db = getLocalDB();
    const item = db.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    if (item.owner_id !== user.id) throw new Error('Unauthorized to modify this item');

    item.is_active = !item.is_active;
    item.updated_at = new Date().toISOString();
    saveLocalDB(db);
    return item;
  },

  async deleteItem(itemId) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    const db = getLocalDB();
    const index = db.items.findIndex((i) => i.id === itemId);
    if (index === -1) throw new Error('Item not found');
    if (db.items[index].owner_id !== user.id) throw new Error('Unauthorized');

    db.items.splice(index, 1);
    saveLocalDB(db);
    return true;
  },

  async toggleLike(itemId) {
    const user = await authService.getUser();
    if (!user) throw new Error('You must be signed in to like items.');

    const db = getLocalDB();
    if (!db.likes) db.likes = [];

    const existingIndex = db.likes.findIndex((l) => l.item_id === itemId && l.user_id === user.id);
    let liked = false;

    if (existingIndex !== -1) {
      db.likes.splice(existingIndex, 1);
      liked = false;
    } else {
      db.likes.push({
        id: `like-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        item_id: itemId,
        user_id: user.id,
        created_at: new Date().toISOString()
      });
      liked = true;
    }

    saveLocalDB(db);
    const count = db.likes.filter((l) => l.item_id === itemId).length;
    return { liked, count };
  },

  async toggleSave(itemId) {
    const user = await authService.getUser();
    if (!user) throw new Error('You must be signed in to save items.');

    const db = getLocalDB();
    if (!db.saved_items) db.saved_items = [];

    const existingIndex = db.saved_items.findIndex((s) => s.item_id === itemId && s.user_id === user.id);
    let saved = false;

    if (existingIndex !== -1) {
      db.saved_items.splice(existingIndex, 1);
      saved = false;
    } else {
      db.saved_items.push({
        id: `save-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        item_id: itemId,
        user_id: user.id,
        created_at: new Date().toISOString()
      });
      saved = true;
    }

    saveLocalDB(db);
    return { saved };
  },

  async getComments(itemId) {
    const db = getLocalDB();
    const comments = (db.comments || [])
      .filter((c) => c.item_id === itemId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return comments;
  },

  async addComment(itemId, text) {
    const user = await authService.getUser();
    if (!user) throw new Error('You must be signed in to post a question or comment.');
    if (!text || !text.trim()) throw new Error('Comment cannot be empty.');

    const db = getLocalDB();
    if (!db.comments) db.comments = [];

    const item = db.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found.');

    const newComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      item_id: itemId,
      user_id: user.id,
      user_name: user.full_name || 'Student',
      text: text.trim(),
      created_at: new Date().toISOString()
    };

    db.comments.push(newComment);

    // Notify item owner if commenter is not the owner
    if (item.owner_id !== user.id) {
      if (!db.notifications) db.notifications = [];
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: item.owner_id,
        title: 'New Question on Your Listing',
        message: `${user.full_name || 'A student'} commented on "${item.title}": "${text.trim().slice(0, 80)}${text.length > 80 ? '...' : ''}"`,
        type: 'item_comment',
        related_item_id: itemId,
        is_read: false,
        created_at: new Date().toISOString()
      });
    }

    saveLocalDB(db);
    return newComment;
  },

  async getSavedItems() {
    const user = await authService.getUser();
    if (!user) return [];

    const db = getLocalDB();
    const savedIds = new Set((db.saved_items || []).filter((s) => s.user_id === user.id).map((s) => s.item_id));
    return db.items
      .filter((i) => savedIds.has(i.id))
      .map((item) => {
        const owner = db.users.find((u) => u.id === item.owner_id);
        const itemLikes = (db.likes || []).filter((l) => l.item_id === item.id);
        const itemComments = (db.comments || []).filter((c) => c.item_id === item.id);
        return {
          ...item,
          owner: owner ? { full_name: owner.full_name, university_email: owner.university_email } : null,
          likes_count: itemLikes.length,
          comments_count: itemComments.length,
          is_liked: itemLikes.some((l) => l.user_id === user.id),
          is_saved: true
        };
      });
  }
};

