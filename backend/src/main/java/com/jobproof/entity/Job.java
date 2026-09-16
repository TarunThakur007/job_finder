package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private String role;

    @Column(name = "experience_level")
    private String experienceLevel;

    private String location;

    @Column(name = "employment_type")
    private String employmentType;

    @Column(name = "salary_min")
    private Double salaryMin;

    @Column(name = "salary_max")
    private Double salaryMax;

    @Column(name = "salary_currency")
    private String salaryCurrency;

    @Column(name = "is_salary_estimated")
    private Boolean isSalaryEstimated;

    @Column(length = 3000)
    private String description;

    @Column(length = 2000)
    private String summary;

    @Column(name = "selection_process", length = 2000)
    private String selectionProcess;

    @Column(name = "apply_url", nullable = false, length = 1000)
    private String applyUrl;

    private String source;

    @Column(name = "source_job_id")
    private String sourceJobId;

    @Column(name = "trust_score")
    private Integer trustScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus;

    @Column(name = "posted_date")
    private LocalDateTime postedDate;

    @Column(name = "last_verified")
    private LocalDateTime lastVerified;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<JobSkill> skills = new ArrayList<>();

    public Job() {}

    public Job(Long id, String title, Company company, String role, String experienceLevel, String location, String employmentType, Double salaryMin, Double salaryMax, String salaryCurrency, Boolean isSalaryEstimated, String description, String summary, String selectionProcess, String applyUrl, String source, String sourceJobId, Integer trustScore, VerificationStatus verificationStatus, LocalDateTime postedDate, LocalDateTime lastVerified, List<JobSkill> skills) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.role = role;
        this.experienceLevel = experienceLevel;
        this.location = location;
        this.employmentType = employmentType;
        this.salaryMin = salaryMin;
        this.salaryMax = salaryMax;
        this.salaryCurrency = salaryCurrency;
        this.isSalaryEstimated = isSalaryEstimated;
        this.description = description;
        this.summary = summary;
        this.selectionProcess = selectionProcess;
        this.applyUrl = applyUrl;
        this.source = source;
        this.sourceJobId = sourceJobId;
        this.trustScore = trustScore;
        this.verificationStatus = verificationStatus;
        this.postedDate = postedDate;
        this.lastVerified = lastVerified;
        this.skills = skills != null ? skills : new ArrayList<>();
    }

    @PrePersist
    protected void onCreate() {
        if (this.postedDate == null) {
            this.postedDate = LocalDateTime.now();
        }
        this.lastVerified = LocalDateTime.now();
        if (this.trustScore == null) {
            this.trustScore = 85;
        }
        if (this.verificationStatus == null) {
            this.verificationStatus = VerificationStatus.TRUSTED;
        }
        if (this.isSalaryEstimated == null) {
            this.isSalaryEstimated = false;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public Double getSalaryMin() { return salaryMin; }
    public void setSalaryMin(Double salaryMin) { this.salaryMin = salaryMin; }

    public Double getSalaryMax() { return salaryMax; }
    public void setSalaryMax(Double salaryMax) { this.salaryMax = salaryMax; }

    public String getSalaryCurrency() { return salaryCurrency; }
    public void setSalaryCurrency(String salaryCurrency) { this.salaryCurrency = salaryCurrency; }

    public Boolean getIsSalaryEstimated() { return isSalaryEstimated; }
    public void setIsSalaryEstimated(Boolean isSalaryEstimated) { this.isSalaryEstimated = isSalaryEstimated; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getSelectionProcess() { return selectionProcess; }
    public void setSelectionProcess(String selectionProcess) { this.selectionProcess = selectionProcess; }

    public String getApplyUrl() { return applyUrl; }
    public void setApplyUrl(String applyUrl) { this.applyUrl = applyUrl; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getSourceJobId() { return sourceJobId; }
    public void setSourceJobId(String sourceJobId) { this.sourceJobId = sourceJobId; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public LocalDateTime getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDateTime postedDate) { this.postedDate = postedDate; }

    public LocalDateTime getLastVerified() { return lastVerified; }
    public void setLastVerified(LocalDateTime lastVerified) { this.lastVerified = lastVerified; }

    public List<JobSkill> getSkills() { return skills; }
    public void setSkills(List<JobSkill> skills) { this.skills = skills; }

    public static JobBuilder builder() { return new JobBuilder(); }

    public static class JobBuilder {
        private Long id;
        private String title;
        private Company company;
        private String role;
        private String experienceLevel;
        private String location;
        private String employmentType;
        private Double salaryMin;
        private Double salaryMax;
        private String salaryCurrency;
        private Boolean isSalaryEstimated;
        private String description;
        private String summary;
        private String selectionProcess;
        private String applyUrl;
        private String source;
        private String sourceJobId;
        private Integer trustScore;
        private VerificationStatus verificationStatus;
        private LocalDateTime postedDate;
        private LocalDateTime lastVerified;
        private List<JobSkill> skills = new ArrayList<>();

        public JobBuilder id(Long id) { this.id = id; return this; }
        public JobBuilder title(String title) { this.title = title; return this; }
        public JobBuilder company(Company company) { this.company = company; return this; }
        public JobBuilder role(String role) { this.role = role; return this; }
        public JobBuilder experienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; return this; }
        public JobBuilder location(String location) { this.location = location; return this; }
        public JobBuilder employmentType(String employmentType) { this.employmentType = employmentType; return this; }
        public JobBuilder salaryMin(Double salaryMin) { this.salaryMin = salaryMin; return this; }
        public JobBuilder salaryMax(Double salaryMax) { this.salaryMax = salaryMax; return this; }
        public JobBuilder salaryCurrency(String salaryCurrency) { this.salaryCurrency = salaryCurrency; return this; }
        public JobBuilder isSalaryEstimated(Boolean isSalaryEstimated) { this.isSalaryEstimated = isSalaryEstimated; return this; }
        public JobBuilder description(String description) { this.description = description; return this; }
        public JobBuilder summary(String summary) { this.summary = summary; return this; }
        public JobBuilder selectionProcess(String selectionProcess) { this.selectionProcess = selectionProcess; return this; }
        public JobBuilder applyUrl(String applyUrl) { this.applyUrl = applyUrl; return this; }
        public JobBuilder source(String source) { this.source = source; return this; }
        public JobBuilder sourceJobId(String sourceJobId) { this.sourceJobId = sourceJobId; return this; }
        public JobBuilder trustScore(Integer trustScore) { this.trustScore = trustScore; return this; }
        public JobBuilder verificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; return this; }
        public JobBuilder postedDate(LocalDateTime postedDate) { this.postedDate = postedDate; return this; }
        public JobBuilder lastVerified(LocalDateTime lastVerified) { this.lastVerified = lastVerified; return this; }
        public JobBuilder skills(List<JobSkill> skills) { this.skills = skills; return this; }

        public Job build() {
            return new Job(id, title, company, role, experienceLevel, location, employmentType, salaryMin, salaryMax, salaryCurrency, isSalaryEstimated, description, summary, selectionProcess, applyUrl, source, sourceJobId, trustScore, verificationStatus, postedDate, lastVerified, skills);
        }
    }

    public enum VerificationStatus {
        HIGHLY_TRUSTED,
        TRUSTED,
        NEEDS_REVIEW,
        HIGH_RISK
    }
}
