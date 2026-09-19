import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Sparkles, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HeroSection({ onSearch, onCategorySelect }) {
  const [titleQuery, setTitleQuery] = useState('');
  const [typeQuery, setTypeQuery] = useState('Fulltime');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(titleQuery, typeQuery);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#18181c] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-12 border-b border-gray-800/60">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-yellow-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline & Search */}
        <div className="lg:col-span-7 z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> AI-Verified Job Marketplace
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Find your <span className="text-yellow-400 underline decoration-yellow-500/40 decoration-wavy underline-offset-8">dream job</span> with us
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            Good life begins with a good company. Start explore thousands of verified jobs with transparent trust scores in one place.
          </p>

          {/* Dual Input Search Box */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="bg-[#222228] p-3 sm:p-4 rounded-2xl border border-gray-700/80 shadow-2xl flex flex-col sm:flex-row items-center gap-3 max-w-2xl"
          >
            {/* Job Title Field */}
            <div className="flex-1 w-full bg-[#18181c] rounded-xl px-4 py-2 min-h-[58px] sm:h-[68px] flex flex-col justify-center border border-gray-800 focus-within:border-yellow-500/60 transition-colors">
              <label htmlFor="hero-job-title" className="block text-xs sm:text-sm font-extrabold text-gray-200 tracking-wide mb-0.5">
                Job Title
              </label>
              <input
                id="hero-job-title"
                type="text"
                placeholder="Software Engineer, Designer..."
                value={titleQuery}
                onChange={(e) => setTitleQuery(e.target.value)}
                className="w-full bg-transparent text-white text-sm sm:text-base font-medium placeholder-gray-500 focus:outline-none h-9 sm:h-10"
              />
            </div>

            {/* Job Type Field */}
            <div className="w-full sm:w-48 bg-[#18181c] rounded-xl px-4 py-2 min-h-[58px] sm:h-[68px] flex flex-col justify-center border border-gray-800 focus-within:border-yellow-500/60 transition-colors">
              <label htmlFor="hero-job-type" className="block text-xs sm:text-sm font-extrabold text-gray-200 tracking-wide mb-0.5">
                Job Type
              </label>
              <select
                id="hero-job-type"
                value={typeQuery}
                onChange={(e) => setTypeQuery(e.target.value)}
                className="w-full bg-transparent text-white text-sm sm:text-base font-medium focus:outline-none cursor-pointer h-9 sm:h-10"
              >
                <option value="Fulltime" className="bg-[#18181c] text-white">Fulltime</option>
                <option value="Remote" className="bg-[#18181c] text-white">Remote</option>
                <option value="Contract" className="bg-[#18181c] text-white">Contract</option>
                <option value="Part-Time" className="bg-[#18181c] text-white">Part-Time</option>
                <option value="Internship" className="bg-[#18181c] text-white">Internship</option>
              </select>
            </div>

            {/* Large Yellow Search Button */}
            <button
              type="submit"
              aria-label="Search jobs"
              className="w-full sm:w-16 h-14 sm:h-[68px] bg-yellow-400 hover:bg-yellow-300 text-gray-950 rounded-xl font-bold flex items-center justify-center transition-all duration-200 transform active:scale-95 shadow-lg shadow-yellow-500/20 group flex-shrink-0"
              title="Search Jobs"
            >
              <Search className="w-6 h-6 stroke-[2.5] group-hover:scale-110 transition-transform" />
            </button>
          </form>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-gray-400">
            <span className="font-semibold text-gray-500">Popular Searches:</span>
            {['Software Engineer', 'Frontend Developer', 'Data Scientist', 'DevOps', 'UI/UX'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setTitleQuery(tag);
                  if (onSearch) onSearch(tag, typeQuery);
                }}
                className="px-3 py-1 rounded-full bg-[#222228] hover:bg-yellow-500/20 hover:text-yellow-400 border border-gray-700/60 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Hero Dynamic Illustration & Floating Badges */}
        <div className="lg:col-span-5 relative flex justify-center items-center mt-6 lg:mt-0">
          
          {/* Main Visual Frame */}
          <div className="relative w-full max-w-md aspect-[4/4.2] rounded-3xl bg-gradient-to-b from-[#282830] to-[#1c1c22] border border-gray-700/60 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
            
            {/* Top Graphic Illustration Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400 tracking-wide">100% Verified Employers</span>
              </div>
              <span className="text-xs text-gray-400 font-mono">ID: JP-9940</span>
            </div>

            {/* Center 3D Character Illustration - Full Size */}
            <div className="relative z-10 flex-1 flex items-center justify-center my-1 py-1 w-full h-full">
              <img 
                src="/hero-character.png" 
                alt="3D Developer Character with Laptop" 
                className="w-full h-72 sm:h-80 lg:h-96 object-contain drop-shadow-[0_15px_30px_rgba(245,158,11,0.3)] transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Bottom Graphic Info Bar */}
            <div className="z-10 bg-[#18181c]/80 backdrop-blur-md rounded-2xl p-4 border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Daily New Verified Jobs</p>
                <p className="text-lg font-black text-white">1,450+ Positions</p>
              </div>
              <div className="h-8 w-px bg-gray-800" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Trust Guarantee</p>
                <p className="text-lg font-black text-yellow-400">99.8% AI Score</p>
              </div>
            </div>

            {/* Decorative Background Accents */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Floating Badge 2 (Bottom-Right): 10K+ got job Avatar Stack */}
          <div className="absolute bottom-8 -right-4 sm:-right-8 z-20 animate-float [animation-delay:2s] bg-[#222228]/95 backdrop-blur-md p-3.5 rounded-2xl border border-yellow-500/40 shadow-2xl flex items-center gap-3 text-xs">
            <div className="space-y-0.5">
              <p className="font-extrabold text-white text-sm">10K+ got job</p>
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#222228] bg-yellow-400 text-gray-950 font-bold text-xs flex items-center justify-center">JD</div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#222228] bg-blue-500 text-white font-bold text-xs flex items-center justify-center">AS</div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#222228] bg-purple-500 text-white font-bold text-xs flex items-center justify-center">MK</div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#222228] bg-yellow-500 text-gray-950 font-extrabold text-xs flex items-center justify-center">+9K</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
