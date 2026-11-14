import { isConfigured, supabase, getLocalDB, saveLocalDB } from '../lib/supabase';
import { authService } from './authService';

export const messageService = {
  /**
   * Fetches all conversations for the authenticated user.
   */
  async getConversations() {
    const user = await authService.getUser();
    if (!user) return [];

    const db = getLocalDB();
    const conversations = db.conversations || [];

    const userConvs = conversations.filter(
      (c) => Array.isArray(c.participant_ids) && c.participant_ids.includes(user.id)
    );

    return userConvs.map((conv) => {
      const otherUserId = conv.participant_ids.find((id) => id !== user.id) || conv.participant_ids[0];
      const otherUser = db.users.find((u) => u.id === otherUserId) || {
        id: otherUserId,
        full_name: 'Campus Peer',
        email: 'student@cuchd.in',
        university_uid: 'STUDENT',
        avatar_url: '/default_avatar_male.svg'
      };

      const item = conv.item_id ? db.items.find((i) => i.id === conv.item_id) : null;
      const unread = conv.unread_count?.[user.id] || 0;

      return {
        ...conv,
        otherUser,
        item,
        unread
      };
    }).sort((a, b) => new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0));
  },

  /**
   * Retrieves or creates a conversation between the current user and another student.
   */
  async getOrCreateConversation({ otherUserId, itemId = null }) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');
    if (user.id === otherUserId) {
      throw new Error('You cannot start a direct message with yourself.');
    }

    const db = getLocalDB();
    if (!db.conversations) db.conversations = [];
    if (!db.messages) db.messages = [];

    let conv = db.conversations.find((c) => {
      const matchParticipants =
        Array.isArray(c.participant_ids) &&
        c.participant_ids.includes(user.id) &&
        c.participant_ids.includes(otherUserId);
      if (itemId) {
        return matchParticipants && c.item_id === itemId;
      }
      return matchParticipants;
    });

    if (!conv) {
      conv = {
        id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        participant_ids: [user.id, otherUserId],
        item_id: itemId,
        last_message: 'Conversation started',
        last_message_at: new Date().toISOString(),
        unread_count: {
          [user.id]: 0,
          [otherUserId]: 0
        },
        created_at: new Date().toISOString()
      };
      db.conversations.unshift(conv);
      saveLocalDB(db);
    }

    const otherUser = db.users.find((u) => u.id === otherUserId) || {
      id: otherUserId,
      full_name: 'Campus Peer',
      email: 'student@cuchd.in'
    };
    const item = itemId ? db.items.find((i) => i.id === itemId) : null;

    return {
      ...conv,
      otherUser,
      item,
      unread: 0
    };
  },

  /**
   * Fetches all messages within a specific conversation thread.
   */
  async getMessages(conversationId) {
    const user = await authService.getUser();
    if (!user) return [];

    const db = getLocalDB();
    const messages = db.messages || [];

    // Mark as read for this user
    if (db.conversations) {
      const conv = db.conversations.find((c) => c.id === conversationId);
      if (conv && conv.unread_count && conv.unread_count[user.id]) {
        conv.unread_count[user.id] = 0;
        saveLocalDB(db);
      }
    }

    return messages
      .filter((m) => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  /**
   * Sends a message (plain text, custom rental rate offer, or trade proposal).
   */
  async sendMessage({ conversationId, text, type = 'text', payload = null }) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    const db = getLocalDB();
    if (!db.messages) db.messages = [];
    if (!db.conversations) db.conversations = [];

    const conv = db.conversations.find((c) => c.id === conversationId);
    if (!conv) throw new Error('Conversation not found.');

    const otherUserId = conv.participant_ids.find((id) => id !== user.id);

    const messageContent = text || (
      type === 'offer'
        ? `Custom rental offer sent: INR ${payload?.daily_price || 0}/day for ${payload?.days || 1} days.`
        : type === 'trade'
        ? `Trade proposal sent: Offering "${payload?.offered_item || 'Item'}" in exchange.`
        : ''
    );

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      conversation_id: conversationId,
      sender_id: user.id,
      sender_name: user.full_name || 'Student',
      sender_avatar: user.avatar_url || '/default_avatar_male.svg',
      type, // 'text' | 'offer' | 'trade'
      text: messageContent,
      payload: payload ? { ...payload, status: 'pending' } : null,
      created_at: new Date().toISOString()
    };

    db.messages.push(newMsg);

    // Update conversation summary
    conv.last_message = messageContent;
    conv.last_message_at = newMsg.created_at;
    if (!conv.unread_count) conv.unread_count = {};
    if (otherUserId) {
      conv.unread_count[otherUserId] = (conv.unread_count[otherUserId] || 0) + 1;
    }

    // Deliver notification to other party
    if (otherUserId) {
      if (!db.notifications) db.notifications = [];
      const notifTitle = type === 'offer'
        ? 'New Rental Offer Received'
        : type === 'trade'
        ? 'New Trade Proposal in Chat'
        : 'New Direct Message';

      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: otherUserId,
        title: notifTitle,
        message: `${user.full_name || 'A student'}: ${messageContent.slice(0, 100)}`,
        type: 'message_received',
        related_id: conversationId,
        is_read: false,
        created_at: new Date().toISOString()
      });
    }

    saveLocalDB(db);
    return newMsg;
  },

  /**
   * Responds to an in-chat rental offer or trade proposal (accept / decline).
   */
  async respondToOffer({ messageId, action }) {
    const user = await authService.getUser();
    if (!user) throw new Error('Authentication required.');

    const db = getLocalDB();
    const msg = (db.messages || []).find((m) => m.id === messageId);
    if (!msg || !msg.payload) {
      throw new Error('Offer message not found.');
    }

    if (msg.sender_id === user.id) {
      throw new Error('You cannot accept or decline your own offer.');
    }

    if (msg.payload.status !== 'pending') {
      throw new Error(`Offer has already been ${msg.payload.status}.`);
    }

    msg.payload.status = action === 'accept' ? 'accepted' : 'declined';
    msg.payload.responded_at = new Date().toISOString();

    const conv = (db.conversations || []).find((c) => c.id === msg.conversation_id);
    const item = conv?.item_id ? db.items.find((i) => i.id === conv.item_id) : null;

    let systemNote = '';
    if (action === 'accept') {
      if (msg.type === 'offer') {
        // Automatically create or update rental booking with the negotiated rate
        const startDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const days = msg.payload.days || 3;
        const endDate = new Date(Date.now() + 86400000 * (days + 1)).toISOString().split('T')[0];

        const newBooking = {
          id: `req-nego-${Date.now()}`,
          item_id: conv?.item_id || 'custom-item',
          borrower_id: user.id,
          start_date: startDate,
          end_date: endDate,
          daily_price: msg.payload.daily_price,
          total_days: days,
          total_amount: msg.payload.total_amount,
          message: `Negotiated in Direct Message: INR ${msg.payload.daily_price}/day (${days} days)`,
          request_type: 'rent',
          status: 'approved',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (!db.borrow_requests) db.borrow_requests = [];
        db.borrow_requests.unshift(newBooking);

        systemNote = `Offer accepted! Rental booking confirmed at INR ${msg.payload.daily_price}/day for ${days} days (Total: INR ${msg.payload.total_amount}).`;
      } else if (msg.type === 'trade') {
        // Trade accepted
        if (item) {
          item.is_active = false;
        }
        const newTrade = {
          id: `req-trade-${Date.now()}`,
          item_id: conv?.item_id || 'custom-item',
          borrower_id: user.id,
          offer_item: msg.payload.offered_item || 'Item in chat',
          message: `In-chat trade agreement: Swapped for ${msg.payload.offered_item}`,
          request_type: 'trade',
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        if (!db.borrow_requests) db.borrow_requests = [];
        db.borrow_requests.unshift(newTrade);

        systemNote = `Trade proposal accepted! Both students agreed to trade "${msg.payload.offered_item}".`;
      }

      // Notify the offer sender
      if (!db.notifications) db.notifications = [];
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: msg.sender_id,
        title: msg.type === 'offer' ? 'Rental Offer Accepted' : 'Trade Proposal Accepted',
        message: `${user.full_name || 'A student'} accepted your proposal in chat: ${systemNote}`,
        type: 'offer_accepted',
        related_id: msg.conversation_id,
        is_read: false,
        created_at: new Date().toISOString()
      });
    } else {
      systemNote = msg.type === 'offer'
        ? 'Rental negotiation offer was declined.'
        : 'Trade proposal was declined.';
    }

    // Post an automated system confirmation into the thread
    const systemMsg = {
      id: `msg-${Date.now()}-sys`,
      conversation_id: msg.conversation_id,
      sender_id: 'system',
      sender_name: 'BorrowBox Assistant',
      sender_avatar: '/logo-icon.svg',
      type: 'text',
      text: systemNote,
      payload: null,
      created_at: new Date().toISOString()
    };
    db.messages.push(systemMsg);

    if (conv) {
      conv.last_message = systemNote;
      conv.last_message_at = systemMsg.created_at;
    }

    saveLocalDB(db);
    return msg;
  }
};

