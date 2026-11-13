import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Shield, Flag, CheckCircle, XCircle } from 'lucide-react';
import { reportService } from '../../services/notificationService';
import { formatDate } from '../../utils/dateUtils';

export const AdminDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getReports();
      setReports(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusUpdate = async (reportId, newStatus) => {
    await reportService.updateReportStatus(reportId, newStatus);
    await fetchReports();
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
          <Shield size={14} />
          <span>Campus Moderation Portal</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">Admin & Moderation Dashboard</h1>
        <p className="text-xs text-ink-muted mt-0.5">Review reported listings, content issues, and disputes</p>
      </div>

      {loading ? (
        <Loader label="Loading moderation reports..." fullPage />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No Open Reports"
          description="Campus community is healthy. There are currently no unresolved reports."
        />
      ) : (
        <div className="flex flex-col gap-3.5">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-surface-card rounded-xl border border-surface-border p-4 sm:p-5 flex flex-col gap-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                    {report.reason}
                  </span>
                  <h3 className="text-sm font-bold text-ink-primary mt-1.5">
                    Item: {report.item?.title || 'Reported Entity'}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  report.status === 'resolved'
                    ? 'bg-emerald-50 text-emerald-700'
                    : report.status === 'dismissed'
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-rose-50 text-rose-700'
                }`}>
                  {report.status}
                </span>
              </div>

              {report.description && (
                <p className="text-xs text-ink-muted bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                  "{report.description}"
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-ink-muted pt-2 border-t border-slate-100">
                <span>Submitted: {formatDate(report.created_at)}</span>
                <div className="flex items-center gap-2">
                  {report.status === 'open' && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStatusUpdate(report.id, 'resolved')}
                        className="min-h-[32px] py-1 text-xs gap-1"
                      >
                        <CheckCircle size={14} />
                        <span>Resolve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(report.id, 'dismissed')}
                        className="min-h-[32px] py-1 text-xs gap-1"
                      >
                        <XCircle size={14} />
                        <span>Dismiss</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

