import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Package } from 'lucide-react';
import { RequestStatusBadge } from './RequestStatusBadge';
import { RequestActions } from './RequestActions';
import { formatDate } from '../../utils/dateUtils';

export const RequestCard = ({
  request,
  isOwner,
  onApprove,
  onReject,
  onCancel,
  onMarkReturn,
  onConfirmReturn
}) => {
  const item = request.item;
  const otherParty = isOwner ? request.borrower : item?.owner;

  return (
    <div className="bg-surface-card rounded-xl border border-surface-border p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-ink-muted shrink-0 overflow-hidden">
            {item?.images && item.images.length > 0 ? (
              <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <Package size={20} />
            )}
          </div>
          <div>
            <Link
              to={`/app/items/${item?.id}`}
              className="text-sm font-semibold text-ink-primary hover:text-brand-600 transition-colors line-clamp-1"
            >
              {item?.title || 'Unknown Item'}
            </Link>
            <p className="text-xs text-ink-muted">
              {isOwner ? 'Requested by' : 'Lender'}:{' '}
              <span className="font-medium text-ink-primary">
                {otherParty?.full_name || 'Verified Student'}
              </span>
            </p>
          </div>
        </div>

        <RequestStatusBadge status={request.status} />
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 text-xs text-ink-muted bg-slate-50 px-3 py-2 rounded-lg">
        <Calendar size={14} className="text-slate-400 shrink-0" />
        <span>
          <strong className="text-ink-primary font-medium">{formatDate(request.start_date)}</strong> to{' '}
          <strong className="text-ink-primary font-medium">{formatDate(request.end_date)}</strong>
        </span>
      </div>

      {/* Borrower Message */}
      {request.message && (
        <div className="text-xs text-ink-muted italic bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
          "{request.message}"
        </div>
      )}

      {/* Actions */}
      <RequestActions
        request={request}
        isOwner={isOwner}
        onApprove={onApprove}
        onReject={onReject}
        onCancel={onCancel}
        onMarkReturn={onMarkReturn}
        onConfirmReturn={onConfirmReturn}
      />
    </div>
  );
};

