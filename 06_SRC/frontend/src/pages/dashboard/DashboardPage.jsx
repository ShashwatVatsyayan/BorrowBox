import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, BookOpen, Clock, ArrowRight, Search, PlusCircle } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { ItemGrid } from '../../components/items/ItemGrid';
import { Loader } from '../../components/common/Loader';
import { CATEGORIES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { useItems } from '../../hooks/useItems';
import { useRequests } from '../../hooks/useRequests';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { items, loading: itemsLoading } = useItems({ includeInactive: false });
  const { receivedRequests, sentRequests, loading: requestsLoading } = useRequests();
  const navigate = useNavigate();

  const pendingReceived = receivedRequests.filter((r) => r.status === 'pending');
  const activeBorrowings = sentRequests.filter((r) => r.status === 'approved' || r.status === 'return_pending');
  const myListingsCount = items.filter((i) => i.owner_id === user?.id).length;

  const recentItems = items.slice(0, 6);

  return (
    <PageContainer>
      {/* Header Greeting */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Campus Borrowing Dashboard</span>
          <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">
            Welcome, {user?.full_name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Chandigarh University Peer Sharing Hub
          </p>
        </div>
        <Link
          to="/app/items/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-colors shadow-xs"
        >
          <PlusCircle size={18} />
          <span>List an Item</span>
        </Link>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link
          to="/app/listings"
          className="p-3.5 rounded-xl bg-surface-card border border-surface-border hover:border-brand-300 transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2 text-brand-600 mb-1">
            <Package size={16} />
            <span className="text-xs font-semibold">My Listings</span>
          </div>
          <p className="text-xl font-bold text-ink-primary">{myListingsCount}</p>
        </Link>

        <Link
          to="/app/activity"
          className="p-3.5 rounded-xl bg-surface-card border border-surface-border hover:border-brand-300 transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <BookOpen size={16} />
            <span className="text-xs font-semibold">Active Borrows</span>
          </div>
          <p className="text-xl font-bold text-ink-primary">{activeBorrowings.length}</p>
        </Link>

        <Link
          to="/app/activity"
          className="p-3.5 rounded-xl bg-surface-card border border-surface-border hover:border-brand-300 transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Clock size={16} />
            <span className="text-xs font-semibold">Pending Requests</span>
          </div>
          <p className="text-xl font-bold text-ink-primary">{pendingReceived.length}</p>
        </Link>
      </div>

      {/* Search Input Shortcut */}
      <div
        onClick={() => navigate('/app/explore')}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-ink-light hover:text-ink-muted hover:border-brand-400 cursor-pointer transition-colors shadow-xs mb-6"
      >
        <Search size={18} className="text-slate-400" />
        <span className="text-sm">Search textbooks, scientific calculators, lab coats...</span>
      </div>

      {/* Category Shortcuts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-primary">Browse Categories</h2>
          <Link to="/app/explore" className="text-xs font-semibold text-brand-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CATEGORIES.slice(0, 4).map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/app/explore?category=${encodeURIComponent(cat)}`)}
              className="p-3 rounded-xl bg-surface-card border border-surface-border hover:border-brand-300 hover:bg-brand-50/20 text-left transition-colors"
            >
              <p className="text-xs font-bold text-ink-primary line-clamp-1">{cat}</p>
              <p className="text-[10px] text-ink-muted mt-0.5">Explore items</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recently Added Section */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-primary">Recently Listed on Campus</h2>
          <Link to="/app/explore" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
            <span>Explore All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {itemsLoading ? (
          <Loader label="Loading campus listings..." />
        ) : (
          <ItemGrid items={recentItems} />
        )}
      </div>
    </PageContainer>
  );
};

