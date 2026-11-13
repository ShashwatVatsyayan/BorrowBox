import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  User,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Camera,
  ArrowLeftRight,
  Clock,
  Shield,
  Search,
  Sparkles,
  Heart,
  Bookmark,
  MessageSquare,
  Send,
  Bell
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ClickSpark } from '../../components/common/ClickSpark';
import { itemService } from '../../services/itemService';
import { requestService } from '../../services/requestService';
import { reportService } from '../../services/notificationService';
import { validateBorrowDates } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { REPORT_REASONS } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/dateUtils';

const ANGLE_SLOTS = [
  { label: 'Front / Top View', hint: 'Top and front surface inspection' },
  { label: 'Bottom / Base View', hint: 'Base, sole, and bottom wear' },
  { label: 'Left Side View', hint: 'Left profile and edge detail' },
  { label: 'Right Side View', hint: 'Right profile and ports/tags' }
];

export const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Social interactions state
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [saveNotice, setSaveNotice] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Request modal state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestDates, setRequestDates] = useState({
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    message: '',
    offerItem: ''
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
        setIsLiked(Boolean(data.is_liked));
        setLikesCount(data.likes_count || 0);
        setIsSaved(Boolean(data.is_saved));
        const cmts = await itemService.getComments(id);
        setComments(cmts);
      } catch (err) {
        setError(err.message || 'Could not load item details.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const isOwner = user && item && user.id === item.owner_id;
  const listingType = item?.listing_type || 'borrow';

  const handleToggleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await itemService.toggleLike(item.id);
      setIsLiked(res.liked);
      setLikesCount(res.count);
    } catch (err) {
      alert(err.message || 'Failed to update like.');
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await itemService.toggleSave(item.id);
      setIsSaved(res.saved);
      if (res.saved) {
        setSaveNotice('Saved to your dashboard. You will receive an alert if someone borrows or trades this item.');
        setTimeout(() => setSaveNotice(null), 4000);
      } else {
        setSaveNotice('Item removed from your saved list.');
        setTimeout(() => setSaveNotice(null), 2500);
      }
    } catch (err) {
      alert(err.message || 'Failed to update saved item.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const newComment = await itemService.addComment(item.id, commentText);
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      alert(err.message || 'Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestError(null);

    if (listingType === 'borrow') {
      const dateCheck = validateBorrowDates(requestDates.startDate, requestDates.endDate);
      if (!dateCheck.valid) {
        setRequestError(dateCheck.error);
        return;
      }
    } else if (listingType === 'trade' && !requestDates.offerItem.trim()) {
      setRequestError('Please specify the item you are proposing to trade or exchange.');
      return;
    } else if (listingType === 'wanted' && !requestDates.offerItem.trim()) {
      setRequestError('Please specify the item you can provide to this student.');
      return;
    }

    setSubmittingRequest(true);
    try {
      const fullMessage = listingType === 'trade'
        ? `[Trade Offer: ${requestDates.offerItem.trim()}] ${requestDates.message.trim()}`
        : listingType === 'wanted'
        ? `[Item Offered: ${requestDates.offerItem.trim()}] ${requestDates.message.trim()}`
        : requestDates.message;

      await requestService.createRequest({
        itemId: item.id,
        startDate: requestDates.startDate,
        endDate: requestDates.endDate,
        message: fullMessage,
        requestType: listingType,
        offerItem: requestDates.offerItem.trim()
      });

      setRequestSuccess(true);
      setTimeout(() => {
        setIsRequestModalOpen(false);
        navigate('/app/activity');
      }, 1500);
    } catch (err) {
      setRequestError(err.message || 'Failed to submit request.');
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

  const imagesList = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'];

  const primaryImage = imagesList[selectedImageIndex] || imagesList[0];

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
        {/* 4-Angle Photo Showcase Gallery */}
        <div className="flex flex-col border-b border-surface-border bg-slate-50 dark:bg-slate-900/40">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-950/5">
            <img
              src={primaryImage}
              alt={`${item.title} - ${ANGLE_SLOTS[selectedImageIndex]?.label || 'View'}`}
              className="w-full h-full object-cover transition-opacity duration-200"
            />

            {/* Condition Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-surface-card/95 text-ink-primary shadow-xs border border-surface-border">
                {item.condition}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-surface-card/90 text-ink-primary border border-surface-border backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
                <Camera size={13} className="text-brand-600" />
                <span>{ANGLE_SLOTS[selectedImageIndex]?.label || `Photo ${selectedImageIndex + 1}`}</span>
              </span>
            </div>

            {/* Listing Type Indicator Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              {listingType === 'trade' && (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-600 text-white shadow-xs flex items-center gap-1">
                  <ArrowLeftRight size={13} />
                  <span>Open for Trade</span>
                </span>
              )}
              {listingType === 'wanted' && (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-600 text-white shadow-xs flex items-center gap-1">
                  <Search size={13} />
                  <span>Wanted Request</span>
                </span>
              )}
              {listingType === 'borrow' && (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                  <Clock size={13} />
                  <span>For Borrowing</span>
                </span>
              )}
              {!item.is_active && (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-state-danger text-white">
                  Listing Inactive
                </span>
              )}
            </div>
          </div>

          {/* 4 Angle Clickable Thumbnails Grid */}
          <div className="p-3 bg-surface-card border-t border-surface-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Mandatory 4-Angle Inspection Views
              </span>
              <span className="text-[11px] text-ink-muted">
                {imagesList.length} of 4 angles provided
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ANGLE_SLOTS.map((slot, idx) => {
                const img = imagesList[idx];
                const isSelected = selectedImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (img) setSelectedImageIndex(idx);
                    }}
                    disabled={!img}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 text-left transition-all ${
                      isSelected
                        ? 'border-brand-600 ring-2 ring-brand-600/30 shadow-xs'
                        : img
                        ? 'border-surface-border opacity-80 hover:opacity-100 hover:border-slate-400'
                        : 'border-dashed border-surface-border opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {img ? (
                      <>
                        <img src={img} alt={slot.label} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[10px] text-white font-medium py-0.5 text-center truncate px-1">
                          {slot.label}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center text-[10px] text-ink-muted">
                        <span>Missing</span>
                        <span className="truncate">{slot.label}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 sm:p-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-brand-600 tracking-wider uppercase">
                {item.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-ink-primary mt-1">
                {item.title}
              </h1>
            </div>

            {/* Social Interaction Buttons: Like, Save, Comments */}
            <div className="flex items-center gap-2 self-start shrink-0">
              <ClickSpark
                sparkColor="#ff6b00"
                shape="line"
                sparkCount={8}
                sparkSize={14}
                sparkRadius={30}
                duration={500}
              >
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isLiked
                      ? 'bg-rose-50 text-rose-600 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800'
                      : 'bg-surface-card text-ink-muted border-surface-border hover:text-ink-primary hover:border-slate-400'
                  }`}
                  aria-label={isLiked ? 'Unlike item' : 'Like item'}
                >
                  <Heart size={15} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                  <span>{likesCount}</span>
                </button>
              </ClickSpark>

              <button
                type="button"
                onClick={handleToggleSave}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isSaved
                    ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800'
                    : 'bg-surface-card text-ink-muted border-surface-border hover:text-ink-primary hover:border-slate-400'
                }`}
                aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
              >
                <Bookmark size={15} className={isSaved ? 'fill-amber-500 text-amber-500' : ''} />
                <span>{isSaved ? 'Saved' : 'Save for Later'}</span>
              </button>

              <a
                href="#campus-comments"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-surface-card text-ink-muted border-surface-border hover:text-ink-primary hover:border-slate-400 transition-all"
                aria-label="View comments"
              >
                <MessageSquare size={15} />
                <span>{comments.length}</span>
              </a>
            </div>
          </div>

          {saveNotice && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
              <Bell size={15} className="shrink-0 text-amber-600" />
              <span>{saveNotice}</span>
            </div>
          )}

          {/* Listing Intent Highlight Box */}
          {listingType === 'trade' && (
            <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide mb-1">
                <ArrowLeftRight size={14} />
                <span>Trade / Barter Preference</span>
              </div>
              <p className="text-sm font-semibold text-ink-primary">
                {item.trade_preference || 'Open to equal value barter (clothes, shoes, gadgets, or course gear).'}
              </p>
              <p className="text-[11px] text-ink-muted mt-1.5">
                Propose an item you wish to swap in exchange. Physical trade condition must be verified by both students upon meeting.
              </p>
            </div>
          )}

          {listingType === 'wanted' && (
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-1">
                <Search size={14} />
                <span>Student Wanted Notice</span>
              </div>
              <p className="text-sm font-semibold text-ink-primary">
                Needed by: <span className="text-amber-900 dark:text-amber-200">{item.needed_by || 'Urgent / Exam or Class need'}</span>
              </p>
              <p className="text-[11px] text-ink-muted mt-1.5">
                If you have this item in your hostel room or backpack, click "Offer Item to Student" to coordinate with them.
              </p>
            </div>
          )}

          {listingType === 'borrow' && (
            <div className="p-4 rounded-xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wide mb-1">
                <Clock size={14} />
                <span>Allowed Borrowing Period</span>
              </div>
              <p className="text-sm font-semibold text-ink-primary">
                {item.lending_duration || 'Flexible borrowing period by student mutual agreement'}
              </p>
              <p className="text-[11px] text-ink-muted mt-1.5">
                Please return this item on or before the agreed return timestamp to maintain campus trust score.
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">Item Description</h3>
            <p className="text-sm text-ink-primary leading-relaxed whitespace-pre-line bg-surface-base p-4 rounded-xl border border-surface-border">
              {item.description}
            </p>
          </div>

          {/* Campus Location */}
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-surface-base border border-surface-border text-xs text-ink-muted">
            <MapPin size={16} className="text-brand-600 shrink-0" />
            <div>
              <p className="font-semibold text-ink-primary">Campus Pickup Landmark</p>
              <p>{item.location_label}</p>
            </div>
          </div>

          {/* Owner Info Preview */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-surface-border bg-surface-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-sm">
                {item.owner?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-xs font-bold text-ink-primary">{item.owner?.full_name || 'Verified Student'}</p>
                <p className="text-[11px] text-ink-muted">{item.owner?.university_email}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified Campus Peer
            </span>
          </div>

          {/* In-Person Verification & Zero-Fault Platform Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-surface-border text-[11px] text-ink-muted space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-ink-primary">
              <Shield size={13} className="text-brand-600" />
              <span>Campus Safety & Zero-Fault Policy</span>
            </div>
            <p>
              Inspect all 4 sides (top, bottom, and side profiles) before accepting handoff. As stated in our Terms and Privacy Policy, peer loans and trades are private student agreements, and BorrowBox bears zero fault for post-trade condition disputes or damages.
            </p>
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
                  className="w-full sm:w-auto sm:min-w-[220px]"
                  disabled={!item.is_active}
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  {listingType === 'trade' && 'Propose Trade / Barter'}
                  {listingType === 'wanted' && 'Offer Item to Student'}
                  {listingType === 'borrow' && 'Request to Borrow'}
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

      {/* Campus Questions & Comments Section */}
      <div id="campus-comments" className="mt-6 bg-surface-card rounded-2xl border border-surface-border overflow-hidden shadow-xs p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-brand-600" />
            <h2 className="text-base sm:text-lg font-bold text-ink-primary">
              Campus Questions & Comments ({comments.length})
            </h2>
          </div>
          <span className="text-xs text-ink-muted">Public peer thread</span>
        </div>

        <p className="text-xs text-ink-muted mb-4">
          Have questions about sizing, battery life, condition, or campus pickup spot? Ask here before requesting.
        </p>

        {/* Existing Comments Thread */}
        <div className="space-y-3 mb-6">
          {comments.length === 0 ? (
            <div className="text-center py-6 px-4 rounded-xl bg-surface-base border border-surface-border">
              <p className="text-xs text-ink-muted">No questions asked yet. Be the first to ask the owner a question.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3.5 rounded-xl bg-surface-base border border-surface-border flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/60 border border-brand-300 dark:border-brand-800 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {comment.user_name?.charAt(0) || 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-ink-primary">{comment.user_name || 'Student'}</span>
                    <span className="text-[10px] text-ink-muted flex items-center gap-1">
                      <Clock size={11} />
                      {formatRelativeTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary mt-1 whitespace-pre-wrap leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Post Comment Form */}
        <form onSubmit={handleAddComment} className="flex flex-col gap-2.5">
          <label htmlFor="commentInput" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Ask a Question or Leave a Comment
          </label>
          <div className="relative">
            <textarea
              id="commentInput"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="e.g. Is this still available for Monday? What size is the blazer? Does the charger come with it?"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-card text-ink-primary text-xs outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 placeholder:text-ink-light"
            />
          </div>
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submittingComment}
              disabled={!commentText.trim()}
              className="gap-1.5"
            >
              <Send size={14} />
              <span>Post Comment</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Dynamic Request / Trade / Offer Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title={
          listingType === 'trade'
            ? `Propose Trade for "${item.title}"`
            : listingType === 'wanted'
            ? `Offer Item for "${item.title}"`
            : `Request to Borrow "${item.title}"`
        }
      >
        {requestSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-center flex flex-col items-center gap-2">
            <CheckCircle2 size={32} className="text-emerald-600" />
            <p className="font-bold text-sm">
              {listingType === 'trade' ? 'Trade Proposal Submitted!' : listingType === 'wanted' ? 'Offer Submitted to Student!' : 'Borrow Request Submitted!'}
            </p>
            <p className="text-xs">The owner has been notified and can review your submission in their dashboard.</p>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="flex flex-col gap-4">
            {requestError && <ErrorMessage message={requestError} />}

            {/* Trade specifics */}
            {listingType === 'trade' && (
              <div className="flex flex-col gap-3">
                <Input
                  label="What item are you offering to swap?"
                  id="offerItem"
                  type="text"
                  placeholder="e.g. Navy Blue Blazer Size 42, Nike Air Max 8, or JBL Earbuds"
                  value={requestDates.offerItem}
                  onChange={(e) => setRequestDates({ ...requestDates, offerItem: e.target.value })}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tradeNotes" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Condition & Barter Notes
                  </label>
                  <textarea
                    id="tradeNotes"
                    rows={3}
                    placeholder="Mention the condition of your item, sizes, and preferred campus meetup area..."
                    value={requestDates.message}
                    onChange={(e) => setRequestDates({ ...requestDates, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-surface-border text-ink-primary text-xs outline-none focus:border-brand-600"
                  />
                </div>
              </div>
            )}

            {/* Wanted specifics */}
            {listingType === 'wanted' && (
              <div className="flex flex-col gap-3">
                <Input
                  label="What item can you provide?"
                  id="offerItem"
                  type="text"
                  placeholder="e.g. Casio fx-991CW Calculator, Mini Drafter with Sheet Clips"
                  value={requestDates.offerItem}
                  onChange={(e) => setRequestDates({ ...requestDates, offerItem: e.target.value })}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="wantedNotes" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Offer Details & Availability
                  </label>
                  <textarea
                    id="wantedNotes"
                    rows={3}
                    placeholder="Describe your item condition and when you can meet on campus..."
                    value={requestDates.message}
                    onChange={(e) => setRequestDates({ ...requestDates, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-surface-border text-ink-primary text-xs outline-none focus:border-brand-600"
                  />
                </div>
              </div>
            )}

            {/* Standard Borrow specifics */}
            {listingType === 'borrow' && (
              <>
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
              </>
            )}

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-[11px] leading-relaxed">
              <strong>Zero-Fault Campus Agreement:</strong> By submitting, you agree to meet in safe public campus areas, inspect items across all 4 angles, and acknowledge BorrowBox holds zero liability for peer exchanges.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
              <Button variant="outline" size="sm" onClick={() => setIsRequestModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={submittingRequest}>
                {listingType === 'trade' ? 'Send Trade Proposal' : listingType === 'wanted' ? 'Send Offer' : 'Submit Request'}
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
                className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-surface-border text-xs outline-none focus:border-brand-600 bg-surface-card text-ink-primary"
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
                className="w-full px-3 py-2 rounded-lg border border-surface-border text-xs outline-none focus:border-brand-600 bg-surface-card text-ink-primary"
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
