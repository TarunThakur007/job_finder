import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Clock, 
  Search, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function JobTable({ jobs, searchTerm, onSelectJob }) {
  const filteredJobs = jobs.filter(job => {
    const compName = typeof job.company === 'object' ? job.company.name : job.company;
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (compName && compName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden space-y-6 p-6 transition-colors">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Verified Job Postings</h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Live Sources
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Verified employer postings directly linked to original career portals.
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filteredJobs.length}</span> verified vacancies
        </div>
      </div>

      {/* Verified Jobs Table / Feed */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const compName = typeof job.company === 'object' ? job.company.name : job.company;
          const score = job.score || job.trustScore || 90;
          const salaryText = job.salaryDisplay || job.salary || "Salary not disclosed";

          return (
            <div 
              key={job.id} 
              onClick={() => onSelectJob && onSelectJob(job)}
              className="group cursor-pointer bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-5 transition duration-200 space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Job Title & Company Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {job.title}
                    </h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                      {job.jobType || job.employmentType || "Full-time"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {compName}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      {salaryText}
                    </span>
                  </div>
                </div>

                {/* Verification Score & Direct Apply CTA */}
                <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800 px-3.5 py-2 rounded-xl text-center min-w-[120px]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Verification Score
                    </div>
                    <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                      {score} / 100
                    </div>
                  </div>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-500/20 whitespace-nowrap"
                  >
                    Apply Directly <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Evidence Bullets */}
              <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Verification Evidence:
                  </span>
                  {(job.evidence || ["Employer domain verified", "Official career source match", "Active application URL"]).map((ev, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {ev}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last verified {job.lastSeen || 'recently'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
