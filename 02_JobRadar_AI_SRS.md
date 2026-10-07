SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

JobRadar AI — AI-Powered Job Discovery, Verification & Direct Application Platform

Project Documentation • Version 1.0 • September 2026

1. Introduction

1.1 Purpose

This SRS defines the functional, non-functional, interface, data and security requirements for JobRadar AI.

1.2 System Scope

The system collects job records from configured sources, processes them through normalization/deduplication/AI/verification services, stores them in PostgreSQL, exposes REST APIs through Spring Boot, and provides a React user interface.

2. Overall Description

2.1 System Architecture

Recommended architecture: modular monolith with clear modules for Job, Company, User, AI, Verification, Integration and Admin. This keeps the initial implementation manageable while allowing later service extraction.

High-level flow:

Job Sources → Ingestion → Normalization → Deduplication → PostgreSQL → AI Analysis + Verification → Trust Score → React UI → Original Application URL

3. Functional Requirements

ID

Requirement

Description

FR-01

Job ingestion

System shall fetch job data from configured APIs/sources on a schedule.

FR-02

Normalization

System shall map source-specific fields into a common Job model.

FR-03

Deduplication

System shall identify probable duplicate jobs using source IDs and normalized fields.

FR-04

Freshness

System shall store postedDate and lastVerified and support archive/expiry rules.

FR-05

Search

System shall search title, role, skills, description and company.

FR-06

Filters

System shall filter by role, location, experience, salary and employment type.

FR-07

Sorting

System shall sort by relevance, latest, salary and trust score.

FR-08

Job details

System shall provide a structured detail page.

FR-09

Direct Apply

System shall expose the original application URL.

FR-10

AI extraction

System shall extract structured fields from unstructured job descriptions.

FR-11

AI summary

System shall generate a short role introduction.

FR-12

Selection process

System shall store process steps with source status such as official or AI-estimated.

FR-13

Verification

System shall calculate a transparent evidence-based trust score.

FR-14

Authentication

System shall support registration, login and logout.

FR-15

Saved jobs

Authenticated users shall save and remove jobs.

FR-16

Admin

Admin shall review jobs, companies, sources and suspicious records.

FR-17

API

System shall expose REST endpoints for frontend operations.

FR-18

Scheduling

System shall periodically execute ingestion and verification tasks.

4. Non-Functional Requirements

ID

Area

Requirement

NFR-01 Performance

Common read/search APIs should target low-latency responses under normal MVP load.

NFR-02 Availability

Deployment should support automatic restart/recovery where the hosting platform provides it.

NFR-03 Security

Passwords must be hashed; protected endpoints must use authentication/authorization; secrets must use environment variables.

NFR-04 Scalability

Integration and service modules should be replaceable/extendable without changing the core Job model.

NFR-05 Maintainability

Use controller/service/repository separation and DTOs.

NFR-06 Reliability

Source failures must be isolated and logged so one failed source does not stop all ingestion.

NFR-07 Data quality

Jobs must preserve source URL/source identity and freshness metadata.

NFR-08 Usability

UI must be responsive on desktop, tablet and mobile.

NFR-09 Observability

Application logs should capture scheduled runs, source failures and verification failures.

NFR-10 Compliance

Integrations must follow the applicable source API terms, robots rules, licensing and attribution requirements.

5. REST API Specification

Method

Endpoint

Purpose

Access

GET

/api/jobs

List/search jobs

Public

GET

/api/jobs/{id}

Job details

Public

GET

/api/jobs/search

Search/filter jobs

Public

GET

/api/jobs/latest

Latest jobs

Public

GET

/api/jobs/verified

Verified/reviewed jobs

Public

GET

/api/jobs/role/{role}

Jobs by role

Public

POST

/api/auth/register

Register

Public

POST

/api/auth/login

Login

Public

POST

/api/jobs/{id}/save

Save job

User

DELETE

/api/jobs/{id}/save

Remove saved job

User

GET

/api/users/me/saved-jobs

Saved jobs

User

GET

/api/jobs/{id}/verification

Verification details

Public

POST

/api/jobs/{id}/verify

Run verification

Admin

POST

/api/ai/analyze-job/{id}

Analyze job

Admin/System

GET

/api/jobs/{id}/ai-analysis

AI analysis

Public

GET

/api/admin/jobs

Admin job list

Admin

GET

/api/admin/suspicious-jobs

Suspicious jobs

Admin

6. Data Model

Core entities: User, Company, Job, JobSkill, JobSource, SavedJob, VerificationResult. The Job entity stores sourceJobId, applyUrl, postedDate, lastVerified, salary provenance, verification status and trust score.

Entity

Important Fields

USER

id, name, email, passwordHash, role, createdAt

COMPANY

id, name, website, careerPage, industry, description, verificationScore

JOB

id, title, companyId, role, experienceLevel, location, employmentType, salary, description, selectionProcess, applyUrl, source, sourceJobId, trustScore, status, postedDate, lastVerified

JOB_SKILL

id, jobId, skill

SAVED_JOB

id, userId, jobId, createdAt

VERIFICATION_RESULT

id, jobId, componentScores, finalScore, reasons, verifiedAt

7. Security Requirements

Use Spring Security for authentication and role-based authorization.

Use a secure password-hashing mechanism; never store plaintext passwords.

Validate request payloads using Bean Validation.

Restrict admin endpoints to the ADMIN role.

Keep API keys, JWT secrets and database credentials in environment variables/secrets.

Validate outbound application URLs and preserve the source URL for traceability.

Log security-relevant failures without exposing secrets.

8. Error Handling

Use consistent HTTP status codes and a common error response format.

Return validation errors with field-level messages.

Gracefully handle unavailable external job sources.

Record AI timeouts/failures and allow retry.

Never publish incomplete records when required fields such as title/company/apply URL are missing.

9. Testing Requirements

JUnit 5 unit tests for services.

Mockito tests for external integrations.

Spring Boot integration tests for REST endpoints and persistence.

Postman/API tests for the complete endpoint set.

Frontend component and workflow tests for search, details and authentication.

Manual responsive testing across desktop/tablet/mobile.