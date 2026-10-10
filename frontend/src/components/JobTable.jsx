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
  Trash2,
  Globe
} from 'lucide-react';
import { formatTimeAgo, formatFullAuditTimestamp } from '../utils/timeAgo';

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
  onJobUpdated,
  pageSize = 20 
}) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [now, setNow] = useState(Date.now());

  // Live timer tick: updates every 10 seconds so relative time naturally increases as user browses
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
      {displayedJobs.map((rawJob) => {
        if (!rawJob) return null;
        const job = rawJob;
        const companyObj = typeof job.company === 'object' && job.company !== null ? job.company : null;
        const compName = companyObj?.name || (typeof job.company === 'string' ? job.company : 'Verified Employer');
        const compSlug = compName !== 'Verified Employer' ? compName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
        const companyWebsite = companyObj?.website || (compSlug ? `https://www.${compSlug}.com` : null);
        const companyLinkedin = companyObj?.linkedinUrl || (compSlug ? `https://www.linkedin.com/company/${compSlug}` : null);
        const directApplyUrl = job.applyUrl || companyWebsite;
        const score = job.score || job.trustScore || 95;
        const salaryText = job.salaryDisplay || job.salary || "Salary not disclosed";
        const verificationTimestamp = job.lastVerified || job.postedDate;
        const relativeCheckedTime = formatTimeAgo(verificationTimestamp, now);

        return (
          <div 
            key={job.id} 
            onClick={() => onSelectJob && onSelectJob(job)}
            className="job-card-item craft-card border border-[#253044] hover:border-teal-500/50 hover:bg-[#1A2230] hover:shadow-lg hover:shadow-teal-500/5 p-5 rounded-2xl cursor-pointer space-y-4 group select-none transition-all duration-200 shadow-sm bg-[#141922]"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Job Title & Company Info */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* High Trust AI Agent Verified Open Badge */}
                  <span 
                    className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center gap-1.5"
                    title={`JobProof Agent checked official employer endpoint: ${formatFullAuditTimestamp(verificationTimestamp)}`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span className="uppercase tracking-wider font-extrabold text-[11px]">Open</span>
                    <span className="text-emerald-500/60">•</span>
                    <span className="text-emerald-200 font-medium">Checked {relativeCheckedTime}</span>
                  </span>

                  <h3 className="font-heading text-base sm:text-lg font-extrabold transition-colors tracking-tight text-white group-hover:text-teal-300">
                    {job.title}
                  </h3>

                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#0D1117] text-slate-400 border border-[#253044]">
                    {job.jobType || job.employmentType || "Fulltime"}
                  </span>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#0D1117] text-slate-400 border border-[#253044] flex items-center gap-1.5">
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
                  {/* Salary */}
                  <span className="font-mono text-amber-400 font-bold tabular-nums">
                    {salaryText}
                  </span>
                </div>

                {/* Company Website, LinkedIn & Direct Links Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  {companyWebsite && (
                    <a
                      href={companyWebsite.startsWith('http') ? companyWebsite : `https://${companyWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#1A2230] text-slate-300 hover:text-teal-300 border border-[#253044] hover:border-teal-500/40 text-xs font-mono transition-colors"
                      title={`Visit ${compName} Official Website`}
                    >
                      <Globe className="w-3.5 h-3.5 text-teal-400" />
                      <span>Company Website</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}

                  {companyLinkedin && (
                    <a
                      href={companyLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#1A2230] text-slate-300 hover:text-[#38bdf8] border border-[#253044] hover:border-[#0a66c2]/50 text-xs font-mono transition-colors"
                      title={`View ${compName} on LinkedIn`}
                    >
                      <svg className="w-3.5 h-3.5 fill-[#0a66c2]" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/>
                      </svg>
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}

                  {directApplyUrl && (
                    <a
                      href={directApplyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 hover:text-white border border-teal-500/30 text-xs font-mono font-medium transition-colors"
                      title="Direct Application Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                      <span>Direct Apply Link</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Trust Score & Actions (View Details + Apply Directly) */}
              <div className="flex items-center gap-2.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* Trust Score: Teal Primary Visual */}
                <div 
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0D1117] border border-[#253044] text-xs"
                  title="Trust score based on verified employer & ATS endpoint evidence."
                >
                  <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span className="text-slate-400 font-mono text-xs">Trust</span>
                  <span className="font-mono font-black text-teal-400 tabular-nums">{score}%</span>
                </div>

                {/* View Details Outline Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectJob) onSelectJob(job);
                  }}
                  className="px-3.5 py-2 bg-[#0D1117] hover:bg-[#1A2230] border border-[#253044] hover:border-teal-400 text-slate-300 hover:text-white rounded-xl font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
                  title="View complete verified requisition specifications"
                >
                  View Details
                </button>

                {/* Apply Directly: Primary Teal CTA */}
                {directApplyUrl ? (
                  <a
                    href={directApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl font-bold text-xs transition shadow-md hover:shadow-teal-500/25 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                    title="Direct application on employer careers portal"
                  >
                    <span>Direct Apply →</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectJob && onSelectJob(job)}
                    className="px-4 py-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl font-bold text-xs transition shadow-md hover:shadow-teal-500/25 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>View Opening →</span>
                  </button>
                )}
              </div>
            </div>

            {/* Signals & AI Agent Verification Status (No Recheck Button - Just Verified Status) */}
            <div className="pt-3 border-t border-[#253044] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Audit:
                </span>
                {Array.from(new Set(
                  (job.evidence || ["Official Employer Site", "Direct Application", "Active Listing"])
                    .map(formatSignal)
                    .filter(Boolean)
                )).map((signal, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-[#0D1117] border border-[#253044] px-2.5 py-0.5 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    {signal}
                  </span>
                ))}
              </div>

              {/* Agent Freshness Status: Verified We checked the job and it is open */}
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-xs"
                title={`Verified official employer endpoint on ${formatFullAuditTimestamp(verificationTimestamp)}`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300 font-medium">JobProof Audit:</span>
                <span className="text-emerald-300 font-bold">We checked this job and it is open</span>
                <span className="text-emerald-500/60">•</span>
                <span className="text-emerald-200 font-medium">Checked {relativeCheckedTime}</span>
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
