# JobProof REST API Specifications

All API endpoints follow RESTful conventions and return standardized JSON objects. Base path for API endpoints is `/api`.

---

## 1. System & Health

### `GET /api/health`
Returns system status and database connection state.

**Response `200 OK`**:
```json
{
  "status": "UP",
  "app": "JobProof API",
  "version": "1.0.0-SNAPSHOT",
  "timestamp": "2026-09-14T19:21:35Z"
}
```

---

## 2. Public Job Endpoints

### `GET /api/jobs`
Retrieve paginated, filtered, and sorted job vacancies.

**Query Parameters**:
- `query` (string, optional): Title, skill, or keyword search.
- `location` (string, optional): Target city or "Remote".
- `category` (string, optional): Category slug.
- `jobType` (string, optional): `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`.
- `experienceLevel` (string, optional): `FRESHER`, `JUNIOR`, `MID`, `SENIOR`.
- `minVerificationScore` (int, optional, default: `70`): Filter jobs by minimum score.
- `page` (int, default: `0`): Page index.
- `size` (int, default: `10`): Items per page.
- `sort` (string, default: `newest`): `newest`, `relevance`, `score`, `salary_high`, `salary_low`.

**Response `200 OK`**:
```json
{
  "content": [
    {
      "id": 101,
      "title": "Backend Software Engineer",
      "company": {
        "id": 12,
        "name": "Acme Corp",
        "domain": "acme.com",
        "verificationStatus": "VERIFIED"
      },
      "location": "Bangalore, India",
      "isRemote": false,
      "jobType": "FULL_TIME",
      "vacanciesCount": 5,
      "experienceLevel": "FRESHER",
      "salaryDisplay": "₹8L - ₹12L",
      "skills": ["Java", "Spring Boot", "PostgreSQL"],
      "postedAt": "2026-09-14T12:00:00Z",
      "verificationScore": 94,
      "verificationStatus": "VERIFIED",
      "lastSeenAt": "2026-09-14T19:00:00Z"
    }
  ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 1,
  "totalPages": 1
}
```

---

### `GET /api/jobs/{id}`
Retrieve full details for a single job posting, including verification evidence breakdown.

**Response `200 OK`**:
```json
{
  "id": 101,
  "title": "Backend Software Engineer",
  "company": {
    "id": 12,
    "name": "Acme Corp",
    "domain": "acme.com",
    "careerPageUrl": "https://acme.com/careers",
    "verificationStatus": "VERIFIED"
  },
  "location": "Bangalore, India",
  "jobType": "FULL_TIME",
  "experienceLevel": "FRESHER",
  "salary": {
    "min": 800000.00,
    "max": 1200000.00,
    "currency": "INR",
    "period": "YEARLY",
    "disclosed": true,
    "display": "₹8,00,000 - ₹12,00,000 / year"
  },
  "description": "Design and maintain high-throughput RESTful services using Java 21 & Spring Boot...",
  "selectionProcess": "Selection process not provided by employer.",
  "applicationUrl": "https://acme.com/careers/job/101?apply=true",
  "sourceUrl": "https://acme.com/careers/job/101",
  "sourceType": "CAREER_PAGE",
  "postedAt": "2026-09-14T12:00:00Z",
  "lastSeenAt": "2026-09-14T19:00:00Z",
  "status": "VERIFIED",
  "verification": {
    "score": 94,
    "status": "VERIFIED",
    "verifiedAt": "2026-09-14T19:00:00Z",
    "evidence": [
      { "check": "Employer verified", "passed": true },
      { "check": "Original listing found", "passed": true },
      { "check": "Application URL working", "passed": true },
      { "check": "Job currently available", "passed": true },
      { "check": "Source verified", "passed": true },
      { "check": "Checked within last 30 minutes", "passed": true }
    ]
  }
}
```

---

## 3. Companies & Categories

### `GET /api/companies`
Retrieve list of verified employers.

### `GET /api/companies/{id}`
Retrieve details for a specific company and its active verified jobs.

### `GET /api/categories`
Retrieve list of job categories.

---

## 4. Ingestion Connectors & Discovery Control

### `POST /api/admin/vacancies/discover`
Trigger on-demand discovery across connected ATS and third-party developer APIs.

**Query Parameters**:
- `source` (string, optional, default: `ALL`):
  - `ALL`: Ingests from all 8 connected sources.
  - `ATS`: Greenhouse, Lever, and Ashby direct career feeds.
  - `JOOBLE`: Jooble Global Job Search API (worldwide tech postings across 70+ countries).
  - `USAJOBS`: Official USAJobs REST API (Series 2210 IT Management & Cybersecurity).
  - `ARBEITNOW`: European tech and verified developer listings.
  - `REMOTEOK`: Global remote software engineering postings.
  - `JOBICY`: Remote engineering and backend vacancies.

**Response `200 OK`**:
```json
{
  "message": "AI Discovery completed for source: JOOBLE",
  "source": "JOOBLE",
  "stagedCount": 10
}
```

---

## 5. Configuration & Environment Variables

| Variable | Description | Default |
|:---|:---|:---|
| `JOOBLE_API_KEY` | Jooble API Key registered at https://jooble.org/api/about | *(Uses verified fallback if empty)* |
| `USAJOBS_API_KEY` | USAJobs Authorization-Key from https://developer.usajobs.gov/ | *(Uses verified fallback if empty)* |
| `USAJOBS_EMAIL` | User-Agent contact email required by USAJobs portal | `jobproof-agent@jobfinder.gov` |
| `SERVER_PORT` | Spring Boot HTTP listening port | `8081` |
| `GEMINI_API_KEY` | Google Gemini Generative AI key for ATS scorecards | Optional |

---

## 6. User Resume Persistence & Admin Access

### `POST /api/resumes/analyze`
Accepts a candidate's uploaded resume (PDF/DOCX/TXT) with Base64 content, extracts and evaluates skills with AI, and persists both candidate metadata and the exact resume file into the database (`user_resumes` and `resume_analyses` tables).

**Request Body**:
```json
{
  "filename": "Candidate_Resume.pdf",
  "fileType": "application/pdf",
  "fileSizeBytes": 184500,
  "candidateName": "John Doe",
  "candidateEmail": "john.doe@example.com",
  "targetJobRole": "Full Stack Software Engineer",
  "fileContentBase64": "data:application/pdf;base64,JVBERi0xLjQK...",
  "rawResumeText": "Resume text..."
}
```

### `GET /api/admin/resume-scans`
Retrieves all user-uploaded resumes and AI diagnostics from the database for administrative review and auditing.

### `GET /api/admin/resume-scans/{id}/download`
Streams and downloads the candidate's full uploaded resume file directly from the database with appropriate MIME headers (`Content-Disposition: attachment; filename=...`).

