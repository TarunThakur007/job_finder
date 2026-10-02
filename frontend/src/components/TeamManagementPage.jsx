import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  UserPlus, 
  Briefcase, 
  Building2, 
  Mail, 
  Phone,
  Key, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Trash2, 
  Edit3, 
  Sparkles, 
  UserCheck, 
  Layers, 
  RefreshCw, 
  Check, 
  Lock, 
  Unlock,
  Award, 
  AlertTriangle, 
  ChevronRight, 
  ShieldCheck, 
  Eye,
  FileText,
  Download,
  Linkedin,
  Globe,
  ExternalLink,
  Users,
  ShieldAlert,
  Calendar,
  Clock
} from 'lucide-react';
import DeployUserModal from './DeployUserModal';
import ApplicantResumeModal from './ApplicantResumeModal';
import EditAndGrantPermissionModal from './EditAndGrantPermissionModal';
import PersonnelDetailModal from './PersonnelDetailModal';

export default function TeamManagementPage({ currentUser, liveJobs = [] }) {
  // Navigation tabs exclusively for Admin Authority
  const [adminTab, setAdminTab] = useState('team'); // 'team' | 'resumes' | 'vacancies'

  // ==========================================
  // TAB 1: TEAM & EMPLOYEE DEPLOY STATE
  // ==========================================
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'ROLE_EMPLOYEE' | 'ROLE_ADMIN'
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployInitialRole, setDeployInitialRole] = useState('ROLE_EMPLOYEE');
  const [selectedMemberForDetails, setSelectedMemberForDetails] = useState(null);
  const [editingPermissionsUser, setEditingPermissionsUser] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Available operational permissions
  const allAvailablePermissions = [
    {
      id: 'REVIEW_AI_VACANCIES',
      label: 'Review AI Vacancies',
      desc: 'Browse and inspect AI crawler staging queue from Greenhouse, Lever, and Ashby.'
    },
    {
      id: 'GRANT_PERMISSION',
      label: 'Grant Live Permission',
      desc: 'Authorize AI-extracted listings to be published live with verified badge.'
    },
    {
      id: 'EDIT_JOB_DETAILS',
      label: 'Edit Job & Salary Details',
      desc: 'Modify salary ranges, required skills, title, and application URLs before publishing.'
    },
    {
      id: 'VIEW_APPLICATIONS',
      label: 'View Candidate Resumes',
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
      desc: 'Directly submit manual company openings into backend API.'
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
      author: currentUser?.name || 'Alex Vance (Admin Author)',
      permissions: ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'EDIT_JOB_DETAILS', 'VIEW_APPLICATIONS', 'UPDATE_STATUS'],
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
      author: currentUser?.name || 'Alex Vance (Admin Author)',
      permissions: ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'VIEW_APPLICATIONS'],
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
      author: currentUser?.name || 'Alex Vance (Admin Author)',
      permissions: ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'EDIT_JOB_DETAILS', 'VIEW_APPLICATIONS', 'UPDATE_STATUS', 'POST_DIRECT_JOBS'],
      createdAt: '2026-09-10T08:00:00',
      status: 'ACTIVE'
    }
  ];

  // ==========================================
  // TAB 2: UPLOADED RESUMES & USER DETAILS STATE
  // ==========================================
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('ALL');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [platformUsers, setPlatformUsers] = useState([]);
  const [platformUsersLoading, setPlatformUsersLoading] = useState(true);
  const [resumeSubView, setResumeSubView] = useState('resumes'); // 'resumes' | 'users'

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
    },
    {
      id: 4,
      applicantName: 'Rohan Verma',
      applicantEmail: 'rohan.verma@example.com',
      applicantPhone: '+1 (408) 772-9901',
      currentRole: 'AI & Data Pipeline Engineer',
      yearsOfExperience: 4.5,
      jobTitle: 'Data Science & Machine Learning Lead',
      companyName: 'Netflix',
      jobLocation: 'Los Gatos, CA',
      jobType: 'Fulltime',
      status: 'ACCEPTED',
      atsMatchScore: 92,
      skills: ['Python', 'PyTorch', 'Apache Spark', 'SQL', 'FastAPI', 'Pandas', 'Docker', 'Airflow', 'AWS'],
      resumeFileName: 'Rohan_Verma_Data_AI_Pipeline_Engineer.pdf',
      resumeFileType: 'PDF',
      resumeParsedSummary: 'Data engineer specialized in distributed data processing pipelines, ML inference endpoints, and automated data validation.',
      resumeExperience: 'Senior ML Engineer @ VectorAI (2022 - Present)\n- Built streaming feature pipelines supporting 100M+ real-time predictions daily.\n- Optimized PyTorch model serving latency from 140ms down to 28ms.\n\nData Engineer @ AdScale (2020 - 2022)\n- Managed multi-terabyte Spark ETL jobs running on AWS EMR.',
      resumeEducation: 'M.S. in Computer Science (Machine Learning Focus)\nCarnegie Mellon University (2018 - 2020)',
      coverNote: 'Specialized in high-scale machine learning systems, data streaming pipelines, and PyTorch model serving.',
      adminNotes: 'Final offer accepted. Ready for onboarding.',
      appliedAt: '2 days ago'
    }
  ];

  // ==========================================
  // TAB 3: AI VACANCIES & STAGING STATE
  // ==========================================
  const [pendingJobs, setPendingJobs] = useState([]);
  const [vacanciesLoading, setVacanciesLoading] = useState(true);
  const [vacancySearch, setVacancySearch] = useState('');
  const [discovering, setDiscovering] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // ==========================================
  // DATA FETCHING FUNCTIONS
  // ==========================================
  const fetchUsers = async () => {
    setTeamLoading(true);
    setPlatformUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      let apiUsers = [];
      if (res.ok) {
        apiUsers = await res.json();
      }

      let candidateUsers = [];
      try {
        candidateUsers = JSON.parse(localStorage.getItem('jobproof_registered_candidates') || '[]');
      } catch (err) {}

      // Combine API users and candidate registrations
      const userMap = new Map();
      apiUsers.forEach(u => u?.email && userMap.set(u.email.toLowerCase(), u));
      candidateUsers.forEach(c => {
        if (c?.email && !userMap.has(c.email.toLowerCase())) {
          userMap.set(c.email.toLowerCase(), {
            id: c.id,
            name: c.name,
            email: c.email,
            role: c.role || 'ROLE_USER',
            createdAt: c.registeredAt || new Date().toISOString(),
            status: 'ACTIVE'
          });
        }
      });

      setPlatformUsers(Array.from(userMap.values()));

      let localUsers = [];
      try {
        localUsers = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
      } catch (e) {}

      // Deduplicate and combine users
      const map = new Map();
      defaultTeam.forEach(u => map.set(u.email.toLowerCase(), u));
      localUsers.forEach(u => {
        if (u && u.email) {
          const existing = map.get(u.email.toLowerCase());
          map.set(u.email.toLowerCase(), {
            ...existing,
            ...u,
            permissions: u.permissions || (existing ? existing.permissions : ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'VIEW_APPLICATIONS']),
            author: u.author || (existing ? existing.author : (currentUser?.name || 'Platform Admin Author'))
          });
        }
      });
      apiUsers.forEach(u => {
        if (u && u.email) {
          const existing = map.get(u.email.toLowerCase());
          map.set(u.email.toLowerCase(), {
            ...existing,
            ...u,
            permissions: u.permissions || (existing ? existing.permissions : ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'VIEW_APPLICATIONS']),
            author: u.author || (existing ? existing.author : (currentUser?.name || 'Platform Admin Author'))
          });
        }
      });

      setTeamMembers(Array.from(map.values()));
    } catch (e) {
      setTeamMembers(defaultTeam);
    } finally {
      setTeamLoading(false);
      setPlatformUsersLoading(false);
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
      setApplications(defaultApplications);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const fetchPendingJobs = async () => {
    setVacanciesLoading(true);
    try {
      const res = await fetch('/api/admin/vacancies/pending');
      if (res.ok) {
        const data = await res.json();
        setPendingJobs(data);
      }
    } catch (err) {
      console.error('Error loading AI vacancies:', err);
    } finally {
      setVacanciesLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchApplications();
    fetchPendingJobs();
  }, []);

  // Save updated permissions for an employee
  const handleSavePermissions = async (user, updatedPermissions) => {
    const authorName = currentUser?.name || 'Alex Vance (Admin Author)';
    try {
      if (user.id) {
        await fetch(`/api/admin/users/${user.id}/permissions`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            permissions: updatedPermissions,
            author: authorName
          })
        });
      }
    } catch (e) {}

    const updatedUser = {
      ...user,
      permissions: updatedPermissions,
      author: authorName,
      lastAuthorizedAt: new Date().toLocaleTimeString()
    };

    setTeamMembers(prev => prev.map(u => u.email.toLowerCase() === user.email.toLowerCase() ? updatedUser : u));

    try {
      const local = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
      const filtered = local.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
      localStorage.setItem('jobproof_deployed_users', JSON.stringify([updatedUser, ...filtered]));
    } catch (e) {}

    setEditingPermissionsUser(null);
    setActionNotice({
      type: 'success',
      msg: `Permissions granted for ${user.name} by Author ${authorName}!`
    });
    setTimeout(() => setActionNotice(null), 4500);
  };

  // Revoke user clearance
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Revoke platform clearance and remove ${user.name} (${user.email})?`)) {
      return;
    }

    try {
      if (user.id) {
        await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      }
    } catch (e) {}

    try {
      const local = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
      const filtered = local.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
      localStorage.setItem('jobproof_deployed_users', JSON.stringify(filtered));
    } catch (e) {}

    setTeamMembers(prev => prev.filter(u => u.email.toLowerCase() !== user.email.toLowerCase()));
    setActionNotice({
      type: 'info',
      msg: `Cleared access revoked for ${user.name}.`
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Update candidate application status
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
    } catch (e) {
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    }
    setActionNotice({
      type: 'success',
      msg: `Candidate submission #${appId} moved to "${newStatus}" by Admin Author.`
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Grant live permission to publish AI vacancy
  const handleGrantPermission = async (job) => {
    try {
      const res = await fetch(`/api/admin/vacancies/${job.id}/approve`, { method: 'PUT' });
      if (res.ok) {
        setPendingJobs(prev => prev.filter(j => j.id !== job.id));
        setActionNotice({
          type: 'success',
          msg: `Permission Granted: "${job.title}" at ${job.company?.name || 'Company'} published live!`
        });
        fetchPendingJobs();
      }
    } catch (e) {
      setActionNotice({ type: 'error', msg: `Failed to grant permission for job #${job.id}.` });
    }
    setTimeout(() => setActionNotice(null), 4500);
  };

  // Discard AI vacancy
  const handleRejectVacancy = async (id, title) => {
    try {
      const res = await fetch(`/api/admin/vacancies/${id}/reject`, { method: 'DELETE' });
      if (res.ok) {
        setPendingJobs(prev => prev.filter(j => j.id !== id));
        setActionNotice({ type: 'info', msg: `Discarded AI vacancy "${title}".` });
        fetchPendingJobs();
      }
    } catch (e) {
      setActionNotice({ type: 'error', msg: `Failed to discard job #${id}.` });
    }
    setTimeout(() => setActionNotice(null), 4500);
  };

  // Run AI Discovery Agent
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

  // Filtered members list
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

  // Filtered applications list
  const filteredApplications = applications.filter(a => {
    const matchesStatus = appStatusFilter === 'ALL' || a.status === appStatusFilter;
    if (!matchesStatus) return false;
    if (!appSearchQuery) return true;
    const q = appSearchQuery.toLowerCase();
    const skillsMatch = Array.isArray(a.skills) && a.skills.some(s => s.toLowerCase().includes(q));
    return (a.applicantName || '').toLowerCase().includes(q) ||
      (a.applicantEmail || '').toLowerCase().includes(q) ||
      (a.currentRole || '').toLowerCase().includes(q) ||
      (a.jobTitle || '').toLowerCase().includes(q) ||
      (a.companyName || '').toLowerCase().includes(q) ||
      skillsMatch;
  });

  // Filtered pending vacancies
  const filteredVacancies = pendingJobs.filter(j => {
    if (!vacancySearch) return true;
    const term = vacancySearch.toLowerCase();
    const compName = (j.company?.name || '').toLowerCase();
    const title = (j.title || '').toLowerCase();
    return compName.includes(term) || title.includes(term);
  });

  const employeeCount = teamMembers.filter(u => u.role === 'ROLE_EMPLOYEE' || !u.role?.includes('ADMIN')).length;
  const adminCount = teamMembers.filter(u => u.role === 'ROLE_ADMIN' || u.role === 'ADMIN').length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto py-8 px-4">
      
      {/* 1. Admin Author Hero Banner */}
      <div className="bg-[#222228] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-yellow-500/30 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
              <span>Admin Author & Exclusive Authority Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Admin Governance: <span className="text-yellow-400">Personnel & Uploaded Resumes</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              As the <span className="text-yellow-400 font-bold">Admin Author</span>, you have supreme authority to provision company employees, deploy administrators, grant or revoke employee operational permissions, and inspect candidate user details and uploaded resumes on JobProof.
            </p>
          </div>

          {/* Author Badge Chip */}
          <div className="flex items-center gap-3.5 bg-[#18181c] p-4 rounded-2xl border border-gray-800 flex-shrink-0 shadow-lg">
            {currentUser?.avatar && currentUser?.avatar.startsWith('http') ? (
              <img
                src={currentUser.avatar}
                alt="Author"
                className="w-12 h-12 rounded-xl object-cover border-2 border-yellow-400"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-purple-950/60 border-2 border-yellow-400 flex items-center justify-center text-2xl select-none shadow-md">
                {currentUser?.avatar || '👤'}
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Author</p>
              <p className="text-sm font-extrabold text-white">{currentUser?.name || 'Alex Vance'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-yellow-400">Master Authority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Admin Authority Master Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-[#222228] border border-gray-800 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setAdminTab('team')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
              adminTab === 'team'
                ? 'bg-yellow-400 text-gray-950 shadow-md shadow-yellow-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Team & Employee Deploy</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              adminTab === 'team' ? 'bg-gray-950 text-yellow-400' : 'bg-gray-800 text-gray-300'
            }`}>
              {teamMembers.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('resumes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
              adminTab === 'resumes'
                ? 'bg-yellow-400 text-gray-950 shadow-md shadow-yellow-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Uploaded Resumes & User Details</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              adminTab === 'resumes' ? 'bg-gray-950 text-yellow-400' : 'bg-gray-800 text-gray-300'
            }`}>
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('vacancies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
              adminTab === 'vacancies'
                ? 'bg-yellow-400 text-gray-950 shadow-md shadow-yellow-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Vacancies & Staging</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              adminTab === 'vacancies' ? 'bg-gray-950 text-yellow-400' : 'bg-gray-800 text-gray-300'
            }`}>
              {pendingJobs.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-gray-400 pr-3 hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Admin Session: <strong className="text-white">{currentUser?.email || 'admin@jobproof.io'}</strong></span>
        </div>
      </div>

      {/* 3. Action Notification Banner */}
      {actionNotice && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 animate-fadeIn ${
          actionNotice.type === 'success'
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
            : actionNotice.type === 'error'
            ? 'bg-rose-950/60 border-rose-800 text-rose-300'
            : 'bg-[#18181c] border-gray-800 text-gray-300'
        }`}>
          {actionNotice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : actionNotice.type === 'error' ? (
            <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          )}
          <span>{actionNotice.msg}</span>
        </div>
      )}

      {/* =========================================================
          VIEW TAB 1: TEAM & EMPLOYEE DEPLOY
         ========================================================= */}
      {adminTab === 'team' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Telemetry Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company Employees</span>
                <Briefcase className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-3xl font-black text-yellow-400">{employeeCount}</p>
              <p className="text-[11px] text-gray-400">Granted AI Listing & ATS Review Rights</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Administrators</span>
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-black text-purple-400">{adminCount}</p>
              <p className="text-[11px] text-gray-400">Full System Governance Clearance</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Deployed Seats</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-emerald-400">{teamMembers.length}</p>
              <p className="text-[11px] text-gray-400">Author-Governed Enterprise Accounts</p>
            </div>
          </div>

          {/* Controls & Table */}
          <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search team by name, email, company..."
                  value={teamSearchQuery}
                  onChange={(e) => setTeamSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div className="flex items-center gap-2 p-1 bg-[#18181c] rounded-xl border border-gray-800">
                <button
                  onClick={() => setRoleFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    roleFilter === 'ALL' ? 'bg-yellow-400 text-gray-950 font-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All ({teamMembers.length})
                </button>
                <button
                  onClick={() => setRoleFilter('ROLE_EMPLOYEE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    roleFilter === 'ROLE_EMPLOYEE' ? 'bg-yellow-400 text-gray-950 font-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Employees ({employeeCount})
                </button>
                <button
                  onClick={() => setRoleFilter('ROLE_ADMIN')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    roleFilter === 'ROLE_ADMIN' ? 'bg-yellow-400 text-gray-950 font-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Admins ({adminCount})
                </button>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => {
                    setDeployInitialRole('ROLE_EMPLOYEE');
                    setShowDeployModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition shadow-md shadow-yellow-500/20 active:scale-95 whitespace-nowrap"
                  title="Provision and deploy a new company employee recruiter"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add New Employee</span>
                </button>

                <button
                  onClick={() => {
                    setDeployInitialRole('ROLE_ADMIN');
                    setShowDeployModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition shadow-md shadow-purple-600/30 active:scale-95 whitespace-nowrap border border-purple-400/40"
                  title="Provision a new platform administrator with governance clearance"
                >
                  <Shield className="w-4 h-4 text-purple-200" />
                  <span>+ Add New Admin</span>
                </button>
              </div>
            </div>

            {/* Personnel Table */}
            {teamLoading ? (
              <div className="p-12 text-center text-gray-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-yellow-400" />
                Loading personnel from backend...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs border border-dashed border-gray-800 rounded-2xl space-y-2">
                <UserCheck className="w-8 h-8 mx-auto text-gray-600" />
                <p className="font-bold text-gray-300">No personnel found</p>
                <p className="text-gray-500">Click "+ Make & Deploy Employee" to provision team members.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#18181c] text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="px-4 py-3 rounded-l-xl">Personnel & Identity</th>
                      <th className="px-4 py-3">Platform Role</th>
                      <th className="px-4 py-3">Author / Deployer</th>
                      <th className="px-4 py-3">Permissions Granted by Author</th>
                      <th className="px-4 py-3">Company & Title</th>
                      <th className="px-4 py-3 text-right rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredMembers.map((member, idx) => {
                      const isAdminRole = member.role === 'ROLE_ADMIN' || member.role === 'ADMIN';
                      const userPerms = member.permissions || ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'VIEW_APPLICATIONS'];

                      return (
                        <tr key={member.id || member.email || idx} className="hover:bg-gray-800/30 transition">
                          <td 
                            onClick={() => setSelectedMemberForDetails(member)}
                            className="px-4 py-4 cursor-pointer group"
                            title="Click to view full personnel dossier"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition select-none ${
                                isAdminRole
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : 'bg-yellow-400/20 text-yellow-300 border border-yellow-500/40'
                              }`}>
                                {member.avatar || '👤'}
                              </div>
                              <div>
                                <p className="font-extrabold text-white text-xs group-hover:text-yellow-400 transition flex items-center gap-1.5">
                                  <span>{member.name}</span>
                                  <Eye className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition" />
                                </p>
                                <p className="text-[11px] text-gray-400">{member.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            {isAdminRole ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-purple-500/10 border border-purple-500/30 text-purple-300">
                                <Shield className="w-3 h-3 text-purple-400" /> Platform Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-yellow-400/10 border border-yellow-500/30 text-yellow-400">
                                <Briefcase className="w-3 h-3 text-yellow-400" /> Company Employee
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-gray-200">
                                {member.author || currentUser?.name || 'Admin Author'}
                              </p>
                              <span className="text-[10px] text-yellow-400 font-semibold inline-block">
                                Verified Author
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {userPerms.map((permId) => {
                                const def = allAvailablePermissions.find(p => p.id === permId);
                                return (
                                  <span
                                    key={permId}
                                    className="px-2 py-0.5 rounded-lg bg-[#18181c] border border-gray-800 text-[10px] font-bold text-gray-300 flex items-center gap-1"
                                  >
                                    <Check className="w-2.5 h-2.5 text-yellow-400" />
                                    {def ? def.label : permId}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div>
                              <p className="text-xs font-bold text-white">{member.company || (isAdminRole ? 'JobProof Core' : 'Google')}</p>
                              <p className="text-[11px] text-gray-400">{member.title || (isAdminRole ? 'Platform Authority' : 'Recruiter')}</p>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedMemberForDetails(member)}
                                className="px-3 py-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-200 hover:text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
                                title="View full details and dossier"
                              >
                                <Eye className="w-3.5 h-3.5 text-yellow-400" />
                                <span>Details</span>
                              </button>

                              <button
                                onClick={() => setEditingPermissionsUser(member)}
                                className="px-3 py-1.5 rounded-xl bg-[#18181c] hover:bg-gray-800 border border-yellow-500/30 text-yellow-400 hover:text-yellow-300 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
                                title="Give or edit permissions"
                              >
                                <Key className="w-3.5 h-3.5" />
                                <span>Permissions</span>
                              </button>

                              <button
                                onClick={() => handleDeleteUser(member)}
                                className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-800 transition"
                                title="Revoke access"
                              >
                                <Trash2 className="w-4 h-4" />
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

      {/* =========================================================
          VIEW TAB 2: UPLOADED RESUMES & USER DETAILS (ADMIN AUTHORITY)
         ========================================================= */}
      {adminTab === 'resumes' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Resumes & Candidate Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate Resumes</span>
              <p className="text-3xl font-black text-white">{applications.length}</p>
              <p className="text-[11px] text-yellow-400">Uploaded via Website & Applications</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Review</span>
              <p className="text-3xl font-black text-amber-400">
                {applications.filter(a => a.status === 'PENDING').length}
              </p>
              <p className="text-[11px] text-amber-400/80">Awaiting Admin Decision</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shortlisted / Offers</span>
              <p className="text-3xl font-black text-emerald-400">
                {applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'ACCEPTED').length}
              </p>
              <p className="text-[11px] text-emerald-400/80">Approved for Hiring</p>
            </div>

            <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Users</span>
              <p className="text-3xl font-black text-purple-400">{platformUsers.length}</p>
              <p className="text-[11px] text-purple-400/80">Registered Website Accounts</p>
            </div>
          </div>

          {/* Subview Switcher: Uploaded Candidate Resumes vs Registered User Accounts */}
          <div className="flex items-center gap-2 p-1.5 bg-[#222228] border border-gray-800 rounded-2xl w-fit">
            <button
              onClick={() => setResumeSubView('resumes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                resumeSubView === 'resumes'
                  ? 'bg-yellow-400 text-gray-950 font-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Uploaded Resumes & Applications ({applications.length})</span>
            </button>
            <button
              onClick={() => setResumeSubView('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                resumeSubView === 'users'
                  ? 'bg-yellow-400 text-gray-950 font-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Registered User Accounts ({platformUsers.length})</span>
            </button>
          </div>

          {/* SUBVIEW 1: UPLOADED RESUMES & CANDIDATE DETAILS */}
          {resumeSubView === 'resumes' && (
            <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-yellow-400" />
                    <span>Uploaded Candidate Resumes & Submission Details ({filteredApplications.length})</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    As Admin Author, you have full authority to inspect candidate contact information, phone, email, experience history, ATS score, and download or review uploaded resume documents.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search applicant, role, skill..."
                      value={appSearchQuery}
                      onChange={(e) => setAppSearchQuery(e.target.value)}
                      className="bg-[#18181c] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 w-52 sm:w-64"
                    />
                  </div>

                  <select
                    value={appStatusFilter}
                    onChange={(e) => setAppStatusFilter(e.target.value)}
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
                  <p className="text-xs font-semibold">Loading uploaded resumes...</p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-3 bg-[#18181c] rounded-2xl border border-dashed border-gray-800">
                  <Users className="w-10 h-10 mx-auto text-gray-500" />
                  <h4 className="text-sm font-bold text-white">No Resumes Found</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    No candidate submissions match your current search or filter.
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
                        className="p-5 rounded-2xl bg-[#18181c] border border-gray-800 hover:border-gray-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm"
                      >
                        {/* Left: Applicant Information & Resume Badge */}
                        <div className="flex items-start gap-4 max-w-2xl">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-950 font-black text-base flex items-center justify-center flex-shrink-0 shadow-md shadow-yellow-500/20">
                            {app.applicantName ? app.applicantName.split(' ').map(n => n[0]).join('').substring(0, 2) : 'CA'}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h4 className="font-bold text-white text-base">
                                {app.applicantName}
                              </h4>
                              <span className="text-xs text-yellow-400 font-semibold">
                                {app.currentRole || 'Software Engineer'} • {app.yearsOfExperience || '5'} yrs exp
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}`}>
                                {app.status || 'PENDING'}
                              </span>
                            </div>

                            {/* Contact Details Filled by User */}
                            <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                              <span className="text-gray-200 font-medium flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-yellow-400" />
                                {app.applicantEmail}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-gray-300">
                                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                {app.applicantPhone || '+1 (415) 890-1234'}
                              </span>
                              <span>•</span>
                              <span>Applied for: <strong className="text-white">{app.jobTitle}</strong> at <strong className="text-yellow-400">{app.companyName}</strong></span>
                            </div>

                            {/* Resume File & Skills Pill */}
                            <div className="flex items-center gap-2 flex-wrap pt-1">
                              <span className="px-2.5 py-1 rounded-lg bg-[#222228] text-gray-300 text-[11px] font-semibold border border-gray-700 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-rose-400" />
                                <span className="text-white font-mono">{app.resumeFileName || 'Candidate_Resume.pdf'}</span>
                                <span className="px-1.5 py-0.2 rounded bg-gray-800 text-[10px] text-gray-400 font-bold">{app.resumeFileType || 'PDF'}</span>
                              </span>

                              {Array.isArray(app.skills) && app.skills.slice(0, 4).map((s, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-[#222228] text-gray-300 text-[10px] font-semibold border border-gray-800"
                                >
                                  {s}
                                </span>
                              ))}
                              {Array.isArray(app.skills) && app.skills.length > 4 && (
                                <span className="text-[10px] text-gray-500 font-bold">
                                  +{app.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: ATS Score & Admin Authority Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-800">
                          {/* ATS Score Card */}
                          <div className="flex sm:flex-col items-center justify-between sm:justify-center px-4 py-2 rounded-xl bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-center">
                            <span className="text-[10px] uppercase font-bold text-yellow-400">ATS Match</span>
                            <span className="text-base font-black text-white">{app.atsMatchScore || 94}%</span>
                          </div>

                          {/* View Resume & Full Applicant Details Button */}
                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/20 active:scale-95"
                            title="Inspect full candidate details and formatted ATS resume"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Resume & Details</span>
                          </button>

                          {/* Quick Admin Decision Actions */}
                          {app.status !== 'SHORTLISTED' && (
                            <button
                              onClick={() => handleUpdateApplicationStatus(app.id, 'SHORTLISTED')}
                              className="px-3 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1 border border-emerald-800/40 active:scale-95"
                              title="Shortlist this candidate"
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
          )}

          {/* SUBVIEW 2: REGISTERED USER ACCOUNTS */}
          {resumeSubView === 'users' && (
            <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-yellow-400" />
                    <span>Registered Website Users & Candidate Accounts ({platformUsers.length})</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Directory of candidate and user accounts registered on JobProof.
                  </p>
                </div>
                <button
                  onClick={fetchUsers}
                  className="p-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-gray-300 border border-gray-800 transition"
                  title="Refresh users"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {platformUsersLoading ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-yellow-400" />
                  Loading registered user profiles...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#18181c] text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-800">
                      <tr>
                        <th className="px-4 py-3 rounded-l-xl">User & Account Details</th>
                        <th className="px-4 py-3">Platform Role</th>
                        <th className="px-4 py-3">Registered Date</th>
                        <th className="px-4 py-3 text-right rounded-r-xl">Clearance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {platformUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-800/30 transition">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-yellow-400/20 text-yellow-400 border border-yellow-500/30 flex items-center justify-center font-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <p className="font-bold text-white">{user.name}</p>
                                <p className="text-[11px] text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              user.role === 'ROLE_ADMIN'
                                ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
                                : user.role === 'ROLE_EMPLOYEE'
                                ? 'bg-yellow-400/10 border border-yellow-500/30 text-yellow-400'
                                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                            }`}>
                              {user.role || 'ROLE_USER'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-gray-400">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Active Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          VIEW TAB 3: AI VACANCIES & STAGING QUEUE
         ========================================================= */}
      {adminTab === 'vacancies' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Vacancies Staging Header */}
          <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-yellow-400" />
                  <span>AI Discovered Listings Awaiting Admin Live Approval ({filteredVacancies.length})</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Inspect crawler staging queue from Greenhouse, Lever, and Ashby. Grant live permission to publish positions with verified trust badges.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTriggerDiscovery}
                  disabled={discovering}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition shadow-md shadow-yellow-500/20 active:scale-95 disabled:opacity-60"
                >
                  <Sparkles className={`w-4 h-4 ${discovering ? 'animate-spin' : ''}`} />
                  <span>{discovering ? 'Crawling ATS Feeds...' : '⚡ Run AI Discovery Agent'}</span>
                </button>

                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter by company, title..."
                    value={vacancySearch}
                    onChange={e => setVacancySearch(e.target.value)}
                    className="bg-[#18181c] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 w-44 sm:w-56"
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

            {vacanciesLoading ? (
              <div className="py-12 text-center text-gray-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-yellow-400" />
                <p className="text-xs font-semibold">Loading AI-discovered vacancies...</p>
              </div>
            ) : filteredVacancies.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-3 bg-[#18181c] rounded-2xl border border-dashed border-gray-800">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                <h4 className="text-sm font-bold text-white">All Vacancies Processed</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  No pending crawler listings currently awaiting approval. Click "Run AI Discovery Agent" above to fetch fresh job openings from target employer boards.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVacancies.map((job) => {
                  const compName = job.company?.name || 'Target Employer';
                  const trustScore = job.trustScore || 95;

                  return (
                    <div
                      key={job.id}
                      className="p-5 rounded-2xl bg-[#18181c] border border-gray-800 hover:border-gray-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm"
                    >
                      <div className="space-y-2 max-w-2xl">
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

                        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                          <span className="font-bold text-gray-200">🏢 {compName}</span>
                          <span>•</span>
                          <span>📍 {job.location || 'Remote'}</span>
                          <span>•</span>
                          <span>💼 {job.employmentType || 'Full-time'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center">
                          <span className="text-[10px] uppercase font-bold text-emerald-500">AI Trust</span>
                          <p className="text-sm font-black">{trustScore}%</p>
                        </div>

                        <button
                          onClick={() => setEditingJob(job)}
                          className="px-3.5 py-2.5 rounded-xl bg-[#222228] hover:bg-gray-800 text-gray-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-gray-800"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Review & Edit</span>
                        </button>

                        <button
                          onClick={() => handleGrantPermission(job)}
                          className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/20 active:scale-95"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Grant Permission</span>
                        </button>

                        <button
                          onClick={() => handleRejectVacancy(job.id, job.title)}
                          className="p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 transition flex items-center justify-center border border-rose-800/40 active:scale-95"
                          title="Discard listing"
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

      {/* =========================================================
          MODALS
         ========================================================= */}
      {/* 1. EDIT & GIVE PERMISSIONS MODAL */}
      {editingPermissionsUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#222228] border border-yellow-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
                  <Key className="w-3.5 h-3.5" />
                  <span>Author Authorization Granted</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Give Permissions: <span className="text-yellow-400">{editingPermissionsUser.name}</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Authorized by Admin Author: <span className="text-white font-bold">{currentUser?.name || 'Alex Vance'}</span>
                </p>
              </div>

              <button
                onClick={() => setEditingPermissionsUser(null)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1 text-xs">
              {allAvailablePermissions.map((perm) => {
                const currentPerms = editingPermissionsUser.permissions || [];
                const isGranted = currentPerms.includes(perm.id);

                return (
                  <div
                    key={perm.id}
                    onClick={() => {
                      const updated = isGranted
                        ? currentPerms.filter(p => p !== perm.id)
                        : [...currentPerms, perm.id];
                      setEditingPermissionsUser({
                        ...editingPermissionsUser,
                        permissions: updated
                      });
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                      isGranted
                        ? 'bg-yellow-400/10 border-yellow-500/50 text-white'
                        : 'bg-[#18181c] border-gray-800 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <span className={isGranted ? 'text-yellow-400' : 'text-gray-500'}>
                          {isGranted ? <CheckCircle2 className="w-4 h-4 text-yellow-400" /> : <Lock className="w-4 h-4" />}
                        </span>
                        <span>{perm.label}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{perm.desc}</p>
                    </div>

                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap flex-shrink-0 ${
                      isGranted ? 'bg-yellow-400 text-gray-950 font-black' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {isGranted ? 'GRANTED' : 'REVOKED'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setEditingPermissionsUser(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 font-bold hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSavePermissions(editingPermissionsUser, editingPermissionsUser.permissions || [])}
                className="px-6 py-2.5 rounded-xl bg-yellow-400 text-gray-950 font-extrabold hover:bg-yellow-300 transition shadow-lg shadow-yellow-500/20 active:scale-95"
              >
                Save & Grant Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEPLOY USER MODAL */}
      {showDeployModal && (
        <DeployUserModal
          initialRole={deployInitialRole}
          onClose={() => setShowDeployModal(false)}
          onUserDeployed={(newUsers) => {
            setTeamMembers(prev => [...newUsers, ...prev]);
            fetchUsers();
            setActionNotice({
              type: 'success',
              msg: `Successfully deployed ${newUsers.length} team account(s) by Author ${currentUser?.name || 'Admin'}!`
            });
            setTimeout(() => setActionNotice(null), 5000);
          }}
        />
      )}

      {/* 2.5 PERSONNEL FULL DETAILS DOSSIER MODAL */}
      {selectedMemberForDetails && (
        <PersonnelDetailModal
          member={selectedMemberForDetails}
          onClose={() => setSelectedMemberForDetails(null)}
          onEditPermissions={(u) => {
            setSelectedMemberForDetails(null);
            setEditingPermissionsUser(u);
          }}
          onRevokeAccess={(u) => {
            setSelectedMemberForDetails(null);
            handleDeleteUser(u);
          }}
        />
      )}

      {/* 3. APPLICANT RESUME & DETAILS MODAL */}
      {selectedApplication && (
        <ApplicantResumeModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusUpdated={(updated) => {
            setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
            setActionNotice({
              type: 'success',
              msg: `Candidate status updated for ${updated.applicantName}.`
            });
            setTimeout(() => setActionNotice(null), 4000);
          }}
        />
      )}

      {/* 4. EDIT & GRANT PERMISSION MODAL FOR AI VACANCIES */}
      {editingJob && (
        <EditAndGrantPermissionModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onGranted={(approvedJob) => {
            setPendingJobs(prev => prev.filter(j => j.id !== approvedJob.id));
            setEditingJob(null);
            setActionNotice({
              type: 'success',
              msg: `Live Permission Granted: "${approvedJob.title}" at ${approvedJob.company?.name || 'Company'} published!`
            });
            setTimeout(() => setActionNotice(null), 4500);
          }}
        />
      )}

    </div>
  );
}
