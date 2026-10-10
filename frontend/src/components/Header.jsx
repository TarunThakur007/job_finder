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
  Moon
} from 'lucide-react';

import ProfileSidebar from './ProfileSidebar';

const ManageAccountModal = lazy(() => import('./ManageAccountModal'));

const HEADER_TOP_COMPANIES = [
  { name: 'Google', domain: 'google.com', tag: 'Big Tech / Cloud' },
  { name: 'Microsoft', domain: 'microsoft.com', tag: 'Enterprise Cloud' },
  { name: 'Amazon', domain: 'amazon.com', tag: 'AWS & E-Commerce' },
  { name: 'Stripe', domain: 'stripe.com', tag: 'FinTech / Payments' },
  { name: 'Figma', domain: 'figma.com', tag: 'Design Systems' },
  { name: 'Netflix', domain: 'netflix.com', tag: 'Streaming / Infra' },
  { name: 'Apple', domain: 'apple.com', tag: 'Hardware & OS' },
  { name: 'Meta', domain: 'meta.com', tag: 'Social / AI' },
  { name: 'Uber', domain: 'uber.com', tag: 'Mobility & Scale' },
  { name: 'Swiggy', domain: 'swiggy.com', tag: 'Quick Commerce' },
  { name: 'Razorpay', domain: 'razorpay.com', tag: 'FinTech India' },
  { name: 'CRED', domain: 'cred.club', tag: 'FinTech Club' }
];

const HEADER_TOP_ROLES = [
  { title: 'Software Engineer', tag: 'High Volume', badge: 'Popular' },
  { title: 'Full Stack Engineer', tag: 'React + Node/Java', badge: 'Trending' },
  { title: 'Backend Developer', tag: 'Java, Go, Python', badge: 'Core' },
  { title: 'Frontend Developer', tag: 'React, TypeScript', badge: 'UI' },
  { title: 'DevOps & Cloud Engineer', tag: 'Kubernetes, AWS', badge: 'Infra' },
  { title: 'Data Scientist & AI', tag: 'LLMs, PyTorch', badge: 'AI/ML' },
  { title: 'Cyber Security Engineer', tag: 'Zero Trust, SOC', badge: 'Security' },
  { title: 'Product Manager', tag: 'Technical PM', badge: 'Strategy' },
  { title: 'Mobile Developer', tag: 'iOS, Android, React Native', badge: 'App' }
];

