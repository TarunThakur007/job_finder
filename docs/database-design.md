# JobProof Database Schema & Entity Design

This document specifies the database design for PostgreSQL, defining entities, table structures, columns, constraints, nullability rules, and relationships.

---

## 1. Entity Relationship Overview

```
 [ Category ] 1 ─── N [ Job ] N ─── 1 [ Company ]
                        │               │
                        ├─ 1 ── N [ JobSkill ] N ── 1 [ Skill ]
                        ├─ 1 ── 1 [ VerificationResult ]
                        ├─ 1 ── N [ SavedJob ] N ── 1 [ User ]
                        └─ 1 ── N [ JobReport ] N ── 1 [ User ]

 [ JobSource ] 1 ─── N [ Job ]
```

---

## 2. Table Specifications

### 2.1 `users`
Stores system users (job seekers and administrators).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Unique user ID |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User email address |
| `password_hash` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `full_name` | VARCHAR(150) | NOT NULL | User's full name |
| `role` | VARCHAR(50) | NOT NULL | `ROLE_USER`, `ROLE_ADMIN` |
| `experience_level`| VARCHAR(50) | NULLable | Preferred experience level |
| `preferred_location`| VARCHAR(150)| NULLable | Preferred job search location |
| `created_at` | TIMESTAMP | NOT NULL | Account creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Last update timestamp |

---

### 2.2 `companies`
Stores employer entities. Company verification is maintained separately from job verification.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Unique company ID |
| `name` | VARCHAR(255) | NOT NULL | Official company name |
| `slug` | VARCHAR(255) | NOT NULL, UNIQUE | URL-friendly identifier |
| `domain` | VARCHAR(255) | NOT NULL | Official company domain (e.g. `google.com`) |
| `career_page_url`| VARCHAR(500) | NULLable | Official career portal URL |
| `logo_url` | VARCHAR(500) | NULLable | Company logo image URL |
| `verification_status`| VARCHAR(50)| NOT NULL | `VERIFIED`, `PROBABLY_VERIFIED`, `UNVERIFIED`, `SUSPICIOUS` |
| `created_at` | TIMESTAMP | NOT NULL | Record creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Record update timestamp |

---

### 2.3 `categories`
Job categories/sectors (e.g. Software Engineering, Data Science).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Unique category ID |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Category name |
| `slug` | VARCHAR(100) | NOT NULL, UNIQUE | Category URL slug |

---

### 2.4 `skills`
Standardized skill tags (e.g. Java, React, SQL).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Unique skill ID |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Skill name |
| `slug` | VARCHAR(100) | NOT NULL, UNIQUE | Skill URL slug |

---

### 2.5 `job_sources`
Ingestion channels and discovery sources.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Unique source ID |
| `name` | VARCHAR(100) | NOT NULL | Source name (e.g., `Greenhouse API`, `Official Career Page`) |
| `source_type` | VARCHAR(50) | NOT NULL | `AUTHORIZED_API`, `DIRECT_ATS`, `CAREER_PAGE`, `PUBLIC_FEED` |
| `trust_score` | INT | NOT NULL | Baseline score contribution (0-100) |
| `is_active` | BOOLEAN | NOT NULL | Active status flag |

---

