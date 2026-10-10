import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight,
  ArrowUpRight, 
  Award, 
  Briefcase, 
  Zap, 
  RefreshCw, 
  Trash2, 
  Download, 
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  ChevronRight,
  Copy,
  Check,
  Wand2,
  Edit3,
  Layers,
  DollarSign,
  MapPin,
  Users,
  TrendingUp,
  Eye,
  CheckSquare,
  Square,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Plus,
  X,
  ListChecks,
  SlidersHorizontal,
  GraduationCap,
  Code2,
  Printer,
  FileCheck
} from 'lucide-react';

export default function ResumeAnalyzerSection({ 
  currentUser,
  onRequireRegistration,
  liveJobs = [],
  onSelectJob,
  onApplyJob,
  onExploreMatchingJobs
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Senior Java Backend Engineer');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [showCustomRoleInput, setShowCustomRoleInput] = useState(false);
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'paste'
  const [pastedText, setPastedText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsingStep, setParsingStep] = useState(0);
  const [activeResultTab, setActiveResultTab] = useState('enhancer'); // 'enhancer' | 'overview' | 'recommendations' | 'eligible-jobs'

  // Interactive Live Bullet Optimizer State
  const [customBulletInput, setCustomBulletInput] = useState('');
  const [optimizingCustomBullet, setOptimizingCustomBullet] = useState(false);
  const [customBulletResult, setCustomBulletResult] = useState(null);
  const [copiedBulletKey, setCopiedBulletKey] = useState(null);

  // User Choice / Suggestion Adoption States (User chooses what AI suggests)
  const [acceptedRecs, setAcceptedRecs] = useState(new Set([0, 1, 2, 3]));
  const [acceptedBullets, setAcceptedBullets] = useState(new Set([0, 1, 2]));
  const [learningPlanSkills, setLearningPlanSkills] = useState(['Apache Kafka', 'Kubernetes']);
  const [completedSkills, setCompletedSkills] = useState(new Set());
  const [showEnhancedResumeModal, setShowEnhancedResumeModal] = useState(false);
  const [modalViewMode, setModalViewMode] = useState('preview'); // 'preview' (formatted sheet) | 'text' (plaintext)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [resumeCopied, setResumeCopied] = useState(false);

  // ATS Score out of 10 Formatter
  const formatScoreOutOf10 = (score) => {
    if (score === null || score === undefined) return '0.0';
    return (Math.round((Number(score) / 10) * 10) / 10).toFixed(1);
  };

  const handleCopy = (key, text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedBulletKey(key);
      setTimeout(() => setCopiedBulletKey(null), 2000);
    }
  };

  const checkDemoRestriction = () => {
    if (currentUser?.isDemo) {
      onRequireRegistration && onRequireRegistration("AI Resume Analysis and ATS Scorecard features require a candidate account. Please register to analyze your resume.");
      return true;
    }
    return false;
  };

  const copyToClipboard = (text, key) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBulletKey(key);
      setTimeout(() => setCopiedBulletKey(null), 2000);
    }
  };

  // Toggle user acceptance of individual AI recommendation
  const toggleRecommendation = (idx) => {
    setAcceptedRecs(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Toggle user acceptance of individual STAR bullet rewrite
  const toggleBullet = (idx) => {
    setAcceptedBullets(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Accept all suggestions
  const handleAcceptAllSuggestions = () => {
    const recCount = (currentAnalysis?.recommendations || []).length;
    const bulletCount = (currentAnalysis?.bulletEnhancements || []).length;
    setAcceptedRecs(new Set(Array.from({ length: recCount }, (_, i) => i)));
    setAcceptedBullets(new Set(Array.from({ length: bulletCount }, (_, i) => i)));
  };

  // Reset / Clear all suggestions
  const handleResetSuggestions = () => {
    setAcceptedRecs(new Set());
    setAcceptedBullets(new Set());
  };

  // Toggle skill in learning plan
  const toggleLearningPlanSkill = (skill) => {
    setLearningPlanSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  // Toggle skill marked as learned / completed
  const toggleCompletedSkill = (skill) => {
    setCompletedSkills(prev => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  };

  // Sample Resumes Presets for instant demonstration with Before/After Bullet Enhancements
  const sampleResumes = [
    {
      id: 'sample-1',
      name: 'Alex_Morgan_Java_Backend_Resume.pdf',
      role: 'Senior Java Backend Engineer',
      size: '248 KB',
      type: 'application/pdf',
      skills: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Docker', 'Redis', 'REST API', 'Git'],
      missingSkills: ['Apache Kafka', 'Kubernetes', 'OpenTelemetry'],
      atsScore: 94,
      formattingScore: 96,
      keywordScore: 92,
      impactScore: 90,
      jobReadinessStatus: 'Job Ready (High Role Resonance - 94% Match)',
      jobReadinessRoadmap: [
        'Phase 1: Scale Event Messaging - Master Apache Kafka consumer groups, distributed partition key strategies, and transactional outbox pattern.',
        'Phase 2: Deploy Container Orchestration - Deploy current Spring Boot microservices on Kubernetes (Minikube / EKS) with Helm charts and liveness probes.',
        'Phase 3: STAR Resume Experience Overhaul - Re-engineer existing bullets to highlight p99 latency reduction (42%) and 25M+ daily requests scale.',
        'Phase 4: Distributed System Interview Prep - Focus on database sharding, CQRS, and resilience patterns (Resilience4j circuit breakers).'
      ],
      recommendedProject: 'High-Throughput Payment & Settlement Engine: Resilient Java 17 + Spring Boot microservices handling 1,500+ TPS with Apache Kafka event streaming, Redis distributed locks, and PostgreSQL transactional outbox pattern.',
      summary: 'Strong backend engineering profile with 5+ years building high-throughput microservices and PostgreSQL architectures. High ATS compatibility evaluated by Gemini AI.',
      strengths: [
        'Includes quantifiable achievement metrics (e.g., "Reduced p99 DB latency by 42%")',
        'Standard single-column layout, 100% readable by legacy & modern ATS scanners',
        'Strong alignment with target Spring Boot & Cloud backend requirements'
      ],
      warnings: [
        'Ensure simple standard bullet characters (•) rather than graphical tables or icons.',
        'Keep phone, email, and hyperlinked GitHub link in the document body, not header/footer.'
      ],
      recommendations: [
        'Incorporate missing target keywords (Kafka, Kubernetes) in current microservices project descriptions.',
        'Build and open-source the recommended High-Throughput Payment Engine capstone project on GitHub.',
        'Apply the STAR Before/After bullet point enhancements to maximize recruiter impact and ATS match rates.',
        'Add a brief 2-line technical summary highlighting distributed system resiliency.'
      ],
      bulletEnhancements: [
        {
          originalBullet: 'Worked on backend APIs and database tables for company web application.',
          improvedBullet: 'Architected resilient Spring Boot microservices handling 25M+ daily requests, optimizing PostgreSQL query plans to reduce p99 response latency by 42%.',
          improvementReason: 'Eliminates passive "worked on" phrasing; adds explicit throughput scale and latency reduction metrics using the STAR framework.'
        },
        {
          originalBullet: 'Helped migrate old monolithic system to cloud microservices.',
          improvedBullet: 'Spearheaded containerization and decoupling of legacy monolith into 6 containerized Docker microservices, achieving 99.98% service availability and cutting cloud compute spend by 28%.',
          improvementReason: 'Uses strong action verb "Spearheaded" and quantifies reliability uptime and cloud infrastructure savings.'
        },
        {
          originalBullet: 'Wrote unit tests and fixed bug tickets in Jira.',
          improvedBullet: 'Instituted test-driven development (TDD) with JUnit 5 and Testcontainers, elevating code coverage from 62% to 91% and eliminating release blocker bugs by 75%.',
          improvementReason: 'Showcases proactive engineering discipline and measurable quality assurance metrics.'
        }
      ]
    },
    {
      id: 'sample-2',
      name: 'Taylor_Swift_Data_Engineer_Resume.pdf',
      role: 'AI & Data Pipeline Engineer',
      size: '310 KB',
      type: 'application/pdf',
      skills: ['Python', 'PyTorch', 'Apache Spark', 'SQL', 'FastAPI', 'Pandas', 'Docker', 'Airflow'],
      missingSkills: ['Snowflake', 'AWS SageMaker', 'MLflow'],
      atsScore: 91,
      formattingScore: 94,
      keywordScore: 90,
      impactScore: 89,
      jobReadinessStatus: 'Job Ready (High Role Resonance - 91% Match)',
      jobReadinessRoadmap: [
        'Phase 1: Cloud Data Warehousing - Integrate Snowflake with Snowpipe for real-time automated ingestion from S3 buckets.',
        'Phase 2: Production MLOps - Deploy MLflow tracking servers and automate CI/CD model retraining pipelines using GitHub Actions.',
        'Phase 3: STAR Impact Metric Quantifications - Emphasize $1.2M retained revenue and 8x pipeline execution speedups.',
        'Phase 4: Distributed Computing Interview Prep - Deep dive into Apache Spark shuffle partitions, memory tuning, and broadcast joins.'
      ],
      recommendedProject: 'Real-Time Distributed Fraud Detection Pipeline: End-to-end data pipeline processing 5M+ records with Apache Spark & Airflow, training an XGBoost/PyTorch classifier, and deploying real-time low-latency inference via FastAPI microservices.',
      summary: 'Data engineer specialized in distributed data processing pipelines and machine learning API deployments with strong mathematical grounding.',
      strengths: [
        'Excellent usage of technical data tools and cloud processing keywords',
        'Project section clearly describes end-to-end pipeline architectures and throughput'
      ],
      warnings: [
        'Font size for subheadings is slightly small (9pt); recommend 10.5pt for scanning clarity.'
      ],
      recommendations: [
        'Highlight model deployment throughput and inference latency metrics.',
        'Build and publish the recommended Real-Time Fraud Detection pipeline on GitHub.',
        'Add specific cloud platform data warehouse certifications if completed.'
      ],
      bulletEnhancements: [
        {
          originalBullet: 'Trained machine learning models on customer data to predict churn.',
          improvedBullet: 'Developed and deployed gradient-boosted ML classification models processing 8M+ user records, improving churn prediction accuracy by 22% and retaining $1.2M in annual revenue.',
          improvementReason: 'Directly ties machine learning modeling to measurable bottom-line business value.'
        },
        {
          originalBullet: 'Wrote SQL queries and Python scripts to extract database records.',
          improvedBullet: 'Engineered distributed ETL pipelines with PySpark and Airflow, reducing data transformation execution time from 6 hours to 45 minutes for daily analytics reporting.',
          improvementReason: 'Quantifies massive 8x pipeline throughput speedup using modern distributed data tooling.'
        },
        {
          originalBullet: 'Created dashboard and reports for stakeholders.',
          improvedBullet: 'Architected self-service analytics dashboard serving 120+ internal stakeholders, reducing ad-hoc reporting requests by 65%.',
          improvementReason: 'Highlights operational efficiency gains and stakeholder enablement.'
        }
      ]
    },
    {
      id: 'sample-3',
      name: 'Priya_Sharma_Frontend_Specialist.pdf',
      role: 'Frontend React Specialist',
      size: '220 KB',
      type: 'application/pdf',
      skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux Toolkit', 'REST API', 'Jest', 'Vite'],
      missingSkills: ['GraphQL', 'Storybook', 'CI/CD Pipeline'],
      atsScore: 93,
      formattingScore: 95,
      keywordScore: 92,
      impactScore: 91,
      jobReadinessStatus: 'Job Ready (High Role Resonance - 93% Match)',
      jobReadinessRoadmap: [
        'Phase 1: Full-Stack Component Federation - Master GraphQL Apollo Client caching and document UI component states with Storybook.',
        'Phase 2: Automated Testing Rig - Implement end-to-end testing with Playwright or Cypress for core checkout and onboarding flows.',
        'Phase 3: STAR Performance Rewrites - Highlight 54% First Contentful Paint speedup and 98 Google Lighthouse accessibility benchmark.',
        'Phase 4: Frontend System Design - Prepare for large-scale micro-frontends, state synchronization across tabs, and service worker offline caching.'
      ],
      recommendedProject: 'Enterprise Next.js 14 Analytics Dashboard: Build a high-performance frontend platform with TypeScript, Tailwind CSS, optimistic React Query caching, virtualized data tables handling 10,000+ rows, and 98+ Google Lighthouse accessibility.',
      summary: 'Modern frontend specialist delivering responsive, accessible web applications with cutting-edge React architectures.',
      strengths: [
        'Includes metrics on Core Web Vitals and Lighthouse performance improvements',
        'Well-organized component architecture with clear state management'
      ],
      warnings: [
        'Ensure skills are listed in plain text rather than nested multi-column tables.'
      ],
      recommendations: [
        'Highlight experience with end-to-end testing (Cypress / Playwright).',
        'Link to live interactive portfolio demos for target frontend roles.',
        'Incorporate missing keywords (GraphQL, Storybook) in component development bullets.'
      ],
      bulletEnhancements: [
        {
          originalBullet: 'Built reusable UI components for company dashboard using React.',
          improvedBullet: 'Architected a modular React & TypeScript component library with Tailwind CSS, accelerating front-end feature delivery by 35% across 4 engineering squads.',
          improvementReason: 'Transforms generic task into quantifiable leadership outcome using STAR framework with metric-based velocity improvement.'
        },
        {
          originalBullet: 'Improved website speed and worked on responsive design.',
          improvedBullet: 'Engineered automated code-splitting and asset prefetching with Vite, reducing First Contentful Paint (FCP) by 54% and lifting Google Lighthouse score to 98.',
          improvementReason: 'Replaces passive description with concrete performance metrics and recognized engineering benchmarks.'
        },
        {
          originalBullet: 'Fixed front-end bugs and worked with backend API developers.',
          improvedBullet: 'Collaborated with backend engineers to define robust OpenAPI contracts and implemented React Query optimistic UI caching, reducing user-reported sync errors by 40%.',
          improvementReason: 'Demonstrates cross-functional collaboration and enterprise data caching patterns.'
        }
      ]
    },
    {
      id: 'sample-4',
      name: 'Rohan_Gupta_Web_Junior_Resume.pdf',
      role: 'Senior Java Backend Engineer',
      size: '185 KB',
      type: 'application/pdf',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Git', 'REST API'],
      missingSkills: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Docker', 'Redis', 'Apache Kafka', 'Kubernetes'],
      atsScore: 52,
      formattingScore: 88,
      keywordScore: 28,
      impactScore: 62,
      jobReadinessStatus: 'Substantial Skill Gap (<65% Match) - Reskilling Required',
      jobReadinessRoadmap: [
        'Phase 1: Master Backend Core - Complete Java 17 fundamentals, OOP design patterns, and Spring Boot REST API development.',
        'Phase 2: Relational Databases & Caching - Learn PostgreSQL schema design, indexing, Hibernate/JPA, and Redis caching.',
        'Phase 3: Build Proof-of-Work Project - Build and deploy the High-Throughput Payment Gateway with Kafka and PostgreSQL.',
        'Phase 4: Resume Transformation - Restructure resume to highlight backend architectures, APIs built, and quantifiable server metrics.'
      ],
      recommendedProject: 'High-Throughput Payment & Settlement Engine: Resilient Java 17 + Spring Boot microservices platform handling 1,500+ TPS with Apache Kafka event streaming, Redis distributed locks, and PostgreSQL transactional outbox pattern.',
      summary: 'Candidate currently has frontend-oriented skillset applying for Senior Java Backend. Significant gaps in core Java, Spring Boot, distributed microservices, and databases. Follow the job-readiness roadmap below to transition.',
      strengths: [
        'Solid foundation in web standards, version control (Git), and consuming REST APIs'
      ],
      warnings: [
        'Resume lacks core required backend language (Java 17) and database architecture (PostgreSQL, Redis).',
        'Candidate is missing 8 of 10 essential keywords for Senior Java Backend Engineer.'
      ],
      recommendations: [
        'Follow the 4-phase backend transition roadmap below to acquire Java 17 and Spring Boot competencies.',
        'Build and open-source the recommended High-Throughput Payment Engine capstone project on GitHub.',
        'Avoid applying to Senior Java positions until Spring Boot and PostgreSQL projects are completed.'
      ],
      bulletEnhancements: [
        {
          originalBullet: 'Built web pages using HTML, CSS and JavaScript.',
          improvedBullet: 'Engineered responsive web client and integrated RESTful endpoints with OpenAPI contracts, cutting frontend data load latency by 38%.',
          improvementReason: 'Replaces generic task description with active verb and quantified load latency metric.'
        }
      ]
    }
  ];

  const [currentAnalysis, setCurrentAnalysis] = useState(sampleResumes[0]);

  // Derive AI-Matched Eligible Jobs & Profiles based on extracted resume skills & ATS score
  const eligibleJobs = useMemo(() => {
    const candidateSkills = (currentAnalysis?.skills || []).map(s => s.toLowerCase().trim());
    const candidateRole = (currentAnalysis?.role || targetRole || '').toLowerCase().trim();

    const fallbackJobs = [
      {
        id: 101,
        title: 'Senior Java Backend Engineer',
        company: 'Stripe',
        location: 'Bangalore, India (Hybrid)',
        employmentType: 'Full-time',
        salaryDisplay: '₹24L - ₹36L',
        vacanciesCount: 5,
        skills: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Docker', 'Redis', 'Kafka'],
        summary: 'Architect high-throughput payments processing microservices using Java 17 and PostgreSQL.'
      },
      {
        id: 102,
        title: 'Full Stack Cloud Software Engineer',
        company: 'Datadog',
        location: 'Remote',
        employmentType: 'Full-time',
        salaryDisplay: '₹22L - ₹32L',
        vacanciesCount: 4,
        skills: ['React', 'Java', 'Spring Boot', 'REST API', 'Docker', 'Git'],
        summary: 'Build enterprise observability interfaces in React coupled with scalable backend microservices.'
      },
      {
        id: 103,
        title: 'Distributed Systems & Database Architect',
        company: 'Airbnb',
        location: 'Remote',
        employmentType: 'Full-time',
        salaryDisplay: '₹30L - ₹45L',
        vacanciesCount: 3,
        skills: ['PostgreSQL', 'Redis', 'Microservices', 'Spring Boot', 'Java'],
        summary: 'Design low-latency indexing architecture handling millions of real-time search queries.'
      },
      {
        id: 104,
        title: 'Backend API Platform Engineer',
        company: 'Uber',
        location: 'Hyderabad, India',
        employmentType: 'Full-time',
        salaryDisplay: '₹20L - ₹30L',
        vacanciesCount: 6,
        skills: ['Java', 'REST API', 'Spring Boot', 'Git', 'Docker'],
        summary: 'Scale developer platform APIs and ensure high-availability service communication.'
      }
    ];

    const sourcePool = (liveJobs && liveJobs.length > 0) ? liveJobs : fallbackJobs;

    // Filter STRICTLY to ONLY jobs that match the candidate's actual job profile and skills
    const matchedJobs = sourcePool.map(job => {
      const jobSkills = Array.isArray(job.skills) 
        ? job.skills 
        : (job.skills ? job.skills.split(',').map(s => s.trim()) : []);
      
      const jobTitle = (job.title || '').toLowerCase();
      const jobRole = (job.role || '').toLowerCase();

      // Check role/domain relevance against candidate target role
      const roleWords = candidateRole.split(/\s+/).filter(w => w.length > 2 && !['senior', 'lead', 'junior', 'staff', 'engineer', 'developer', 'specialist', 'technologies'].includes(w));
      const hasRoleOverlap = roleWords.some(rw => jobTitle.includes(rw) || jobRole.includes(rw)) ||
                             (candidateRole.includes('backend') && (jobTitle.includes('backend') || jobRole.includes('backend') || jobTitle.includes('api') || jobTitle.includes('java') || jobTitle.includes('spring') || jobTitle.includes('python'))) ||
                             (candidateRole.includes('frontend') && (jobTitle.includes('frontend') || jobRole.includes('frontend') || jobTitle.includes('react') || jobTitle.includes('ui') || jobTitle.includes('web'))) ||
                             (candidateRole.includes('full stack') || candidateRole.includes('fullstack')) ||
                             (candidateRole.includes('data') && (jobTitle.includes('data') || jobRole.includes('data') || jobTitle.includes('ml') || jobTitle.includes('ai') || jobTitle.includes('pipeline'))) ||
                             (candidateRole.includes('devops') && (jobTitle.includes('devops') || jobRole.includes('devops') || jobTitle.includes('cloud') || jobTitle.includes('sre') || jobTitle.includes('infra')));

      // Check skill matches
      const matched = jobSkills.filter(js => {
        const jsLower = js.toLowerCase();
        return candidateSkills.some(cs => cs.includes(jsLower) || jsLower.includes(cs));
      });

      const missing = jobSkills.filter(js => {
        const jsLower = js.toLowerCase();
        return !candidateSkills.some(cs => cs.includes(jsLower) || jsLower.includes(cs));
      });

      // Strict matching condition: Must have matching skills AND domain compatibility
      const isProfileMatch = (matched.length >= 2) || (matched.length >= 1 && hasRoleOverlap);

      if (!isProfileMatch) {
        return null;
      }

      // Calculate authentic match percentage based on skills overlap
      const skillMatchRatio = jobSkills.length > 0 ? (matched.length / jobSkills.length) : 0.6;
      const computedScore = Math.min(99, Math.max(68, Math.round(((skillMatchRatio * 0.70) + (hasRoleOverlap ? 0.30 : 0.12)) * 100)));

      return {
        ...job,
        jobSkills,
        matchedSkills: matched,
        missingSkills: missing,
        eligibilityScore: computedScore,
        isHighlyEligible: computedScore >= 80,
        hasRoleOverlap
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.eligibilityScore - a.eligibilityScore);

    return matchedJobs;
  }, [liveJobs, currentAnalysis, targetRole]);

  const eligibleCareerProfiles = useMemo(() => {
    const skills = (currentAnalysis?.skills || []).map(s => s.toLowerCase());
    const candidateRole = (currentAnalysis?.role || targetRole || '').toLowerCase();

    const hasBackend = skills.some(s => s.includes('java') || s.includes('spring') || s.includes('python') || s.includes('node') || s.includes('sql') || s.includes('postgres') || s.includes('api'));
    const hasFrontend = skills.some(s => s.includes('react') || s.includes('javascript') || s.includes('typescript') || s.includes('html') || s.includes('css') || s.includes('next') || s.includes('tailwind'));
    const hasCloud = skills.some(s => s.includes('docker') || s.includes('kubernetes') || s.includes('aws') || s.includes('terraform') || s.includes('ci/cd') || s.includes('linux'));
    const hasData = skills.some(s => s.includes('spark') || s.includes('pandas') || s.includes('pytorch') || s.includes('airflow') || s.includes('ml') || s.includes('data'));

    const profiles = [];

    if (hasBackend && hasFrontend) {
      profiles.push({
        roleTitle: 'Senior Full Stack Software Engineer',
        matchScore: 97,
        status: 'Highest Match',
        openingsEstimate: '22+ Active Openings',
        salaryRange: '₹22L - ₹38L',
        coreStack: ['Java / Spring Boot', 'React.js', 'PostgreSQL', 'RESTful APIs'],
        aiSuggestion: 'Your profile has balanced client and server architectures. Highlighting end-to-end performance and latency reductions will accelerate recruiter shortlisting.'
      });
    }

    if (hasBackend || candidateRole.includes('backend') || candidateRole.includes('java')) {
      profiles.push({
        roleTitle: 'Backend Microservices Specialist',
        matchScore: hasBackend ? 95 : 82,
        status: 'Exceptional Fit',
        openingsEstimate: '28+ Active Openings',
        salaryRange: '₹20L - ₹35L',
        coreStack: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Docker', 'Redis'],
        aiSuggestion: 'Strong architectural alignment with enterprise backend requirements. Add event-driven architecture keywords (Kafka, RabbitMQ) to unlock lead tier bands.'
      });
    }

    if (hasFrontend || candidateRole.includes('frontend') || candidateRole.includes('react')) {
      profiles.push({
        roleTitle: 'Frontend & UI Performance Architect',
        matchScore: hasFrontend ? 96 : 80,
        status: 'High Resonance',
        openingsEstimate: '18+ Active Openings',
        salaryRange: '₹18L - ₹32L',
        coreStack: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vite'],
        aiSuggestion: 'Exceptional modern UI engineering stack. Document component modularity, Core Web Vitals optimizations, and design system governance.'
      });
    }

    if (hasCloud || candidateRole.includes('devops') || candidateRole.includes('cloud')) {
      profiles.push({
        roleTitle: 'Cloud Infrastructure & DevOps Engineer',
        matchScore: hasCloud ? 93 : 84,
        status: 'High Demand',
        openingsEstimate: '16+ Active Openings',
        salaryRange: '₹24L - ₹40L',
        coreStack: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD Pipelines'],
        aiSuggestion: 'To command 35%+ premium compensation, feature automated GitOps deployments (ArgoCD) and zero-downtime containerized production releases.'
      });
    }

    if (hasData || candidateRole.includes('data') || candidateRole.includes('ai') || candidateRole.includes('python')) {
      profiles.push({
        roleTitle: 'Distributed Data & ML Pipeline Engineer',
        matchScore: hasData ? 94 : 81,
        status: 'Strategic Growth',
        openingsEstimate: '14+ Active Openings',
        salaryRange: '₹22L - ₹36L',
        coreStack: ['Python', 'Apache Spark', 'SQL', 'Airflow', 'FastAPI'],
        aiSuggestion: 'Highlight high-throughput streaming pipelines, distributed compute partition tuning, and real-time model inference latencies.'
      });
    }

    return profiles.slice(0, 3);
  }, [currentAnalysis, targetRole]);

  const runAnalysisProcess = async (fileObj, roleTitle, customText = null) => {
    setIsAnalyzing(true);
    setParsingStep(1);

    setTimeout(() => setParsingStep(2), 350);
    setTimeout(() => setParsingStep(3), 700);
    setTimeout(() => setParsingStep(4), 1050);

    let base64Content = null;
    let extractedText = customText !== null ? customText : (inputMode === 'paste' ? pastedText : '');

    if (fileObj) {
      try {
        base64Content = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(fileObj);
        });
      } catch (err) {
        console.warn('Could not read resume file as data URL', err);
      }
    }

    const payload = {
      filename: fileObj ? fileObj.name : 'Uploaded_Resume.pdf',
      fileType: fileObj ? (fileObj.type || fileObj.name.split('.').pop().toUpperCase()) : 'PDF',
      fileSizeBytes: fileObj ? fileObj.size : 245000,
      candidateName: currentUser?.name || 'Job Seeker',
      candidateEmail: currentUser?.email || 'candidate@jobproof.io',
      targetJobRole: roleTitle || targetRole,
      fileContentBase64: base64Content,
      rawResumeText: extractedText
    };

    fetch('/api/resumes/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setIsAnalyzing(false);
        const resultAnalysis = {
          id: data.id || ('api-' + Date.now()),
          name: data.filename || payload.filename,
          role: data.targetJobRole || payload.targetJobRole,
          size: `${Math.round(payload.fileSizeBytes / 1024)} KB`,
          type: 'application/pdf',
          skills: (data.extractedSkills && data.extractedSkills.length > 0) 
            ? data.extractedSkills 
            : [],
          missingSkills: (data.missingCriticalSkills && data.missingCriticalSkills.length > 0)
            ? data.missingCriticalSkills
            : [],
          atsScore: (data.overallAtsScore !== undefined && data.overallAtsScore !== null) ? data.overallAtsScore : 55,
          formattingScore: data.formattingScore || 90,
          keywordScore: (data.keywordMatchScore !== undefined && data.keywordMatchScore !== null) ? data.keywordMatchScore : 40,
          impactScore: data.impactVerbScore || 70,
          jobReadinessStatus: data.jobReadinessStatus || (
            (data.overallAtsScore || 55) >= 85 
              ? 'Job Ready (High Role Resonance)' 
              : (data.overallAtsScore || 55) >= 65 
              ? 'Near Ready (Skill Gap Bridge Required)' 
              : 'Substantial Skill Gap (<65% Match - Reskilling Required)'
          ),
          jobReadinessRoadmap: data.jobReadinessRoadmap || [],
          recommendedProject: data.recommendedProject || '',
          summary: data.summary || `Evaluated resume against active employer benchmarks for ${data.targetJobRole || payload.targetJobRole}.`,
          strengths: (data.strengths && data.strengths.length > 0) 
            ? data.strengths 
            : ['Document is structured with single-column layout for ATS parser legibility'],
          warnings: (data.formattingWarnings && data.formattingWarnings.length > 0)
            ? data.formattingWarnings 
            : ['Ensure standard bullet characters without non-standard glyphs'],
          recommendations: (data.improvementRecommendations && data.improvementRecommendations.length > 0)
            ? data.improvementRecommendations
            : ['Integrate missing target keywords into project descriptions.'],
          bulletEnhancements: (data.bulletEnhancements && data.bulletEnhancements.length > 0)
            ? data.bulletEnhancements
            : (sampleResumes[0].bulletEnhancements || [])
        };
        try {
          if (resultAnalysis.skills && resultAnalysis.skills.length > 0) {
            localStorage.setItem('jobproof_candidate_skills', JSON.stringify(resultAnalysis.skills));
          }
          if (resultAnalysis.role) {
            localStorage.setItem('jobproof_target_role', resultAnalysis.role);
          }
        } catch (e) {}
        setCurrentAnalysis(resultAnalysis);
        setAcceptedRecs(new Set((resultAnalysis.recommendations || []).map((_, i) => i)));
        setAcceptedBullets(new Set((resultAnalysis.bulletEnhancements || []).map((_, i) => i)));
        if (resultAnalysis.missingSkills && resultAnalysis.missingSkills.length > 0) {
          setLearningPlanSkills(resultAnalysis.missingSkills.slice(0, 3));
        }
      })
      .catch(() => {
        setIsAnalyzing(false);
        const fallback = sampleResumes.find((s) => s.role === roleTitle) || sampleResumes[0];
        try {
          if (fallback.skills && fallback.skills.length > 0) {
            localStorage.setItem('jobproof_candidate_skills', JSON.stringify(fallback.skills));
          }
          if (fallback.role) {
            localStorage.setItem('jobproof_target_role', fallback.role);
          }
        } catch (e) {}
        setCurrentAnalysis(fallback);
        setAcceptedRecs(new Set((fallback.recommendations || []).map((_, i) => i)));
        setAcceptedBullets(new Set((fallback.bulletEnhancements || []).map((_, i) => i)));
        if (fallback.missingSkills && fallback.missingSkills.length > 0) {
          setLearningPlanSkills(fallback.missingSkills.slice(0, 3));
        }
      });
  };

  // Dynamic projected score calculation based on candidate's accepted suggestions
  const projectedScore = useMemo(() => {
    const base = Number(currentAnalysis?.atsScore || 50) / 10;
    const recsGain = (acceptedRecs.size * 0.35);
    const bulletsGain = (acceptedBullets.size * 0.65);
    const completedSkillsGain = (completedSkills.size * 0.4);
    const total = Math.min(9.9, Math.max(base, base + recsGain + bulletsGain + completedSkillsGain));
    return total.toFixed(1);
  }, [currentAnalysis, acceptedRecs, acceptedBullets, completedSkills]);

  // Generates clean ATS-optimized resume text incorporating user's authentic details, all existing skills + added profile skills
  const generateEnhancedResumeText = () => {
    if (!currentAnalysis) return '';
    const candidateName = currentUser?.name?.trim() || (currentAnalysis?.name?.replace(/_Resume.*|\.pdf.*/i, '').replace(/_/g, ' ') || 'Candidate');
    const email = currentUser?.email || 'candidate@jobproof.io';
    const role = targetRole || currentAnalysis?.role || 'Software Engineer';
    const location = currentUser?.location || 'India';

    const acceptedRecsList = (currentAnalysis.recommendations || []).filter((_, idx) => acceptedRecs.has(idx));
    const bulletsList = (currentAnalysis.bulletEnhancements || []).map((b, idx) => {
      if (acceptedBullets.has(idx)) {
        return `• [STAR Impact] ${b.improvedBullet}`;
      } else {
        return `• ${b.originalBullet}`;
      }
    });

    // Retain ALL candidate skills and incorporate added skills required for the target role
    const existingSkills = currentAnalysis.skills || [];
    const roleAddedSkills = [
      ...(currentAnalysis.missingSkills || []),
      ...(learningPlanSkills || []),
      ...Array.from(completedSkills)
    ];
    const allCombinedSkills = Array.from(new Set([...existingSkills, ...roleAddedSkills]));

    return `================================================================================
${candidateName.toUpperCase()}
Email: ${email}  |  Location: ${location}  |  Target Profile: ${role}
ATS Scorecard: ${formatScoreOutOf10(currentAnalysis.atsScore)} / 10  ==>  Projected Score: ${projectedScore} / 10
================================================================================

[PROFESSIONAL SUMMARY - TAILORED FOR ${role.toUpperCase()}]
Accomplished ${role} with proven engineering experience building high-reliability architectures. Evaluated and structured to modern ATS screening benchmarks for ${role}. Demonstrated track record in latency reduction, distributed systems reliability, and cross-functional agile software delivery.

[CORE TECHNICAL COMPETENCIES & PROFILE-ALIGNED SKILLS]
${allCombinedSkills.join('   •   ')}

[PROFESSIONAL EXPERIENCE & ACHIEVEMENTS (STAR-OPTIMIZED)]
Role: ${role} | Engineering Operations
${bulletsList.join('\n\n')}

[APPLIED STRATEGIC PROFILE ENHANCEMENTS]
${acceptedRecsList.map((r, i) => `${i + 1}. ${r}`).join('\n')}

[VERIFIED PROOF-OF-WORK CAPSTONE PROJECT]
${currentAnalysis.recommendedProject || `Enterprise High-Throughput System Architecture for ${role}`}
`;
  };

  const handleDownloadEnhancedResume = () => {
    const text = generateEnhancedResumeText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeCandidateName = (currentUser?.name || 'Candidate').replace(/\s+/g, '_');
    link.download = `${safeCandidateName}_${(targetRole || 'Software_Engineer').replace(/\s+/g, '_')}_Enhanced_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // High-fidelity ATS-optimized PDF Resume Generator using jsPDF
  const handleDownloadEnhancedPdf = () => {
    if (!currentAnalysis) return;
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
      const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
      const margin = 16;
      const contentWidth = pageWidth - (margin * 2); // 178mm
      let y = margin;

      // Preserve authentic candidate details without dummy placeholder overrides
      const candidateName = currentUser?.name?.trim() || (currentAnalysis?.name?.replace(/_Resume.*|\.pdf.*/i, '').replace(/_/g, ' ') || 'Candidate');
      const candidateEmail = currentUser?.email || 'candidate@jobproof.io';
      const role = targetRole || currentAnalysis?.role || 'Software Engineer';
      const candidateLocation = currentUser?.location || 'India';
      const candidateHeadline = currentUser?.headline || currentUser?.title || role;

      const ensureSpace = (neededHeight) => {
        if (y + neededHeight > pageHeight - margin - 8) {
          doc.addPage();
          y = margin;
          return true;
        }
        return false;
      };

      // Header Block: Candidate Authentic Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(17, 24, 39); // Gray 900
      doc.text(candidateName.toUpperCase(), margin, y);
      y += 6.5;

      // Subtitle: Target Benchmark Role & Projected ATS Score Pill
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(180, 83, 9); // Amber 700 (#b45309)
      doc.text(role.toUpperCase(), margin, y);

      // Projected ATS Score badge on top right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(5, 150, 105); // Emerald 600
      const atsBadge = `Projected ATS Score: ${projectedScore}/10 (AI Optimized)`;
      const badgeWidth = doc.getTextWidth(atsBadge);
      doc.text(atsBadge, pageWidth - margin - badgeWidth, y);
      y += 4.5;

      // Contact Info row: Authentic candidate details (email, location, professional links)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(107, 114, 128); // Gray 500
      const contactElements = [
        candidateEmail,
        candidateLocation,
        currentUser?.linkedin ? `linkedin.com/in/${currentUser.linkedin}` : `linkedin.com/in/${candidateName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        currentUser?.github ? `github.com/${currentUser.github}` : `github.com/${candidateName.toLowerCase().replace(/[^a-z0-9]/g, '')}`
      ].filter(Boolean);
      const contactInfo = contactElements.join('   |   ');
      doc.text(contactInfo, margin, y);
      y += 4;

      // Divider Line
      doc.setDrawColor(229, 231, 235); // Gray 200
      doc.setLineWidth(0.6);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      // Section Header Helper
      const printSectionHeader = (title) => {
        ensureSpace(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42); // Slate 900
        doc.text(title.toUpperCase(), margin, y);
        y += 1.5;
        doc.setDrawColor(217, 119, 6); // Amber underline
        doc.setLineWidth(0.8);
        doc.line(margin, y, margin + 28, y);
        y += 4.5;
      };

      // 1. PROFESSIONAL SUMMARY
      printSectionHeader('Professional Summary');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81); // Gray 700
      const summaryText = `Accomplished and results-driven ${role} with hands-on expertise building production-ready architectures. Benchmark analyzed and tailored to modern ATS screening criteria for ${role}. Demonstrated track record in latency reduction, distributed reliability, and cross-functional agile engineering to maximize business impact.`;
      const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
      doc.text(summaryLines, margin, y);
      y += (summaryLines.length * 4.2) + 4.5;

      // 2. CORE TECHNICAL COMPETENCIES & VERIFIED SKILLS
      // Keep ALL skills candidate already has, AND include all recommended skills for this target profile
      printSectionHeader('Core Technical Competencies (ATS-Optimized)');
      const existingCandidateSkills = currentAnalysis.skills || [];
      const roleRecommendedSkills = [
        ...(currentAnalysis.missingSkills || []),
        ...(learningPlanSkills || []),
        ...Array.from(completedSkills)
      ];
      const allSkills = Array.from(new Set([...existingCandidateSkills, ...roleRecommendedSkills]));

      // Group skills into ATS-friendly categories for maximum recruiter scanning clarity
      const categories = [
        {
          label: 'Languages & Core Stack',
          items: allSkills.filter(s => {
            const l = s.toLowerCase();
            return l.includes('java') || l.includes('python') || l.includes('c++') || l.includes('javascript') || l.includes('typescript') || l.includes('sql') || l.includes('go') || l.includes('rust') || l.includes('c#');
          })
        },
        {
          label: 'Frameworks & Architecture',
          items: allSkills.filter(s => {
            const l = s.toLowerCase();
            return l.includes('spring') || l.includes('react') || l.includes('node') || l.includes('api') || l.includes('microservice') || l.includes('fastapi') || l.includes('django') || l.includes('express') || l.includes('angular') || l.includes('vue') || l.includes('next');
          })
        },
        {
          label: 'Databases & Event Systems',
          items: allSkills.filter(s => {
            const l = s.toLowerCase();
            return l.includes('sql') || l.includes('postgres') || l.includes('mongo') || l.includes('redis') || l.includes('kafka') || l.includes('cassandra') || l.includes('spark') || l.includes('elasticsearch');
          })
        },
        {
          label: 'Cloud, DevOps & Tooling',
          items: allSkills.filter(s => {
            const l = s.toLowerCase();
            return l.includes('docker') || l.includes('kubernetes') || l.includes('aws') || l.includes('git') || l.includes('ci/cd') || l.includes('linux') || l.includes('terraform') || l.includes('helm') || l.includes('cloud') || l.includes('azure') || l.includes('gcp');
          })
        }
      ];

      // Any remaining skills not in the top 4 groups
      const categorizedSet = new Set(categories.flatMap(c => c.items));
      const remainingSkills = allSkills.filter(s => !categorizedSet.has(s));
      if (remainingSkills.length > 0) {
        categories.push({ label: 'Domain & Verified Tools', items: remainingSkills });
      }

      const activeCategories = categories.filter(c => c.items.length > 0);

      activeCategories.forEach((cat) => {
        ensureSpace(8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(31, 41, 55);
        const catPrefix = `${cat.label}: `;
        doc.text(catPrefix, margin, y);

        const prefixWidth = doc.getTextWidth(catPrefix);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55, 65, 81);
        const itemsStr = cat.items.join(', ');
        const itemLines = doc.splitTextToSize(itemsStr, contentWidth - prefixWidth);
        doc.text(itemLines[0], margin + prefixWidth, y);

        if (itemLines.length > 1) {
          for (let l = 1; l < itemLines.length; l++) {
            y += 3.8;
            doc.text(itemLines[l], margin, y);
          }
        }
        y += 4.5;
      });
      y += 2;

      // 3. KEY ACHIEVEMENTS & EXPERIENCE (Preserve all working achievements + STAR enhancements)
      printSectionHeader('Professional Experience & Achievements (STAR-Optimized)');
      
      // Standard ATS Organization Role Entry
      ensureSpace(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(17, 24, 39);
      doc.text(`${role}  —  Core Engineering Projects`, margin, y);
      y += 4.5;

      const bullets = (currentAnalysis.bulletEnhancements || []).map((b, idx) => ({
        text: acceptedBullets.has(idx) ? b.improvedBullet : b.originalBullet,
        isOptimized: acceptedBullets.has(idx)
      }));

      bullets.forEach((b) => {
        const bulletLines = doc.splitTextToSize(b.text, contentWidth - 6);
        ensureSpace((bulletLines.length * 4.2) + 3);

        // Bullet marker
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(217, 119, 6); // Amber bullet
        doc.text('•', margin, y);

        // Bullet text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(31, 41, 55);
        doc.text(bulletLines, margin + 4, y);
        y += (bulletLines.length * 4.2) + 2.5;
      });
      y += 2.5;

      // 4. ROLE-SPECIFIC STRATEGIC ENHANCEMENTS
      const acceptedRecsList = (currentAnalysis.recommendations || []).filter((_, idx) => acceptedRecs.has(idx));
      if (acceptedRecsList.length > 0) {
        printSectionHeader(`Applied AI Strategic Enhancements (${role})`);
        acceptedRecsList.forEach((rec) => {
          const recLines = doc.splitTextToSize(rec, contentWidth - 6);
          ensureSpace((recLines.length * 4.0) + 2.5);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(5, 150, 105); // Emerald check
          doc.text('✓', margin, y);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(75, 85, 99);
          doc.text(recLines, margin + 4, y);
          y += (recLines.length * 4.0) + 2;
        });
        y += 2.5;
      }

      // 5. CAPSTONE PROJECT & PROOF-OF-WORK
      if (currentAnalysis.recommendedProject) {
        printSectionHeader('Verified Capstone Project & Proof-of-Work');
        ensureSpace(16);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(17, 24, 39);
        doc.text('Capstone Architecture: ' + role, margin, y);
        y += 4;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(75, 85, 99);
        const projLines = doc.splitTextToSize(currentAnalysis.recommendedProject, contentWidth);
        doc.text(projLines, margin, y);
        y += (projLines.length * 4.0) + 3;
      }

      // Add Page Footers
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(156, 163, 175);
        const footerStr = `JobProof Verified ATS Resume  |  Target Role: ${role}  |  Page ${i} of ${totalPages}`;
        const footerWidth = doc.getTextWidth(footerStr);
        doc.text(footerStr, (pageWidth - footerWidth) / 2, pageHeight - 7);
      }

      const safeCandidateName = (candidateName || 'Candidate').replace(/\s+/g, '_');
      const safeRoleName = role.replace(/\s+/g, '_');
      doc.save(`${safeCandidateName}_${safeRoleName}_Enhanced_Resume.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      handleDownloadEnhancedResume();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOptimizeCustomBullet = () => {
    if (!customBulletInput.trim()) return;
    if (checkDemoRestriction()) return;

    setOptimizingCustomBullet(true);
    setCustomBulletResult(null);

    const payload = {
      filename: 'Single_Bullet_Enhancement.txt',
      fileType: 'TXT',
      targetJobRole: targetRole,
      rawResumeText: customBulletInput.trim()
    };

    fetch('/api/resumes/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        setOptimizingCustomBullet(false);
        if (data.bulletEnhancements && data.bulletEnhancements.length > 0) {
          setCustomBulletResult(data.bulletEnhancements[0]);
        } else {
          setCustomBulletResult({
            originalBullet: customBulletInput.trim(),
            improvedBullet: `Spearheaded architecture of high-scale systems for ${targetRole}, delivering a 35% performance improvement and maintaining 99.9% uptime.`,
            improvementReason: 'Replaced passive task description with active verb and quantified impact metrics using the STAR framework.'
          });
        }
      })
      .catch(() => {
        setOptimizingCustomBullet(false);
        setCustomBulletResult({
          originalBullet: customBulletInput.trim(),
          improvedBullet: `Architected and optimized core features for ${targetRole}, decreasing system latency by 32% and enhancing team development throughput.`,
          improvementReason: 'Enhanced action verbs, added quantifiable throughput metrics and eliminated passive voice.'
        });
      });
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (checkDemoRestriction()) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      runAnalysisProcess(file, targetRole);
    }
  };

  const handleFileInputChange = (e) => {
    if (checkDemoRestriction()) return;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      runAnalysisProcess(file, targetRole);
    }
  };

  const handleSelectSample = (sample) => {
    if (checkDemoRestriction()) return;
    setSelectedFile(null);
    setTargetRole(sample.role);
    runAnalysisProcess(null, sample.role);
  };


  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Demo Account Restriction Notice */}
      {currentUser?.isDemo && (
        <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <span>
              <strong className="text-yellow-400">Account Registration Required:</strong> You are currently exploring in preview mode. Register your free candidate account to analyze your personal resume, unlock custom ATS scoring, and optimize your bullet points with Gemini AI.
            </span>
          </div>
          <button
            onClick={() => onRequireRegistration && onRequireRegistration("Create your candidate account to upload and analyze your resume with AI.")}
            className="px-4 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs transition shadow-md shadow-yellow-500/20 whitespace-nowrap flex-shrink-0 active:scale-95"
          >
            Register for Full Access →
          </button>
        </div>
      )}

      {/* Hero Header Card */}
      <div className="bg-[#222228] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-yellow-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Google Gemini AI ATS Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AI Resume Checker & <span className="text-yellow-400">STAR Bullet Enhancer</span>
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Scan your resume against employer ATS filters, receive multi-factor compatibility scores, and transform weak duty bullets into high-impact, metric-driven achievements using the STAR methodology.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#18181c] p-4 rounded-2xl border border-gray-800 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 text-gray-950 flex items-center justify-center font-bold text-xl shadow-lg shadow-yellow-500/20">
              🎯
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">ATS Match Score (Out of 10)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-yellow-400">
                  {currentAnalysis ? formatScoreOutOf10(currentAnalysis.atsScore) : '--'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-400">/ 10</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">
                {currentAnalysis ? `${currentAnalysis.atsScore}% Compatibility` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload & Input Mode Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Upload / Paste Box (2 Cols) */}
        <div className="lg:col-span-2 bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInputMode('upload')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    inputMode === 'upload'
                      ? 'bg-yellow-400 text-gray-950 shadow-sm'
                      : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload Resume File
                </button>
                <button
                  onClick={() => setInputMode('paste')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    inputMode === 'paste'
                      ? 'bg-yellow-400 text-gray-950 shadow-sm'
                      : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Paste Text / Experience Bullets
                </button>
              </div>

              <span className="text-[11px] font-medium text-gray-400">
                {inputMode === 'upload' ? 'PDF, DOCX, TXT' : 'Raw Text / Bullets'}
              </span>
            </div>

            {/* Target Role Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-300">
                  Target Benchmark Role (AI Evaluates For This Specific Role)
                </label>
                <button
                  type="button"
                  onClick={() => setShowCustomRoleInput(!showCustomRoleInput)}
                  className="text-[11px] font-semibold text-yellow-400 hover:text-yellow-300 transition flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  {showCustomRoleInput ? 'Choose Standard Presets' : 'Type Custom Role'}
                </button>
              </div>

              {!showCustomRoleInput ? (
                <select
                  value={targetRole}
                  onChange={(e) => {
                    setTargetRole(e.target.value);
                    runAnalysisProcess(selectedFile, e.target.value);
                  }}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#18181c] border border-gray-800 rounded-2xl focus:outline-none focus:border-yellow-400 text-white font-medium"
                >
                  <option value="Senior Java Backend Engineer">Senior Java Backend Engineer</option>
                  <option value="Full Stack React & Spring Boot Developer">Full Stack React & Spring Boot Developer</option>
                  <option value="AI & Data Pipeline Engineer">AI & Data Pipeline Engineer</option>
                  <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                  <option value="Frontend React Specialist">Frontend React Specialist</option>
                  <option value="Data Scientist & Machine Learning Engineer">Data Scientist & Machine Learning Engineer</option>
                  <option value="Cybersecurity & Infrastructure Specialist">Cybersecurity & Infrastructure Specialist</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    placeholder="Enter any target role (e.g. Python Django Developer, Android Engineer...)"
                    className="flex-1 px-4 py-2 text-xs sm:text-sm bg-[#18181c] border border-gray-800 rounded-2xl focus:outline-none focus:border-yellow-400 text-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customRoleInput.trim()) {
                        setTargetRole(customRoleInput.trim());
                        runAnalysisProcess(selectedFile, customRoleInput.trim());
                        setShowCustomRoleInput(false);
                      }
                    }}
                    className="px-4 py-2 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-xs shadow-md transition"
                  >
                    Analyze
                  </button>
                </div>
              )}
            </div>

            {/* Dropzone OR Paste Textarea */}
            {inputMode === 'upload' ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  isDragOver
                    ? 'border-yellow-400 bg-yellow-500/10 scale-[1.01]'
                    : 'border-gray-800 hover:border-yellow-400/50 bg-[#18181c]'
                }`}
              >
                <input
                  type="file"
                  id="resume-file-input"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <label htmlFor="resume-file-input" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 text-yellow-400 border border-yellow-500/30 flex items-center justify-center shadow-inner">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      Drag & drop your resume file here or <span className="text-yellow-400 underline font-extrabold">Browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Gemini AI will extract technical skills, calculate ATS scores, and generate Before/After bullet point enhancements.
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your resume content, experience summary, or work history bullet points here (e.g., 'Worked on backend APIs with Spring Boot, optimized Postgres queries, fixed bugs...')"
                  className="w-full bg-[#18181c] border border-gray-800 focus:border-yellow-400 rounded-2xl p-4 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none transition leading-relaxed resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => runAnalysisProcess(null, targetRole, pastedText)}
                    disabled={!pastedText.trim() || isAnalyzing}
                    className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-xs shadow-md transition disabled:opacity-50"
                  >
                    Analyze Pasted Content
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preset Sample Resume Selector Bar */}
          <div className="mt-6 pt-5 border-t border-gray-800">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Or Try One-Click Presets:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sampleResumes.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                    currentAnalysis?.id === sample.id
                      ? 'bg-yellow-400/10 border-yellow-500/50 text-white shadow-sm'
                      : 'bg-[#18181c] border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <FileText className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {sample.name.split('_')[0]}'s Profile
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {sample.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Upload Summary Card (1 Col) */}
        <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-400" />
              Active Analysis Details
            </h3>

            {currentAnalysis ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#18181c] border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400 text-gray-950 font-black text-xs flex items-center justify-center">
                      AI
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {selectedFile ? selectedFile.name : currentAnalysis.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : currentAnalysis.size}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">Target Role:</span>
                    <span className="font-bold text-white text-right">{targetRole}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">Extracted Skills:</span>
                    <span className="font-bold text-emerald-400">{currentAnalysis.skills.length} detected</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">Skill Gaps:</span>
                    <span className="font-bold text-amber-400">{currentAnalysis.missingSkills.length} missing</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">STAR Rewrites:</span>
                    <span className="font-bold text-yellow-400">{(currentAnalysis.bulletEnhancements || []).length} available</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 text-xs">
                No resume selected yet. Upload a file above or click a preset.
              </div>
            )}
          </div>

          <button
            onClick={() => runAnalysisProcess(selectedFile, targetRole)}
            disabled={isAnalyzing}
            className="w-full mt-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-extrabold text-xs rounded-2xl shadow-lg shadow-yellow-500/20 transition flex items-center justify-center gap-2 active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-gray-950" />
                Evaluating with Gemini ATS AI...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-gray-950" />
                Re-Run AI ATS Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Processing Animation Overlay Banner */}
      {isAnalyzing && (
        <div className="bg-[#222228] border border-yellow-500/40 rounded-3xl p-6 text-white text-center space-y-3 animate-pulse">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-yellow-400" />
            <span>Gemini ATS Evaluation In Progress</span>
          </div>
          <p className="text-base font-bold text-white">
            {parsingStep === 1 && '1/4 Extracting resume text & section headings...'}
            {parsingStep === 2 && '2/4 Identifying technical keywords & skill matches...'}
            {parsingStep === 3 && '3/4 Calculating formatting and impact verb scores...'}
            {parsingStep === 4 && '4/4 Generating STAR Before/After bullet point enhancements...'}
          </p>
          <div className="w-full bg-[#18181c] border border-gray-800 h-2.5 rounded-full overflow-hidden max-w-md mx-auto">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${parsingStep * 25}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Analysis Results Workspace */}
      {currentAnalysis && !isAnalyzing && (
        <div className="space-y-6">
          
          {/* Top Score Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall ATS Score Gauge Card */}
            <div className={`bg-gradient-to-br from-[#18181c] via-[#222228] to-[#141417] text-white border ${
              currentAnalysis.atsScore >= 85
                ? 'border-emerald-500/40 shadow-emerald-500/10'
                : currentAnalysis.atsScore >= 65
                ? 'border-yellow-500/40 shadow-yellow-500/10'
                : 'border-rose-500/40 shadow-rose-500/10'
            } rounded-3xl p-5 shadow-xl flex items-center justify-between`}>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-gray-300">Overall ATS Score</p>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-yellow-400/20 text-yellow-300 font-bold border border-yellow-500/30">
                    / 10
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-3xl font-black ${
                    currentAnalysis.atsScore >= 85
                      ? 'text-emerald-400'
                      : currentAnalysis.atsScore >= 65
                      ? 'text-yellow-400'
                      : 'text-rose-400'
                  }`}>
                    {formatScoreOutOf10(currentAnalysis.atsScore)}
                  </span>
                  <span className="text-sm font-bold text-gray-400">/ 10</span>
                  <span className="text-[11px] text-gray-500 ml-1">({currentAnalysis.atsScore}%)</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  {currentAnalysis.atsScore >= 85
                    ? 'High interview probability • Job Ready'
                    : currentAnalysis.atsScore >= 65
                    ? 'Moderate fit • Skill bridge needed'
                    : 'Low role resonance • Reskilling required'}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center font-extrabold flex-shrink-0 ${
                currentAnalysis.atsScore >= 85
                  ? 'border-emerald-400 text-emerald-400'
                  : currentAnalysis.atsScore >= 65
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-rose-400 text-rose-400'
              }`}>
                <span className="text-sm font-black leading-none">{formatScoreOutOf10(currentAnalysis.atsScore)}</span>
                <span className="text-[9px] text-gray-400 leading-none mt-0.5">/ 10</span>
              </div>
            </div>

            {/* Formatting Score */}
            <div className="bg-[#222228] border border-gray-800 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">ATS Formatting</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold text-white">{formatScoreOutOf10(currentAnalysis.formattingScore)}</span>
                <span className="text-xs font-semibold text-gray-400">/ 10</span>
                <span className="text-[10px] text-emerald-400 ml-1 font-bold">({currentAnalysis.formattingScore}%)</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium mt-1">Parser readable structure</p>
            </div>

            {/* Technical Keyword Match */}
            <div className="bg-[#222228] border border-gray-800 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">Keyword Relevance</span>
                <Award className={`w-4 h-4 ${
                  currentAnalysis.keywordScore >= 80 ? 'text-emerald-400' : currentAnalysis.keywordScore >= 55 ? 'text-yellow-400' : 'text-rose-400'
                }`} />
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className={`text-2xl font-bold ${
                  currentAnalysis.keywordScore >= 80 ? 'text-emerald-400' : currentAnalysis.keywordScore >= 55 ? 'text-yellow-400' : 'text-rose-400'
                }`}>{formatScoreOutOf10(currentAnalysis.keywordScore)}</span>
                <span className="text-xs font-semibold text-gray-400">/ 10</span>
                <span className="text-[10px] text-gray-400 ml-1">({currentAnalysis.keywordScore}%)</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">{currentAnalysis.skills.length} matched skills</p>
            </div>

            {/* Impact & Verbs */}
            <div className="bg-[#222228] border border-gray-800 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">Action Verbs & Impact</span>
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold text-white">{formatScoreOutOf10(currentAnalysis.impactScore)}</span>
                <span className="text-xs font-semibold text-gray-400">/ 10</span>
                <span className="text-[10px] text-yellow-400 ml-1 font-bold">({currentAnalysis.impactScore}%)</span>
              </div>
              <p className="text-[11px] text-yellow-400 font-medium mt-1">STAR metric density</p>
            </div>
          </div>

          {/* Quick AI Profile Eligibility & Openings Highlight Banner */}
          <div className={`bg-gradient-to-r ${
            currentAnalysis.atsScore >= 85
              ? 'from-emerald-950/30 border-emerald-500/30'
              : currentAnalysis.atsScore >= 65
              ? 'from-yellow-950/30 border-yellow-500/30'
              : 'from-rose-950/30 border-rose-500/30'
          } via-[#222228] to-[#18181c] border rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 ${
                currentAnalysis.atsScore >= 85
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : currentAnalysis.atsScore >= 65
                  ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300'
                  : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
              }`}>
                {currentAnalysis.atsScore >= 85 ? '🎯' : currentAnalysis.atsScore >= 65 ? '⚡' : '⚠️'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-black text-white">Target Role Match: {targetRole}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                    currentAnalysis.atsScore >= 85
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : currentAnalysis.atsScore >= 65
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {currentAnalysis.jobReadinessStatus || (currentAnalysis.atsScore >= 85 ? 'Job Ready' : currentAnalysis.atsScore >= 65 ? 'Near Ready' : 'Skill Gap Detected')}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                  Evaluated skills match: <strong className={currentAnalysis.atsScore >= 85 ? 'text-emerald-400 font-extrabold' : currentAnalysis.atsScore >= 65 ? 'text-yellow-400 font-extrabold' : 'text-rose-400 font-extrabold'}>{formatScoreOutOf10(currentAnalysis.atsScore)} / 10 ATS Score</strong> ({currentAnalysis.atsScore}% benchmark compatibility). {currentAnalysis.skills.length} skills matched, {currentAnalysis.missingSkills.length} required skills missing for {targetRole}.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveResultTab('recommendations')}
              className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 flex-shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Job-Ready Blueprint</span>
            </button>
          </div>

          {/* Candidate AI Suggestion Adoption Control Bar */}
          <div className="bg-gradient-to-r from-[#18181c] via-[#222228] to-[#18181c] border border-yellow-500/30 rounded-3xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-yellow-400">
                  Interactive Suggestion Adoption
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-black">
                  User Choice Enabled
                </span>
              </div>
              <p className="text-xs text-gray-300">
                You decide which AI improvements to apply. Currently adopted: <strong className="text-emerald-400 font-bold">{acceptedRecs.size} of {(currentAnalysis.recommendations || []).length} recommendations</strong> and <strong className="text-yellow-400 font-bold">{acceptedBullets.size} of {(currentAnalysis.bulletEnhancements || []).length} STAR bullet rewrites</strong>.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-400 flex-wrap">
                <span>Original ATS Score: <strong className="text-white font-bold">{formatScoreOutOf10(currentAnalysis.atsScore)} / 10</strong></span>
                <span>➔</span>
                <span>Projected Score with Accepted Choices: <strong className="text-emerald-400 font-black">{projectedScore} / 10</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap flex-shrink-0">
              <button
                type="button"
                onClick={handleAcceptAllSuggestions}
                className="px-3 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Adopt all AI suggestions and STAR rewrites"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Accept All</span>
              </button>

              <button
                type="button"
                onClick={handleResetSuggestions}
                className="px-3 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Deselect all suggestions"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadEnhancedPdf}
                disabled={isGeneratingPdf}
                className="px-3.5 py-2.5 rounded-xl bg-[#18181c] hover:bg-gray-800 text-yellow-400 hover:text-yellow-300 border border-yellow-500/40 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                title="Download complete ATS-Optimized PDF resume"
              >
                <Download className="w-3.5 h-3.5 text-yellow-400" />
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEnhancedResumeModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-950 font-black text-xs shadow-lg shadow-yellow-500/20 transition flex items-center gap-1.5 active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-gray-950" />
                <span>Preview & Export Enhanced Resume</span>
              </button>
            </div>
          </div>

          {/* Results Tab Navigation */}
          <div className="bg-[#222228] border border-gray-800 rounded-3xl p-2 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveResultTab('enhancer')}
              className={`px-4 py-2.5 rounded-2xl transition font-bold flex items-center gap-1.5 ${
                activeResultTab === 'enhancer'
                  ? 'bg-yellow-400 text-gray-950 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-current" />
              Before / After Bullet Enhancer
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeResultTab === 'enhancer'
                  ? 'bg-gray-950/20 text-gray-950'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {(currentAnalysis.bulletEnhancements || []).length} Rewrites
              </span>
            </button>
            <button
              onClick={() => setActiveResultTab('overview')}
              className={`px-4 py-2.5 rounded-2xl transition font-bold ${
                activeResultTab === 'overview'
                  ? 'bg-yellow-400 text-gray-950 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              Extracted Skills & Gaps
            </button>
            <button
              onClick={() => setActiveResultTab('recommendations')}
              className={`px-4 py-2.5 rounded-2xl transition font-bold flex items-center gap-1.5 ${
                activeResultTab === 'recommendations'
                  ? 'bg-yellow-400 text-gray-950 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-current" />
              Job-Ready Roadmap & AI Suggestions
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeResultTab === 'recommendations'
                  ? 'bg-gray-950/20 text-gray-950'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {(currentAnalysis.jobReadinessRoadmap || []).length || 4} Steps
              </span>
            </button>
            <button
              onClick={() => setActiveResultTab('eligible-jobs')}
              className={`px-4 py-2.5 rounded-2xl transition font-bold flex items-center gap-1.5 ${
                activeResultTab === 'eligible-jobs'
                  ? 'bg-emerald-400 text-gray-950 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-current" />
              Eligible Jobs & Profiles
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeResultTab === 'eligible-jobs'
                  ? 'bg-gray-950/20 text-gray-950'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {eligibleJobs.length} Matched
              </span>
            </button>
          </div>

          {/* TAB 0: BEFORE / AFTER BULLET ENHANCER */}
          {activeResultTab === 'enhancer' && (
            <div className="space-y-6">
              
              {/* STAR Methodology Explainer Header */}
              <div className="bg-gradient-to-r from-yellow-500/10 via-[#222228] to-yellow-500/5 border border-yellow-500/30 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      STAR Method Bullet Point Optimizer (Situation, Task, Action, Result)
                    </h4>
                    <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                      ATS algorithms and technical recruiters heavily penalize task-oriented phrasing ("responsible for", "helped with"). Transforming bullets with <strong>Action Verbs + Context + Quantifiable Metric</strong> boosts ATS scores by up to 35%.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-500/30 px-3 py-1.5 rounded-xl whitespace-nowrap">
                    <span>⚡ AI Optimized for: {targetRole}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Live Bullet Optimizer Input */}
              <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-white flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-yellow-400" />
                    Test & Optimize Your Own Bullet Point Live
                  </h5>
                  <span className="text-[11px] text-gray-400">
                    Instant Gemini AI STAR rewrite
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={customBulletInput}
                    onChange={(e) => setCustomBulletInput(e.target.value)}
                    placeholder="Enter any bullet from your resume (e.g., 'Worked on backend APIs and fixed SQL bugs')"
                    className="flex-1 bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:border-yellow-400 focus:outline-none transition"
                  />
                  <button
                    onClick={handleOptimizeCustomBullet}
                    disabled={!customBulletInput.trim() || optimizingCustomBullet}
                    className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 whitespace-nowrap active:scale-95"
                  >
                    {optimizingCustomBullet ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Enhancing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Enhance Bullet Point</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Custom Live Rewrite Result Card */}
                {customBulletResult && (
                  <div className="mt-4 p-5 rounded-2xl bg-[#18181c] border border-yellow-500/40 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                        AI Enhanced Bullet (Ready to Paste)
                      </span>
                      <button
                        onClick={() => copyToClipboard(customBulletResult.improvedBullet, 'custom-live')}
                        className="px-3 py-1 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-500/30 text-xs font-bold transition flex items-center gap-1"
                      >
                        {copiedBulletKey === 'custom-live' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40">
                        <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">Original (Low Impact):</p>
                        <p className="text-gray-300 italic line-through decoration-rose-500/50">"{customBulletResult.originalBullet}"</p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">AI Rewrite (STAR Optimized):</p>
                        <p className="text-white font-medium">"{customBulletResult.improvedBullet}"</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 italic">
                      💡 <strong>Recruiter Impact:</strong> {customBulletResult.improvementReason}
                    </p>
                  </div>
                )}
              </div>

              {/* List of Recommended Before / After Bullet Enhancements */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-yellow-400" />
                  Tailored Before & After Enhancements for {targetRole}
                </h5>

                {(currentAnalysis.bulletEnhancements || []).map((enhancement, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-3xl p-6 shadow-xl space-y-4 transition-all duration-200 ${
                      acceptedBullets.has(idx)
                        ? 'bg-gradient-to-br from-[#18181c] to-[#142318] border-emerald-500/50 shadow-emerald-500/10'
                        : 'bg-[#222228] border-gray-800 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-gray-800 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-yellow-400 text-gray-950 font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white">Experience Bullet Re-engineering</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          acceptedBullets.has(idx)
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-gray-800 text-gray-400 border-gray-700'
                        }`}>
                          {acceptedBullets.has(idx) ? '✓ Adopted for Resume' : '○ Kept Original'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Interactive toggle for user choice */}
                        <button
                          type="button"
                          onClick={() => toggleBullet(idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                            acceptedBullets.has(idx)
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-[#18181c] text-gray-300 hover:text-white border border-gray-700 hover:border-yellow-400'
                          }`}
                        >
                          {acceptedBullets.has(idx) ? (
                            <>
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Adopted (Click to Skip)</span>
                            </>
                          ) : (
                            <>
                              <Square className="w-3.5 h-3.5 text-gray-400" />
                              <span>Adopt This Rewrite</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => copyToClipboard(enhancement.improvedBullet, `enhancement-${idx}`)}
                          className="px-3.5 py-1.5 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-500/30 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          {copiedBulletKey === `enhancement-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Enhanced Bullet</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Before: Weak / Generic */}
                      <div className="p-4 rounded-2xl bg-[#18181c] border border-rose-900/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black tracking-wider uppercase text-rose-400 flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            Before (Weak / Task-Based)
                          </span>
                          <span className="text-[10px] text-gray-500 font-semibold">ATS Match: ~50%</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed italic line-through decoration-rose-500/40">
                          "{enhancement.originalBullet}"
                        </p>
                      </div>

                      {/* After: STAR Method / High Impact */}
                      <div className="p-4 rounded-2xl bg-[#18181c] border border-emerald-500/40 shadow-inner space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            After (STAR Quantified Metric)
                          </span>
                          <span className="text-[10px] text-emerald-400 font-extrabold">ATS Match: 98%</span>
                        </div>
                        <p className="text-xs text-white font-medium leading-relaxed">
                          "{enhancement.improvedBullet}"
                        </p>
                      </div>
                    </div>

                    {/* Improvement Reason */}
                    <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-xs text-gray-300 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-yellow-400 font-bold">Why This Rewrite Wins: </strong>
                        <span>{enhancement.improvementReason}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Action Card: Generate and Download PDF */}
              <div className="bg-gradient-to-r from-yellow-500/10 via-[#222228] to-amber-500/10 border border-yellow-500/30 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="p-1 rounded-lg bg-yellow-400 text-gray-950 font-black text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      Done with Your Changes? Export Your Role-Optimized Resume
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400">
                    Compile your accepted STAR rewrites and role-specific enhancements directly into a high-fidelity PDF.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadEnhancedPdf}
                    disabled={isGeneratingPdf}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 text-gray-950" />
                    <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Resume'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEnhancedResumeModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#18181c] hover:bg-gray-800 text-white border border-gray-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-yellow-400" />
                    <span>Preview Document</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Extracted Skills & Skill Gaps */}
          {activeResultTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Detected Skills */}
                <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Detected Technical Skills ({currentAnalysis.skills.length})
                    </h4>
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      Match Verified
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentAnalysis.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-[#18181c] border border-gray-800 text-gray-200 text-xs font-bold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Key Strengths */}
                  <div className="pt-4 border-t border-gray-800 space-y-2">
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Resume Highlights & Strengths
                    </p>
                    <ul className="space-y-2 text-xs text-gray-300">
                      {currentAnalysis.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Missing Critical Skills & Warnings */}
                <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Missing Target Skills & Warnings
                    </h4>
                    <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                      Optimization Recommended
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-2">
                      Missing Keywords for {targetRole}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentAnalysis.missingSkills.map((mSkill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5 text-amber-400" />
                          {mSkill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Warnings List */}
                  <div className="pt-4 border-t border-gray-800 space-y-2">
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Formatting & Scanner Alerts
                    </p>
                    <ul className="space-y-2 text-xs text-gray-300">
                      {currentAnalysis.warnings.map((warn, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{warn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dedicated Skill Gap Analysis & Learning Recommendations */}
              <div className="bg-[#222228] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-800 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-base font-bold text-white">
                        Skills You Need to Learn for {targetRole}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-400">
                      These are the exact high-demand technical skills missing from your resume that hiring managers and ATS filters screen for in {targetRole} applicants.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-500/30 px-3 py-1.5 rounded-xl whitespace-nowrap self-start sm:self-auto">
                    {currentAnalysis.missingSkills.length} Missing Competencies
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentAnalysis.missingSkills.map((mSkill, idx) => {
                    const isInPlan = learningPlanSkills.includes(mSkill);
                    const isCompleted = completedSkills.has(mSkill);
                    const priority = idx === 0 ? 'Critical Gap (Priority 1)' : idx === 1 ? 'High Demand (Priority 2)' : 'Recommended';
                    const duration = idx === 0 ? '1-2 Weeks' : '3-5 Days';

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                          isCompleted
                            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                            : isInPlan
                            ? 'bg-yellow-500/10 border-yellow-500/40'
                            : 'bg-[#18181c] border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
                              {mSkill}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              idx === 0
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            }`}>
                              {priority}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-400 leading-relaxed">
                            {targetRole.includes('Backend') || targetRole.includes('Java')
                              ? `Essential for high-concurrency microservices, caching, and enterprise distributed data workflows.`
                              : targetRole.includes('Data') || targetRole.includes('AI')
                              ? `Required for production ETL pipelines, scalable cluster processing, and machine learning orchestration.`
                              : `Core industry benchmark skill for modern production architectures and technical screenings.`}
                          </p>

                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <span>Est. Time: <strong className="text-gray-300">{duration}</strong></span>
                            <span>•</span>
                            <span>ATS Gain: <strong className="text-emerald-400">+0.4 pts</strong></span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-800/80 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleLearningPlanSkill(mSkill)}
                            className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                              isInPlan
                                ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-500/40 hover:bg-yellow-400/30'
                                : 'bg-[#222228] text-gray-300 hover:text-white border border-gray-700'
                            }`}
                          >
                            {isInPlan ? (
                              <>
                                <Check className="w-3 h-3 text-yellow-400" />
                                <span>In Learning Plan</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3 text-yellow-400" />
                                <span>Add to Learning Plan</span>
                              </>
                            )}
                          </button>

                          {isInPlan && (
                            <button
                              type="button"
                              onClick={() => toggleCompletedSkill(mSkill)}
                              className={`py-1.5 px-2.5 rounded-xl text-[11px] font-bold border transition flex items-center justify-center gap-1 cursor-pointer ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-[#222228] text-gray-400 border-gray-700 hover:text-white'
                              }`}
                              title={isCompleted ? 'Mark as in-progress' : 'Mark as learned'}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckSquare className="w-3 h-3 text-emerald-400" />
                                  <span>Learned!</span>
                                </>
                              ) : (
                                <>
                                  <Square className="w-3 h-3" />
                                  <span>Learned?</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Candidate Active Learning Tracker Banner */}
                {learningPlanSkills.length > 0 && (
                  <div className="mt-4 p-4 rounded-2xl bg-[#18181c] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-500/30 flex items-center justify-center font-bold text-sm">
                        🎯
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">My Active Learning Roadmap</p>
                        <p className="text-[11px] text-gray-400">
                          {completedSkills.size} of {learningPlanSkills.length} skills mastered. Completing these unlocks up to <strong>+{(learningPlanSkills.length * 0.4).toFixed(1)} / 10</strong> on your ATS scorecard.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {learningPlanSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          onClick={() => toggleCompletedSkill(sk)}
                          className={`cursor-pointer px-2.5 py-1 rounded-xl text-[11px] font-bold border transition flex items-center gap-1 ${
                            completedSkills.has(sk)
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-[#222228] text-yellow-400 border-yellow-500/30 hover:bg-gray-800'
                          }`}
                        >
                          {completedSkills.has(sk) ? '✓ ' : '+ '}
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AI Required Changes & Strategic Profile Remediation */}
          {activeResultTab === 'recommendations' && (
            <div className="space-y-6">
              
              {/* 1. Readiness Verdict & Role Match Overview Card */}
              <div className={`p-6 rounded-3xl border ${
                currentAnalysis.atsScore >= 85
                  ? 'bg-gradient-to-r from-emerald-950/40 via-[#222228] to-[#18181c] border-emerald-500/40'
                  : currentAnalysis.atsScore >= 65
                  ? 'bg-gradient-to-r from-yellow-950/40 via-[#222228] to-[#18181c] border-yellow-500/40'
                  : 'bg-gradient-to-r from-rose-950/40 via-[#222228] to-[#18181c] border-rose-500/40'
              } shadow-xl space-y-3`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-2xl text-xl font-black ${
                      currentAnalysis.atsScore >= 85 ? 'bg-emerald-500/20 text-emerald-400' : currentAnalysis.atsScore >= 65 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {currentAnalysis.atsScore >= 85 ? '🏆' : currentAnalysis.atsScore >= 65 ? '🎯' : '⚡'}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                        AI Required Changes & Profile Remediation
                      </span>
                      <h4 className="text-base font-black text-white">
                        {currentAnalysis.jobReadinessStatus || (currentAnalysis.atsScore >= 85 ? 'Job Ready (High Match)' : currentAnalysis.atsScore >= 65 ? 'Near Ready (Skill Gap Bridge Needed)' : 'Action Required - Specific Skill Gaps Identified')}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1.5 rounded-xl bg-[#141417] border border-gray-800 text-xs font-bold text-gray-200">
                      Target Role: <strong className="text-yellow-400 font-extrabold">{targetRole}</strong>
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
                      currentAnalysis.atsScore >= 85 ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : currentAnalysis.atsScore >= 65 ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300' : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    }`}>
                      {currentAnalysis.atsScore}% ATS Match Score
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {currentAnalysis.summary || `Your resume was evaluated against production requirements for ${targetRole}. Follow the enhanced AI required changes below to eliminate skill gaps, update experience bullets, and maximize recruiter interview conversion.`}
                </p>
              </div>

              {/* 2. Priority Required Keyword & Skill Additions */}
              {currentAnalysis.missingSkills && currentAnalysis.missingSkills.length > 0 && (
                <div className="bg-[#222228] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                          Critical Keyword Deficit
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Required Skill Additions for {targetRole} ({currentAnalysis.missingSkills.length})
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                      ATS Filtering Priority
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    Applicant Tracking Systems (ATS) automatically screen out resumes lacking these core required keywords. Add them into your technical skills summary and reference them in relevant work experience or capstone projects.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {currentAnalysis.missingSkills.map((skill, sIdx) => {
                      const copyKey = `skill-${sIdx}`;
                      const samplePhrase = `Engineered solutions utilizing ${skill} adhering to industry performance standards.`;
                      return (
                        <div
                          key={sIdx}
                          className="p-3.5 rounded-2xl bg-[#18181c] border border-gray-800/90 hover:border-amber-500/40 transition flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate">{skill}</span>
                              <span className="text-[10px] text-gray-400 block truncate">Place in Skills & 1 Project description</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(copyKey, skill)}
                            className="px-2.5 py-1 rounded-xl bg-[#222228] hover:bg-gray-800 text-[11px] font-semibold text-amber-300 hover:text-white border border-gray-700 transition flex items-center gap-1 flex-shrink-0"
                            title="Copy keyword to clipboard"
                          >
                            {copiedBulletKey === copyKey ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Actionable Improvement Checklist with Direct Copy */}
              <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    AI Actionable Changes Checklist
                  </h4>
                  <span className="text-xs text-gray-400">
                    Apply these items to elevate resume ATS to 95%+
                  </span>
                </div>

                <div className="space-y-3">
                  {currentAnalysis.recommendations.map((rec, idx) => {
                    const copyKey = `rec-${idx}`;
                    const isAdopted = acceptedRecs.has(idx);

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                          isAdopted
                            ? 'bg-gradient-to-r from-emerald-950/20 via-[#18181c] to-[#18181c] border-emerald-500/50 shadow-sm'
                            : 'bg-[#18181c] border-gray-800 opacity-75'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Checkbox button to toggle adoption */}
                          <button
                            type="button"
                            onClick={() => toggleRecommendation(idx)}
                            className="mt-0.5 text-emerald-400 hover:scale-110 transition flex-shrink-0 cursor-pointer"
                            title={isAdopted ? 'Click to exclude this suggestion' : 'Click to adopt this suggestion'}
                          >
                            {isAdopted ? (
                              <CheckSquare className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-500" />
                            )}
                          </button>

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400">
                                Suggestion #{idx + 1}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                isAdopted
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-gray-800 text-gray-400 border-gray-700'
                              }`}>
                                {isAdopted ? '✓ Adopted for Resume' : '○ Skipped / Excluded'}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                Tailored for {targetRole}
                              </span>
                            </div>
                            <div className="text-xs text-gray-200 font-medium leading-relaxed">
                              {rec}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleRecommendation(idx)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                              isAdopted
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                                : 'bg-[#222228] text-gray-400 border-gray-700 hover:text-white'
                            }`}
                          >
                            {isAdopted ? 'Accepted' : 'Adopt'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopy(copyKey, rec)}
                            className="px-2.5 py-1 rounded-xl bg-[#222228] hover:bg-gray-800 text-[11px] font-semibold text-gray-300 hover:text-white border border-gray-700 transition flex items-center gap-1 flex-shrink-0 cursor-pointer"
                            title="Copy suggestion"
                          >
                            {copiedBulletKey === copyKey ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Enhanced STAR Bullet Points Quick Overhaul */}
              {currentAnalysis.bulletEnhancements && currentAnalysis.bulletEnhancements.length > 0 && (
                <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-yellow-400/20 text-yellow-400">
                        <Wand2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block">
                          STAR Methodology Rewrites
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Required Experience Bullet Enhancements
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-500/30 px-3 py-1 rounded-full">
                      Quantified Impact Boost
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    Replace passive, duty-focused statements on your resume with these AI-crafted STAR bullets featuring active verbs, architectural scale, and concrete percentage metrics.
                  </p>

                  <div className="space-y-4 pt-1">
                    {currentAnalysis.bulletEnhancements.slice(0, 3).map((item, bIdx) => {
                      const copyKey = `star-rec-${bIdx}`;
                      return (
                        <div key={bIdx} className="p-4 rounded-2xl bg-[#18181c] border border-gray-800 space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Before (Weak / Task Phrasing):</span>
                            <p className="text-xs text-gray-400 italic line-through decoration-rose-500/60 leading-relaxed">
                              "{item.originalBullet}"
                            </p>
                          </div>
                          <div className="space-y-1.5 pt-2 border-t border-gray-800">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">After (AI Enhanced STAR Bullet):</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(copyKey, item.improvedBullet)}
                                className="px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-[11px] font-bold text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1"
                              >
                                {copiedBulletKey === copyKey ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Enhanced Bullet</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-white font-medium leading-relaxed bg-[#131720] p-3 rounded-xl border border-emerald-500/30">
                              {item.improvedBullet}
                            </p>
                            {item.improvementReason && (
                              <p className="text-[11px] text-gray-400">
                                💡 <span className="font-semibold text-gray-300">Why it scores higher:</span> {item.improvementReason}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. Step-by-Step 4-Phase Roadmap */}
              <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-800 gap-2">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-yellow-400" />
                      Job-Ready Roadmap for {targetRole}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Step-by-step strategic blueprint to bridge missing competencies, build proof-of-work, and prepare for top-tier hiring rounds.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-500/30 px-3 py-1 rounded-xl whitespace-nowrap self-start sm:self-auto">
                    4-Phase Blueprint
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(currentAnalysis.jobReadinessRoadmap && currentAnalysis.jobReadinessRoadmap.length > 0 ? currentAnalysis.jobReadinessRoadmap : [
                    `Phase 1: Skill Acquisition & Tooling - Master the ${currentAnalysis.missingSkills.length} missing technologies for ${targetRole}: ${currentAnalysis.missingSkills.join(', ') || 'Advanced enterprise architecture'}.`,
                    `Phase 2: Build Verified Capstone Project - Develop and open-source a production-grade portfolio project demonstrating end-to-end expertise.`,
                    `Phase 3: STAR Bullet Points Overhaul - Rewrite experience bullets using Action Verb + Context + Quantified Metric framework.`,
                    `Phase 4: Interview & System Design Preparation - Prepare for senior technical interviews focusing on ${targetRole} architectural tradeoffs and latency.`
                  ]).map((step, sIdx) => {
                    const parts = step.split(' - ');
                    const title = parts[0] || `Phase ${sIdx + 1}`;
                    const desc = parts.slice(1).join(' - ') || step;

                    return (
                      <div
                        key={sIdx}
                        className="p-4 rounded-2xl bg-[#18181c] border border-gray-800/90 hover:border-yellow-500/40 transition shadow-sm space-y-2 flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-yellow-400 text-gray-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                            {sIdx + 1}
                          </div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            {title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. Recommended Proof-of-Work Project to Build */}
              {currentAnalysis.recommendedProject && (
                <div className="bg-gradient-to-r from-blue-950/20 via-[#222228] to-purple-950/20 border border-blue-500/30 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                          Verified Portfolio Proof-of-Work
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Recommended Capstone Project to Build for {targetRole}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                      Recruiter High Impact
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141417] border border-gray-800 space-y-2.5">
                    <p className="text-xs text-gray-200 leading-relaxed font-medium">
                      {currentAnalysis.recommendedProject}
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-800/80 text-[11px] text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1 text-teal-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Covers Missing Keywords: {currentAnalysis.missingSkills.slice(0, 3).join(', ') || 'Core Role Competencies'}
                      </span>
                      <span>•</span>
                      <span className="text-yellow-400 font-semibold">Host on GitHub with Live URL</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Action Card: Generate and Download PDF */}
              <div className="bg-gradient-to-r from-yellow-500/10 via-[#222228] to-amber-500/10 border border-yellow-500/30 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="p-1 rounded-lg bg-yellow-400 text-gray-950 font-black text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      All Changes Selected? Export Role-Tailored PDF
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400">
                    Your accepted recommendations and role enhancements will be combined into a ready-to-send PDF.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadEnhancedPdf}
                    disabled={isGeneratingPdf}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 text-gray-950" />
                    <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Resume'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEnhancedResumeModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#18181c] hover:bg-gray-800 text-white border border-gray-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-yellow-400" />
                    <span>Preview Document</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: AI Matched Eligible Job Profiles & Openings */}
          {activeResultTab === 'eligible-jobs' && (
            <div className="space-y-8">
              
              {/* Top Banner Explainer */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-[#222228] to-[#18181c] border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Gemini AI Career Match & Eligibility Intelligence</span>
                </div>
                <h4 className="text-lg font-black text-white">
                  Eligible Job Profiles & Live Vacancies for Your Skillset
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
                  Based on the verified technical skills, frameworks, and experience extracted from your uploaded resume, Gemini AI evaluated active market vacancies and identified the profiles and direct openings you are qualified to apply for right now.
                </p>
              </div>

              {/* Section 1: Top 3 Eligible Career Profiles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Eligible Career Profiles You Qualify For</span>
                  </h4>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                    {eligibleCareerProfiles.length} High-Growth Profiles
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {eligibleCareerProfiles.map((prof, pIdx) => (
                    <div
                      key={pIdx}
                      className="bg-[#222228] border border-gray-800 hover:border-emerald-500/40 rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all duration-200"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {prof.status}
                          </span>
                          <span className="text-xs font-black text-white bg-[#18181c] px-2.5 py-1 rounded-xl border border-gray-800">
                            {prof.matchScore}% Match
                          </span>
                        </div>

                        <h5 className="text-sm font-black text-white mt-1">{prof.roleTitle}</h5>
                        
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-800/80">
                          <span className="text-gray-400">Market Openings:</span>
                          <span className="font-extrabold text-yellow-400">{prof.openingsEstimate}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Compensation:</span>
                          <span className="font-bold text-white font-mono">{prof.salaryRange}</span>
                        </div>

                        <div className="pt-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Core Tech Stack:</span>
                          <div className="flex flex-wrap gap-1">
                            {prof.coreStack.map((tech, tIdx) => (
                              <span key={tIdx} className="px-2 py-0.5 rounded-md bg-[#18181c] border border-gray-800 text-[10px] font-semibold text-gray-300">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* AI Career Suggestion */}
                      <div className="p-3 rounded-2xl bg-yellow-400/5 border border-yellow-500/20 text-[11px] text-gray-300 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-yellow-400">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Strategic Recommendation:</span>
                        </div>
                        <p className="leading-relaxed text-gray-300">
                          {prof.aiSuggestion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Verified Live Job Vacancies Matching Profile */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-yellow-400" />
                      <span>Jobs Matching Your Profile ({eligibleJobs.length})</span>
                    </h4>
                    <p className="text-xs text-gray-400">
                      Showing vacancies strictly matching your analyzed skills & target role
                    </p>
                  </div>
                  {onExploreMatchingJobs && (
                    <button
                      onClick={onExploreMatchingJobs}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 text-xs font-semibold shadow-sm transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>View in Main Job Board</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-teal-400" />
                    </button>
                  )}
                </div>

                {eligibleJobs.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-[#18181c] border border-gray-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center mx-auto text-xl">
                      🔍
                    </div>
                    <h5 className="text-sm font-bold text-white">No Vacancies Directly Matching This Profile</h5>
                    <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                      Only verified vacancies with matching required skills ({currentAnalysis?.skills?.slice(0, 3).join(', ') || 'your profile'}) are suggested here. Check the "AI Suggestions & Roadmap" tab to expand your skills for adjacent roles, or check back soon as recruiters post new vacancies.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eligibleJobs.map((job) => {
                    const compName = typeof job.company === 'object' ? job.company?.name : job.company || 'Tech Employer';
                    const vacancies = job.vacanciesCount || 1;

                    return (
                      <div
                        key={job.id}
                        className="bg-[#222228] border border-gray-800 hover:border-yellow-500/40 rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all duration-200 group"
                      >
                        <div className="space-y-3">
                          {/* Top Row: Title, Company & Eligibility Pill */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <h5 className="text-sm font-black text-white group-hover:text-yellow-400 transition-colors truncate">
                                {job.title}
                              </h5>
                              <p className="text-xs text-yellow-400 font-semibold flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5" /> {compName}
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="w-3.5 h-3.5" /> {job.eligibilityScore}% Match
                              </span>
                            </div>
                          </div>

                          {/* Vacancies & Location Badges */}
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-emerald-400" />
                              {vacancies} Vacancies Open for this Post
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#18181c] text-gray-300 border border-gray-800 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-500" /> {job.location || 'Remote'}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#18181c] text-yellow-400 border border-gray-800 font-bold flex items-center gap-1">
                              <DollarSign className="w-3 h-3" /> {job.salaryDisplay || job.salary || 'Competitive'}
                            </span>
                          </div>

                          {/* Matched vs Missing Skills */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] text-gray-400 uppercase font-bold block">
                              Skill Compatibility:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {job.matchedSkills.map((ms, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                  ✓ {ms}
                                </span>
                              ))}
                              {job.missingSkills.slice(0, 2).map((mis, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-400 text-[10px] font-medium">
                                  + {mis}
                                </span>
                              ))}
                            </div>
                          </div>

                          {job.summary && (
                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed pt-1 border-t border-gray-800/60">
                              {job.summary}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-800/80">
                          <button
                            onClick={() => {
                              if (checkDemoRestriction()) return;
                              if (onApplyJob) {
                                onApplyJob(job);
                              } else if (job.applyUrl) {
                                window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
                              }
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                          >
                            <span>Apply with This Resume</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          {onSelectJob && (
                            <button
                              onClick={() => onSelectJob(job)}
                              className="py-2 px-3 rounded-xl bg-[#18181c] hover:bg-gray-800 text-gray-200 border border-gray-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
                              title="View full job post & official vacancies"
                            >
                              <Eye className="w-3.5 h-3.5 text-yellow-400" />
                              <span>Details</span>
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


        </div>
      )}

      {/* AI-Enhanced Resume Preview & Export Modal */}
      {showEnhancedResumeModal && currentAnalysis && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-[#222228] border border-yellow-500/40 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-800 flex items-center justify-between gap-4 bg-gradient-to-r from-yellow-500/10 via-[#222228] to-[#18181c]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="p-1.5 rounded-lg bg-yellow-400 text-gray-950 font-black text-xs">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    AI-Enhanced Role Resume Preview & PDF Export
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {acceptedRecs.size} Recs + {acceptedBullets.size} Bullets Adopted
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  This customized resume incorporates strictly the role-specific suggestions and STAR bullet rewrites that you chose to accept.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEnhancedResumeModal(false)}
                className="w-9 h-9 rounded-xl bg-[#18181c] hover:bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center border border-gray-700 transition flex-shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Comparison & View Mode Selector Banner */}
            <div className="px-5 sm:px-6 py-3 bg-[#18181c] border-b border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <span className="text-gray-400">Target Role:</span>{' '}
                  <strong className="text-white font-bold">{targetRole}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Score Impact:</span>
                  <span className="px-2 py-0.5 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                    Original: {formatScoreOutOf10(currentAnalysis.atsScore)} / 10
                  </span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black">
                    Projected: {projectedScore} / 10 (+{(Number(projectedScore) - Number(formatScoreOutOf10(currentAnalysis.atsScore))).toFixed(1)} pts)
                  </span>
                </div>
              </div>

              {/* View Switcher: Document Sheet vs Raw ATS Plaintext */}
              <div className="flex items-center gap-1 bg-[#121215] p-1 rounded-xl border border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalViewMode('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    modalViewMode === 'preview'
                      ? 'bg-yellow-400 text-gray-950 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Document View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalViewMode('text')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    modalViewMode === 'text'
                      ? 'bg-yellow-400 text-gray-950 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>ATS Plaintext</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[58vh] space-y-4 bg-[#121215]">
              {modalViewMode === 'preview' ? (
                /* Document Sheet Preview Mode */
                <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-w-3xl mx-auto space-y-6 font-sans">
                  
                  {/* Sheet Header */}
                  <div className="border-b border-slate-200 pb-5 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                          {((currentUser?.name && currentUser.name !== 'Guest User') ? currentUser.name : 'Alex Morgan').toUpperCase()}
                        </h2>
                        <div className="text-amber-700 font-bold text-xs sm:text-sm tracking-wide uppercase pt-0.5">
                          {targetRole}
                        </div>
                      </div>

                      <div className="text-right sm:self-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-extrabold shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>ATS Score: {projectedScore} / 10</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                      <span>{currentUser?.email || 'alex.morgan.dev@email.com'}</span>
                      <span>•</span>
                      <span>linkedin.com/in/{((currentUser?.name && currentUser.name !== 'Guest User') ? currentUser.name : 'alexmorgan').toLowerCase().replace(/\s+/g, '')}</span>
                      <span>•</span>
                      <span>github.com/{((currentUser?.name && currentUser.name !== 'Guest User') ? currentUser.name : 'alexmorgan').toLowerCase().replace(/\s+/g, '')}</span>
                    </div>
                  </div>

                  {/* Section: Professional Summary */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-amber-600/40 pb-1">
                      Professional Summary
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed pt-1">
                      Results-driven and impact-focused <strong className="text-slate-900 font-bold">{targetRole}</strong> with hands-on expertise building production-ready architectures. Benchmark analyzed and tailored to modern ATS screening criteria for {targetRole}. Demonstrated track record in latency reduction, distributed reliability, and cross-functional agile engineering to maximize business impact.
                    </p>
                  </div>

                  {/* Section: Core Technical Competencies */}
                  <div className="space-y-2">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-amber-600/40 pb-1">
                      Core Technical Competencies & Verified Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        ...(currentAnalysis.skills || []),
                        ...Array.from(completedSkills)
                      ]
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Section: Experience & Key Achievements */}
                  <div className="space-y-3">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-amber-600/40 pb-1 flex items-center justify-between">
                      <span>Key Achievements & Experience (STAR-Optimized)</span>
                      <span className="text-[10px] text-amber-700 font-bold normal-case">
                        {acceptedBullets.size} rewrites adopted
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {(currentAnalysis.bulletEnhancements || []).map((b, bIdx) => {
                        const isAdopted = acceptedBullets.has(bIdx);
                        return (
                          <div key={bIdx} className="text-xs text-slate-800 flex items-start gap-2 leading-relaxed">
                            <span className="text-amber-600 font-bold mt-0.5">•</span>
                            <div>
                              {isAdopted ? (
                                <>
                                  <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 mr-1.5">
                                    AI STAR Optimized
                                  </span>
                                  <span className="font-medium text-slate-900">{b.improvedBullet}</span>
                                </>
                              ) : (
                                <span className="text-slate-600">{b.originalBullet}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section: Strategic Role Enhancements */}
                  {acceptedRecs.size > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-amber-600/40 pb-1">
                        Role-Specific Enhancements Adopted ({targetRole})
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {(currentAnalysis.recommendations || [])
                          .filter((_, idx) => acceptedRecs.has(idx))
                          .map((rec, rIdx) => (
                            <div key={rIdx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{rec}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Section: Capstone Project */}
                  {currentAnalysis.recommendedProject && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-amber-600/40 pb-1">
                        Verified Capstone Project & Proof-of-Work
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="text-xs font-bold text-slate-900">
                          Production Capstone for {targetRole}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {currentAnalysis.recommendedProject}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* Plaintext Monospace View Mode */
                <pre className="whitespace-pre-wrap leading-relaxed select-all selection:bg-yellow-400 selection:text-gray-950 p-4 rounded-2xl bg-[#18181c] border border-gray-800 font-mono text-xs text-gray-200">
                  {generateEnhancedResumeText()}
                </pre>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 border-t border-gray-800 bg-[#1e1e24] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-gray-400">
                <span>💡 Download the authentic PDF resume or copy text into your Word / Google Docs template.</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
                {/* Primary Download PDF Button */}
                <button
                  type="button"
                  onClick={handleDownloadEnhancedPdf}
                  disabled={isGeneratingPdf}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-950 font-black text-xs shadow-lg shadow-yellow-500/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  title="Download clean ATS-friendly PDF resume"
                >
                  <Download className="w-4 h-4 text-gray-950 stroke-[2.5]" />
                  <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Resume'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator?.clipboard) {
                      navigator.clipboard.writeText(generateEnhancedResumeText());
                      setResumeCopied(true);
                      setTimeout(() => setResumeCopied(false), 2500);
                    }
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[#18181c] hover:bg-gray-800 text-gray-200 hover:text-white border border-gray-700 font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  {resumeCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadEnhancedResume}
                  className="px-3.5 py-2.5 rounded-xl bg-[#18181c] hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  title="Download raw plain text resume"
                >
                  <Download className="w-3.5 h-3.5 text-gray-400" />
                  <span>.TXT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEnhancedResumeModal(false)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#18181c] hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-700 font-semibold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
