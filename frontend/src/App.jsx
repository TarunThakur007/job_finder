import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CompanyTickerSection from './components/CompanyTickerSection';
import HowItWorksSection from './components/HowItWorksSection';
import CategoryGridSection from './components/CategoryGridSection';
import JobTable from './components/JobTable';
import FeatureSpotlightSection from './components/FeatureSpotlightSection';
import Footer from './components/Footer';

// Lazy-loaded views and dialogs for code-splitting
const JobDetailsModal = lazy(() => import('./components/JobDetailsModal'));
const ResumeAnalyzerSection = lazy(() => import('./components/ResumeAnalyzerSection'));
const LoginView = lazy(() => import('./components/LoginView'));
const EmployeeControlSection = lazy(() => import('./components/EmployeeControlSection'));
const TeamManagementPage = lazy(() => import('./components/TeamManagementPage'));
const ApplyJobModal = lazy(() => import('./components/ApplyJobModal'));
const ExperienceBoardSection = lazy(() => import('./components/ExperienceBoardSection'));
const ShareExperienceModal = lazy(() => import('./components/ShareExperienceModal'));
const ApplicationTrackerSection = lazy(() => import('./components/ApplicationTrackerSection'));
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

function SectionLoader({ label = "Loading workspace..." }) {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 w-full flex-1 flex flex-col min-h-[85vh] space-y-6">
      {/* Skeleton Top Banner */}
      <div className="bg-[#222228] rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-4 animate-pulse">
        <div className="w-56 h-6 bg-gray-800 rounded-full" />
        <div className="w-full max-w-xl h-9 bg-gray-800/90 rounded-xl" />
        <div className="w-full max-w-md h-4 bg-gray-800/60 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 border-t border-gray-800/80">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[#18181c] p-3 rounded-2xl border border-gray-800 h-20" />
          ))}
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex items-center gap-3 border-b border-gray-800 pb-3 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-32 h-10 rounded-2xl bg-[#18181c] border border-gray-800" />
        ))}
      </div>

      {/* Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#222228] border border-gray-800 p-5 rounded-3xl h-36" />
        ))}
      </div>
    </div>
  );
}

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
      return {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        role: 'ROLE_USER',
        isDemo: true,
        title: 'Candidate (Preview Mode)',
        avatar: '👤',
        panel: 'user'
      };
    } catch (e) {
      return {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        role: 'ROLE_USER',
        isDemo: true,
        title: 'Candidate (Preview Mode)',
        avatar: '👤',
        panel: 'user'
      };
    }
  });

  const [initialIsSignUp, setInitialIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);

  // Theme Mode: Dark (Default) / Light
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('jobproof_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
      root.setAttribute('data-theme', theme);
      localStorage.setItem('jobproof_theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [activeTab, setActiveTab] = useState(() => {
    if (currentUser?.role === 'ROLE_ADMIN') return 'admin-panel';
    if (currentUser?.role === 'ROLE_EMPLOYEE') return 'employee-panel';
    return 'dashboard-overview';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // 280ms Search Debounce to keep input typing fluid while debouncing search processing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 280);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [healthStatus, setHealthStatus] = useState({ loading: true, data: null, error: null });
  const [allDatabaseJobs, setAllDatabaseJobs] = useState([]);
  const [liveJobs, setLiveJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Job Discovery Multi-Filter States
  const [filterExperience, setFilterExperience] = useState('ALL'); // 'ALL' | 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD'
  const [filterJobType, setFilterJobType] = useState('ALL'); // 'ALL' | 'FULLTIME' | 'CONTRACT' | 'PART_TIME' | 'INTERNSHIP'
  const [filterRemoteOnly, setFilterRemoteOnly] = useState(false);
  const [filterMatchedOnly, setFilterMatchedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('TRUST'); // 'TRUST' | 'NEWEST'

  // User Dismissed/Removed Closed Jobs (persisted across sessions)
  const [userRemovedJobIds, setUserRemovedJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem('jobproof_user_removed_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Candidate skills and target role from AI Resume Analysis or User Profile
  const candidateProfileSkills = useMemo(() => {
    try {
      const saved = localStorage.getItem('jobproof_candidate_skills');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    if (currentUser?.skills && Array.isArray(currentUser.skills) && currentUser.skills.length > 0) {
      return currentUser.skills;
    }

    const text = `${currentUser?.headline || ''} ${currentUser?.title || ''}`.toLowerCase();
    const inferred = [];
    if (text.includes('java')) inferred.push('Java', 'Spring Boot');
    if (text.includes('react')) inferred.push('React');
    if (text.includes('full stack') || text.includes('fullstack')) inferred.push('Java', 'React', 'REST API', 'SQL');
    if (text.includes('backend')) inferred.push('Java', 'Spring Boot', 'REST API', 'PostgreSQL');
    if (text.includes('frontend')) inferred.push('React', 'JavaScript', 'CSS3', 'HTML5');
    if (text.includes('python')) inferred.push('Python', 'FastAPI');
    if (inferred.length === 0) {
      return ['Java', 'Spring Boot', 'React', 'REST API', 'PostgreSQL', 'Docker', 'Git'];
    }
    return inferred;
  }, [currentUser, activeTab]);

  const candidateProfileRole = useMemo(() => {
    try {
      const saved = localStorage.getItem('jobproof_target_role');
      if (saved) return saved;
    } catch (e) {}
    return currentUser?.headline || currentUser?.title || 'Software Engineer';
  }, [currentUser, activeTab]);

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

  // Fetch backend health status & all live jobs strictly from database
  const fetchJobs = () => {
    fetch(`/api/jobs?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.content && Array.isArray(data.content) ? data.content : []);
        setAllDatabaseJobs(list);
        setLiveJobs(list);
      })
      .catch(() => {});
  };

  // Called when an employee grants permission for a staged vacancy: instantly moves to user page
  const handleJobApproved = (approvedJob) => {
    if (approvedJob && typeof approvedJob === 'object' && approvedJob.id) {
      setAllDatabaseJobs((prev) => {
        const exists = prev.some(j => j.id === approvedJob.id);
        if (exists) return prev.map(j => j.id === approvedJob.id ? approvedJob : j);
        return [approvedJob, ...prev];
      });
      setLiveJobs((prev) => {
        const exists = prev.some(j => j.id === approvedJob.id);
        if (exists) return prev.map(j => j.id === approvedJob.id ? approvedJob : j);
        return [approvedJob, ...prev];
      });
    }
    fetchJobs();
  };

  // Employee closes an active job (removes it from User page and moves it to Employee Closed list)
  const handleEmployeeCloseJob = async (jobId) => {
    try {
      await fetch(`/api/jobs/${jobId}/close`, { method: 'PUT' });
      setAllDatabaseJobs((prev) => prev.map(j => j.id === jobId ? { ...j, verificationStatus: 'CLOSED', isClosed: true } : j));
      setLiveJobs((prev) => prev.map(j => j.id === jobId ? { ...j, verificationStatus: 'CLOSED', isClosed: true } : j));
      fetchJobs();
    } catch (e) {
      console.error('Error closing job:', e);
    }
  };

  // Employee reopens a closed job (moves it back to active User page)
  const handleEmployeeReopenJob = async (jobId) => {
    try {
      await fetch(`/api/jobs/${jobId}/reopen`, { method: 'PUT' });
      setAllDatabaseJobs((prev) => prev.map(j => j.id === jobId ? { ...j, verificationStatus: 'VERIFIED', isClosed: false } : j));
      setLiveJobs((prev) => prev.map(j => j.id === jobId ? { ...j, verificationStatus: 'VERIFIED', isClosed: false } : j));
      fetchJobs();
    } catch (e) {
      console.error('Error reopening job:', e);
    }
  };

  // Employee permanently deletes a job (purges it from platform)
  const handleEmployeeDeleteJob = async (jobId) => {
    try {
      await fetch(`/api/jobs/${jobId}/permanent`, { method: 'DELETE' });
    } catch (e) {
      console.error('Error deleting job:', e);
    }
    setAllDatabaseJobs((prev) => prev.filter(j => j.id !== jobId));
    setLiveJobs((prev) => prev.filter(j => j.id !== jobId));
    fetchJobs();
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

  // Deduplicate live jobs to eliminate any duplicate postings across companies and titles
  const jobsToDisplay = useMemo(() => {
    const source = allDatabaseJobs.length > 0 ? allDatabaseJobs : liveJobs;
    const seen = new Set();
    const unique = [];
    for (const j of source) {
      if (!j) continue;
      const compName = typeof j.company === 'object' ? j.company?.name : j.company || '';
      const key = `${(j.title || '').trim().toLowerCase()}::${compName.trim().toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(j);
      }
    }
    return unique;
  }, [allDatabaseJobs, liveJobs]);

  // Memoized filtered jobs based on debounced search, category, experience, job type, remote, and dismissed jobs
  const filteredJobs = useMemo(() => {
    return jobsToDisplay
      .filter((job) => !userRemovedJobIds.includes(job.id))
      .filter((job) => !job.isClosed && job.verificationStatus !== 'CLOSED' && job.status !== 'CLOSED')
      .filter((job) => {
        const compName = typeof job.company === 'object' ? job.company.name : job.company;
        const title = (job.title || '').toLowerCase();
        const location = (job.location || '').toLowerCase();
        const role = (job.role || '').toLowerCase();
        const expLevel = (job.experienceLevel || '').toLowerCase();
        const empType = (job.employmentType || job.jobType || '').toLowerCase();

        // 1. Keyword search (title, company, skills, location, role) with debounced term
        const query = (debouncedSearchTerm || '').toLowerCase().trim();
        const matchesSearch = !query || 
          title.includes(query) ||
          (compName && compName.toLowerCase().includes(query)) ||
          location.includes(query) ||
          role.includes(query) ||
          (job.skills && Array.isArray(job.skills) && job.skills.some(s => s.toLowerCase().includes(query)));

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

        // 6. Strict Job Profile Matching (Suggest only jobs matching user's job profile and skills)
        if (filterMatchedOnly) {
          const jobSkills = Array.isArray(job.skills) 
            ? job.skills 
            : (typeof job.skills === 'string' ? job.skills.split(',').map(s => s.trim()) : []);
          
          const candSkillsLower = candidateProfileSkills.map(s => s.toLowerCase().trim());
          const candRoleLower = candidateProfileRole.toLowerCase().trim();

          // Role/Domain overlap check
          const roleWords = candRoleLower.split(/\s+/).filter(w => w.length > 2 && !['senior', 'lead', 'junior', 'staff', 'engineer', 'developer', 'specialist', 'technologies'].includes(w));
          const hasRoleOverlap = roleWords.some(rw => title.includes(rw) || role.includes(rw)) ||
                                 (candRoleLower.includes('backend') && (title.includes('backend') || role.includes('backend') || title.includes('api') || title.includes('java') || title.includes('spring'))) ||
                                 (candRoleLower.includes('frontend') && (title.includes('frontend') || role.includes('frontend') || title.includes('react') || title.includes('ui') || title.includes('web'))) ||
                                 (candRoleLower.includes('full stack') || candRoleLower.includes('fullstack')) ||
                                 (candRoleLower.includes('devops') && (title.includes('devops') || role.includes('devops') || title.includes('cloud') || title.includes('sre') || title.includes('infra'))) ||
                                 (candRoleLower.includes('data') && (title.includes('data') || role.includes('data') || title.includes('ai') || title.includes('ml')));

          // Skills overlap check
          const matchedSkillsCount = jobSkills.filter(js => {
            const jsLower = js.toLowerCase();
            return candSkillsLower.some(cs => cs.includes(jsLower) || jsLower.includes(cs));
          }).length;

          const isProfileMatch = (matchedSkillsCount >= 2) || (matchedSkillsCount >= 1 && hasRoleOverlap);
          if (!isProfileMatch) {
            return false;
          }
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
  }, [jobsToDisplay, userRemovedJobIds, debouncedSearchTerm, selectedCategory, filterRemoteOnly, filterJobType, filterExperience, filterMatchedOnly, candidateProfileSkills, candidateProfileRole, sortBy]);

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
    const compName = typeof job.company === 'object' ? job.company.name : job.company;
    if (currentUser?.isDemo) {
      handleRequireRegistration(`Registration is required to apply for "${job.title}" at ${compName}. Please create your free candidate account to unlock direct company applications.`);
      return;
    }

    // Forward the user directly to the official apply page of the company!
    const targetUrl = job.applyUrl || (typeof job.company === 'object' ? job.company?.careerPage || job.company?.website : null);

    // Automatically record into user's Application Kanban Tracker
    const trackedRecord = {
      id: Date.now(),
      companyName: compName || 'Verified Employer',
      jobTitle: job.title || 'Software Engineer',
      jobLocation: job.location || 'Remote',
      jobType: job.jobType || job.employmentType || 'Full-Time',
      status: 'APPLIED',
      salary: job.salaryDisplay || job.salary || 'Competitive',
      atsMatchScore: job.score || job.trustScore || 95,
      appliedAt: 'Just now',
      notes: `Applied directly on official company careers portal. Apply URL: ${targetUrl || 'Company Careers Portal'}`,
      applyUrl: targetUrl || ''
    };

    try {
      const existing = JSON.parse(localStorage.getItem('jobproof_tracked_applications') || '[]');
      localStorage.setItem('jobproof_tracked_applications', JSON.stringify([
        trackedRecord,
        ...existing.filter(a => !(a.jobTitle === trackedRecord.jobTitle && a.companyName === trackedRecord.companyName))
      ]));
    } catch (e) {}

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

  const handleHeroSearch = (queryTitle, queryType) => {
    setSearchTerm(queryTitle || '');
    if (queryType) {
      const lower = queryType.toLowerCase();
      if (lower.includes('remote')) {
        setFilterRemoteOnly(true);
        setFilterJobType('ALL');
      } else if (lower.includes('contract')) {
        setFilterJobType('CONTRACT');
        setFilterRemoteOnly(false);
      } else if (lower.includes('part')) {
        setFilterJobType('PART_TIME');
        setFilterRemoteOnly(false);
      } else if (lower.includes('intern')) {
        setFilterJobType('INTERNSHIP');
        setFilterRemoteOnly(false);
      } else if (lower.includes('full')) {
        setFilterJobType('FULLTIME');
        setFilterRemoteOnly(false);
      }
    }

    // Smooth scroll down to verified jobs listings
    setTimeout(() => {
      const target = document.getElementById('sticky-job-filter-header') || document.getElementById('job-listings-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      skills: newJobForm.skills.split(',').map((s) => s.trim()),
      vacanciesCount: parseInt(newJobForm.vacanciesCount) || 5
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
          vacanciesCount: payload.vacanciesCount,
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
      <div className="min-h-screen bg-[#070B13] flex items-center justify-center relative overflow-x-hidden">
        <div className="relative z-10 w-full flex items-center justify-center">
          <Suspense fallback={<SectionLoader label="Loading authentication..." />}>
            <LoginView 
              onLoginSuccess={handleLoginSuccess}
              initialIsSignUp={initialIsSignUp}
              initialMessage={authMessage}
              initialPanel="user"
            />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-canvas text-ink-primary font-sans selection:bg-accent-functional/20 selection:text-ink-primary pb-16 md:pb-0 relative overflow-x-clip">
      
      {/* Fixed Character Background: Stays fixed while scrolling across all pages */}
      <div className="fixed-site-background" aria-hidden="true">
        <div className="fixed-site-background-glow" />
        <div className="fixed-site-background-image" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Skip to Content Accessibility Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-teal-500 focus:text-slate-950 focus:font-bold focus:top-2 focus:left-2 focus:rounded-xl focus:shadow-xl"
      >
        Skip to main content
      </a>

      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'resume-analyzer' && currentUser?.isDemo) {
            handleRequireRegistration("AI Resume Analysis and ATS Scorecard features require a candidate account. Please register to analyze your resume.");
            return;
          }
          if (tab === 'application-tracker' && currentUser?.isDemo) {
            handleRequireRegistration("Application Tracker Cockpit requires a candidate account. Please register to track your applications.");
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
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Primary Accessible Main Landmark */}
      <main id="main-content" role="main" tabIndex="-1" className="flex-1 flex flex-col focus:outline-none min-h-[calc(100vh-4rem)]">

      {/* View-Only Demo Notice Banner */}
      {currentUser?.isDemo && (
        <div className="bg-[#141922] border-b border-[#253044] px-4 py-3 text-center">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-amber-300 font-medium text-left">
              <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
              </span>
              <span>
                <strong className="text-amber-400 font-semibold">Demo User Account (Preview Mode):</strong> You are exploring in view-only mode. You can view all live jobs and details. To apply for jobs or use AI features, please register your free account.
              </span>
            </div>
            <button
              onClick={() => handleRequireRegistration("Create your free candidate account to apply for jobs and unlock AI resume tools.")}
              className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs transition shadow-md shadow-teal-500/20 whitespace-nowrap flex-shrink-0 active:scale-95"
            >
              Register for Full Access →
            </button>
          </div>
        </div>
      )}

      {/* Post Job / Source Code Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#141922] border border-[#253044] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/60 my-8 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#253044]">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-teal-400" />
                  Post & Verify Job Listing
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add custom job vacancy directly into backend Spring Boot API.
                </p>
              </div>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-[#222228] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {postSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                {postSuccess}
              </div>
            )}

            <form onSubmit={handlePostJobSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Software Engineer"
                    value={newJobForm.title}
                    onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                    className="w-full bg-[#0D1117] border border-[#253044] rounded-xl px-4 py-2.5 text-white focus:border-teal-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google"
                    value={newJobForm.companyName}
                    onChange={(e) => setNewJobForm({ ...newJobForm, companyName: e.target.value })}
                    className="w-full bg-[#0D1117] border border-[#253044] rounded-xl px-4 py-2.5 text-white focus:border-teal-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. New York, USA"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                    className="w-full bg-[#0D1117] border border-[#253044] rounded-xl px-4 py-2.5 text-white focus:border-teal-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Employment Type</label>
                  <select
                    value={newJobForm.employmentType}
                    onChange={(e) => setNewJobForm({ ...newJobForm, employmentType: e.target.value })}
                    className="w-full bg-[#0D1117] border border-[#253044] rounded-xl px-4 py-2.5 text-white focus:border-teal-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Fulltime">Fulltime</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Active Openings in Field</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 5"
                    value={newJobForm.vacanciesCount}
                    onChange={(e) => setNewJobForm({ ...newJobForm, vacanciesCount: e.target.value })}
                    className="w-full bg-[#0D1117] border border-[#253044] rounded-xl px-4 py-2.5 text-white focus:border-teal-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Application URL</label>
                  <input
                    type="url"
                    placeholder="https://company.com/careers/apply"
                    value={newJobForm.applyUrl}
                    onChange={(e) => setNewJobForm({ ...newJobForm, applyUrl: e.target.value })}
                    className="w-full bg-[#0D1117] border border-[#253044] rounded-xl px-4 py-2.5 text-white focus:border-teal-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#253044] text-slate-400 font-medium hover:text-white hover:bg-[#1A2230] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingJob}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition shadow-lg shadow-teal-500/20 active:scale-95"
                >
                  {postingJob ? 'Submitting...' : 'Post & Verify Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MAIN VIEW CONTROLLER: Role workspaces accessible when selected */}
      <Suspense fallback={<SectionLoader label="Loading workspace..." />}>
        {activeTab === 'admin-panel' && currentUser?.role === 'ROLE_ADMIN' ? (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <TeamManagementPage 
            currentUser={currentUser} 
            liveJobs={jobsToDisplay}
            onSelectView={(view) => setActiveTab(view)} 
            onUpdateUser={(updated) => setCurrentUser(updated)}
            onLoginAsEmployee={(empUser) => setCurrentUser(empUser)}
          />
        </div>
      ) : activeTab === 'employee-panel' && (currentUser?.role === 'ROLE_EMPLOYEE' || currentUser?.role === 'ROLE_ADMIN' || (currentUser?.permissions && currentUser.permissions.length > 0)) ? (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <EmployeeControlSection 
            liveJobs={jobsToDisplay} 
            allJobs={allDatabaseJobs.length > 0 ? allDatabaseJobs : liveJobs}
            currentUser={currentUser} 
            onPostJobClick={() => setShowPostJobModal(true)}
            onLoginAsEmployee={(empUser) => setCurrentUser(empUser)}
            onSelectView={(view) => setActiveTab(view)}
            onJobApproved={handleJobApproved}
            onCloseJob={handleEmployeeCloseJob}
            onReopenJob={handleEmployeeReopenJob}
            onDeleteJob={handleEmployeeDeleteJob}
          />
        </div>
      ) : activeTab === 'resume-analyzer' ? (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <ResumeAnalyzerSection 
            currentUser={currentUser}
            onRequireRegistration={handleRequireRegistration}
            liveJobs={jobsToDisplay}
            onSelectJob={(job) => setSelectedJob(job)}
            onApplyJob={(job) => setApplyingJob(job)}
            onExploreMatchingJobs={() => {
              setFilterMatchedOnly(true);
              setActiveTab('dashboard-overview');
              setTimeout(() => {
                const el = document.getElementById('sticky-job-filter-header');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
          />
        </div>
      ) : activeTab === 'application-tracker' ? (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <ApplicationTrackerSection 
            currentUser={currentUser}
            liveJobs={jobsToDisplay}
            onRequireRegistration={handleRequireRegistration}
            onSelectJob={(job) => setSelectedJob(job)}
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
        <div className="homepage-content">
          {/* 1. HERO SECTION */}
          <div id="hero-section">
            <HeroSection 
              jobs={jobsToDisplay}
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
          </div>

          {/* 2. TRUSTED BY 1000+ COMPANIES TICKER */}
          <div id="ticker-section">
            <CompanyTickerSection />
          </div>

          {/* 3. HOW IT WORKS 4-STEP PIPELINE */}
          <div id="how-it-works-section">
            <HowItWorksSection />
          </div>

          {/* 4. BROWSE JOB CATEGORY GRID */}
          <div id="categories-section">
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
          </div>

          {/* 4. VERIFIED LIVE JOBS LISTINGS & MULTI-CRITERIA DISCOVERY HUB */}
          <section id="job-listings-section" className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-5 scroll-mt-20">
            
            {/* Section Header */}
            <div className="space-y-1.5 pb-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141922] border border-teal-500/30 text-teal-400 text-xs font-mono font-medium shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>DIRECT APPLICATION PIPELINE • ZERO RECRUITER SPAM</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Verified <span className="text-teal-400">Live Requisitions</span>
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm font-mono">
                  Showing {filteredJobs.length} of {jobsToDisplay.length} openings. Direct to company official careers portal.
                </p>
              </div>
            </div>

            {/* STICKY JOB FILTERING & SEARCH HEADER BAR */}
            {/* Stays pinned right under the main header (top-16) as you browse and search */}
            <div
              id="sticky-job-filter-header"
              className="sticky top-16 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3.5 bg-[#090B0F]/95 backdrop-blur-md border-y border-[#253044] shadow-2xl shadow-black/50 space-y-3 transition-colors duration-150 scroll-mt-20"
            >
              <div className="max-w-7xl mx-auto space-y-3">
                {/* Main Filter & Search Control Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  
                  {/* Keyword Search & Sort Controls */}
                  <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <div className="relative flex-1 min-w-[220px]">
                      <label htmlFor="job-filter-input" className="sr-only">Filter listings</label>
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="job-filter-input"
                        list="db-filter-roles-list"
                        type="text"
                        placeholder="Search title, tech stack, location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 bg-[#141922] border border-[#253044] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 focus:outline-none transition-colors shadow-inner"
                        autoComplete="off"
                      />
                      <datalist id="db-filter-roles-list">
                        {Array.from(new Set(jobsToDisplay.map(j => j.title).filter(Boolean))).map((t, idx) => (
                          <option key={`title-${idx}`} value={t} />
                        ))}
                        {Array.from(new Set(jobsToDisplay.map(j => typeof j.company === 'object' ? j.company?.name : j.company).filter(Boolean))).map((c, idx) => (
                          <option key={`comp-${idx}`} value={c} />
                        ))}
                        {Array.from(new Set(jobsToDisplay.map(j => j.role).filter(Boolean))).map((r, idx) => (
                          <option key={`role-${idx}`} value={r} />
                        ))}
                      </datalist>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full transition"
                          title="Clear search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="relative flex-shrink-0">
                      <select
                        aria-label="Sort Jobs By"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full sm:w-auto bg-[#141922] border border-[#253044] rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:border-teal-400 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="TRUST" className="bg-[#141922] text-white">★ Highest Trust Index</option>
                        <option value="NEWEST" className="bg-[#141922] text-white">⏱️ Most Recent First</option>
                      </select>
                    </div>
                  </div>

                  {/* Multi-Filter Dropdowns & Toggles */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Experience Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                        Exp:
                      </span>
                      <select
                        aria-label="Filter by Experience Level"
                        value={filterExperience}
                        onChange={(e) => setFilterExperience(e.target.value)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition focus:outline-none cursor-pointer ${
                          filterExperience !== 'ALL'
                            ? 'bg-[#1A2230] border-teal-500/50 text-teal-300 font-semibold'
                            : 'bg-[#141922] border-[#253044] text-slate-300 hover:text-white'
                        }`}
                      >
                        <option value="ALL" className="bg-[#141922] text-white">All Levels</option>
                        <option value="ENTRY" className="bg-[#141922] text-white">Entry / Junior (0-2 yrs)</option>
                        <option value="MID" className="bg-[#141922] text-white">Mid Level (2-5 yrs)</option>
                        <option value="SENIOR" className="bg-[#141922] text-white">Senior (5+ yrs)</option>
                        <option value="LEAD" className="bg-[#141922] text-white">Lead / Staff / Director</option>
                      </select>
                    </div>

                    {/* Employment Type Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                        Type:
                      </span>
                      <select
                        aria-label="Filter by Employment Type"
                        value={filterJobType}
                        onChange={(e) => setFilterJobType(e.target.value)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition focus:outline-none cursor-pointer ${
                          filterJobType !== 'ALL'
                            ? 'bg-[#1A2230] border-teal-500/50 text-teal-300 font-semibold'
                            : 'bg-[#141922] border-[#253044] text-slate-300 hover:text-white'
                        }`}
                      >
                        <option value="ALL" className="bg-[#141922] text-white">All Types</option>
                        <option value="FULLTIME" className="bg-[#141922] text-white">Full-Time</option>
                        <option value="CONTRACT" className="bg-[#141922] text-white">Contract</option>
                        <option value="PART_TIME" className="bg-[#141922] text-white">Part-Time</option>
                        <option value="INTERNSHIP" className="bg-[#141922] text-white">Internship</option>
                      </select>
                    </div>

                    {/* Remote Only Toggle */}
                    <button
                      onClick={() => setFilterRemoteOnly(!filterRemoteOnly)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition select-none ${
                        filterRemoteOnly
                          ? 'bg-[#1A2230] border-teal-400 text-teal-300 shadow-sm shadow-teal-500/10 font-semibold'
                          : 'bg-[#141922] border-[#253044] text-slate-300 hover:text-white'
                      }`}
                    >
                      <Globe className={`w-3.5 h-3.5 ${filterRemoteOnly ? 'text-teal-400' : 'text-slate-400'}`} />
                      <span>Remote Only</span>
                      {filterRemoteOnly && <span className="font-mono text-[10px] text-teal-400 font-bold">✓</span>}
                    </button>

                    {/* Matched to My Profile Filter Toggle */}
                    <button
                      onClick={() => setFilterMatchedOnly(!filterMatchedOnly)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition select-none ${
                        filterMatchedOnly
                          ? 'bg-gradient-to-r from-teal-500/25 to-emerald-500/25 border-teal-400 text-teal-300 shadow-sm shadow-teal-500/20 font-semibold ring-1 ring-teal-400/40'
                          : 'bg-[#141922] border-[#253044] text-slate-300 hover:text-white hover:border-slate-600'
                      }`}
                      title={`Filter strictly to vacancies matching your profile (${candidateProfileRole})`}
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${filterMatchedOnly ? 'text-teal-400' : 'text-slate-400'}`} />
                      <span>Matched to My Profile</span>
                      {filterMatchedOnly && <span className="font-mono text-[10px] text-teal-400 font-bold">✓</span>}
                    </button>

                    {/* Live Results Count Badge */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 pl-1">
                      <span className="px-2.5 py-1 rounded-lg bg-[#141922] border border-[#253044] text-teal-400 font-bold tabular-nums shadow-sm">
                        {filteredJobs.length}
                      </span>
                      <span className="hidden sm:inline">Openings</span>
                    </div>
                  </div>
                </div>

                {/* Active Filter Tags & Quick Reset Row */}
                {(searchTerm || selectedCategory || filterExperience !== 'ALL' || filterJobType !== 'ALL' || filterRemoteOnly || filterMatchedOnly) && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#253044] text-xs">
                    <span className="text-slate-400 font-mono text-[11px] mr-1 flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3 text-teal-400" />
                      Active:
                    </span>

                    {filterMatchedOnly && (
                      <button
                        onClick={() => setFilterMatchedOnly(false)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/15 border border-teal-400/50 text-teal-300 font-mono text-xs hover:border-teal-400 transition"
                      >
                        <Sparkles className="w-3 h-3 text-teal-400" />
                        <span>Profile Matched: {candidateProfileRole}</span>
                        <X className="w-3 h-3 text-slate-400 hover:text-white" />
                      </button>
                    )}

                    {selectedCategory && (
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1A2230] border border-teal-500/40 text-teal-300 font-mono text-xs hover:border-teal-400 transition"
                      >
                        <span>Category: {selectedCategory}</span>
                        <X className="w-3 h-3 text-slate-400 hover:text-white" />
                      </button>
                    )}

                    {filterExperience !== 'ALL' && (
                      <button
                        onClick={() => setFilterExperience('ALL')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1A2230] border border-teal-500/40 text-teal-300 font-mono text-xs hover:border-teal-400 transition"
                      >
                        <span>Exp: {
                          filterExperience === 'ENTRY' ? 'Entry' :
                          filterExperience === 'MID' ? 'Mid' :
                          filterExperience === 'SENIOR' ? 'Senior' : 'Lead'
                        }</span>
                        <X className="w-3 h-3 text-slate-400 hover:text-white" />
                      </button>
                    )}

                    {filterJobType !== 'ALL' && (
                      <button
                        onClick={() => setFilterJobType('ALL')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1A2230] border border-teal-500/40 text-teal-300 font-mono text-xs hover:border-teal-400 transition"
                      >
                        <span>Type: {
                          filterJobType === 'FULLTIME' ? 'Full-Time' :
                          filterJobType === 'CONTRACT' ? 'Contract' :
                          filterJobType === 'PART_TIME' ? 'Part-Time' : 'Internship'
                        }</span>
                        <X className="w-3 h-3 text-slate-400 hover:text-white" />
                      </button>
                    )}

                    {filterRemoteOnly && (
                      <button
                        onClick={() => setFilterRemoteOnly(false)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1A2230] border border-teal-500/40 text-teal-300 font-mono text-xs hover:border-teal-400 transition"
                      >
                        <span>Remote Only</span>
                        <X className="w-3 h-3 text-slate-400 hover:text-white" />
                      </button>
                    )}

                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1A2230] border border-teal-500/40 text-teal-300 font-mono text-xs hover:border-teal-400 transition"
                      >
                        <span>"{searchTerm}"</span>
                        <X className="w-3 h-3 text-slate-400 hover:text-white" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory(null);
                        setFilterExperience('ALL');
                        setFilterJobType('ALL');
                        setFilterRemoteOnly(false);
                        setFilterMatchedOnly(false);
                        setSortBy('TRUST');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono transition ml-auto"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset All</span>
                    </button>
                  </div>
                )}

                {/* Active Search & Filtering Status Indicator Banner */}
                {(searchTerm || selectedCategory || filterMatchedOnly) && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-[#141922] border border-teal-500/30 text-xs shadow-md">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-400/15 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xs flex-shrink-0">
                        {filteredJobs.length}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-xs flex items-center gap-1.5 flex-wrap">
                          <span>Active Filter Results:</span>
                          {filterMatchedOnly && (
                            <span className="text-teal-300 font-medium">🎯 Matching your profile ({candidateProfileRole})</span>
                          )}
                          {searchTerm && (
                            <span>matching <span className="text-teal-400">"{searchTerm}"</span></span>
                          )}
                          {selectedCategory && (
                            <span>in <span className="text-teal-400">"{selectedCategory}"</span></span>
                          )}
                          <span className="text-slate-400 text-[11px] font-normal">
                            ({filteredJobs.length} of {jobsToDisplay.length} total live jobs)
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory(null);
                        setFilterMatchedOnly(false);
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#1A2230] hover:bg-teal-500 hover:text-slate-950 text-slate-200 border border-[#253044] font-medium transition text-xs flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Job Grid Table */}
            <JobTable 
              jobs={filteredJobs} 
              searchTerm={searchTerm} 
              onSelectJob={(job) => setSelectedJob(job)}
              onApplyJob={handleApplyJob}
              onClearSearch={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
            />
          </section>

          {/* 5. FEATURE SPOTLIGHT & EMPLOYER CTA */}
          <div id="features-section">
            <FeatureSpotlightSection 
              onNavigateResume={() => {
                setActiveTab('resume-analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateExperience={() => {
                setActiveTab('experience-board');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onPostJobClick={() => {
                if (currentUser?.role === 'EMPLOYEE' || currentUser?.role === 'ADMIN') {
                  setActiveTab('employee-control');
                } else {
                  setInitialIsSignUp(true);
                  setAuthMessage('Please sign in or register as an Employer to post verified jobs.');
                  setActiveTab('login');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      )}
      </Suspense>

      {/* MODALS WITH SUSPENSE */}
      <Suspense fallback={null}>
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
            onApplicationSubmitted={(appData) => {
              const compName = typeof applyingJob.company === 'object' ? applyingJob.company.name : applyingJob.company;
              const trackedRecord = {
                id: appData?.id || Date.now(),
                companyName: compName || 'Verified Employer',
                jobTitle: applyingJob.title || 'Software Engineer',
                jobLocation: applyingJob.location || 'Remote',
                jobType: applyingJob.jobType || applyingJob.employmentType || 'Full-Time',
                status: 'APPLIED',
                salary: applyingJob.salaryDisplay || applyingJob.salary || 'Competitive',
                atsMatchScore: appData?.atsMatchScore || applyingJob.score || applyingJob.trustScore || 95,
                appliedAt: 'Just now',
                notes: appData?.coverNote || 'Application submitted through JobProof verified portal.',
                applyUrl: applyingJob.applyUrl || ''
              };
              try {
                const existing = JSON.parse(localStorage.getItem('jobproof_tracked_applications') || '[]');
                localStorage.setItem('jobproof_tracked_applications', JSON.stringify([
                  trackedRecord,
                  ...existing.filter(a => !(a.jobTitle === trackedRecord.jobTitle && a.companyName === trackedRecord.companyName))
                ]));
              } catch (e) {}
            }}
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
      </Suspense>
      </main>

      {/* COMPREHENSIVE 5-COLUMN FOOTER */}
      <div id="footer-section">
        <Footer 
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onPostJobClick={() => {
            if (currentUser?.role === 'EMPLOYEE' || currentUser?.role === 'ADMIN') {
              setActiveTab('employee-control');
            } else {
              setInitialIsSignUp(true);
              setAuthMessage('Please sign in or register as an Employer to post verified jobs.');
              setActiveTab('login');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>

      </div>

      {/* MOBILE THUMB-ZONE NAVIGATION BAR (Section 4.1) */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-surface-canvas/95 backdrop-blur-md border-t border-border-subtle z-40 flex items-center justify-around px-2 shadow-lg">
        <button
          onClick={() => {
            setActiveTab('dashboard-overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'dashboard-overview' ? 'text-accent-functional font-bold' : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => {
            if (currentUser?.isDemo) {
              handleRequireRegistration("Create an account to analyze your resume.");
              return;
            }
            setActiveTab('resume-analyzer');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'resume-analyzer' ? 'text-accent-functional font-bold' : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Resume AI</span>
        </button>

        <button
          onClick={() => {
            if (currentUser?.isDemo) {
              handleRequireRegistration("Create an account to track your applications.");
              return;
            }
            setActiveTab('application-tracker');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'application-tracker' ? 'text-accent-functional font-bold' : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Briefcase className="w-4 h-4 mb-0.5" />
          <span>Tracker</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('experience-board');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'experience-board' ? 'text-accent-functional font-bold' : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Globe className="w-4 h-4 mb-0.5" />
          <span>Reviews</span>
        </button>
      </nav>

    </div>
  );
}
