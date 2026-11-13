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

    // Attach owner info
    return result.map((item) => {
      const owner = db.users.find((u) => u.id === item.owner_id);
      return {
        ...item,
        owner: owner ? { full_name: owner.full_name, university_email: owner.university_email } : null
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
    return {
      ...item,
      owner: owner ? { full_name: owner.full_name, university_email: owner.university_email, bio: owner.bio } : null
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
  }
};

