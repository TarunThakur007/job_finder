import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  ExternalLink,
  Award,
  ArrowUpRight,
  Send,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  Code2,
  Plus,
  X,
  Download,
  Edit3,
  Check,
  Clock,
  Layers,
  GraduationCap,
  Compass,
  Circle,
  Linkedin,
  Github,
  Copy,
  CheckCheck,
  Globe,
  Link as LinkIcon
} from 'lucide-react';

const LeetCodeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.314c.015-.016.03-.031.045-.046l4.307-4.613a1.376 1.376 0 0 0-1-2.655z" fill="#FFA116" />
    <path d="M9.833 10.903a1.376 1.376 0 1 0 0 2.753h11.791a1.376 1.376 0 1 0 0-2.753H9.833z" fill="#FFA116" />
  </svg>
);

const GfgIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.003 2.001C6.48 2.001 2 6.482 2 12.003c0 5.523 4.48 10.003 10.003 10.003 5.522 0 10.002-4.48 10.002-10.003 0-5.521-4.48-10.002-10.002-10.002zm-1.89 13.992c-1.282 0-2.324-1.042-2.324-2.324 0-1.282 1.042-2.324 2.324-2.324.71 0 1.344.321 1.767.828l-1.04.78c-.201-.264-.52-.432-.88-.432-.634 0-1.148.514-1.148 1.148 0 .634.514 1.148 1.148 1.148.552 0 1.011-.39 1.121-.912H10.11v-1.15h2.38v.284c0 1.635-1.082 2.942-2.377 2.942zm5.78 0c-1.282 0-2.324-1.042-2.324-2.324 0-1.282 1.042-2.324 2.324-2.324.71 0 1.344.321 1.767.828l-1.04.78c-.201-.264-.52-.432-.88-.432-.634 0-1.148.514-1.148 1.148 0 .634.514 1.148 1.148 1.148.552 0 1.011-.39 1.121-.912h-1.123v-1.15h2.38v.284c0 1.635-1.082 2.942-2.377 2.942z" fill="#2F8D46" />
  </svg>
);

const DEFAULT_SKILLS = [
  'Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes',
  'REST APIs', 'React', 'TypeScript', 'AWS Cloud', 'Git'
];

