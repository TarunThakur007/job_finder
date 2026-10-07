import React, { useEffect, useState } from 'react';
import { 
  X, 
  Bookmark, 
  Send, 
  Bell, 
  Crown, 
  Check, 
  Circle, 
  ArrowRight, 
  User, 
  Edit3, 
  Upload, 
  Sparkles, 
  Settings, 
  ArrowLeftRight, 
  LogOut, 
  Compass, 
  CheckCircle2, 
  GraduationCap, 
  FileText,
  Shield,
  Briefcase,
  Users,
  Layers,
  PlusCircle
} from 'lucide-react';

export default function ProfileSidebar({
  isOpen,
  onClose,
  currentUser,
  activeTab,
  setActiveTab,
  onOpenManageAccount,
  onLogout,
  onRequireRegistration,
  onUpdateUser
}) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !currentUser) return null;

  // Determine section and user role: Profile completion is strictly restricted to regular user/candidate section
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN' || activeTab === 'admin-panel';
  const isEmployee = (!isAdmin && (currentUser?.role === 'ROLE_EMPLOYEE' || currentUser?.role === 'EMPLOYEE' || (currentUser?.permissions && currentUser.permissions.length > 0))) || activeTab === 'employee-panel';
  const isRegularUser = !isAdmin && !isEmployee;

  const displayName = currentUser.name || (isAdmin ? 'Alex Vance' : isEmployee ? 'Sarah Jenkins' : 'Tarun Pratap Singh');
  const displayRole = isAdmin 
    ? (currentUser.title || 'Platform Administrator')
    : isEmployee
    ? (currentUser.title || (currentUser.company ? `${currentUser.company} Recruiter` : 'Senior Technical Recruiter'))
    : (currentUser.headline || currentUser.title || 'Java Backend Developer');

  const avatarSrc = (currentUser.avatar && currentUser.avatar.startsWith('/')) 
    ? currentUser.avatar 
    : '/tarun-avatar.jpg';

  const handleAction = (tabName) => {
    onClose();
    if (setActiveTab) {
      setActiveTab(tabName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn select-none">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        title="Close profile menu"
      />

      {/* Slide-over Container matching reference screenshot */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-8">
        <aside className="w-screen max-w-[390px] bg-[#050C16] border-l border-[#122438] text-white shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-out custom-scrollbar relative">
          
          {/* Ambient Decorative Backlights */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* MAIN SCROLLABLE CONTENT */}
          <div className="p-5 sm:p-6 space-y-4 relative z-10">
            
            {/* Top Close Button Row */}
            <div className="flex justify-end items-center">
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-[#091523] hover:bg-[#0f2237] border border-[#14283d] text-slate-400 hover:text-white flex items-center justify-center transition active:scale-95"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. USER PROFILE HEADER */}
            <div className="flex items-center gap-4 pt-1 pb-1">
              {/* Circular Avatar with Online/Role Status Indicator */}
              <div className="relative flex-shrink-0">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 shadow-[0_0_20px_rgba(0,229,201,0.25)] bg-[#071322] ${
                  isAdmin ? 'border-amber-400/60 shadow-amber-500/20' : isEmployee ? 'border-teal-400/60 shadow-teal-500/20' : 'border-[#00e5c9]/40'
                }`}>
                  <img 
                    src={avatarSrc} 
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/tarun-avatar.jpg';
                    }}
                  />
                </div>
                {/* Status Indicator Dot on Avatar */}
                <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#050C16] shadow-md ${
                  isAdmin ? 'bg-amber-400 shadow-amber-500/50' : isEmployee ? 'bg-teal-400 shadow-teal-500/50' : 'bg-[#10b981] shadow-emerald-500/50'
                }`} />
              </div>

              {/* Name, Role & Status */}
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-white truncate leading-snug">
                  {displayName}
                </h2>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {displayRole}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      <Shield className="w-3 h-3 text-amber-400" />
                      Platform Administrator
                    </span>
                  ) : isEmployee ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                      <Briefcase className="w-3 h-3 text-teal-400" />
                      Company Recruiter
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10b981]">
                      <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                      <span>Online Candidate</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. STATS ROW (Role-aware: User Saved Jobs vs Staff Operations) */}
            <div className="bg-[#081524] border border-[#12283e] rounded-2xl p-3 flex items-center justify-between shadow-md">
              {isRegularUser ? (
                <>
                  {/* Saved Jobs */}
                  <div 
                    onClick={() => handleAction('dashboard-overview')}
                    className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer group hover:opacity-85 transition"
                  >
                    <div className="flex items-center gap-1.5 text-[#00e5c9]">
                      <Bookmark className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span className="text-xs sm:text-sm font-bold">12</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">Saved Jobs</span>
                  </div>

                  <div className="w-[1px] h-7 bg-[#12283e]" />

                  {/* Applications */}
                  <div 
                    onClick={() => handleAction('application-tracker')}
                    className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer group hover:opacity-85 transition"
                  >
                    <div className="flex items-center gap-1.5 text-[#00e5c9]">
                      <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span className="text-xs sm:text-sm font-bold">5</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">Applications</span>
                  </div>

                  <div className="w-[1px] h-7 bg-[#12283e]" />

                  {/* Alerts */}
                  <div 
                    onClick={() => handleAction('dashboard-overview')}
                    className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer group hover:opacity-85 transition"
                  >
                    <div className="flex items-center gap-1.5 text-[#00e5c9]">
                      <Bell className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span className="text-xs sm:text-sm font-bold">3</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">Alerts</span>
                  </div>
                </>
              ) : isAdmin ? (
                <>
                  {/* Admin: Feeds */}
                  <div 
                    onClick={() => handleAction('admin-panel')}
                    className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer group hover:opacity-85 transition"
                  >
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Layers className="w-3.5 h-3.5" />
                      <span className="text-xs sm:text-sm font-bold">12</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">Live Boards</span>
                  </div>

                  <div className="w-[1px] h-7 bg-[#12283e]" />

                  {/* Admin: Total Jobs */}
                  <div 
                    onClick={() => handleAction('dashboard-overview')}
                    className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer group hover:opacity-85 transition"
                  >
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Shield className="w-3.5 h-3.5" />
                      <span className="text-xs sm:text-sm font-bold">100+</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">Active Jobs</span>
                  </div>

                  <div className="w-[1px] h-7 bg-[#12283e]" />

                  {/* Admin: Staff Officers */}
                  <div 
                    onClick={() => handleAction('admin-panel')}
                    className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer group hover:opacity-85 transition"
                  >
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-xs sm:text-sm font-bold">6</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">Team Staff</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Employee: Published Roles */}
                  <div 
                    onClick={() => handleAction('employee-panel')}
                    className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer group hover:opacity-85 transition"
                  >
                    <div className="flex items-center gap-1.5 text-teal-300">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span className="text-xs sm:text-sm font-bold">8</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">Open Roles</span>
                  </div>

                  <div className="w-[1px] h-7 bg-[#12283e]" />

                  {/* Employee: Applicants */}
                  <div 
                    onClick={() => handleAction('employee-panel')}
                    className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer group hover:opacity-85 transition"
                  >
                    <div className="flex items-center gap-1.5 text-teal-300">
                      <Send className="w-3.5 h-3.5" />
                      <span className="text-xs sm:text-sm font-bold">24</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">Applicants</span>
                  </div>

                  <div className="w-[1px] h-7 bg-[#12283e]" />

                  {/* Employee: Partner Company */}
                  <div 
                    onClick={() => handleAction('employee-panel')}
                    className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer group hover:opacity-85 transition"
                  >
                    <div className="flex items-center gap-1.5 text-teal-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-xs sm:text-sm font-bold truncate max-w-[70px]">{currentUser.company || 'Google'}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">Partner</span>
                  </div>
                </>
              )}
            </div>

            {/* 3. CONTEXTUAL BANNER (Candidate Premium vs Staff Authority) */}
            {isRegularUser ? (
              <div className="bg-gradient-to-r from-[#071625] to-[#0a1e32] border border-[#00e5c9]/35 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg shadow-teal-500/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Crown className="w-3.5 h-3.5 fill-amber-400" />
                    </div>
                    <h3 className="text-xs font-bold text-amber-300">
                      Premium Member
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-[190px]">
                    Get AI-powered job recommendations, priority alerts, and more.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#00c9b1] hover:bg-[#00e5c9] text-slate-950 text-xs font-black transition shadow-[0_0_15px_rgba(0,201,177,0.3)] active:scale-95 flex-shrink-0"
                >
                  Upgrade
                </button>
              </div>
            ) : isAdmin ? (
              <div className="bg-gradient-to-r from-[#171306] to-[#251e08] border border-amber-500/35 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg shadow-amber-500/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <h3 className="text-xs font-bold text-amber-300">
                      Platform Governance Lead
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-[210px]">
                    Manage real-time job feeds, inspect AI trust evaluations, and oversee team permissions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAction('admin-panel')}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition shadow-[0_0_15px_rgba(251,191,36,0.3)] active:scale-95 flex-shrink-0"
                >
                  Console
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-[#071625] to-[#0a1e32] border border-teal-500/35 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg shadow-teal-500/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                      <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                    <h3 className="text-xs font-bold text-teal-300">
                      Recruiter Partner Hub
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-[210px]">
                    Publish direct verified roles and inspect candidate ATS resonance pipelines.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAction('employee-panel')}
                  className="px-3.5 py-2 rounded-xl bg-[#00c9b1] hover:bg-[#00e5c9] text-slate-950 text-xs font-black transition shadow-[0_0_15px_rgba(0,201,177,0.3)] active:scale-95 flex-shrink-0"
                >
                  Portal
                </button>
              </div>
            )}

            {/* 4. PROFILE COMPLETION SECTION - EXCLUSIVELY SHOWN IN USER SECTION */}
            {isRegularUser && (
              <div className="space-y-2 pt-1 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold px-1">
                  <span className="text-white">Profile Completion</span>
                  <span className="text-white font-mono">85%</span>
                </div>

                {/* Progress Bar (85% filled) */}
                <div className="w-full h-2 rounded-full bg-[#0d1e30] overflow-hidden p-0.5 border border-[#12283e]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00bda6] to-[#00e5c9] rounded-full shadow-[0_0_10px_rgba(0,229,201,0.5)] transition-all duration-500"
                    style={{ width: '85%' }}
                  />
                </div>

                {/* Completion Checklist Box */}
                <div className="bg-[#081524] border border-[#12283e] rounded-2xl p-4 space-y-3 mt-3 shadow-md">
                  
                  {/* 1. Personal Information */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <Compass className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">Personal Information</span>
                    </div>
                    <Check className="w-4 h-4 text-[#00e5c9] stroke-[2.5]" />
                  </div>

                  {/* 2. Skills & Experience */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">Skills & Experience</span>
                    </div>
                    <Check className="w-4 h-4 text-[#00e5c9] stroke-[2.5]" />
                  </div>

                  {/* 3. Education */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">Education</span>
                    </div>
                    <Check className="w-4 h-4 text-[#00e5c9] stroke-[2.5]" />
                  </div>

                  {/* 4. Resume */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">Resume</span>
                    </div>
                    <Check className="w-4 h-4 text-[#00e5c9] stroke-[2.5]" />
                  </div>

                  {/* 5. Job Preferences (Incomplete) */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-slate-300">
                      <Compass className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">Job Preferences</span>
                    </div>
                    <Circle className="w-4 h-4 text-slate-600 stroke-[1.5]" />
                  </div>

                  {/* Complete your profile link */}
                  <div className="pt-1.5 border-t border-[#12283e]">
                    <button
                      type="button"
                      onClick={() => handleAction('candidate-profile')}
                      className="text-[#00e5c9] hover:underline text-xs font-bold inline-flex items-center gap-1 transition"
                    >
                      <span>Complete your profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* 5. QUICK ACTIONS (Role-tailored) */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-400 px-1 block">
                Quick Actions
              </span>

              <div className="space-y-2">
                {isRegularUser ? (
                  <>
                    {/* View Profile */}
                    <button
                      type="button"
                      onClick={() => handleAction('candidate-profile')}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081524] hover:bg-[#0c1f33] border border-[#12283e] hover:border-[#00e5c9]/40 text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-3 shadow-sm active:scale-98"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>View Profile</span>
                    </button>

                    {/* Edit Profile */}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenManageAccount) onOpenManageAccount();
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081524] hover:bg-[#0c1f33] border border-[#12283e] hover:border-[#00e5c9]/40 text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-3 shadow-sm active:scale-98"
                    >
                      <Edit3 className="w-4 h-4 text-slate-400" />
                      <span>Edit Profile</span>
                    </button>

                    {/* Upload Resume */}
                    <button
                      type="button"
                      onClick={() => handleAction('resume-analyzer')}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081524] hover:bg-[#0c1f33] border border-[#12283e] hover:border-[#00e5c9]/40 text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-3 shadow-sm active:scale-98"
                    >
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span>Upload Resume</span>
                    </button>

                    {/* AI Career Insights */}
                    <button
                      type="button"
                      onClick={() => handleAction('resume-analyzer')}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081524] hover:bg-[#0c1f33] border border-[#12283e] hover:border-[#00e5c9]/40 text-xs font-medium text-slate-200 hover:text-white transition flex items-center justify-between shadow-sm active:scale-98"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-[#00e5c9]" />
                        <span>AI Career Insights</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-[#00e5c9] border border-teal-500/40 text-[10px] font-bold">
                        New
                      </span>
                    </button>
                  </>
                ) : isAdmin ? (
                  <>
                    {/* Admin Console */}
                    <button
                      type="button"
                      onClick={() => handleAction('admin-panel')}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081524] hover:bg-[#0c1f33] border border-[#12283e] hover:border-amber-400/40 text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-3 shadow-sm active:scale-98"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Admin Console & Crawlers</span>
                    </button>

                    {/* Team Management */}
                    <button
                      type="button"
                      onClick={() => handleAction('admin-panel')}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081524] hover:bg-[#0c1f33] border border-[#12283e] hover:border-amber-400/40 text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-3 shadow-sm active:scale-98"
                    >
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>Team & Role Access</span>
                    </button>

                    {/* Explore Directory */}
                    <button
                      type="button"
                      onClick={() => handleAction('dashboard-overview')}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081524] hover:bg-[#0c1f33] border border-[#12283e] hover:border-amber-400/40 text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-3 shadow-sm active:scale-98"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>Explore Public Feed</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Employee Portal */}
                    <button
                      type="button"
                      onClick={() => handleAction('employee-panel')}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081524] hover:bg-[#0c1f33] border border-[#12283e] hover:border-teal-400/40 text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-3 shadow-sm active:scale-98"
                    >
                      <Briefcase className="w-4 h-4 text-teal-400" />
                      <span>Recruiter Portal & Postings</span>
                    </button>

                    {/* Candidate Pipeline */}
                    <button
                      type="button"
                      onClick={() => handleAction('employee-panel')}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081524] hover:bg-[#0c1f33] border border-[#12283e] hover:border-teal-400/40 text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-3 shadow-sm active:scale-98"
                    >
                      <Send className="w-4 h-4 text-teal-400" />
                      <span>Review Candidate Submissions</span>
                    </button>

                    {/* Explore Directory */}
                    <button
                      type="button"
                      onClick={() => handleAction('dashboard-overview')}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081524] hover:bg-[#0c1f33] border border-[#12283e] hover:border-teal-400/40 text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-3 shadow-sm active:scale-98"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>Explore Live Jobs</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 6. BOTTOM SETTINGS & ACCOUNT ACTIONS */}
            <div className="space-y-2 pt-2 pb-2">
              {/* Settings */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenManageAccount) onOpenManageAccount();
                }}
                className="w-full px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition flex items-center gap-3 hover:bg-[#081524]"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </button>

              {/* Switch Account */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onLogout) onLogout();
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#081524] hover:bg-[#0c1f33] border border-[#12283e] text-xs font-medium text-slate-300 hover:text-white transition flex items-center gap-3 shadow-sm active:scale-98"
              >
                <ArrowLeftRight className="w-4 h-4 text-slate-400" />
                <span>Switch Account</span>
              </button>

              {/* Logout (Red Accented Card) */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onLogout) onLogout();
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#130f17] hover:bg-red-500/10 border border-red-500/25 hover:border-red-500/40 text-xs font-bold text-red-400 transition flex items-center gap-3 shadow-sm active:scale-98"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Logout</span>
              </button>
            </div>

          </div>

        </aside>
      </div>

      {/* UPGRADE MODAL DIALOG */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#081524] border border-[#00e5c9]/40 rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Crown className="w-6 h-6 fill-amber-400" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Upgrade to Premium</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlock instant AI resume optimization, auto-apply matching, and priority recruiter notifications.
              </p>
            </div>

            <div className="bg-[#050C16] border border-[#12283e] rounded-xl p-3 text-left space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#00e5c9]" />
                <span>AI Job Match Authenticity Scores</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#00e5c9]" />
                <span>Direct Verified Recruiter Telegram Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#00e5c9]" />
                <span>Automated ATS Resume Tailoring</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#14283d] text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUpgradeModal(false);
                  onClose();
                  if (setActiveTab) setActiveTab('candidate-profile');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#00c9b1] hover:bg-[#00e5c9] text-slate-950 text-xs font-black shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
