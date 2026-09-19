import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';

export default function AdminControlSection({ liveJobs = [], currentUser, onPostJobClick }) {
  const [jobsList, setJobsList] = useState(liveJobs);
  const [filterType, setFilterType] = useState('all');
  const [actionNotice, setActionNotice] = useState(null);

  // Security Role Guard Check
  if (!currentUser || currentUser.role !== 'ROLE_ADMIN') {
    return (
      <div className="bg-[#222228] border border-red-500/30 rounded-3xl p-8 text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Access Denied: Admin Privileges Required</h2>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          You are currently logged in as a candidate user (<strong className="text-white">{currentUser?.email || 'ROLE_USER'}</strong>). Admin control features, job vacancy posting, and company trust audits are strictly reserved for Administrator accounts.
        </p>
        <div className="pt-2">
          <span className="px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/30">
            Protected Admin Route
          </span>
        </div>
      </div>
    );
  }

  const handleApproveJob = (id) => {
    setJobsList(jobsList.map(j => j.id === id ? { ...j, score: 98, status: 'VERIFIED' } : j));
    setActionNotice(`Job ID #${id} approved and marked fully VERIFIED by Admin.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleTakeDownJob = (id) => {
    setJobsList(jobsList.filter(j => j.id !== id));
    setActionNotice(`Flagged job listing ID #${id} taken down by Admin.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const pendingReviewCount = jobsList.filter(j => (j.score || 90) < 95).length;
  const verifiedCount = jobsList.filter(j => (j.score || 90) >= 95).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Admin Header Banner */}
      <div className="bg-[#222228] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-yellow-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-yellow-400" />
            <span>Administrator Control Console (ROLE_ADMIN)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Employer Moderation & <span className="text-yellow-400">Vacancy Management</span>
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Post new company job vacancies, review employer submissions, audit domain WHOIS records, and approve active listings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Post Vacancy Admin Button */}
          <button
            onClick={onPostJobClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black tracking-wide transition shadow-lg shadow-yellow-500/20 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>+ Post New Job Vacancy</span>
          </button>

          <div className="flex items-center gap-3 bg-[#18181c] p-3.5 rounded-2xl border border-gray-800 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 text-gray-950 flex items-center justify-center font-bold text-lg shadow-md">
              🛡️
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Logged in Admin</p>
              <p className="text-xs font-bold text-yellow-400">{currentUser.name}</p>
            </div>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <p className="text-xs text-slate-400 font-semibold">Total Listings Under Governance</p>
          <p className="text-3xl font-extrabold text-white mt-1">{jobsList.length}</p>
          <p className="text-[11px] text-blue-400 mt-1">100% Admin Monitored</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <p className="text-xs text-slate-400 font-semibold">Pending Verification Queue</p>
          <p className="text-3xl font-extrabold text-amber-400 mt-1">{pendingReviewCount}</p>
          <p className="text-[11px] text-amber-500 mt-1">Requires Admin Review</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <p className="text-xs text-slate-400 font-semibold">Verified Active Employers</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{verifiedCount}</p>
          <p className="text-[11px] text-emerald-400 mt-1">Trust Score &gt; 95%</p>
        </div>
      </div>

      {/* Admin Operations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              Job Moderation Queue
            </h3>
            <p className="text-xs text-slate-400">Perform admin actions to approve or remove job postings.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'pending' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Needs Review ({pendingReviewCount})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {jobsList
            .filter(j => filterType === 'all' ? true : (j.score || 90) < 95)
            .map((job) => {
              const compName = typeof job.company === 'object' ? job.company.name : job.company;
              const score = job.score || job.trustScore || 90;

              return (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-sm">{job.title}</h4>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                        {job.jobType || 'Full-time'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      🏢 {compName} • 📍 {job.location} • 💰 {job.salary || 'Competitive'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      score >= 95 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      Score: {score}%
                    </span>

                    {score < 95 && (
                      <button
                        onClick={() => handleApproveJob(job.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() => handleTakeDownJob(job.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Take Down
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
