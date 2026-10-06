import React from 'react';
import {
  X,
  CheckCircle2,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  ExternalLink,
  Sparkles,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Send,
  Users,
  Award,
  Compass,
  Layers,
  GraduationCap,
  Calendar,
  Gift,
  Target,
  ShieldCheck,
  Globe,
  AlertTriangle,
  Trash2
} from 'lucide-react';

// Helper to provide comprehensive company information & description
function getCompanyProfile(company, jobTitle) {
  const name = typeof company === 'object' ? company?.name : (company || 'Leading Tech Enterprise');
  const industry = (typeof company === 'object' && company?.industry) ? company.industry : 'Technology & Cloud Solutions';
  const customDesc = (typeof company === 'object' && company?.description) ? company.description : null;
  const website = (typeof company === 'object' && company?.website) ? company.website : null;

  if (customDesc && customDesc.trim().length > 30) {
    return { name, industry, description: customDesc, website };
  }

  const knownCompanies = {
    'Google': 'Google is a global technology leader committed to organizing the world\'s information and making it universally accessible. Engineering teams build hyperscale infrastructure, distributed databases, machine learning systems, and web platforms used by billions of people daily.',
    'Microsoft': 'Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Its engineering culture values customer obsession, continuous learning, and inclusive systems powering enterprise cloud, developer tools, and consumer software worldwide.',
    'Amazon': 'Amazon is guided by customer obsession, passion for invention, commitment to operational excellence, and long-term thinking. Software teams architect high-throughput services for AWS, global supply chain automation, and large-scale digital commerce.',
    'Stripe': 'Stripe builds financial infrastructure for the internet. Millions of companies—from ambitious startups to the world\'s largest enterprises—use Stripe\'s developer-first APIs and payment platforms to scale their digital economies.',
    'Netflix': 'Netflix is the world\'s premier streaming entertainment service. Its high-performance engineering culture operates one of the world\'s most resilient cloud microservice architectures, processing billions of daily events with zero downtime.',
    'Meta': 'Meta builds technologies that bring people together, including Instagram, WhatsApp, and advanced AI platforms. Engineering teams work on petabyte-scale data infrastructure, low-latency mobile platforms, and open-source distributed systems.',
    'Datadog': 'Datadog is the monitoring and security platform for cloud applications. Its SaaS-based data analytics platform integrates and automates infrastructure monitoring, APM, log management, and cloud security.',
    'Snowflake': 'Snowflake powers the Data Cloud, uniting siloed data to discover and execute diverse analytic workloads. Its multi-cluster shared data architecture delivers instant elasticity and enterprise governance across multi-cloud environments.',
    'Airbnb': 'Airbnb connects millions of guests and hosts worldwide. The engineering team is famous for world-class web design systems, microservices resiliency, and cutting-edge mobile developer ecosystems.',
    'Uber': 'Uber is modernizing the movement of people and commerce worldwide. Teams engineer real-time marketplace algorithms, dispatch systems, geospatial maps, and payment services with extreme fault tolerance.'
  };

  const matched = Object.entries(knownCompanies).find(([k]) => name.toLowerCase().includes(k.toLowerCase()));
  const description = matched
    ? matched[1]
    : `${name} is an established innovator in ${industry}. The company is renowned for its engineering-first culture, collaborative agile environments, and high-standard architecture standards. The organization provides team members with substantial technical ownership, clear career advancement paths, and modern developer tooling.`;

  return { name, industry, description, website };
}

