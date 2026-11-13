import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Loader } from '../../components/common/Loader';
import { useNotifications } from '../../hooks/useNotifications';
import { formatRelativeTime } from '../../utils/dateUtils';

export const NotificationsPage = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">Notifications</h1>
          <p className="text-xs text-ink-muted mt-0.5">Alerts for your borrow requests and approvals</p>
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={markAllAsRead} className="gap-1.5 self-start sm:self-auto">
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {loading ? (
        <Loader label="Loading notifications..." fullPage />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications Yet"
          description="You'll be notified here when someone requests your items or approves your requests."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.is_read && markAsRead(notif.id)}
              className={`p-4 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer ${
                notif.is_read
                  ? 'bg-surface-card border-surface-border text-ink-muted'
                  : 'bg-teal-50/40 border-brand-200 text-ink-primary shadow-xs'
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                  notif.is_read ? 'bg-slate-300' : 'bg-brand-600'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm font-semibold truncate ${notif.is_read ? 'text-ink-primary' : 'text-brand-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[11px] text-ink-muted shrink-0 flex items-center gap-1">
                    <Clock size={12} />
                    {formatRelativeTime(notif.created_at)}
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">{notif.message}</p>
                <div className="mt-2.5 flex items-center gap-3">
                  {notif.related_item_id ? (
                    <Link
                      to={`/app/items/${notif.related_item_id}`}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      View Item -&gt;
                    </Link>
                  ) : (
                    <Link
                      to="/app/activity"
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      View in Activity -&gt;
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

