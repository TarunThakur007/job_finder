# JobProof — Product Requirements Document (PRD)

---

## 1. Document Overview
- **Product Name**: JobProof 🎯
- **Tagline**: *Find verified jobs. Verify jobs. Apply directly.*
- **Version**: 1.0.0 (Production Blueprint)
- **Status**: Approved & Implemented
- **Target Audience**: Job Seekers (Candidates), Corporate Recruiters / Hiring Managers (Employers), Platform Governance Administrators.

---

## 2. Executive Summary & Problem Statement

### 2.1 The Problem
The digital employment landscape is plagued by:
1. **Ghost Jobs & Expired Postings**: Over 40% of listings on traditional aggregators are either already filled, inactive, or archived.
2. **Scam Listings & Middleman Portals**: Third-party scraping bots create duplicate listings that harvest candidate personal information or charge fees rather than linking to the employer.
3. **Inaccurate / Fabricated Data**: Aggregators frequently fabricate salary estimates and selection processes without employer disclosure.
4. **Disjointed Candidate Workflow**: Candidates struggle to tailor resumes to ATS scanners, track application lifecycles, and access genuine interview experiences in a single unified cockpit.

### 2.2 The Solution
**JobProof** is an end-to-end, verified tech job discovery and candidate career enablement platform built around four non-negotiable principles:
- **Verification Over Speculation**: Every listing is backed by transparent verification evidence and an algorithmic Authenticity Score (0–100%).
- **Employer Source of Truth**: Only official company career boards, direct ATS feeds (Greenhouse, Lever, Ashby), and verified public developer feeds (Arbeitnow, RemoteOK, Jobicy) are ingested.
- **Direct Employer Application**: Zero middleman forms; clicking "Apply" redirects users directly to the employer's official career portal.
- **Dedicated Modular Workspaces**: Each section of the platform strictly displays only its dedicated tools without cross-feature clutter.

---

## 3. User Personas

### Persona A: The Software Candidate ("Alex Morgan")
- **Profile**: Mid to Senior Full-Stack Engineer seeking verified, high-compensation remote or hybrid roles.
- **Pain Points**: Tired of applying to dead links, ghost job ads, and having their resume rejected by black-box ATS filters.
- **Needs**: Real-time verified tech jobs with direct apply links, transparent trust scores, an AI ATS resume analyzer with actionable bullet improvement tips, and a personal application Kanban tracker.

### Persona B: The Corporate Recruiter ("Sarah Jenkins")
- **Profile**: Talent Acquisition Lead at a high-growth tech enterprise (e.g., Stripe, Figma).
- **Pain Points**: Overwhelmed by spam applicants; struggling to ensure their open roles are accurately presented with verified badges across public portals.
- **Needs**: An autonomous AI staging queue that discovers vacancies from their ATS, allows salary/role refinement, grants publishing permission with one click, and provides an applicant resume review console.

### Persona C: The Platform Administrator ("System Authority")
- **Profile**: Compliance and platform governance officer.
- **Pain Points**: Preventing fake companies, managing recruiter access credentials, auditing crawler freshness.
- **Needs**: Role-based access control (RBAC), user deployment tooling, operational permission assignment, and crawler health oversight.

---

## 4. Product Principles & Boundaries

| Principle | Rule / Specification |
| :--- | :--- |
| **Direct Application** | Users are ALWAYS forwarded to the original employer application URL (`applyUrl`). Internal applications are only tracked locally in the user's personal cockpit. |
| **No Fabricated Data** | If salary is missing from the employer feed, JobProof displays `"Salary not disclosed"`. If selection steps are absent, it displays `"Selection process not provided by employer"`. |
| **Strict Page Separation** | Each page displays ONLY the tools and data relevant to its core purpose. No mini-job boards inside the Resume tool; no recruiter management tools inside candidate views. |
| **Transparent Evidence** | Trust scores (0–100%) must display concrete signals (e.g., "Active HTTP 200", "Official ATS Endpoint", "Direct Application Portal"). |

---

## 5. Detailed Feature Requirements by Page

