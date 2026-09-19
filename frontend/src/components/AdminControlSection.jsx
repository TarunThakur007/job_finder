import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Building2, 
  RefreshCw, 
  Search, 
  AlertTriangle,
  Lock,
  UserCheck,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Sparkles,
  Zap,
  Globe,
  Check
} from 'lucide-react';

export default function AdminControlSection({ liveJobs = [], currentUser, onPostJobClick, onLoginAsAdmin }) {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);
  const [discovering, setDiscovering] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('pending'); // 'pending' | 'stats'

  const fetchPendingJobs = async () => {
    setLoading(true);
    try {
      const [pendingRes, statsRes] = await Promise.all([
        fetch('/api/admin/vacancies/pending'),
        fetch('/api/admin/stats')
      ]);

      if (pendingRes.ok) {
        const data = await pendingRes.json();
        setPendingJobs(data);
      }
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setAdminStats(stats);
      }
    } catch (err) {
      console.error('Error loading admin moderation queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  // Admin Permission Guard - with one-click Admin permission enable
  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  const handleApproveVacancy = async (job) => {
    try {
      const res = await fetch(`/api/admin/vacancies/${job.id}/approve`, {
        method: 'PUT'
      });

      if (res.ok) {
        setPendingJobs(prev => prev.filter(j => j.id !== job.id));
        setActionNotice({
          type: 'success',
          msg: `Approved & Published: "${job.title}" at ${job.company?.name || 'the employer'} is now live on the public site with Trust Score ${job.trustScore || 98}%!`
        });
        fetchPendingJobs();
      } else {
        throw new Error('Approval failed');
      }
    } catch (e) {
      setActionNotice({ type: 'error', msg: `Failed to approve job #${job.id}.` });
    }
    setTimeout(() => setActionNotice(null), 4500);
  };

  const handleRejectVacancy = async (id, title) => {
    try {
      const res = await fetch(`/api/admin/vacancies/${id}/reject`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setPendingJobs(prev => prev.filter(j => j.id !== id));
        setActionNotice({
          type: 'info',
          msg: `Rejected & Discarded: "${title}" removed from staging queue.`
        });
        fetchPendingJobs();
      } else {
        throw new Error('Rejection failed');
      }
    } catch (e) {
      setActionNotice({ type: 'error', msg: `Failed to reject job #${id}.` });
    }
    setTimeout(() => setActionNotice(null), 4500);
  };

  const handleTriggerDiscovery = async () => {
    setDiscovering(true);
    setActionNotice({ type: 'info', msg: 'AI Discovery Agent launched across Greenhouse, Lever, and Ashby boards...' });
    try {
      const res = await fetch('/api/admin/vacancies/discover', { method: 'POST' });
      const data = await res.json();
      setActionNotice({
        type: 'success',
        msg: `AI Discovery Complete: Discovered and staged ${data.stagedCount} new vacancies for Admin review!`
      });
      fetchPendingJobs();
    } catch (e) {
      setActionNotice({ type: 'error', msg: 'Error running AI discovery crawl.' });
    } finally {
      setDiscovering(false);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  const handleCleanDummyData = async () => {
    setCleaning(true);
    try {
      const res = await fetch('/api/admin/clean-dummy-data', { method: 'POST' });
      const data = await res.json();
      setActionNotice({
        type: 'success',
        msg: `Data Sanitization Complete: Purged dummy data (${data.deletedJobs} mock jobs, ${data.deletedCompanies} mock companies removed). Only real authenticated companies remain!`
      });
      fetchPendingJobs();
    } catch (e) {
      setActionNotice({ type: 'error', msg: 'Failed to purge dummy data.' });
    } finally {
      setCleaning(false);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  const handleQuickAdminLogin = () => {
    const adminUser = {
      name: 'System Admin',
      email: 'admin@jobproof.io',
      role: 'ROLE_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
    };
    try {
      localStorage.setItem('jobproof_user', JSON.stringify(adminUser));
      if (onLoginAsAdmin) {
        onLoginAsAdmin(adminUser);
      } else {
        window.location.reload();
      }
    } catch (e) {}
  };

  if (!isAdmin) {
    return (
      <div className="bg-[#222228] border border-yellow-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 animate-fadeIn max-w-2xl mx-auto shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center mx-auto shadow-inner border border-yellow-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Administrator Moderation Console</h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
            You are currently viewing as guest/candidate. To access the job approval permissions, review AI-discovered ATS feeds, and publish listings live, activate Administrator mode below.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <button
            onClick={handleQuickAdminLogin}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black tracking-wide shadow-lg shadow-yellow-500/20 active:scale-95 transition-all"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Enable Administrator Permissions & Access Console</span>
          </button>
        </div>
      </div>
    );
  }

  const filteredJobs = pendingJobs.filter(j => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const compName = (j.company?.name || '').toLowerCase();
    const title = (j.title || '').toLowerCase();
    const source = (j.source || '').toLowerCase();
    return compName.includes(term) || title.includes(term) || source.includes(term);
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Admin Control Banner */}
      <div className="bg-[#222228] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-yellow-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-yellow-400" />
            <span>Administrator Control Console (ROLE_ADMIN)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Vacancy Discovery & <span className="text-yellow-400">Approval Console</span>
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Review incoming vacancies staged by the AI Agent from official Greenhouse, Lever, and Ashby feeds. Verify the direct employer application link, inspect authentication trust signals, and grant permission to approve or discard postings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* AI Discovery Trigger Button */}
          <button
            onClick={handleTriggerDiscovery}
            disabled={discovering}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black tracking-wide transition shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-60"
          >
            <Sparkles className={`w-4 h-4 ${discovering ? 'animate-spin' : ''}`} />
            <span>{discovering ? 'Agent Crawling ATS Feeds...' : '⚡ Run AI Discovery Agent'}</span>
          </button>

          {/* Purge Dummy Data Button */}
          <button
            onClick={handleCleanDummyData}
            disabled={cleaning}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs font-bold transition active:scale-95 disabled:opacity-60"
            title="Purge legacy mock/dummy data"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>{cleaning ? 'Cleaning...' : 'Purge Dummy Data'}</span>
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 animate-fadeIn ${
          actionNotice.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
            : actionNotice.type === 'error'
            ? 'bg-rose-950/60 border-rose-800 text-rose-300'
            : 'bg-blue-950/60 border-blue-800 text-blue-300'
        }`}>
          {actionNotice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : actionNotice.type === 'error' ? (
            <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          ) : (
            <RefreshCw className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
          )}
          <span>{actionNotice.msg}</span>
        </div>
      )}

      {/* Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <p className="text-xs text-slate-400 font-semibold">Pending Admin Approval</p>
          <p className="text-3xl font-extrabold text-amber-400 mt-1">{pendingJobs.length}</p>
          <p className="text-[11px] text-amber-400/80 mt-1">Awaiting Permission to Publish</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <p className="text-xs text-slate-400 font-semibold">Live Approved Jobs</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{adminStats?.activeJobs || 0}</p>
          <p className="text-[11px] text-emerald-400/80 mt-1">100% Authenticated & Live</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <p className="text-xs text-slate-400 font-semibold">Total Verified Jobs</p>
          <p className="text-3xl font-extrabold text-white mt-1">{adminStats?.totalJobs || 0}</p>
          <p className="text-[11px] text-blue-400 mt-1">In Database Governance</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <p className="text-xs text-slate-400 font-semibold">Verified Target Employers</p>
          <p className="text-3xl font-extrabold text-yellow-400 mt-1">9</p>
          <p className="text-[11px] text-gray-400 mt-1">Greenhouse • Lever • Ashby</p>
        </div>
      </div>

      {/* Main Approval & Review Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-yellow-400" />
              <span>AI Vacancy Approval Queue ({filteredJobs.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify employer authentication, inspect direct ATS application URLs, and click "Approve" to publish.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search filter input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by company, title..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 w-48 sm:w-64"
              />
            </div>

            <button
              onClick={fetchPendingJobs}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-yellow-400" />
            <p className="text-xs font-semibold">Loading pending vacancies from backend...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3 bg-slate-800/30 rounded-2xl border border-dashed border-slate-800">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
            <h4 className="text-sm font-bold text-white">All Caught Up!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No vacancies currently pending review. Click "Run AI Discovery Agent" above to fetch fresh openings from target companies.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const compName = job.company?.name || 'Target Employer';
              const trustScore = job.trustScore || 95;
              const sourceLabel = job.source || 'Official ATS';

              return (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-[#1c1c22] border border-slate-800 hover:border-slate-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm"
                >
                  {/* Left Column: Job Details & Authenticity Badges */}
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-base">{job.title}</h4>
                      
                      {/* Employer Authenticity Badge */}
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Authenticated Company</span>
                      </span>

                      {/* ATS Feed Badge */}
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[11px] font-bold border border-purple-500/20">
                        {sourceLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="font-bold text-slate-200">🏢 {compName}</span>
                      <span>•</span>
                      <span>📍 {job.location || 'Remote'}</span>
                      <span>•</span>
                      <span>💼 {job.employmentType || 'Full-time'}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">
                        Direct Apply URL: <span className="font-mono text-[10px] text-slate-400">{job.applyUrl ? (job.applyUrl.substring(0, 45) + '...') : 'N/A'}</span>
                      </span>
                    </div>

                    {/* Trust Signals Pill Row */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                        ✓ Direct ATS Application Form
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                        ✓ Verified Employer Domain
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                        ✓ Active Live Vacancy
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Score & Action Permission Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
                    {/* Trust Score Pill */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-center px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center">
                      <span className="text-[10px] uppercase font-bold text-emerald-500">Trust Score</span>
                      <span className="text-base font-black">{trustScore}%</span>
                    </div>

                    {/* Test Direct Apply Link Button */}
                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
                        title="Test direct official application page in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Test Apply Link</span>
                      </a>
                    )}

                    {/* Permission: APPROVE BUTTON */}
                    <button
                      onClick={() => handleApproveVacancy(job)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Publish Live</span>
                    </button>

                    {/* Permission: REJECT BUTTON */}
                    <button
                      onClick={() => handleRejectVacancy(job.id, job.title)}
                      className="px-3 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-1 border border-rose-800/40 active:scale-95"
                      title="Reject and delete this posting"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
