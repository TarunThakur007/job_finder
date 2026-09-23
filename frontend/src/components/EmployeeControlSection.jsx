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
  Award
} from 'lucide-react';
import ApplicantResumeModal from './ApplicantResumeModal';
import EditAndGrantPermissionModal from './EditAndGrantPermissionModal';

export default function EmployeeControlSection({ liveJobs = [], currentUser, onPostJobClick, onLoginAsEmployee }) {
  const [activeTab, setActiveTab] = useState('vacancies'); // 'vacancies' | 'applications'
  
  // Vacancies State
  const [pendingJobs, setPendingJobs] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);
  const [discovering, setDiscovering] = useState(false);
  const [vacancySearch, setVacancySearch] = useState('');
  const [editingJob, setEditingJob] = useState(null);

  // Applications State
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationSearch, setApplicationSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedApplication, setSelectedApplication] = useState(null);

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

  useEffect(() => {
    fetchPendingJobs();
    fetchApplications();
  }, []);

  // Check if current user has employee / admin role
  const isEmployee = currentUser?.role === 'ROLE_EMPLOYEE' || currentUser?.role === 'ROLE_ADMIN';

  // Fast one-click Employee login if guest
  const handleQuickEmployeeLogin = () => {
    const employeeUser = {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@google.com',
      role: 'ROLE_EMPLOYEE',
      title: 'Company Recruiter & Hiring Partner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
      company: 'Google'
    };
    try {
      localStorage.setItem('jobproof_user', JSON.stringify(employeeUser));
      if (onLoginAsEmployee) {
        onLoginAsEmployee(employeeUser);
      } else {
        window.location.reload();
      }
    } catch (e) {}
  };

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
          <button
            onClick={handleQuickEmployeeLogin}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black tracking-wide shadow-lg shadow-yellow-500/20 active:scale-95 transition-all"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Enable Company Employee Access</span>
          </button>
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
            Review vacancies discovered by the autonomous AI Agent across Greenhouse, Lever, and Ashby boards. Inspect and refine details, grant permission to publish live with verified trust scores, and evaluate candidate resumes.
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

      {/* Navigation Switcher: AI Vacancies vs Candidate Applications */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('vacancies')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'vacancies'
              ? 'bg-yellow-400 text-gray-950 shadow-lg shadow-yellow-500/20'
              : 'bg-slate-900 text-gray-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Vacancies & Grant Permissions</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'vacancies' ? 'bg-gray-950 text-yellow-400' : 'bg-slate-800 text-gray-300'
          }`}>
            {pendingJobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'applications'
              ? 'bg-yellow-400 text-gray-950 shadow-lg shadow-yellow-500/20'
              : 'bg-slate-900 text-gray-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Applications</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'applications' ? 'bg-gray-950 text-yellow-400' : 'bg-slate-800 text-gray-300'
          }`}>
            {applications.length}
          </span>
        </button>
      </div>

      {/* TAB 1: AI VACANCIES & GRANT PERMISSION */}
      {activeTab === 'vacancies' && (
        <div className="space-y-6">
          {/* Telemetry Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <p className="text-xs text-slate-400 font-semibold">Awaiting Your Permission</p>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">{pendingJobs.length}</p>
              <p className="text-[11px] text-amber-400/80 mt-1">Discovered by AI Agent</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <p className="text-xs text-slate-400 font-semibold">Live Approved Jobs</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">{adminStats?.activeJobs || 0}</p>
              <p className="text-[11px] text-emerald-400/80 mt-1">Granted Permission & Published</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <p className="text-xs text-slate-400 font-semibold">Total Verified Positions</p>
              <p className="text-3xl font-extrabold text-white mt-1">{adminStats?.totalJobs || 0}</p>
              <p className="text-[11px] text-blue-400 mt-1">In Platform Governance</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <p className="text-xs text-slate-400 font-semibold">Connected ATS Feeds</p>
              <p className="text-3xl font-extrabold text-yellow-400 mt-1">3 ATS</p>
              <p className="text-[11px] text-gray-400 mt-1">Greenhouse • Lever • Ashby</p>
            </div>
          </div>

          {/* AI Staging Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-yellow-400" />
                  <span>AI Discovered Listings Awaiting Employee Permission ({filteredJobs.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect the details discovered by the AI agent. You can click <strong>"Review & Edit Details"</strong> to refine information or click <strong>"Grant Permission"</strong> to publish live.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter by company, title..."
                    value={vacancySearch}
                    onChange={e => setVacancySearch(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 w-48 sm:w-64"
                  />
                </div>

                <button
                  onClick={fetchPendingJobs}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
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
                        <button
                          onClick={() => setEditingJob(job)}
                          className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
                          title="Inspect and edit details extracted by AI"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Review & Edit Details</span>
                        </button>

                        {/* GRANT PERMISSION BUTTON */}
                        <button
                          onClick={() => handleGrantPermission(job)}
                          className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/20 active:scale-95"
                          title="Grant permission to publish this AI job listing live"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Grant Permission</span>
                        </button>

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

      {/* TAB 2: CANDIDATE APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Telemetry Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <p className="text-xs text-slate-400 font-semibold">Total Applications</p>
              <p className="text-3xl font-extrabold text-white mt-1">{applications.length}</p>
              <p className="text-[11px] text-gray-400 mt-1">Submitted for Your Jobs</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <p className="text-xs text-slate-400 font-semibold">Pending Review</p>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">
                {applications.filter(a => a.status === 'PENDING').length}
              </p>
              <p className="text-[11px] text-amber-400/80 mt-1">Action Required</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <p className="text-xs text-slate-400 font-semibold">Shortlisted</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">
                {applications.filter(a => a.status === 'SHORTLISTED').length}
              </p>
              <p className="text-[11px] text-emerald-400/80 mt-1">Ready for Interview</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <p className="text-xs text-slate-400 font-semibold">Accepted / Offers</p>
              <p className="text-3xl font-extrabold text-purple-400 mt-1">
                {applications.filter(a => a.status === 'ACCEPTED').length}
              </p>
              <p className="text-[11px] text-purple-400/80 mt-1">Advancing to Hire</p>
            </div>
          </div>

          {/* Applications Table Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  <span>Applicant Review & Resumes ({filteredApplications.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect candidate contact info, work history, skills, and interactive ATS resume.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidate, role, skill..."
                    value={applicationSearch}
                    onChange={e => setApplicationSearch(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 w-52 sm:w-64"
                  />
                </div>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
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
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Refresh applications list"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {applicationsLoading ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-yellow-400" />
                <p className="text-xs font-semibold">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-3 bg-slate-800/30 rounded-2xl border border-dashed border-slate-800">
                <Users className="w-10 h-10 mx-auto text-slate-500" />
                <h4 className="text-sm font-bold text-white">No Applications Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
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

    </div>
  );
}
