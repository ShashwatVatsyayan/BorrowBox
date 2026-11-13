import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  BookOpen,
  Clock,
  ArrowRight,
  Search,
  PlusCircle,
  ArrowLeftRight,
  HelpCircle,
  CheckCircle2,
  Filter,
  X,
  Bookmark
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { ItemGrid } from '../../components/items/ItemGrid';
import { Loader } from '../../components/common/Loader';
import { CATEGORIES, LISTING_TYPES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { useItems } from '../../hooks/useItems';
import { useRequests } from '../../hooks/useRequests';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [selectedListingType, setSelectedListingType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { items, loading: itemsLoading } = useItems({ includeInactive: false });
  const { receivedRequests, sentRequests, loading: requestsLoading } = useRequests();
  const navigate = useNavigate();

  const pendingReceived = receivedRequests.filter((r) => r.status === 'pending');
  const activeBorrowings = sentRequests.filter((r) => r.status === 'approved' || r.status === 'return_pending');
  const myListings = items.filter((i) => i.owner_id === user?.id);
  const tradeListings = items.filter((i) => i.listing_type === 'trade');
  const wantedListings = items.filter((i) => i.listing_type === 'wanted');
  const savedListings = items.filter((i) => i.is_saved);

  // Filter items for the unified feed
  const filteredItems = items.filter((item) => {
    // Type or Saved filter
    if (selectedListingType === 'saved') {
      if (!item.is_saved) return false;
    } else if (selectedListingType !== 'All') {
      const type = item.listing_type || 'borrow';
      if (type !== selectedListingType) return false;
    }
    // Category filter
    if (selectedCategory !== 'All') {
      if (item.category !== selectedCategory) return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchLoc = item.location_label?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc) return false;
    }
    return true;
  });

  return (
    <PageContainer>
      {/* Unified Greeting & Command Header - Refined Verso Editorial Styling */}
      <div className="mb-6 p-6 sm:p-7 rounded-3xl bg-[#FBF9F4] dark:bg-zinc-900/90 border border-[#0F382A]/10 dark:border-emerald-500/20 shadow-xs relative overflow-hidden">
        {/* Subtle decorative radial accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Campus Exchange Network</span>
              </span>
              <span className="text-xs text-ink-muted font-medium">Chandigarh University</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-primary tracking-tight">
              Welcome, {user?.full_name?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-xl leading-relaxed">
              Your verified university hub to borrow textbooks, trade electronics, and request hostel essentials.
            </p>
          </div>

          {/* Unified Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/app/items/new"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#0F382A] hover:bg-[#164e3b] text-[#F5F2EB] font-semibold text-xs sm:text-sm transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle size={15} />
              <span>List to Lend</span>
            </Link>
            <Link
              to="/app/items/new"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#D4A853] bg-[#D4A853]/10 hover:bg-[#D4A853]/20 text-[#0F382A] dark:text-[#D4A853] font-semibold text-xs sm:text-sm transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <ArrowLeftRight size={15} />
              <span>Offer for Trade</span>
            </Link>
            <Link
              to="/app/items/new"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-surface-border bg-surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-ink-primary font-semibold text-xs sm:text-sm transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <HelpCircle size={15} />
              <span>Post Wanted</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Unified Role Metrics Grid (Lender, Borrower, Trader) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
        <Link
          to="/app/listings"
          className="p-4 rounded-2xl bg-surface-card border border-surface-border/90 hover:border-emerald-600/40 transition-all duration-200 shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-muted group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">My Listings</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              <Package size={15} />
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-ink-primary">{myListings.length}</p>
          <p className="text-[11px] text-ink-light mt-1">Items you are lending</p>
        </Link>

        <Link
          to="/app/borrowings"
          className="p-4 rounded-2xl bg-surface-card border border-surface-border/90 hover:border-emerald-600/40 transition-all duration-200 shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-muted group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">Active Borrows</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              <BookOpen size={15} />
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-ink-primary">{activeBorrowings.length}</p>
          <p className="text-[11px] text-ink-light mt-1">Borrowed from peers</p>
        </Link>

        <button
          type="button"
          onClick={() => {
            setSelectedListingType(selectedListingType === 'trade' ? 'All' : 'trade');
          }}
          className={`p-4 rounded-2xl border text-left transition-all duration-200 shadow-xs hover:shadow-md group ${
            selectedListingType === 'trade'
              ? 'bg-[#D4A853]/10 border-[#D4A853] ring-1 ring-[#D4A853]'
              : 'bg-surface-card border-surface-border/90 hover:border-[#D4A853]/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-muted group-hover:text-[#D4A853] transition-colors">Trade & Barter</span>
            <span className="p-1.5 rounded-lg bg-[#D4A853]/15 text-[#D4A853]">
              <ArrowLeftRight size={15} />
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-ink-primary">{tradeListings.length}</p>
          <p className="text-[11px] text-ink-light mt-1">Available for swap</p>
        </button>

        <Link
          to="/app/requests"
          className="p-4 rounded-2xl bg-surface-card border border-surface-border/90 hover:border-rose-400 transition-all duration-200 shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-muted group-hover:text-rose-600 transition-colors">Pending Requests</span>
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Clock size={15} />
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-ink-primary">{pendingReceived.length}</p>
          <p className="text-[11px] text-ink-light mt-1">Waiting for approval</p>
        </Link>
      </div>

      {/* Unified Search & Mode Switcher Bar */}
      <div className="flex flex-col gap-3.5 mb-6">
        <div className="relative flex items-center">
          <label htmlFor="dashboard-search" className="sr-only">
            Search campus items
          </label>
          <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
          <input
            id="dashboard-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clothes, formal shoes, calculators, kettles, notes, sports gear..."
            aria-label="Search campus items"
            className="w-full min-h-[48px] pl-11 pr-11 py-2.5 rounded-full bg-surface-card border border-surface-border text-sm text-ink-primary placeholder:text-ink-light outline-none focus:border-[#0F382A] focus:ring-2 focus:ring-[#0F382A]/20 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 p-1 rounded-full text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
              aria-label="Clear search query"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Unified Mode Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedListingType('All')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all border ${
              selectedListingType === 'All'
                ? 'bg-[#0F382A] text-[#F5F2EB] border-[#0F382A] shadow-xs'
                : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Campus Items ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedListingType('borrow')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all border flex items-center gap-1.5 ${
              selectedListingType === 'borrow'
                ? 'bg-[#0F382A] text-[#F5F2EB] border-[#0F382A] shadow-xs'
                : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock size={12} />
            <span>To Borrow ({items.filter((i) => (i.listing_type || 'borrow') === 'borrow').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedListingType('trade')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all border flex items-center gap-1.5 ${
              selectedListingType === 'trade'
                ? 'bg-[#D4A853] text-[#080C0A] border-[#D4A853] shadow-xs font-bold'
                : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeftRight size={12} />
            <span>Open for Trade ({tradeListings.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedListingType('wanted')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all border flex items-center gap-1.5 ${
              selectedListingType === 'wanted'
                ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle size={12} />
            <span>Wanted Requests ({wantedListings.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedListingType('saved')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all border flex items-center gap-1.5 ${
              selectedListingType === 'saved'
                ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark size={12} />
            <span>Saved for Later ({savedListings.length})</span>
          </button>
        </div>

        {/* Student & Hosteler Categories Rail */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-colors border ${
              selectedCategory === 'All'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold'
                : 'bg-surface-card text-ink-muted border-surface-border hover:text-ink-primary'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat === selectedCategory ? 'All' : cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-colors border ${
                selectedCategory === cat
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold'
                  : 'bg-surface-card text-ink-muted border-surface-border hover:text-ink-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary tracking-tight">
            {selectedListingType === 'trade'
              ? 'Campus Trade & Barter Offers'
              : selectedListingType === 'wanted'
              ? 'Items Wanted by Students'
              : selectedListingType === 'borrow'
              ? 'Items Available for Borrowing'
              : 'Live Campus Sharing Feed'}
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} across campus
          </p>
        </div>
        {(selectedListingType !== 'All' || selectedCategory !== 'All' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedListingType('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Unified Listings Grid */}
      {itemsLoading ? (
        <Loader label="Loading unified campus feed..." />
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-3xl bg-[#FBF9F4] dark:bg-zinc-900/60 border border-[#0F382A]/10 dark:border-emerald-500/20 shadow-xs">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center border border-emerald-200/80 dark:border-emerald-800/40">
            <Package size={22} />
          </div>
          <h3 className="font-serif text-lg font-bold text-ink-primary mb-1">No items found</h3>
          <p className="text-xs sm:text-sm text-ink-muted max-w-sm mx-auto mb-5 leading-relaxed">
            No campus listings match your current filters. Be the first to list an item, propose a trade, or post a request!
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link
              to="/app/items/new"
              className="px-5 py-2.5 rounded-full bg-[#0F382A] hover:bg-[#164e3b] text-[#F5F2EB] font-semibold text-xs sm:text-sm transition-all shadow-xs hover:-translate-y-0.5"
            >
              List an Item
            </Link>
          </div>
        </div>
      ) : (
        <ItemGrid items={filteredItems} />
      )}
    </PageContainer>
  );
};

export default DashboardPage;
