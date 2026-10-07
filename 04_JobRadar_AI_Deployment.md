DEPLOYMENT & OPERATIONS DOCUMENT

JobRadar AI — AI-Powered Job Discovery, Verification & Direct Application Platform

Project Documentation • Version 1.0 • September 2026

1. Deployment Objective

Deploy JobRadar AI as a production-style web application with a React frontend, Spring Boot backend, PostgreSQL database and scheduled job-ingestion/verification processes.

2. Recommended Deployment Architecture

Browser → React Frontend Hosting → Spring Boot API → PostgreSQL. The backend also communicates with external Job APIs and AI APIs. Scheduled ingestion runs inside the backend for the MVP.

Recommended portfolio stack: Frontend on Vercel or equivalent, backend on Render/Railway or equivalent, managed PostgreSQL, Docker for repeatable backend deployment.

3. Environments

Environment

Purpose

Configuration

Local

Development

localhost React + Spring Boot + local/managed PostgreSQL

Staging

Integration testing

Production-like APIs/database with test secrets

Production

Public application

Managed hosting, production secrets, monitoring and backups

4. Environment Variables

Variable

Purpose

DATABASE_URL / DB_HOST

PostgreSQL connection

DB_USERNAME

Database user

DB_PASSWORD

Database password

JWT_SECRET

Authentication signing secret

AI_API_KEY

AI provider key

JOB_SOURCE_API_KEY

External job-source API key

FRONTEND_URL

Allowed frontend origin

CORS_ALLOWED_ORIGINS

CORS configuration

5. Docker Strategy

Create a Dockerfile for the Spring Boot backend.

Build the React frontend separately and deploy it through a frontend hosting service or a web server container.

Use environment variables at runtime.

Do not bake secrets into Docker images.

Use Docker Compose locally if you want a repeatable PostgreSQL + backend development environment.

6. CI/CD Workflow

Developer pushes code to GitHub.

CI runs compilation, unit tests and static checks.

Build Docker image for backend.

Deploy backend to the selected hosting provider.

Build/deploy React frontend.

Run smoke tests against the deployed API.

Monitor logs and scheduled ingestion.

7. Database Deployment

Use managed PostgreSQL for production.

Run schema migrations rather than manually editing production tables.

Create regular backups.

Use indexes for common search/filter fields.

Keep production credentials outside Git.

8. Scheduled Jobs

Initial target: run ingestion periodically (for example hourly) and verify/update freshness. The scheduler should record start time, source, records fetched, records inserted, updated records, duplicates, failures and completion status.

For larger scale, move ingestion into a queue/worker architecture rather than keeping all work inside one web process.

9. Security Checklist

HTTPS enabled in production.

Secure password hashing.

JWT secret stored in hosting secret manager/environment.

CORS restricted to known frontend origins.

Admin endpoints protected by role.

Input validation enabled.

Rate limiting considered for public endpoints.

External URLs validated and displayed with source attribution where required.

API terms, licensing, robots rules and attribution requirements reviewed for each data source.

10. Monitoring & Logging

Area

Monitor

Application

HTTP 4xx/5xx, latency, startup failures

Database

Connection errors, slow queries, storage

Ingestion

Source failures, record counts, duplicate rate

AI

Latency, timeouts, token/cost usage where available

Verification

Failed checks, low-confidence records

Availability

Health endpoint and uptime

11. Health Endpoints

Recommended: GET /actuator/health for deployment health checks. Additional readiness/liveness checks can be enabled when the hosting environment benefits from them.

12. Production Release Checklist

Build passes locally and in CI.

Database migrations applied successfully.

Environment variables configured.

CORS configured.

Frontend points to production API.

Authentication tested.

Search/filter/sort tested.

Direct Apply URLs tested.

AI failure fallback tested.

Verification score breakdown tested.

Expired/suspicious job behavior tested.

Admin access tested.

Mobile layout tested.

Logs and backups verified.

13. Rollback Plan

Identify the failed release from deployment logs.

Rollback the frontend/backend deployment to the previous known-good version.

If a database migration caused the issue, follow the migration's tested rollback/recovery procedure.

Re-run smoke tests.

Record the incident and fix before redeployment.

14. Scaling Path

MVP: modular monolith + PostgreSQL. Next: Redis caching, OpenSearch/Elasticsearch for advanced search, queue-based ingestion, separate AI/verification workers, object storage for assets, and stronger observability. Kubernetes/microservices should be introduced only when actual scale requires them.