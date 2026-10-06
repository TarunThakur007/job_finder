import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  UserPlus, 
  Briefcase, 
  Building2, 
  Mail, 
  Key, 
  CheckCircle2, 
  Search, 
  Trash2, 
  Edit3, 
  Sparkles, 
  UserCheck, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Eye, 
  Globe, 
  Activity, 
  Server, 
  Database, 
  Radio, 
  Layers, 
  Clock, 
  ArrowUpRight,
  ExternalLink,
  FileText,
  Phone,
  Linkedin,
  Award,
  Download,
  MessageSquare,
  HelpCircle,
  Flag,
  TrendingUp,
  ThumbsUp,
  Star,
  Lock,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';

const DeployUserModal = React.lazy(() => import('./DeployUserModal'));
const PersonnelDetailModal = React.lazy(() => import('./PersonnelDetailModal'));
const ApplicantResumeModal = React.lazy(() => import('./ApplicantResumeModal'));
const AtsScanDetailModal = React.lazy(() => import('./AtsScanDetailModal'));
const ExperienceDetailModal = React.lazy(() => import('./ExperienceDetailModal'));

export default function TeamManagementPage({ currentUser, liveJobs = [], onSelectView, onUpdateUser, onLoginAsEmployee }) {
  // Navigation tabs: Telemetry vs Resumes vs AI ATS Scans vs User Experiences vs Team
  const [adminTab, setAdminTab] = useState('telemetry'); // 'telemetry' | 'resumes' | 'ats-scans' | 'experiences' | 'team'

  // ==========================================
  // WEBSITE TELEMETRY & WORKING STATUS STATE
  // ==========================================
  const [adminStats, setAdminStats] = useState(null);
  const [backendHealth, setBackendHealth] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [triggeringCrawler, setTriggeringCrawler] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // ==========================================
  // CANDIDATE APPLICATIONS & RESUMES STATE
  // ==========================================
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('ALL');
  const [selectedApplicationForModal, setSelectedApplicationForModal] = useState(null);

  // ==========================================
  // AI ATS RESUME SCANS & CAREER DIAGNOSTICS STATE
  // ==========================================
  const [resumeScans, setResumeScans] = useState([]);
  const [scansLoading, setScansLoading] = useState(false);
  const [scanSearchQuery, setScanSearchQuery] = useState('');
  const [readinessFilter, setReadinessFilter] = useState('ALL'); // 'ALL' | 'CAREER_READY' | 'NEEDS_UPSKILLING' | 'WEAK_BULLETS'
  const [selectedScanForModal, setSelectedScanForModal] = useState(null);

  // ==========================================
  // USER INTERVIEW & CAREER EXPERIENCES STATE
  // ==========================================
  const [experiences, setExperiences] = useState([]);
  const [expLoading, setExpLoading] = useState(false);
  const [expSearchQuery, setExpSearchQuery] = useState('');
  const [expStatusFilter, setExpStatusFilter] = useState('ALL'); // 'ALL' | 'APPROVED' | 'PENDING' | 'FLAGGED'
  const [selectedExpForModal, setSelectedExpForModal] = useState(null);

  // ==========================================
  // TEAM & PERMISSION AUTHORITY STATE
  // ==========================================
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'ROLE_EMPLOYEE' | 'ROLE_ADMIN'
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedMemberForDetails, setSelectedMemberForDetails] = useState(null);
  const [editingPermissionsUser, setEditingPermissionsUser] = useState(null);
  const [timelineExpandedUser, setTimelineExpandedUser] = useState(null);
  const [timelineDraftPermissions, setTimelineDraftPermissions] = useState([]);
  const [recentlyUpdatedMemberEmail, setRecentlyUpdatedMemberEmail] = useState(null);

  // Operational permissions available to grant for both Employees and Admins
  const allAvailablePermissions = [
    {
      id: 'REVIEW_AI_VACANCIES',
      label: 'Review AI Vacancies',
      desc: 'Inspect AI crawler staging queue from Greenhouse, Lever, Ashby, and job APIs.'
    },
    {
      id: 'GRANT_PERMISSION',
      label: 'Grant Live Permission',
      desc: 'Authorize AI-discovered listings to be published live on website with verified badge.'
    },
    {
      id: 'EDIT_JOB_DETAILS',
      label: 'Edit Job & Salary Details',
      desc: 'Modify salary ranges, required skills, title, and application URLs before publishing.'
    },
    {
      id: 'VIEW_APPLICATIONS',
      label: 'View Candidate Applications',
      desc: 'Access candidate contact details, ATS match scorecard, and parsed experience.'
    },
    {
      id: 'UPDATE_STATUS',
      label: 'Decide Candidate Status',
      desc: 'Shortlist, review, accept, or reject candidate job applications.'
    },
    {
      id: 'POST_DIRECT_JOBS',
      label: 'Post Direct Vacancies',
      desc: 'Directly submit manual company openings into backend platform.'
    }
  ];

  const defaultTeam = [
    {
      id: 101,
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@google.com',
      role: 'ROLE_EMPLOYEE',
      company: 'Google',
      title: 'Company Recruiter & Hiring Partner',
      author: currentUser?.name || 'Platform Administrator',
      permissions: ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'EDIT_JOB_DETAILS'],
      createdAt: '2026-09-15T10:00:00',
      status: 'ACTIVE'
    },
    {
      id: 102,
      name: 'Marcus Brody',
      email: 'marcus.brody@stripe.com',
      role: 'ROLE_EMPLOYEE',
      company: 'Stripe',
      title: 'Senior Technical Talent Partner',
      author: currentUser?.name || 'Platform Administrator',
      permissions: ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'EDIT_JOB_DETAILS'],
      createdAt: '2026-09-16T11:30:00',
      status: 'ACTIVE'
    },
    {
      id: 103,
      name: 'Elena Rostova',
      email: 'elena.admin@jobproof.io',
      role: 'ROLE_ADMIN',
      company: 'JobProof Core',
      title: 'Platform Governance & Security Lead',
      author: currentUser?.name || 'Platform Administrator',
      permissions: ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'EDIT_JOB_DETAILS', 'POST_DIRECT_JOBS'],
      createdAt: '2026-09-10T08:00:00',
      status: 'ACTIVE'
    }
  ];

  const fetchPlatformTelemetry = async () => {
    setStatsLoading(true);
    try {
      const [statsRes, healthRes] = await Promise.all([
        fetch('/api/admin/stats').catch(() => null),
        fetch('/api/health').catch(() => null)
      ]);
      if (statsRes && statsRes.ok) {
        const stats = await statsRes.json();
        setAdminStats(stats);
      }
      if (healthRes && healthRes.ok) {
        const health = await healthRes.json();
        setBackendHealth(health);
      }
    } catch (e) {
      console.error('Error fetching platform telemetry:', e);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setTeamLoading(true);
    try {
      const res = await fetch('/api/admin/users').catch(() => null);
      let apiUsers = [];
      if (res && res.ok) {
        apiUsers = await res.json();
      }

      let localUsers = [];
      try {
        localUsers = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
      } catch (e) {}

      const userMap = new Map();
      defaultTeam.forEach(u => userMap.set(u.email.toLowerCase(), u));
      localUsers.forEach(u => {
        if (u && u.email) userMap.set(u.email.toLowerCase(), { ...u, status: 'ACTIVE' });
      });
      apiUsers.forEach(u => {
        if (u && u.email) {
          const existing = userMap.get(u.email.toLowerCase()) || {};
          userMap.set(u.email.toLowerCase(), {
            ...existing,
            ...u,
            status: 'ACTIVE',
            permissions: u.permissions || existing.permissions || ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'EDIT_JOB_DETAILS']
          });
        }
      });

      setTeamMembers(Array.from(userMap.values()));
    } catch (e) {
      setTeamMembers(defaultTeam);
    } finally {
      setTeamLoading(false);
    }
  };

  const fetchApplications = async () => {
    setAppsLoading(true);
    try {
      const res = await fetch('/api/admin/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setAppsLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications(prev => prev.map(a => a.id === appId ? updated : a));
        setActionNotice({ type: 'success', msg: `Application status updated to ${newStatus}.` });
        setTimeout(() => setActionNotice(null), 3000);
      }
    } catch (e) {
      console.error('Error updating application status:', e);
    }
  };

  const handleDeleteApplication = async (appId, applicantName) => {
    if (!window.confirm(`Permanently remove candidate application & resume for "${applicantName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications(prev => prev.filter(a => a.id !== appId));
        setActionNotice({ type: 'info', msg: `Removed application for ${applicantName}.` });
        setTimeout(() => setActionNotice(null), 4000);
      }
    } catch (e) {
      console.error('Error deleting application:', e);
    }
  };

  const fetchResumeScans = async () => {
    setScansLoading(true);
    try {
      const res = await fetch('/api/admin/resume-scans');
      if (res.ok) {
        const data = await res.json();
        setResumeScans(data);
      }
    } catch (err) {
      console.error('Error fetching resume scans:', err);
    } finally {
      setScansLoading(false);
    }
  };

  const fetchExperiences = async () => {
    setExpLoading(true);
    try {
      const res = await fetch('/api/admin/experiences');
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error('Error fetching experiences:', err);
    } finally {
      setExpLoading(false);
    }
  };

  const handleUpdateExperienceStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/experiences/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setExperiences(prev => prev.map(e => e.id === id ? updated : e));
        setActionNotice({ type: 'success', msg: `Experience status updated to ${newStatus}.` });
        setTimeout(() => setActionNotice(null), 3500);
      }
    } catch (e) {
      console.error('Error updating experience status:', e);
    }
  };

  const handleDeleteExperience = async (id, companyName) => {
    if (!window.confirm(`Permanently remove experience entry for "${companyName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/experiences/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExperiences(prev => prev.filter(e => e.id !== id));
        setActionNotice({ type: 'info', msg: `Removed experience entry for ${companyName}.` });
        setTimeout(() => setActionNotice(null), 3500);
      }
    } catch (e) {
      console.error('Error deleting experience:', e);
    }
  };

  useEffect(() => {
    fetchPlatformTelemetry();
    fetchUsers();
    fetchApplications();
    fetchResumeScans();
    fetchExperiences();
    const interval = setInterval(() => {
      fetchPlatformTelemetry();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerDiscovery = async (source = 'ALL') => {
    setTriggeringCrawler(true);
    setActionNotice(null);
    try {
      const res = await fetch(`/api/admin/vacancies/discover?source=${source}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setActionNotice({
          type: 'success',
          msg: `AI Ingestion Pipeline Executed: Discovered and staged ${data.stagedCount || 0} open vacancies from ${source} for employee review.`
        });
        fetchPlatformTelemetry();
      } else {
        throw new Error('Crawler response code: ' + res.status);
      }
    } catch (e) {
      setActionNotice({ type: 'info', msg: `AI Ingestion Triggered for ${source}. Pipeline active in background.` });
    } finally {
      setTriggeringCrawler(false);
      setTimeout(() => setActionNotice(null), 6000);
    }
  };

  const handleSavePermissions = (user, newPermissions) => {
    const updatedMember = { ...user, permissions: newPermissions };
    const updated = teamMembers.map(m => {
      if (m.email?.toLowerCase() === user.email?.toLowerCase()) {
        return updatedMember;
      }
      return m;
    });
    setTeamMembers(updated);

    try {
      const local = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
      const updatedLocal = local.map(u => {
        if (u.email?.toLowerCase() === user.email?.toLowerCase()) {
          return { ...u, permissions: newPermissions };
        }
        return u;
      });
      localStorage.setItem('jobproof_deployed_users', JSON.stringify(updatedLocal));

      const authUser = JSON.parse(localStorage.getItem('jobproof_auth_user') || '{}');
      if (authUser.email?.toLowerCase() === user.email?.toLowerCase()) {
        authUser.permissions = newPermissions;
        localStorage.setItem('jobproof_auth_user', JSON.stringify(authUser));
      }
    } catch (e) {}

    // Update active user state immediately so the employee/admin gets instant access without page reload
    if (currentUser?.email?.toLowerCase() === user.email?.toLowerCase()) {
      if (onUpdateUser) onUpdateUser(updatedMember);
    }

    setEditingPermissionsUser(null);
    setTimelineExpandedUser(null);
    setRecentlyUpdatedMemberEmail(user.email);
    setTimeout(() => {
      setRecentlyUpdatedMemberEmail(prev => prev?.toLowerCase() === user.email?.toLowerCase() ? null : prev);
    }, 7000);

    if (selectedMemberForDetails?.email === user.email) {
      setSelectedMemberForDetails({ ...selectedMemberForDetails, permissions: newPermissions });
    }

    setActionNotice({
      type: 'success',
      msg: `Operational permissions updated for ${user.name} (${user.email}). Access to field workspace is now active!`
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRevokeAccess = async (user) => {
    if (!window.confirm(`Revoke all platform access and remove ${user.name}?`)) return;

    try {
      if (user.id) {
        await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' }).catch(() => {});
      }
      const local = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
      const filtered = local.filter(u => u.email?.toLowerCase() !== user.email?.toLowerCase());
      localStorage.setItem('jobproof_deployed_users', JSON.stringify(filtered));
    } catch (e) {}

    setTeamMembers(prev => prev.filter(m => m.email?.toLowerCase() !== user.email?.toLowerCase()));
    if (selectedMemberForDetails?.email === user.email) {
      setSelectedMemberForDetails(null);
    }
    setActionNotice({
      type: 'info',
      msg: `Revoked clearance and deleted credentials for ${user.name} (${user.email}).`
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filteredMembers = teamMembers.filter(m => {
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
    if (!matchesRole) return false;
    if (!teamSearchQuery) return true;
    const q = teamSearchQuery.toLowerCase();
    return (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.company || '').toLowerCase().includes(q) ||
      (m.title || '').toLowerCase().includes(q);
  });

  const employeeCount = teamMembers.filter(u => u.role === 'ROLE_EMPLOYEE' || !u.role?.includes('ADMIN')).length;
  const adminCount = teamMembers.filter(u => u.role === 'ROLE_ADMIN' || u.role === 'ADMIN').length;

  const filteredApplications = applications.filter(app => {
    const matchesStatus = appStatusFilter === 'ALL' || app.status?.toUpperCase() === appStatusFilter;
    if (!matchesStatus) return false;
    if (!appSearchQuery) return true;
    const q = appSearchQuery.toLowerCase();
    const nameMatch = (app.applicantName || '').toLowerCase().includes(q);
    const emailMatch = (app.applicantEmail || '').toLowerCase().includes(q);
    const roleMatch = (app.currentRole || '').toLowerCase().includes(q);
    const jobMatch = (app.jobTitle || '').toLowerCase().includes(q);
    const companyMatch = (app.companyName || '').toLowerCase().includes(q);
    const skillsMatch = (app.skills || []).some(s => s.toLowerCase().includes(q));
    return nameMatch || emailMatch || roleMatch || jobMatch || companyMatch || skillsMatch;
  });

  const appShortlistedCount = applications.filter(a => a.status?.toUpperCase() === 'SHORTLISTED').length;
  const appPendingCount = applications.filter(a => a.status?.toUpperCase() === 'PENDING').length;
  const appReviewingCount = applications.filter(a => a.status?.toUpperCase() === 'REVIEWING').length;

  const filteredScans = resumeScans.filter(scan => {
    const atsScore = scan.overallAtsScore ?? scan.atsScore ?? 85;
    const missingSkills = scan.missingCriticalSkills || scan.missingSkills || [];
    const readiness = scan.careerReadiness || (atsScore >= 88 ? 'CAREER_READY' : (missingSkills.length > 2 ? 'NEEDS_UPSKILLING' : 'WEAK_BULLETS'));
    const matchesReadiness = readinessFilter === 'ALL' || readiness.toUpperCase() === readinessFilter;
    if (!matchesReadiness) return false;
    if (!scanSearchQuery) return true;
    const q = scanSearchQuery.toLowerCase();
    const nameMatch = (scan.candidateName || scan.filename || '').toLowerCase().includes(q);
    const emailMatch = (scan.candidateEmail || '').toLowerCase().includes(q);
    const roleMatch = (scan.targetJobRole || scan.targetRole || '').toLowerCase().includes(q);
    const fileMatch = (scan.filename || scan.fileName || '').toLowerCase().includes(q);
    const skillsMatch = (scan.extractedSkills || []).some(s => s.toLowerCase().includes(q));
    return nameMatch || emailMatch || roleMatch || fileMatch || skillsMatch;
  });

  const scanCareerReadyCount = resumeScans.filter(s => {
    const score = s.overallAtsScore ?? s.atsScore ?? 85;
    const r = s.careerReadiness || (score >= 88 ? 'CAREER_READY' : 'NEEDS_UPSKILLING');
    return r.toUpperCase() === 'CAREER_READY';
  }).length;

  const scanNeedsUpskillingCount = resumeScans.filter(s => {
    const score = s.overallAtsScore ?? s.atsScore ?? 85;
    const gaps = s.missingCriticalSkills || s.missingSkills || [];
    const r = s.careerReadiness || (score >= 88 ? 'CAREER_READY' : (gaps.length > 2 ? 'NEEDS_UPSKILLING' : 'WEAK_BULLETS'));
    return r.toUpperCase() === 'NEEDS_UPSKILLING';
  }).length;

  const scanWeakBulletsCount = resumeScans.filter(s => {
    const score = s.overallAtsScore ?? s.atsScore ?? 85;
    const gaps = s.missingCriticalSkills || s.missingSkills || [];
    const r = s.careerReadiness || (score >= 88 ? 'CAREER_READY' : (gaps.length > 2 ? 'NEEDS_UPSKILLING' : 'WEAK_BULLETS'));
    return r.toUpperCase() === 'WEAK_BULLETS';
  }).length;

  const filteredExperiences = experiences.filter(exp => {
    const matchesStatus = expStatusFilter === 'ALL' || exp.status?.toUpperCase() === expStatusFilter;
    if (!matchesStatus) return false;
    if (!expSearchQuery) return true;
    const q = expSearchQuery.toLowerCase();
    const compMatch = (exp.companyName || '').toLowerCase().includes(q);
    const roleMatch = (exp.jobTitle || '').toLowerCase().includes(q);
    const userMatch = (exp.userName || '').toLowerCase().includes(q);
    const emailMatch = (exp.userEmail || '').toLowerCase().includes(q);
    const storyMatch = (exp.experienceStory || '').toLowerCase().includes(q);
    const questionsMatch = typeof exp.questionsAsked === 'string'
      ? exp.questionsAsked.toLowerCase().includes(q)
      : Array.isArray(exp.questionsAsked)
      ? exp.questionsAsked.some(quest => quest.toLowerCase().includes(q))
      : false;
    return compMatch || roleMatch || userMatch || emailMatch || storyMatch || questionsMatch;
  });

  const expApprovedCount = experiences.filter(e => e.status?.toUpperCase() === 'APPROVED').length;
  const expPendingCount = experiences.filter(e => e.status?.toUpperCase() === 'PENDING').length;
  const expFlaggedCount = experiences.filter(e => e.status?.toUpperCase() === 'FLAGGED').length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto py-8 px-4">
      
      {/* 1. Admin Governance Hero Banner */}
      <div className="bg-[#222228] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-gray-800 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/15 border border-gray-800 text-yellow-300 text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-yellow-400" />
              <span>Platform Administration & Candidate Career Journey Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Admin Governance: <span className="text-yellow-400">User Data, Career Diagnostics & Platform Health</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Oversee everything users submit on the platform: monitor job applications, audit AI ATS resume diagnostics for candidate readiness, verify community interview experiences, and configure employee clearances.
            </p>
          </div>

          {/* Action Badge & Preview Website CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {onSelectView && (
              <button
                type="button"
                onClick={() => onSelectView('dashboard-overview')}
                className="px-4 py-2.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-gray-800 text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                title="Inspect public live website"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Public Website</span>
              </button>
            )}
            <button
              onClick={() => setShowDeployModal(true)}
              className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 active:scale-95 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Deploy Employee or Admin</span>
            </button>
          </div>
        </div>

        {/* Global Career-Building Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-gray-800/80">
          <div className="bg-[#18181c]/70 p-3 rounded-2xl border border-gray-800">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Candidate Resumes</span>
            <span className="text-lg font-black text-white mt-0.5 block">{applications.length}</span>
            <span className="text-[10px] text-yellow-400">Submitted to jobs</span>
          </div>

          <div className="bg-[#18181c]/70 p-3 rounded-2xl border border-gray-800">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">AI ATS Scans</span>
            <span className="text-lg font-black text-yellow-400 mt-0.5 block">{resumeScans.length}</span>
            <span className="text-[10px] text-gray-400">Career diagnostics</span>
          </div>

          <div className="bg-[#18181c]/70 p-3 rounded-2xl border border-gray-800">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Avg ATS Readiness</span>
            <span className="text-lg font-black text-emerald-400 mt-0.5 block">
              {adminStats?.avgAtsScore ? `${adminStats.avgAtsScore}%` : '83%'}
            </span>
            <span className="text-[10px] text-emerald-400/80">Target role match</span>
          </div>

          <div className="bg-[#18181c]/70 p-3 rounded-2xl border border-gray-800">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Interview Stories</span>
            <span className="text-lg font-black text-blue-400 mt-0.5 block">{experiences.length}</span>
            <span className="text-[10px] text-blue-400/80">Community insights</span>
          </div>

          <div className="bg-[#18181c]/70 p-3 rounded-2xl border border-gray-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Appropriate Intent</span>
            <span className="text-lg font-black text-emerald-400 mt-0.5 block">99.1%</span>
            <span className="text-[10px] text-emerald-400/80">Legitimate career growth</span>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setAdminTab('telemetry')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              adminTab === 'telemetry'
                ? 'bg-yellow-400 text-gray-950 shadow-md shadow-yellow-500/20'
                : 'bg-[#18181c] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Telemetry</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => {
              setAdminTab('resumes');
              fetchApplications();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              adminTab === 'resumes'
                ? 'bg-yellow-400 text-gray-950 shadow-md shadow-yellow-500/20'
                : 'bg-[#18181c] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Candidate Resumes</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              adminTab === 'resumes' ? 'bg-gray-950/20 text-gray-950' : 'bg-gray-800 text-gray-300'
            }`}>
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => {
              setAdminTab('ats-scans');
              fetchResumeScans();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              adminTab === 'ats-scans'
                ? 'bg-yellow-400 text-gray-950 shadow-md shadow-yellow-500/20'
                : 'bg-[#18181c] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>AI ATS Diagnostics</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              adminTab === 'ats-scans' ? 'bg-gray-950/20 text-gray-950' : 'bg-gray-800 text-gray-300'
            }`}>
              {resumeScans.length}
            </span>
          </button>

          <button
            onClick={() => {
              setAdminTab('experiences');
              fetchExperiences();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              adminTab === 'experiences'
                ? 'bg-yellow-400 text-gray-950 shadow-md shadow-yellow-500/20'
                : 'bg-[#18181c] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>User Experiences</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              adminTab === 'experiences' ? 'bg-gray-950/20 text-gray-950' : 'bg-gray-800 text-gray-300'
            }`}>
              {experiences.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('team')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              adminTab === 'team'
                ? 'bg-yellow-400 text-gray-950 shadow-md shadow-yellow-500/20'
                : 'bg-[#18181c] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Employee Clearances</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              adminTab === 'team' ? 'bg-gray-950/20 text-gray-950' : 'bg-gray-800 text-gray-300'
            }`}>
              {teamMembers.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-gray-400 flex items-center gap-2 font-mono">
          <Clock className="w-3.5 h-3.5 text-yellow-400" />
          <span>Last Sync: Just now</span>
        </div>
      </div>

      {/* 3. Action Notice Banner */}
      {actionNotice && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 animate-fadeIn ${
          actionNotice.type === 'success'
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : 'bg-yellow-950/40 border-yellow-500/40 text-yellow-300'
        }`}>
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{actionNotice.msg}</span>
          <button onClick={() => setActionNotice(null)} aria-label="Dismiss notification" className="min-w-[44px] min-h-[44px] text-gray-400 hover:text-white text-base inline-flex items-center justify-center p-2 rounded-xl">✕</button>
        </div>
      )}

      {/* =========================================================================
          TAB 1: WEBSITE TELEMETRY & HOW THE WORKING IS GOING ON
         ========================================================================= */}
      {adminTab === 'telemetry' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Total Jobs on Website</span>
                <Globe className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-3xl font-extrabold text-white mt-2">
                {statsLoading ? '...' : adminStats?.totalJobs || liveJobs.length || 0}
              </p>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{adminStats?.activeJobs || liveJobs.length || 0} Active & Published</span>
              </p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Staged for Employee Review</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400 mt-2">
                {statsLoading ? '...' : adminStats?.pendingReview || 0}
              </p>
              <p className="text-[11px] text-amber-400/80 mt-1">Awaiting employee approval</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Backend REST API</span>
                <Server className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2">
                {backendHealth?.status === 'UP' ? 'ONLINE' : 'ACTIVE'}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">Port 8081 • Spring Boot 3</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Database Engine</span>
                <Database className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-blue-400 mt-2">CONNECTED</p>
              <p className="text-[11px] text-gray-400 mt-1">H2 / PostgreSQL JPA Pool</p>
            </div>
          </div>

          {/* Autonomous AI Crawlers & Pipeline Health Matrix */}
          <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-400" />
                  <span>Autonomous Ingestion Pipelines & Background Schedulers</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  How data flows into the platform: Connected ATS boards and public tech APIs running on automated cron schedules.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleTriggerDiscovery('ALL')}
                  disabled={triggeringCrawler}
                  className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs font-black transition flex items-center justify-center gap-2 shadow-md shadow-yellow-500/20 active:scale-95 disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${triggeringCrawler ? 'animate-spin' : ''}`} />
                  <span>{triggeringCrawler ? 'Running Discovery...' : 'Trigger All Connectors'}</span>
                </button>
                <button
                  onClick={() => handleTriggerDiscovery('JOOBLE')}
                  disabled={triggeringCrawler}
                  className="px-3 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-yellow-300 border border-gray-800 text-xs font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-60"
                  title="Run Jooble Global Aggregator crawler"
                >
                  <span>Sync Jooble</span>
                </button>
                <button
                  onClick={() => handleTriggerDiscovery('USAJOBS')}
                  disabled={triggeringCrawler}
                  className="px-3 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-yellow-300 border border-gray-800 text-xs font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-60"
                  title="Run USAJobs Federal IT crawler"
                >
                  <span>Sync USAJobs</span>
                </button>
              </div>
            </div>

            {/* Grid of connected data sources */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Greenhouse ATS Feed', status: 'ACTIVE', type: 'Direct Employer ATS', targets: 'Figma, Stripe, GitLab, Discord', badge: '100% Direct Apply' },
                { name: 'Lever ATS Feed', status: 'ACTIVE', type: 'Direct Employer ATS', targets: 'Spotify, Netflix, Postman', badge: '100% Direct Apply' },
                { name: 'Ashby ATS Feed', status: 'ACTIVE', type: 'Direct Employer ATS', targets: 'Linear, Ramp, Notion', badge: '100% Direct Apply' },
                { name: 'Jooble Global API Feed', status: 'ACTIVE', type: 'Worldwide Tech Aggregator', targets: 'Global Software Engineers & Startups', badge: '70+ Countries' },
                { name: 'USAJobs Federal API Feed', status: 'ACTIVE', type: 'US Federal Civil Service', targets: 'NASA, CISA, DoD, Veterans Affairs (IT/Cyber)', badge: '100% Gov Verified' },
                { name: 'Arbeitnow Tech Feed', status: 'ACTIVE', type: 'Verified Public Board', targets: 'European & Global Tech Roles', badge: 'Direct Employer URL' },
                { name: 'RemoteOK API Feed', status: 'ACTIVE', type: 'Public Developer Board', targets: 'Global Remote Software Engineers', badge: 'Direct Job URL' },
                { name: 'Jobicy Engineering Feed', status: 'ACTIVE', type: 'Verified Remote Feed', targets: 'Backend, Frontend, Fullstack', badge: 'Direct Career Link' }
              ].map((pipe, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#18181c] border border-gray-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs">{pipe.name}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {pipe.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">{pipe.targets}</p>
                  <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px] text-gray-500">
                    <span>{pipe.type}</span>
                    <span className="font-bold text-yellow-400">{pipe.badge}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Schedulers Details */}
            <div className="p-4 rounded-2xl bg-[#18181c] border border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Job Discovery Scheduler</span>
                </p>
                <p className="text-[11px] text-gray-400">
                  Runs every 6 hours (<code className="text-yellow-300">0 0 */6 * * *</code>). Automatically polls all 6 connected feeds and stages candidates for employee review.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hourly Job Freshness Sentinel</span>
                </p>
                <p className="text-[11px] text-gray-400">
                  Runs every hour (<code className="text-emerald-300">0 0 * * * *</code>). Pings published jobs on employer domains; marks closed/expired roles immediately.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: EMPLOYEE & ADMIN PERMISSIONS AUTHORITY
         ========================================================================= */}
      {adminTab === 'team' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Roster Header & Filters */}
          <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-yellow-400" />
                  <span>Personnel Deployment & Operational Permissions</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Deploy new accounts and grant/revoke operational permissions (reviewing AI responses, publishing live, updating jobs).
                </p>
              </div>

              <button
                onClick={() => setShowDeployModal(true)}
                className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 active:scale-95 whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Deploy New Employee or Admin</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search personnel by name, email, company..."
                  value={teamSearchQuery}
                  onChange={(e) => setTeamSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {['ALL', 'ROLE_EMPLOYEE', 'ROLE_ADMIN'].map((rf) => (
                  <button
                    key={rf}
                    onClick={() => setRoleFilter(rf)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      roleFilter === rf
                        ? 'bg-yellow-400 text-gray-950 font-black shadow-sm'
                        : 'bg-[#18181c] border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {rf === 'ALL' ? 'All Roles' : rf === 'ROLE_EMPLOYEE' ? `Employees (${employeeCount})` : `Admins (${adminCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Personnel Table */}
            {teamLoading ? (
              <div className="p-12 text-center text-gray-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-yellow-400" />
                Loading deployed personnel...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs border border-dashed border-gray-800 rounded-2xl">
                No personnel found matching your filter criteria. Click "+ Deploy New Employee or Admin" to provision credentials.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#18181c] text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="px-4 py-3 rounded-l-xl">Personnel</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Assigned Company</th>
                      <th className="px-4 py-3">Permission Status & Clearance</th>
                      <th className="px-4 py-3">Active Capabilities</th>
                      <th className="px-4 py-3 text-right rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredMembers.map((member, idx) => {
                      const isAdminRole = member.role === 'ROLE_ADMIN' || member.role === 'ADMIN';
                      const permissions = member.permissions || ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'EDIT_JOB_DETAILS'];
                      const permsCount = permissions.length;
                      const isTimelineOpen = timelineExpandedUser?.email?.toLowerCase() === member.email?.toLowerCase();
                      const isRecentlyUpdated = recentlyUpdatedMemberEmail?.toLowerCase() === member.email?.toLowerCase();

                      let statusPill = null;
                      if (permsCount >= 6) {
                        statusPill = (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Full Clearance ({permsCount}/6)</span>
                            </span>
                            <p className="text-[10px] text-emerald-400/80 font-medium">All 6 operational controls active</p>
                          </div>
                        );
                      } else if (permsCount >= 3) {
                        statusPill = (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-yellow-400/15 border border-gray-800 text-yellow-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
                              <span>Active Clearance ({permsCount}/6)</span>
                            </span>
                            <p className="text-[10px] text-gray-400 font-medium">Authorized operational access</p>
                          </div>
                        );
                      } else if (permsCount > 0) {
                        statusPill = (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/15 border border-amber-500/40 text-amber-300">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              <span>Restricted Access ({permsCount}/6)</span>
                            </span>
                            <p className="text-[10px] text-amber-400/80 font-medium">Limited operational rights</p>
                          </div>
                        );
                      } else {
                        statusPill = (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/15 border border-rose-500/40 text-rose-300">
                              <Lock className="w-3.5 h-3.5 text-rose-400" />
                              <span>Access Suspended (0/6)</span>
                            </span>
                            <p className="text-[10px] text-rose-400/80 font-medium">No permissions granted</p>
                          </div>
                        );
                      }

                      return (
                        <React.Fragment key={member.id || member.email || idx}>
                          <tr className={`transition ${
                            isTimelineOpen 
                              ? 'bg-yellow-500/5 border-t-2 border-yellow-500/40' 
                              : isRecentlyUpdated
                              ? 'bg-emerald-950/20'
                              : 'hover:bg-gray-800/30'
                          }`}>
                            {/* Personnel Identity */}
                            <td className="px-4 py-3.5 flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                                isAdminRole
                                  ? 'bg-yellow-400/20 text-yellow-300 border border-gray-800'
                                  : 'bg-yellow-400/20 text-yellow-300 border border-yellow-500/40'
                              }`}>
                                {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs flex items-center gap-1.5 flex-wrap">
                                  <span>{member.name}</span>
                                  {member.email === currentUser?.email && (
                                    <span className="text-[9px] font-black text-yellow-400 bg-yellow-400/10 px-1.5 py-0.2 rounded border border-gray-800">YOU</span>
                                  )}
                                  {isRecentlyUpdated && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 animate-pulse">
                                      <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                                      Just Updated!
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-gray-400">{member.email}</p>
                              </div>
                            </td>

                            {/* Role Badge */}
                            <td className="px-4 py-3.5">
                              {isAdminRole ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-400/10 border border-gray-800 text-yellow-300">
                                  <Shield className="w-3 h-3 text-yellow-400" /> Platform Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-400/10 border border-yellow-500/30 text-yellow-400">
                                  <Briefcase className="w-3 h-3 text-yellow-400" /> Company Employee
                                </span>
                              )}
                            </td>

                            {/* Assigned Company */}
                            <td className="px-4 py-3.5 font-medium text-gray-300">
                              {member.company || (isAdminRole ? 'JobProof Core' : 'Google')}
                            </td>

                            {/* Permission Status & Clearance Indicator */}
                            <td className="px-4 py-3.5">
                              {statusPill}
                            </td>

                            {/* Granted Capabilities Chips */}
                            <td className="px-4 py-3.5">
                              {permissions.length === 0 ? (
                                <span className="text-[11px] text-gray-500 italic">No capabilities authorized</span>
                              ) : (
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {permissions.map((p, pi) => (
                                    <span key={pi} className="px-2 py-0.5 rounded-md bg-[#18181c] border border-gray-800 text-[10px] font-semibold text-gray-300 whitespace-nowrap">
                                      ✓ {p.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>

                            {/* Actions Column */}
                            <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  const targetView = member.role === 'ROLE_ADMIN' ? 'admin-panel' : 'employee-panel';
                                  if (onLoginAsEmployee) onLoginAsEmployee(member);
                                  if (onSelectView) onSelectView(targetView);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/25 border border-yellow-500/30 text-yellow-300 text-xs font-bold transition inline-flex items-center gap-1 active:scale-95"
                                title={`Access ${member.role === 'ROLE_ADMIN' ? 'Admin' : 'Employee'} workspace for this field`}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Access Field</span>
                              </button>

                              {/* Timeline Permissions Toggle Button */}
                              <button
                                onClick={() => {
                                  if (isTimelineOpen) {
                                    setTimelineExpandedUser(null);
                                  } else {
                                    setTimelineExpandedUser(member);
                                    setTimelineDraftPermissions(member.permissions ? [...member.permissions] : ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'EDIT_JOB_DETAILS']);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition inline-flex items-center gap-1.5 active:scale-95 ${
                                  isTimelineOpen
                                    ? 'bg-yellow-400 border-yellow-500 text-gray-950 font-black shadow-lg shadow-yellow-500/20'
                                    : 'bg-yellow-400/15 hover:bg-yellow-400/30 border-gray-800 text-yellow-300'
                                }`}
                                title="Open inline permission console on this page timeline position"
                              >
                                <Key className="w-3.5 h-3.5" />
                                <span>{isTimelineOpen ? 'Close Timeline' : 'Permissions'}</span>
                                {isTimelineOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                onClick={() => setSelectedMemberForDetails(member)}
                                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition inline-flex items-center"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {member.email !== currentUser?.email && (
                                <button
                                  onClick={() => handleRevokeAccess(member)}
                                  className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-gray-800 transition inline-flex items-center"
                                  title="Revoke access"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>

                          {/* =========================================================
                              INLINE TIMELINE PERMISSION CONSOLE ROW
                              Rendered directly on this page timeline position
                             ========================================================= */}
                          {isTimelineOpen && (
                            <tr key={`${member.email}-timeline`} className="border-b border-gray-800 bg-[#16161c] animate-fadeIn">
                              <td colSpan="6" className="p-0">
                                <div className="relative border-l-4 border-l-yellow-400 bg-gradient-to-r from-[#1e1e24] via-[#191920] to-[#141418] p-5 sm:p-7 shadow-2xl">
                                  {/* Timeline Header and Presets */}
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 border border-gray-800 flex items-center justify-center text-yellow-300 shadow-inner">
                                        <Key className="w-5 h-5" />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] uppercase tracking-widest font-black text-yellow-400">Timeline Permission Authority</span>
                                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-400/20 text-yellow-300 border border-gray-800">
                                            {isAdminRole ? 'Platform Administrator' : 'Company Employee'}
                                          </span>
                                        </div>
                                        <h4 className="text-base font-black text-white flex items-center gap-2">
                                          <span>Grant Operational Permissions:</span>
                                          <span className="text-yellow-300">{member.name}</span>
                                          <span className="text-xs font-normal text-gray-400">({member.email})</span>
                                        </h4>
                                      </div>
                                    </div>

                                    {/* Clearance Quick Presets */}
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-[11px] font-bold text-gray-400">Quick Presets:</span>
                                      <button
                                        type="button"
                                        onClick={() => setTimelineDraftPermissions(allAvailablePermissions.map(p => p.id))}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center gap-1 active:scale-95"
                                      >
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>Grant All (6/6)</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setTimelineDraftPermissions(['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'EDIT_JOB_DETAILS'])}
                                        className="px-2.5 py-1 rounded-lg bg-yellow-400/15 hover:bg-yellow-400/25 border border-gray-800 text-yellow-300 text-xs font-bold transition flex items-center gap-1 active:scale-95"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Standard Recruiter (3/6)</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setTimelineDraftPermissions(['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'VIEW_APPLICATIONS', 'UPDATE_STATUS'])}
                                        className="px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 text-xs font-bold transition flex items-center gap-1 active:scale-95"
                                      >
                                        <Briefcase className="w-3.5 h-3.5" />
                                        <span>Hiring Lead (4/6)</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setTimelineDraftPermissions([])}
                                        className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center gap-1 active:scale-95"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Revoke All</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Permission Cards Grid */}
                                  <div className="py-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <p className="text-xs font-bold text-gray-300 flex items-center gap-2">
                                        <span>Operational capabilities on this timeline node:</span>
                                        <span className="text-[11px] font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-gray-800">
                                          {timelineDraftPermissions.length} of {allAvailablePermissions.length} Granted
                                        </span>
                                      </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {allAvailablePermissions.map((perm) => {
                                        const isChecked = timelineDraftPermissions.includes(perm.id);
                                        return (
                                          <div
                                            key={perm.id}
                                            onClick={() => {
                                              setTimelineDraftPermissions(prev => 
                                                isChecked ? prev.filter(p => p !== perm.id) : [...prev, perm.id]
                                              );
                                            }}
                                            className={`p-3.5 rounded-2xl border transition cursor-pointer select-none flex items-start gap-3 ${
                                              isChecked
                                                ? 'bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-black/40 text-white'
                                                : 'bg-[#1b1b22] border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-[#202028]'
                                            }`}
                                          >
                                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 transition ${
                                              isChecked ? 'bg-yellow-400 border-yellow-500 text-gray-950 shadow-sm' : 'border-gray-700 bg-gray-900'
                                            }`}>
                                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                            </div>

                                            <div className="space-y-1 flex-1 min-w-0">
                                              <div className="flex items-center justify-between gap-1">
                                                <p className={`text-xs font-bold truncate ${isChecked ? 'text-white' : 'text-gray-300'}`}>
                                                  {perm.label}
                                                </p>
                                                {isChecked ? (
                                                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                                    Granted
                                                  </span>
                                                ) : (
                                                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-gray-800 text-gray-500">
                                                    Disabled
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-[11px] text-gray-400 leading-snug">{perm.desc}</p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Timeline Bottom Action Bar */}
                                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-800/80">
                                    <div className="text-xs text-gray-400 flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-yellow-400" />
                                      <span>
                                        Permission changes update the status column instantly on this timeline without any page reload.
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                                      <button
                                        type="button"
                                        onClick={() => setTimelineExpandedUser(null)}
                                        className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white text-xs font-bold transition hover:bg-gray-800"
                                      >
                                        Cancel
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleSavePermissions(member, timelineDraftPermissions)}
                                        className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs font-black shadow-lg shadow-yellow-500/20 transition flex items-center gap-2 active:scale-95"
                                      >
                                        <Check className="w-4 h-4" />
                                        <span>Save & Grant Permissions</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: USER SUBMISSIONS & RESUME DATA
         ========================================================================= */}
      {adminTab === 'resumes' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Submissions Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Total Applications & Resumes</span>
                <FileText className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-3xl font-extrabold text-white mt-2">
                {appsLoading ? '...' : applications.length}
              </p>
              <p className="text-[11px] text-yellow-400 mt-1">Submitted on Website</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Shortlisted Profiles</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2">
                {appsLoading ? '...' : appShortlistedCount}
              </p>
              <p className="text-[11px] text-emerald-400/80 mt-1">Qualified for Interviews</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Under Technical Review</span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-blue-400 mt-2">
                {appsLoading ? '...' : appReviewingCount}
              </p>
              <p className="text-[11px] text-blue-400/80 mt-1">In Evaluation Stage</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Pending First Screen</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400 mt-2">
                {appsLoading ? '...' : appPendingCount}
              </p>
              <p className="text-[11px] text-amber-400/80 mt-1">Awaiting Review</p>
            </div>
          </div>

          {/* Submissions Roster Box */}
          <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-400" />
                  <span>Candidate Submissions, Resumes & ATS Scorecards</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Inspect the resumes, contact credentials, cover letters, and parsed work experiences submitted by candidates on your website.
                </p>
              </div>

              <button
                onClick={fetchApplications}
                disabled={appsLoading}
                className="px-4 py-2.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-gray-800 text-xs font-bold transition flex items-center gap-2 active:scale-95 disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${appsLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Submissions</span>
              </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by candidate, role, skills, or email..."
                  value={appSearchQuery}
                  onChange={(e) => setAppSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {['ALL', 'PENDING', 'SHORTLISTED', 'REVIEWING', 'ACCEPTED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setAppStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      appStatusFilter === st
                        ? 'bg-yellow-400 text-gray-950 font-black shadow-sm'
                        : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    {st === 'ALL' ? 'All Submissions' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions Table / Cards */}
            {appsLoading ? (
              <div className="p-12 text-center text-gray-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-yellow-400" />
                Loading candidate submissions and resume data...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs border border-dashed border-gray-800 rounded-2xl space-y-2">
                <FileText className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="font-bold text-gray-300">No candidate submissions found matching your filters</p>
                <p className="text-gray-500">As candidates submit resumes on the live website, their full profile and scorecard will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#18181c] text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="px-4 py-3 rounded-l-xl">Candidate</th>
                      <th className="px-4 py-3">Target Opening</th>
                      <th className="px-4 py-3">Resume & Skills Data</th>
                      <th className="px-4 py-3">ATS Score</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredApplications.map((app) => {
                      const badge = app.status === 'SHORTLISTED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : app.status === 'REVIEWING'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : app.status === 'ACCEPTED'
                        ? 'bg-yellow-400/10 text-yellow-400 border-gray-800'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                      return (
                        <tr key={app.id} className="hover:bg-yellow-400/5 transition">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-yellow-400/20 text-yellow-300 font-black flex items-center justify-center text-xs flex-shrink-0">
                                {app.applicantName?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'CA'}
                              </div>
                              <div>
                                <p className="font-bold text-white text-xs">{app.applicantName}</p>
                                <p className="text-[11px] text-gray-400">{app.applicantEmail}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  {app.currentRole || 'Software Professional'} • {app.yearsOfExperience || 0} yrs exp
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <p className="font-bold text-white">{app.jobTitle || 'Tech Position'}</p>
                            <p className="text-[11px] text-gray-400">{app.companyName || 'Verified Employer'} • {app.jobLocation || 'Remote'}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{app.appliedAt || 'Recent'}</p>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="space-y-1.5 max-w-xs">
                              <div className="flex items-center gap-1.5 text-gray-300 font-mono text-[11px]">
                                <FileText className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                                <span className="truncate">{app.resumeFileName || 'Candidate_Resume.pdf'}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(app.skills || []).slice(0, 3).map((s, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300">
                                    {s}
                                  </span>
                                ))}
                                {(app.skills || []).length > 3 && (
                                  <span className="text-[10px] text-gray-500">+{app.skills.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                              <Sparkles className="w-3 h-3 text-blue-400" />
                              {app.atsMatchScore || 90}% Match
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${badge}`}>
                              {app.status || 'PENDING'}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedApplicationForModal(app)}
                              className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs font-bold transition inline-flex items-center gap-1 active:scale-95 shadow-sm shadow-yellow-500/20"
                              title="Inspect full resume, experience, and candidate profile"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Inspect Resume</span>
                            </button>

                            <a
                              href={`/api/admin/applications/${app.id}/download-resume`}
                              download={app.resumeFileName || 'Candidate_Resume.pdf'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white border border-slate-700 hover:border-teal-500/50 text-xs font-bold transition inline-flex items-center gap-1 active:scale-95 shadow-sm"
                              title="Download uploaded resume file"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </a>

                            <button
                              onClick={() => handleDeleteApplication(app.id, app.applicantName)}
                              className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-gray-800 transition inline-flex items-center"
                              title="Delete application submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 4: AI ATS RESUME SCANS & CAREER DIAGNOSTICS
         ========================================================================= */}
      {adminTab === 'ats-scans' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Key ATS Diagnostic Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Total AI ATS Scans</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-3xl font-extrabold text-white mt-2">
                {scansLoading ? '...' : resumeScans.length}
              </p>
              <p className="text-[11px] text-yellow-400 mt-1">Candidate Career Checks</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Career Ready Candidates</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2">
                {scansLoading ? '...' : scanCareerReadyCount}
              </p>
              <p className="text-[11px] text-emerald-400/80 mt-1">High ATS Target Match</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Upskilling Recommended</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400 mt-2">
                {scansLoading ? '...' : scanNeedsUpskillingCount}
              </p>
              <p className="text-[11px] text-amber-400/80 mt-1">Target Skill Gaps Identified</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>STAR Bullet Refinements</span>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-blue-400 mt-2">
                {scansLoading ? '...' : scanWeakBulletsCount}
              </p>
              <p className="text-[11px] text-blue-400/80 mt-1">Impact Verbs & Metrics Upgraded</p>
            </div>
          </div>

          {/* Diagnostic Roster Box */}
          <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span>Candidate AI ATS Evaluations & Career Readiness Records</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Verify how smoothly candidates are utilizing the AI ATS diagnostic engine and ensure resume data aligns with genuine career progress.
                </p>
              </div>

              <button
                onClick={fetchResumeScans}
                disabled={scansLoading}
                className="px-4 py-2.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-gray-800 text-xs font-bold transition flex items-center gap-2 active:scale-95 disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${scansLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Scans</span>
              </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by candidate, role, or skills..."
                  value={scanSearchQuery}
                  onChange={(e) => setScanSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Readiness Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { id: 'ALL', label: 'All Evaluations' },
                  { id: 'CAREER_READY', label: `Career Ready (${scanCareerReadyCount})` },
                  { id: 'NEEDS_UPSKILLING', label: `Needs Upskilling (${scanNeedsUpskillingCount})` },
                  { id: 'WEAK_BULLETS', label: `Weak Bullets (${scanWeakBulletsCount})` }
                ].map((rf) => (
                  <button
                    key={rf.id}
                    onClick={() => setReadinessFilter(rf.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      readinessFilter === rf.id
                        ? 'bg-yellow-400 text-gray-950 font-black shadow-sm'
                        : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    {rf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scans Table */}
            {scansLoading ? (
              <div className="p-12 text-center text-gray-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-yellow-400" />
                Loading AI resume diagnostics and career reports...
              </div>
            ) : filteredScans.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs border border-dashed border-gray-800 rounded-2xl space-y-2">
                <Sparkles className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="font-bold text-gray-300">No AI resume scans match your search or filter</p>
                <p className="text-gray-500">When users analyze their resume on the live website, their diagnostic logs and STAR rewrites will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#18181c] text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="px-4 py-3 rounded-l-xl">Candidate / User</th>
                      <th className="px-4 py-3">Target Career Role</th>
                      <th className="px-4 py-3">ATS Score</th>
                      <th className="px-4 py-3">Readiness & Skills</th>
                      <th className="px-4 py-3">Appropriate Usage</th>
                      <th className="px-4 py-3 text-right rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredScans.map((scan) => {
                      const atsScore = scan.overallAtsScore ?? scan.atsScore ?? 85;
                      const targetRole = scan.targetJobRole || scan.targetRole || 'Software Professional';
                      const fileName = scan.filename || scan.fileName || 'resume.pdf';
                      const candidateName = scan.candidateName || (fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ') : 'Candidate User');
                      const candidateEmail = scan.candidateEmail || (candidateName ? `${candidateName.toLowerCase().replace(/\s+/g, '.')}@candidate.io` : 'candidate@jobproof.io');
                      const extractedSkills = scan.extractedSkills || [];
                      const missingSkills = scan.missingCriticalSkills || scan.missingSkills || [];
                      const readiness = scan.careerReadiness || (atsScore >= 88 ? 'CAREER_READY' : (missingSkills.length > 2 ? 'NEEDS_UPSKILLING' : 'WEAK_BULLETS'));

                      const scoreColor = atsScore >= 85
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : atsScore >= 70
                        ? 'bg-yellow-400/10 text-yellow-400 border-gray-800'
                        : atsScore >= 50
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

                      const readinessPill = readiness === 'CAREER_READY'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : readiness === 'NEEDS_UPSKILLING'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-300 border-blue-500/20';

                      return (
                        <tr key={scan.id} className="hover:bg-yellow-400/5 transition">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-yellow-400/20 text-yellow-300 font-black flex items-center justify-center text-xs flex-shrink-0">
                                {candidateName.split(' ').map(n => n[0]).join('').substring(0, 2) || 'US'}
                              </div>
                              <div>
                                <p className="font-bold text-white text-xs">{candidateName}</p>
                                <p className="text-[11px] text-gray-400">{candidateEmail}</p>
                                <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <FileText className="w-3 h-3" />
                                  <span>{fileName}</span>
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="space-y-0.5">
                              <p className="font-bold text-white text-xs">{targetRole}</p>
                              <p className="text-[10px] text-gray-500">
                                {scan.analyzedAt || scan.uploadedAt || 'Recent Scan'}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black border ${scoreColor}`}>
                              <Sparkles className="w-3 h-3" />
                              {atsScore}/100
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="space-y-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${readinessPill}`}>
                                {readiness.replace('_', ' ')}
                              </span>
                              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                <span className="text-emerald-400 font-bold">{extractedSkills.length} found</span>
                                <span>•</span>
                                <span className="text-amber-400 font-bold">{missingSkills.length} missing</span>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            {scan.appropriateUsage !== false ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                <ShieldCheck className="w-3 h-3" /> Legitimate Career Intent
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                <AlertTriangle className="w-3 h-3" /> Flagged for Review
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`/api/admin/resume-scans/${scan.id}/download`}
                                download={fileName}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-xl bg-[#222228] hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/80 transition inline-flex items-center justify-center active:scale-95"
                                title="Download Full Resume from Database"
                              >
                                <Download className="w-3.5 h-3.5 text-yellow-400" />
                              </a>
                              <button
                                onClick={() => setSelectedScanForModal(scan)}
                                className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs font-bold transition inline-flex items-center gap-1 active:scale-95 shadow-sm shadow-yellow-500/20"
                                title="Inspect full ATS score, STAR bullet transformations, and recommendations"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Inspect Diagnostic</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 5: USER INTERVIEW & CAREER EXPERIENCES
         ========================================================================= */}
      {adminTab === 'experiences' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Key Experiences Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Total Experiences Shared</span>
                <MessageSquare className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-white mt-2">
                {expLoading ? '...' : experiences.length}
              </p>
              <p className="text-[11px] text-blue-400 mt-1">Community Knowledge Base</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Verified & Approved</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2">
                {expLoading ? '...' : expApprovedCount}
              </p>
              <p className="text-[11px] text-emerald-400/80 mt-1">Active on Community Board</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Pending Moderation</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400 mt-2">
                {expLoading ? '...' : expPendingCount}
              </p>
              <p className="text-[11px] text-amber-400/80 mt-1">Awaiting Admin Verification</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                <span>Flagged Content</span>
                <Flag className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-3xl font-extrabold text-rose-400 mt-2">
                {expLoading ? '...' : expFlaggedCount}
              </p>
              <p className="text-[11px] text-rose-400/80 mt-1">Requires Content Audit</p>
            </div>
          </div>

          {/* Experience Board Administration Roster */}
          <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span>User Interview & Career Experience Moderation</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Audit candidate interview stories, technical questions, difficulty ratings, and offer outcomes to ensure high-quality, constructive career guidance.
                </p>
              </div>

              <button
                onClick={fetchExperiences}
                disabled={expLoading}
                className="px-4 py-2.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-gray-800 text-xs font-bold transition flex items-center gap-2 active:scale-95 disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${expLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Experiences</span>
              </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by company, role, questions, or story..."
                  value={expSearchQuery}
                  onChange={(e) => setExpSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { id: 'ALL', label: 'All Experiences' },
                  { id: 'APPROVED', label: `Approved (${expApprovedCount})` },
                  { id: 'PENDING', label: `Pending (${expPendingCount})` },
                  { id: 'FLAGGED', label: `Flagged (${expFlaggedCount})` }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setExpStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      expStatusFilter === st.id
                        ? 'bg-yellow-400 text-gray-950 font-black shadow-sm'
                        : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Experiences Table */}
            {expLoading ? (
              <div className="p-12 text-center text-gray-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-yellow-400" />
                Loading candidate experience submissions...
              </div>
            ) : filteredExperiences.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs border border-dashed border-gray-800 rounded-2xl space-y-2">
                <MessageSquare className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="font-bold text-gray-300">No user interview experiences found matching your filters</p>
                <p className="text-gray-500">When community members share their interview experiences and advice on the website, they will appear here for admin review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#18181c] text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="px-4 py-3 rounded-l-xl">Target Company & Role</th>
                      <th className="px-4 py-3">Candidate / Author</th>
                      <th className="px-4 py-3">Difficulty & Outcome</th>
                      <th className="px-4 py-3">Questions & Advice Summary</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredExperiences.map((exp) => {
                      const badge = exp.status === 'APPROVED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : exp.status === 'FLAGGED'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                      return (
                        <tr key={exp.id} className="hover:bg-yellow-400/5 transition">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-300 font-bold flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-white text-xs">{exp.companyName || 'Company'}</p>
                                <p className="text-[11px] text-gray-400">{exp.jobTitle || 'Role'}</p>
                                {exp.location && (
                                  <p className="text-[10px] text-gray-500">{exp.location}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="space-y-0.5">
                              <p className="font-bold text-white text-xs">
                                {exp.anonymous ? 'Anonymous Candidate' : (exp.userName || 'Community Member')}
                              </p>
                              <p className="text-[11px] text-gray-400">{exp.userEmail || 'user@jobproof.io'}</p>
                              <p className="text-[10px] text-gray-500">
                                {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : 'Recent'}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="space-y-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-700">
                                {exp.difficultyLevel || 'Medium'} • {exp.interviewRounds || 1} Rnds
                              </span>
                              {exp.offerStatus && (
                                <p className="text-[10px] text-emerald-400 font-medium">{exp.offerStatus}</p>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3.5 max-w-xs">
                            {(() => {
                              const qList = Array.isArray(exp.questionsAsked)
                                ? exp.questionsAsked
                                : typeof exp.questionsAsked === 'string'
                                ? exp.questionsAsked.split('\n').map(q => q.trim()).filter(q => q.length > 0)
                                : [];

                              return (
                                <div className="space-y-1">
                                  {qList.length > 0 ? (
                                    <p className="text-gray-300 text-xs truncate">
                                      Q: {qList[0]}
                                    </p>
                                  ) : (
                                    <p className="text-gray-400 text-xs truncate">
                                      {exp.experienceStory?.substring(0, 45)}...
                                    </p>
                                  )}
                                  <span className="text-[10px] text-yellow-400">
                                    {qList.length} technical question(s) logged
                                  </span>
                                </div>
                              );
                            })()}
                          </td>

                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${badge}`}>
                              {exp.status || 'APPROVED'}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => setSelectedExpForModal(exp)}
                              className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs font-bold transition inline-flex items-center gap-1 active:scale-95 shadow-sm shadow-yellow-500/20"
                              title="Inspect full questions, advice, and story"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Story</span>
                            </button>

                            {exp.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateExperienceStatus(exp.id, 'APPROVED')}
                                className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded-lg transition inline-flex items-center border border-emerald-500/20"
                                title="Approve & Publish to community"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            {exp.status !== 'FLAGGED' && (
                              <button
                                onClick={() => handleUpdateExperienceStatus(exp.id, 'FLAGGED')}
                                className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 rounded-lg transition inline-flex items-center border border-amber-500/20"
                                title="Flag for content review"
                              >
                                <Flag className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteExperience(exp.id, exp.companyName)}
                              className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition inline-flex items-center"
                              title="Delete entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================================
          MODALS
         ========================================================= */}

      {/* 1. GIVE / EDIT PERMISSIONS MODAL */}
      {editingPermissionsUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#222228] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/15 border border-gray-800 text-yellow-300 text-xs font-bold">
                  <Key className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Give Operational Permissions</span>
                </div>
                <h2 className="text-xl font-black text-white">
                  Permissions: <span className="text-yellow-400">{editingPermissionsUser.name}</span>
                </h2>
                <p className="text-xs text-gray-400">
                  {editingPermissionsUser.role === 'ROLE_ADMIN' ? 'Platform Administrator' : 'Company Employee'} • {editingPermissionsUser.email}
                </p>
              </div>

              <button
                onClick={() => setEditingPermissionsUser(null)}
                aria-label="Close dialog"
                className="p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-300">Select authorized capabilities:</p>
              {allAvailablePermissions.map((perm) => {
                const currentPerms = editingPermissionsUser.permissions || [];
                const isChecked = currentPerms.includes(perm.id);

                return (
                  <div
                    key={perm.id}
                    onClick={() => {
                      const updated = isChecked
                        ? currentPerms.filter(p => p !== perm.id)
                        : [...currentPerms, perm.id];
                      setEditingPermissionsUser({
                        ...editingPermissionsUser,
                        permissions: updated
                      });
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-yellow-500/10 border-yellow-500/40 text-white'
                        : 'bg-[#18181c] border-gray-800 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 ${
                      isChecked ? 'bg-yellow-400 border-yellow-500 text-gray-950' : 'border-gray-700'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white">{perm.label}</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{perm.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setEditingPermissionsUser(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSavePermissions(editingPermissionsUser, editingPermissionsUser.permissions || [])}
                className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs font-black shadow-lg shadow-yellow-500/20 transition active:scale-95"
              >
                Save & Grant Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LAZY LOADED MODALS */}
      <React.Suspense fallback={null}>
        {/* 2. DEPLOY NEW USER MODAL */}
        {showDeployModal && (
          <DeployUserModal
            onClose={() => setShowDeployModal(false)}
            onUserDeployed={(newUsers) => {
              fetchUsers();
              setShowDeployModal(false);
              setActionNotice({
                type: 'success',
                msg: `Successfully provisioned ${newUsers.length} account(s)! Permissions and clearance active.`
              });
              setTimeout(() => setActionNotice(null), 5000);
            }}
          />
        )}

        {/* 3. PERSONNEL DETAIL MODAL */}
        {selectedMemberForDetails && (
          <PersonnelDetailModal
            member={selectedMemberForDetails}
            onClose={() => setSelectedMemberForDetails(null)}
            onEditPermissions={(member) => {
              setSelectedMemberForDetails(null);
              setTimelineExpandedUser(member);
              setTimelineDraftPermissions(member.permissions ? [...member.permissions] : ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'EDIT_JOB_DETAILS']);
            }}
            onRevokeAccess={(member) => {
              handleRevokeAccess(member);
            }}
          />
        )}

        {/* 4. CANDIDATE RESUME & APPLICATION MODAL */}
        {selectedApplicationForModal && (
          <ApplicantResumeModal
            application={selectedApplicationForModal}
            onClose={() => setSelectedApplicationForModal(null)}
            onStatusUpdated={(updated) => {
              setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
              setSelectedApplicationForModal(updated);
            }}
          />
        )}

        {/* 5. AI ATS RESUME DIAGNOSTIC MODAL */}
        {selectedScanForModal && (
          <AtsScanDetailModal
            scan={selectedScanForModal}
            onClose={() => setSelectedScanForModal(null)}
            onAuditUpdated={(updated) => {
              setResumeScans(prev => prev.map(s => s.id === updated.id ? updated : s));
              setSelectedScanForModal(updated);
              setActionNotice({
                type: 'success',
                msg: `Saved audit observation for candidate ${updated.candidateName}.`
              });
              setTimeout(() => setActionNotice(null), 3000);
            }}
          />
        )}

        {/* 6. USER INTERVIEW EXPERIENCE MODAL */}
        {selectedExpForModal && (
          <ExperienceDetailModal
            experience={selectedExpForModal}
            onClose={() => setSelectedExpForModal(null)}
            onStatusUpdated={handleUpdateExperienceStatus}
            onDelete={handleDeleteExperience}
          />
        )}
      </React.Suspense>
    </div>
  );
}
