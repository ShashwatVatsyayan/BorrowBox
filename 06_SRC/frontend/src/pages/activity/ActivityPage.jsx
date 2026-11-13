import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { RequestCard } from '../../components/requests/RequestCard';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useRequests } from '../../hooks/useRequests';
import { requestService } from '../../services/requestService';
import { Clock } from 'lucide-react';

export const ActivityPage = () => {
  const { sentRequests, receivedRequests, loading, refresh } = useRequests();
  const [activeTab, setActiveTab] = useState('received'); // 'received' (as owner) or 'sent' (as borrower)
  const [statusFilter, setStatusFilter] = useState('all');

  const handleApprove = async (reqId) => {
    await requestService.approveRequest(reqId);
    await refresh();
  };

  const handleReject = async (reqId) => {
    await requestService.rejectRequest(reqId);
    await refresh();
  };

  const handleCancel = async (reqId) => {
    await requestService.cancelRequest(reqId);
    await refresh();
  };

  const handleMarkReturn = async (reqId) => {
    await requestService.markReturnPending(reqId);
    await refresh();
  };

  const handleConfirmReturn = async (reqId) => {
    await requestService.confirmReturn(reqId);
    await refresh();
  };

  const handleCompleteTrade = async (reqId) => {
    await requestService.completeTrade(reqId);
    await refresh();
  };

  const currentList = activeTab === 'received' ? receivedRequests : sentRequests;
  const filteredList = statusFilter === 'all'
    ? currentList
    : currentList.filter((r) => r.status === statusFilter);

  return (
    <PageContainer>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">Activity & Requests</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Manage borrow requests, active lending sessions, and return confirmations
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-surface-border mb-4">
        <button
          onClick={() => { setActiveTab('received'); setStatusFilter('all'); }}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'received'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-ink-muted hover:text-ink-primary'
          }`}
        >
          <span>Lending (Requests for My Items)</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-ink-muted">
            {receivedRequests.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('sent'); setStatusFilter('all'); }}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'sent'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-ink-muted hover:text-ink-primary'
          }`}
        >
          <span>Borrowing (Items I Requested)</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-ink-muted">
            {sentRequests.length}
          </span>
        </button>
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 text-xs">
        {['all', 'pending', 'approved', 'return_pending', 'completed', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded-full font-medium transition-colors border capitalize shrink-0 ${
              statusFilter === st
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-surface-card text-ink-muted border-surface-border hover:bg-slate-50'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Content List */}
      {loading ? (
        <Loader label="Loading requests..." />
      ) : filteredList.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No Requests in this View"
          description={
            activeTab === 'received'
              ? 'You have not received any requests matching this filter.'
              : 'You have not submitted any requests matching this filter.'
          }
        />
      ) : (
        <div className="flex flex-col gap-3.5">
          {filteredList.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              isOwner={activeTab === 'received'}
              onApprove={handleApprove}
              onReject={handleReject}
              onCancel={handleCancel}
              onMarkReturn={handleMarkReturn}
              onConfirmReturn={handleConfirmReturn}
              onCompleteTrade={handleCompleteTrade}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

