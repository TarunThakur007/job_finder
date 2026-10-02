import React, { useState, useEffect, useRef } from 'react';
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
  Key
} from 'lucide-react';
import ManageAccountModal from './ManageAccountModal';

export default function Header({
  activeTab,
  setActiveTab,
  healthStatus,
  currentUser,
  onLogout,
  onLoginClick,
  onPostJobClick,
  onRequireRegistration,
  onUpdateUser
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showManageAccount, setShowManageAccount] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';
  const isEmployee = currentUser?.role === 'ROLE_EMPLOYEE';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#18181c]/95 backdrop-blur-md border-b border-gray-800/80 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
          
          {/* Brand Logo */}
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
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-yellow-500/20 border border-yellow-500/30 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.png" alt="JobProof Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-baseline font-black text-xl sm:text-2xl tracking-tight text-white">
              <span>Job</span>
              <span className="text-yellow-400">Proof</span>
            </div>
          </div>

          {/* Navigation Tab Links: Only for Candidates / Non-Staff Users */}
          {isEmployee ? (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#222228] border border-yellow-500/30 text-xs">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="font-extrabold text-white">Employee Workspace</span>
              <span className="text-gray-600">|</span>
              <span className="text-yellow-400 font-bold">Permission Grant Center</span>
            </div>
          ) : isAdmin ? (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#222228] border border-yellow-500/30 text-xs">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="font-extrabold text-white">Admin Author Console</span>
              <span className="text-gray-600">|</span>
              <span className="text-yellow-400 font-bold">Exclusive Admin Authority</span>
            </div>
          ) : (
            <nav className="hidden md:flex items-center gap-1.5 bg-[#222228] p-1.5 rounded-xl border border-gray-800">
              <button
                onClick={() => setActiveTab('dashboard-overview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'dashboard-overview'
                    ? 'bg-yellow-400 text-gray-950 shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                Find Jobs
              </button>
              <button
                onClick={() => {
                  if (currentUser?.isDemo) {
                    onRequireRegistration && onRequireRegistration("AI Resume Analysis and ATS Scorecard features require a candidate account. Please register to analyze your resume.");
                    return;
                  }
                  setActiveTab('resume-analyzer');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'resume-analyzer'
                    ? 'bg-yellow-400 text-gray-950 shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                Resume AI
              </button>
              <button
                onClick={() => setActiveTab('experience-board')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'experience-board'
                    ? 'bg-yellow-400 text-gray-950 shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                Experiences
              </button>
            </nav>
          )}

          {/* Right Section: Backend Health, Demo Register & User Profile Pill */}
          <div className="flex items-center gap-3">
            {/* Backend Health Badge */}
            <div className="hidden lg:flex items-center gap-2 text-xs bg-[#222228] border border-gray-800 rounded-xl px-3.5 py-1.5 text-gray-400">
              <span className={`w-2 h-2 rounded-full ${healthStatus?.data ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`} />
              <span className="font-semibold text-gray-300">
                Backend: {healthStatus?.loading ? 'Checking...' : healthStatus?.data ? 'Connected' : 'Standalone'}
              </span>
            </div>

            {/* If Demo User: Register Button directly in Header */}
            {currentUser?.isDemo && (
              <button
                onClick={() => onRequireRegistration && onRequireRegistration("Create your free candidate account to apply for jobs and unlock AI resume tools.")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs transition shadow-md shadow-yellow-500/20 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Register Now</span>
              </button>
            )}

            {/* Login or User Avatar Pill with Dropdown Trigger */}
            {currentUser ? (
              <div className="relative" ref={profileMenuRef}>
                <div 
                  onClick={() => setShowProfileMenu(prev => !prev)}
                  className="flex items-center gap-2.5 bg-[#222228] pl-2 pr-3 py-1.5 rounded-full border border-gray-800 hover:border-yellow-400/60 hover:bg-gray-800/80 cursor-pointer transition select-none shadow-md"
                  title="Click to view profile, manage account, or log out"
                >
                  {/* Emoji Avatar */}
                  <div className="w-7 h-7 rounded-full bg-[#18181c] border border-yellow-400 flex items-center justify-center text-xs select-none shadow-sm flex-shrink-0">
                    {currentUser.avatar || '👤'}
                  </div>

                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-none flex items-center gap-1">
                      {currentUser.name}
                      <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180 text-yellow-400' : ''}`} />
                    </span>
                    <span className="text-[10px] font-semibold text-yellow-400/90 leading-tight mt-0.5 flex items-center gap-1">
                      {currentUser.isDemo 
                        ? 'Preview (View-Only)' 
                        : isEmployee 
                        ? 'Employee Portal' 
                        : isAdmin 
                        ? 'Admin Author' 
                        : 'Candidate'}
                      {(isEmployee || isAdmin) && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                      )}
                    </span>
                  </div>
                </div>

                {/* INTERACTIVE PROFILE DROPDOWN MENU */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#222228] border border-gray-700/80 rounded-3xl p-4 shadow-2xl z-50 animate-fadeIn space-y-3">
                    
                    {/* User Identity Header Card */}
                    <div className="flex items-start gap-3 p-2 bg-[#18181c] rounded-2xl border border-gray-800">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl select-none border-2 flex-shrink-0 ${
                        isAdmin 
                          ? 'bg-purple-950/60 border-purple-400 text-purple-300' 
                          : isEmployee 
                          ? 'bg-yellow-400/10 border-yellow-400 text-yellow-300' 
                          : 'bg-blue-500/10 border-blue-400 text-blue-300'
                      }`}>
                        {currentUser.avatar || '👤'}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            isAdmin
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : isEmployee
                              ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {isAdmin ? 'Admin Author' : isEmployee ? 'Company Recruiter' : 'Candidate'}
                          </span>
                          {currentUser.company && (
                            <span className="text-[10px] text-gray-400 truncate">
                              • {currentUser.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Session Status Chip */}
                    <div className="px-3 py-1.5 rounded-xl bg-[#18181c]/60 border border-gray-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Status:
                      </span>
                      <span className="text-emerald-400 font-bold">Online & Authenticated</span>
                    </div>

                    {/* Navigation Portals */}
                    <div className="space-y-1">
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setActiveTab('admin-panel');
                            setShowProfileMenu(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                            activeTab === 'admin-panel'
                              ? 'bg-yellow-400 text-gray-950 font-black'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-purple-400" />
                            <span>Admin Governance Console</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 font-extrabold">Author</span>
                        </button>
                      )}

                      {isEmployee && (
                        <button
                          onClick={() => {
                            setActiveTab('employee-panel');
                            setShowProfileMenu(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                            activeTab === 'employee-panel'
                              ? 'bg-yellow-400 text-gray-950 font-black'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-yellow-400" />
                            <span>Employee Portal</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-900/60 text-yellow-300 font-extrabold">Recruiter</span>
                        </button>
                      )}

                      {!isAdmin && !isEmployee && (
                        <>
                          <button
                            onClick={() => {
                              setActiveTab('dashboard-overview');
                              setShowProfileMenu(false);
                            }}
                            className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-800 transition flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4 text-yellow-400" />
                            <span>Job Search & Board</span>
                          </button>
                          <button
                            onClick={() => {
                              if (currentUser?.isDemo) {
                                onRequireRegistration && onRequireRegistration("AI Resume Analysis requires a candidate account.");
                                setShowProfileMenu(false);
                                return;
                              }
                              setActiveTab('resume-analyzer');
                              setShowProfileMenu(false);
                            }}
                            className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-800 transition flex items-center gap-2"
                          >
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span>AI Resume Optimizer</span>
                          </button>
                        </>
                      )}
                    </div>

                    <div className="h-px bg-gray-800" />

                    {/* Manage Account & Profile Action */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowManageAccount(true);
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-200 hover:text-white bg-[#18181c] hover:bg-gray-800 border border-gray-800 hover:border-yellow-400/50 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-yellow-400 group-hover:rotate-45 transition-transform duration-300" />
                        <span>Manage Account & Profile</span>
                      </div>
                      <span className="text-[10px] text-gray-400">Settings</span>
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out of Session</span>
                    </button>

                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-xs font-bold text-yellow-400 hover:text-yellow-300 px-3 py-2 transition"
              >
                Login
              </button>
            )}

          </div>

        </div>
      </header>

      {/* MANAGE ACCOUNT MODAL */}
      {showManageAccount && (
        <ManageAccountModal
          currentUser={currentUser}
          onClose={() => setShowManageAccount(false)}
          onLogout={onLogout}
          onUpdateUser={onUpdateUser}
        />
      )}
    </>
  );
}
