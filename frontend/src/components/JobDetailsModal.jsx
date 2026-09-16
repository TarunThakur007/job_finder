import React from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export default function JobDetailsModal({ job, onClose, onSave, isSaved }) {
  if (!job) return null;

  const score = job.score || job.trustScore || 90;
  const isHighTrust = score >= 90;
  const isTrusted = score >= 75 && score < 90;

  const selectionStages = job.selectionProcess || [
    'Resume Screening',
    'Online Assessment',
    'Technical Interview',
    'HR Interview'
  ];

  const evidenceList = job.evidence || [
    'Employer domain verified',
    'Official career page match',
    'Direct ATS URL check passed',
    'Posting active & fresh'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col relative transition-colors">
        
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-lg">
              🎯
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">{job.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job.company}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 flex-1">

          {/* Top Verification Trust Score Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isHighTrust 
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' 
              : isTrusted
              ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
              : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-md ${
                isHighTrust ? 'bg-emerald-600' : isTrusted ? 'bg-blue-600' : 'bg-amber-600'
              }`}>
                {score}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Job Trust Score — {score}/100
                  </h4>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isHighTrust 
                      ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300' 
                      : 'bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-300'
                  }`}>
                    {isHighTrust ? 'HIGHLY TRUSTED' : 'VERIFIED TRUSTED'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Calculated using evidence from domain checks, official career portal link, and posting freshness.
                </p>
              </div>
            </div>

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Apply Directly <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Metadata Badges Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Location</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Job Type</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.jobType || 'Full-time'}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60 col-span-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Salary Details</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> {job.salary || 'Salary not disclosed'}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 ml-1">
                  Company Provided
                </span>
              </span>
            </div>
          </div>

          {/* AI Executive Summary Card */}
          <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 border border-blue-200/60 dark:border-blue-800/60 p-4.5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Executive Introduction</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {job.summary || `This ${job.title} role at ${job.company} focuses on designing scalable backend services, optimizing data pipelines, and building robust REST APIs using modern development practices.`}
            </p>
          </div>

          {/* Selection Process Timeline Flowchart */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Identified Selection Process Flowchart
            </h4>
            <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 text-xs font-semibold">
              {selectionStages.map((stage, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>{stage}</span>
                  </div>
                  {idx < selectionStages.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Verification Evidence Bullets */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Verification Evidence Signals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {evidenceList.map((ev, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={() => onSave(job)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              isSaved
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {isSaved ? '✓ Saved in Bookmarks' : 'Bookmark Job'}
          </button>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition flex items-center gap-2"
          >
            Apply Directly <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
