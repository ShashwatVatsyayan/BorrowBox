import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit2, Power, Trash2, Package } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';
import { useItems } from '../../hooks/useItems';
import { itemService } from '../../services/itemService';
import { usePageTitle } from '../../hooks/usePageTitle';

export const MyListingsPage = () => {
  usePageTitle('My Listings');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, loading, refresh } = useItems({ ownerId: user?.id, includeInactive: true });
  const [targetItem, setTargetItem] = useState(null);
  const [dialogAction, setDialogAction] = useState(null); // 'toggle' or 'delete'
  const [processing, setProcessing] = useState(false);

  const handleToggle = async () => {
    if (!targetItem) return;
    setProcessing(true);
    try {
      await itemService.toggleActive(targetItem.id);
      await refresh();
      setTargetItem(null);
      setDialogAction(null);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!targetItem) return;
    setProcessing(true);
    try {
      await itemService.deleteItem(targetItem.id);
      await refresh();
      setTargetItem(null);
      setDialogAction(null);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">My Listings</h1>
          <p className="text-xs text-ink-muted mt-0.5">Manage the items you are sharing on campus</p>
        </div>
        <Link to="/app/items/new">
          <Button size="sm" variant="primary" className="gap-1.5">
            <PlusCircle size={16} />
            <span>Add New Item</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <Loader label="Loading your listings..." fullPage />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Items Listed Yet"
          description="You haven't listed any equipment or textbooks yet. Help your campus peers by listing something you don't use every day."
          actionLabel="List Your First Item"
          onAction={() => navigate('/app/items/new')}
        />
      ) : (
        <div className="flex flex-col gap-3.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-surface-card rounded-xl border border-surface-border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-brand-600 truncate">{item.category}</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-serif">
                      INR {item.daily_price || 15}/day
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.is_active ? 'Active' : 'Deactivated'}
                    </span>
                  </div>
                  <Link
                    to={`/app/items/${item.id}`}
                    className="text-sm font-semibold text-ink-primary hover:text-brand-600 transition-colors line-clamp-1 mt-0.5"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-ink-muted truncate">{item.location_label}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Link to={`/app/items/${item.id}/edit`}>
                  <Button size="sm" variant="outline" className="gap-1 min-h-[36px] py-1">
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setTargetItem(item);
                    setDialogAction('toggle');
                  }}
                  className="gap-1 min-h-[36px] py-1"
                >
                  <Power size={14} />
                  <span>{item.is_active ? 'Deactivate' : 'Activate'}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setTargetItem(item);
                    setDialogAction('delete');
                  }}
                  className="text-state-danger hover:bg-red-50 hover:border-red-200 min-h-[36px] py-1 px-2.5"
                  aria-label="Delete item"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={dialogAction === 'toggle'}
        onClose={() => setDialogAction(null)}
        onConfirm={handleToggle}
        title={targetItem?.is_active ? 'Deactivate Listing' : 'Activate Listing'}
        message={
          targetItem?.is_active
            ? 'Deactivating this listing will hide it from the campus Explore catalog. Existing approved requests will not be affected.'
            : 'Activating this listing will make it visible to students searching in the catalog.'
        }
        confirmLabel={targetItem?.is_active ? 'Deactivate' : 'Activate'}
        loading={processing}
      />

      <ConfirmDialog
        isOpen={dialogAction === 'delete'}
        onClose={() => setDialogAction(null)}
        onConfirm={handleDelete}
        title="Delete Listing"
        message={`Are you sure you want to permanently delete "${targetItem?.title}"?`}
        confirmLabel="Delete Permanently"
        isDestructive
        loading={processing}
      />
    </PageContainer>
  );
};

