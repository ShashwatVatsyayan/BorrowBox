import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Package, ArrowLeftRight, Tag, MessageSquare } from 'lucide-react';
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
  const navigate = useNavigate();
  const item = request.item;
  const otherParty = isOwner ? request.borrower : item?.owner;
  const isTrade = request.request_type === 'trade' || item?.listing_type === 'trade';
  const dailyPrice = request.daily_price || item?.daily_price || 15;
  const totalAmount = request.total_amount || (dailyPrice * (request.total_days || 3));
  const ownerShare = request.owner_share || Math.round(totalAmount * 0.8);

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
              {isTrade ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4A853]/20 text-[#0F382A] dark:text-[#D4A853] border border-[#D4A853]/40">
                  {item?.is_permanent_trade ? 'Permanent Trade' : 'Trade'}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                  Rental
                </span>
              )}
            </div>
            <p className="text-xs text-ink-muted">
              {isOwner ? 'Rented by' : 'Owner'}:{' '}
              <span className="font-medium text-ink-primary">
                {otherParty?.full_name || 'Verified Student'}
              </span>
            </p>
          </div>
        </div>

        <RequestStatusBadge status={request.status} />
      </div>

      {/* Dates or Rental Timeline */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted bg-slate-50 dark:bg-slate-900/40 px-3 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-slate-400 shrink-0" />
          <span>
            <strong className="text-ink-primary font-medium">{formatDate(request.start_date)}</strong> to{' '}
            <strong className="text-ink-primary font-medium">{formatDate(request.end_date)}</strong>
          </span>
        </div>

        {!isTrade && (
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-emerald-800 dark:text-emerald-300 font-serif">
              INR {totalAmount} total
            </span>
            {isOwner && (
              <span className="text-[11px] text-ink-muted">
                (Your Payout: INR {ownerShare})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Trade Offer Details */}
      {isTrade && (
        <div className="p-3 rounded-xl bg-[#D4A853]/10 dark:bg-[#D4A853]/5 border border-[#D4A853]/30 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#0F382A] dark:text-[#F5F2EB]">
            <ArrowLeftRight size={13} className="text-[#D4A853]" />
            <span>Offered in Exchange: {request.offer_item || 'Item specified in proposal'}</span>
          </div>
          {item?.is_permanent_trade && (
            <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">
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

      {/* Action Bar with Direct Chat Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-surface-border/50">
        {otherParty?.id && (
          <button
            type="button"
            onClick={() => navigate(`/app/messages?userId=${otherParty.id}&itemId=${item?.id}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 py-1 px-2.5 rounded-lg border border-emerald-300/40 bg-emerald-50/60 dark:bg-emerald-950/40"
          >
            <MessageSquare size={13} className="text-[#D4A853]" />
            <span>Chat / Coordinate Pickup</span>
          </button>
        )}

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
    </div>
  );
};


