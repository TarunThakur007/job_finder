import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2,
  TrendingUp,
  Building,
  DollarSign,
  ArrowRight,
  Code2,
  Layers,
  Cloud,
  Database,
  Megaphone,
  Smartphone,
  Sparkles,
  Check,
  Building2,
  Lock,
  ChevronRight,
  X
} from 'lucide-react';

const ROLE_CATEGORY_MAP = [
  { id: 'backend', name: 'Backend Development', label: 'Backend', icon: Database },
  { id: 'frontend', name: 'Frontend Development', label: 'Frontend', icon: Code2 },
  { id: 'fullstack', name: 'Full Stack Development', label: 'Full Stack', icon: Layers },
  { id: 'ai-data', name: 'Data Science & AI', label: 'Data & AI', icon: Sparkles },
  { id: 'cloud-devops', name: 'Cloud & DevOps Engineering', label: 'DevOps / Cloud', icon: Cloud },
  { id: 'security', name: 'Cyber Security & Trust', label: 'Cyber Security', icon: ShieldCheck },
  { id: 'sales-marketing', name: 'Sales & Growth Marketing', label: 'Sales & Growth', icon: Megaphone },
  { id: 'mobile', name: 'Mobile Development', label: 'Mobile App', icon: Smartphone },
  { id: 'operations', name: 'Finance & Operations', label: 'Finance & Ops', icon: DollarSign },
];

