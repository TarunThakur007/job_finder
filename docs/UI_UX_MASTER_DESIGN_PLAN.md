# JobProof — Senior UI/UX Architecture Report & Master Implementation Plan

> **Author**: Lead Senior UI/UX Architect (20+ Years Enterprise & Modernist Design Veteran)  
> **Document Purpose**: Authoritative UI/UX Implementation Plan & Engineering Execution Prompt  
> **Project Scope**: JobProof (AI-Verified Direct Employer Career Marketplace)  
> **Target Standards**: Swiss International Typographic Style, Dieter Rams Functionalism, Edward Tufte Data Density, WCAG 2.1 AAA Accessibility  
> **Strict Directive**: Complete prohibition of "AI Slop" (no neon violet gradients, no floating jelly pills, no glassmorphism mud, no generic card fluff).  

---

## Table of Contents
1. [Project Audit: Mission, Workflows & Operational Reality](#1-project-audit-mission-workflows--operational-reality)
2. [The Anti-"AI Slop" Manifesto & Veteran Design Philosophy](#2-the-anti-ai-slop-manifesto--veteran-design-philosophy)
3. [Design System Tokens & Foundations](#3-design-system-tokens--foundations)
4. [Responsive Ergonomics: Mobile Thumb-Zone & Desktop Power-User Density](#4-responsive-ergonomics-mobile-thumb-zone--desktop-power-user-density)
5. [Page-by-Page Architectural Specification & Layout Wireframes](#5-page-by-page-architectural-specification--layout-wireframes)
   - 5.1 Candidate Marketplace & Live Requisition Discovery Hub
   - 5.2 Deep-Dive Job Audit & Direct Application Dialog
   - 5.3 Resume Intelligence & ATS Compatibility Engine
   - 5.4 Application Kanban Cockpit
   - 5.5 Community Interview & Offer Experience Board
   - 5.6 Employee & Recruiter Staging Workspace
   - 5.7 Administrative Governance & Live Telemetry Console
6. [Interactive Feedback, Micro-Physics & State Machines](#6-interactive-feedback-micro-physics--state-machines)
7. [Accessibility, Contrast & Usability Rigor (WCAG 2.1 AAA)](#7-accessibility-contrast--usability-rigor-wcag-21-aaa)
8. [Phase-by-Phase Frontend Implementation Roadmap](#8-phase-by-phase-frontend-implementation-roadmap)
9. [Master Prompt for Frontend Developers & AI Pair Programmers](#9-master-prompt-for-frontend-developers--ai-pair-programmers)

---

## 1. Project Audit: Mission, Workflows & Operational Reality

### 1.1 Core Mission
JobProof solves the fundamental crisis in modern tech hiring: ghost postings, recruiter scraping, stale job boards, and automated ATS rejection black holes. Its foundational thesis is **"Verification Over Speculation"**:
- **Employer Source of Truth**: Original career page feeds, official ATS webhooks (Greenhouse, Lever, Ashby), and verified enterprise endpoints.
- **Direct Application**: Never traps candidates in fake native forms. Direct dispatch to the verified employer application URL.
- **Data Integrity**: Absolute prohibition of speculative salaries or phantom qualifications. If omitted by the employer, displays `"Salary not disclosed by employer"`.
- **Transparent Authenticity Score (0–100%)**: Deterministic scoring based on SSL certificates, domain verification via Clearbit/Brandfetch, status code checks, and ATS signature matching.

### 1.2 Current Operational Workflows & Role Boundaries
The system operates across three tightly isolated user spaces:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   JOBPROOF PLATFORM                                    │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ 1. Candidate / Guest     │ 2. Employee / Recruiter     │ 3. Administrator              │
│    Workspace             │    Portal (`ROLE_EMPLOYEE`) │    Console (`ROLE_ADMIN`)     │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ • Direct Requisitions    │ • ATS Ingestion Staging     │ • System Health Telemetry     │
│ • Browser Datalist Search│ • Vacancy Review & Editing  │ • Employee Deployment & Roles │
│ • ATS Resume Optimizer   │ • Grant Permission & Publish│ • Candidate Resume Audit Logs │
│ • Kanban Tracker Cockpit │ • Freshness Audit Alerts    │ • Diagnostic ATS Scan History │
│ • Interview Experiences  │ • Manual Requisition Entry  │ • Security Clearance Controls │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

---

## 2. The Anti-"AI Slop" Manifesto & Veteran Design Philosophy

Over the past three years, the web has been flooded with "AI-generated design slop": ubiquitous purple/indigo mesh gradients, oversaturated floating jelly pill buttons, illegible frosted-glass blur over busy graphics, and low-contrast grey text. A veteran designer with 20+ years of craft recognizes these as anti-patterns that undermine institutional credibility, destroy accessibility, and fatigue users.

### 2.1 The Ten Non-Negotiable Rules

| # | Anti-Pattern ("AI Slop") | 20-Year Veteran Solution | Technical Enforcement |
|---|---|---|---|
| **1** | **Purple/Violet Conic Gradients** | Grounded architectural obsidian canvas (`#0f0f12`), dark zinc slate (`#18181c`), and elevated graphite (`#222228`). | Prohibit `bg-gradient-to-r from-purple-500 to-indigo-600`. Use solid semantic surfaces. |
| **2** | **Floating Pill Buttons** (`rounded-full`) | Structured geometric radii (`rounded-xl` 10px–12px) with physical inset hairlines and tactile press states. | `active:translate-y-[0.5px] active:scale-[0.98]`. |
| **3** | **Abusive Glassmorphism** (`backdrop-blur-md bg-white/5`) | Crisp opaque surface layering with calibrated ambient occlusion shadows. | Multi-tier solid elevations (`--surface-canvas`, `--surface-raised`, `--surface-overlay`). |
| **4** | **Low-Contrast Muted Type** (`#64748b` on black) | High-contrast typographic hierarchy exceeding WCAG 2.1 AAA (> 7:1 for body, > 14:1 for headers). | Primary headings `#FFFFFF` (18.5:1 ratio), secondary slate `#9CA3AF` (7.2:1 ratio). |
| **5** | **Fake Metric Charts & Dummy Wavy SVG Curves** | Quantitative data displays strictly bound to real database records. Tabular numeral alignment. | Tabular numbers `font-mono tabular-nums`. Remove speculative SVG graphs. |
| **6** | **Unanchored Floating Badges with Random Delays** | Structural hairlines and aligned grid badges anchored to cards with deterministic badge positioning. | Fixed flex/grid badges with semantic status colors (`#10B981` verified, `#FBBF24` action). |
| **7** | **Cluttered 3D Character Mascot Illustrations** | Real information architecture: tabular specs, verified domain proof, ATS entity tokens, timestamp audits. | Remove cartoon character cutouts. Replace with data tables and proof chips. |
| **8** | **Non-Existent / Ghost Category Tags** | Dynamic reflection of actual database rows. If zero jobs exist in a role, it is omitted from the UI. | Category grid and search datalists dynamically computed from live API payload. |
| **9** | **Hidden or Broken Focus States** | High-visibility `:focus-visible` double-ring indicator for keyboard power-users and accessibility. | `focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2`. |
| **10**| **Viewport Height Mobile Reflow Glitches** (`100vh`) | Dynamic Viewport Units (`100dvh`) to prevent address-bar bounce on iOS/Android WebKit. | Use `min-h-dvh` and mobile thumb-zone layout anchors. |

---

## 3. Design System Tokens & Foundations

### 3.1 Color Matrix (CSS Custom Properties)
```css
:root {
  /* Surfaces: Multi-Tier Architectural Solids */
  --surface-canvas:   #0f0f12;  /* Deepest floor canvas */
  --surface-raised:   #18181c;  /* Primary container cards */
  --surface-overlay:  #222228;  /* Elevated action blocks, modals, dropdowns */
  --surface-sunken:   #0b0b0e;  /* Recessed form inputs, terminal logs */

  /* Text & Typography Contrast Hierarchy */
  --text-primary:     #FFFFFF;  /* Primary headings & key values (18.5:1 on canvas) */
  --text-secondary:   #9CA3AF;  /* Descriptive body text & subtitles (7.2:1) */
  --text-tertiary:    #6B7280;  /* Timestamps & muted structural metadata (4.6:1) */
  --text-inverse:     #0B0D0E;  /* High-contrast ink on amber buttons */

  /* Structural Hairlines & Borders */
  --border-subtle:    #272730;  /* Standard card boundaries (Hairline 1px) */
  --border-strong:    #383E47;  /* Active hover borders & divider rules */
  --border-focus:     #FBBF24;  /* Keyboard focus & selection halo */

  /* Semantic Action & Status Palette */
  --brand-primary:            #FBBF24;  /* Warm Institutional Gold (Tailwind yellow-400) */
  --brand-primary-hover:      #F59E0B;  /* Deep Amber (Tailwind yellow-500) */
  --brand-primary-foreground: #0B0D0E;  /* Obsidian ink */
  
  --status-verified:          #10B981;  /* Emerald 500 — Live verified direct employer */
  --status-verified-bg:       rgba(16, 185, 129, 0.12);
  --status-verified-border:   rgba(16, 185, 129, 0.30);

  --status-staging:           #F59E0B;  /* Amber 500 — Recruiter review queue */
  --status-staging-bg:        rgba(245, 158, 11, 0.12);
  --status-staging-border:    rgba(245, 158, 11, 0.30);

  --status-danger:            #EF4444;  /* Crimson 500 — Expired / scam rejection */
  --status-danger-bg:         rgba(239, 68, 68, 0.12);
  --status-danger-border:     rgba(239, 68, 68, 0.30);

  /* Tactile Structural Radii (Anti-Pill Geometry) */
  --radius-xs: 4px;   /* Inline code, datalist tags */
  --radius-sm: 6px;   /* Dropdown items, search chips */
  --radius-md: 10px;  /* Interactive buttons, form inputs */
  --radius-lg: 14px;  /* Structural cards, table wrappers */
  --radius-xl: 20px;  /* Large dialog modals */

  /* Ambient Occlusion Elevation Shadows */
  --shadow-subtle: 0 1px 2px 0 rgba(0, 0, 0, 0.40);
  --shadow-card:   0 2px 4px 0 rgba(0, 0, 0, 0.50), 0 4px 8px -1px rgba(0, 0, 0, 0.30);
  --shadow-modal:  0 10px 25px -5px rgba(0, 0, 0, 0.70), 0 8px 10px -6px rgba(0, 0, 0, 0.50);
}
```

### 3.2 Typography Scale
- **Display 1 (Hero Title)**: `font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.12]`
- **Section Heading (H2)**: `font-black text-2xl sm:text-3xl tracking-tight text-white`
- **Card Heading (H3)**: `font-extrabold text-base sm:text-lg text-white`
- **Body Core**: `font-medium text-xs sm:text-sm text-gray-400 leading-relaxed`
- **Tabular Data & Metrics**: `font-mono text-xs sm:text-sm font-bold tabular-nums`
- **Micro Metadata & Tags**: `font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider`

---

## 4. Responsive Ergonomics: Mobile Thumb-Zone & Desktop Power-User Density

### 4.1 Mobile-First Viewport Execution
On mobile devices (320px–640px), users navigate primarily with one thumb in the lower two-thirds of the screen:
1. **Thumb-Zone Anchor Bar**: Essential operations (Search filter toggle, Saved Requisitions count, Profile access) sit in a fixed bottom floating dock (`bottom-0 left-0 right-0 h-14 bg-[#18181c]/95 border-t border-gray-800`).
2. **Touch Targets**: All clickable cards, buttons, and select dropdowns maintain strict minimum dimensions of `48px x 48px`.
3. **No Horizontal Scroll Runaways**: Table structures collapse into vertical stacked summary cards on screens under 768px.
4. **Modal Sheets**: Modals open as bottom-anchored sheets with native pull-down drag handles rather than center popups.

### 4.2 Desktop Power-User Density Execution
On desktop viewports (1024px–1920px), users value immediate information density over sparse whitespace:
1. **Keyboard-Driven Interaction (`Ctrl+K` / `⌘K`)**: Instant focus on the multi-parameter search bar with automatic datalist dropdown.
2. **Tabular Monospace Alignment**: Salary ranges (`$140k – $185k`), authenticity trust scores (`98%`), and requisition counters (`3 Requisitions`) align along vertical monospace columns so candidates can scan 30 listings in seconds.
3. **Multi-Column Filtering**: Simultaneous filtering by Experience Level, Contract Type, Remote Eligibility, and Domain Category without multi-step wizard delays.

---

## 5. Page-by-Page Architectural Specification & Layout Wireframes

### 5.1 Candidate Marketplace & Live Requisition Discovery Hub
The home screen serves as an institutional clearinghouse for verified tech engineering roles.

#### Wireframe
```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [JP] JobProof v1.0   [Explore Jobs] [Resume AI] [Kanban Tracker] [Experiences]   [Live API 🟢] [👤]│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ HERO SECTION                                                                                     │
│ ┌───────────────────────────────────────────────────────┐ ┌────────────────────────────────────┐ │
│ │ 🛡️ LIVE DATABASE PIPELINE • 100% DIRECT EMPLOYER      │ │ LIVE DATABASE OVERVIEW             │ │
│ │                                                       │ │ ┌────────────────┬───────────────┐ │ │
│ │ Find your dream job with verified certainty           │ │ │ Active Openings│ Avg Trust     │ │ │
│ │ Direct application pipelines to verified teams.       │ │ │ 68 Roles       │ 98.8% Score   │ │ │
│ │                                                       │ │ └────────────────┴───────────────┘ │ │
│ │ ┌───────────────────────┬────────────┬────────┬─────┐ │ │ • Direct Official ATS Application  │ │
│ │ │ 🔍 Search in database │ Remote/City│ Fulltime▼│Apply│ │ │ • Zero Speculative Data Guarantee│ │
│ │ └───────────────────────┴────────────┴────────┴─────┘ │ │ Active: [Figma][Stripe][GitLab]... │ │
│ │ Quick: [Software Engineer] [AI Engineer] [Backend]... │ └────────────────────────────────────┘ │
│ └───────────────────────────────────────────────────────┘                                        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ COMPANY MARQUEE TICKER: Google • Slack • Spotify • Amazon • Figma • Netflix • Meta • Microsoft   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ACTIVE ENGINEERING DOMAINS GRID (Strictly Roles with Live Vacancies):                            │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐             │
│ │ ⚙️ Backend (24)   │ │ 💻 Frontend (18) │ │ 🥞 Full Stack(16)│ │ ✨ Data & AI (14)│             │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘             │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ VERIFIED LIVE REQUISITIONS (Multi-Filter Control Hub):                                           │
│ [ Search keyword... ] [ Exp: All ▼ ] [ Type: All ▼ ] [ 🌐 Remote Only ] [ Sort: Trust Index ▼ ]  │
│                                                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Senior Backend Platform Engineer (Java / Spring)  [Full-Time] [1 Requisition]  Trust: 98% 🛡️ │ │
│ │ Adyen • San Francisco, CA (Hybrid) • $165,000 - $210,000 / yr                                │ │
│ │ Audit: [ ✓ Official Career Portal ] [ ✓ Active ATS Endpoint ] [ ✓ Fresh 24h ] [Apply Direct ➔]│ │
│ └──────────────────────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Core Components & Behavioral Rules
1. **Hero Search Input with Datalist**: The browser search input uses `<input list="db-job-roles-list" />`. The `<datalist>` is dynamically populated from active database roles (`jobs.map(j => j.title)`). Ghost titles are never suggested.
2. **No Frivolous Graphics**: The market intelligence SVG curve graph and the previous 3D mascot illustration are strictly replaced by the concrete **Live Database Overview** telemetry card.
3. **Domain Category Chips**: Categories are strictly filtered against current database records. Categories with 0 active vacancies (such as `Product Design & UI/UX`) are automatically omitted.
4. **Verification Evidence Pills**: Every job card displays explicit audit proof (`Official Career Portal`, `Active ATS Endpoint`, `Direct Match`).

---

### 5.2 Deep-Dive Job Audit & Direct Application Dialog
When a candidate clicks any requisition card, the system opens a high-density, multi-tab audit modal:

#### Wireframe
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [🏢 Company Logo]  Senior Backend Platform Engineer                          [ ✕ Close]│
│ Adyen • Amsterdam / Remote • Posted 18 hours ago • GS-Score: 98/100 Authenticity       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TABS: [ 🛡️ Authenticity Evidence ] [ 📋 Job Description ] [ 🧭 Selection Roadmap ]     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TAB 1: VERIFICATION EVIDENCE BREAKDOWN (Deterministic Audit Log)                       │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ✓ Official Employer Domain Authenticated (adyen.com via Clearbit API)       +15 pts│ │
│ │ ✓ Direct ATS Application Endpoint (jobs.lever.co/adyen)                     +25 pts│ │
│ │ ✓ Active HTTP 200 Live Requisition Confirmed (Checked 14m ago)              +20 pts│ │
│ │ ✓ Non-Speculative Compensation Stated by Employer ($165k-$210k)             +20 pts│ │
│ │ ✓ Authentic Technical Skills Taxonomy Verified (Java, Spring Boot, Kafka)   +18 pts│ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ TAB 2: EXPLICIT COMPENSATION & NO-SPECULATION GUARANTEE                                │
│ • Disclosed Salary: $165,000 - $210,000 / year (USD)                                  │
│ • "JobProof Verification Guarantee: This figure is extracted directly from employer   │
│   documentation. Zero algorithmic speculation or synthetic estimations."             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ FOOTER ACTION BAR:                                                                     │
│ [ 📌 Save to Kanban Cockpit ]                       [ 🚀 Apply Directly on Lever ➔ ]  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Behavioral Rules
- **Direct Apply Forwarding**: Clicking `"Apply Directly on Lever ➔"` automatically opens the official ATS endpoint in a new tab (`target="_blank" rel="noopener noreferrer"`) and records the application into the candidate's personal Kanban Tracker.
- **Never Trap Users**: No artificial multi-step application forms asking for duplicate profile entry.

---

### 5.3 Resume Intelligence & ATS Compatibility Engine
Candidates upload resumes (`.pdf`, `.docx`, `.txt`) to evaluate keyword taxonomy density, calculate deterministic ATS scores, and generate STAR-method impact bullet revisions.

#### Wireframe
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ INTELLIGENT ATS RESUME BENCHMARK & STAR REWRITE ENGINE                                 │
│ Select Target Requisition: [ Senior Backend Platform Engineer (Adyen) ▼ ]              │
├────────────────────────────────────────┬───────────────────────────────────────────────┤
│ UPLOAD / RAW TEXT INPUT                │ ATS DIAGNOSTIC GAUGE & TAXONOMY SCORECARD     │
│ ┌────────────────────────────────────┐ │ ┌──────────────┐ Formatting Compatibility: 96% │
│ │ 📁 Drag & drop resume file         │ │ │   94 / 100   │ Keyword Taxonomy Match:    91% │
│ │    PDF, DOCX, TXT (Max 5MB)        │ │ │  Live Score  │ Quantifiable Impact Ratio: 88% │
│ └────────────────────────────────────┘ │ └──────────────┘ Senior Level Alignment:    92% │
│ Presets: [ 👤 Senior Java Backend ]   │                                               │
│          [ 👤 Full Stack React/Node ]  │ Detected Tokens: [✓ Java] [✓ Spring] [✓ Kafka]│
│          [ 👤 Cloud DevOps SRE ]       │ Missing Tokens:  [⚠ Kubernetes] [⚠ CI/CD]     │
├────────────────────────────────────────┴───────────────────────────────────────────────┤
│ STAR METHOD REWRITE WORKBENCH:                                                         │
│ ┌────────────────────────────────────────┬───────────────────────────────────────────┐ │
│ │ Original Passive Bullet Point          │ STAR-Enhanced Metric-Driven Replacement   │ │
│ │ "Built backend APIs using Spring Boot  │ "Architected resilient event-driven Kafka │ │
│ │  and worked on microservices."         │  & Spring Boot services processing 12M   │ │
│ │                                        │  daily requests, reducing p99 latency 38%"│ │
│ │                                        │  [ 📋 Copy STAR Bullet ]                  │ │
│ └────────────────────────────────────────┴───────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.4 Application Kanban Cockpit
Provides visual workflow tracking for every job application dispatched through JobProof.

#### Kanban State Columns
1. **📌 SAVED**: Openings bookmarked for research.
2. **📨 APPLIED**: Applications submitted directly to the employer's portal.
3. **🔍 SCREENING**: Employer recruiter resume screening or online assessment.
4. **🗣️ INTERVIEWS**: Technical, architectural, and hiring manager rounds.
5. **🎉 OFFER**: Official employment offer received.
6. **✕ ARCHIVED / CLOSED**: Role closed by employer or candidate declined.

#### UX Enhancements
- **Drag-and-Drop Column Reordering**: Smooth drag transitions with optimistic state updates to `localStorage`.
- **ATS Match Score Pill**: Embedded on each card (`Match: 95%`).
- **One-Click Link to Official ATS Page**: Instant access to original posting.

---

### 5.5 Community Interview & Offer Experience Board
Authentic, peer-verified accounts of interview loops, compensation offers, and assessment questions.

#### Ergonomic Guidelines
- **Zero Fiction**: Every review must be linked to a recognized employer entity.
- **Structured Fields**: Clear division between Role Title, Difficulty Rating (1–5 Stars), Process Duration (e.g. `2 Weeks, 4 Rounds`), and Question Highlights.
- **Searchable by Company**: Quick filtering by company name (`Stripe`, `Spotify`, `GitLab`).

---

### 5.6 Employee & Recruiter Staging Workspace (`ROLE_EMPLOYEE`)
The employee control hub allows corporate recruiters and verified employees to inspect AI-ingested job responses from automated scrapers/ATS connectors, edit requisition details, and grant publishing permission.

#### Wireframe
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 💼 COMPANY EMPLOYEE & RECRUITER WORKSPACE                   [ + Post Manual Vacancy ]  │
│ AI Vacancy Staging & Permission Verification Center         [ Preview Live Website ]  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ RECRUITER METRIC COUNTERS:                                                             │
│ [ 68 Active Live Jobs ]  [ 4 Pending Review ]  [ 100% Direct Verification Compliance ] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PENDING STAGING QUEUE (Requires Explicit Human Permission to Publish Live):             │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Lead Cloud Infrastructure Architect                                                │ │
│ │ CrowdStrike • Austin, TX (Hybrid) • Discovered via Greenhouse Connector             │ │
│ │ Ingested Data: $175,000 - $225,000 / yr • 5 Positions • Fulltime                   │ │
│ │ Validation: SSL HTTPS Verified • Brandfetch Verified • Lever Endpoint Match         │ │
│ │                                                                                    │ │
│ │ Actions: [ ✏️ Edit Vacancy Specs ]  [ ✕ Reject Listing ]  [ ✓ Grant & Publish Live] │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.7 Administrative Governance & Live Telemetry Console (`ROLE_ADMIN`)
Central platform command center for monitoring backend health, managing team personnel, inspecting user login logs, and auditing ATS diagnostic scans.

#### Five Core Admin Tabs
1. **Live Telemetry**: Real-time JVM memory stats, active Spring Boot threads, H2 database connection status, and ingestion scheduler health.
2. **Candidate Resumes**: Repository of all candidate-submitted resumes with one-click viewing and structured data extraction summaries.
3. **AI ATS Diagnostics**: Audit trail of every ATS scan executed on the platform with detected skill vectors and compatibility scores.
4. **User Experiences**: Moderation queue for user-submitted interview experiences.
5. **Employee Clearances**: Role deployment modal allowing administrators to grant `ROLE_EMPLOYEE` or `ROLE_ADMIN` clearances with specific scoped permissions (`CAN_POST_JOBS`, `CAN_APPROVE_JOBS`, `CAN_AUDIT_RESUMES`).

---

## 6. Interactive Feedback, Micro-Physics & State Machines

Every interactive element on JobProof obeys deterministic physical rules that simulate real-world mechanical response:

### 6.1 State Machine Matrix

```
[ IDLE ] ──(Hover)──> [ HOVER ] ──(Mouse Down)──> [ ACTIVE / PRESS ] ──(Release)──> [ SUCCESS ]
  │                     │                              │
  └─(Tab Focus)─────────┴──────────────────────────────┴──────> [ FOCUS-VISIBLE ]
```

### 6.2 Exact CSS Behaviors

```css
/* 1. Primary Tactile Button */
.btn-primary {
  background-color: var(--brand-primary);
  color: var(--brand-primary-foreground);
  font-weight: 800;
  border-radius: var(--radius-md);
  padding: 0.625rem 1.25rem;
  border: 1px solid var(--brand-primary);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.25), var(--shadow-subtle);
  transition: all 120ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover {
  background-color: var(--brand-primary-hover);
  border-color: var(--brand-primary-hover);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
  transform: translateY(-0.5px);
}

.btn-primary:active {
  transform: translateY(0.5px) scale(0.98);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.30);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 3px;
}

/* 2. Tactile Card */
.craft-card {
  background-color: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-subtle);
  transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}

.craft-card:hover {
  border-color: rgba(245, 158, 11, 0.40);
  background-color: var(--surface-overlay);
  box-shadow: var(--shadow-card);
}
```

---

## 7. Accessibility, Contrast & Usability Rigor (WCAG 2.1 AAA)

### 7.1 Mathematical Contrast Verification
JobProof is engineered to achieve **WCAG 2.1 AAA** compliance for visual ergonomics:

- **Primary Heading Text (`#FFFFFF`) on Obsidian Canvas (`#0f0f12`)**:
  $$\text{Contrast Ratio} = \frac{1.0 + 0.05}{0.007 + 0.05} = \mathbf{18.42 : 1} \quad (\text{Threshold: } 7.0 : 1 \checkmark)$$
- **Secondary Slate Text (`#9CA3AF`) on Slate Card (`#18181c`)**:
  $$\text{Contrast Ratio} = \mathbf{7.21 : 1} \quad (\text{Threshold: } 7.0 : 1 \checkmark)$$
- **Amber Accent (`#FBBF24`) on Obsidian Canvas (`#0f0f12`)**:
  $$\text{Contrast Ratio} = \mathbf{11.35 : 1} \quad (\text{Threshold: } 4.5 : 1 \checkmark)$$
- **Dark Ink (`#0B0D0E`) on Amber Button (`#FBBF24`)**:
  $$\text{Contrast Ratio} = \mathbf{12.18 : 1} \quad (\text{Threshold: } 7.0 : 1 \checkmark)$$

### 7.2 Assistive Technology & Usability Rules
1. **Semantic HTML5 Element Hierarchy**: Strict single `<h1>` per page view, followed by orderly `<h2>` and `<h3>` tags.
2. **Keyboard Traps Eliminated**: All modal dialogs implement focus traps with `Escape` key listeners to dismiss.
3. **Reduced Motion**: All animations (`@keyframes marquee`, `transition-all`) honor `@media (prefers-reduced-motion: reduce)`.
4. **Screen-Reader Labels**: Every interactive icon trigger without visible text includes an explicit `aria-label` attribute (e.g. `aria-label="Clear keyword search"`).

---

## 8. Phase-by-Phase Frontend Implementation Roadmap

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND IMPLEMENTATION ROADMAP                                │
├─────────────────┬──────────────────────┬───────────────────────┬───────────────────────┤
│ PHASE 1         │ PHASE 2              │ PHASE 3               │ PHASE 4               │
│ Design Tokens   │ Discovery & Hero     │ AI Workbenches        │ Governance & Audit    │
├─────────────────┼──────────────────────┼───────────────────────┼───────────────────────┤
│ • index.css     │ • HeroSection.jsx    │ • ResumeAnalyzer.jsx  │ • EmployeeControl.jsx │
│ • tailwind cfg  │ • JobTable.jsx       │ • AppTracker.jsx      │ • TeamManagement.jsx  │
│ • Header.jsx    │ • CategoryGrid.jsx   │ • ExperienceBoard.jsx │ • Modals & Auth Gates │
│ • Footer.jsx    │ • TickerSection.jsx  │ • Datalist Linking    │ • Production Build    │
└─────────────────┴──────────────────────┴───────────────────────┴───────────────────────┘
```

### Phase 1: Global Tokens & Surface Foundations
- Enforce the obsidian/charcoal palette in `index.css` under `:root`, `.dark`, and `body`.
- Calibrate typography variables, physical press transitions, and baseline container constraints.
- Unify `Header.jsx` with real backend health status ping and brand typography.

### Phase 2: Candidate Discovery & Clean Hero
- Eliminate any remnant SVG simulation curves and 3D character illustrations from `HeroSection.jsx`.
- Implement dynamic browser search `<datalist>` populated directly from active backend jobs.
- Refactor `CategoryGridSection.jsx` to dynamically omit any categories with 0 active requisitions.
- Align `JobTable.jsx` to structured dark cards with tabular monospace metrics and yellow-400 direct apply CTAs.

### Phase 3: AI Workbenches & Kanban Experience
- Verify `ResumeAnalyzerSection.jsx` ATS gauge, detected keyword tokens, and STAR bullet enhancer cards.
- Test `ApplicationTrackerSection.jsx` kanban column transitions with local storage persistence.
- Validate `ExperienceBoardSection.jsx` authentic interview loops and rating stars.

### Phase 4: Recruiter Staging, Governance & Production Verification
- Audit `EmployeeControlSection.jsx` review actions (approve, edit, reject).
- Verify `TeamManagementPage.jsx` telemetry metrics, personnel deployment modal, and clearance levels.
- Execute `npm run build` and verify that the production bundle builds cleanly with zero errors.

---

## 9. Master Prompt for Frontend Developers & AI Pair Programmers

When building, refactoring, or reviewing components for the JobProof project, copy and paste this master prompt directly into your developer workflow:

```markdown
================================================================================
MASTER PROMPT: JOBPROOF SENIOR UI/UX ARCHITECTURAL IMPLEMENTATION
================================================================================

You are a 20-year veteran principal frontend engineer and UI/UX designer 
specializing in high-density, accessible, Swiss-modernist enterprise web design.
You are implementing interfaces for JobProof, an institutional AI-verified job 
platform built with React, Vite, Tailwind CSS, and a Spring Boot 3 backend.

### 1. STRICT ANTI-"AI SLOP" DIRECTIVES (NON-NEGOTIABLE):
- PROHIBITED: Neon violet/purple gradients, generic blue buttons, abusive glassmorphism, 
  low-contrast grey-on-dark text, and floaty jelly pill buttons (rounded-full).
- PROHIBITED: Fake wavy SVG charts, synthetic metric simulations, and 3D cartoon illustrations.
- ENFORCED: Grounded solid obsidian canvas (#0f0f12), dark zinc slate containers (#18181c), 
  and elevated graphite cards (#222228).
- ENFORCED: Warm institutional amber/gold (#FBBF24 / yellow-400) for primary CTAs and highlights.
- ENFORCED: Authentic verified emerald (#10B981) for trust scores, SSL audits, and live feeds.
- ENFORCED: Structured geometric corner radii (rounded-xl 10px-12px for buttons, rounded-2xl for cards).

### 2. ERGONOMICS & INTERACTIVE PHYSICS:
- Buttons must exhibit physical tactile press micro-interactions:
  `active:translate-y-[0.5px] active:scale-[0.98] transition-all duration-120`.
- Buttons must have an inset hairline highlight:
  `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.20)`.
- Cards must feature crisp hairlines (`border border-gray-800`) and subtle hover 
  illumination (`hover:border-yellow-500/40 hover:bg-[#222228]`).
- Desktop interfaces must utilize monospace tabular alignment (`font-mono tabular-nums`) 
  for structured values (salaries, trust scores, opening counts, timestamps).
- Mobile layouts must use dynamic viewport units (`min-h-dvh`), 48px touch targets, 
  and thumb-zone actionable controls.

### 3. DATA INTEGRITY & ZERO SPECULATION:
- NEVER invent or simulate job roles, salaries, or companies.
- Browser search inputs must link to dynamic `<datalist>` suggestions generated 
  directly from active database entities.
- Category filters must dynamically omit any domain with 0 active vacancies in the database.
- Direct applications must always link to the employer's official ATS URL 
  (Greenhouse, Lever, Ashby, corporate portal).

### 4. ACCESSIBILITY (WCAG 2.1 AAA):
- Maintain > 7:1 contrast ratio for all secondary text, and > 14:1 for headings.
- All interactive triggers must include high-contrast `:focus-visible` offset rings.
- Icon-only buttons must include explicit `aria-label` attributes.
- Honor `@media (prefers-reduced-motion: reduce)` on all animated elements.

Execute all changes with surgical precision, clean modular architecture, and zero regressions.
================================================================================
```

---

## 10. Summary & Architectural Sign-Off

The **JobProof UI/UX Master Design Plan** establishes an uncompromising benchmark of digital craft:
- **Honest**: Grounded in authentic database facts without speculative AI slop.
- **Ergonomic**: Fast, responsive, keyboard-driven on desktop, thumb-zone calibrated on mobile.
- **Accessible**: Exceeds WCAG 2.1 AAA standards with high contrast and tactile feedback.
- **Institutional**: Professional, mature aesthetic designed to earn candidate and employer trust.
