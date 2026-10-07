PRODUCT REQUIREMENTS DOCUMENT (PRD)

JobRadar AI — AI-Powered Job Discovery, Verification & Direct Application Platform

Project Documentation • Version 1.0 • September 2026

1. Product Overview

JobRadar AI is a web platform that aggregates currently available job vacancies from multiple legitimate sources, normalizes and categorizes them, extracts useful job information with AI, evaluates evidence related to company/job legitimacy, and sends users to the original application page through a Direct Apply action.

The project is intentionally positioned as an AI-assisted job discovery and verification platform rather than a conventional job-posting portal.

2. Problem Statement

Job seekers must search across many sources to find current vacancies.

Job information is often inconsistent across sources and difficult to compare.

Salary, experience, skills and selection-process details may be missing or unstructured.

Users need a clear direct application path to the original company/application page.

Users benefit from evidence-based indicators that help them assess job/company trustworthiness without claiming absolute guarantees.

3. Product Goals

Aggregate fresh vacancies from multiple permitted job sources.

Provide fast search, filtering and sorting by role, location, experience, salary and employment type.

Show a concise, structured job profile with salary source clearly identified.

Provide a direct link to the original application page.

Use AI to extract role, skills, experience, salary, summary and selection-process information.

Generate an evidence-based Job Trust Score from company, source, URL, freshness, content and AI-confidence signals.

Support saved jobs, authentication and an administrative review workflow.

Provide a scalable Java/Spring Boot backend suitable for a production-oriented portfolio project.

4. Target Users

User

Needs

Key Features

Job Seeker

Find current, relevant jobs quickly

Search, filters, job details, trust score, direct apply, save jobs

Admin

Maintain data quality and review suspicious records

Dashboard, job/source review, suspicious jobs, company updates

System/AI

Process and enrich incoming job data

Aggregation, normalization, deduplication, extraction, verification

5. MVP Scope

React-based responsive web UI.

Spring Boot REST backend.

PostgreSQL persistence.

At least one external job-data integration plus manually seeded jobs for development.

Job search, filters and sorting.

Job details page with Direct Apply.

User registration/login and saved jobs.

Scheduled job ingestion.

AI-assisted job extraction and summary.

Verification engine and transparent trust-score breakdown.

Admin dashboard for job/company/source review.

Dockerized deployment.

6. Core Features & Acceptance Criteria

Feature

Requirement

Acceptance Criteria

Job aggregation

System imports jobs from configured sources and maps them into a common schema.

Imported records contain title, company, source and application URL at minimum.

Deduplication

System detects duplicate vacancies across sources.

Duplicate records are merged/linked rather than repeatedly displayed.

Search

User can search natural job titles/keywords.

Relevant title, role, skill and description fields are searched.

Filtering

User can filter by role, location, experience, salary and employment type.

Results update according to selected filters.

Job details

User can view structured job information.

Details include source, salary provenance, skills, description, experience and selection-process status.

Direct Apply

User can open the original application URL.

Apply action opens the stored original URL.

AI extraction

AI extracts structured information from job descriptions.

AI output is stored with confidence/status metadata.

Trust score

System calculates an evidence-based score.

Score exposes component signals and reasons.

Authentication

Users can register and log in.

Protected features require authenticated sessions.

Saved jobs

Users can save/remove jobs.

Saved jobs are associated with the authenticated user.

Admin review

Admin can review suspicious/expired jobs and sources.

Admin actions are protected by role-based authorization.

7. Product Rules

Company-provided salary must be distinguished from estimated salary.

Selection-process steps must be labeled as officially stated or AI-estimated.

Trust scores must be presented as evidence-based indicators, not guarantees of authenticity.

Suspicious indicators should trigger review rather than automatically accusing a company of fraud.

Old or unverified jobs should be archived/hidden according to freshness rules.

API keys and secrets must never be committed to source control.

8. Success Metrics

Metric

MVP Target

Measurement

Freshness

Majority of displayed jobs recently verified

last_verified / posted_date

Search usability

Relevant results returned quickly

API latency and query tests

Data quality

Low duplicate rate

Duplicate detection audit

Direct application

Valid apply URL on every publishable job

URL validation

AI extraction

High field completeness

Structured-field completeness audit

Reliability

Stable scheduled ingestion

Scheduler logs / failed source rate

9. Product Roadmap

Version 1: React + Spring Boot + PostgreSQL + manually seeded jobs + search/filter + job details + Direct Apply.

Version 2: External job API integration + automated ingestion + normalization + deduplication.

Version 3: AI classification, summaries, skills and selection-process extraction.

Version 4: Evidence-based verification, trust scoring and suspicious-job review.

Version 5: Production deployment, monitoring, alerts and future personalization.