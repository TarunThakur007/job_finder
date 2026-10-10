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

const TOP_HIRING_COMPANIES = [
  { name: 'Google', domain: 'google.com' },
  { name: 'Microsoft', domain: 'microsoft.com' },
  { name: 'Amazon', domain: 'amazon.com' },
  { name: 'Stripe', domain: 'stripe.com' },
  { name: 'Figma', domain: 'figma.com' },
  { name: 'Netflix', domain: 'netflix.com' },
  { name: 'Apple', domain: 'apple.com' },
  { name: 'Meta', domain: 'meta.com' },
  { name: 'Uber', domain: 'uber.com' },
  { name: 'Swiggy', domain: 'swiggy.com' },
  { name: 'Razorpay', domain: 'razorpay.com' },
  { name: 'CRED', domain: 'cred.club' }
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
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
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
                <option value="" className="bg-[#141922] text-white">All India Locations</option>
                <option value="Bengaluru" className="bg-[#141922] text-white">Bengaluru (Bangalore)</option>
                <option value="Hyderabad" className="bg-[#141922] text-white">Hyderabad</option>
                <option value="Pune" className="bg-[#141922] text-white">Pune</option>
                <option value="Delhi NCR" className="bg-[#141922] text-white">Delhi NCR (Gurugram / Noida)</option>
                <option value="Mumbai" className="bg-[#141922] text-white">Mumbai</option>
                <option value="Chennai" className="bg-[#141922] text-white">Chennai</option>
                <option value="Kolkata" className="bg-[#141922] text-white">Kolkata</option>
                <option value="Ahmedabad" className="bg-[#141922] text-white">Ahmedabad</option>
                <option value="Jaipur" className="bg-[#141922] text-white">Jaipur</option>
                <option value="Remote" className="bg-[#141922] text-white">Remote (India)</option>
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

          {/* Top Companies Section (Right after the job search option) */}
          <div className="pt-2 max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Top Hiring Companies</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {TOP_HIRING_COMPANIES.map((company) => (
                <button
                  key={company.name}
                  type="button"
                  onClick={() => {
                    handleTitleChange(company.name);
                    if (onSearch) {
                      onSearch(company.name, typeQuery, locationQuery);
                    }
                  }}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141922] hover:bg-teal-500/10 border border-[#253044] hover:border-teal-400/60 text-slate-300 hover:text-white transition-all text-xs font-medium shadow-sm hover:scale-105 active:scale-95"
                >
                  <img
                    src={`https://logo.clearbit.com/${company.domain}`}
                    alt={company.name}
                    className="w-4 h-4 rounded-full object-contain bg-white/10 p-0.5 flex-shrink-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span>{company.name}</span>
                </button>
              ))}
            </div>
          </div>

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

      </div>
    </section>
  );
}
