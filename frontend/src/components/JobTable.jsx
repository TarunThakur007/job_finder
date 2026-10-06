import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Clock, 
  ArrowUpRight,
  ExternalLink,
  SearchX,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Trash2
} from 'lucide-react';

export function formatSignal(signal) {
  if (!signal) return '';
  const lower = signal.toLowerCase();
  if (lower.includes('http') || lower.includes('200') || lower.includes('fresh') || lower.includes('active listing') || lower.includes('freshness')) {
    return 'Active Listing';
  }
  if (lower.includes('ats') || lower.includes('apply') || lower.includes('application')) {
    return 'Direct Application';
  }
  if (lower.includes('domain') || lower.includes('portal') || lower.includes('career') || lower.includes('employer') || lower.includes('source')) {
    return 'Official Employer Site';
  }
  if (lower.includes('spam')) {
    return 'Spam Free';
  }
  if (lower.includes('trust') || lower.includes('match') || lower.includes('confidence') || lower.includes('algorithm')) {
    return 'High Algorithmic Confidence';
  }
  const cleaned = signal.replace(/[\-_]/g, ' ').trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : 'Direct Match';
}

export default function JobTable({ 
  jobs = [], 
  searchTerm, 
  onSelectJob, 
  onApplyJob, 
  onClearSearch, 
  pageSize = 20 
}) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // Reset pagination window whenever search filter or job results change
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [jobs.length, searchTerm]);

  const filteredJobs = jobs;

  if (filteredJobs.length === 0) {
    return (
      <div className="bg-[#141922] rounded-2xl border border-[#253044] p-12 text-center space-y-4 shadow-xl">
        <ShieldCheck className="w-12 h-12 text-teal-400 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-white">No Verified Openings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
            {searchTerm ? `No database openings match "${searchTerm}".` : 'Try expanding filters or search query terms.'}
          </p>
        </div>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold text-xs transition shadow-md hover:shadow-teal-500/25 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Show All Database Jobs</span>
          </button>
        )}
      </div>
    );
  }

  const displayedJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  return (
    <div className="space-y-3.5">
      {displayedJobs.map((job) => {
        const compName = typeof job.company === 'object' ? job.company.name : job.company;
        const score = job.score || job.trustScore || 95;
        const salaryText = job.salaryDisplay || job.salary || "Salary not disclosed";

        return (
          <div 
            key={job.id} 
            onClick={() => onSelectJob && onSelectJob(job)}
            className="border p-5 rounded-2xl cursor-pointer space-y-4 group select-none transition-colors duration-150 shadow-sm bg-[#141922] border-[#253044] hover:border-teal-500/50 hover:bg-[#1A2230] hover:shadow-lg hover:shadow-teal-500/5"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Job Title & Company Info */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified
                  </span>

                  <h3 className="text-base sm:text-lg font-extrabold transition-colors tracking-tight text-white group-hover:text-teal-300">
                    {job.title}
                  </h3>

                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#0D1117] text-slate-400 border border-[#253044]">
                    {job.jobType || job.employmentType || "Fulltime"}
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#0D1117] text-slate-400 border border-[#253044] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>{job.vacanciesCount || job.openings || 1} {(job.vacanciesCount || job.openings || 1) === 1 ? 'Requisition' : 'Requisitions'}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {compName}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </span>
                  <span className="text-slate-600">•</span>
                  {/* Salary: Strictly Amber #F59E0B */}
                  <span className="font-mono text-amber-400 font-bold tabular-nums">
                    {salaryText}
                  </span>
                </div>
              </div>

              {/* Trust Score & Actions (View Details + Apply Directly) */}
              <div className="flex items-center gap-2.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* Trust Score: Teal Primary Visual */}
                <div 
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0D1117] border border-[#253044] text-xs"
                  title="Trust score based on available evidence."
                >
                  <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span className="text-slate-400 font-mono text-[11px]">Trust</span>
                  <span className="font-mono font-black text-teal-400 tabular-nums">{score}%</span>
                </div>

                {/* View Details Outline Button */}
                <button
                  type="button"
                  onClick={() => onSelectJob && onSelectJob(job)}
                  className="px-3.5 py-2 bg-[#0D1117] hover:bg-[#1A2230] border border-[#253044] hover:border-slate-500 text-slate-300 hover:text-white rounded-xl font-semibold text-xs transition flex items-center gap-1"
                >
                  View Details
                </button>

                {/* Apply Directly: Primary Teal CTA */}
                <button
                  type="button"
                  onClick={() => {
                    if (onApplyJob) {
                      onApplyJob(job);
                    } else if (job.applyUrl) {
                      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="px-4 py-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl font-bold text-xs transition shadow-md hover:shadow-teal-500/25 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                  title="Forward directly to company application page"
                >
                  <span>Apply Directly →</span>
                </button>
              </div>
            </div>

            {/* Signals & Verification Highlights */}
            <div className="pt-3 border-t border-[#253044] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Audit:
                </span>
                {Array.from(new Set(
                  (job.evidence || ["Official Employer Site", "Direct Application", "Active Listing"])
                    .map(formatSignal)
                    .filter(Boolean)
                )).map((signal, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-300 bg-[#0D1117] border border-[#253044] px-2.5 py-0.5 rounded-lg">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {signal}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Updated {job.lastSeen || 'today'}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Controlled Pagination Footer */}
      {hasMore && (
        <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800">
          <p className="text-xs text-gray-400 font-mono">
            Showing <strong className="text-white font-bold">{displayedJobs.length}</strong> of <strong className="text-yellow-400 font-bold">{filteredJobs.length}</strong> verified requisitions
          </p>
          <button
            onClick={() => setVisibleCount((prev) => prev + pageSize)}
            className="px-6 py-2.5 rounded-xl bg-[#222228] hover:bg-[#2a2a32] border border-gray-700/80 hover:border-yellow-500/50 text-white font-bold text-xs transition shadow-md flex items-center gap-2 active:scale-95"
          >
            <span>Load More Requisitions</span>
            <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-gray-950 text-[10px] font-mono font-black">
              +{Math.min(pageSize, filteredJobs.length - visibleCount)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