### 2.6 `jobs`
Main job vacancies table. Strictly follows the principle of **never inventing missing information**.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Unique job ID |
| `title` | VARCHAR(255) | NOT NULL | Official job title |
| `company_id` | BIGINT | NOT NULL, FK(`companies.id`)| Associated company ID |
| `category_id` | BIGINT | NULLable, FK(`categories.id`)| Associated category ID |
| `source_id` | BIGINT | NOT NULL, FK(`job_sources.id`)| Associated source ID |
| `external_id` | VARCHAR(255) | NULLable | Source system identifier |
| `description` | TEXT | NOT NULL | Employer-provided job description |
| `location` | VARCHAR(255) | NOT NULL | Primary location or `Remote` |
| `is_remote` | BOOLEAN | NOT NULL | Remote indicator flag |
| `job_type` | VARCHAR(50) | NOT NULL | `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP` |
| `experience_level`| VARCHAR(50)| NOT NULL | `FRESHER`, `JUNIOR`, `MID`, `SENIOR`, `LEAD` |
| `salary_min` | NUMERIC(12,2)| NULLable | Minimum salary (NULL if undisclosed) |
| `salary_max` | NUMERIC(12,2)| NULLable | Maximum salary (NULL if undisclosed) |
| `salary_currency`| VARCHAR(10) | NULLable | `INR`, `USD`, `EUR` (NULL if undisclosed) |
| `salary_period` | VARCHAR(20) | NULLable | `YEARLY`, `MONTHLY`, `HOURLY` |
| `selection_process`| TEXT | NULLable | Selection process notes (NULL if not provided) |
| `application_url` | VARCHAR(1000)| NOT NULL | Direct link to original application page |
| `source_url` | VARCHAR(1000)| NOT NULL | Link to original source listing page |
| `posted_at` | TIMESTAMP | NOT NULL | Original posting time |
| `last_seen_at` | TIMESTAMP | NOT NULL | Last verified active timestamp |
| `deadline` | TIMESTAMP | NULLable | Expiration deadline (NULL if not set) |
| `status` | VARCHAR(50) | NOT NULL | `VERIFIED`, `STALE`, `EXPIRED`, `SUSPICIOUS`, `REJECTED` |
| `verification_score`| INT | NOT NULL | Calculated score (0-100) |
| `created_at` | TIMESTAMP | NOT NULL | DB record creation time |
| `updated_at` | TIMESTAMP | NOT NULL | DB record update time |

---

### 2.7 `job_skills`
Junction table linking `jobs` and `skills`.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `job_id` | BIGINT | NOT NULL, FK(`jobs.id`) |
| `skill_id` | BIGINT | NOT NULL, FK(`skills.id`) |
| PRIMARY KEY | (`job_id`, `skill_id`) | composite primary key |

---

### 2.8 `verification_results`
Stores detailed verification audit evidence for each job.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Unique verification result ID |
| `job_id` | BIGINT | NOT NULL, UNIQUE, FK(`jobs.id`)| Associated job ID |
| `company_verified`| BOOLEAN | NOT NULL | Company verification status |
| `original_source_found`| BOOLEAN | NOT NULL | Source match indicator |
| `url_status_code` | INT | NOT NULL | HTTP response status (e.g. `200`) |
| `url_working` | BOOLEAN | NOT NULL | URL availability flag |
| `job_available` | BOOLEAN | NOT NULL | Listing presence indicator |
| `is_duplicate` | BOOLEAN | NOT NULL | Duplicate check flag |
| `score` | INT | NOT NULL | Calculated score (0-100) |
| `evidence_json` | TEXT/JSONB | NOT NULL | Detailed bullet points & breakdown |
| `verified_at` | TIMESTAMP | NOT NULL | Timestamp of last verification check |

---

### 2.9 `saved_jobs`
User bookmarked jobs.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY |
| `user_id` | BIGINT | NOT NULL, FK(`users.id`) |
| `job_id` | BIGINT | NOT NULL, FK(`jobs.id`) |
| `saved_at` | TIMESTAMP | NOT NULL |
| UNIQUE CONSTRAINT | (`user_id`, `job_id`) | Prevent duplicate saves |

---

### 2.10 `job_reports`
User feedback for suspicious or broken job links.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Unique report ID |
| `job_id` | BIGINT | NOT NULL, FK(`jobs.id`) | Target job |
| `user_id` | BIGINT | NULLable, FK(`users.id`)| Reporter (NULL if anonymous) |
| `reason` | VARCHAR(100) | NOT NULL | `EXPIRED_LINK`, `MISLEADING_SALARY`, `FAKE_COMPANY`, `OTHER` |
| `details` | TEXT | NULLable | Extra details provided by user |
| `status` | VARCHAR(50) | NOT NULL | `OPEN`, `RESOLVED`, `DISMISSED` |
| `created_at` | TIMESTAMP | NOT NULL | Report creation timestamp |

---

## 3. Recommended Indexes

- `jobs(status, verification_score DESC, posted_at DESC)`
- `jobs(company_id)`
- `jobs(category_id)`
- `jobs(application_url_hash)` (for duplicate detection)
- `companies(domain)`
