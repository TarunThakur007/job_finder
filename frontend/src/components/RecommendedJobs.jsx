import React from 'react';
import { DollarSign, MapPin, Briefcase, ExternalLink } from 'lucide-react';

export default function RecommendedJobs({ searchTerm = '' }) {
  const recommendedList = [
    {
      id: 'dribbble-1',
      title: 'Senior UX Designer',
      company: 'Dribbble',
      salary: '$6k - $8k ( Per Month )',
      location: 'New York, USA',
      type: 'Full Time',
      bgColor: 'bg-blue-500',
      iconText: '🏀',
      applyUrl: 'https://dribbble.com/jobs'
    },
    {
      id: 'behance-2',
      title: 'UI Designer',
      company: 'Behance',
      salary: '$4k - $5k ( Per Month )',
      location: 'Florida, USA',
      type: 'Freelance',
      bgColor: 'bg-orange-500',
      iconText: 'Bē',
      applyUrl: 'https://behance.net/jobs'
    },
    {
      id: 'slack-3',
      title: 'Design System',
      company: 'Slack',
      salary: '$5k - $8k ( Per Month )',
      location: 'California, USA',
      type: 'Full Time',
      bgColor: 'bg-emerald-500',
      iconText: '💬',
      applyUrl: 'https://slack.com/careers'
    },
    {
      id: 'trello-4',
      title: 'Web Developer',
      company: 'Trello',
      salary: '$6k - $9k ( Per Month )',
      location: 'London, UK',
      type: 'Full Time',
      bgColor: 'bg-indigo-500',
      iconText: '📋',
      applyUrl: 'https://trello.com/careers'
    }
  ];

  const filteredList = recommendedList.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Recommended Jobs</h3>
        <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition">
          View All ({filteredList.length})
        </button>
      </div>

      {/* Grid of Job Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredList.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
          >
            {/* Top Brand Icon */}
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-2xl ${job.bgColor} text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform`}>
                {job.iconText}
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {job.type}
              </span>
            </div>

            {/* Job Title & Company */}
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {job.title}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">{job.company}</p>
            </div>

            {/* Details (Salary & Location) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <DollarSign className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{job.salary}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{job.location}</span>
              </div>
            </div>

            {/* Direct Apply Button */}
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-300 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 transition flex items-center justify-center gap-1"
            >
              <span>Apply Now</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
