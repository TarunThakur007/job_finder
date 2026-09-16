# JobProof Technical Architecture Specification

## 1. System Overview

JobProof is an AI-powered job discovery, verification, and direct-application platform. The primary promise of JobProof is **"Find jobs. Verify jobs. Apply directly."**

Unlike traditional job portals that accept manual listing submissions or aggregate unverified scrape targets, JobProof maintains a strict verification boundary before any job vacancy is published.

---

## 2. Ingestion & Data Flow Pipeline

```
[ Job Source ] (Authorized API / ATS Endpoint / Official Career Feed)
       │
       ▼
[ Fetcher Component ] (Source-specific fetch implementation)
       │
       ▼
[ Raw Job Payload ]
       │
       ▼
[ AI Extraction Service ] (Structured parsing: title, skills, exp, type, location)
       │
       ▼
[ Data Normalization ] (Standardize currency, locations, job roles)
       │
       ▼
[ Duplicate Detection Engine ] (Source ID matching + Fuzzy title/company/URL similarity)
       │
       ▼
[ Company Verification Check ] (Domain ownership, career page presence, ATS mapping)
       │
       ▼
[ Job Verification Engine ] (HTTP status check, employer domain match, active page check)
       │
       ▼
[ Verification Scoring Engine ] (Transparent weighted score 0-100 & evidence flags)
       │
       ▼
[ Status Evaluator ] -> VERIFIED (Score >= 80) / SUSPICIOUS / PENDING_REVIEW / REJECTED
       │
       ▼
[ PostgreSQL Storage ] & Publish to Search Engine / REST API
```

---

## 3. Separation of Responsibilities: Deterministic Engine vs. AI Models

| Subsystem | Deterministic Software Logic | AI Model Logic |
| :--- | :--- | :--- |
| **HTTP Checks** | Validates status 200 OK, redirects, SSL certificates, latency | N/A |
| **Parsing** | JSON schema validation, regex URL matching, date formats | Parses unstructured HTML/Text into candidate fields |
| **Title & Skill Normalization**| Canonical skill dictionary lookups | Maps variant titles ("Sr. Java Soft Dev") to standard roles |
| **Duplicate Detection** | Source key / unique ID hash collision checks | Similarity matching on job description & requirements |
| **Verification & Scoring** | Computes final score (0-100) based on weighted evidence matrix | Identifies potential anomalies or misclassifications |
| **Data Integrity** | Enforces "No invented salary/process" strict default rules | N/A (AI output is stored separately as raw extraction) |

---

## 4. Source-Independent Ingestion Abstraction

Job sources are integrated using a polymorphic source contract:

```
                  ┌───────────────────────┐
                  │    JobSourceProvider  │ (Interface)
                  └───────────┬───────────┘
                              │
     ┌────────────────────────┼────────────────────────┐
     │                        │                        │
┌────┴──────────────────┐ ┌───┴──────────────────┐ ┌───┴──────────────────┐
│ AuthorizedApiProvider │ │  GreenhouseProvider  │ │ CareerPageFeedProvider│
└───────────────────────┘ └──────────────────────┘ └──────────────────────┘
```

Each source provider produces a standardized `RawJobPayload` which enters the processing pipeline without coupling the backend to a single job network.

---

## 5. Layered Backend Architecture

- **`controller/`**: Handles HTTP requests, maps path variables/request parameters, returns DTO payloads. No direct database access or heavy business logic.
- **`service/`**: Encapsulates business processes, transaction boundaries (`@Transactional`), verification orchestration, and duplicate checking.
- **`repository/`**: Spring Data JPA interfaces for entity persistence and query execution.
- **`entity/`**: JPA domain models mapped to PostgreSQL tables.
- **`dto/`**: Request and Response transfer objects ensuring sensitive entity fields are never exposed.
- **`mapper/`**: Mapstruct/manual mappers for explicit DTO <-> Entity conversion.
- **`ingestion/`**: Job discovery interfaces and fetchers.
- **`verification/`**: Rule evaluators, URL pingers, evidence aggregators, scoring functions.
- **`ai/`**: LLM client integration abstractions for extraction and normalization.
- **`scheduler/`**: Background jobs for freshness re-verification and stale job expiration.
- **`config/`**: Security, CORS, database, and system properties configurations.

---

## 6. Environment & Configuration Security

Secrets, database credentials, API tokens, and JWT keys are configured exclusively via environment variables:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `AI_API_KEY`
- `SERVER_PORT`
