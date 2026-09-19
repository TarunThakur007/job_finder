package com.jobproof.dto;

import java.time.LocalDateTime;
import java.util.List;

public class JobDTO {
    private Long id;
    private String title;
    private CompanyDTO company;
    private String role;
    private String experienceLevel;
    private String location;
    private String employmentType;
    private Double salaryMin;
    private Double salaryMax;
    private String salaryCurrency;
    private Boolean isSalaryEstimated;
    private String salaryDisplay;
    private String description;
    private String summary;
    private List<String> selectionProcess;
    private String applyUrl;
    private String source;
    private String sourceJobId;
    private Integer trustScore;
    private String verificationStatus;
    private LocalDateTime postedDate;
    private LocalDateTime lastVerified;
    private List<String> skills;
    private List<String> evidence;
    private Integer vacanciesCount = 3;

    public JobDTO() {}

    public JobDTO(Long id, String title, CompanyDTO company, String role, String experienceLevel, String location, String employmentType, Double salaryMin, Double salaryMax, String salaryCurrency, Boolean isSalaryEstimated, String salaryDisplay, String description, String summary, List<String> selectionProcess, String applyUrl, String source, String sourceJobId, Integer trustScore, String verificationStatus, LocalDateTime postedDate, LocalDateTime lastVerified, List<String> skills, List<String> evidence) {
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
        this.salaryDisplay = salaryDisplay;
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
        this.skills = skills;
        this.evidence = evidence;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public CompanyDTO getCompany() { return company; }
    public void setCompany(CompanyDTO company) { this.company = company; }

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

    public String getSalaryDisplay() { return salaryDisplay; }
    public void setSalaryDisplay(String salaryDisplay) { this.salaryDisplay = salaryDisplay; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getSelectionProcess() { return selectionProcess; }
    public void setSelectionProcess(List<String> selectionProcess) { this.selectionProcess = selectionProcess; }

    public String getApplyUrl() { return applyUrl; }
    public void setApplyUrl(String applyUrl) { this.applyUrl = applyUrl; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getSourceJobId() { return sourceJobId; }
    public void setSourceJobId(String sourceJobId) { this.sourceJobId = sourceJobId; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public LocalDateTime getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDateTime postedDate) { this.postedDate = postedDate; }

    public LocalDateTime getLastVerified() { return lastVerified; }
    public void setLastVerified(LocalDateTime lastVerified) { this.lastVerified = lastVerified; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<String> getEvidence() { return evidence; }
    public void setEvidence(List<String> evidence) { this.evidence = evidence; }

    public static JobDTOBuilder builder() { return new JobDTOBuilder(); }

    public static class JobDTOBuilder {
        private Long id;
        private String title;
        private CompanyDTO company;
        private String role;
        private String experienceLevel;
        private String location;
        private String employmentType;
        private Double salaryMin;
        private Double salaryMax;
        private String salaryCurrency;
        private Boolean isSalaryEstimated;
        private String salaryDisplay;
        private String description;
        private String summary;
        private List<String> selectionProcess;
        private String applyUrl;
        private String source;
        private String sourceJobId;
        private Integer trustScore;
        private String verificationStatus;
        private LocalDateTime postedDate;
        private LocalDateTime lastVerified;
        private List<String> skills;
        private List<String> evidence;

        public JobDTOBuilder id(Long id) { this.id = id; return this; }
        public JobDTOBuilder title(String title) { this.title = title; return this; }
        public JobDTOBuilder company(CompanyDTO company) { this.company = company; return this; }
        public JobDTOBuilder role(String role) { this.role = role; return this; }
        public JobDTOBuilder experienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; return this; }
        public JobDTOBuilder location(String location) { this.location = location; return this; }
        public JobDTOBuilder employmentType(String employmentType) { this.employmentType = employmentType; return this; }
        public JobDTOBuilder salaryMin(Double salaryMin) { this.salaryMin = salaryMin; return this; }
        public JobDTOBuilder salaryMax(Double salaryMax) { this.salaryMax = salaryMax; return this; }
        public JobDTOBuilder salaryCurrency(String salaryCurrency) { this.salaryCurrency = salaryCurrency; return this; }
        public JobDTOBuilder isSalaryEstimated(Boolean isSalaryEstimated) { this.isSalaryEstimated = isSalaryEstimated; return this; }
        public JobDTOBuilder salaryDisplay(String salaryDisplay) { this.salaryDisplay = salaryDisplay; return this; }
        public JobDTOBuilder description(String description) { this.description = description; return this; }
        public JobDTOBuilder summary(String summary) { this.summary = summary; return this; }
        public JobDTOBuilder selectionProcess(List<String> selectionProcess) { this.selectionProcess = selectionProcess; return this; }
        public JobDTOBuilder applyUrl(String applyUrl) { this.applyUrl = applyUrl; return this; }
        public JobDTOBuilder source(String source) { this.source = source; return this; }
        public JobDTOBuilder sourceJobId(String sourceJobId) { this.sourceJobId = sourceJobId; return this; }
        public JobDTOBuilder trustScore(Integer trustScore) { this.trustScore = trustScore; return this; }
        public JobDTOBuilder verificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; return this; }
        public JobDTOBuilder postedDate(LocalDateTime postedDate) { this.postedDate = postedDate; return this; }
        public JobDTOBuilder lastVerified(LocalDateTime lastVerified) { this.lastVerified = lastVerified; return this; }
        public JobDTOBuilder skills(List<String> skills) { this.skills = skills; return this; }
        public JobDTOBuilder evidence(List<String> evidence) { this.evidence = evidence; return this; }

        public JobDTO build() {
            return new JobDTO(id, title, company, role, experienceLevel, location, employmentType, salaryMin, salaryMax, salaryCurrency, isSalaryEstimated, salaryDisplay, description, summary, selectionProcess, applyUrl, source, sourceJobId, trustScore, verificationStatus, postedDate, lastVerified, skills, evidence);
        }
    }
}