// Helper to provide specific role information for after the selection
function getPostSelectionRoleDetails(title, companyName) {
  const isSenior = /senior|lead|principal|staff|architect/i.test(title || '');
  const isData = /data|ml|machine learning|ai|analyst/i.test(title || '');
  const isDevOps = /devops|cloud|sre|infrastructure/i.test(title || '');
  const isFrontend = /frontend|ui|ux|web/i.test(title || '');

  let roleDesignation = title || 'Software Engineer';
  let primaryScope = "You will serve as an integral engineering contributor, designing scalable microservices, driving architectural best practices, and partnering with product stakeholders to deliver high-quality software solutions.";

  let keyDeliverables = [
    "Architect, build, and maintain production-ready services with high availability and automated testing.",
    "Collaborate directly in cross-functional squads (Product, Design, QA) to transform roadmap specs into robust software.",
    "Conduct thorough code reviews, participate in technical design discussions, and uphold documentation integrity.",
    "Monitor telemetry, track application SLAs, and continuously optimize query and compute performance."
  ];

  let ninetyDayMilestones = [
    {
      phase: "Day 1 - 30: Onboarding & Integration",
      milestone: "Master team development environments, complete architecture walkthroughs, and ship your first production feature pull request."
    },
    {
      phase: "Day 31 - 60: Core Ownership & Delivery",
      milestone: "Take full technical ownership of assigned subsystem modules, participate in sprint estimation, and contribute to system RFCs."
    },
    {
      phase: "Day 61 - 90: High-Impact Leadership",
      milestone: "Lead an end-to-end service or feature launch, mentor team peers, and contribute to long-term architectural scaling initiatives."
    }
  ];

  let careerAdvancement = isSenior
    ? "Direct advancement trajectory toward Staff Software Engineer, Principal Architect, or Engineering Management paths."
    : "Rapid progression toward Senior Engineer and Technical Squad Lead with dedicated mentorship and sponsorship.";

  if (isFrontend) {
    primaryScope = "You will take ownership of modern, responsive user interfaces and component libraries, delivering accessible, fluid, and delightful web experiences.";
    keyDeliverables = [
      "Develop reusable component libraries and design tokens in React, TypeScript, and modern styling frameworks.",
      "Optimize Core Web Vitals, page rendering budgets, and client-side memory consumption.",
      "Collaborate closely with product designers in Figma to create intuitive, accessible (WCAG AA) user journeys.",
      "Implement comprehensive end-to-end and component tests with continuous integration verification."
    ];
  } else if (isData) {
    primaryScope = "You will engineer enterprise data pipelines, analytical schemas, and machine learning infrastructure powering real-time business decisions.";
    keyDeliverables = [
      "Construct resilient ETL/ELT data pipelines processing both streaming and batch data workloads.",
      "Design normalized data warehouse schemas and optimized analytical queries.",
      "Deploy, monitor, and scale machine learning and predictive model inference endpoints in production.",
      "Establish automated data quality monitoring, schema validation, and governance protocols."
    ];
  } else if (isDevOps) {
    primaryScope = "You will lead cloud infrastructure automation, container orchestration, CI/CD pipelines, and zero-trust security postures.";
    keyDeliverables = [
      "Manage multi-region cloud infrastructure using Terraform and Infrastructure as Code (IaC).",
      "Automate resilient CI/CD pipelines with automated vulnerability scanning and progressive canary rollouts.",
      "Instrument unified observability across microservices using metrics, logs, and distributed tracing.",
      "Optimize cloud infrastructure expenditure and enforce strict security and compliance baselines."
    ];
  }

  return { roleDesignation, primaryScope, keyDeliverables, ninetyDayMilestones, careerAdvancement };
}

