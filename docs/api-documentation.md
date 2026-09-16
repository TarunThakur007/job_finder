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

## 4. User Saved Jobs (Planned)

- `POST /api/jobs/{id}/save`
- `DELETE /api/jobs/{id}/save`
- `GET /api/users/me/saved-jobs`
