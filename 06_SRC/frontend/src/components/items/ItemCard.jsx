import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Clock, ArrowLeftRight, HelpCircle, Camera, Heart, Bookmark, MessageSquare } from 'lucide-react';
import { ClickSpark } from '../common/ClickSpark';
import { PublicProfileModal } from '../profile/PublicProfileModal';
import { itemService } from '../../services/itemService';

export const ItemCard = ({ item }) => {
  const [isLiked, setIsLiked] = useState(Boolean(item.is_liked));
  const [likesCount, setLikesCount] = useState(item.likes_count || 0);
  const [isSaved, setIsSaved] = useState(Boolean(item.is_saved));
  const [commentsCount] = useState(item.comments_count || 0);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const imageUrl = item.images && item.images.length > 0
    ? item.images[0]
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  const listingType = item.listing_type || 'borrow';
  const photoCount = item.images ? item.images.length : 1;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await itemService.toggleLike(item.id);
      setIsLiked(res.liked);
      setLikesCount(res.count);
    } catch {
      // Ignored
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await itemService.toggleSave(item.id);
      setIsSaved(res.saved);
    } catch {
      // Ignored
    }
  };

  return (
    <Link
      to={`/app/items/${item.id}`}
      className="group flex flex-col bg-surface-card rounded-2xl border border-surface-border overflow-hidden hover:shadow-md hover:border-brand-400 transition-all duration-200"
    >
      {/* Item Image with Fixed Ratio */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Listing Type Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {listingType === 'trade' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs">
              <ArrowLeftRight size={10} />
              <span>For Trade</span>
            </span>
          )}
          {listingType === 'wanted' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600 text-white shadow-xs">
              <HelpCircle size={10} />
              <span>Wanted</span>
            </span>
          )}
          {listingType === 'borrow' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
              <Clock size={10} />
              <span>To Borrow</span>
            </span>
          )}
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-card/90 backdrop-blur-sm text-ink-primary border border-surface-border shadow-xs">
            {item.condition}
          </span>
        </div>

        {/* Photos Count Indicator */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs">
            <Camera size={10} />
            <span>{photoCount} {photoCount >= 4 ? 'Angles' : 'Photos'}</span>
          </span>
        </div>

        {!item.is_active && (
          <div className="absolute inset-0 bg-ink-primary/60 flex items-center justify-center">
            <span className="px-3 py-1 rounded bg-surface-card text-ink-primary font-bold text-xs uppercase tracking-wider">
              Inactive
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <span className="text-[11px] font-semibold text-brand-600 mb-1 line-clamp-1">
          {item.category}
        </span>
        <h3 className="text-sm font-bold text-ink-primary group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-1.5">
          {item.title}
        </h3>

        {/* Lending Time or Trade detail note */}
        {listingType === 'borrow' && item.lending_duration && (
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mb-2">
            <Clock size={11} className="shrink-0" />
            <span className="truncate">Lending time: {item.lending_duration}</span>
          </div>
        )}

        {listingType === 'trade' && (item.trade_item_desired || item.trade_preference) && (
          <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium mb-2">
            <ArrowLeftRight size={11} className="shrink-0" />
            <span className="truncate">
              {item.is_permanent_trade ? 'Permanent Trade: ' : 'Trade for: '}
              {item.trade_item_desired || item.trade_preference}
            </span>
          </div>
        )}

        {listingType === 'wanted' && item.needed_by && (
          <div className="flex items-center gap-1 text-[11px] text-indigo-700 dark:text-indigo-400 font-medium mb-2">
            <HelpCircle size={11} className="shrink-0" />
            <span className="truncate">{item.needed_by}</span>
          </div>
        )}

        <div className="mt-auto pt-2 border-t border-surface-border flex flex-col gap-1 text-[11px] text-ink-muted">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">{item.location_label}</span>
          </div>
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 truncate">
              <User size={12} className="shrink-0 text-slate-400" />
              <span className="truncate">{item.owner?.full_name || 'Verified Student'}</span>
            </div>
            {item.owner_id && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowProfileModal(true);
                }}
                className="text-[10px] font-semibold text-brand-600 hover:text-brand-700 hover:underline shrink-0"
                title="View peer profile & stats"
              >
                View Profile
              </button>
            )}
          </div>
        </div>

        {/* Social Bar (Like with ClickSpark, Comments Count, Save for Later) */}
        <div className="mt-2.5 pt-2 border-t border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* ClickSpark Like Button */}
            <ClickSpark
              sparkColor="#fff"
              shape="line"
              sparkCount={8}
              sparkSize={14}
              sparkRadius={30}
              duration={500}
            >
              <button
                type="button"
                onClick={handleLike}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isLiked
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-500/20'
                    : 'text-ink-muted hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label={isLiked ? 'Unlike listing' : 'Like listing'}
                title={isLiked ? 'Liked' : 'Like'}
              >
                <Heart size={13} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                <span>{likesCount}</span>
              </button>
            </ClickSpark>

            {/* Comment Count Indicator */}
            <div
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-ink-muted hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Campus questions and comments"
            >
              <MessageSquare size={13} />
              <span>{commentsCount}</span>
            </div>
          </div>

          {/* Save for Later Button */}
          <button
            type="button"
            onClick={handleSave}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              isSaved
                ? 'text-brand-600 bg-brand-50 dark:bg-brand-950/40 ring-1 ring-brand-500/20'
                : 'text-ink-muted hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
            title={isSaved ? 'Saved for later (You will be notified on status changes)' : 'Save for later'}
          >
            <Bookmark size={13} className={isSaved ? 'fill-brand-600 text-brand-600' : ''} />
            <span className="text-[11px]">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {showProfileModal && item.owner_id && (
        <PublicProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userId={item.owner_id}
          userName={item.owner?.full_name}
        />
      )}
    </Link>
  );
};

export default ItemCard;
