import React, { useState } from 'react';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Check, X, RotateCcw, CheckCircle2, ArrowLeftRight } from 'lucide-react';
import { requestService } from '../../services/requestService';

export const RequestActions = ({
  request,
  isOwner,
  onApprove,
  onReject,
  onCancel,
  onMarkReturn,
  onConfirmReturn,
  onCompleteTrade
}) => {
  const [activeAction, setActiveAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const isTrade = request.request_type === 'trade' || request.item?.listing_type === 'trade';

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (activeAction === 'approve') await onApprove(request.id);
      if (activeAction === 'reject') await onReject(request.id);
      if (activeAction === 'cancel') await onCancel(request.id);
      if (activeAction === 'return_pending') await onMarkReturn(request.id);
      if (activeAction === 'confirm_return') await onConfirmReturn(request.id);
      if (activeAction === 'complete_trade') {
        if (onCompleteTrade) {
          await onCompleteTrade(request.id);
        } else {
          await requestService.completeTrade(request.id);
        }
      }
      setActiveAction(null);
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
      {/* Owner Actions for Pending Request */}
      {isOwner && request.status === 'pending' && (
        <>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setActiveAction('approve')}
            className="gap-1.5"
          >
            <Check size={16} />
            <span>{isTrade ? 'Approve Trade Offer' : 'Approve Request'}</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveAction('reject')}
            className="text-state-danger hover:bg-red-50 hover:border-red-200"
          >
            <X size={16} />
            <span>Decline</span>
          </Button>
        </>
      )}

      {/* Requester Action for Pending Request */}
      {!isOwner && request.status === 'pending' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setActiveAction('cancel')}
          className="text-ink-muted hover:text-state-danger"
        >
          Cancel Request
        </Button>
      )}

      {/* Trade Completion Action for Approved Trade (Both participants can confirm exchange) */}
      {isTrade && request.status === 'approved' && (
        <Button
          size="sm"
          variant="primary"
          onClick={() => setActiveAction('complete_trade')}
          className="gap-1.5 bg-[#D4A853] hover:bg-[#b88b38] text-[#080C0A] font-bold shadow-xs"
        >
          <ArrowLeftRight size={16} />
          <span>Confirm Permanent Trade Completed</span>
        </Button>
      )}

      {/* Borrower Action for Approved (Active) Borrowing (Not trade) */}
      {!isTrade && !isOwner && request.status === 'approved' && (
        <Button
          size="sm"
          variant="primary"
          onClick={() => setActiveAction('return_pending')}
          className="gap-1.5"
        >
          <RotateCcw size={16} />
          <span>Mark as Returned</span>
        </Button>
      )}

      {/* Owner Action for Return Pending (Borrowing only) */}
      {!isTrade && isOwner && request.status === 'return_pending' && (
        <Button
          size="sm"
          variant="primary"
          onClick={() => setActiveAction('confirm_return')}
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckCircle2 size={16} />
          <span>Confirm Return Received</span>
        </Button>
      )}

      {/* Borrower view when Return is Pending */}
      {!isTrade && !isOwner && request.status === 'return_pending' && (
        <span className="text-xs text-sky-700 font-medium italic">
          Waiting for owner to inspect and confirm receipt
        </span>
      )}

      {/* Completed State */}
      {request.status === 'completed' && (
        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 size={14} />
          <span>{isTrade ? 'Permanent Trade Completed' : 'Transaction Completed'}</span>
        </span>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={activeAction === 'approve'}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
        title={isTrade ? 'Approve Trade Proposal' : 'Approve Borrow Request'}
        message={
          isTrade
            ? `Are you sure you want to accept this trade offer? Both parties will meet to inspect items and exchange.`
            : `Are you sure you want to approve this request for dates ${request.start_date} to ${request.end_date}? The system will verify that no overlapping approved bookings exist.`
        }
        confirmLabel="Approve"
        loading={loading}
      />

      <ConfirmDialog
        isOpen={activeAction === 'reject'}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
        title={isTrade ? 'Decline Trade Proposal' : 'Decline Borrow Request'}
        message="Are you sure you want to decline this request? This action cannot be reversed."
        confirmLabel="Decline"
        isDestructive
        loading={loading}
      />

      <ConfirmDialog
        isOpen={activeAction === 'cancel'}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
        title="Cancel Request"
        message="Are you sure you want to cancel your pending request?"
        confirmLabel="Cancel Request"
        isDestructive
        loading={loading}
      />

      <ConfirmDialog
        isOpen={activeAction === 'return_pending'}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
        title="Initiate Return"
        message="Have you handed the item back to the owner? Once initiated, the owner will be prompted to confirm receipt."
        confirmLabel="Yes, Item Handed Back"
        loading={loading}
      />

      <ConfirmDialog
        isOpen={activeAction === 'confirm_return'}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
        title="Confirm Item Return"
        message="Have you inspected the item and confirmed it was returned in satisfactory condition? This will mark the transaction as completed."
        confirmLabel="Confirm Receipt"
        loading={loading}
      />

      <ConfirmDialog
        isOpen={activeAction === 'complete_trade'}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
        title="Confirm Permanent Trade Completed"
        message="Have both students met in person, inspected each other's items across all 4 angles, and finalized the permanent exchange? This will mark the listing as traded and permanently close the exchange."
        confirmLabel="Confirm Permanent Trade"
        loading={loading}
      />
    </div>
  );
};

