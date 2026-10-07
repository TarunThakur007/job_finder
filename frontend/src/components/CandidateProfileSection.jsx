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
  Kanban,
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
  GraduationCap
} from 'lucide-react';

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
  const [trustSignals, setTrustSignals] = useState(() => {
    try {
      const saved = localStorage.getItem('jobproof_candidate_trust_signals');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      identity: true,
      github: true,
      skills: true,
      atsResume: true,
      workEligibility: true
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

  const handleToggleSignal = (key) => {
    const updated = { ...trustSignals, [key]: !trustSignals[key] };
    setTrustSignals(updated);
    try {
      localStorage.setItem('jobproof_candidate_trust_signals', JSON.stringify(updated));
    } catch (e) {}
    // Calculate score: Base 50 + 10 for each signal
    let calc = 50;
    if (updated.identity) calc += 10;
    if (updated.github) calc += 10;
    if (updated.skills) calc += 10;
    if (updated.atsResume) calc += 10;
    if (updated.workEligibility) calc += 10;
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
              {[
                { key: 'identity', label: 'Email & Identity', pts: '+10 pts', desc: 'Direct corporate email verify' },
                { key: 'github', label: 'GitHub Provenance', pts: '+10 pts', desc: 'Commit history & repo audit' },
                { key: 'skills', label: 'Stack Assessment', pts: '+10 pts', desc: 'Validated skills matrix' },
                { key: 'atsResume', label: 'ATS Parsed Resume', pts: '+10 pts', desc: 'Normalized keyword schema' },
                { key: 'workEligibility', label: 'Work Authorization', pts: '+10 pts', desc: 'Employer clearance confirmed' }
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

      {/* 2. FOUR QUICK STAT METRICS CARDS */}
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
            <Kanban className="w-4 h-4 text-blue-400" />
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
            <span>Open Kanban Tracker</span>
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

        {/* PANEL C: APPLICATION LIFECYCLE MINI-KANBAN */}
        <div className="p-6 rounded-3xl bg-[#0E131F] border border-[#253044] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Kanban className="w-4 h-4 text-blue-400" />
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

        {/* PANEL D: VERIFIED IDENTITY & CREDENTIALS DOSSIER */}
        <div className="p-6 rounded-3xl bg-[#0E131F] border border-[#253044] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Verification & Credentials
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              100% COMPLETE
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Verified credentials allow you to apply with instant trust badges on employer career boards.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleToggleSignal('github')}
              className={`p-3 rounded-2xl border text-left transition space-y-1 ${
                trustSignals.github ? 'bg-[#141922] border-teal-500/40 hover:border-teal-400' : 'bg-[#141922]/60 border-[#253044] opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${trustSignals.github ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>GitHub Profile</span>
                </div>
                <span className={`text-[10px] font-mono font-bold ${trustSignals.github ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {trustSignals.github ? 'Active' : 'Off'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Repo & Commit Provenance</p>
              <span className="text-[10px] font-mono text-teal-400 font-bold block pt-1">
                {trustSignals.github ? 'Verified (+10 pts)' : 'Tap to Verify'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleSignal('identity')}
              className={`p-3 rounded-2xl border text-left transition space-y-1 ${
                trustSignals.identity ? 'bg-[#141922] border-teal-500/40 hover:border-teal-400' : 'bg-[#141922]/60 border-[#253044] opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${trustSignals.identity ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>LinkedIn Profile</span>
                </div>
                <span className={`text-[10px] font-mono font-bold ${trustSignals.identity ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {trustSignals.identity ? 'Active' : 'Off'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Work Experience Authenticated</p>
              <span className="text-[10px] font-mono text-teal-400 font-bold block pt-1">
                {trustSignals.identity ? 'Verified (+10 pts)' : 'Tap to Verify'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleSignal('atsResume')}
              className={`p-3 rounded-2xl border text-left transition space-y-1 ${
                trustSignals.atsResume ? 'bg-[#141922] border-teal-500/40 hover:border-teal-400' : 'bg-[#141922]/60 border-[#253044] opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${trustSignals.atsResume ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>ATS Resume Parsed</span>
                </div>
                <span className={`text-[10px] font-mono font-bold ${trustSignals.atsResume ? 'text-teal-400' : 'text-slate-500'}`}>
                  {trustSignals.atsResume ? 'Active' : 'Off'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Clean Standard Taxonomy</p>
              <span className="text-[10px] font-mono text-teal-400 font-bold block pt-1">
                {trustSignals.atsResume ? 'Optimized (+10 pts)' : 'Tap to Verify'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleSignal('workEligibility')}
              className={`p-3 rounded-2xl border text-left transition space-y-1 ${
                trustSignals.workEligibility ? 'bg-[#141922] border-teal-500/40 hover:border-teal-400' : 'bg-[#141922]/60 border-[#253044] opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${trustSignals.workEligibility ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>Work Eligibility</span>
                </div>
                <span className={`text-[10px] font-mono font-bold ${trustSignals.workEligibility ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {trustSignals.workEligibility ? 'Active' : 'Off'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Direct Employer Authorization</p>
              <span className="text-[10px] font-mono text-teal-400 font-bold block pt-1">
                {trustSignals.workEligibility ? 'Cleared (+10 pts)' : 'Tap to Authorize'}
              </span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
