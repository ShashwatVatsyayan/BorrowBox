import { isConfigured, supabase, getLocalDB, saveLocalDB } from '../lib/supabase';

export const notificationService = {
  async getNotifications(userId) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }

    const db = getLocalDB();
    return db.notifications
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async markAsRead(notificationId) {
    if (isConfigured && supabase) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      if (error) throw error;
      return true;
    }

    const db = getLocalDB();
    const notif = db.notifications.find((n) => n.id === notificationId);
    if (notif) {
      notif.is_read = true;
      saveLocalDB(db);
    }
    return true;
  },

  async markAllAsRead(userId) {
    if (isConfigured && supabase) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }

    const db = getLocalDB();
    db.notifications.forEach((n) => {
      if (n.user_id === userId) {
        n.is_read = true;
      }
    });
    saveLocalDB(db);
    return true;
  }
};

export const reportService = {
  async submitReport({ reportedUserId, itemId, reason, description }) {
    const db = getLocalDB();
    const newReport = {
      id: `rep-${Date.now()}`,
      reporter_id: 'current-user',
      reported_user_id: reportedUserId || null,
      item_id: itemId || null,
      reason,
      description: description || '',
      status: 'open',
      created_at: new Date().toISOString()
    };
    db.reports.unshift(newReport);
    saveLocalDB(db);
    return newReport;
  },

  async getReports() {
    const db = getLocalDB();
    return db.reports.map((r) => {
      const reporter = db.users.find((u) => u.id === r.reporter_id);
      const reported = db.users.find((u) => u.id === r.reported_user_id);
      const item = db.items.find((i) => i.id === r.item_id);
      return { ...r, reporter, reported, item };
    });
  },

  async updateReportStatus(reportId, status) {
    const db = getLocalDB();
    const report = db.reports.find((r) => r.id === reportId);
    if (report) {
      report.status = status;
      report.reviewed_at = new Date().toISOString();
      saveLocalDB(db);
    }
    return report;
  }
};

