import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Package, ArrowLeftRight } from 'lucide-react';
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
  onConfirmReturn,
  onCompleteTrade
}) => {
  const item = request.item;
  const otherParty = isOwner ? request.borrower : item?.owner;
  const isTrade = request.request_type === 'trade' || item?.listing_type === 'trade';

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
            <div className="flex items-center gap-2">
              <Link
                to={`/app/items/${item?.id}`}
                className="text-sm font-semibold text-ink-primary hover:text-brand-600 transition-colors line-clamp-1"
              >
                {item?.title || 'Unknown Item'}
              </Link>
              {isTrade && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                  {item?.is_permanent_trade ? 'Permanent Trade' : 'Trade'}
                </span>
              )}
            </div>
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

      {/* Dates or Trade Timeline */}
      <div className="flex items-center gap-2 text-xs text-ink-muted bg-slate-50 dark:bg-slate-900/40 px-3 py-2 rounded-lg">
        <Calendar size={14} className="text-slate-400 shrink-0" />
        <span>
          <strong className="text-ink-primary font-medium">{formatDate(request.start_date)}</strong> to{' '}
          <strong className="text-ink-primary font-medium">{formatDate(request.end_date)}</strong>
        </span>
      </div>

      {/* Trade Offer Details */}
      {isTrade && (
        <div className="p-2.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-purple-900 dark:text-purple-200">
            <ArrowLeftRight size={13} className="text-purple-600" />
            <span>Offered in Exchange: {request.offer_item || 'Item specified in proposal'}</span>
          </div>
          {item?.is_permanent_trade && (
            <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-1">
              Permanent swap: both students keep the exchanged items permanently once trade is completed.
            </p>
          )}
        </div>
      )}

      {/* Borrower Message */}
      {request.message && (
        <div className="text-xs text-ink-muted italic bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
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
        onCompleteTrade={onCompleteTrade}
      />
    </div>
  );
};

