package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "applicant_name", nullable = false)
    private String applicantName;

    @Column(name = "applicant_email", nullable = false)
    private String applicantEmail;

    @Column(name = "applicant_phone")
    private String applicantPhone;

    @Column(name = "candidate_role")
    private String currentRole;

    @Column(name = "years_of_experience")
    private Double yearsOfExperience;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "cover_note", columnDefinition = "TEXT")
    private String coverNote;

    @Column(name = "status", nullable = false)
    private String status; // PENDING, REVIEWING, SHORTLISTED, REJECTED, ACCEPTED

    @Column(name = "ats_match_score")
    private Integer atsMatchScore;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Column(name = "resume_filename")
    private String resumeFileName;

    @Column(name = "resume_file_type")
    private String resumeFileType;

    @Column(name = "resume_parsed_summary", columnDefinition = "TEXT")
    private String resumeParsedSummary;

    @Column(name = "resume_experience", columnDefinition = "TEXT")
    private String resumeExperience;

    @Column(name = "resume_education", columnDefinition = "TEXT")
    private String resumeEducation;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "applied_at", nullable = false, updatable = false)
    private LocalDateTime appliedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public JobApplication() {}

    public JobApplication(Long id, Job job, User user, String applicantName, String applicantEmail,
                          String applicantPhone, String currentRole, Double yearsOfExperience,
                          String linkedinUrl, String portfolioUrl, String coverNote, String status,
                          Integer atsMatchScore, String skills, String resumeFileName, String resumeFileType,
                          String resumeParsedSummary, String resumeExperience, String resumeEducation,
                          String adminNotes, LocalDateTime appliedAt, LocalDateTime updatedAt) {
        this.id = id;
        this.job = job;
        this.user = user;
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.applicantPhone = applicantPhone;
        this.currentRole = currentRole;
        this.yearsOfExperience = yearsOfExperience;
        this.linkedinUrl = linkedinUrl;
        this.portfolioUrl = portfolioUrl;
        this.coverNote = coverNote;
        this.status = status;
        this.atsMatchScore = atsMatchScore;
        this.skills = skills;
        this.resumeFileName = resumeFileName;
        this.resumeFileType = resumeFileType;
        this.resumeParsedSummary = resumeParsedSummary;
        this.resumeExperience = resumeExperience;
        this.resumeEducation = resumeEducation;
        this.adminNotes = adminNotes;
        this.appliedAt = appliedAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.appliedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public String getApplicantEmail() { return applicantEmail; }
    public void setApplicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; }

    public String getApplicantPhone() { return applicantPhone; }
    public void setApplicantPhone(String applicantPhone) { this.applicantPhone = applicantPhone; }

    public String getCurrentRole() { return currentRole; }
    public void setCurrentRole(String currentRole) { this.currentRole = currentRole; }

    public Double getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Double yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getCoverNote() { return coverNote; }
    public void setCoverNote(String coverNote) { this.coverNote = coverNote; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getAtsMatchScore() { return atsMatchScore; }
    public void setAtsMatchScore(Integer atsMatchScore) { this.atsMatchScore = atsMatchScore; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getResumeFileName() { return resumeFileName; }
    public void setResumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; }

    public String getResumeFileType() { return resumeFileType; }
    public void setResumeFileType(String resumeFileType) { this.resumeFileType = resumeFileType; }

    public String getResumeParsedSummary() { return resumeParsedSummary; }
    public void setResumeParsedSummary(String resumeParsedSummary) { this.resumeParsedSummary = resumeParsedSummary; }

    public String getResumeExperience() { return resumeExperience; }
    public void setResumeExperience(String resumeExperience) { this.resumeExperience = resumeExperience; }

    public String getResumeEducation() { return resumeEducation; }
    public void setResumeEducation(String resumeEducation) { this.resumeEducation = resumeEducation; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static JobApplicationBuilder builder() { return new JobApplicationBuilder(); }

    public static class JobApplicationBuilder {
        private Long id;
        private Job job;
        private User user;
        private String applicantName;
        private String applicantEmail;
        private String applicantPhone;
        private String currentRole;
        private Double yearsOfExperience;
        private String linkedinUrl;
        private String portfolioUrl;
        private String coverNote;
        private String status;
        private Integer atsMatchScore;
        private String skills;
        private String resumeFileName;
        private String resumeFileType;
        private String resumeParsedSummary;
        private String resumeExperience;
        private String resumeEducation;
        private String adminNotes;
        private LocalDateTime appliedAt;
        private LocalDateTime updatedAt;

        public JobApplicationBuilder id(Long id) { this.id = id; return this; }
        public JobApplicationBuilder job(Job job) { this.job = job; return this; }
        public JobApplicationBuilder user(User user) { this.user = user; return this; }
        public JobApplicationBuilder applicantName(String applicantName) { this.applicantName = applicantName; return this; }
        public JobApplicationBuilder applicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; return this; }
        public JobApplicationBuilder applicantPhone(String applicantPhone) { this.applicantPhone = applicantPhone; return this; }
        public JobApplicationBuilder currentRole(String currentRole) { this.currentRole = currentRole; return this; }
        public JobApplicationBuilder yearsOfExperience(Double yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; return this; }
        public JobApplicationBuilder linkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; return this; }
        public JobApplicationBuilder portfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; return this; }
        public JobApplicationBuilder coverNote(String coverNote) { this.coverNote = coverNote; return this; }
        public JobApplicationBuilder status(String status) { this.status = status; return this; }
        public JobApplicationBuilder atsMatchScore(Integer atsMatchScore) { this.atsMatchScore = atsMatchScore; return this; }
        public JobApplicationBuilder skills(String skills) { this.skills = skills; return this; }
        public JobApplicationBuilder resumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; return this; }
        public JobApplicationBuilder resumeFileType(String resumeFileType) { this.resumeFileType = resumeFileType; return this; }
        public JobApplicationBuilder resumeParsedSummary(String resumeParsedSummary) { this.resumeParsedSummary = resumeParsedSummary; return this; }
        public JobApplicationBuilder resumeExperience(String resumeExperience) { this.resumeExperience = resumeExperience; return this; }
        public JobApplicationBuilder resumeEducation(String resumeEducation) { this.resumeEducation = resumeEducation; return this; }
        public JobApplicationBuilder adminNotes(String adminNotes) { this.adminNotes = adminNotes; return this; }
        public JobApplicationBuilder appliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; return this; }
        public JobApplicationBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public JobApplication build() {
            return new JobApplication(id, job, user, applicantName, applicantEmail, applicantPhone,
                    currentRole, yearsOfExperience, linkedinUrl, portfolioUrl, coverNote,
                    status, atsMatchScore, skills, resumeFileName, resumeFileType,
                    resumeParsedSummary, resumeExperience, resumeEducation, adminNotes,
                    appliedAt, updatedAt);
        }
    }
}
