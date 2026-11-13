import { isConfigured, supabase, getLocalDB, saveLocalDB } from '../lib/supabase';
import { authService } from './authService';
import { checkDateOverlap } from '../utils/dateUtils';

export const requestService = {
  async createRequest({ itemId, startDate, endDate, message, requestType = 'borrow', offerItem = '' }) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('borrow_requests')
        .insert({
          item_id: itemId,
          borrower_id: user.id,
          start_date: startDate,
          end_date: endDate,
          message: message || '',
          status: 'pending'
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Local deterministic mode
    const db = getLocalDB();
    const item = db.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');

    if (item.owner_id === user.id) {
      throw new Error('You cannot request or trade with your own item.');
    }

    const newReq = {
      id: `req-${Date.now()}`,
      item_id: itemId,
      borrower_id: user.id,
      start_date: startDate || new Date().toISOString().split('T')[0],
      end_date: endDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      message: message ? message.trim() : '',
      request_type: requestType,
      offer_item: offerItem,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.borrow_requests.unshift(newReq);

    // Notify item owner
    const notifTitle = requestType === 'trade'
      ? 'New Trade Proposal'
      : requestType === 'wanted'
      ? 'New Offer on Wanted Request'
      : 'New Borrow Request';

    const notifMessage = requestType === 'trade'
      ? `${user.full_name || 'A student'} proposed a barter/trade for "${item.title}".`
      : requestType === 'wanted'
      ? `${user.full_name || 'A student'} offered an item for your wanted request "${item.title}".`
      : `${user.full_name || 'A student'} requested to borrow "${item.title}".`;

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: item.owner_id,
      title: notifTitle,
      message: notifMessage,
      type: 'request_received',
      related_request_id: newReq.id,
      is_read: false,
      created_at: new Date().toISOString()
    });

    saveLocalDB(db);
    return newReq;
  },

  async getSentRequests(borrowerId) {
    const db = getLocalDB();
    const requests = db.borrow_requests.filter((r) => r.borrower_id === borrowerId);
    return requests.map((req) => {
      const item = db.items.find((i) => i.id === req.item_id);
      const owner = item ? db.users.find((u) => u.id === item.owner_id) : null;
      return {
        ...req,
        item: item ? { ...item, owner } : null
      };
    });
  },

  async getReceivedRequests(ownerId) {
    const db = getLocalDB();
    const userItemIds = new Set(db.items.filter((i) => i.owner_id === ownerId).map((i) => i.id));
    const requests = db.borrow_requests.filter((r) => userItemIds.has(r.item_id));

    return requests.map((req) => {
      const item = db.items.find((i) => i.id === req.item_id);
      const borrower = db.users.find((u) => u.id === req.borrower_id);
      return {
        ...req,
        item,
        borrower
      };
    });
  },

  async approveRequest(requestId) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    if (isConfigured && supabase) {
      const { data, error } = await supabase.rpc('approve_borrow_request', { req_id: requestId });
      if (error) throw error;
      return data;
    }

    // Local deterministic mode with atomic overlap prevention
    const db = getLocalDB();
    const req = db.borrow_requests.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const item = db.items.find((i) => i.id === req.item_id);
    if (!item) throw new Error('Associated item not found');
    if (item.owner_id !== user.id) {
      throw new Error('Unauthorized: Only the item owner can approve this request.');
    }

    if (req.status !== 'pending') {
      throw new Error(`Only pending requests can be approved. Current status: ${req.status}`);
    }

    // Check for double booking with existing approved requests
    const conflict = db.borrow_requests.find((other) => (
      other.item_id === req.item_id &&
      other.status === 'approved' &&
      other.id !== req.id &&
      checkDateOverlap(req.start_date, req.end_date, other.start_date, other.end_date)
    ));

    if (conflict) {
      throw new Error(`Conflict: This item is already booked for overlapping dates (${conflict.start_date} to ${conflict.end_date}).`);
    }

    req.status = 'approved';
    req.updated_at = new Date().toISOString();

    // Notify borrower
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: req.borrower_id,
      title: 'Borrow Request Approved',
      message: `Your request for "${item.title}" was approved for ${req.start_date} to ${req.end_date}.`,
      type: 'request_approved',
      related_request_id: req.id,
      is_read: false,
      created_at: new Date().toISOString()
    });

    saveLocalDB(db);
    return req;
  },

  async rejectRequest(requestId) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    const db = getLocalDB();
    const req = db.borrow_requests.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const item = db.items.find((i) => i.id === req.item_id);
    if (!item || item.owner_id !== user.id) {
      throw new Error('Unauthorized: Only the item owner can decline this request.');
    }

    if (req.status !== 'pending') {
      throw new Error('Only pending requests can be declined.');
    }

    req.status = 'rejected';
    req.updated_at = new Date().toISOString();

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: req.borrower_id,
      title: 'Borrow Request Declined',
      message: `Your request for "${item.title}" was declined by the owner.`,
      type: 'request_rejected',
      related_request_id: req.id,
      is_read: false,
      created_at: new Date().toISOString()
    });

    saveLocalDB(db);
    return req;
  },

  async cancelRequest(requestId) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    const db = getLocalDB();
    const req = db.borrow_requests.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    if (req.borrower_id !== user.id) {
      throw new Error('Unauthorized: Only the requester can cancel this request.');
    }

    if (req.status !== 'pending') {
      throw new Error('Only pending requests can be cancelled.');
    }

    req.status = 'cancelled';
    req.updated_at = new Date().toISOString();
    saveLocalDB(db);
    return req;
  },

  async markReturnPending(requestId) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    const db = getLocalDB();
    const req = db.borrow_requests.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    if (req.borrower_id !== user.id) {
      throw new Error('Unauthorized: Only the borrower can initiate return.');
    }

    if (req.status !== 'approved') {
      throw new Error('Return can only be initiated for an active approved borrowing.');
    }

    const item = db.items.find((i) => i.id === req.item_id);

    req.status = 'return_pending';
    req.updated_at = new Date().toISOString();

    if (item) {
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: item.owner_id,
        title: 'Item Return Initiated',
        message: `${user.full_name} has marked "${item.title}" as returned. Please inspect and confirm receipt.`,
        type: 'return_initiated',
        related_request_id: req.id,
        is_read: false,
        created_at: new Date().toISOString()
      });
    }

    saveLocalDB(db);
    return req;
  },

  async confirmReturn(requestId) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    const db = getLocalDB();
    const req = db.borrow_requests.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const item = db.items.find((i) => i.id === req.item_id);
    if (!item || item.owner_id !== user.id) {
      throw new Error('Unauthorized: Only the item owner can confirm receipt and complete the return.');
    }

    if (req.status !== 'return_pending') {
      throw new Error('Item must be marked as return_pending by borrower before owner confirmation.');
    }

    req.status = 'completed';
    req.updated_at = new Date().toISOString();

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: req.borrower_id,
      title: 'Return Confirmed',
      message: `The owner confirmed return of "${item.title}". The borrowing transaction is completed.`,
      type: 'return_confirmed',
      related_request_id: req.id,
      is_read: false,
      created_at: new Date().toISOString()
    });

    saveLocalDB(db);
    return req;
  }
};