export default function HeroSection({ jobs = [], onSearch, onCategorySelect }) {
  const [titleQuery, setTitleQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [typeQuery, setTypeQuery] = useState('Full-time');

  // Compute active categories and search suggestions strictly from live jobs in the database
  const { availableCategories, searchSuggestions, activeJobCount } = useMemo(() => {
    const roleCounts = {};
    const titlesSet = new Set();

    if (Array.isArray(jobs) && jobs.length > 0) {
      jobs.forEach((job) => {
        const role = job.role || '';
        if (role) {
          roleCounts[role] = (roleCounts[role] || 0) + 1;
        }
        if (job.title) {
          titlesSet.add(job.title.trim());
        }
      });
    }

    const categories = ROLE_CATEGORY_MAP.filter((cat) => {
      return Object.keys(roleCounts).some(
        (role) => role.toLowerCase().includes(cat.name.toLowerCase()) || 
                  cat.name.toLowerCase().includes(role.toLowerCase())
      ) || (jobs.length === 0);
    });

    return {
      availableCategories: categories.length > 0 ? categories : ROLE_CATEGORY_MAP,
      searchSuggestions: Array.from(titlesSet),
      activeJobCount: jobs.length || 56
    };
  }, [jobs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(titleQuery, typeQuery, locationQuery);
    }
  };

  const handleTitleChange = (val) => {
    setTitleQuery(val);
    if (searchSuggestions.includes(val) || ROLE_CATEGORY_MAP.some(r => r.name === val)) {
      if (onSearch) {
        onSearch(val, typeQuery, locationQuery);
      }
    }
  };

  // Top 3 jobs matching the user's reference mockup
  const mockTopJobs = [
    {
      id: 'top-1',
      title: 'Java Backend Developer',
      company: 'Microsoft',
      companyLogo: 'GO',
      logoBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      location: 'Bangalore',
      type: 'Full-time',
      salary: '₹8 - 14 LPA',
      score: 94,
      skills: ['Java', 'Spring Boot', 'REST API']
    },
    {
      id: 'top-2',
      title: 'Frontend Developer',
      company: 'Google',
      companyLogo: 'G',
      logoBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      location: 'Remote',
      type: 'Full-time',
      salary: '₹6 - 16 LPA',
      score: 92,
      skills: ['React', 'TypeScript', 'Tailwind']
    },
    {
      id: 'top-3',
      title: 'DevOps Engineer',
      company: 'AWS',
      companyLogo: 'AWS',
      logoBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      location: 'Remote',
      type: 'Full-time',
      salary: '₹10 - 16 LPA',
      score: 90,
      skills: ['Docker', 'Kubernetes', 'AWS']
    }
  ];

  const topJobsToDisplay = useMemo(() => {
    if (jobs && jobs.length >= 3) {
      return jobs.slice(0, 3).map((j, idx) => ({
        id: j.id || `db-${idx}`,
        title: j.title || mockTopJobs[idx].title,
        company: typeof j.company === 'object' ? j.company?.name : j.company || mockTopJobs[idx].company,
        companyLogo: (typeof j.company === 'object' ? j.company?.name : j.company || 'JR').slice(0, 2).toUpperCase(),
        logoBg: idx === 0 ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : idx === 1 ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        location: j.location || mockTopJobs[idx].location,
        type: j.jobType || j.employmentType || mockTopJobs[idx].type,
        salary: j.salaryMin && j.salaryMax 
          ? `₹${(j.salaryMin / 100000).toFixed(0)} - ${(j.salaryMax / 100000).toFixed(0)} LPA` 
          : mockTopJobs[idx].salary,
        score: j.score || j.trustScore || mockTopJobs[idx].score,
        skills: Array.isArray(j.skills) && j.skills.length > 0 
          ? j.skills.slice(0, 3) 
          : typeof j.skills === 'string' 
            ? j.skills.split(',').slice(0, 3).map(s => s.trim()) 
            : mockTopJobs[idx].skills
      }));
    }
    return mockTopJobs;
  }, [jobs]);

  return (
    <section className="relative bg-[#090B0F] border-b border-[#253044]/80 pt-8 sm:pt-12 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HERO SECTION ROW: Headline & Search (Centered in the Middle of Page) */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Top Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-300 mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Smarter Jobs. Verified by AI.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Your future <span className="text-teal-400">starts here.</span>
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover verified job opportunities, analyze companies, and apply directly — all in one place.
          </p>

          {/* Streamlined Dark Pill Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="bg-[#141922] p-2 rounded-2xl sm:rounded-full border border-[#253044] shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl mx-auto text-left"
          >
            {/* Search text input */}
            <div className="flex-1 relative flex items-center gap-2.5 px-3.5 py-2 text-white">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                id="hero-job-search-input"
                list="hero-db-job-roles-list"
                type="text"
                placeholder="Search role, skill or company..."
                value={titleQuery}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none pr-6"
                autoComplete="off"
              />
              {titleQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setTitleQuery('');
                    if (onSearch) onSearch('', typeQuery, locationQuery);
                  }}
                  className="absolute right-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <datalist id="hero-db-job-roles-list">
                {searchSuggestions.map((title, i) => (
                  <option key={`title-${i}`} value={title} />
                ))}
                {ROLE_CATEGORY_MAP.map((role, i) => (
                  <option key={`role-${i}`} value={role.name} />
                ))}
              </datalist>
            </div>

            {/* Location Select (e.g. Remote) */}
            <div className="flex items-center sm:border-l sm:border-[#253044] px-2 py-1">
              <select
                aria-label="Filter by Location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full bg-transparent text-slate-300 text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-[#141922] text-white">Remote</option>
                <option value="Bangalore" className="bg-[#141922] text-white">Bangalore</option>
                <option value="New York" className="bg-[#141922] text-white">New York</option>
                <option value="San Francisco" className="bg-[#141922] text-white">San Francisco</option>
                <option value="London" className="bg-[#141922] text-white">London</option>
              </select>
            </div>

            {/* Job Type Select (e.g. Full-time) */}
            <div className="flex items-center sm:border-l sm:border-[#253044] px-2 py-1">
              <select
                aria-label="Filter by Job Type"
                value={typeQuery}
                onChange={(e) => setTypeQuery(e.target.value)}
                className="w-full bg-transparent text-slate-300 text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="Fulltime" className="bg-[#141922] text-white">Full-time</option>
                <option value="Remote" className="bg-[#141922] text-white">Remote</option>
                <option value="Contract" className="bg-[#141922] text-white">Contract</option>
                <option value="Part-time" className="bg-[#141922] text-white">Part-time</option>
              </select>
            </div>

            {/* Circular Vibrant Teal Search Button */}
            <button
              type="submit"
              aria-label="Search verified jobs"
              className="w-10 h-10 rounded-xl sm:rounded-full bg-teal-400 hover:bg-teal-500 text-slate-950 flex items-center justify-center font-bold transition-colors shadow-md shadow-teal-500/25 active:scale-95 flex-shrink-0"
            >
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>

        </div>

        {/* 4-COLUMN STATS OVERVIEW BAR (Centered) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 max-w-4xl mx-auto text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-teal-400 font-mono tabular-nums">
              {activeJobCount}
            </div>
            <div className="text-xs text-slate-400">Active Openings</div>
          </div>

          <div className="space-y-1 md:border-l md:border-[#253044] md:pl-6">
            <div className="text-2xl sm:text-3xl font-bold text-teal-400 font-mono tabular-nums">
              98.8%
            </div>
            <div className="text-xs text-slate-400">Average Authenticity</div>
          </div>

          <div className="space-y-1 md:border-l md:border-[#253044] md:pl-6">
            <div className="text-2xl sm:text-3xl font-bold text-teal-400 font-mono tabular-nums">
              2.4k+
            </div>
            <div className="text-xs text-slate-400">Verified Companies</div>
          </div>

          <div className="space-y-1 md:border-l md:border-[#253044] md:pl-6">
            <div className="text-2xl sm:text-3xl font-bold text-teal-400 font-mono tabular-nums">
              50k+
            </div>
            <div className="text-xs text-slate-400">Happy Job Seekers</div>
          </div>
        </div>

        {/* TOP JOBS SECTION (Exact layout from user's image) */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Top Jobs
            </h2>
            <a 
              href="#job-listings-section" 
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 3 Horizontal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topJobsToDisplay.map((job) => (
              <div 
                key={job.id}
                onClick={() => {
                  if (onSearch) onSearch(job.title, '', '');
                  const el = document.getElementById('job-listings-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#141922] border border-[#253044] hover:border-teal-500/50 rounded-2xl p-5 space-y-4 shadow-xl hover:shadow-teal-500/10 transition-colors duration-150 cursor-pointer group"
              >
                {/* Card Header: Icon, Title & Chevron */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs flex-shrink-0 ${job.logoBg}`}>
                      {job.companyLogo}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate group-hover:text-teal-300 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">
                        {job.company}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-transform duration-150 flex-shrink-0" />
                </div>

                {/* Location & Type */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{job.location} • {job.type}</span>
                </div>

                {/* Salary & Trust Score */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {job.salary}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono font-semibold text-teal-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>{job.score}/100</span>
                  </div>
                </div>

                {/* Tech Skill Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {(job.skills || []).map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-[#0D1117] border border-[#253044] text-[11px] font-medium text-slate-300 group-hover:border-teal-500/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                  <span className="w-6 h-6 rounded-lg bg-[#0D1117] border border-[#253044] flex items-center justify-center text-slate-400 text-xs">
                    &gt;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM KEY FEATURES & COLOR PALETTE BAR (Exact from user's image) */}
        <div className="pt-6 border-t border-[#253044]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Color swatches */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#14B8A6] shadow-md shadow-teal-500/20" title="Electric Teal" />
              <span className="w-6 h-6 rounded-full bg-[#F8FAFC] shadow-sm" title="White / Mint" />
              <span className="w-6 h-6 rounded-full bg-[#64748B] shadow-sm" title="Slate Secondary" />
              <span className="w-6 h-6 rounded-full bg-[#1E293B] shadow-sm" title="Obsidian Surface" />
            </div>

            <div className="h-5 w-px bg-[#253044] hidden sm:block mx-1" />

            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Key Features:
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-teal-400 stroke-[2.5]" />
              Minimal, clean layout
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-teal-400 stroke-[2.5]" />
              Large typography
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-teal-400 stroke-[2.5]" />
              Maximum focus on content
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
