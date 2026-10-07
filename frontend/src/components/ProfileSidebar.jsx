import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Settings, 
  LogOut, 
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Briefcase,
  Kanban,
  MessageSquare,
  ShieldCheck,
  User,
  ExternalLink,
  ArrowUpRight,
  SlidersHorizontal,
  Flame,
  Star,
  Code2,
  Lock
} from 'lucide-react';

const AVATAR_OPTIONS = ['👨‍💻', '👩‍💻', '⚡', '🚀', '🛡️', '💎', '🦾', '🎯', '🦁', '🌟'];

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
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || '👨‍💻');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser?.avatar) {
      setSelectedAvatar(currentUser.avatar);
    }
  }, [currentUser]);

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

  // Lock body scroll when sidebar is open
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

  const isAdmin = currentUser.role === 'ROLE_ADMIN' || currentUser.role === 'ADMIN';
  const isEmployee = currentUser.role === 'ROLE_EMPLOYEE';
  const isDemo = currentUser.isDemo;

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setShowAvatarPicker(false);
    const updated = { ...currentUser, avatar };
    try {
      localStorage.setItem('jobproof_user', JSON.stringify(updated));
    } catch (e) {}
    if (onUpdateUser) onUpdateUser(updated);
  };

  const atsScore = 94;

  const [trustScore, setTrustScore] = useState(() => {
    try {
      const saved = localStorage.getItem('jobproof_candidate_trust_score');
      if (saved) return Number(saved);
    } catch (e) {}
    return currentUser?.trustScore || 96;
  });

  useEffect(() => {
    if (currentUser?.trustScore) {
      setTrustScore(currentUser.trustScore);
    }
  }, [currentUser]);

  const handleTrustScoreChange = (newVal) => {
    const clamped = Math.max(50, Math.min(100, Math.round(newVal)));
    setTrustScore(clamped);
    try {
      localStorage.setItem('jobproof_candidate_trust_score', clamped);
    } catch (e) {}
    if (onUpdateUser) {
      onUpdateUser({ ...currentUser, trustScore: clamped });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        title="Click to close profile"
      />

      {/* Slide-over Profile Drawer (Concept 2 Design) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside className="w-screen max-w-md bg-[#090B0F] border-l border-[#253044] text-white shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-out custom-scrollbar relative">
          
          {/* Ambient Decorative Teal Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* MAIN PROFILE BODY */}
          <div className="p-6 space-y-6 relative z-10">
            
            {/* 1. Drawer Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2638]">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
                </span>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span>Candidate Profile</span>
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  </h2>
                  <p className="text-[10px] text-slate-400 font-mono">JobProof Career Cockpit</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-[#141922] hover:bg-[#1E2638] border border-[#253044] text-slate-400 hover:text-white flex items-center justify-center transition active:scale-95"
                title="Close Profile (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Glowing User Identity Card */}
            <div className="p-5 rounded-3xl bg-[#0D1117] border border-[#253044] shadow-xl relative overflow-hidden space-y-4 group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4">
                {/* Glowing Avatar */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="w-16 h-16 rounded-2xl bg-[#141922] border-2 border-teal-400/80 flex items-center justify-center text-3xl select-none shadow-lg shadow-teal-500/20 transition-transform hover:scale-105 active:scale-95"
                    title="Click to customize persona"
                  >
                    {selectedAvatar}
                  </button>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-teal-500 text-[9px] font-black text-slate-950 uppercase shadow-sm">
                    Edit
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-base font-black text-white truncate leading-tight">
                      {currentUser.name}
                    </h3>
                  </div>
                  
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {currentUser.headline || currentUser.title || 'Staff Backend Engineer'}
                  </p>

                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Verified Identity
                    </span>
                  </div>
                </div>
              </div>

              {/* Avatar Selector Dropdown */}
              {showAvatarPicker && (
                <div className="p-3 bg-[#141922] border border-[#253044] rounded-xl space-y-2 animate-fadeIn">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Choose Avatar Persona</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => handleAvatarSelect(av)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition hover:scale-110 active:scale-95 ${
                          selectedAvatar === av ? 'bg-teal-500/20 border border-teal-400 shadow-sm' : 'bg-[#1E2638] border border-transparent'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3a. Circular ATS Match Score Ring */}
            <div className="p-4 rounded-2xl bg-[#141922] border border-[#253044] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-800 border-t-teal-400 border-r-teal-400 rotate-45 flex-shrink-0 shadow-md shadow-teal-500/15">
                  <span className="text-xs font-black text-white -rotate-45 font-mono">
                    {atsScore}%
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white leading-tight">ATS Resume Match</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Top 5% alignment across active tech roles</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (setActiveTab) setActiveTab('resume-analyzer');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold transition flex items-center gap-1 flex-shrink-0"
              >
                <span>Re-Scan</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* 3b. Interactive Trust Authenticity Score Card */}
            <div className="p-4 rounded-2xl bg-[#141922] border border-[#253044] space-y-3 shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="#1E2638"
                        strokeWidth="3.5"
                        fill="transparent"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke={trustScore >= 95 ? "#10B981" : trustScore >= 85 ? "#14B8A6" : trustScore >= 70 ? "#38BDF8" : "#F59E0B"}
                        strokeWidth="3.5"
                        strokeDasharray={2 * Math.PI * 18}
                        strokeDashoffset={(2 * Math.PI * 18) - (trustScore / 100) * (2 * Math.PI * 18)}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-300"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-black text-white font-mono">
                      {trustScore}%
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white leading-tight">Trust Authenticity Score</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {trustScore >= 95 ? 'Top 1% Elite Candidate' : trustScore >= 85 ? 'Verified Technical Credentials' : 'Standard Validation'}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  trustScore >= 90 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  {trustScore >= 95 ? 'Elite' : trustScore >= 85 ? 'Verified' : 'Standard'}
                </span>
              </div>

              {/* Slider Controller */}
              <div className="pt-2 border-t border-[#1E2638] space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">Adjust Trust Index</span>
                  <span className="font-mono text-teal-400 font-bold">{trustScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={trustScore}
                  onChange={(e) => handleTrustScoreChange(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer h-1.5 bg-[#1E2638] rounded-lg"
                />
              </div>
            </div>

            {/* 4. PRIMARY HIGH-IMPACT ACTION: OPEN FULL CANDIDATE COMMAND CENTER (OPTION C) */}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (setActiveTab) setActiveTab('candidate-profile');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:from-[#0D9488] hover:to-[#0F766E] text-white text-xs font-black shadow-lg shadow-teal-500/25 transition-all flex items-center justify-between group active:scale-95"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span>Open Full Command Center</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 5. WORKSPACE QUICK SHORTCUTS */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 block">
                Workspace Shortcuts
              </span>

              {/* Link to AI Resume Optimizer */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (setActiveTab) setActiveTab('resume-analyzer');
                }}
                className="w-full p-3 rounded-xl bg-[#0D1117] hover:bg-[#141922] border border-[#253044] hover:border-teal-500/40 text-xs font-bold text-slate-200 hover:text-white transition flex items-center justify-between group active:scale-95 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">AI Resume Optimizer</span>
                    <span className="text-[10px] text-slate-400 font-normal">Scorecard, ATS metrics & bullets</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Link to Application Kanban Tracker */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (setActiveTab) setActiveTab('application-tracker');
                }}
                className="w-full p-3 rounded-xl bg-[#0D1117] hover:bg-[#141922] border border-[#253044] hover:border-blue-500/40 text-xs font-bold text-slate-200 hover:text-white transition flex items-center justify-between group active:scale-95 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Kanban className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Application Tracker</span>
                    <span className="text-[10px] text-slate-400 font-normal">Track employer application stages</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Link to Community Experiences */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (setActiveTab) setActiveTab('experience-board');
                }}
                className="w-full p-3 rounded-xl bg-[#0D1117] hover:bg-[#141922] border border-[#253044] hover:border-emerald-500/40 text-xs font-bold text-slate-200 hover:text-white transition flex items-center justify-between group active:scale-95 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Community Experiences</span>
                    <span className="text-[10px] text-slate-400 font-normal">Interview insights & questions</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* 6. VERIFICATION & CREDENTIALS GRID */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 block">
                Verified Credentials
              </span>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#253044] space-y-1">
                  <Code2 className="w-4 h-4 text-teal-400 mx-auto" />
                  <span className="text-[10px] font-bold text-slate-200 block truncate">GitHub</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">Verified</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#253044] space-y-1">
                  <Building2 className="w-4 h-4 text-blue-400 mx-auto" />
                  <span className="text-[10px] font-bold text-slate-200 block truncate">LinkedIn</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">Verified</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#253044] space-y-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
                  <span className="text-[10px] font-bold text-slate-200 block truncate">ATS Resume</span>
                  <span className="text-[9px] font-mono text-teal-400 font-bold">Optimized</span>
                </div>
              </div>
            </div>

          </div>

          {/* ACTIONS FOOTER */}
          <div className="p-6 bg-[#07090D] border-t border-[#1E2638] space-y-3 relative z-10">
            {/* Manage Account Option */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenManageAccount();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#141922] hover:bg-[#1E2638] border border-[#253044] hover:border-teal-400 text-xs font-bold text-slate-200 hover:text-white transition flex items-center justify-between group active:scale-95 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-teal-400 group-hover:rotate-45 transition-transform duration-300" />
                <span>Account Settings & Credentials</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* Logout Option */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
}
