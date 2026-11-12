import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, User, ShieldAlert, ArrowLeft, Calendar, CheckCircle2, AlertTriangle, Flag } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { itemService } from '../../services/itemService';
import { requestService } from '../../services/requestService';
import { reportService } from '../../services/notificationService';
import { validateBorrowDates } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { REPORT_REASONS } from '../../utils/constants';

export const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Request to borrow state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestDates, setRequestDates] = useState({
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    message: ''
  });
  const [requestError, setRequestError] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState({ reason: REPORT_REASONS[0], description: '' });
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await itemService.getItemById(id);
        setItem(data);
      } catch (err) {
        setError(err.message || 'Could not load item details.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const isOwner = user && item && user.id === item.owner_id;

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestError(null);
    const dateCheck = validateBorrowDates(requestDates.startDate, requestDates.endDate);
    if (!dateCheck.valid) {
      setRequestError(dateCheck.error);
      return;
    }

    setSubmittingRequest(true);
    try {
      await requestService.createRequest({
        itemId: item.id,
        startDate: requestDates.startDate,
        endDate: requestDates.endDate,
        message: requestDates.message
      });
      setRequestSuccess(true);
      setTimeout(() => {
        setIsRequestModalOpen(false);
        navigate('/app/activity');
      }, 1500);
    } catch (err) {
      setRequestError(err.message || 'Failed to submit borrow request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await reportService.submitReport({
        reportedUserId: item.owner_id,
        itemId: item.id,
        reason: reportData.reason,
        description: reportData.description
      });
      setReportSubmitted(true);
      setTimeout(() => setIsReportModalOpen(false), 1500);
    } catch (err) {
      alert('Failed to submit report.');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Loader label="Loading item details..." />
      </PageContainer>
    );
  }

  if (error || !item) {
    return (
      <PageContainer>
        <ErrorMessage message={error || 'Item not found.'} />
        <div className="mt-4">
          <Link to="/app/explore" className="text-sm font-semibold text-brand-600 hover:underline">
            Back to Explore
          </Link>
        </div>
      </PageContainer>
    );
  }

  const primaryImage = item.images && item.images.length > 0
    ? item.images[0]
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  return (
    <PageContainer>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink-primary mb-4"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden shadow-xs">
        {/* Main Image */}
        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
          <img src={primaryImage} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-white/95 text-ink-primary shadow-xs border border-slate-200">
              {item.condition}
            </span>
          </div>
          {!item.is_active && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-md text-xs font-bold bg-state-danger text-white">
              Listing Inactive
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-5 sm:p-6 flex flex-col gap-5">
          <div>
            <span className="text-xs font-semibold text-brand-600 tracking-wider uppercase">
              {item.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-ink-primary mt-1">
              {item.title}
            </h1>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">Description</h3>
            <p className="text-sm text-ink-primary leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
              {item.description}
            </p>
          </div>

          {/* Campus Location */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-ink-muted">
            <MapPin size={16} className="text-brand-600 shrink-0" />
            <div>
              <p className="font-semibold text-ink-primary">Pickup Area</p>
              <p>{item.location_label}</p>
            </div>
          </div>

          {/* Owner Info Preview */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-surface-border bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-sm">
                {item.owner?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-xs font-bold text-ink-primary">{item.owner?.full_name || 'Verified Student'}</p>
                <p className="text-[11px] text-ink-muted">{item.owner?.university_email}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified Lender
            </span>
          </div>

          {/* Actions Bar */}
          <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3">
            {isOwner ? (
              <div className="w-full flex items-center gap-2">
                <Link to={`/app/items/${item.id}/edit`} className="flex-1">
                  <Button variant="secondary" className="w-full">Edit Listing</Button>
                </Link>
                <Link to="/app/listings" className="flex-1">
                  <Button variant="outline" className="w-full">Manage My Listings</Button>
                </Link>
              </div>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto sm:min-w-[200px]"
                  disabled={!item.is_active}
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  Request to Borrow
                </Button>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-state-danger transition-colors p-2"
                >
                  <Flag size={14} />
                  <span>Report Listing</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Borrow Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title={`Request to Borrow "${item.title}"`}
      >
        {requestSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-center flex flex-col items-center gap-2">
            <CheckCircle2 size={32} className="text-emerald-600" />
            <p className="font-bold text-sm">Request Submitted Successfully!</p>
            <p className="text-xs">The owner has been notified and can review your date request.</p>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="flex flex-col gap-4">
            {requestError && <ErrorMessage message={requestError} />}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Date"
                id="startDate"
                type="date"
                value={requestDates.startDate}
                onChange={(e) => setRequestDates({ ...requestDates, startDate: e.target.value })}
                required
              />
              <Input
                label="End Date"
                id="endDate"
                type="date"
                value={requestDates.endDate}
                onChange={(e) => setRequestDates({ ...requestDates, endDate: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Note for Owner (Optional)
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder="Mention why you need the item, your section, or exam date..."
                value={requestDates.message}
                onChange={(e) => setRequestDates({ ...requestDates, message: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-border text-ink-primary text-xs outline-none focus:border-brand-600"
              />
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
              <strong>Campus Lending Rule:</strong> Returning items damaged or failing to return by the agreed date will result in account suspension and moderation review.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
              <Button variant="outline" size="sm" onClick={() => setIsRequestModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={submittingRequest}>
                Submit Request
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Listing or User"
      >
        {reportSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-center text-xs font-semibold">
            Report submitted to campus moderation. Thank you for keeping the community safe.
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Reason
              </label>
              <select
                value={reportData.reason}
                onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-surface-border text-xs outline-none focus:border-brand-600"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Details
              </label>
              <textarea
                rows={3}
                placeholder="Provide specific details for the moderation team..."
                value={reportData.description}
                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-border text-xs outline-none focus:border-brand-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
              <Button variant="outline" size="sm" onClick={() => setIsReportModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" size="sm">
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </PageContainer>
  );
};

