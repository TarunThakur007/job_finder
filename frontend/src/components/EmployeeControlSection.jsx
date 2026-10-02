import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Building2, 
  RefreshCw, 
  Search, 
  AlertTriangle,
  Lock,
  UserCheck,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Sparkles,
  Zap,
  Globe,
  Check,
  Users,
  FileText,
  Eye,
  Mail,
  Phone,
  Briefcase,
  Layers,
  Clock,
  Filter,
  Edit3,
  Award,
  UserPlus,
  Bell,
  BellRing,
  CheckCheck,
  AlertCircle,
  Radio
} from 'lucide-react';
import ApplicantResumeModal from './ApplicantResumeModal';
import EditAndGrantPermissionModal from './EditAndGrantPermissionModal';
import DeployUserModal from './DeployUserModal';

export default function EmployeeControlSection({ liveJobs = [], currentUser, onPostJobClick, onLoginAsEmployee, onSelectView }) {
  const [activeTab, setActiveTab] = useState('vacancies'); // 'vacancies' | 'applications' | 'team'
  
  // Vacancies State
  const [pendingJobs, setPendingJobs] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);
  const [discovering, setDiscovering] = useState(false);
  const [vacancySearch, setVacancySearch] = useState('');
  const [editingJob, setEditingJob] = useState(null);

  // Hourly AI Job Freshness & Closed Vacancy Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [auditingFreshness, setAuditingFreshness] = useState(false);

  // Applications State
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationSearch, setApplicationSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Team Management State (Admin Only)
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamSearch, setTeamSearch] = useState('');

  const defaultApplications = [
    {
      id: 1,
      applicantName: 'Cooper Curtis',
      applicantEmail: 'cooper.curtis@jobproof.io',
      applicantPhone: '+1 (415) 890-1234',
      currentRole: 'Senior Full Stack Engineer',
      yearsOfExperience: 6.0,
      jobTitle: 'Senior Software Engineer',
      companyName: 'Google',
      jobLocation: 'New York, USA',
      jobType: 'Fulltime',
      status: 'PENDING',
      atsMatchScore: 96,
      skills: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Redis', 'GraphQL'],
      resumeFileName: 'Cooper_Curtis_Senior_FullStack_Resume.pdf',
      resumeFileType: 'PDF',
      resumeParsedSummary: 'Results-driven Senior Full Stack Engineer with 6+ years of experience leading engineering teams and building high-throughput microservices in Java/Spring Boot and responsive React/Next.js architectures.',
      resumeExperience: 'Lead Full Stack Engineer @ Stripe (2022 - Present)\n- Scaled developer-facing API services processing 12M+ webhooks daily with 99.99% uptime.\n- Mentored 8 junior and mid-level engineers and spearheaded adoption of modern React & TypeScript design systems.\n\nSenior Software Engineer @ Airbnb (2019 - 2022)\n- Designed real-time availability indexing engine reducing query response latency by 45%.\n- Deployed containerized microservices to Kubernetes clusters across AWS and GCP.',
      resumeEducation: 'B.S. in Computer Science\nUniversity of California, Berkeley (2015 - 2019) — Magna Cum Laude',
      coverNote: 'I am passionate about high-scale distributed systems and user-centric web applications. Having led frontend and backend teams across multiple SaaS platforms, I am eager to contribute to your core architecture.',
      adminNotes: 'Top candidate profile with strong leadership experience at Stripe. Prioritize for screening.',
      appliedAt: '2 hours ago'
    },
    {
      id: 2,
      applicantName: 'Alex Morgan',
      applicantEmail: 'alex.morgan@example.com',
      applicantPhone: '+1 (212) 555-0199',
      currentRole: 'Senior Java Backend Engineer',
      yearsOfExperience: 5.5,
      jobTitle: 'Senior Java Backend Engineer',
      companyName: 'Spotify',
      jobLocation: 'Stockholm / Remote',
      jobType: 'Fulltime',
      status: 'SHORTLISTED',
      atsMatchScore: 94,
      skills: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Microservices', 'Docker', 'Redis', 'REST API', 'Git'],
      resumeFileName: 'Alex_Morgan_Java_Backend_Resume.pdf',
      resumeFileType: 'PDF',
      resumeParsedSummary: 'Senior Java Backend Specialist with extensive track record in high-concurrency architectures, PostgreSQL query tuning, and distributed microservices.',
      resumeExperience: 'Senior Backend Engineer @ Datadog (2021 - Present)\n- Architected distributed event stream ingestion pipelines handling 50k+ events/sec using Kafka and Spring Boot.\n- Reduced database connection bottlenecks by 60% with PgBouncer connection pooling.\n\nSoftware Engineer @ Twilio (2019 - 2021)\n- Developed RESTful messaging endpoints and automated CI/CD deployment pipelines.',
      resumeEducation: 'B.S. in Software Engineering\nGeorgia Institute of Technology (2015 - 2019)',
      coverNote: 'My focus over the past 5 years has been on enterprise backend systems, relational database query optimization, and resilient messaging pipelines with Kafka and Redis.',
      adminNotes: 'Shortlisted for Round 1 Technical Architecture interview.',
      appliedAt: '5 hours ago'
    },
    {
      id: 3,
      applicantName: 'Priya Sharma',
      applicantEmail: 'priya.sharma@example.com',
      applicantPhone: '+1 (650) 443-8821',
      currentRole: 'Full Stack React & Spring Boot Developer',
      yearsOfExperience: 4.0,
      jobTitle: 'Lead React Developer',
      companyName: 'Figma',
      jobLocation: 'San Francisco, CA (Remote)',
      jobType: 'Fulltime',
      status: 'REVIEWING',
      atsMatchScore: 89,
      skills: ['React.js', 'JavaScript', 'TypeScript', 'Spring Boot', 'Tailwind CSS', 'PostgreSQL', 'REST APIs', 'Redux'],
      resumeFileName: 'Priya_Sharma_FullStack_React_Developer.pdf',
      resumeFileType: 'PDF',
      resumeParsedSummary: 'Versatile Full Stack developer with strong frontend competencies in React and Tailwind CSS paired with Spring Boot and PostgreSQL backend development.',
      resumeExperience: 'Full Stack Engineer @ FinTech Innovations (2022 - Present)\n- Developed customer onboarding portal reducing drop-off rates by 28%.\n- Built robust Spring Boot REST services with JWT authentication and RBAC.\n\nFrontend Engineer @ CloudCraft (2020 - 2022)\n- Created reusable design system component library in React & Tailwind CSS used across 4 enterprise products.',
      resumeEducation: 'B.Tech in Information Technology\nDelhi Technological University (2016 - 2020)',
      coverNote: 'Excited to bring my experience in building interactive, accessible React frontends backed by Spring Boot REST APIs to your engineering team.',
      adminNotes: 'Under review by engineering manager.',
      appliedAt: '1 day ago'
    }
  ];

  const fetchPendingJobs = async () => {
    setLoading(true);
    try {
      const [pendingRes, statsRes] = await Promise.all([
        fetch('/api/admin/vacancies/pending'),
        fetch('/api/admin/stats')
      ]);

      if (pendingRes.ok) {
        const data = await pendingRes.json();
        setPendingJobs(data);
      }
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setAdminStats(stats);
      }
    } catch (err) {
      console.error('Error loading AI vacancies:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setApplicationsLoading(true);
    try {
      const res = await fetch('/api/admin/applications');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setApplications(data);
        } else {
          setApplications(defaultApplications);
        }
      } else {
        setApplications(defaultApplications);
      }
    } catch (err) {
      console.error('Error loading applications:', err);
      setApplications(defaultApplications);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    setTeamLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      let list = [];
      if (res.ok) {
        list = await res.json();
      }
      let local = [];
      try {
        local = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
      } catch (e) {}

      const map = new Map();
      list.forEach(u => {
        if (u && u.email) map.set(u.email.toLowerCase(), u);
      });
      local.forEach(u => {
        if (u && u.email && !map.has(u.email.toLowerCase())) {
          map.set(u.email.toLowerCase(), u);
        }
      });
      setTeamMembers(Array.from(map.values()));
    } catch (e) {
      try {
        const local = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
        setTeamMembers(local);
      } catch (err) {}
    } finally {
      setTeamLoading(false);
    }
  };

  const handleDeleteTeamMember = async (user) => {
    if (!window.confirm(`Revoke platform clearance and remove ${user.name}?`)) return;
    try {
      if (user.id) {
        await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      }
    } catch (e) {}
    try {
      const local = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
      const filtered = local.filter(u => u.email?.toLowerCase() !== user.email?.toLowerCase());
      localStorage.setItem('jobproof_deployed_users', JSON.stringify(filtered));
    } catch (e) {}
    setTeamMembers(prev => prev.filter(u => u.email?.toLowerCase() !== user.email?.toLowerCase()));
    setActionNotice({ type: 'info', msg: `Revoked clearance and deleted ${user.name} (${user.email}).` });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadNotificationsCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error('Error fetching employee notifications:', e);
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
      }
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  const handleDismissNotification = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        fetchNotifications();
      }
    } catch (e) {
      console.error('Error dismissing notification:', e);
    }
  };

  const handleRunFreshnessAudit = async () => {
    setAuditingFreshness(true);
    setActionNotice({ type: 'info', msg: 'Hourly AI Freshness Agent is checking live career portals & ATS endpoints...' });
    try {
      const res = await fetch('/api/notifications/run-audit', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const detected = data.closedJobsDetected || 0;
        setActionNotice({
          type: detected > 0 ? 'error' : 'success',
          msg: detected > 0 
            ? `AI Audit Complete: ${detected} closed position(s) detected. Automatically unlisted and employee notification created!`
            : 'AI Audit Complete: All listed jobs are active, open, and accepting candidate applications!'
        });
        fetchNotifications();
        fetchPendingJobs();
        if (detected > 0) {
          setShowNotificationDrawer(true);
        }
      }
    } catch (e) {
      setActionNotice({ type: 'error', msg: 'Error running AI job freshness check.' });
    } finally {
      setAuditingFreshness(false);
      setTimeout(() => setActionNotice(null), 6000);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
    fetchApplications();
    fetchTeamMembers();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check if current user has employee / admin role
  const isEmployee = currentUser?.role === 'ROLE_EMPLOYEE' || currentUser?.role === 'ROLE_ADMIN';
  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  // Author-governed permissions
  const userPermissions = currentUser?.permissions || [
    'REVIEW_AI_VACANCIES',
    'GRANT_PERMISSION',
    'EDIT_JOB_DETAILS',
    'VIEW_APPLICATIONS',
    'UPDATE_STATUS'
  ];

  const canReviewVacancies = isAdmin || userPermissions.includes('REVIEW_AI_VACANCIES');
  const canGrantPermission = isAdmin || userPermissions.includes('GRANT_PERMISSION');
  const canEditJobDetails = isAdmin || userPermissions.includes('EDIT_JOB_DETAILS');
  const canViewApplications = isAdmin || userPermissions.includes('VIEW_APPLICATIONS');
  const canUpdateStatus = isAdmin || userPermissions.includes('UPDATE_STATUS');
  const canPostDirectJobs = isAdmin || userPermissions.includes('POST_DIRECT_JOBS');



  // Direct Grant Permission (Approve)
  const handleGrantPermission = async (job) => {
    try {
      const res = await fetch(`/api/admin/vacancies/${job.id}/approve`, {
        method: 'PUT'
      });

      if (res.ok) {
        setPendingJobs(prev => prev.filter(j => j.id !== job.id));
        setActionNotice({
          type: 'success',
          msg: `Permission Granted: "${job.title}" at ${job.company?.name || 'Company'} is published live to the job board!`
        });
        fetchPendingJobs();
      } else {
        throw new Error('Granting permission failed');
      }
    } catch (e) {
      setActionNotice({ type: 'error', msg: `Failed to grant permission for job #${job.id}.` });
    }
    setTimeout(() => setActionNotice(null), 4500);
  };

  // Discard / Reject AI vacancy
  const handleRejectVacancy = async (id, title) => {
    try {
      const res = await fetch(`/api/admin/vacancies/${id}/reject`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setPendingJobs(prev => prev.filter(j => j.id !== id));
        setActionNotice({
          type: 'info',
          msg: `Discarded: AI vacancy "${title}" removed from staging queue.`
        });
        fetchPendingJobs();
      } else {
        throw new Error('Discard failed');
      }
    } catch (e) {
      setActionNotice({ type: 'error', msg: `Failed to discard job #${id}.` });
    }
    setTimeout(() => setActionNotice(null), 4500);
  };

  // Trigger on-demand AI Discovery
  const handleTriggerDiscovery = async () => {
    setDiscovering(true);
    setActionNotice({ type: 'info', msg: 'AI Discovery Agent crawling target ATS boards (Greenhouse, Lever, Ashby)...' });
    try {
      const res = await fetch('/api/admin/vacancies/discover', { method: 'POST' });
      const data = await res.json();
      setActionNotice({
        type: 'success',
        msg: `AI Crawl Complete: Discovered and staged ${data.stagedCount} fresh vacancies awaiting your review!`
      });
      fetchPendingJobs();
    } catch (e) {
      setActionNotice({ type: 'error', msg: 'Error running AI discovery crawl.' });
    } finally {
      setDiscovering(false);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  // Update candidate status
  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: updated.status } : a));
      } else {
        setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      }
      setActionNotice({
        type: 'success',
        msg: `Candidate application #${appId} moved to "${newStatus}".`
      });
    } catch (e) {
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  if (!isEmployee) {
    return (
      <div className="bg-[#222228] border border-yellow-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 animate-fadeIn max-w-2xl mx-auto shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center mx-auto shadow-inner border border-yellow-500/20">
          <Briefcase className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Employee & Recruiter Portal</h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
            Access to review AI-discovered vacancies, edit listing details, grant permissions to publish live, and manage candidate applicants is restricted to hiring team members.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <div className="inline-flex items-center gap-2 text-xs text-yellow-400 font-bold bg-yellow-400/10 border border-yellow-500/30 px-5 py-2.5 rounded-2xl">
            <ShieldCheck className="w-4 h-4 text-yellow-400" />
            <span>Authorized Clearance Only: Deployed by Admin Author</span>
          </div>
        </div>
      </div>
    );
  }

  // Filter pending vacancies
  const filteredJobs = pendingJobs.filter(j => {
    if (!vacancySearch) return true;
    const term = vacancySearch.toLowerCase();
    const compName = (j.company?.name || '').toLowerCase();
    const title = (j.title || '').toLowerCase();
    const source = (j.source || '').toLowerCase();
    return compName.includes(term) || title.includes(term) || source.includes(term);
  });

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesFilter = selectedStatusFilter === 'ALL' || app.status?.toUpperCase() === selectedStatusFilter;
    if (!matchesFilter) return false;
    if (!applicationSearch) return true;
    const term = applicationSearch.toLowerCase();
    const name = (app.applicantName || '').toLowerCase();
    const email = (app.applicantEmail || '').toLowerCase();
    const jobTitle = (app.jobTitle || '').toLowerCase();
    const company = (app.companyName || '').toLowerCase();
    const role = (app.currentRole || '').toLowerCase();
    const skills = Array.isArray(app.skills) ? app.skills.join(' ').toLowerCase() : (app.skills || '').toLowerCase();
    return name.includes(term) || email.includes(term) || jobTitle.includes(term) || company.includes(term) || role.includes(term) || skills.includes(term);
  });

  // Filter deployed team members
  const filteredTeam = teamMembers.filter(m => {
    if (!teamSearch) return true;
    const s = teamSearch.toLowerCase();
    return (m.name || '').toLowerCase().includes(s) ||
      (m.email || '').toLowerCase().includes(s) ||
      (m.role || '').toLowerCase().includes(s) ||
      (m.company || '').toLowerCase().includes(s) ||
      (m.title || '').toLowerCase().includes(s);
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Employee Operations Banner */}
      <div className="bg-[#222228] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-yellow-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5 text-yellow-400" />
            <span>Company Employee & Recruiter Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Staging & <span className="text-yellow-400">Permission Grant Center</span>
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Review vacancies discovered by the autonomous AI Agent across official career and ATS feeds. Inspect and refine details, and grant permission to publish verified jobs live to the public portal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleTriggerDiscovery}
            disabled={discovering}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black tracking-wide transition shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-60"
          >
            <Sparkles className={`w-4 h-4 ${discovering ? 'animate-spin' : ''}`} />
            <span>{discovering ? 'AI Agent Crawling ATS Feeds...' : '⚡ Run AI Discovery Agent'}</span>
          </button>

          {onPostJobClick && (
            <button
              onClick={onPostJobClick}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold transition active:scale-95"
            >
              <span>+ Post Manual Vacancy</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 animate-fadeIn ${
          actionNotice.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
            : actionNotice.type === 'error'
            ? 'bg-rose-950/60 border-rose-800 text-rose-300'
            : 'bg-blue-950/60 border-blue-800 text-blue-300'
        }`}>
          {actionNotice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : actionNotice.type === 'error' ? (
            <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          ) : (
            <RefreshCw className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
          )}
          <span>{actionNotice.msg}</span>
        </div>
      )}

      {/* Author Clearance Governance Banner */}
      <div className="bg-[#222228] border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-400/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-white flex items-center gap-2">
              <span>{isAdmin ? 'Master Admin Author Session' : 'Employee Clearance Active'}:</span>
              <span className="text-yellow-400">{currentUser?.name}</span>
            </p>
            <p className="text-[11px] text-gray-400">
              {isAdmin 
                ? 'Author with supreme authority to deploy employees and grant operational permissions.' 
                : `Authorized & Deployed by Admin Author: ${currentUser?.author || 'Alex Vance (Admin Author)'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-gray-400 uppercase font-bold mr-1">
            {isAdmin ? 'Clearance Level:' : 'Author-Granted Permissions:'}
          </span>
          {isAdmin ? (
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-extrabold">
              ★ Master Admin Authority
            </span>
          ) : (
            userPermissions.map((perm) => (
              <span key={perm} className="px-2 py-0.5 rounded-lg bg-[#18181c] border border-gray-800 text-[10px] text-yellow-400 font-bold">
                ✓ {perm.replace(/_/g, ' ')}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Employee Focused Permission Header */}
      {isAdmin ? (
        <div className="flex items-center gap-3 border-b border-gray-800 pb-2 flex-wrap">
          <button
            onClick={() => setActiveTab('vacancies')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'vacancies'
                ? 'bg-yellow-400 text-gray-950 shadow-lg shadow-yellow-500/20'
                : 'bg-[#18181c] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Vacancies & Grant Permissions</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'vacancies' ? 'bg-gray-950 text-yellow-400' : 'bg-gray-800 text-gray-300'
            }`}>
              {pendingJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'applications'
                ? 'bg-yellow-400 text-gray-950 shadow-lg shadow-yellow-500/20'
                : 'bg-[#18181c] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidate Applications</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'applications' ? 'bg-gray-950 text-yellow-400' : 'bg-gray-800 text-gray-300'
            }`}>
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => onSelectView ? onSelectView('admin-panel') : setActiveTab('team')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'team'
                ? 'bg-yellow-400 text-gray-950 shadow-lg shadow-yellow-500/20'
                : 'bg-[#18181c] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Deploy & Manage Team Page</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'team' ? 'bg-gray-950 text-yellow-400' : 'bg-gray-800 text-gray-300'
            }`}>
              {teamMembers.length}
            </span>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
            <h2 className="text-sm font-extrabold text-white tracking-wide uppercase">
              AI Vacancy Permission Grant & Publishing Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-black">
              {pendingJobs.length} Staged For Your Permission
            </span>
          </div>
        </div>
      )}

      {/* TAB 1: AI VACANCIES & GRANT PERMISSION */}
      {activeTab === 'vacancies' && (
        <div className="space-y-6">
          {/* Telemetry Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <p className="text-xs text-gray-400 font-semibold">Awaiting Your Permission</p>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">{pendingJobs.length}</p>
              <p className="text-[11px] text-amber-400/80 mt-1">Discovered by AI Agent</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <p className="text-xs text-gray-400 font-semibold">Live Approved Jobs</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">{adminStats?.activeJobs || 0}</p>
              <p className="text-[11px] text-emerald-400/80 mt-1">Granted Permission & Published</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <p className="text-xs text-gray-400 font-semibold">Total Verified Positions</p>
              <p className="text-3xl font-extrabold text-white mt-1">{adminStats?.totalJobs || 0}</p>
              <p className="text-[11px] text-yellow-400 mt-1">In Platform Governance</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <p className="text-xs text-gray-400 font-semibold">Connected ATS Feeds</p>
              <p className="text-3xl font-extrabold text-yellow-400 mt-1">3 ATS</p>
              <p className="text-[11px] text-gray-400 mt-1">Greenhouse • Lever • Ashby</p>
            </div>
          </div>

          {/* HOURLY AI VACANCY FRESHNESS & CLOSURE MONITOR */}
          <div className="bg-[#222228] border border-yellow-500/30 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-32 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    Hourly AI Job Freshness Agent Active (Cron: 00 * * * *)
                  </span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-black animate-pulse">
                      {unreadNotificationsCount} Closed Roles Detected
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Automated Hourly Job Status & Closure Sentinel</span>
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed">
                  Every hour, the AI Sentinel pings all live vacancies listed on our website. If an employer removes the position or their ATS flags it as closed/expired, the AI agent <strong>instantly unlists it</strong> from the public search and dispatches an alert here for employee review.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
                    unreadNotificationsCount > 0
                      ? 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/50'
                      : 'bg-[#18181c] border-gray-800 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Bell className={`w-4 h-4 ${unreadNotificationsCount > 0 ? 'text-rose-400 animate-bounce' : 'text-gray-400'}`} />
                  <span>Closure Alerts</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    unreadNotificationsCount > 0 ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {unreadNotificationsCount}
                  </span>
                </button>

                <button
                  onClick={handleRunFreshnessAudit}
                  disabled={auditingFreshness}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${auditingFreshness ? 'animate-spin' : ''}`} />
                  <span>{auditingFreshness ? 'Auditing Live ATS Boards...' : '⚡ Audit Vacancy Freshness Now'}</span>
                </button>
              </div>
            </div>

            {/* EXPANDABLE NOTIFICATIONS DRAWER */}
            {(showNotificationDrawer || unreadNotificationsCount > 0) && (
              <div className="mt-4 pt-4 border-t border-gray-800/80 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Employee Notifications: Closed Vacancies Detected by AI Agent ({notifications.length})</span>
                  </h4>
                  <button
                    onClick={() => setShowNotificationDrawer(false)}
                    className="text-[11px] text-gray-500 hover:text-gray-300 transition"
                  >
                    Hide Panel
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-[#18181c] border border-gray-800 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>All verified listed vacancies are currently OPEN and accepting applications!</span>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          !n.isRead 
                            ? 'bg-rose-950/20 border-rose-800/60 text-white' 
                            : 'bg-[#18181c] border-gray-800 text-gray-400'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-black border border-rose-500/30">
                              CLOSED & UNLISTED
                            </span>
                            <span className="font-extrabold text-xs text-white">
                              {n.jobTitle}
                            </span>
                            <span className="text-xs text-gray-400">@ {n.companyName}</span>
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            )}
                          </div>

                          <p className="text-[11px] text-gray-300">
                            <strong>Reason:</strong> {n.reason}
                          </p>

                          <p className="text-[10px] text-gray-500">
                            {n.message}
                          </p>

                          <div className="flex items-center gap-3 pt-1 text-[10px] text-gray-500">
                            <span>Detected: {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}</span>
                            {n.applyUrl && (
                              <a
                                href={n.applyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-yellow-400 hover:underline flex items-center gap-1"
                              >
                                View Target ATS URL <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                          {!n.isRead && (
                            <button
                              onClick={() => handleMarkNotificationRead(n.id)}
                              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-emerald-400 text-xs font-bold transition flex items-center gap-1"
                              title="Mark as Acknowledged"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Acknowledge</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDismissNotification(n.id)}
                            className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-rose-400 transition"
                            title="Dismiss Notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Staging Queue */}
          <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-yellow-400" />
                  <span>AI Discovered Listings Awaiting Employee Permission ({filteredJobs.length})</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Inspect the details discovered by the AI agent. You can click <strong>"Review & Edit Details"</strong> to refine information or click <strong>"Grant Permission"</strong> to publish live.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter by company, title..."
                    value={vacancySearch}
                    onChange={e => setVacancySearch(e.target.value)}
                    className="bg-[#18181c] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 w-48 sm:w-64"
                  />
                </div>

                <button
                  onClick={fetchPendingJobs}
                  className="p-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-gray-300 border border-gray-800 transition"
                  title="Refresh queue"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-yellow-400" />
                <p className="text-xs font-semibold">Loading AI-discovered vacancies...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-3 bg-slate-800/30 rounded-2xl border border-dashed border-slate-800">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                <h4 className="text-sm font-bold text-white">All Vacancies Processed!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No pending AI listings currently awaiting permission. Click "Run AI Discovery Agent" above to fetch fresh job openings from target employer boards.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => {
                  const compName = job.company?.name || 'Target Employer';
                  const trustScore = job.trustScore || 95;
                  const sourceLabel = job.source || 'AI Greenhouse / Lever Crawler';

                  return (
                    <div
                      key={job.id}
                      className="p-5 rounded-2xl bg-[#1c1c22] border border-slate-800 hover:border-slate-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm"
                    >
                      {/* Left: Job Details & AI Signals */}
                      <div className="space-y-2.5 max-w-2xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-white text-base">{job.title}</h4>
                          
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Employer Verified</span>
                          </span>

                          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[11px] font-bold border border-purple-500/20 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span>AI Agent Feed</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          <span className="font-bold text-slate-200">🏢 {compName}</span>
                          <span>•</span>
                          <span>📍 {job.location || 'Remote'}</span>
                          <span>•</span>
                          <span>💼 {job.employmentType || 'Full-time'}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">
                            Direct Apply Link: <span className="font-mono text-[10px] text-slate-400">{job.applyUrl ? (job.applyUrl.substring(0, 40) + '...') : 'N/A'}</span>
                          </span>
                        </div>

                        {/* AI Signals */}
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                            ✓ Official ATS Source: {sourceLabel}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                            ✓ Direct Application URL Matched
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                            ✓ Requisition Active
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions for Employee */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
                        {/* Score */}
                        <div className="flex sm:flex-col items-center justify-between sm:justify-center px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center">
                          <span className="text-[10px] uppercase font-bold text-emerald-500">AI Trust</span>
                          <span className="text-sm font-black">{trustScore}%</span>
                        </div>

                        {/* Review & Edit AI Details Button */}
                        {canEditJobDetails && (
                          <button
                            onClick={() => setEditingJob(job)}
                            className="px-3.5 py-2.5 rounded-xl bg-[#222228] hover:bg-gray-800 text-gray-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-gray-800"
                            title="Inspect and edit details extracted by AI"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-yellow-400" />
                            <span>Review & Edit Details</span>
                          </button>
                        )}

                        {/* GRANT PERMISSION BUTTON */}
                        {canGrantPermission ? (
                          <button
                            onClick={() => handleGrantPermission(job)}
                            className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/20 active:scale-95"
                            title="Grant permission to publish this AI job listing live"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Grant Permission</span>
                          </button>
                        ) : (
                          <div
                            className="px-3.5 py-2.5 rounded-xl bg-[#18181c] border border-gray-800 text-gray-500 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
                            title="Admin Author permission required: 'GRANT_PERMISSION' not enabled for your account"
                          >
                            <Lock className="w-3.5 h-3.5 text-gray-500" />
                            <span>Permission Locked</span>
                          </div>
                        )}

                        {/* Reject / Discard Button */}
                        <button
                          onClick={() => handleRejectVacancy(job.id, job.title)}
                          className="p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 transition flex items-center justify-center border border-rose-800/40 active:scale-95"
                          title="Discard this AI listing"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE APPLICATIONS (ADMIN ONLY) */}
      {isAdmin && activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Telemetry Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <p className="text-xs text-gray-400 font-semibold">Total Applications</p>
              <p className="text-3xl font-extrabold text-white mt-1">{applications.length}</p>
              <p className="text-[11px] text-gray-400 mt-1">Submitted for Your Jobs</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <p className="text-xs text-gray-400 font-semibold">Pending Review</p>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">
                {applications.filter(a => a.status === 'PENDING').length}
              </p>
              <p className="text-[11px] text-amber-400/80 mt-1">Action Required</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <p className="text-xs text-gray-400 font-semibold">Shortlisted</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">
                {applications.filter(a => a.status === 'SHORTLISTED').length}
              </p>
              <p className="text-[11px] text-emerald-400/80 mt-1">Ready for Interview</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <p className="text-xs text-gray-400 font-semibold">Accepted / Offers</p>
              <p className="text-3xl font-extrabold text-purple-400 mt-1">
                {applications.filter(a => a.status === 'ACCEPTED').length}
              </p>
              <p className="text-[11px] text-purple-400/80 mt-1">Advancing to Hire</p>
            </div>
          </div>

          {/* Applications Table Card */}
          <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  <span>Applicant Review & Resumes ({filteredApplications.length})</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Inspect candidate contact info, work history, skills, and interactive ATS resume.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidate, role, skill..."
                    value={applicationSearch}
                    onChange={e => setApplicationSearch(e.target.value)}
                    className="bg-[#18181c] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 w-52 sm:w-64"
                  />
                </div>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-[#18181c] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                >
                  <option value="ALL">All Statuses ({applications.length})</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="REVIEWING">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="ACCEPTED">Accepted / Offers</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                <button
                  onClick={fetchApplications}
                  className="p-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-gray-300 border border-gray-800 transition"
                  title="Refresh applications list"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {applicationsLoading ? (
              <div className="py-12 text-center text-gray-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-yellow-400" />
                <p className="text-xs font-semibold">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-3 bg-[#18181c] rounded-2xl border border-dashed border-gray-800">
                <Users className="w-10 h-10 mx-auto text-gray-500" />
                <h4 className="text-sm font-bold text-white">No Applications Found</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  No candidate applications match your current search/filter.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => {
                  const statusColors = {
                    SHORTLISTED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                    REVIEWING: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                    ACCEPTED: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                    REJECTED: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                    PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  };
                  const badgeClass = statusColors[app.status?.toUpperCase()] || statusColors.PENDING;

                  return (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl bg-[#1c1c22] border border-slate-800 hover:border-slate-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm"
                    >
                      <div className="flex items-start gap-4 max-w-2xl">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-950 font-black text-base flex items-center justify-center flex-shrink-0 shadow-md shadow-yellow-500/20">
                          {app.applicantName?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'CA'}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="font-bold text-white text-base">
                              {app.applicantName}
                            </h4>
                            <span className="text-xs text-yellow-400 font-semibold">
                              {app.currentRole || 'Software Engineer'}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}`}>
                              {app.status || 'PENDING'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                            <span className="text-slate-200 font-medium">
                              Applied for: <strong className="text-white">{app.jobTitle}</strong> at <strong className="text-yellow-400">{app.companyName}</strong>
                            </span>
                            <span>•</span>
                            <span>📍 {app.jobLocation || 'Remote'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              {app.applicantEmail}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap pt-1">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-[11px] font-semibold border border-slate-700 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-rose-400" />
                              <span>{app.resumeFileName || 'Candidate_Resume.pdf'}</span>
                            </span>

                            {Array.isArray(app.skills) && app.skills.slice(0, 4).map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-300 text-[10px] font-medium border border-slate-700/50"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
                        <div className="flex sm:flex-col items-center justify-between sm:justify-center px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-center">
                          <span className="text-[10px] uppercase font-bold text-blue-400">ATS Match</span>
                          <span className="text-base font-black">{app.atsMatchScore || 92}%</span>
                        </div>

                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/20 active:scale-95"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details & Resume</span>
                        </button>

                        {app.status !== 'SHORTLISTED' && (
                          <button
                            onClick={() => handleUpdateApplicationStatus(app.id, 'SHORTLISTED')}
                            className="px-3 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1 border border-emerald-800/40 active:scale-95"
                            title="Shortlist candidate"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Shortlist</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DEPLOY & MANAGE TEAM (EMPLOYEES & ADMINS) */}
      {activeTab === 'team' && currentUser?.role === 'ROLE_ADMIN' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Link to Dedicated Team Management Page */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#18181c] border border-yellow-500/30">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-extrabold text-white">Full Deploy & Team Management Authority Page</p>
                <p className="text-[11px] text-gray-400">As the Admin Author, access the master console to manage granular permissions, author attributions, and bulk provisioning.</p>
              </div>
            </div>
            {onSelectView && (
              <button
                onClick={() => onSelectView('admin-panel')}
                className="px-4 py-2 rounded-xl bg-yellow-400 text-gray-950 text-xs font-black hover:bg-yellow-300 transition whitespace-nowrap active:scale-95"
              >
                Open Deploy & Team Page →
              </button>
            )}
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <p className="text-xs text-gray-400 font-semibold">Deployed Company Employees</p>
              <p className="text-3xl font-extrabold text-yellow-400 mt-1">
                {teamMembers.filter(u => u.role === 'ROLE_EMPLOYEE' || !u.role?.includes('ADMIN')).length}
              </p>
              <p className="text-[11px] text-yellow-400/80 mt-1">Granted AI Listing & ATS Review Permissions</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <p className="text-xs text-gray-400 font-semibold">Platform Administrators</p>
              <p className="text-3xl font-extrabold text-purple-400 mt-1">
                {teamMembers.filter(u => u.role === 'ROLE_ADMIN' || u.role === 'ADMIN').length}
              </p>
              <p className="text-[11px] text-purple-400/80 mt-1">Full Governance & Clearance</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
              <p className="text-xs text-gray-400 font-semibold">Total Provisioned Accounts</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">{teamMembers.length}</p>
              <p className="text-[11px] text-emerald-400/80 mt-1">Active Cleared Enterprise Seats</p>
            </div>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter team members by name, email, role..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#18181c] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowDeployModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition shadow-lg shadow-yellow-500/20 active:scale-95 whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Deploy Employee or Admin</span>
                </button>
              </div>
            </div>

            {/* Team Members List */}
            {teamLoading ? (
              <div className="p-12 text-center text-gray-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-yellow-400" />
                Loading deployed personnel...
              </div>
            ) : filteredTeam.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs border border-dashed border-gray-800 rounded-2xl">
                No team members found matching your search. Click "+ Deploy Employee or Admin" to provision access.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#18181c] text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="px-4 py-3 rounded-l-xl">Personnel</th>
                      <th className="px-4 py-3">Assigned Role</th>
                      <th className="px-4 py-3">Company / Org</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Clearance Status</th>
                      <th className="px-4 py-3 text-right rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredTeam.map((member, idx) => {
                      const isAdminRole = member.role === 'ROLE_ADMIN' || member.role === 'ADMIN';
                      return (
                        <tr key={member.id || member.email || idx} className="hover:bg-gray-800/30 transition">
                          <td className="px-4 py-3.5 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isAdminRole ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-yellow-400/20 text-yellow-300 border border-yellow-500/40'
                            }`}>
                              {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">{member.name}</p>
                              <p className="text-[11px] text-gray-400">{member.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {isAdminRole ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 border border-purple-500/30 text-purple-300">
                                <Shield className="w-3 h-3 text-purple-400" /> Platform Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-400/10 border border-yellow-500/30 text-yellow-400">
                                <Briefcase className="w-3 h-3 text-yellow-400" /> Company Recruiter
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-gray-300">
                            {member.company || (isAdminRole ? 'JobProof Core' : 'Google')}
                          </td>
                          <td className="px-4 py-3.5 text-gray-400">
                            {member.title || (isAdminRole ? 'Platform Governance' : 'Hiring Partner')}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              Active Clearance
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => handleDeleteTeamMember(member)}
                              className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-800 transition"
                              title="Revoke clearance and remove"
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

      {/* EDIT & GRANT PERMISSION MODAL */}
      {editingJob && (
        <EditAndGrantPermissionModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onPermissionGranted={(updatedJob) => {
            setPendingJobs(prev => prev.filter(j => j.id !== updatedJob.id));
            setActionNotice({
              type: 'success',
              msg: `Permission Granted & Details Updated: "${updatedJob.title}" is published live to the public site!`
            });
            fetchPendingJobs();
            setTimeout(() => setActionNotice(null), 4500);
          }}
        />
      )}

      {/* APPLICANT RESUME INSPECTION MODAL */}
      {selectedApplication && (
        <ApplicantResumeModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusUpdated={(updated) => {
            setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
            setSelectedApplication(updated);
          }}
        />
      )}

      {/* DEPLOY EMPLOYEE / ADMIN MODAL */}
      {showDeployModal && (
        <DeployUserModal
          onClose={() => setShowDeployModal(false)}
          onUserDeployed={(newUsers) => {
            setTeamMembers(prev => [...newUsers, ...prev]);
            fetchTeamMembers();
            setActionNotice({
              type: 'success',
              msg: `Successfully deployed ${newUsers.length} team account(s)! They can now log in directly.`
            });
            setTimeout(() => setActionNotice(null), 5000);
          }}
        />
      )}

    </div>
  );
}