export default function CandidateProfileSection({
  currentUser,
  onUpdateUser,
  setActiveTab,
  onRequireRegistration
}) {
  // Candidate profile state
  const [headline, setHeadline] = useState(currentUser?.headline || currentUser?.title || 'Staff Backend Engineer');
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [tempHeadline, setTempHeadline] = useState(headline);

  // Compensation preferences
  const [minSalary, setMinSalary] = useState(130000);
  const [maxSalary, setMaxSalary] = useState(195000);
  const [workMode, setWorkMode] = useState('Remote'); // 'Remote' | 'Hybrid' | 'Flexible'

  // Skills
  const [skills, setSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('jobproof_candidate_skills');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_SKILLS;
  });
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);

  // Tracked applications from localStorage
  const trackedApps = useMemo(() => {
    try {
      const saved = localStorage.getItem('jobproof_tracked_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [
      { id: 1, companyName: 'Stripe', jobTitle: 'Senior Infrastructure Engineer', status: 'INTERVIEW', atsMatchScore: 94, salary: '$165k - $210k' },
      { id: 2, companyName: 'Figma', jobTitle: 'Staff Backend Architect', status: 'APPLIED', atsMatchScore: 92, salary: '$180k - $230k' },
      { id: 3, companyName: 'Datadog', jobTitle: 'Distributed Systems Lead', status: 'REVIEWING', atsMatchScore: 89, salary: '$170k - $215k' }
    ];
  }, []);

  // Save skills changes
  const addSkill = () => {
    if (!newSkillInput.trim()) return;
    const clean = newSkillInput.trim();
    if (!skills.includes(clean)) {
      const updated = [...skills, clean];
      setSkills(updated);
      try {
        localStorage.setItem('jobproof_candidate_skills', JSON.stringify(updated));
      } catch (e) {}
    }
    setNewSkillInput('');
    setShowSkillInput(false);
  };

  const removeSkill = (skillToRemove) => {
    const updated = skills.filter(s => s !== skillToRemove);
    setSkills(updated);
    try {
      localStorage.setItem('jobproof_candidate_skills', JSON.stringify(updated));
    } catch (e) {}
  };

  const saveHeadline = () => {
    setHeadline(tempHeadline);
    setIsEditingHeadline(false);
    const updated = { ...currentUser, headline: tempHeadline, title: tempHeadline };
    try {
      localStorage.setItem('jobproof_user', JSON.stringify(updated));
    } catch (e) {}
    if (onUpdateUser) onUpdateUser(updated);
  };

  // Trust Score adjustment & verification signals
  const [trustScore, setTrustScore] = useState(() => {
    try {
      const saved = localStorage.getItem('jobproof_candidate_trust_score');
      if (saved) return Number(saved);
    } catch (e) {}
    return currentUser?.trustScore || 96;
  });
  const [showTrustScoreAdjuster, setShowTrustScoreAdjuster] = useState(false);
  // 4 Required Profile Verification Credentials (LinkedIn, GitHub, LeetCode, GFG)
  const [profileCredentials, setProfileCredentials] = useState(() => {
    try {
      const saved = localStorage.getItem('jobproof_candidate_credentials');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      linkedin: currentUser?.linkedinUrl || 'https://linkedin.com/in/alexmorgan-dev',
      github: currentUser?.githubUrl || 'https://github.com/alexmorgan-dev',
      leetcode: currentUser?.leetcodeUrl || 'https://leetcode.com/u/alexmorgan_dev',
      gfg: currentUser?.gfgUrl || 'https://geeksforgeeks.org/user/alexmorgan_dev'
    };
  });

  const [editingCredKey, setEditingCredKey] = useState(null);
  const [credInputUrl, setCredInputUrl] = useState('');
  const [copiedCredKey, setCopiedCredKey] = useState(null);

  const [trustSignals, setTrustSignals] = useState(() => {
    try {
      const saved = localStorage.getItem('jobproof_candidate_trust_signals');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      linkedin: true,
      github: true,
      leetcode: true,
      gfg: true
    };
  });

  const updateTrustScore = (newVal) => {
    const clamped = Math.max(50, Math.min(100, Math.round(newVal)));
    setTrustScore(clamped);
    try {
      localStorage.setItem('jobproof_candidate_trust_score', clamped);
    } catch (e) {}
    if (onUpdateUser) {
      onUpdateUser({ ...currentUser, trustScore: clamped });
    }
  };

  const handleCopyCredential = (key, url) => {
    if (!url) return;
    try {
      navigator.clipboard?.writeText(url);
      setCopiedCredKey(key);
      setTimeout(() => setCopiedCredKey(null), 2500);
    } catch (e) {}
  };

  const handleSaveCredential = (key) => {
    let clean = credInputUrl ? credInputUrl.trim() : '';
    if (clean) {
      if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
        if (key === 'linkedin') clean = `https://linkedin.com/in/${clean.replace('@', '')}`;
        else if (key === 'github') clean = `https://github.com/${clean.replace('@', '')}`;
        else if (key === 'leetcode') clean = `https://leetcode.com/u/${clean.replace('@', '')}`;
        else if (key === 'gfg') clean = `https://geeksforgeeks.org/user/${clean.replace('@', '')}`;
        else clean = `https://${clean}`;
      }
    }
    const updated = { ...profileCredentials, [key]: clean };
    setProfileCredentials(updated);
    try {
      localStorage.setItem('jobproof_candidate_credentials', JSON.stringify(updated));
    } catch (e) {}

    const updatedSignals = {
      ...trustSignals,
      [key]: Boolean(clean)
    };
    setTrustSignals(updatedSignals);
    try {
      localStorage.setItem('jobproof_candidate_trust_signals', JSON.stringify(updatedSignals));
    } catch (e) {}

    let calc = 50;
    if (updatedSignals.linkedin) calc += 12.5;
    if (updatedSignals.github) calc += 12.5;
    if (updatedSignals.leetcode) calc += 12.5;
    if (updatedSignals.gfg) calc += 12.5;
    updateTrustScore(calc);

    setEditingCredKey(null);
    setCredInputUrl('');
  };

  const handleToggleSignal = (key) => {
    const updated = { ...trustSignals, [key]: !trustSignals[key] };
    setTrustSignals(updated);
    try {
      localStorage.setItem('jobproof_candidate_trust_signals', JSON.stringify(updated));
    } catch (e) {}
    // Calculate score: Base 50 + 12.5 for each of 4 credentials
    let calc = 50;
    if (updated.linkedin) calc += 12.5;
    if (updated.github) calc += 12.5;
    if (updated.leetcode) calc += 12.5;
    if (updated.gfg) calc += 12.5;
    updateTrustScore(calc);
  };

  // Metrics calculation
  const activeAppsCount = trackedApps.filter(a => a.status !== 'REJECTED' && a.status !== 'OFFER').length;
  const interviewCount = trackedApps.filter(a => a.status === 'INTERVIEW').length;
  const atsScore = 94;

  const ringRadius = 22;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashoffset = ringCircumference - (trustScore / 100) * ringCircumference;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">

      {/* 1. TOP HERO COMMAND CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0E131F] border border-[#253044] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Avatar & User Details */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#141922] border-2 border-teal-400/60 flex items-center justify-center text-4xl select-none shadow-xl shadow-teal-500/15 flex-shrink-0">
              {currentUser?.avatar || '👨‍💻'}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {currentUser?.name || 'Alex Morgan'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Candidate
                </span>
              </div>

              {/* Editable Headline */}
              {isEditingHeadline ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={tempHeadline}
                    onChange={(e) => setTempHeadline(e.target.value)}
                    className="px-3 py-1 bg-[#141922] border border-teal-400 rounded-lg text-sm text-white focus:outline-none"
                    placeholder="Enter professional title"
                  />
                  <button
                    onClick={saveHeadline}
                    className="p-1.5 bg-teal-500 text-slate-950 rounded-lg hover:bg-teal-400 transition"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingHeadline(false)}
                    className="p-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="font-semibold text-teal-300">{headline}</span>
                  <button
                    onClick={() => { setTempHeadline(headline); setIsEditingHeadline(true); }}
                    className="text-slate-500 hover:text-teal-400 transition"
                    title="Edit headline"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Metadata row */}
              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-0.5">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  {currentUser?.company || 'JobProof Verified Network'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Worldwide / Remote
                </span>
                <span>•</span>
                <span className="text-slate-400">
                  {currentUser?.email || 'alex.morgan@example.com'}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Trust Score Meter & Adjustment Trigger */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#141922]/90 border border-[#253044] lg:min-w-[280px] justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Trust Authenticity Score
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                  trustScore >= 95 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                  trustScore >= 85 ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30' :
                  'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  {trustScore >= 95 ? 'Elite' : trustScore >= 85 ? 'Verified' : 'Standard'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Identity & Evidence Calibrated</p>
              
              <button
                type="button"
                onClick={() => setShowTrustScoreAdjuster(!showTrustScoreAdjuster)}
                className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 text-[11px] font-bold transition hover:scale-[1.02] active:scale-95"
              >
                <SlidersHorizontal className="w-3 h-3 text-teal-400" />
                <span>{showTrustScoreAdjuster ? 'Close Adjuster' : 'Adjust Score'}</span>
              </button>
            </div>

            {/* Dynamic SVG Circular Progress Meter */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r={ringRadius}
                  stroke="#1E2638"
                  strokeWidth="4.5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={ringRadius}
                  stroke={trustScore >= 95 ? "#10B981" : trustScore >= 85 ? "#14B8A6" : trustScore >= 70 ? "#38BDF8" : "#F59E0B"}
                  strokeWidth="4.5"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black text-white font-mono leading-none">
                  {trustScore}
                </span>
                <span className="text-[9px] font-mono font-bold text-teal-400 leading-none mt-0.5">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE TRUST SCORE ADJUSTER PANEL (Expandable) */}
        {showTrustScoreAdjuster && (
          <div className="mt-6 pt-6 border-t border-[#1E2638] space-y-5 animate-fadeIn relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-teal-400" />
                  <span>Trust Score Calibration & Signal Tuning</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Drag the slider or toggle verified proof signals below to calibrate your trust authenticity index.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Presets:</span>
                <button
                  type="button"
                  onClick={() => updateTrustScore(78)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition ${
                    trustScore === 78 ? 'bg-amber-500/20 text-amber-300 border-amber-400' : 'bg-[#141922] text-slate-400 border-[#253044] hover:text-white'
                  }`}
                >
                  Standard (78%)
                </button>
                <button
                  type="button"
                  onClick={() => updateTrustScore(92)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition ${
                    trustScore === 92 ? 'bg-teal-500/20 text-teal-300 border-teal-400' : 'bg-[#141922] text-slate-400 border-[#253044] hover:text-white'
                  }`}
                >
                  Pro (92%)
                </button>
                <button
                  type="button"
                  onClick={() => updateTrustScore(98)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition ${
                    trustScore === 98 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400' : 'bg-[#141922] text-slate-400 border-[#253044] hover:text-white'
                  }`}
                >
                  Elite (98%)
                </button>
                <button
                  type="button"
                  onClick={() => updateTrustScore(96)}
                  className="px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-white bg-[#141922] border border-[#253044] transition"
                  title="Reset to default 96%"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Range Slider */}
            <div className="p-4 rounded-2xl bg-[#141922] border border-[#253044] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Live Trust Authenticity Index</span>
                <span className="font-mono font-bold text-teal-400 text-sm">
                  {trustScore} / 100 ({trustScore >= 95 ? 'Elite Tier' : trustScore >= 85 ? 'Highly Verified' : 'Standard Tier'})
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={trustScore}
                onChange={(e) => updateTrustScore(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                <span>50% (Basic ID)</span>
                <span>75% (Standard)</span>
                <span>90% (Verified Pro)</span>
                <span>100% (Maximum Proof)</span>
              </div>
            </div>

            {/* Modular Verification Signals Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {[
                { key: 'linkedin', label: 'LinkedIn Profile', pts: '+12.5 pts', desc: 'Professional experience verify' },
                { key: 'github', label: 'GitHub Profile', pts: '+12.5 pts', desc: 'Code repository & commit audit' },
                { key: 'leetcode', label: 'LeetCode Profile', pts: '+12.5 pts', desc: 'Algorithmic problem-solving record' },
                { key: 'gfg', label: 'GFG Profile', pts: '+12.5 pts', desc: 'GeeksforGeeks technical rankings' }
              ].map((sig) => {
                const active = trustSignals[sig.key];
                return (
                  <button
                    key={sig.key}
                    type="button"
                    onClick={() => handleToggleSignal(sig.key)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-2 ${
                      active
                        ? 'bg-teal-500/10 border-teal-500/40 text-white shadow-sm'
                        : 'bg-[#141922] border-[#253044] text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{sig.label}</span>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        active ? 'bg-teal-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {active ? '✓' : ''}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{sig.desc}</p>
                    <span className="text-[10px] font-mono font-bold text-teal-400">{sig.pts}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. CANDIDATE PROFILE COMPLETION SECTION (USER SECTION EXCLUSIVE) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0E131F] border border-[#253044] shadow-xl relative overflow-hidden group">
        {/* Decorative Glow backlight */}
        <div className="absolute top-0 right-0 w-96 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Profile Completion
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00e5c9]/15 text-[#00e5c9] border border-[#00e5c9]/30 shadow-sm">
                85% Complete
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Complete all candidate milestones to increase employer search ranking and activate automated ATS job matching.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-300">4 of 5 Milestones Achieved</span>
          </div>
        </div>

        {/* Progress Bar (85% filled) */}
        <div className="w-full h-2.5 rounded-full bg-[#07101b] overflow-hidden p-0.5 border border-[#14263b] mt-4 relative z-10">
          <div 
            className="h-full bg-gradient-to-r from-[#00bda6] to-[#00e5c9] rounded-full shadow-[0_0_12px_rgba(0,229,201,0.5)] transition-all duration-700"
            style={{ width: '85%' }}
          />
        </div>

        {/* 5 Milestone Status Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4 relative z-10">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141922] border border-teal-500/30 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-slate-200">
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold text-[11px] truncate">Personal Info</span>
            </div>
            <Check className="w-4 h-4 text-[#00e5c9] stroke-[2.5] flex-shrink-0" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141922] border border-teal-500/30 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold text-[11px] truncate">Skills & Exp</span>
            </div>
            <Check className="w-4 h-4 text-[#00e5c9] stroke-[2.5] flex-shrink-0" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141922] border border-teal-500/30 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-slate-200">
              <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold text-[11px] truncate">Education</span>
            </div>
            <Check className="w-4 h-4 text-[#00e5c9] stroke-[2.5] flex-shrink-0" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141922] border border-teal-500/30 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-slate-200">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold text-[11px] truncate">ATS Resume</span>
            </div>
            <Check className="w-4 h-4 text-[#00e5c9] stroke-[2.5] flex-shrink-0" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141922] border border-amber-500/30 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-amber-200">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-[11px] truncate">Job Preferences</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex-shrink-0">Pending</span>
          </div>
        </div>
      </div>

      {/* 3. FOUR QUICK STAT METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ATS Readiness */}
        <div className="p-5 rounded-2xl bg-[#0E131F] border border-[#253044] space-y-2 hover:border-teal-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">ATS Readiness</span>
            <Sparkles className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{atsScore}%</span>
            <span className="text-xs font-semibold text-emerald-400">Optimal Match</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${atsScore}%` }} />
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('resume-analyzer')}
            className="text-[11px] text-teal-400 hover:text-teal-300 font-bold inline-flex items-center gap-1 pt-1"
          >
            <span>Scan New Resume</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Active Applications */}
        <div className="p-5 rounded-2xl bg-[#0E131F] border border-[#253044] space-y-2 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Active Applications</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{activeAppsCount}</span>
            <span className="text-xs font-semibold text-slate-400">Roles in Pipeline</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '65%' }} />
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('application-tracker')}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1 pt-1"
          >
            <span>Open Application Tracker</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Bookmarked Jobs */}
        <div className="p-5 rounded-2xl bg-[#0E131F] border border-[#253044] space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Bookmarked Jobs</span>
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">12</span>
            <span className="text-xs font-semibold text-amber-400">Saved for Review</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '80%' }} />
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('dashboard-overview')}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 pt-1"
          >
            <span>Explore Matching Jobs</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Interviews Scheduled */}
        <div className="p-5 rounded-2xl bg-[#0E131F] border border-[#253044] space-y-2 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Interviews Scheduled</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{interviewCount}</span>
            <span className="text-xs font-semibold text-emerald-400">Upcoming Rounds</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '45%' }} />
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('application-tracker')}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 pt-1"
          >
            <span>View Interview Prep</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. CORE INTERACTIVE DASHBOARD GRID (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PANEL A: VERIFIED TECHNICAL SKILLS */}
        <div className="p-6 rounded-3xl bg-[#0E131F] border border-[#253044] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Verified Technical Skills
              </h3>
            </div>
            <button
              onClick={() => setShowSkillInput(!showSkillInput)}
              className="px-2.5 py-1 rounded-xl bg-[#141922] border border-[#253044] hover:border-teal-400 text-[11px] font-bold text-teal-300 hover:text-white transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Skill</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Skills extracted from your ATS resume and validated against employer vacancy requirements.
          </p>

          {/* Add Skill Input */}
          {showSkillInput && (
            <div className="flex items-center gap-2 p-2 bg-[#141922] rounded-xl border border-teal-500/40 animate-fadeIn">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                placeholder="e.g. GraphQL, Terraform, Kafka"
                className="flex-1 bg-transparent text-xs text-white px-2 focus:outline-none"
              />
              <button
                onClick={addSkill}
                className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition"
              >
                Add
              </button>
            </div>
          )}

          {/* Skill Badges Matrix */}
          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141922] border border-[#253044] hover:border-teal-500/50 text-xs font-semibold text-slate-200 transition group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition ml-1"
                  title="Remove skill"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* PANEL B: COMPENSATION & LOCATION PREFERENCES */}
        <div className="p-6 rounded-3xl bg-[#0E131F] border border-[#253044] space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Compensation & Mobility Preferences
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            Set your target compensation and work mode so verified job matches align with your goals.
          </p>

          <div className="space-y-4 pt-1">
            {/* Target Salary Slider */}
            <div className="p-4 rounded-2xl bg-[#141922] border border-[#253044] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Target Annual Base</span>
                <span className="font-mono font-bold text-teal-400">
                  ${(minSalary / 1000).toFixed(0)}k – ${(maxSalary / 1000).toFixed(0)}k / yr
                </span>
              </div>
              <input
                type="range"
                min="80000"
                max="300000"
                step="5000"
                value={maxSalary}
                onChange={(e) => setMaxSalary(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            {/* Work Mode Toggle Pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium mr-2">Work Mode:</span>
              {['Remote', 'Hybrid', 'Flexible'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setWorkMode(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    workMode === mode
                      ? 'bg-teal-500/20 text-teal-300 border-teal-400 shadow-sm'
                      : 'bg-[#141922] text-slate-400 border-[#253044] hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PANEL C: APPLICATION PIPELINE SNAPSHOT */}
        <div className="p-6 rounded-3xl bg-[#0E131F] border border-[#253044] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Application Pipeline Snapshot
              </h3>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab('application-tracker')}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {trackedApps.slice(0, 3).map((app) => (
              <div
                key={app.id}
                onClick={() => setActiveTab && setActiveTab('application-tracker')}
                className="p-3.5 rounded-2xl bg-[#141922] border border-[#253044] hover:border-blue-500/40 cursor-pointer transition flex items-center justify-between gap-3 group"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition">
                    {app.jobTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400">{app.companyName} • {app.salary}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    app.status === 'INTERVIEW'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                  }`}>
                    {app.status}
                  </span>
                  <span className="text-[11px] font-mono text-teal-400 font-bold">
                    {app.atsMatchScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL D: PROFILE VERIFICATION & CREDENTIALS (LINKEDIN, GITHUB, LEETCODE, GFG) */}
        <div className="p-6 rounded-3xl bg-[#0E131F] border border-[#253044] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Profile Verification & Credentials
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30">
              4 REQUIRED PROFILES
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Mandatory developer credentials. Link your verified coding and professional profiles to unlock recruiter outreach and instant trust badges.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              {
                key: 'linkedin',
                label: 'LinkedIn Profile',
                badgeText: 'Required',
                domain: 'linkedin.com/in',
                icon: <Linkedin className="w-4 h-4 text-[#0A66C2]" />,
                color: 'text-[#0A66C2]',
                borderHover: 'hover:border-[#0A66C2]/50',
                placeholder: 'e.g. linkedin.com/in/alexmorgan or username',
                url: profileCredentials.linkedin,
                pts: '+12.5 pts'
              },
              {
                key: 'github',
                label: 'GitHub Profile',
                badgeText: 'Required',
                domain: 'github.com',
                icon: <Github className="w-4 h-4 text-white" />,
                color: 'text-white',
                borderHover: 'hover:border-slate-400',
                placeholder: 'e.g. github.com/alexmorgan or username',
                url: profileCredentials.github,
                pts: '+12.5 pts'
              },
              {
                key: 'leetcode',
                label: 'LeetCode Profile',
                badgeText: 'Required',
                domain: 'leetcode.com/u',
                icon: <LeetCodeIcon className="w-4 h-4" />,
                color: 'text-[#FFA116]',
                borderHover: 'hover:border-[#FFA116]/50',
                placeholder: 'e.g. leetcode.com/u/alexmorgan or username',
                url: profileCredentials.leetcode,
                pts: '+12.5 pts'
              },
              {
                key: 'gfg',
                label: 'GFG Profile',
                badgeText: 'Required',
                domain: 'geeksforgeeks.org/user',
                icon: <GfgIcon className="w-4 h-4" />,
                color: 'text-[#2F8D46]',
                borderHover: 'hover:border-[#2F8D46]/50',
                placeholder: 'e.g. geeksforgeeks.org/user/alexmorgan or username',
                url: profileCredentials.gfg,
                pts: '+12.5 pts'
              }
            ].map((cred) => {
              const isEditing = editingCredKey === cred.key;
              const hasUrl = Boolean(cred.url && cred.url.trim());

              return (
                <div
                  key={cred.key}
                  className={`p-3.5 rounded-2xl bg-[#141922] border transition space-y-2.5 ${
                    hasUrl ? 'border-[#253044]' : 'border-amber-500/40 bg-amber-500/5'
                  } ${cred.borderHover}`}
                >
                  {/* Top Bar: Icon + Label + Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#0E131F] border border-[#253044]">
                        {cred.icon}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{cred.label}</span>
                        <span className="text-[10px] font-mono text-slate-500">{cred.domain}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      {cred.badgeText}
                    </span>
                  </div>

                  {/* Profile URL / Username Display OR Inline Edit Input */}
                  {isEditing ? (
                    <div className="space-y-2 pt-1 animate-fadeIn">
                      <input
                        type="text"
                        value={credInputUrl}
                        onChange={(e) => setCredInputUrl(e.target.value)}
                        placeholder={cred.placeholder}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveCredential(cred.key);
                          if (e.key === 'Escape') setEditingCredKey(null);
                        }}
                        autoFocus
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-teal-500/60 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCredKey(null)}
                          className="px-2 py-1 rounded text-[11px] font-medium text-slate-400 hover:text-white transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveCredential(cred.key)}
                          className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-[11px] font-bold transition flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-[#0E131F] px-2.5 py-1.5 rounded-xl border border-[#253044]/80 text-[11px] font-mono">
                        <span className="truncate max-w-[190px] text-slate-300" title={cred.url}>
                          {cred.url ? cred.url.replace(/^https?:\/\//, '') : 'No link specified'}
                        </span>
                        <span className="text-[10px] font-bold text-teal-400 flex-shrink-0">
                          {cred.pts}
                        </span>
                      </div>

                      {/* Interactive Controls: Visit Profile ↗, Copy Link, Edit Link */}
                      <div className="flex items-center justify-between gap-1 pt-0.5">
                        <div className="flex items-center gap-1">
                          {hasUrl && (
                            <a
                              href={cred.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded-lg bg-[#0E131F] hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 border border-[#253044] hover:border-teal-500/40 text-[10px] font-bold inline-flex items-center gap-1 transition"
                              title="Visit live profile link"
                            >
                              <span>Visit</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          {hasUrl && (
                            <button
                              type="button"
                              onClick={() => handleCopyCredential(cred.key, cred.url)}
                              className="p-1 rounded-lg bg-[#0E131F] hover:bg-slate-800 text-slate-400 hover:text-white border border-[#253044] transition"
                              title="Copy profile link"
                            >
                              {copiedCredKey === cred.key ? (
                                <CheckCheck className="w-3.5 h-3.5 text-teal-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingCredKey(cred.key);
                            setCredInputUrl(cred.url || '');
                          }}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 transition inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>{hasUrl ? 'Edit Link' : 'Add Link'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
