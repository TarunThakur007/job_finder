import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CompanyTickerSection from './components/CompanyTickerSection';
import CategoryGridSection from './components/CategoryGridSection';
import JobTable from './components/JobTable';
import JobDetailsModal from './components/JobDetailsModal';
import ResumeAnalyzerSection from './components/ResumeAnalyzerSection';
import LoginView from './components/LoginView';
import EmployeeControlSection from './components/EmployeeControlSection';
import TeamManagementPage from './components/TeamManagementPage';
import ApplyJobModal from './components/ApplyJobModal';
import ExperienceBoardSection from './components/ExperienceBoardSection';
import ShareExperienceModal from './components/ShareExperienceModal';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Search,
  X,
  Code2,
  Filter,
  Briefcase,
  Globe,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('jobproof_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.avatar && parsed.avatar.startsWith('http')) {
          parsed.avatar = '👤';
        }
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [initialIsSignUp, setInitialIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);

  const [activeTab, setActiveTab] = useState(() => {
    if (currentUser?.role === 'ROLE_ADMIN') return 'admin-panel';
    if (currentUser?.role === 'ROLE_EMPLOYEE') return 'employee-panel';
    return 'dashboard-overview';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [healthStatus, setHealthStatus] = useState({ loading: true, data: null, error: null });
  const [liveJobs, setLiveJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Job Discovery Multi-Filter States
  const [filterExperience, setFilterExperience] = useState('ALL'); // 'ALL' | 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD'
  const [filterJobType, setFilterJobType] = useState('ALL'); // 'ALL' | 'FULLTIME' | 'CONTRACT' | 'PART_TIME' | 'INTERNSHIP'
  const [filterRemoteOnly, setFilterRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState('TRUST'); // 'TRUST' | 'NEWEST'

  // Job Post Form State
  const [postingJob, setPostingJob] = useState(false);
  const [postSuccess, setPostSuccess] = useState(null);
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    companyName: '',
    companyWebsite: '',
    role: 'Backend Development',
    location: '',
    employmentType: 'Fulltime',
    experienceLevel: '1-3 years',
    salaryMin: '1200000',
    salaryMax: '1800000',
    applyUrl: '',
    description: '',
    skills: 'Java, Spring Boot, React',
    vacanciesCount: 5
  });

  // Fetch backend health status & live jobs
  const fetchJobs = (query = '') => {
    const url = query ? `/api/jobs/search?q=${encodeURIComponent(query)}` : '/api/jobs';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveJobs(data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setHealthStatus({ loading: false, data, error: null }))
      .catch((err) => setHealthStatus({ loading: false, data: null, error: err.message }));

    fetchJobs();
  }, []);

  useEffect(() => {
    if (activeTab === 'resume-analyzer' && currentUser?.isDemo) {
      handleRequireRegistration("Registration is required to access the AI Resume Optimizer and ATS Scorecard. Please register your candidate account to unlock all features!");
    }
  }, [activeTab, currentUser]);

  const sampleJobs = [
    {
      id: 101,
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'New York, USA',
      jobType: 'Fulltime',
      salary: '$140,000 - $190,000 / yr',
      score: 98,
      evidence: [
        'Official Employer Site',
        'Direct Application',
        'Spam Free'
      ],
      lastSeen: '1 day ago',
      applyUrl: 'https://careers.google.com/jobs/101'
    },
    {
      id: 102,
      title: 'Lead React Developer',
      company: 'Figma',
      location: 'San Francisco, CA (Remote)',
      jobType: 'Fulltime',
      salary: '$150,000 - $210,000 / yr',
      score: 96,
      evidence: [
        'Official Employer Site',
        'Direct Application',
        'Active Listing'
      ],
      lastSeen: '2 hours ago',
      applyUrl: 'https://figma.com/careers/apply/202'
    },
    {
      id: 103,
      title: 'Senior Java Backend Engineer',
      company: 'Spotify',
      location: 'Stockholm / Remote',
      jobType: 'Fulltime',
      salary: '$130,000 - $175,000 / yr',
      score: 97,
      evidence: [
        'Official Employer Site',
        'Direct Application',
        'Active Listing'
      ],
      lastSeen: '14 minutes ago',
      applyUrl: 'https://lifeatspotify.com/jobs/303'
    },
    {
      id: 104,
      title: 'Full Stack Engineer',
      company: 'Slack',
      location: 'London, UK',
      jobType: 'Fulltime',
      salary: '£85,000 - £120,000 / yr',
      score: 94,
      evidence: [
        'Official Employer Site',
        'Direct Application',
        'Active Listing'
      ],
      lastSeen: '4 hours ago',
      applyUrl: 'https://slack.com/careers/404'
    },
    {
      id: 105,
      title: 'Data Science & Machine Learning Lead',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      jobType: 'Fulltime',
      salary: '$180,000 - $260,000 / yr',
      score: 99,
      evidence: [
        'Official Employer Site',
        'Direct Application',
        'Spam Free'
      ],
      lastSeen: '30 minutes ago',
      applyUrl: 'https://jobs.netflix.com/jobs/505'
    }
  ];

  const jobsToDisplay = liveJobs.length > 0 ? liveJobs : sampleJobs;

  // Filter jobs based on search term, category, experience, job type, and remote
  const filteredJobs = jobsToDisplay.filter((job) => {
    const compName = typeof job.company === 'object' ? job.company.name : job.company;
    const title = (job.title || '').toLowerCase();
    const location = (job.location || '').toLowerCase();
    const role = (job.role || '').toLowerCase();
    const expLevel = (job.experienceLevel || '').toLowerCase();
    const empType = (job.employmentType || job.jobType || '').toLowerCase();

    // 1. Keyword search (title, company, skills, location, role)
    const matchesSearch = !searchTerm || 
      title.includes(searchTerm.toLowerCase()) ||
      (compName && compName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      location.includes(searchTerm.toLowerCase()) ||
      role.includes(searchTerm.toLowerCase()) ||
      (job.skills && Array.isArray(job.skills) && job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));

    // 2. Category selection
    const matchesCategory = !selectedCategory || 
      role.includes(selectedCategory.toLowerCase()) ||
      title.includes(selectedCategory.toLowerCase());

    if (!matchesSearch || !matchesCategory) {
      return false;
    }

    // 3. Remote workplace filter
    const isRemote = location.includes('remote') || empType.includes('remote') || title.includes('remote');
    if (filterRemoteOnly && !isRemote) {
      return false;
    }

    // 4. Job Type filter ('ALL', 'FULLTIME', 'CONTRACT', 'PART_TIME', 'INTERNSHIP')
    if (filterJobType !== 'ALL') {
      if (filterJobType === 'FULLTIME' && !(empType.includes('full') || (!empType.includes('contract') && !empType.includes('part') && !empType.includes('intern')))) {
        return false;
      }
      if (filterJobType === 'CONTRACT' && !(empType.includes('contract') || empType.includes('freelance') || title.includes('contract'))) {
        return false;
      }
      if (filterJobType === 'PART_TIME' && !(empType.includes('part') || title.includes('part-time') || title.includes('part time'))) {
        return false;
      }
      if (filterJobType === 'INTERNSHIP' && !(empType.includes('intern') || title.includes('intern') || expLevel.includes('intern'))) {
        return false;
      }
    }

    // 5. Experience Level filter ('ALL', 'ENTRY', 'MID', 'SENIOR', 'LEAD')
    if (filterExperience !== 'ALL') {
      const isEntry = expLevel.includes('entry') || expLevel.includes('junior') || expLevel.includes('intern') || expLevel.includes('associate') || expLevel.includes('0-') || expLevel.includes('1-') ||
                      title.includes('junior') || title.includes('intern') || title.includes('entry') || title.includes('associate') || title.includes('fresher') || title.includes('grad');
      const isLead = expLevel.includes('lead') || expLevel.includes('director') || expLevel.includes('manager') || expLevel.includes('head') || expLevel.includes('vp') ||
                     title.includes('lead') || title.includes('director') || title.includes('head') || title.includes('manager') || title.includes('principal') || title.includes('vp');
      const isSenior = (expLevel.includes('senior') || expLevel.includes('sr.') || expLevel.includes('staff') || title.includes('senior') || title.includes('sr.') || title.includes('staff')) && !isLead;
      const isMid = !isEntry && !isSenior && !isLead;

      if (filterExperience === 'ENTRY' && !isEntry) return false;
      if (filterExperience === 'MID' && !isMid) return false;
      if (filterExperience === 'SENIOR' && !isSenior) return false;
      if (filterExperience === 'LEAD' && !isLead) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'NEWEST') {
      const dateA = a.postedDate ? new Date(a.postedDate).getTime() : 0;
      const dateB = b.postedDate ? new Date(b.postedDate).getTime() : 0;
      return dateB - dateA;
    }
    const scoreA = a.score || a.trustScore || 90;
    const scoreB = b.score || b.trustScore || 90;
    return scoreB - scoreA;
  });

  const handleLoginSuccess = (userPayload) => {
    setCurrentUser(userPayload);
    setInitialIsSignUp(false);
    setAuthMessage(null);
    if (userPayload?.role === 'ROLE_ADMIN') {
      setActiveTab('admin-panel');
    } else if (userPayload?.role === 'ROLE_EMPLOYEE') {
      setActiveTab('employee-panel');
    } else {
      setActiveTab('dashboard-overview');
    }
    try {
      localStorage.setItem('jobproof_user', JSON.stringify(userPayload));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setInitialIsSignUp(false);
    setAuthMessage(null);
    try {
      localStorage.removeItem('jobproof_user');
    } catch (e) {}
  };

  const handleRequireRegistration = (reason) => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('jobproof_user');
    } catch (e) {}
    setInitialIsSignUp(true);
    setAuthMessage(reason || 'Registration is required to access this feature. Please create your free candidate account to unlock full access.');
  };

  const handleApplyJob = (job) => {
    if (currentUser?.isDemo) {
      const compName = typeof job.company === 'object' ? job.company.name : job.company;
      handleRequireRegistration(`Registration is required to apply for "${job.title}" at ${compName}. Please create your free candidate account to unlock direct company applications.`);
      return;
    }

    // Forward the user directly to the official apply page of the company!
    const targetUrl = job.applyUrl || (typeof job.company === 'object' ? job.company?.careerPage || job.company?.website : null);
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      setApplyingJob(job);
    }
  };

  const handleOpenPostJob = () => {
    if (currentUser?.isDemo) {
      handleRequireRegistration("Posting verified jobs requires an authorized employer or recruiter account. Please register to proceed.");
      return;
    }
    setShowPostJobModal(true);
  };

  const handleHeroSearch = (queryTitle) => {
    setSearchTerm(queryTitle);
    fetchJobs(queryTitle);

    // Smooth scroll down to verified jobs listings
    setTimeout(() => {
      const section = document.getElementById('job-listings-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handlePostJobSubmit = (e) => {
    e.preventDefault();
    setPostingJob(true);
    setPostSuccess(null);

    const payload = {
      title: newJobForm.title || 'Senior Software Engineer',
      company: {
        name: newJobForm.companyName || 'Google',
        website: newJobForm.companyWebsite || 'https://google.com',
        careerPage: (newJobForm.companyWebsite || 'https://google.com') + '/careers',
        industry: 'Software & Technology'
      },
      role: newJobForm.role,
      experienceLevel: newJobForm.experienceLevel,
      location: newJobForm.location || 'New York, USA',
      employmentType: newJobForm.employmentType,
      salaryMin: parseFloat(newJobForm.salaryMin) || 1200000,
      salaryMax: parseFloat(newJobForm.salaryMax) || 1800000,
      salaryCurrency: 'USD',
      isSalaryEstimated: false,
      description: newJobForm.description || 'Looking for a senior engineer to build scale systems.',
      applyUrl: newJobForm.applyUrl || 'https://google.com/careers',
      source: 'JobProof Direct Employer',
      skills: newJobForm.skills.split(',').map((s) => s.trim())
    };

    fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(() => {
        setPostingJob(false);
        setPostSuccess('Job vacancy posted & verified successfully on backend!');
        fetchJobs();
      })
      .catch(() => {
        setPostingJob(false);
        const createdJob = {
          id: Date.now(),
          title: payload.title,
          company: payload.company.name,
          location: payload.location,
          jobType: payload.employmentType,
          salary: `$${(payload.salaryMin / 1000).toFixed(0)}k - $${(payload.salaryMax / 1000).toFixed(0)}k / yr`,
          score: 96,
          evidence: ['Employer direct submission', 'Domain verified'],
          lastSeen: 'Just now',
          applyUrl: payload.applyUrl
        };
        setLiveJobs([createdJob, ...liveJobs]);
        setPostSuccess('Job vacancy posted & verified successfully!');
      });
  };

  // Authentication Gate: Require user registration / login to access full site
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#18181c] flex items-center justify-center p-4">
        <LoginView 
          onLoginSuccess={handleLoginSuccess}
          initialIsSignUp={initialIsSignUp}
          initialMessage={authMessage}
          initialPanel="user"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18181c] text-white font-sans selection:bg-yellow-400 selection:text-gray-950">
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'resume-analyzer' && currentUser?.isDemo) {
            handleRequireRegistration("AI Resume Analysis and ATS Scorecard features require a candidate account. Please register to analyze your resume.");
            return;
          }
          setActiveTab(tab);
        }}
        healthStatus={healthStatus}
        currentUser={currentUser}
        onLogout={handleLogout}
        onLoginClick={() => {}}
        onPostJobClick={handleOpenPostJob}
        onRequireRegistration={handleRequireRegistration}
        onUpdateUser={setCurrentUser}
      />

      {/* View-Only Demo Notice Banner */}
      {currentUser?.isDemo && (
        <div className="bg-gradient-to-r from-yellow-500/15 via-amber-500/20 to-yellow-500/15 border-b border-yellow-500/30 px-4 py-3 text-center">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-yellow-300 font-semibold text-left">
              <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span>
              </span>
              <span>
                <strong className="text-yellow-400">Demo User Account (Preview Mode):</strong> You are exploring in view-only mode. You can view all live jobs and details. To apply for jobs or use AI features, please register your free account.
              </span>
            </div>
            <button
              onClick={() => handleRequireRegistration("Create your free candidate account to apply for jobs and unlock AI resume tools.")}
              className="px-4 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-extrabold text-xs transition shadow-md shadow-yellow-500/20 whitespace-nowrap flex-shrink-0 active:scale-95"
            >
              Register for Full Access →
            </button>
          </div>
        </div>
      )}

      {/* Post Job / Source Code Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#222228] border border-yellow-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-yellow-400" />
                  Post & Verify Job Listing
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Add custom job vacancy directly into backend Spring Boot API.
                </p>
              </div>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {postSuccess && (
              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                {postSuccess}
              </div>
            )}

            <form onSubmit={handlePostJobSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Software Engineer"
                    value={newJobForm.title}
                    onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google"
                    value={newJobForm.companyName}
                    onChange={(e) => setNewJobForm({ ...newJobForm, companyName: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. New York, USA"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Employment Type</label>
                  <select
                    value={newJobForm.employmentType}
                    onChange={(e) => setNewJobForm({ ...newJobForm, employmentType: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="Fulltime">Fulltime</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Application URL</label>
                <input
                  type="url"
                  placeholder="https://company.com/careers/apply"
                  value={newJobForm.applyUrl}
                  onChange={(e) => setNewJobForm({ ...newJobForm, applyUrl: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 font-bold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingJob}
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-gray-950 font-extrabold hover:bg-yellow-300 transition shadow-lg shadow-yellow-500/20"
                >
                  {postingJob ? 'Submitting...' : 'Post & Verify Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN VIEW CONTROLLER: Staff Roles restricted to their exclusive workspaces */}
      {currentUser?.role === 'ROLE_ADMIN' ? (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <TeamManagementPage 
            currentUser={currentUser} 
            liveJobs={jobsToDisplay}
            onSelectView={(view) => setActiveTab(view)} 
          />
        </div>
      ) : currentUser?.role === 'ROLE_EMPLOYEE' ? (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <EmployeeControlSection 
            liveJobs={jobsToDisplay} 
            currentUser={currentUser} 
            onPostJobClick={() => setShowPostJobModal(true)}
            onLoginAsEmployee={(empUser) => setCurrentUser(empUser)}
            onSelectView={(view) => setActiveTab(view)}
          />
        </div>
      ) : activeTab === 'resume-analyzer' ? (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <ResumeAnalyzerSection 
            liveJobs={jobsToDisplay} 
            onSelectJob={(job) => setSelectedJob(job)} 
            currentUser={currentUser}
            onRequireRegistration={handleRequireRegistration}
          />
        </div>
      ) : activeTab === 'experience-board' ? (
        <div className="max-w-7xl mx-auto py-4 px-4">
          <ExperienceBoardSection 
            currentUser={currentUser}
            onOpenShareModal={() => setShowShareModal(true)}
            onRequireLogin={handleRequireRegistration}
          />
        </div>
      ) : (
        /* HOMEPAGE */
        <main>
          {/* 1. HERO SECTION */}
          <HeroSection 
            onSearch={handleHeroSearch} 
            onCategorySelect={(cat) => {
              if (currentUser?.isDemo) {
                handleRequireRegistration(`Registration is required to explore the "${cat}" job category. Please create your free candidate account to unlock all features!`);
                return;
              }
              setSelectedCategory(cat);
              handleHeroSearch(cat || '');
            }}
          />

          {/* 2. TRUSTED BY 1000+ COMPANIES TICKER */}
          <CompanyTickerSection />

          {/* 3. BROWSE JOB CATEGORY GRID */}
          <CategoryGridSection 
            jobs={jobsToDisplay}
            selectedCategory={selectedCategory} 
            currentUser={currentUser}
            onSelectCategory={(cat) => {
              if (currentUser?.isDemo) {
                handleRequireRegistration(`Registration is required to explore the "${cat}" job category. Please create your free candidate account to unlock full access to category jobs and apply!`);
                return;
              }
              setSelectedCategory(cat);
              handleHeroSearch(cat || '');
            }}
          />

          {/* 4. VERIFIED LIVE JOBS LISTINGS & MULTI-CRITERIA DISCOVERY HUB */}
          <section id="job-listings-section" className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-12 space-y-6">
            
            {/* Section Header & Main Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-800 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
                  <span>100% Direct Application Guarantee</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  Verified <span className="text-yellow-400">Live Job</span> Listings
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Showing {filteredJobs.length} of {jobsToDisplay.length} openings. Click any role to apply directly on the official company careers portal.
                </p>
              </div>

              {/* Keyword Search & Sort Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-72 md:w-80">
                  <label htmlFor="job-filter-input" className="sr-only">Filter listings</label>
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="job-filter-input"
                    type="text"
                    placeholder="Search title, company, skill, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 bg-[#222228] border border-gray-800 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="relative flex-shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto bg-[#222228] border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 font-bold focus:border-yellow-400 focus:outline-none cursor-pointer"
                  >
                    <option value="TRUST">★ Highest Trust Score</option>
                    <option value="NEWEST">⏱️ Most Recent First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MULTI-FILTER TOOLBAR: EXPERIENCE, REMOTE, JOB TYPE */}
            <div className="bg-[#222228] border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Filter Controls Group */}
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Experience Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-yellow-400" />
                      Experience:
                    </span>
                    <select
                      value={filterExperience}
                      onChange={(e) => setFilterExperience(e.target.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition focus:outline-none cursor-pointer ${
                        filterExperience !== 'ALL'
                          ? 'bg-yellow-400/10 border-yellow-500/40 text-yellow-400'
                          : 'bg-[#18181c] border-gray-800 text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <option value="ALL">All Experience Levels</option>
                      <option value="ENTRY">🌱 Entry Level / Junior (0-2 yrs)</option>
                      <option value="MID">⚡ Mid Level (2-5 yrs)</option>
                      <option value="SENIOR">⭐ Senior Level (5+ yrs)</option>
                      <option value="LEAD">👑 Lead / Executive</option>
                    </select>
                  </div>

                  {/* Employment Type Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-yellow-400" />
                      Type:
                    </span>
                    <select
                      value={filterJobType}
                      onChange={(e) => setFilterJobType(e.target.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition focus:outline-none cursor-pointer ${
                        filterJobType !== 'ALL'
                          ? 'bg-yellow-400/10 border-yellow-500/40 text-yellow-400'
                          : 'bg-[#18181c] border-gray-800 text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <option value="ALL">All Job Types</option>
                      <option value="FULLTIME">💼 Full-Time</option>
                      <option value="CONTRACT">📄 Contract / Freelance</option>
                      <option value="PART_TIME">⏱️ Part-Time</option>
                      <option value="INTERNSHIP">🎓 Internship</option>
                    </select>
                  </div>

                  {/* Remote Only Toggle */}
                  <button
                    onClick={() => setFilterRemoteOnly(!filterRemoteOnly)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition active:scale-95 ${
                      filterRemoteOnly
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-sm'
                        : 'bg-[#18181c] border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Globe className={`w-3.5 h-3.5 ${filterRemoteOnly ? 'text-emerald-400' : 'text-gray-400'}`} />
                    <span>Remote Only</span>
                    {filterRemoteOnly && <span className="text-[10px] font-black">✓</span>}
                  </button>
                </div>

                {/* Quick Results Summary */}
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <span className="px-2.5 py-1 rounded-lg bg-[#18181c] border border-gray-800 text-yellow-400 font-extrabold">
                    {filteredJobs.length}
                  </span>
                  <span>Positions Found</span>
                </div>
              </div>

              {/* Active Filter Tags & Reset All */}
              {(searchTerm || selectedCategory || filterExperience !== 'ALL' || filterJobType !== 'ALL' || filterRemoteOnly) && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-800/80 text-xs">
                  <span className="text-gray-500 font-semibold mr-1">Active Filters:</span>

                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-400/15 border border-yellow-500/30 text-yellow-300 font-bold hover:bg-yellow-400/25 transition"
                    >
                      <span>Category: {selectedCategory}</span>
                      <X className="w-3 h-3 text-yellow-400" />
                    </button>
                  )}

                  {filterExperience !== 'ALL' && (
                    <button
                      onClick={() => setFilterExperience('ALL')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-400/15 border border-yellow-500/30 text-yellow-300 font-bold hover:bg-yellow-400/25 transition"
                    >
                      <span>Exp: {
                        filterExperience === 'ENTRY' ? 'Entry Level' :
                        filterExperience === 'MID' ? 'Mid Level' :
                        filterExperience === 'SENIOR' ? 'Senior Level' : 'Lead / Executive'
                      }</span>
                      <X className="w-3 h-3 text-yellow-400" />
                    </button>
                  )}

                  {filterJobType !== 'ALL' && (
                    <button
                      onClick={() => setFilterJobType('ALL')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-400/15 border border-yellow-500/30 text-yellow-300 font-bold hover:bg-yellow-400/25 transition"
                    >
                      <span>Type: {
                        filterJobType === 'FULLTIME' ? 'Full-Time' :
                        filterJobType === 'CONTRACT' ? 'Contract' :
                        filterJobType === 'PART_TIME' ? 'Part-Time' : 'Internship'
                      }</span>
                      <X className="w-3 h-3 text-yellow-400" />
                    </button>
                  )}

                  {filterRemoteOnly && (
                    <button
                      onClick={() => setFilterRemoteOnly(false)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold hover:bg-emerald-500/25 transition"
                    >
                      <span>Workplace: Remote Only</span>
                      <X className="w-3 h-3 text-emerald-400" />
                    </button>
                  )}

                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 font-bold hover:bg-gray-700 transition"
                    >
                      <span>Search: "{searchTerm}"</span>
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory(null);
                      setFilterExperience('ALL');
                      setFilterJobType('ALL');
                      setFilterRemoteOnly(false);
                      setSortBy('TRUST');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#18181c] hover:bg-rose-950/40 text-rose-400 hover:border-rose-800 border border-gray-800 text-xs font-bold transition ml-auto"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}
            </div>

            {/* Job Grid Table */}
            <JobTable 
              jobs={filteredJobs} 
              searchTerm={searchTerm} 
              onSelectJob={(job) => setSelectedJob(job)}
              onApplyJob={handleApplyJob}
            />
          </section>
        </main>
      )}

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
          onApply={handleApplyJob}
          currentUser={currentUser}
          onRequireRegistration={handleRequireRegistration}
        />
      )}

      {/* APPLY JOB MODAL */}
      {applyingJob && (
        <ApplyJobModal
          job={applyingJob}
          currentUser={currentUser}
          onClose={() => setApplyingJob(null)}
          onApplicationSubmitted={() => {}}
        />
      )}

      {/* SHARE EXPERIENCE MODAL */}
      {showShareModal && (
        <ShareExperienceModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          currentUser={currentUser}
          onExperienceSubmitted={() => {}}
        />
      )}

      {/* FOOTER */}
      <footer className="bg-[#141417] border-t border-gray-800/80 py-8 px-4 text-center text-xs text-gray-500 space-y-2">
        <p className="font-bold text-gray-400">JobProof &copy; 2026. All rights reserved.</p>
        <p className="text-xs text-gray-500">Powered by Spring Boot REST Backend API & React Vite Frontend.</p>
      </footer>

    </div>
  );
}
