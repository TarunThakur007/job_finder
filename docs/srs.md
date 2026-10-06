# JobProof — Software Requirements Specification (SRS)
*Compliant with IEEE Std 830-1998 Guidelines*

---

## 1. Introduction

### 1.1 Purpose
This document provides a complete Software Requirements Specification (SRS) for the **JobProof** platform. It details external interface requirements, system capabilities, data models, behavioral constraints, and verification rules governing both the Java Spring Boot backend and the React Vite frontend application.

### 1.2 Scope of the System
JobProof is an automated job discovery, multi-factor authenticity verification, AI resume analysis, and application lifecycle tracking platform. It ingests tech jobs directly from official ATS feeds (Greenhouse, Lever, Ashby) and public tech boards (Arbeitnow, RemoteOK, Jobicy), scores their trust through deterministic verification rules, and offers direct employer application links.

### 1.3 Definitions, Acronyms, and Abbreviations
- **ATS**: Applicant Tracking System (e.g., Greenhouse, Lever, Ashby).
- **JWT**: JSON Web Token.
- **RBAC**: Role-Based Access Control.
- **STAR**: Situation, Task, Action, Result methodology for resume bullet optimization.
- **REST**: Representational State Transfer.
- **JPA / ORM**: Java Persistence API / Object-Relational Mapping (Hibernate).
- **BCrypt**: Adaptive cryptographic key derivation function for password hashing.

---

## 2. Overall Description

### 2.1 Product Perspective & Architectural Topology
JobProof follows a decoupled client-server micro-monolith architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                 React 18 Single Page App                    │
│      (Vite, Tailwind CSS, Lucide React, LocalStorage)       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST (Port 8081)
┌──────────────────────────────▼──────────────────────────────┐
│             Spring Boot 3.x REST Services                   │
│   ┌────────────────────┬────────────────────────────────┐   │
│   │ Controllers & DTOs │ Spring Security & JWT Filters  │   │
│   ├────────────────────┼────────────────────────────────┤   │
│   │ Ingestion Pipeline │ Verification Scoring Engine    │   │
│   ├────────────────────┼────────────────────────────────┤   │
│   │ Schedulers (Cron)  │ Gemini AI Integration Client   │   │
│   └────────────────────┴────────────────────────────────┘   │
└───────────────┬──────────────────────────────┬──────────────┘
                │ JDBC                         │ HTTPS Outbound
