package com.jobproof.dto;

import java.util.List;

public class JobApplicationDTO {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String jobLocation;
    private String jobType;

    private Long userId;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String currentRole;
    private Double yearsOfExperience;
    private String linkedinUrl;
    private String portfolioUrl;
    private String coverNote;

    private String status; // PENDING, REVIEWING, SHORTLISTED, REJECTED, ACCEPTED
    private Integer atsMatchScore;
    private List<String> skills;

    private String resumeFileName;
    private String resumeFileType;
    private String resumeParsedSummary;
    private String resumeExperience;
    private String resumeEducation;
    private String adminNotes;

    private String appliedAt;
    private String updatedAt;

    public JobApplicationDTO() {}

    public JobApplicationDTO(Long id, Long jobId, String jobTitle, String companyName, String jobLocation,
                             String jobType, Long userId, String applicantName, String applicantEmail,
                             String applicantPhone, String currentRole, Double yearsOfExperience,
                             String linkedinUrl, String portfolioUrl, String coverNote, String status,
                             Integer atsMatchScore, List<String> skills, String resumeFileName,
                             String resumeFileType, String resumeParsedSummary, String resumeExperience,
                             String resumeEducation, String adminNotes, String appliedAt, String updatedAt) {
        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.jobLocation = jobLocation;
        this.jobType = jobType;
        this.userId = userId;
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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getJobLocation() { return jobLocation; }
    public void setJobLocation(String jobLocation) { this.jobLocation = jobLocation; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

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

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

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

    public String getAppliedAt() { return appliedAt; }
    public void setAppliedAt(String appliedAt) { this.appliedAt = appliedAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public static JobApplicationDTOBuilder builder() { return new JobApplicationDTOBuilder(); }

    public static class JobApplicationDTOBuilder {
        private Long id;
        private Long jobId;
        private String jobTitle;
        private String companyName;
        private String jobLocation;
        private String jobType;
        private Long userId;
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
        private List<String> skills;
        private String resumeFileName;
        private String resumeFileType;
        private String resumeParsedSummary;
        private String resumeExperience;
        private String resumeEducation;
        private String adminNotes;
        private String appliedAt;
        private String updatedAt;

        public JobApplicationDTOBuilder id(Long id) { this.id = id; return this; }
        public JobApplicationDTOBuilder jobId(Long jobId) { this.jobId = jobId; return this; }
        public JobApplicationDTOBuilder jobTitle(String jobTitle) { this.jobTitle = jobTitle; return this; }
        public JobApplicationDTOBuilder companyName(String companyName) { this.companyName = companyName; return this; }
        public JobApplicationDTOBuilder jobLocation(String jobLocation) { this.jobLocation = jobLocation; return this; }
        public JobApplicationDTOBuilder jobType(String jobType) { this.jobType = jobType; return this; }
        public JobApplicationDTOBuilder userId(Long userId) { this.userId = userId; return this; }
        public JobApplicationDTOBuilder applicantName(String applicantName) { this.applicantName = applicantName; return this; }
        public JobApplicationDTOBuilder applicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; return this; }
        public JobApplicationDTOBuilder applicantPhone(String applicantPhone) { this.applicantPhone = applicantPhone; return this; }
        public JobApplicationDTOBuilder currentRole(String currentRole) { this.currentRole = currentRole; return this; }
        public JobApplicationDTOBuilder yearsOfExperience(Double yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; return this; }
        public JobApplicationDTOBuilder linkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; return this; }
        public JobApplicationDTOBuilder portfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; return this; }
        public JobApplicationDTOBuilder coverNote(String coverNote) { this.coverNote = coverNote; return this; }
        public JobApplicationDTOBuilder status(String status) { this.status = status; return this; }
        public JobApplicationDTOBuilder atsMatchScore(Integer atsMatchScore) { this.atsMatchScore = atsMatchScore; return this; }
        public JobApplicationDTOBuilder skills(List<String> skills) { this.skills = skills; return this; }
        public JobApplicationDTOBuilder resumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; return this; }
        public JobApplicationDTOBuilder resumeFileType(String resumeFileType) { this.resumeFileType = resumeFileType; return this; }
        public JobApplicationDTOBuilder resumeParsedSummary(String resumeParsedSummary) { this.resumeParsedSummary = resumeParsedSummary; return this; }
        public JobApplicationDTOBuilder resumeExperience(String resumeExperience) { this.resumeExperience = resumeExperience; return this; }
        public JobApplicationDTOBuilder resumeEducation(String resumeEducation) { this.resumeEducation = resumeEducation; return this; }
        public JobApplicationDTOBuilder adminNotes(String adminNotes) { this.adminNotes = adminNotes; return this; }
        public JobApplicationDTOBuilder appliedAt(String appliedAt) { this.appliedAt = appliedAt; return this; }
        public JobApplicationDTOBuilder updatedAt(String updatedAt) { this.updatedAt = updatedAt; return this; }

        public JobApplicationDTO build() {
            return new JobApplicationDTO(id, jobId, jobTitle, companyName, jobLocation, jobType,
                    userId, applicantName, applicantEmail, applicantPhone, currentRole,
                    yearsOfExperience, linkedinUrl, portfolioUrl, coverNote, status,
                    atsMatchScore, skills, resumeFileName, resumeFileType, resumeParsedSummary,
                    resumeExperience, resumeEducation, adminNotes, appliedAt, updatedAt);
        }
    }
}
