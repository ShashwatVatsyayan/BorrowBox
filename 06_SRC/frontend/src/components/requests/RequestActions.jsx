import React, { useState } from 'react';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Check, X, RotateCcw, CheckCircle2 } from 'lucide-react';

export const RequestActions = ({
  request,
  isOwner,
  onApprove,
  onReject,
  onCancel,
  onMarkReturn,
  onConfirmReturn
}) => {
  const [activeAction, setActiveAction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (activeAction === 'approve') await onApprove(request.id);
      if (activeAction === 'reject') await onReject(request.id);
      if (activeAction === 'cancel') await onCancel(request.id);
      if (activeAction === 'return_pending') await onMarkReturn(request.id);
      if (activeAction === 'confirm_return') await onConfirmReturn(request.id);
      setActiveAction(null);
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
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
            <span>Approve Request</span>
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

      {/* Borrower Action for Pending Request */}
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

      {/* Borrower Action for Approved (Active) Borrowing */}
      {!isOwner && request.status === 'approved' && (
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

      {/* Owner Action for Return Pending */}
      {isOwner && request.status === 'return_pending' && (
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
      {!isOwner && request.status === 'return_pending' && (
        <span className="text-xs text-sky-700 font-medium italic">
          Waiting for owner to inspect and confirm receipt
        </span>
      )}

      {/* Completed State */}
      {request.status === 'completed' && (
        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 size={14} /> Transaction Completed
        </span>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={activeAction === 'approve'}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
        title="Approve Borrow Request"
        message={`Are you sure you want to approve this request for dates ${request.start_date} to ${request.end_date}? The system will verify that no overlapping approved bookings exist.`}
        confirmLabel="Approve"
        loading={loading}
      />

      <ConfirmDialog
        isOpen={activeAction === 'reject'}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
        title="Decline Borrow Request"
        message="Are you sure you want to decline this borrow request? This action cannot be reversed."
        confirmLabel="Decline"
        isDestructive
        loading={loading}
      />

      <ConfirmDialog
        isOpen={activeAction === 'cancel'}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
        title="Cancel Borrow Request"
        message="Are you sure you want to cancel your pending borrow request?"
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
    </div>
  );
};