┌───────────────▼──────────────┐ ┌─────────────▼──────────────┐
│  H2 (Dev) / PostgreSQL (Prod)│ │ External ATS & Job APIs    │
│  Relational Database Engine  │ │ (Greenhouse, Lever, Ashby, │
│                              │ │  Arbeitnow, RemoteOK, etc.)│
└──────────────────────────────┘ └────────────────────────────┘
```

### 2.2 User Classes and Permissions (RBAC)

1. **Anonymous / Demo Candidate**:
   - Can search and filter verified jobs.
   - Can inspect job details and community interview experiences.
   - Required to register a free account to track applications and access AI resume tooling.
2. **Registered Candidate (`ROLE_CANDIDATE`)**:
   - Access to full AI Resume Analyzer and STAR bullet rewriter.
   - Access to personal Kanban Application Tracker.
   - Ability to share community interview experiences.
3. **Company Employee (`ROLE_EMPLOYEE`)**:
   - Access to AI-discovered vacancy staging queue.
   - Ability to review AI extraction responses from ATS and job APIs.
   - Ability to update job details (title, salary, requirements, applyUrl) and grant permission to publish live to the website.
   - Access to hourly freshness and closed job audit alerts.
   - Zero access or clutter from candidate resumes, kanban, or experience boards.
4. **Platform Administrator (`ROLE_ADMIN`)**:
   - Oversight of real-time website working status and telemetry (jobs, crawlers, schedulers, API health).
   - Provisioning new employee and administrator accounts.
   - Assigning and granting granular operational permissions.
   - On-demand execution of ingestion crawlers.
   - Zero access or clutter from candidate resumes, kanban, or experience boards.

---

## 3. Specific Functional Requirements

### 3.1 Module 1: Automated Ingestion & Discovery

#### [FR-01] Multi-Source Ingestion Pipeline
- **Description**: The system shall periodically pull open vacancies from configured sources.
- **Inputs**: Company slugs, ATS endpoints, public job board URLs.
- **Processing**:
  - Connectors parse JSON payloads from Greenhouse, Lever, Ashby, Arbeitnow, RemoteOK, and Jobicy.
  - Normalizes field names (title, company name, location, remote status, description, applyUrl).
  - Truncates descriptions to database limits and sanitizes invalid characters.
- **Outputs**: Normalized candidate `JobDTO` instances staged in database with status `NEEDS_REVIEW`.
- **Preconditions**: Target ATS endpoint is reachable with HTTP 200.
- **Postconditions**: Unique jobs saved without duplicating existing `applyUrl` records.

#### [FR-02] Scheduled Job Discovery & Freshness Auditing
- **Description**: The system shall execute background cron jobs for vacancy discovery and link freshness.
- **Processing**:
  - `JobDiscoveryScheduler`: Executes every 6 hours (`cron = "0 0 */6 * * *"`) to pull new openings.
  - `JobFreshnessScheduler`: Executes hourly to check HTTP status of published jobs. If 404 or closed, marks job as `CLOSED` and notifies the employer.

---

### 3.2 Module 2: Multi-Factor Verification & Trust Scoring

#### [FR-03] Verification Scoring Algorithm
- **Description**: The system shall deterministically evaluate every job vacancy against a multi-point authenticity matrix and generate a composite Trust Score (0–100%).
- **Scoring Breakdown**:
  - Direct ATS / Career Portal URL Match: **+35 points**
  - Employer Domain & SSL Validity: **+25 points**
  - Live HTTP 200 Reachability: **+20 points**
  - Disclosed Salary & Explicit Eligibility: **+10 points**
  - High Corporate Trust Reputation: **+10 points**
- **Thresholds**:
  - Score $\ge 80$: Verification Status = `HIGHLY_TRUSTED` / `VERIFIED`
  - Score $60 - 79$: Verification Status = `NEEDS_REVIEW`
  - Score $< 60$: Verification Status = `SUSPICIOUS`

---

### 3.3 Module 3: Job Discovery & Direct Application (Candidate)

#### [FR-04] High-Performance Filtered Search
- **Description**: The system shall filter and sort jobs according to multiple orthogonal criteria.
- **Inputs**: Keyword (title, company, skills), Job Type (Fulltime, Remote, Contract, Part-Time, Internship), Experience Level (Entry, Mid, Senior, Lead), Sort Order (Trust Score, Newest).
- **Processing**: Filters applied client-side with debounced search input (300ms) for sub-50ms query response.
- **Outputs**: Paginated/virtualized job cards matching criteria.

#### [FR-05] Direct Application Forwarding & Kanban Logging
- **Description**: Clicking "Apply on Company Site" must redirect the user directly to the employer's official `applyUrl` while automatically logging the application into the candidate's personal Kanban tracker.
- **Postconditions**: New record saved in `jobproof_tracked_applications` under the `APPLIED` column.

---

### 3.4 Module 4: AI Resume Analysis & ATS Optimization

#### [FR-06] Resume Parsing & ATS Metric Generation
- **Description**: The system shall extract text from uploaded resumes (PDF, DOCX, TXT) or raw pasted text and evaluate compatibility against a target job benchmark.
- **Outputs**:
  - Overall ATS Readability Score (0–100%)
  - Formatting & Structural Score (0–100%)
  - Keyword Relevance Score (0–100%)
  - Quantifiable Impact Score (0–100%)
  - Extracted Technical Skills list & Missing Skill Gaps list

#### [FR-07] STAR Methodology Bullet Point Enhancer
- **Description**: The system shall generate before/after bullet point rewrites transforming generic job descriptions into high-impact, quantifiable STAR statements.
- **Inputs**: Candidate original bullet text or target role profile.
- **Outputs**: Enhanced bullet statement with metrics (e.g., latency reduction, user scale) and rationale.

---

### 3.5 Module 5: Employee Operations (AI Review & Publishing)

#### [FR-08] AI Staging Review, Job Update & Live Permission Grant
- **Description**: An authorized employee shall review staged vacancies discovered by the AI crawlers, modify job attributes (title, salary boundaries, applyUrl, description, requirements), and publish them live to the public website.
- **Endpoint**: `PUT /api/admin/vacancies/{id}/grant-permission`
- **Processing**: Updates job fields, re-calculates trust score, updates verification status to `HIGHLY_TRUSTED`, sets `lastVerified` to current timestamp.

#### [FR-09] Hourly Automated Job Freshness Audit & Closure Sentinel
- **Description**: The background sentinel executes hourly, auditing all published vacancies against employer career endpoints and alerting employees in an alert drawer if any role has closed or expired.

---

### 3.6 Module 6: Admin Authority Governance

#### [FR-10] Website Telemetry Oversight & User Permissions Authority
- **Description**: Platform administrators shall inspect real-time website working status and telemetry (total jobs, active pipelines, schedulers, API health), provision employee and administrator accounts, and grant/revoke individual operational permissions.
- **Endpoint**: `POST /api/admin/deploy-user`, `GET /api/admin/stats`, `POST /api/admin/vacancies/discover`

---

## 4. Data Models & Entity Relationships

```
┌─────────────────────────┐           1:N           ┌─────────────────────────┐
│         Company         ├─────────────────────────►│           Job           │
├─────────────────────────┤                         ├─────────────────────────┤
│ id (PK)                 │                         │ id (PK)                 │
│ name                    │                         │ title                   │
│ website                 │                         │ role                    │
│ career_page             │                         │ company_id (FK)         │
│ verification_score      │                         │ location                │
└─────────────────────────┘                         │ employment_type         │
                                                    │ salary_min, salary_max  │
                                                    │ apply_url               │
                                                    │ verification_status     │
                                                    │ trust_score             │
                                                    │ last_verified           │
                                                    └─────────────────────────┘

