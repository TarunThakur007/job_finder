import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { 
  Anchor, 
  Code2, 
  PlusCircle, 
  LogIn, 
  LogOut, 
  User, 
  Sparkles, 
  Activity, 
  Briefcase,
  Shield,
  ChevronDown,
  Settings,
  Building2,
  CheckCircle2,
  FileText,
  Key,
  Menu,
  Sun,
  Moon,
  Search
} from 'lucide-react';

import ProfileSidebar from './ProfileSidebar';

const ManageAccountModal = lazy(() => import('./ManageAccountModal'));

export default function Header({
  activeTab,
  setActiveTab,
  healthStatus,
  currentUser,
  onLogout,
  onLoginClick,
  onPostJobClick,
  onRequireRegistration,
  onUpdateUser,
  theme = 'dark',
  toggleTheme
}) {
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [showManageAccount, setShowManageAccount] = useState(false);

  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';
  const isEmployee = currentUser?.role === 'ROLE_EMPLOYEE' || (currentUser?.permissions && currentUser.permissions.length > 0);

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-[#090B0F]/95 backdrop-blur-md border-b border-[#253044]/80 px-4 sm:px-6 lg:px-8 transition-colors flex items-center">
        <div className="flex items-center justify-between gap-6 max-w-7xl w-full mx-auto">
          
          {/* Brand Logo & Wordmark (JobRadar AI with Concentric Radar Icon) */}
          <div 
            onClick={() => {
              if (isAdmin) {
                setActiveTab('admin-panel');
              } else if (isEmployee) {
                setActiveTab('employee-panel');
              } else {
                setActiveTab('dashboard-overview');
              }
            }} 
            className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
          >
            {/* Concentric Radar Icon */}
            <div className="w-8 h-8 rounded-full border border-teal-400/50 flex items-center justify-center bg-teal-500/10 group-hover:border-teal-400 transition-colors">
              <div className="w-4 h-4 rounded-full border border-teal-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              </div>
            </div>
            <div className="flex items-baseline font-bold text-lg tracking-tight text-white">
              <span>JobRadar</span>
              <span className="text-teal-400 ml-1 font-bold">AI</span>
            </div>
          </div>

          {/* Navigation Tab Links: Clean Linear Underline Style */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Admin Exclusive Navigation */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('admin-panel')}
                  className={`text-xs transition-all flex items-center gap-1.5 pb-1 ${
                    activeTab === 'admin-panel'
                      ? 'text-teal-400 font-semibold border-b-2 border-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </button>
                <button
                  onClick={() => setActiveTab('dashboard-overview')}
                  className={`text-xs transition-all pb-1 ${
                    activeTab === 'dashboard-overview'
                      ? 'text-teal-400 font-semibold border-b-2 border-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Explore Jobs
                </button>
              </>
            )}

            {/* Employee Exclusive Navigation */}
            {isEmployee && !isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('employee-panel')}
                  className={`text-xs transition-all flex items-center gap-1.5 pb-1 ${
                    activeTab === 'employee-panel'
                      ? 'text-teal-400 font-semibold border-b-2 border-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Employee Portal</span>
                </button>
                <button
                  onClick={() => setActiveTab('dashboard-overview')}
                  className={`text-xs transition-all pb-1 ${
                    activeTab === 'dashboard-overview'
                      ? 'text-teal-400 font-semibold border-b-2 border-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Explore Jobs
                </button>
              </>
            )}

            {/* Candidate & Guest Navigation (Explore Jobs, Resume AI, Job Tracker, Experiences) */}
            {!isAdmin && !isEmployee && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard-overview')}
                  className={`text-xs transition-all pb-1 ${
                    activeTab === 'dashboard-overview'
                      ? 'text-teal-400 font-semibold border-b-2 border-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Explore Jobs
                </button>
                <button
                  onClick={() => {
                    if (currentUser?.isDemo) {
                      onRequireRegistration && onRequireRegistration("AI Resume Analysis and ATS Scorecard features require a candidate account. Please register to analyze your resume.");
                      return;
                    }
                    setActiveTab('resume-analyzer');
                  }}
                  className={`text-xs transition-all pb-1 ${
                    activeTab === 'resume-analyzer'
                      ? 'text-teal-400 font-semibold border-b-2 border-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Resume AI
                </button>
                <button
                  onClick={() => {
                    if (currentUser?.isDemo) {
                      onRequireRegistration && onRequireRegistration("Application Tracker Cockpit requires a candidate account. Please register to track your applications.");
                      return;
                    }
                    setActiveTab('application-tracker');
                  }}
                  className={`text-xs transition-all pb-1 ${
                    activeTab === 'application-tracker'
                      ? 'text-teal-400 font-semibold border-b-2 border-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Job Tracker
                </button>
                <button
                  onClick={() => setActiveTab('experience-board')}
                  className={`text-xs transition-all pb-1 ${
                    activeTab === 'experience-board'
                      ? 'text-teal-400 font-semibold border-b-2 border-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Experiences
                </button>
              </>
            )}
          </nav>

          {/* Right Section: Search Pill, Live API, Profile Avatar */}
          <div className="flex items-center gap-3">
            {/* Quick Search Pill */}
            <div 
              onClick={() => {
                const searchEl = document.getElementById('hero-job-search-input') || document.getElementById('job-filter-input');
                if (searchEl) {
                  searchEl.focus();
                  searchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-[#141922] border border-[#253044] rounded-full hover:border-teal-500/40 cursor-pointer transition select-none shadow-sm"
              title="Search jobs (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search...</span>
            </div>

            {/* Backend Health Badge (Green dot: Live API) */}
            <div className="flex items-center gap-1.5 text-xs bg-[#141922] border border-[#253044] rounded-full px-3 py-1 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${healthStatus?.data ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-mono text-[11px] font-medium">
                {healthStatus?.loading ? 'Checking' : healthStatus?.data ? 'Live API •' : 'Offline'}
              </span>
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-[#141922] border border-[#253044] hover:border-teal-400/50 text-slate-300 hover:text-teal-400 transition-all flex items-center justify-center shadow-sm active:scale-95 group focus:outline-none"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-teal-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-teal-500 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* If Demo User: Register Button */}
            {currentUser?.isDemo && (
              <button
                onClick={() => onRequireRegistration && onRequireRegistration("Create your free candidate account to apply for jobs and unlock AI resume tools.")}
                className="hidden sm:inline-flex btn btn-primary text-xs py-1.5 px-3"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            )}

            {/* User Profile Container or Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setShowProfileSidebar(true)}
                  className="flex items-center gap-2.5 bg-[#141922] pl-2 pr-3 py-1.5 rounded-xl border border-[#253044] hover:border-teal-500/40 cursor-pointer transition select-none shadow-sm group"
                  title="Open Workspace Profile"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#1A2230] border border-[#253044] flex items-center justify-center text-xs select-none">
                    {currentUser.avatar || '👤'}
                  </div>

                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 leading-none flex items-center gap-1 group-hover:text-teal-300 transition-colors">
                      {currentUser.name}
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-teal-300" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5">
                      {currentUser.isDemo 
                        ? 'Preview Mode' 
                        : isEmployee 
                        ? 'Employee' 
                        : isAdmin 
                        ? 'Administrator' 
                        : 'Candidate'}
                    </span>
                  </div>
                </div>

                {/* Mobile Menu & Profile Toggle */}
                <button
                  type="button"
                  onClick={() => setShowProfileSidebar(true)}
                  className="md:hidden p-2 rounded-md bg-surface-raised border border-border-subtle text-ink-primary hover:bg-surface-overlay transition flex items-center justify-center min-w-[44px] min-h-[44px]"
                  title="Open Navigation & Profile Menu"
                >
                  <Menu className="w-4 h-4 text-ink-primary" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="btn btn-secondary text-xs py-1.5 px-3"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </header>

      {/* MANAGE ACCOUNT MODAL */}
      {showManageAccount && (
        <Suspense fallback={null}>
          <ManageAccountModal
            currentUser={currentUser}
            onClose={() => setShowManageAccount(false)}
            onLogout={onLogout}
            onUpdateUser={onUpdateUser}
          />
        </Suspense>
      )}

      {/* SLIDE-OVER PROFILE SIDEBAR */}
      <ProfileSidebar
        isOpen={showProfileSidebar}
        onClose={() => setShowProfileSidebar(false)}
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenManageAccount={() => setShowManageAccount(true)}
        onLogout={onLogout}
        onRequireRegistration={onRequireRegistration}
        onUpdateUser={onUpdateUser}
      />
    </>
  );
}
