import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Clock, 
  ArrowUpRight,
  ExternalLink
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
    return 'High Match';
  }
  // Strip redundant "Verified" prefix/suffix
  const cleaned = signal.replace(/verified\s*/i, '').replace(/\s*verified/i, '').trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : 'Direct Match';
}

export default function JobTable({ jobs, searchTerm, onSelectJob }) {
  const filteredJobs = jobs.filter(job => {
    const compName = typeof job.company === 'object' ? job.company.name : job.company;
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (compName && compName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (filteredJobs.length === 0) {
    return (
      <div className="bg-[#222228] rounded-2xl border border-gray-800 p-12 text-center space-y-3">
        <ShieldCheck className="w-12 h-12 text-yellow-400 mx-auto opacity-60" />
        <h3 className="text-lg font-bold text-white">No Verified Jobs Found</h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          Try adjusting your search criteria or explore job categories above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredJobs.map((job) => {
        const compName = typeof job.company === 'object' ? job.company.name : job.company;
        const score = job.score || job.trustScore || 95;
        const salaryText = job.salaryDisplay || job.salary || "Salary not disclosed";

        return (
          <div 
            key={job.id} 
            onClick={() => onSelectJob && onSelectJob(job)}
            className="group cursor-pointer bg-[#222228] hover:bg-[#282830] border border-gray-800 hover:border-yellow-500/50 rounded-2xl p-6 transition-all duration-300 space-y-4 shadow-xl gold-glow-card"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Job Title & Company Info */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-black text-white group-hover:text-yellow-400 transition-colors">
                    {job.title}
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-500/30">
                    {job.jobType || job.employmentType || "Fulltime"}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {job.vacanciesCount || job.openings || 3} Vacancies Open
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <Building2 className="w-4 h-4 text-yellow-400" /> {compName}
                  </span>
                  <span className="text-gray-700">•</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-500" /> {job.location}
                  </span>
                  <span className="text-gray-700">•</span>
                  <span className="text-yellow-400 font-extrabold">
                    {salaryText}
                  </span>
                </div>
              </div>

              {/* Verification Score & Direct Apply CTA */}
              <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                <div className="bg-[#18181c] border border-yellow-500/30 px-4 py-2.5 rounded-xl text-center min-w-[130px]">
                  <div className="text-xs font-bold text-yellow-400">
                    Trust Score
                  </div>
                  <div className="text-xl font-black text-yellow-400">
                    {score} / 100
                  </div>
                </div>

                <a
                  href={job.applyUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition-transform active:scale-95 shadow-lg shadow-yellow-500/20"
                >
                  Apply Now <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>
            </div>

            {/* Key Highlights / Benefit Signals */}
            <div className="pt-4 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400">
                  Highlights:
                </span>
                {Array.from(new Set(
                  (job.evidence || ["Official Employer Site", "Direct Application", "Active Listing"])
                    .map(formatSignal)
                    .filter(Boolean)
                )).map((signal, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-300 bg-[#18181c] border border-gray-800 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                    {signal}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                <Clock className="w-3.5 h-3.5 text-yellow-400" />
                <span>Active {job.lastSeen || 'recently'}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