export default function Header({
  activeTab,
  setActiveTab,
  healthStatus,
  currentUser,
  onLogout,
  onLoginClick,
  onRegisterClick,
  onPostJobClick,
  onRequireRegistration,
  onUpdateUser,
  theme = 'dark',
  toggleTheme,
  displayPreferences,
  onCycleTheme,
  onSelectCompany,
  onSelectRole
}) {
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [showManageAccount, setShowManageAccount] = useState(false);
  const [showCompaniesDropdown, setShowCompaniesDropdown] = useState(false);
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);
  const companiesRef = useRef(null);
  const rolesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (companiesRef.current && !companiesRef.current.contains(e.target)) {
        setShowCompaniesDropdown(false);
      }
      if (rolesRef.current && !rolesRef.current.contains(e.target)) {
        setShowRolesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

                {/* Jobs by Companies Dropdown */}
                <div className="relative" ref={companiesRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCompaniesDropdown(prev => !prev);
                      setShowRolesDropdown(false);
                    }}
                    className={`text-xs transition-all flex items-center gap-1.5 pb-1 ${
                      showCompaniesDropdown ? 'text-teal-400 font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Jobs by Companies</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showCompaniesDropdown ? 'rotate-180 text-teal-400' : ''}`} />
                  </button>

                  {showCompaniesDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-[#0d131f] border border-[#253044] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                      <div className="px-3 py-2 border-b border-[#253044]/80 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Hiring Companies</span>
                        <span className="text-[10px] text-teal-400 font-mono font-semibold">12 Featured</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto py-1 space-y-0.5">
                        {HEADER_TOP_COMPANIES.map(company => (
                          <button
                            key={company.name}
                            type="button"
                            onClick={() => {
                              setShowCompaniesDropdown(false);
                              if (onSelectCompany) {
                                onSelectCompany(company.name);
                              }
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#162032] transition flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={`https://logo.clearbit.com/${company.domain}`}
                                alt={company.name}
                                className="w-5 h-5 rounded-full object-contain bg-white/10 p-0.5 flex-shrink-0"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              <div>
                                <div className="text-xs font-semibold text-white group-hover:text-teal-400 transition-colors">
                                  {company.name}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                  {company.tag}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] text-teal-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                              View &rarr;
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Jobs by Roles Dropdown */}
                <div className="relative" ref={rolesRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRolesDropdown(prev => !prev);
                      setShowCompaniesDropdown(false);
                    }}
                    className={`text-xs transition-all flex items-center gap-1.5 pb-1 ${
                      showRolesDropdown ? 'text-teal-400 font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                    <span>Jobs by Roles</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showRolesDropdown ? 'rotate-180 text-teal-400' : ''}`} />
                  </button>

                  {showRolesDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-[#0d131f] border border-[#253044] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                      <div className="px-3 py-2 border-b border-[#253044]/80 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Engineering Roles</span>
                        <span className="text-[10px] text-teal-400 font-mono font-semibold">Verified</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto py-1 space-y-0.5">
                        {HEADER_TOP_ROLES.map(role => (
                          <button
                            key={role.title}
                            type="button"
                            onClick={() => {
                              setShowRolesDropdown(false);
                              if (onSelectRole) {
                                onSelectRole(role.title);
                              }
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#162032] transition flex items-center justify-between group"
                          >
                            <div>
                              <div className="text-xs font-semibold text-white group-hover:text-teal-400 transition-colors">
                                {role.title}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {role.tag}
                              </div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                              {role.badge}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* Right Section: Login, Register, Theme, Profile Avatar */}
          <div className="flex items-center gap-2.5">
            {/* Login Button */}
            <button
              type="button"
              onClick={onLoginClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#141922] hover:bg-[#1A2333] border border-[#253044] hover:border-teal-400/50 rounded-full transition-all shadow-sm active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-400" />
              <span>Login</span>
            </button>

            {/* Register Button */}
            <button
              type="button"
              onClick={onRegisterClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-full transition-all shadow-md shadow-teal-500/20 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950/20" />
              <span>Register</span>
            </button>

            {/* Dark / Light Mode Switch Button */}
            <button
              type="button"
              id="theme-toggle-btn"
              onClick={toggleTheme || onCycleTheme}
              className="p-1.5 rounded-full bg-[#141922] border border-[#253044] hover:border-teal-400/50 text-slate-300 hover:text-teal-400 transition-colors flex items-center justify-center shadow-sm active:scale-95 group focus:outline-none"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-amber-500 group-hover:-rotate-12 transition-transform duration-150" />
              ) : (
                <Sun className="w-4 h-4 text-teal-400 group-hover:rotate-45 transition-transform duration-150" />
              )}
            </button>

            {/* User Profile Container or Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setShowProfileSidebar(true)}
                  className="flex items-center gap-2.5 bg-[#081524] hover:bg-[#0c1f33] pl-1.5 pr-3 py-1 rounded-2xl border border-[#13273e] hover:border-[#00e5c9]/50 cursor-pointer transition-all select-none shadow-md group"
                  title="Open Workspace Profile"
                >
                  {/* Circular Avatar with Green Online Dot */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#00e5c9]/40 flex-shrink-0 shadow-sm bg-[#060e19]">
                    <img 
                      src={currentUser?.avatar && currentUser.avatar.startsWith('/') ? currentUser.avatar : '/tarun-avatar.jpg'} 
                      alt={currentUser?.name || 'Tarun Pratap Singh'} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/tarun-avatar.jpg'; }}
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-[#081524] shadow-sm" />
                  </div>

                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-tight flex items-center gap-1 group-hover:text-[#00e5c9] transition-colors">
                      {currentUser?.name || 'Tarun Pratap Singh'}
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#00e5c9] transition-transform group-hover:translate-y-0.5" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      <span className="text-emerald-400 font-semibold">Online</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 truncate max-w-[120px]">{currentUser?.headline || currentUser?.title || 'Java Backend Developer'}</span>
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
