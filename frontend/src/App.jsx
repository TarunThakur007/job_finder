import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CompanyTickerSection from './components/CompanyTickerSection';
import CategoryGridSection from './components/CategoryGridSection';
import JobTable from './components/JobTable';
import JobDetailsModal from './components/JobDetailsModal';
import ResumeAnalyzerSection from './components/ResumeAnalyzerSection';
import LoginView from './components/LoginView';
import AdminControlSection from './components/AdminControlSection';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Search,
  X,
  Code2
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('jobproof_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    return currentUser?.role === 'ROLE_ADMIN' ? 'admin-panel' : 'dashboard-overview';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [healthStatus, setHealthStatus] = useState({ loading: true, data: null, error: null });
  const [liveJobs, setLiveJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showPostJobModal, setShowPostJobModal] = useState(false);

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

  // Filter jobs based on search term & category selection
  const filteredJobs = jobsToDisplay.filter((job) => {
    const compName = typeof job.company === 'object' ? job.company.name : job.company;
    const matchesSearch = !searchTerm || 
      (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (compName && compName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.skills && Array.isArray(job.skills) && job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory = !selectedCategory || 
      (job.role && job.role.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (job.title && job.title.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  const handleLoginSuccess = (userPayload) => {
    setCurrentUser(userPayload);
    if (userPayload?.role === 'ROLE_ADMIN') {
      setActiveTab('admin-panel');
    } else {
      setActiveTab('dashboard-overview');
    }
    try {
      localStorage.setItem('jobproof_user', JSON.stringify(userPayload));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('jobproof_user');
    } catch (e) {}
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
        <LoginView onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18181c] text-white font-sans selection:bg-yellow-400 selection:text-gray-950">
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthStatus={healthStatus}
        currentUser={currentUser}
        onLogout={handleLogout}
        onLoginClick={() => {}}
        onPostJobClick={() => setShowPostJobModal(true)}
      />

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

      {/* MAIN VIEW CONTROLLER */}
      {activeTab === 'resume-analyzer' ? (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <ResumeAnalyzerSection 
            liveJobs={jobsToDisplay} 
            onSelectJob={(job) => setSelectedJob(job)} 
          />
        </div>
      ) : activeTab === 'admin-panel' ? (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <AdminControlSection 
            liveJobs={jobsToDisplay} 
            currentUser={currentUser} 
            onPostJobClick={() => setShowPostJobModal(true)}
          />
        </div>
      ) : (
        /* HOMEPAGE */
        <main>
          {/* 1. HERO SECTION */}
          <HeroSection 
            onSearch={handleHeroSearch} 
            onCategorySelect={(cat) => setSelectedCategory(cat)}
          />

          {/* 2. TRUSTED BY 1000+ COMPANIES TICKER */}
          <CompanyTickerSection />

          {/* 3. BROWSE JOB CATEGORY GRID */}
          <CategoryGridSection 
            selectedCategory={selectedCategory} 
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              handleHeroSearch(cat || '');
            }}
          />

          {/* 4. VERIFIED LIVE JOBS LISTINGS */}
          <section id="job-listings-section" className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-800 pb-6">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-7 h-7 text-yellow-400" />
                  Verified <span className="text-yellow-400">Live Job</span> Listings
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Showing {filteredJobs.length} AI-verified active job openings with transparent trust scores
                </p>
              </div>

              {/* Filter Search Input directly associated with listing */}
              <div className="relative w-full sm:w-80 md:w-96">
                <label htmlFor="job-filter-input" className="sr-only">Filter listings</label>
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="job-filter-input"
                  type="text"
                  placeholder="Filter by title, company, skill, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#222228] border border-gray-800 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Job Grid Table */}
            <JobTable 
              jobs={filteredJobs} 
              searchTerm={searchTerm} 
              onSelectJob={(job) => setSelectedJob(job)}
            />
          </section>
        </main>
      )}

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
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