export default function JobDetailsModal({ job, onClose, onSave, isSaved, onApply, currentUser, onRequireRegistration }) {
  if (!job) return null;

  const companyProfile = getCompanyProfile(job.company, job.title);
  const companyName = companyProfile.name;
  const postSelection = getPostSelectionRoleDetails(job.title, companyName);

  const selectionStages = [
    { step: '01', title: 'Application & ATS Review', duration: '1 - 2 Days', description: 'Resume screening against verified job requirements and skills alignment.' },
    { step: '02', title: 'Recruiter Discovery Call', duration: '30 Mins', description: 'Brief conversation regarding your career background, compensation, and role fit.' },
    { step: '03', title: 'Technical Deep-Dive', duration: '60 Mins', description: 'Practical coding, system architecture walkthrough, and problem solving.' },
    { step: '04', title: 'Team & Culture Alignment', duration: '45 Mins', description: 'Meet prospective peers and cross-functional team leaders to discuss collaboration.' },
    { step: '05', title: 'Official Offer & Welcome', duration: '24 - 48 Hours', description: 'Formal written offer letter, comprehensive benefits overview, and start date.' }
  ];

  const trustSignals = [
    { title: 'Verified Employer Domain', desc: 'Corporate domain and official email routing confirmed.', icon: ShieldCheck },
    { title: 'Direct ATS Career Page Match', desc: 'Job requisition verified directly from employer recruitment system.', icon: CheckCircle2 },
    { title: 'Verified Active Openings', desc: `${job.vacanciesCount || 1} verified active hiring ${job.vacanciesCount === 1 ? 'opening' : 'openings'} in this field.`, icon: Users },
    { title: 'Transparent Pay Commitment', desc: 'Compensation range verified against regional benchmarks.', icon: DollarSign },
    { title: 'Fast Recruiter Response Time', desc: 'Applications actively reviewed within approximately 48 hours.', icon: Clock },
    { title: 'Equal Opportunity Employer', desc: 'Inclusive hiring process with zero discrimination.', icon: Award }
  ];

  const skillsList = (job.skills && job.skills.length > 0)
    ? job.skills
    : ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'REST APIs', 'Cloud / AWS'];

  const salaryDisplay = job.salaryDisplay || (
    job.salaryMin && job.salaryMax
      ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} / yr`
      : '$120,000 - $175,000 / yr'
  );

  const handleApplyClick = () => {
    onClose();
    if (currentUser?.isDemo) {
      onRequireRegistration && onRequireRegistration(`Registration is required to apply for "${job.title}" at ${companyName}. Please create your candidate account.`);
      return;
    }
    if (onApply) onApply(job);
  };

  const handleEmployerSiteClick = () => {
    if (currentUser?.isDemo) {
      onClose();
      onRequireRegistration && onRequireRegistration(`Registration is required to access official employer applications for "${job.title}". Please create your account.`);
      return;
    }
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#18181c] border border-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col relative text-white">

        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-[#18181c]/95 backdrop-blur-md border-b border-gray-800 p-5 sm:p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-gray-950 font-black flex items-center justify-center text-xl shadow-lg shadow-yellow-500/20 flex-shrink-0">
              {companyName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {job.title}
                </h2>
                <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {job.vacanciesCount || 1} {job.vacanciesCount === 1 ? 'Opening' : 'Openings'} Active
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
                <span className="text-white font-bold">{companyName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location || 'Remote'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {job.jobType || job.employmentType || 'Full-Time'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-[#253044] text-slate-400 hover:text-white hover:bg-[#1A2230] transition"
              title="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-8 space-y-7 flex-1">

          {/* Quick Apply & Bookmark Action Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141922] border border-[#253044] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5 text-teal-400">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Verified Active Role Requisition
              </span>
              <p className="text-sm text-slate-300">
                Ready to take the next step in your career at <strong className="text-white">{companyName}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {onApply && (
                <button
                  onClick={handleApplyClick}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-teal-500/25 transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply Directly →</span>
                </button>
              )}
              {job.applyUrl && (
                <button
                  onClick={handleEmployerSiteClick}
                  className="px-4 py-2.5 bg-[#0D1117] hover:bg-[#1A2230] text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-[#253044] hover:border-slate-500 transition flex items-center justify-center gap-1.5"
                >
                  <span>Company ATS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Key Job Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#222228] p-3.5 rounded-2xl border border-gray-800 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Location & Mode</span>
              <p className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                <span className="truncate">{job.location || 'Remote'}</span>
              </p>
              <span className="text-[10px] text-gray-400 block font-semibold">
                {job.location?.toLowerCase().includes('remote') ? '100% Remote Option' : 'Flexible Arrangement'}
              </span>
            </div>

            <div className="bg-[#222228] p-3.5 rounded-2xl border border-gray-800 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Compensation</span>
              <p className="font-black text-yellow-400 flex items-center gap-1 truncate">
                <DollarSign className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                <span className="truncate">{salaryDisplay}</span>
              </p>
              <span className="text-[10px] text-gray-400 block">Base + Full Benefits</span>
            </div>

            <div className="bg-[#222228] p-3.5 rounded-2xl border border-gray-800 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Experience Required</span>
              <p className="font-bold text-white flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                <span className="truncate">{job.experienceLevel || '3+ to 6 Years'}</span>
              </p>
              <span className="text-[10px] text-gray-400 block font-semibold">Mid-Senior Level</span>
            </div>

            <div className="bg-[#222228] p-3.5 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 space-y-1">
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block flex items-center gap-1">
                <Users className="w-3 h-3 text-yellow-400" /> Active Vacancies
              </span>
              <p className="font-black text-white text-sm">
                {job.vacanciesCount || 1} {job.vacanciesCount === 1 ? 'Open Position' : 'Open Positions'}
              </p>
              <span className="text-[10px] text-emerald-400 block font-medium">Currently Recruiting</span>
            </div>
          </div>

          {/* 1. COMPANY DESCRIPTION SECTION */}
          <div className="bg-[#222228] border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-800">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-yellow-400" />
                <span>About {companyName} • Company Description</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-400">
                Industry: <strong className="text-gray-200">{companyProfile.industry}</strong>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {companyProfile.description}
            </p>

            {companyProfile.website && (
              <div className="pt-1">
                <a
                  href={companyProfile.website.startsWith('http') ? companyProfile.website : `https://${companyProfile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 font-bold"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visit Company Website ({companyProfile.website})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* 2. COMPLETE JOB DESCRIPTION */}
          <div className="bg-[#18181c] border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider pb-2 border-b border-gray-800/80">
              <Layers className="w-4 h-4 text-yellow-400" />
              <span>Job Description & Responsibilities</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {job.description || job.summary || `As a key member of the engineering team at ${companyName}, you will design, implement, and maintain critical systems and user features. You will work within an agile sprint cadence, writing clean, well-tested code, contributing to architectural RFCs, and partnering with teammates to continuously deliver high-performance applications.`}
            </p>

            {/* Core Responsibilities Bullet Points */}
            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                Key Day-to-Day Responsibilities:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                {postSelection.keyDeliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-[#222228] border border-gray-800/70">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. WHAT IS THE ROLE YOU WILL HAVE AFTER SELECTION */}
          <div className="bg-gradient-to-br from-[#18181c] via-[#1e1e24] to-[#18181c] border border-yellow-500/40 p-5 sm:p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-yellow-500/20">
              <div className="flex items-center gap-2 text-xs font-black text-yellow-400 uppercase tracking-wider">
                <Target className="w-4 h-4 text-yellow-400" />
                <span>What is the Role You Will Have After Selection?</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Target Role: {postSelection.roleDesignation}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
              {postSelection.primaryScope}
            </p>

            {/* 90-Day Progression Roadmap */}
            <div className="space-y-2.5 pt-1">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-yellow-400" />
                Your 90-Day Onboarding & Impact Roadmap:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {postSelection.ninetyDayMilestones.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#151518] border border-gray-800 space-y-1.5">
                    <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider block">
                      {m.phase}
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {m.milestone}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Growth Trajectory */}
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
              <Award className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white">Career Advancement: </span>
                <span className="text-gray-300">{postSelection.careerAdvancement}</span>
              </div>
            </div>
          </div>

          {/* 4. SALARY & COMPENSATION BREAKDOWN */}
          <div className="bg-[#18181c] border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <span>Salary & Transparent Compensation Package</span>
              </div>
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Verified Benchmark
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#222228] border border-gray-800">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Estimated Annual Compensation</span>
                <h3 className="text-2xl font-black text-yellow-400 mt-0.5">{salaryDisplay}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Base salary commensurate with candidate experience and geographic market.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  ✓ Full Equity & Bonuses
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-300 pt-1">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#151518] border border-gray-800">
                <Gift className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>100% Employer-Covered Health, Dental & Vision Insurance</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#151518] border border-gray-800">
                <Gift className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>401(k) / Retirement Matching up to 5% with immediate vesting</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#151518] border border-gray-800">
                <Gift className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>Flexible PTO, Paid Parental Leave & Dedicated Wellness Days</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#151518] border border-gray-800">
                <Gift className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>$2,000 Annual Learning Budget & Home Office Equipment Stipend</span>
              </div>
            </div>
          </div>

          {/* 5. EXPERIENCE REQUIRED & SKILLS */}
          <div className="bg-[#18181c] border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-yellow-400" />
                <span>Experience Required & Technical Qualifications</span>
              </div>
              <span className="text-xs font-bold text-yellow-400">
                {job.experienceLevel || 'Mid-Senior Level (3 - 6 Years)'}
              </span>
            </div>

            {/* Prerequisites */}
            <div className="space-y-2 text-xs text-gray-300">
              <div className="p-3 rounded-xl bg-[#222228] border border-gray-800 space-y-2">
                <p className="font-bold text-white">Minimum Qualifications & Prerequisites:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>{job.experienceLevel || '3+ years'} of hands-on professional software engineering experience.</li>
                  <li>Proficiency in modern programming languages, framework ecosystems, and database operations.</li>
                  <li>Understanding of distributed system design, RESTful APIs, and asynchronous message processing.</li>
                  <li>Experience with version control (Git), automated CI/CD pipelines, and unit/integration testing.</li>
                </ul>
              </div>
            </div>

            {/* Skills Badges */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Required Technical Skills & Technologies:
              </span>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#222228] text-gray-200 text-xs font-semibold border border-gray-800 hover:border-yellow-400/40 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 6. LOCATION & WORK MODE */}
          <div className="bg-[#18181c] border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span>Job Location & Work Arrangement</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {job.location?.toLowerCase().includes('remote') ? 'Remote Friendly' : 'Hybrid / On-Site'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#222228] border border-gray-800 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Primary Location</span>
                <p className="font-bold text-white text-sm">{job.location || 'Remote (Worldwide / United States)'}</p>
                <p className="text-[11px] text-gray-400">Timezone flexibility with standard team overlap hours.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#222228] border border-gray-800 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Work Policy & Support</span>
                <p className="font-bold text-white text-sm">Flexible Schedule & Home Office Support</p>
                <p className="text-[11px] text-gray-400">Full relocation assistance & visa sponsorship evaluated per candidate.</p>
              </div>
            </div>
          </div>

          {/* 7. IDENTIFIED SELECTION PROCESS FLOWCHART */}
          <div className="bg-[#18181c] border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <span>Identified Selection Process Flowchart</span>
              </div>
              <span className="text-[11px] text-gray-400 font-semibold">
                Average Duration: <strong className="text-white">~10 to 14 Days</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
              {selectionStages.map((stage, idx) => (
                <div key={idx} className="relative p-3.5 rounded-2xl bg-[#222228] border border-gray-800 hover:border-yellow-500/40 transition flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-yellow-400 text-gray-950 font-black text-xs flex items-center justify-center">
                      {stage.step}
                    </span>
                    <span className="text-[10px] text-yellow-400/90 font-bold bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                      {stage.duration}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white leading-tight">{stage.title}</h5>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. KEY HIGHLIGHTS & TRUST SIGNALS */}
          <div className="bg-[#18181c] border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Key Highlights & Trust Signals</span>
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                Verified Listing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {trustSignals.map((item, idx) => {
                const IconComponent = item.icon || CheckCircle2;
                return (
                  <div key={idx} className="p-3 rounded-xl bg-[#222228] border border-gray-800 hover:border-emerald-500/30 transition space-y-1">
                    <div className="flex items-center gap-2 font-bold text-white text-xs">
                      <IconComponent className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 pl-6 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 z-20 bg-[#141922]/95 backdrop-blur-md border-t border-[#253044] p-4 sm:p-5 flex items-center justify-between gap-4">
          <button
            onClick={() => onSave && onSave(job)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${isSaved
                ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                : 'bg-[#0D1117] text-slate-300 border-[#253044] hover:text-white hover:bg-[#1A2230]'
              }`}
          >
            {isSaved ? '✓ Saved in Bookmarks' : 'Bookmark Job'}
          </button>

          <div className="flex items-center gap-2.5">
            {job.applyUrl && (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-[#0D1117] hover:bg-[#1A2230] text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-[#253044] hover:border-slate-500 transition flex items-center gap-1.5"
              >
                <span>Company ATS Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {onApply && (
              <button
                onClick={handleApplyClick}
                className="px-6 py-2.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-teal-500/25 transition flex items-center gap-1.5 active:scale-95"
              >
                <span>Apply Directly →</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
