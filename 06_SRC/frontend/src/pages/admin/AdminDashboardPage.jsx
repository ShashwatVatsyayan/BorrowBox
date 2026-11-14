import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Activity,
  Sliders,
  Users,
  AlertTriangle,
  Terminal,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle,
  XCircle,
  Search,
  Lock,
  Unlock,
  Coins,
  Percent,
  Download,
  Flame,
  Radio
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { rateLimiter } from '../../utils/rateLimiter';
import { getLocalDB, saveLocalDB } from '../../lib/supabase';
import { reportService } from '../../services/notificationService';
import './AdminConsole.css';

const DEFAULT_CATEGORY_CAPS = {
  'Scientific Calculators': 50,
  'Clothes & Formals': 150,
  'Shoes & Footwear': 100,
  'Hostel & Room Essentials': 60,
  'Books & Textbooks': 30,
  'Lab & Workshop Equipment': 80,
  'Electronics & Gadgets': 200,
  'Stationery & Drawing Tools': 20
};

export const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Real-Time System Telemetry
  const [timeStr, setTimeStr] = useState('');
  const [platformLocked, setPlatformLocked] = useState(false);
  const [platformFee, setPlatformFee] = useState(20);
  const [categoryCaps, setCategoryCaps] = useState(DEFAULT_CATEGORY_CAPS);

  // Rate Limiting Telemetry State
  const [rateTelemetry, setRateTelemetry] = useState(() => rateLimiter.getTelemetry());
  const [rateLimits, setRateLimits] = useState({
    auth: 5,
    resend: 2,
    api: 60,
    action: 10
  });

  // Database Entities
  const [dbUsers, setDbUsers] = useState([]);
  const [dbItems, setDbItems] = useState([]);
  const [dbRequests, setDbRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');

  // Terminal Audit Feed
  const [auditLogs, setAuditLogs] = useState([]);

  const addAuditLog = (code, msg) => {
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      time: new Date().toLocaleTimeString(),
      code,
      msg
    };
    setAuditLogs((prev) => [entry, ...prev.slice(0, 49)]);
  };

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync DB records
  const syncLocalRecords = () => {
    try {
      const db = getLocalDB();
      setDbUsers(db.users || []);
      setDbItems(db.items || []);
      setDbRequests(db.borrow_requests || []);
      setRateTelemetry(rateLimiter.getTelemetry());
    } catch (err) {
      console.error('Error syncing admin records:', err);
    }
  };

  useEffect(() => {
    syncLocalRecords();
    addAuditLog('SYS_INIT', 'Operations Command Terminal mounted. Authenticated as Superuser.');
    addAuditLog('RATE_SYNC', `Active throttle rules loaded: auth=${rateLimits.auth}/m, resend=${rateLimits.resend}/m.`);
  }, []);

  // Fetch reports
  const fetchReports = async () => {
    try {
      const data = await reportService.getReports();
      setReports(data || []);
    } catch (err) {
      console.warn('Reports fetch skipped:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Rate Limiter Controls
  const handleToggleRateLimiter = () => {
    const nextStatus = !rateTelemetry.enabled;
    rateLimiter.setEnabled(nextStatus);
    setRateTelemetry(rateLimiter.getTelemetry());
    addAuditLog('RL_TOGGLE', `Rate limiter master switch set to: ${nextStatus ? 'ENABLED' : 'DISABLED'}`);
  };

  const handleUpdateLimitRule = (bucket, value) => {
    const num = Math.max(1, parseInt(value, 10) || 1);
    rateLimiter.updateRule(bucket, num, 60000);
    setRateLimits((prev) => ({ ...prev, [bucket]: num }));
    setRateTelemetry(rateLimiter.getTelemetry());
    addAuditLog('RL_CONFIG', `Rate bucket '${bucket}' max requests adjusted to: ${num}/min`);
  };

  const handleFlushRateLimits = () => {
    rateLimiter.reset();
    setRateTelemetry(rateLimiter.getTelemetry());
    addAuditLog('RL_FLUSH', 'All sliding-window rate limit counters and throttle blocks purged.');
  };

  // Student Verification Actions
  const handleToggleStudentVerification = (userId) => {
    const db = getLocalDB();
    const target = db.users?.find((u) => u.id === userId);
    if (!target) return;
    target.is_verified = !target.is_verified;
    saveLocalDB(db);
    syncLocalRecords();
    addAuditLog('STUDENT_VERIFY', `Student [${target.email}] verification badge set to: ${target.is_verified}`);
  };

  const handleToggleStudentRole = (userId) => {
    const db = getLocalDB();
    const target = db.users?.find((u) => u.id === userId);
    if (!target) return;
    target.role = target.role === 'admin' ? 'student' : 'admin';
    saveLocalDB(db);
    syncLocalRecords();
    addAuditLog('ROLE_CHANGE', `User [${target.email}] role toggled to: ${target.role.toUpperCase()}`);
  };

  // Category Price Cap Updates
  const handleCapChange = (cat, val) => {
    const num = Math.max(5, parseInt(val, 10) || 10);
    setCategoryCaps((prev) => ({ ...prev, [cat]: num }));
    addAuditLog('CAP_UPDATE', `Rental daily ceiling for [${cat}] updated to Rs. ${num}/day`);
  };

  // Moderation Resolution
  const handleReportAction = async (reportId, status) => {
    await reportService.updateReportStatus(reportId, status);
    addAuditLog('MOD_REPORT', `Moderation report #${reportId} marked as ${status.toUpperCase()}`);
    await fetchReports();
  };

  // Export Audit Stream
  const handleExportAuditLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `borrowbox_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalStudents = dbUsers.length;
    const verifiedStudents = dbUsers.filter((u) => u.is_verified).length;
    const activeListings = dbItems.filter((i) => i.is_active).length;
    const grossVolume = dbRequests.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);
    const platformCommissionPool = Math.round(grossVolume * (platformFee / 100));

    return {
      totalStudents,
      verifiedStudents,
      activeListings,
      grossVolume,
      platformCommissionPool
    };
  }, [dbUsers, dbItems, dbRequests, platformFee]);

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return dbUsers;
    const q = studentSearch.toLowerCase();
    return dbUsers.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        u.full_name?.toLowerCase().includes(q) ||
        u.university_uid?.toLowerCase().includes(q)
    );
  }, [dbUsers, studentSearch]);

  return (
    <div className="admin-console-root">
      {/* Top Operations Header */}
      <header className="admin-top-bar">
        <div className="admin-brand">
          <span className="admin-brand-code">NODE // BBX-ROOT</span>
          <div className="admin-brand-title">
            <span>BORROWBOX</span> OPERATIONS COMMAND
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
            CU Punjab Campus Core
          </span>
        </div>

        <div className="admin-top-actions">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <Radio size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-mono">{timeStr}</span>
          </div>

          <div className="admin-badge-super">
            <Shield size={13} />
            <span>BorrowBoxAdmin@cuchd.in</span>
          </div>

          <button
            type="button"
            onClick={() => setPlatformLocked(!platformLocked)}
            className={`admin-btn ${platformLocked ? 'admin-btn-rose' : 'admin-btn-emerald'}`}
            title="Toggle Emergency Listing Freeze"
          >
            {platformLocked ? <Lock size={13} /> : <Unlock size={13} />}
            <span>{platformLocked ? 'FROZEN' : 'ACTIVE'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app')}
            className="admin-btn admin-btn-cyan"
            title="View Campus Application"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Student View</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="admin-btn"
            title="Sign Out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </header>

      {/* Navigation Sub-Bar */}
      <nav className="admin-nav-bar">
        <button
          type="button"
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={14} />
          <span>Telemetry & Overview</span>
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'rate-limiter' ? 'active' : ''}`}
          onClick={() => setActiveTab('rate-limiter')}
        >
          <Sliders size={14} />
          <span>Rate Limiting ({rateTelemetry.enabled ? 'ON' : 'OFF'})</span>
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'economics' ? 'active' : ''}`}
          onClick={() => setActiveTab('economics')}
        >
          <Coins size={14} />
          <span>Rental Economics & Caps</span>
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <Users size={14} />
          <span>Student Verification Registry ({dbUsers.length})</span>
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'moderation' ? 'active' : ''}`}
          onClick={() => setActiveTab('moderation')}
        >
          <AlertTriangle size={14} />
          <span>Moderation ({reports.length})</span>
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <Terminal size={14} />
          <span>Audit Stream</span>
        </button>
      </nav>

      {/* Console Content */}
      <main className="admin-body">
        {/* HUD Metric Cards */}
        <div className="admin-hud-grid">
          <div className="admin-hud-card hud-emerald">
            <div className="admin-hud-label">
              <span>Platform Security</span>
              <Shield size={14} className="text-emerald-400" />
            </div>
            <div className="admin-hud-value text-emerald-400">
              {rateTelemetry.enabled ? 'PROTECTED' : 'UNGUARDED'}
            </div>
            <div className="admin-hud-sub">
              Sliding-window rate limiter active
            </div>
          </div>

          <div className="admin-hud-card">
            <div className="admin-hud-label">
              <span>Verified Students</span>
              <Users size={14} className="text-sky-400" />
            </div>
            <div className="admin-hud-value text-sky-400">
              {metrics.verifiedStudents} / {metrics.totalStudents}
            </div>
            <div className="admin-hud-sub">Official @cuchd.in accounts</div>
          </div>

          <div className="admin-hud-card hud-amber">
            <div className="admin-hud-label">
              <span>Commission Vault</span>
              <Coins size={14} className="text-amber-400" />
            </div>
            <div className="admin-hud-value text-amber-400">
              Rs. {metrics.platformCommissionPool}
            </div>
            <div className="admin-hud-sub">{platformFee}% fee on completed rentals</div>
          </div>

          <div className="admin-hud-card hud-rose">
            <div className="admin-hud-label">
              <span>Throttled Keys</span>
              <Flame size={14} className="text-rose-400" />
            </div>
            <div className="admin-hud-value text-rose-400">
              {rateTelemetry.activeThrottledCount}
            </div>
            <div className="admin-hud-sub">Active rate limit throttles</div>
          </div>
        </div>

        {/* =========================================================================
            Tab 1: Telemetry & Overview
            ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="admin-panel lg:col-span-2">
              <div className="admin-panel-header">
                <div>
                  <h2 className="admin-panel-title">
                    <Activity size={16} className="text-sky-400" />
                    <span>Campus Network Heartbeat</span>
                  </h2>
                  <p className="admin-panel-desc">Real-time status of university database & local stores</p>
                </div>
                <button
                  type="button"
                  onClick={syncLocalRecords}
                  className="admin-btn admin-btn-cyan"
                >
                  <RefreshCw size={13} />
                  <span>Sync Records</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-black/40 border border-slate-800 rounded">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Active Catalog Items</span>
                  <span className="text-xl font-bold text-slate-100">{metrics.activeListings}</span>
                </div>
                <div className="p-3 bg-black/40 border border-slate-800 rounded">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Gross Rental Volume</span>
                  <span className="text-xl font-bold text-emerald-400">Rs. {metrics.grossVolume}</span>
                </div>
                <div className="p-3 bg-black/40 border border-slate-800 rounded">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Pending Reports</span>
                  <span className="text-xl font-bold text-amber-400">{reports.length}</span>
                </div>
              </div>

              <div className="p-3 bg-black/30 border border-slate-800 rounded text-xs space-y-2 text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Supabase Environment:</span>
                  <span className="font-mono text-emerald-400 font-semibold">CONFIGURED & HYBRID ACTIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Permitted University Domains:</span>
                  <span className="font-mono text-sky-400">@cuchd.in</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Authentication Workflow:</span>
                  <span className="font-mono text-slate-200">Built-in Supabase Email Confirmation Link</span>
                </div>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2 className="admin-panel-title">
                  <Terminal size={16} className="text-emerald-400" />
                  <span>Live Event Feed</span>
                </h2>
              </div>
              <div className="admin-terminal-feed">
                {auditLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="admin-log-entry">
                    <span className="admin-log-time">{log.time}</span>
                    <span className="admin-log-code">[{log.code}]</span>
                    <span className="admin-log-msg">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            Tab 2: Rate Limiting Command Hub
            ========================================================================= */}
        {activeTab === 'rate-limiter' && (
          <div className="space-y-6">
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h2 className="admin-panel-title">
                    <Sliders size={16} className="text-sky-400" />
                    <span>Rate Limiter Controls & Window Quotas</span>
                  </h2>
                  <p className="admin-panel-desc">
                    Protects authentication endpoints, email resends, and API actions against brute-force attacks
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleRateLimiter}
                    className={`admin-btn ${rateTelemetry.enabled ? 'admin-btn-emerald' : 'admin-btn-rose'}`}
                  >
                    <span>Master Guard: {rateTelemetry.enabled ? 'ENABLED' : 'DISABLED'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFlushRateLimits}
                    className="admin-btn admin-btn-rose"
                  >
                    <Flame size={13} />
                    <span>Flush All Blocks</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-black/40 border border-slate-800 rounded">
                  <div className="text-xs font-semibold text-slate-300 mb-1">Auth Attempts</div>
                  <div className="text-[11px] text-slate-500 mb-2">Max logins/signups per minute per IP/email</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={rateLimits.auth}
                      onChange={(e) => handleUpdateLimitRule('auth', e.target.value)}
                      className="admin-input w-20"
                    />
                    <span className="text-xs text-slate-400">req / min</span>
                  </div>
                </div>

                <div className="p-4 bg-black/40 border border-slate-800 rounded">
                  <div className="text-xs font-semibold text-slate-300 mb-1">Email Resends</div>
                  <div className="text-[11px] text-slate-500 mb-2">Confirmation link resends allowed</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={rateLimits.resend}
                      onChange={(e) => handleUpdateLimitRule('resend', e.target.value)}
                      className="admin-input w-20"
                    />
                    <span className="text-xs text-slate-400">req / min</span>
                  </div>
                </div>

                <div className="p-4 bg-black/40 border border-slate-800 rounded">
                  <div className="text-xs font-semibold text-slate-300 mb-1">API & Search Queries</div>
                  <div className="text-[11px] text-slate-500 mb-2">Catalog exploration & read queries</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={rateLimits.api}
                      onChange={(e) => handleUpdateLimitRule('api', e.target.value)}
                      className="admin-input w-20"
                    />
                    <span className="text-xs text-slate-400">req / min</span>
                  </div>
                </div>

                <div className="p-4 bg-black/40 border border-slate-800 rounded">
                  <div className="text-xs font-semibold text-slate-300 mb-1">Item & Request Mutations</div>
                  <div className="text-[11px] text-slate-500 mb-2">Creating listings or submitting requests</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={rateLimits.action}
                      onChange={(e) => handleUpdateLimitRule('action', e.target.value)}
                      className="admin-input w-20"
                    />
                    <span className="text-xs text-slate-400">req / min</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Recent Rate Limit Throttle Incidents
              </h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Incident ID</th>
                      <th>Bucket</th>
                      <th>Target Key</th>
                      <th>Timestamp</th>
                      <th>Cooldown Window</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateTelemetry.recentIncidents?.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-slate-500">
                          Zero active rate limit blocks. Platform running normally.
                        </td>
                      </tr>
                    ) : (
                      rateTelemetry.recentIncidents.map((inc) => (
                        <tr key={inc.id}>
                          <td className="font-mono text-sky-400">{inc.id}</td>
                          <td>
                            <span className="admin-badge badge-rose">{inc.bucket}</span>
                          </td>
                          <td className="font-mono text-slate-300">{inc.identifier}</td>
                          <td className="text-slate-400">{new Date(inc.timestamp).toLocaleTimeString()}</td>
                          <td className="text-amber-400 font-mono">{inc.resetInSeconds}s</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            Tab 3: Rental Economics & Category Caps
            ========================================================================= */}
        {activeTab === 'economics' && (
          <div className="space-y-6">
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h2 className="admin-panel-title">
                    <Coins size={16} className="text-amber-400" />
                    <span>Platform Commission & Campus Affordability Rules</span>
                  </h2>
                  <p className="admin-panel-desc">
                    Configure BorrowBox 20% platform commission and enforce maximum daily rental price caps
                  </p>
                </div>
              </div>

              <div className="p-4 bg-black/40 border border-slate-800 rounded mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Percent size={14} className="text-amber-400" />
                    <span>BorrowBox Platform Commission Fee: {platformFee}%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Automatically deducted upon completed rental return. Student owner retains {100 - platformFee}%.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(Number(e.target.value))}
                    className="admin-range w-36"
                  />
                  <span className="text-xs font-mono font-bold text-amber-400">{platformFee}%</span>
                </div>
              </div>

              <h3 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Category Maximum Daily Price Ceilings (INR / Day)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(categoryCaps).map(([cat, cap]) => (
                  <div key={cat} className="p-3 bg-black/40 border border-slate-800 rounded flex flex-col justify-between">
                    <span className="text-xs font-semibold text-slate-200 mb-2">{cat}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Max: Rs.</span>
                      <input
                        type="number"
                        min="5"
                        max="1000"
                        value={cap}
                        onChange={(e) => handleCapChange(cat, e.target.value)}
                        className="admin-input w-24 text-right font-mono"
                      />
                      <span className="text-xs text-slate-400">/day</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            Tab 4: Student Verification Registry
            ========================================================================= */}
        {activeTab === 'students' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2 className="admin-panel-title">
                  <Users size={16} className="text-sky-400" />
                  <span>Student Identity & Verification Registry</span>
                </h2>
                <p className="admin-panel-desc">Manage verified university badges and student permissions</p>
              </div>

              <div className="relative w-64">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by UID or email..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="admin-input pl-8 w-full"
                />
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>University UID</th>
                    <th>Email Address</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-slate-500">
                        No students found matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((u) => (
                      <tr key={u.id}>
                        <td className="font-semibold text-slate-200">{u.full_name || 'Anonymous Peer'}</td>
                        <td className="font-mono text-sky-400">{u.university_uid || 'N/A'}</td>
                        <td className="font-mono text-slate-300">{u.email}</td>
                        <td>
                          {u.is_verified ? (
                            <span className="admin-badge badge-green">Verified Student</span>
                          ) : (
                            <span className="admin-badge badge-amber">Unconfirmed</span>
                          )}
                        </td>
                        <td>
                          <span className={`admin-badge ${u.role === 'admin' ? 'badge-rose' : 'badge-cyan'}`}>
                            {u.role || 'student'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleStudentVerification(u.id)}
                              className="admin-btn text-[11px] py-0.5 px-2"
                              title="Toggle Verification Badge"
                            >
                              {u.is_verified ? 'Revoke' : 'Verify'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStudentRole(u.id)}
                              className="admin-btn text-[11px] py-0.5 px-2"
                              title="Toggle Superuser Role"
                            >
                              {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            Tab 5: Moderation & Disputes
            ========================================================================= */}
        {activeTab === 'moderation' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2 className="admin-panel-title">
                  <AlertTriangle size={16} className="text-rose-400" />
                  <span>Campus Listing Reports & Peer Disputes</span>
                </h2>
                <p className="admin-panel-desc">Review flags, inappropriate listings, and condition claims</p>
              </div>
              <button
                type="button"
                onClick={fetchReports}
                className="admin-btn admin-btn-cyan"
              >
                <RefreshCw size={13} />
                <span>Refresh</span>
              </button>
            </div>

            {reports.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                Community is clear. No active unresolved dispute tickets.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 bg-black/40 border border-slate-800 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="admin-badge badge-rose">{report.reason}</span>
                        <span className="font-bold text-xs text-slate-200">
                          Item: {report.item?.title || 'Reported Entity'}
                        </span>
                      </div>
                      {report.description && (
                        <p className="text-xs text-slate-400 mt-1 italic">
                          "{report.description}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status === 'open' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleReportAction(report.id, 'resolved')}
                            className="admin-btn admin-btn-emerald"
                          >
                            <CheckCircle size={13} />
                            <span>Resolve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReportAction(report.id, 'dismissed')}
                            className="admin-btn"
                          >
                            <XCircle size={13} />
                            <span>Dismiss</span>
                          </button>
                        </>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        Status: {report.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            Tab 6: Terminal Audit Stream
            ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2 className="admin-panel-title">
                  <Terminal size={16} className="text-emerald-400" />
                  <span>Operations Audit Stream</span>
                </h2>
                <p className="admin-panel-desc">Real-time log of administrative and system events</p>
              </div>
              <button
                type="button"
                onClick={handleExportAuditLogs}
                className="admin-btn admin-btn-cyan"
              >
                <Download size={13} />
                <span>Export Stream (JSON)</span>
              </button>
            </div>

            <div className="admin-terminal-feed" style={{ maxHeight: '420px' }}>
              {auditLogs.map((log) => (
                <div key={log.id} className="admin-log-entry">
                  <span className="admin-log-time">{log.time}</span>
                  <span className="admin-log-code">[{log.code}]</span>
                  <span className="admin-log-msg">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
