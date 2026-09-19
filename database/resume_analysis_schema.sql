-- JobProof Resume Storage, AI ATS Analysis, and Job Matching Schema
-- PostgreSQL 15+ Compatible DDL Script

-- 1. User Resumes Metadata and Content Storage
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

-- 2. Resume AI ATS Score & Feedback Analysis
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

-- 3. Resume to Active Job Postings Match Index
CREATE TABLE IF NOT EXISTS resume_job_matches (
    id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES user_resumes(id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    match_percentage INT NOT NULL DEFAULT 0,
    matched_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_resumes_user_id ON user_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_resume_id ON resume_analyses(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_job_matches_resume_id ON resume_job_matches(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_job_matches_job_id ON resume_job_matches(job_id);
