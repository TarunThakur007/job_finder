-- ====================================================================
-- JobProof Database Schema
-- Compatible with PostgreSQL 15+, MySQL 8+, and H2 Database
-- ====================================================================

-- 1. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    domain VARCHAR(255) NOT NULL,
    career_page_url VARCHAR(500),
    logo_url VARCHAR(500),
    verification_status VARCHAR(50) NOT NULL DEFAULT 'UNVERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE
);

-- 3. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE
);

-- 4. JOB SOURCES TABLE
CREATE TABLE IF NOT EXISTS job_sources (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    trust_score INT NOT NULL DEFAULT 50,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. JOBS TABLE
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company_id BIGINT NOT NULL REFERENCES companies(id),
    category_id BIGINT REFERENCES categories(id),
    source_id BIGINT NOT NULL REFERENCES job_sources(id),
    external_id VARCHAR(255),
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    is_remote BOOLEAN NOT NULL DEFAULT FALSE,
    job_type VARCHAR(50) NOT NULL,
    experience_level VARCHAR(50) NOT NULL,
    salary_min NUMERIC(12,2),
    salary_max NUMERIC(12,2),
    salary_currency VARCHAR(10),
    salary_period VARCHAR(20),
    selection_process TEXT,
    application_url VARCHAR(1000) NOT NULL,
    source_url VARCHAR(1000) NOT NULL,
    posted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_REVIEW',
    verification_score INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. JOB SKILLS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS job_skills (
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, skill_id)
);

-- 7. VERIFICATION RESULTS TABLE
CREATE TABLE IF NOT EXISTS verification_results (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL UNIQUE REFERENCES jobs(id) ON DELETE CASCADE,
    company_verified BOOLEAN NOT NULL DEFAULT FALSE,
    original_source_found BOOLEAN NOT NULL DEFAULT FALSE,
    url_status_code INT NOT NULL DEFAULT 0,
    url_working BOOLEAN NOT NULL DEFAULT FALSE,
    job_available BOOLEAN NOT NULL DEFAULT FALSE,
    is_duplicate BOOLEAN NOT NULL DEFAULT FALSE,
    score INT NOT NULL DEFAULT 0,
    evidence_json TEXT NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. USER PROFILES TABLE (Stores user login credentials and profile details)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    headline VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    bio TEXT,
    years_of_experience NUMERIC(4,1) DEFAULT 0.0,
    skills TEXT,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. USER LOGIN LOGS TABLE (Tracks user login sessions, timestamps, and audit info)
CREATE TABLE IF NOT EXISTS user_login_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    login_status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    ip_address VARCHAR(100),
    user_agent VARCHAR(500),
    logged_in_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. USER EXPERIENCES TABLE (Stores user shared interview & work experiences)
CREATE TABLE IF NOT EXISTS user_experiences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    experience_type VARCHAR(50) NOT NULL DEFAULT 'INTERVIEW_EXPERIENCE', -- 'INTERVIEW_EXPERIENCE', 'WORK_EXPERIENCE', 'CAREER_TIPS'
    employment_type VARCHAR(50) DEFAULT 'FULL_TIME', -- 'FULL_TIME', 'INTERNSHIP', 'CONTRACT'
    work_mode VARCHAR(50) DEFAULT 'HYBRID', -- 'REMOTE', 'HYBRID', 'ONSITE'
    location VARCHAR(255),
    years_of_experience NUMERIC(4,1) DEFAULT 0.0,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    difficulty_level VARCHAR(50) DEFAULT 'MEDIUM', -- 'EASY', 'MEDIUM', 'HARD', 'VERY_HARD'
    interview_rounds INT DEFAULT 1,
    questions_asked TEXT,
    experience_story TEXT NOT NULL,
    tips_and_advice TEXT,
    offer_status VARCHAR(50) DEFAULT 'OFFERED_ACCEPTED', -- 'OFFERED_ACCEPTED', 'OFFERED_DECLINED', 'REJECTED', 'PENDING'
    anonymous BOOLEAN DEFAULT FALSE,
    upvotes INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'APPROVED', -- 'APPROVED', 'PENDING_REVIEW', 'FLAGGED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. USER RESUMES TABLE
CREATE TABLE IF NOT EXISTS user_resumes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    file_content_base64 TEXT,
    raw_extracted_text TEXT,
    parsed_contact_info JSONB,
    parsed_skills JSONB,
    parsed_experience JSONB,
    parsed_education JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'PARSED',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. RESUME ANALYSES TABLE
CREATE TABLE IF NOT EXISTS resume_analyses (
    id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES user_resumes(id) ON DELETE CASCADE,
    target_job_role VARCHAR(255) NOT NULL,
    overall_ats_score INT NOT NULL DEFAULT 0,
    formatting_score INT NOT NULL DEFAULT 0,
    keyword_match_score INT NOT NULL DEFAULT 0,
    impact_verb_score INT NOT NULL DEFAULT 0,
    extracted_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    missing_critical_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
    formatting_warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
    improvement_recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. INDEXES FOR HIGH-PERFORMANCE QUERIES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_user_id ON user_login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_logged_in_at ON user_login_logs(logged_in_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_experiences_company ON user_experiences(company_name);
CREATE INDEX IF NOT EXISTS idx_user_experiences_type ON user_experiences(experience_type);
CREATE INDEX IF NOT EXISTS idx_user_experiences_user_id ON user_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_experiences_created ON user_experiences(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_resumes_user_id ON user_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_resume_id ON resume_analyses(resume_id);