┌─────────────────────────┐           1:N           ┌─────────────────────────┐
│          User           ├─────────────────────────►│     JobApplication      │
├─────────────────────────┤                         ├─────────────────────────┤
│ id (PK)                 │                         │ id (PK)                 │
│ name                    │                         │ user_id (FK)            │
│ email (Unique)          │                         │ job_id (FK)             │
│ password (BCrypt)       │                         │ status                  │
│ role (ADMIN/EMP/CAND)   │                         │ ats_match_score         │
│ company                 │                         │ applied_at              │
└─────────────────────────┘                         └─────────────────────────┘
```

---

## 5. Non-Functional & Quality Attributes

### 5.1 Security Requirements
- **SR-01 (Password Encryption)**: Passwords must be hashed using BCrypt with a minimum cost factor of 10.
- **SR-02 (Stateless Sessions)**: Authentication endpoints must issue signed JWT tokens containing user ID, role, and expiration timestamp.
- **SR-03 (CORS Enforcement)**: Backend must only accept pre-flight and REST requests from designated frontend origins.

### 5.2 Performance & Scalability
- **PR-01**: The system shall support a minimum of 10,000 active job vacancies in PostgreSQL with indexed searches completing in under 100ms.
- **PR-02**: Scheduled ingestion tasks shall process up to 500 vacancies per cycle without blocking incoming REST requests.

### 5.3 Reliability & Fault Tolerance
- **RR-01**: Ingestion connectors must handle external network timeouts (3000ms connect timeout, 5000ms read timeout) gracefully without terminating the application.
- **RR-02**: Database connections managed via HikariCP connection pooling with automatic reconnection.
