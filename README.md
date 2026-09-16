# JobProof 🎯

> **Find jobs. Verify jobs. Apply directly.**

JobProof is an AI-powered job discovery, verification, and direct-application platform built to eliminate job scams, ghost listings, expired posts, and fake salary estimates.

---

## 🌟 Core Product Principles

1. **Verification Over Speculation**: Every job listed on JobProof comes with transparent verification evidence and an Authenticity Score (0-100).
2. **Employer Source of Truth**: The original employer career page, verified ATS, or official job feed is treated as the ultimate source of truth.
3. **Direct Application**: Users are always directed to the original employer application URL when clicking "Apply Directly". No fake internal application forms.
4. **Never Invent Data**: Salary, job descriptions, requirements, and eligibility are never fabricated. If salary is absent from the official source, JobProof explicitly displays `"Salary not disclosed"`. If selection process details are absent, it displays `"Selection process not provided by employer."`
5. **AI Extraction Boundary**: AI is strictly utilized for text extraction, skill identification, title normalization, and duplicate detection. Deterministic logic handles status codes, URL validation, timestamps, source verification, and expiration rules.

---

## 🏗️ Day 1 Project Architecture & Directory Layout

```
Job_Finder/
├── backend/                  # Java 21, Spring Boot 3, REST APIs, JPA, Spring Security
│   ├── src/main/java/com/jobproof/
│   │   ├── controller/      # REST API Controllers
│   │   ├── service/         # Core Business Logic Services
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── entity/          # Database Entities
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── mapper/          # Entity <-> DTO Mappers
│   │   ├── exception/       # Global Exception Handling
│   │   ├── config/          # Application & CORS Configurations
│   │   ├── security/        # Auth & Security Configurations
│   │   ├── scheduler/       # Scheduled Verification Tasks
│   │   ├── ingestion/       # Source Ingestion Pipeline
│   │   ├── verification/    # Verification Engine & Rules
│   │   └── ai/              # AI Extraction & Matching Contracts
│   └── src/main/resources/  # application.yml configuration
├── frontend/                 # React, Vite, Tailwind CSS
│   ├── src/
│   │   ├── components/      # UI Components & Cards
│   │   ├── pages/           # Application Views
│   │   └── App.jsx          # Root Component & Verification UI Preview
├── database/                 # Database Schemas & Migrations
└── docs/                     # Technical Architecture & System Specs
    ├── architecture.md       # High-level architecture & pipeline specifications
    ├── database-design.md    # ERD, entities, indexes, & nullability rules
    ├── api-documentation.md # REST API endpoint specifications
    └── verification-system.md# Job verification scoring algorithm details
```

---

## 🛠️ Tech Stack

- **Backend**: Java 21, Spring Boot 3.x, Spring Web, Spring Data JPA, Hibernate, Maven, PostgreSQL
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React
- **Dev Tools**: Git, Environment Variables (`.env`)

---

## 🚀 Quick Start Instructions

### Prerequisites
- JDK 21+
- Node.js 18+
- Maven 3.8+ (or included wrapper)
- PostgreSQL 15+

### Backend Setup
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080` (Health check endpoint: `http://localhost:8080/api/health`)*

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend dev server runs on `http://localhost:5173`*

---

## 📑 Documentation Links

- [Architecture Overview](file:///c:/Users/tarun/OneDrive/Desktop/Job_Finder/docs/architecture.md)
- [Database Schema & ERD](file:///c:/Users/tarun/OneDrive/Desktop/Job_Finder/docs/database-design.md)
- [API Documentation](file:///c:/Users/tarun/OneDrive/Desktop/Job_Finder/docs/api-documentation.md)
- [Job Verification Engine Specification](file:///c:/Users/tarun/OneDrive/Desktop/Job_Finder/docs/verification-system.md)