### 5.1 Page 1: Find Jobs (Candidate Job Discovery Hub)
- **Primary Goal**: Enable candidates to rapidly search, filter, and apply directly to verified tech roles.
- **Functional Requirements**:
  - **Hero Search**: Dual-input search supporting keyword (Job Title / Skill) and Employment Type (Fulltime, Remote, Contract, Part-Time, Internship).
  - **Company Ticker**: Visual carousel showcasing top hiring companies with direct ATS integrations (Google, Stripe, Figma, Spotify, Linear, Ramp).
  - **Category Grid**: Interactive category cards (Backend, Frontend, Full Stack, AI & Data, Cloud/DevOps, Mobile, Security, Product Design) with real-time vacancy counters.
  - **Multi-Criteria Filter Toolbar**:
    - Experience level dropdown (Entry, Mid, Senior, Lead).
    - Employment type filter (Fulltime, Contract, Part-Time, Internship).
    - Remote-only instant toggle switch.
    - Sorting by "Highest Trust Score" (default) or "Most Recent First".
    - Active filter chips with one-click individual removal and a "Reset All" button.
  - **Verified Job Cards**:
    - Job title, company name, location, job type badge, salary range (or "Salary not disclosed").
    - Authenticity Score Badge (0–100%) with visual color-coding.
    - Verification signal tags ("Official Employer Site", "Direct Application", "Active Listing", "Spam Free").
    - "Apply on Company Site" CTA button opening the official `applyUrl` in a new secure tab.
    - Job Details Modal showing role description, required tech stack, and verification audit trail.

### 5.2 Page 2: Resume AI (AI Resume Analyzer & ATS Optimizer)
- **Primary Goal**: Empower candidates to maximize interview callback rates through automated ATS scoring and STAR-method bullet rewriting.
- **Functional Requirements**:
  - **Dual Input Methods**: Drag-and-drop file uploader (supports PDF, DOCX, TXT) and a raw text paste box.
  - **Target Benchmark Selector**: Dropdown to benchmark resumes against specific roles (e.g., Senior Java Backend Engineer, Lead React Developer).
  - **1-Click Sample Presets**: Pre-loaded profiles (Alex Morgan, Priya Sharma, Rohan Verma) for instant evaluation.
  - **ATS Scorecard**: High-impact circular gauge displaying Overall ATS Readability Score (0–100%), Formatting Score, Keyword Match Score, and Quantifiable Impact Score.
  - **STAR Bullet Enhancer**: Side-by-side Before/After bullet point optimizer transforming passive descriptions into Situation-Task-Action-Result format with quantifiable metrics.
  - **Live Bullet Rewriter**: Interactive text box where candidates type custom bullet points and receive instant AI rewrites with copy-to-clipboard functionality.
  - **Skill Gap Detection**: Detected technical skills displayed as green check chips; missing industry keywords displayed as recommended additions.
  - **AI Improvement Checklist**: Actionable, prioritized recruiter suggestions.

### 5.3 Page 3: Kanban Application Tracker (Personal Career Cockpit)
- **Primary Goal**: Provide a streamlined Kanban board for tracking all submitted and in-progress job applications.
- **Functional Requirements**:
  - **5 Workflow Stages**:
    1. *Saved & Preparing*
    2. *Applied*
    3. *Under Review*
    4. *Interviewing*
    5. *Offer Extended*
  - **Auto-Sync from Job Board**: Clicking "Apply on Company Site" on any job card automatically creates a tracked record in the "Applied" column.
  - **Manual External Tracking**: Modal to add external applications (e.g., from LinkedIn or direct referral) with company, title, location, salary, notes, and application URL.
  - **Stage Transitioning**: Next/Previous stage action buttons to progress applications across columns.
  - **Interactive Detail Modal**: Edit personal notes, interview preparation plans, contact names, and direct links.

### 5.4 Page 4: Experience Board (Interview & Salary Intelligence)
- **Primary Goal**: Facilitate transparent community knowledge sharing regarding real interview rounds, questions, and difficulty ratings.
- **Functional Requirements**:
  - **Experience Cards**: Company name, job title, contributor name (or "Anonymous Candidate"), difficulty rating (Easy, Medium, Hard), number of interview rounds, and offer outcome badge (Offer Accepted, Offer Declined, No Offer).
  - **Questions Asked**: Exact technical questions, system design problems, and coding assignments asked during interviews.
  - **Tips & Advice**: Preparation advice and recommended focus areas.
  - **Filter Tabs**: Filter by "All Experiences", "Interview Experience", "Work Experience", and "Career Tips".
  - **Share Experience Modal**: Community submission form allowing verified candidates to publish their own interview stories.

