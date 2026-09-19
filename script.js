// JobProof Vanilla JavaScript Engine

document.addEventListener('DOMContentLoaded', () => {

  // State
  let currentUser = JSON.parse(localStorage.getItem('jobproof_vanilla_user')) || null;
  let sidebarOpen = true;

  // Sample Resumes Data
  const sampleResumes = {
    '1': {
      name: "Alex Morgan",
      role: "Senior Java Backend Engineer",
      score: "94%",
      skills: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Docker', 'Redis', 'REST API']
    },
    '2': {
      name: "Priya Sharma",
      role: "Full Stack React & Spring Developer",
      score: "88%",
      skills: ['React.js', 'JavaScript', 'TypeScript', 'Node.js', 'Spring Boot', 'Tailwind CSS']
    },
    '3': {
      name: "Rohan Verma",
      role: "AI & Data Pipeline Engineer",
      score: "91%",
      skills: ['Python', 'PyTorch', 'Spark', 'SQL', 'FastAPI', 'Pandas', 'Docker', 'Airflow']
    }
  };

  // Sample Jobs Data
  const sampleJobs = [
    {
      id: 1,
      title: 'Senior Java Backend Engineer',
      company: 'XYZ Technologies',
      location: 'Bangalore, India (Hybrid)',
      jobType: 'Full-time',
      salary: '₹14,00,000 - ₹22,00,000 / yr',
      score: 96,
      applyUrl: 'https://xyztech.com/careers/job/104'
    },
    {
      id: 2,
      title: 'Full Stack React & Spring Boot Developer',
      company: 'Nexus Innovations',
      location: 'Remote, India',
      jobType: 'Full-time',
      salary: '₹18,00,000 - ₹24,00,000 / yr',
      score: 98,
      applyUrl: 'https://nexusinnovations.com/careers/apply/302'
    },
    {
      id: 3,
      title: 'AI & Data Pipeline Engineer',
      company: 'DataPulse Systems',
      location: 'Hyderabad, India',
      jobType: 'Full-time',
      salary: '₹8,00,000 - ₹12,00,000 / yr',
      score: 94,
      applyUrl: 'https://datapulse.ai/careers/openings/771'
    }
  ];

  // DOM Elements
  const authView = document.getElementById('auth-view');
  const workspaceView = document.getElementById('workspace-view');
  const loginForm = document.getElementById('login-form');
  const btnDemoCandidate = document.getElementById('btn-demo-candidate');
  const btnDemoEmployer = document.getElementById('btn-demo-employer');
  const btnLogout = document.getElementById('btn-logout');
  const userDisplayName = document.getElementById('user-display-name');

  const sidebar = document.getElementById('sidebar');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const floatingOpenBtn = document.getElementById('floating-open-btn');
  const mainContentWrapper = document.getElementById('main-content-wrapper');

  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const jobsList = document.getElementById('jobs-list');

  // Check Auth State
  function checkAuth() {
    if (currentUser) {
      authView.classList.add('hidden');
      workspaceView.classList.remove('hidden');
      userDisplayName.textContent = currentUser.name || 'Cooper Curtis';
      renderJobs();
      renderResumePreset('1');
    } else {
      authView.classList.remove('hidden');
      workspaceView.classList.add('hidden');
    }
  }

  // Handle Login
  function doLogin(name, email, role) {
    currentUser = { name, email, role };
    localStorage.setItem('jobproof_vanilla_user', JSON.stringify(currentUser));
    checkAuth();
  }

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    doLogin(email.split('@')[0], email, 'Senior Developer');
  });

  btnDemoCandidate?.addEventListener('click', () => {
    doLogin('Cooper Curtis', 'cooper.curtis@jobproof.io', 'Senior Full Stack Developer');
  });

  btnDemoEmployer?.addEventListener('click', () => {
    doLogin('Sarah Jenkins', 'sarah.j@apexdigital.com', 'Lead Recruiter');
  });

  btnLogout?.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('jobproof_vanilla_user');
    checkAuth();
  });

  // Sidebar Toggle (Arrow open/close)
  // function toggleSidebar() {
  //   sidebarOpen = !sidebarOpen;
  //   if (sidebarOpen) {
  //     sidebar.classList.remove('collapsed');
  //     mainContentWrapper.classList.remove('collapsed');
  //     floatingOpenBtn.classList.add('hidden');
  //     sidebarToggleBtn.textContent = '‹';
  //   } else {
  //     sidebar.classList.add('collapsed');
  //     mainContentWrapper.classList.add('collapsed');
  //     floatingOpenBtn.classList.remove('hidden');
  //     sidebarToggleBtn.textContent = '›';
  //   }
  // }

  // sidebarToggleBtn?.addEventListener('click', toggleSidebar);
  // floatingOpenBtn?.addEventListener('click', toggleSidebar);

  // Tab Navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');

      navItems.forEach(nav => {
        nav.classList.remove('active', 'bg-blue-600', 'text-white');
        nav.classList.add('text-slate-400');
      });
      item.classList.add('active', 'bg-blue-600', 'text-white');
      item.classList.remove('text-slate-400');

      tabContents.forEach(tab => {
        if (tab.id === `tab-${targetTab}`) {
          tab.classList.remove('hidden');
        } else {
          tab.classList.add('hidden');
        }
      });
    });
  });

  // Render Jobs
  function renderJobs() {
    if (!jobsList) return;
    jobsList.innerHTML = sampleJobs.map(job => `
      <div class="job-card p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex justify-between items-center">
        <div>
          <div class="flex items-center gap-2">
            <h4 class="font-bold text-white text-sm">${job.title}</h4>
            <span class="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold">${job.jobType}</span>
          </div>
          <p class="text-xs text-slate-400 mt-1">🏢 ${job.company} • 📍 ${job.location} • 💰 ${job.salary}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">🛡️ ${job.score}% Verified</span>
          <a href="${job.applyUrl}" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition">Apply Direct →</a>
        </div>
      </div>
    `).join('');
  }

  // Resume Analyzer Presets
  function renderResumePreset(key) {
    const data = sampleResumes[key] || sampleResumes['1'];
    const scoreDisplay = document.getElementById('ats-score-display');
    const skillsChips = document.getElementById('detected-skills-chips');

    if (scoreDisplay) scoreDisplay.textContent = data.score;
    if (skillsChips) {
      skillsChips.innerHTML = data.skills.map(s => `
        <span class="px-2.5 py-1 rounded-xl bg-blue-900/60 border border-blue-700 text-blue-300 text-xs font-bold">✓ ${s}</span>
      `).join('');
    }
  }

  document.querySelectorAll('.sample-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetId = btn.getAttribute('data-preset');
      renderResumePreset(presetId);
    });
  });

  document.getElementById('btn-analyze-again')?.addEventListener('click', () => {
    const scoreDisplay = document.getElementById('ats-score-display');
    if (scoreDisplay) {
      scoreDisplay.textContent = 'Scanning...';
      setTimeout(() => {
        scoreDisplay.textContent = '95%';
      }, 600);
    }
  });

  // Initialize
  checkAuth();
});
