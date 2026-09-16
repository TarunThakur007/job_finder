import React from 'react';
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';

export default function Header({ 
  sidebarOpen, 
  setSidebarOpen, 
  healthStatus, 
  searchTerm, 
  setSearchTerm,
  isDarkMode,
  setIsDarkMode
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
        {/* Left Section: Mobile Sidebar Toggle & Search Input */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Box matching JobProof styling */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search job & verification proof..."
              className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Right Section: Bell Notification, Theme Switch, and User Avatar */}
        <div className="flex items-center gap-3">
          {/* Health Status Indicator Badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-full px-3.5 py-1.5 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${healthStatus.data ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${healthStatus.data ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Backend:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {healthStatus.loading ? 'Connecting...' : healthStatus.data ? 'ONLINE' : 'Standby'}
            </span>
          </div>

          {/* Light/Dark Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
          </button>

          {/* Bell Icon Pill with Red Notification Dot */}
          <div className="relative">
            <button className="p-2.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs">
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
          </div>

          {/* Profile Picture Circle */}
          <div className="flex items-center gap-2 pl-2">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
              alt="Cooper Curtis"
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-2xs hover:scale-105 transition cursor-pointer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