### 5.5 Page 5: Employee Portal (AI Response Review & Job Publishing Center)
- **Primary Goal**: Empower company employees to inspect automated AI responses from connected career feeds, refine and update job details, and grant permission to publish verified jobs live to the website.
- **Functional Requirements**:
  - **AI Response Staging Queue**: Review vacancies discovered by automated crawlers across official company ATS endpoints and developer job board feeds.
  - **Job Update & Permission Modal**: Update job titles, salary boundaries, employment type, tech stack, descriptions, and direct apply URLs.
  - **Grant Permission & Publish Live**: Immediate authorization and promotion from `NEEDS_REVIEW` to `HIGHLY_TRUSTED` verified status, pushing the role live onto the public website.
  - **Hourly AI Freshness Audit**: Sentinel drawer notifying employees of any previously published roles that have been closed or expired by employers.
  - **Dedicated Scope**: Strictly focused on AI vacancy curation and publishing—zero candidate resume, kanban, or experience board features.

### 5.6 Page 6: Admin Authority Console (Website Operations, Team Permissions & User Resumes)
- **Primary Goal**: Empower platform administrators to oversee website working status and telemetry, deploy/grant permissions to staff, and inspect candidate resume data submitted across the website.
- **Functional Requirements**:
  - **Website Working & Live Operations Telemetry**:
    - Real-time overview of total published jobs, active verified percentage, and staging count.
    - System health metrics: Backend REST API status (UP/ONLINE), database connection pool status, and scheduler heartbeat.
    - Ingestion pipeline matrix: Live health of 8 connectors (Greenhouse, Lever, Ashby, Jooble, USAJobs, Arbeitnow, RemoteOK, and Jobicy).
    - On-demand crawler execution triggers with real-time feedback.
  - **Employee & Admin Permissions Authority**:
    - Provision new Company Employee (`ROLE_EMPLOYEE`) and Platform Admin (`ROLE_ADMIN`) credentials.
    - Granular operational permissions matrix: Grant/revoke permissions for *Review AI Vacancies*, *Grant Live Permission*, *Edit Job Details*, and *Post Direct Vacancies*.
    - Active clearance status and account revocation/deletion.
  - **User Submissions & Candidate Resume Vault**:
    - Centralized view of all candidate applications and resumes submitted through the website.
    - Candidate metadata: Contact information (email, phone, LinkedIn, portfolio), target role, company, and submission timestamp.
    - Resume inspection: Uploaded file name, parsed summary, extracted core skills, and structured work experience blocks.
    - ATS Match Scorecards & internal recruiter notes.
    - Application lifecycle governance: Update status (*Shortlisted*, *Reviewing*, *Accepted*, *Rejected*) and purge obsolete submissions.

---

## 6. Non-Functional Requirements (NFR)

1. **Performance & Responsiveness**:
   - Initial web app load time < 1.5 seconds.
   - Job search and multi-filter operations execute in < 50ms via client-side memoized index.
   - REST API response time < 150ms for paginated job listings.
2. **Security & Authentication**:
   - Industry-standard BCrypt password hashing for credentials.
   - Stateless JWT tokens for API authorization with role validation (`ROLE_ADMIN`, `ROLE_EMPLOYEE`, `ROLE_CANDIDATE`).
   - CORS policy strictly bounded to authorized domains.
3. **Reliability & Data Freshness**:
   - Hourly background audit of active listings to detect 404/expired endpoints.
   - Automated ingestion scheduler executing every 6 hours (`0 0 */6 * * *`).
4. **Usability & Aesthetics**:
   - High-contrast, sleek dark mode (`#18181c` surface, `#222228` cards, `#facc15` amber accents).
   - Fully responsive design scaling cleanly from mobile (360px) to ultra-wide (1600px+).

---

## 7. Success Metrics & Key Performance Indicators (KPIs)

- **Authenticity Rate**: 100% of published jobs contain valid, resolvable employer application URLs.
- **Zero-Ghost Metric**: < 1% inactive or closed vacancies remaining live past 1 hour of closure.
- **Direct Application CTR**: > 65% of job seekers who view a job detail click through to "Apply on Company Site".
- **ATS Match Optimization**: Candidates utilizing the STAR Bullet Enhancer improve ATS scores by an average of 18–25 percentage points.
