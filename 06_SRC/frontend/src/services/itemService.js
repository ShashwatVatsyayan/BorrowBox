import { isConfigured, supabase, getLocalDB, saveLocalDB } from '../lib/supabase.js';
import { authService } from './authService.js';

export const itemService = {
  async getItems(filters = {}) {
    const { search, category, condition, ownerId, listingType, includeInactive } = filters;

    const db = getLocalDB();
    let localItems = Array.isArray(db.items) ? [...db.items] : [];

    // Attempt to merge with cloud items if Supabase is active
    if (isConfigured && supabase) {
      try {
        let query = supabase.from('items').select('*, item_images(*), profiles:owner_id(full_name, university_email)');
        if (!includeInactive) {
          query = query.eq('is_active', true);
        }
        if (ownerId) {
          query = query.eq('owner_id', ownerId);
        }
        query = query.order('created_at', { ascending: false });

        const { data: cloudItems, error } = await query;
        if (!error && Array.isArray(cloudItems) && cloudItems.length > 0) {
          const localItemMap = new Map(localItems.map((item) => [item.id, item]));

          cloudItems.forEach((cItem) => {
            const existing = localItemMap.get(cItem.id);
            if (!existing) {
              const cloudImages = Array.isArray(cItem.item_images)
                ? cItem.item_images.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map((img) => img.storage_path)
                : [];

              localItems.push({
                ...cItem,
                images: cloudImages.length > 0 ? cloudImages : (cItem.images || []),
                daily_price: cItem.daily_price || 15,
                owner: cItem.profiles ? { full_name: cItem.profiles.full_name, university_email: cItem.profiles.university_email } : null
              });
            }
          });
        }
      } catch (err) {
        console.warn('Supabase getItems query failed, falling back to local repository:', err);
      }
    }

    let result = localItems;

    if (!includeInactive) {
      result = result.filter((i) => i.is_active);
    }
    if (ownerId) {
      result = result.filter((i) => i.owner_id === ownerId);
    }
    if (category && category !== 'All') {
      result = result.filter((i) => i.category === category);
    }
    if (listingType && listingType !== 'All' && listingType !== 'all') {
      if (listingType === 'rent' || listingType === 'borrow') {
        result = result.filter((i) => !i.listing_type || i.listing_type === 'rent' || i.listing_type === 'borrow');
      } else {
        result = result.filter((i) => (i.listing_type || 'rent') === listingType);
      }
    }
    if (condition && condition !== 'All') {
      result = result.filter((i) => i.condition === condition);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) => (i.title && i.title.toLowerCase().includes(q)) || (i.description && i.description.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    // Attach owner info & social stats
    const currentUser = await authService.getUser();
    const currentUserId = currentUser?.id;

    return result.map((item) => {
      const owner = (db.users || []).find((u) => u.id === item.owner_id) || item.owner;
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
    const db = getLocalDB();
    const localItem = (db.items || []).find((i) => i.id === itemId);

    const currentUser = await authService.getUser();
    const currentUserId = currentUser?.id;

    if (localItem) {
      const owner = (db.users || []).find((u) => u.id === localItem.owner_id) || localItem.owner;
      const itemLikes = (db.likes || []).filter((l) => l.item_id === localItem.id);
      const itemComments = (db.comments || []).filter((c) => c.item_id === localItem.id);
      const isSaved = (db.saved_items || []).some((s) => s.item_id === localItem.id && s.user_id === currentUserId);
      const isLiked = itemLikes.some((l) => l.user_id === currentUserId);

      return {
        ...localItem,
        owner: owner ? { full_name: owner.full_name, university_email: owner.university_email, bio: owner.bio } : null,
        likes_count: itemLikes.length,
        comments_count: itemComments.length,
        is_liked: isLiked,
        is_saved: isSaved
      };
    }

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*, item_images(*), profiles:owner_id(full_name, university_email, bio)')
          .eq('id', itemId)
          .single();

        if (!error && data) {
          const cloudImages = Array.isArray(data.item_images)
            ? data.item_images.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map((img) => img.storage_path)
            : [];

          return {
            ...data,
            images: cloudImages.length > 0 ? cloudImages : (data.images || []),
            owner: data.profiles ? { full_name: data.profiles.full_name, university_email: data.profiles.university_email, bio: data.profiles.bio } : null,
            likes_count: 0,
            comments_count: 0,
            is_liked: false,
            is_saved: false
          };
        }
      } catch (err) {
        console.warn('Supabase getItemById failed:', err);
      }
    }

    throw new Error('Item not found');
  },

  async createItem(itemData) {
    const user = await authService.getUser();
    if (!user) throw new Error('You must be logged in to create a listing.');

    const cleanImages = Array.isArray(itemData.images)
      ? itemData.images.filter((img) => typeof img === 'string' && img.trim().length > 0)
      : [];

    if (cleanImages.length < 4) {
      throw new Error('Please provide at least 4 photos showing the top, bottom, and both side angles.');
    }

    const newItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      owner_id: user.id,
      title: (itemData.title || '').trim(),
      description: (itemData.description || '').trim(),
      category: itemData.category,
      condition: itemData.condition,
      location_label: (itemData.location_label || '').trim(),
      listing_type: itemData.listing_type || 'rent',
      daily_price: itemData.daily_price !== undefined ? Number(itemData.daily_price) : 15,
      budget_per_day: itemData.budget_per_day !== undefined && itemData.budget_per_day !== null && itemData.budget_per_day !== ''
        ? Number(itemData.budget_per_day)
        : null,
      rental_durations: itemData.rental_durations || ['1 day', '3 days', '7 days', '14 days'],
      duration_discounts: itemData.duration_discounts || { '3': 5, '7': 10, '14': 20 },
      lending_duration: itemData.lending_duration || '1 - 3 Days',
      trade_preference: itemData.trade_preference ? itemData.trade_preference.trim() : '',
      trade_item_desired: itemData.trade_item_desired ? itemData.trade_item_desired.trim() : '',
      is_permanent_trade: itemData.is_permanent_trade !== undefined ? Boolean(itemData.is_permanent_trade) : (itemData.listing_type === 'trade'),
      needed_by: itemData.needed_by ? itemData.needed_by.trim() : '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: cleanImages
    };

    // 1. Immediately persist to Local Repository (ensures zero data loss, offline capability & instant UI feedback)
    const db = getLocalDB();
    if (!Array.isArray(db.items)) db.items = [];
    db.items.unshift(newItem);

    // Ensure the current user exists in db.users so owner lookups succeed
    if (Array.isArray(db.users)) {
      const existingUserIdx = db.users.findIndex((u) => u.id === user.id);
      if (existingUserIdx === -1) {
        db.users.push({
          id: user.id,
          email: user.email,
          full_name: user.full_name || user.user_metadata?.full_name || 'BorrowBox Member',
          university_uid: user.university_uid || user.user_metadata?.university_uid || (user.email ? user.email.split('@')[0].toUpperCase() : 'CU-USER'),
          role: user.role || 'student',
          is_verified: true,
          created_at: new Date().toISOString()
        });
      }
    }

    saveLocalDB(db);

    // 2. Best-effort background sync to Supabase Cloud if configured
    if (isConfigured && supabase) {
      try {
        const { error: insertErr } = await supabase.from('items').insert({
          id: newItem.id,
          owner_id: user.id,
          title: newItem.title,
          description: newItem.description,
          category: newItem.category,
          condition: newItem.condition,
          location_label: newItem.location_label,
          is_active: true
        });

        if (!insertErr) {
          const imgRows = cleanImages.map((imgUrl, idx) => ({
            item_id: newItem.id,
            storage_path: imgUrl.startsWith('data:') ? `item-${newItem.id}-slot-${idx}` : imgUrl,
            sort_order: idx
          }));
          await supabase.from('item_images').insert(imgRows).catch(() => {});
        } else {
          console.warn('Supabase item insertion skipped due to database policy/credentials:', insertErr.message);
        }
      } catch (cloudErr) {
        console.warn('Supabase cloud sync error (item is safely saved locally):', cloudErr);
      }
    }

    return newItem;
  },

  async updateItem(itemId, itemData) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    const db = getLocalDB();
    const item = (db.items || []).find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    if (item.owner_id !== user.id) throw new Error('Unauthorized to edit this item');

    const cleanImages = Array.isArray(itemData.images)
      ? itemData.images.filter((img) => typeof img === 'string' && img.trim().length > 0)
      : item.images;

    Object.assign(item, {
      title: itemData.title ? itemData.title.trim() : item.title,
      description: itemData.description ? itemData.description.trim() : item.description,
      category: itemData.category || item.category,
      condition: itemData.condition || item.condition,
      location_label: itemData.location_label ? itemData.location_label.trim() : item.location_label,
      listing_type: itemData.listing_type || item.listing_type,
      daily_price: itemData.daily_price !== undefined ? Number(itemData.daily_price) : item.daily_price,
      budget_per_day: itemData.budget_per_day !== undefined ? Number(itemData.budget_per_day) : item.budget_per_day,
      rental_durations: itemData.rental_durations || item.rental_durations,
      duration_discounts: itemData.duration_discounts || item.duration_discounts,
      lending_duration: itemData.lending_duration || item.lending_duration,
      trade_preference: itemData.trade_preference !== undefined ? itemData.trade_preference : item.trade_preference,
      trade_item_desired: itemData.trade_item_desired !== undefined ? itemData.trade_item_desired : item.trade_item_desired,
      is_permanent_trade: itemData.is_permanent_trade !== undefined ? itemData.is_permanent_trade : item.is_permanent_trade,
      needed_by: itemData.needed_by !== undefined ? itemData.needed_by : item.needed_by,
      images: cleanImages,
      updated_at: new Date().toISOString()
    });

    saveLocalDB(db);

    if (isConfigured && supabase) {
      try {
        await supabase
          .from('items')
          .update({
            title: item.title,
            description: item.description,
            category: item.category,
            condition: item.condition,
            location_label: item.location_label,
            updated_at: new Date().toISOString()
          })
          .eq('id', itemId)
          .eq('owner_id', user.id);
      } catch (err) {
        console.warn('Supabase updateItem warning:', err);
      }
    }

    return item;
  },

  async toggleActive(itemId) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    const db = getLocalDB();
    const item = (db.items || []).find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    if (item.owner_id !== user.id) throw new Error('Unauthorized to modify this item');

    item.is_active = !item.is_active;
    item.updated_at = new Date().toISOString();
    saveLocalDB(db);

    if (isConfigured && supabase) {
      try {
        await supabase.from('items').update({ is_active: item.is_active }).eq('id', itemId);
      } catch (err) {
        console.warn('Supabase toggleActive warning:', err);
      }
    }

    return item;
  },

  async deleteItem(itemId) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    const db = getLocalDB();
    const index = (db.items || []).findIndex((i) => i.id === itemId);
    if (index === -1) throw new Error('Item not found');
    if (db.items[index].owner_id !== user.id) throw new Error('Unauthorized');

    db.items.splice(index, 1);
    saveLocalDB(db);

    if (isConfigured && supabase) {
      try {
        await supabase.from('items').delete().eq('id', itemId).eq('owner_id', user.id);
      } catch (err) {
        console.warn('Supabase deleteItem warning:', err);
      }
    }

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

    const item = (db.items || []).find((i) => i.id === itemId);
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
    return (db.items || [])
      .filter((i) => savedIds.has(i.id))
      .map((item) => {
        const owner = (db.users || []).find((u) => u.id === item.owner_id);
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

export default itemService;
