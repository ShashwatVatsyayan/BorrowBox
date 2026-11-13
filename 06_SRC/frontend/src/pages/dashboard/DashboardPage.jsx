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
  Sparkles,
  ShieldCheck,
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
      {/* Unified Greeting & Command Header */}
      <div className="mb-6 p-5 sm:p-6 rounded-2xl glass-block shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                <ShieldCheck size={12} />
                <span>Unified Campus Hub</span>
              </span>
              <span className="text-xs text-ink-muted">Chandigarh University</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
              Welcome, {user?.full_name?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
              One unified platform to borrow, lend, trade, or request college and hostel essentials
            </p>
          </div>

          {/* Unified Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/app/items/new"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <PlusCircle size={16} />
              <span>List to Lend</span>
            </Link>
            <Link
              to="/app/items/new"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <ArrowLeftRight size={16} />
              <span>Offer for Trade</span>
            </Link>
            <Link
              to="/app/items/new"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <HelpCircle size={16} />
              <span>Post Wanted</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Unified Role Metrics Grid (Lender, Borrower, Trader) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Link
          to="/app/listings"
          className="p-3.5 rounded-xl glass-block hover:border-brand-400 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-ink-muted group-hover:text-brand-600">My Listings</span>
            <Package size={16} className="text-brand-600" />
          </div>
          <p className="text-2xl font-black text-ink-primary">{myListings.length}</p>
          <p className="text-[10px] text-ink-light mt-0.5">Items you are lending</p>
        </Link>

        <Link
          to="/app/borrowings"
          className="p-3.5 rounded-xl glass-block hover:border-indigo-400 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-ink-muted group-hover:text-indigo-600">Active Borrows</span>
            <BookOpen size={16} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-ink-primary">{activeBorrowings.length}</p>
          <p className="text-[10px] text-ink-light mt-0.5">Borrowed from peers</p>
        </Link>

        <button
          type="button"
          onClick={() => {
            setSelectedListingType(selectedListingType === 'trade' ? 'All' : 'trade');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all shadow-xs group ${
            selectedListingType === 'trade'
              ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-500 ring-1 ring-amber-500'
              : 'glass-block hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-ink-muted group-hover:text-amber-600">Trade & Barter</span>
            <ArrowLeftRight size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-ink-primary">{tradeListings.length}</p>
          <p className="text-[10px] text-ink-light mt-0.5">Available for swap</p>
        </button>

        <Link
          to="/app/requests"
          className="p-3.5 rounded-xl glass-block hover:border-rose-400 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-ink-muted group-hover:text-rose-600">Pending Requests</span>
            <Clock size={16} className="text-rose-500" />
          </div>
          <p className="text-2xl font-black text-ink-primary">{pendingReceived.length}</p>
          <p className="text-[10px] text-ink-light mt-0.5">Waiting for your approval</p>
        </Link>
      </div>

      {/* Unified Search & Mode Switcher Bar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative flex items-center">
          <label htmlFor="dashboard-search" className="sr-only">
            Search campus items
          </label>
          <Search size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            id="dashboard-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clothes, formal shoes, calculators, kettles, notes, sports gear..."
            aria-label="Search campus items"
            className="w-full min-h-[46px] pl-10 pr-10 py-2.5 rounded-xl bg-surface-card border border-surface-border text-sm text-ink-primary placeholder:text-ink-light outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 rounded-full text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors"
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
            className={`px-3 py-1.5 rounded-full font-bold transition-all border ${
              selectedListingType === 'All'
                ? 'bg-ink-primary text-surface-card border-ink-primary shadow-xs'
                : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Campus Items ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedListingType('borrow')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all border flex items-center gap-1.5 ${
              selectedListingType === 'borrow'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock size={12} />
            <span>To Borrow ({items.filter((i) => (i.listing_type || 'borrow') === 'borrow').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedListingType('trade')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all border flex items-center gap-1.5 ${
              selectedListingType === 'trade'
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeftRight size={12} />
            <span>Open for Trade ({tradeListings.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedListingType('wanted')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all border flex items-center gap-1.5 ${
              selectedListingType === 'wanted'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle size={12} />
            <span>Wanted Requests ({wantedListings.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedListingType('saved')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all border flex items-center gap-1.5 ${
              selectedListingType === 'saved'
                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
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
            className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
              selectedCategory === 'All'
                ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-800 font-semibold'
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
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                selectedCategory === cat
                  ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-800 font-semibold'
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
          <h2 className="text-base font-extrabold text-ink-primary tracking-tight">
            {selectedListingType === 'trade'
              ? 'Campus Trade & Barter Offers'
              : selectedListingType === 'wanted'
              ? 'Items Wanted by Students'
              : selectedListingType === 'borrow'
              ? 'Items Available for Borrowing'
              : 'Live Campus Sharing Feed'}
          </h2>
          <p className="text-xs text-ink-muted">
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
            className="text-xs font-semibold text-brand-600 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Unified Listings Grid */}
      {itemsLoading ? (
        <Loader label="Loading unified campus feed..." />
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-surface-card border border-surface-border">
          <Package className="mx-auto text-ink-light mb-2" size={36} />
          <h3 className="text-sm font-bold text-ink-primary mb-1">No items found</h3>
          <p className="text-xs text-ink-muted max-w-sm mx-auto mb-4">
            No campus listings match your current filters. Be the first to list, trade, or request something!
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link
              to="/app/items/new"
              className="px-4 py-2 rounded-xl bg-brand-600 text-white font-medium text-xs hover:bg-brand-700 transition-colors"
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
