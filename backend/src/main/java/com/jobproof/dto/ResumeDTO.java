package com.jobproof.dto;

import java.util.List;

public class ResumeDTO {
    private Long id;
    private String filename;
    private String fileType;
    private Long fileSizeBytes;
    private String targetJobRole;
    private String targetJobDescription;
    private String rawResumeText;
    private Integer overallAtsScore;
    private Double atsScoreOutOf10;
    private Integer formattingScore;
    private Integer keywordMatchScore;
    private Integer impactVerbScore;
    private List<String> extractedSkills;
    private List<String> missingCriticalSkills;
    private List<String> strengths;
    private List<String> formattingWarnings;
    private List<String> improvementRecommendations;
    private List<BulletEnhancement> bulletEnhancements;
    private String summary;
    private String uploadedAt;
    private String candidateName;
    private String candidateEmail;
    private String fileContentBase64;
    private String jobReadinessStatus;
    private List<String> jobReadinessRoadmap;
    private String recommendedProject;

    public static class BulletEnhancement {
        private String originalBullet;
        private String improvedBullet;
        private String improvementReason;

        public BulletEnhancement() {}

        public BulletEnhancement(String originalBullet, String improvedBullet, String improvementReason) {
            this.originalBullet = originalBullet;
            this.improvedBullet = improvedBullet;
            this.improvementReason = improvementReason;
        }

        public String getOriginalBullet() { return originalBullet; }
        public void setOriginalBullet(String originalBullet) { this.originalBullet = originalBullet; }

        public String getImprovedBullet() { return improvedBullet; }
        public void setImprovedBullet(String improvedBullet) { this.improvedBullet = improvedBullet; }

        public String getImprovementReason() { return improvementReason; }
        public void setImprovementReason(String improvementReason) { this.improvementReason = improvementReason; }
    }

    public ResumeDTO() {}

    public ResumeDTO(Long id, String filename, String fileType, Long fileSizeBytes, String targetJobRole,
                     String targetJobDescription, String rawResumeText,
                     Integer overallAtsScore, Integer formattingScore, Integer keywordMatchScore,
                     Integer impactVerbScore, List<String> extractedSkills, List<String> missingCriticalSkills,
                     List<String> strengths, List<String> formattingWarnings,
                     List<String> improvementRecommendations, List<BulletEnhancement> bulletEnhancements,
                     String summary, String uploadedAt) {
        this.id = id;
        this.filename = filename;
        this.fileType = fileType;
        this.fileSizeBytes = fileSizeBytes;
        this.targetJobRole = targetJobRole;
        this.targetJobDescription = targetJobDescription;
        this.rawResumeText = rawResumeText;
        this.overallAtsScore = overallAtsScore;
        this.formattingScore = formattingScore;
        this.keywordMatchScore = keywordMatchScore;
        this.impactVerbScore = impactVerbScore;
        this.extractedSkills = extractedSkills;
        this.missingCriticalSkills = missingCriticalSkills;
        this.strengths = strengths;
        this.formattingWarnings = formattingWarnings;
        this.improvementRecommendations = improvementRecommendations;
        this.bulletEnhancements = bulletEnhancements;
        this.summary = summary;
        this.uploadedAt = uploadedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String filename;
        private String fileType;
        private Long fileSizeBytes;
        private String targetJobRole;
        private String targetJobDescription;
        private String rawResumeText;
        private Integer overallAtsScore;
        private Double atsScoreOutOf10;
        private Integer formattingScore;
        private Integer keywordMatchScore;
        private Integer impactVerbScore;
        private List<String> extractedSkills;
        private List<String> missingCriticalSkills;
        private List<String> strengths;
        private List<String> formattingWarnings;
        private List<String> improvementRecommendations;
        private List<BulletEnhancement> bulletEnhancements;
        private String summary;
        private String uploadedAt;
        private String candidateName;
        private String candidateEmail;
        private String fileContentBase64;
        private String jobReadinessStatus;
        private List<String> jobReadinessRoadmap;
        private String recommendedProject;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder filename(String filename) { this.filename = filename; return this; }
        public Builder fileType(String fileType) { this.fileType = fileType; return this; }
        public Builder fileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; return this; }
        public Builder targetJobRole(String targetJobRole) { this.targetJobRole = targetJobRole; return this; }
        public Builder targetJobDescription(String targetJobDescription) { this.targetJobDescription = targetJobDescription; return this; }
        public Builder rawResumeText(String rawResumeText) { this.rawResumeText = rawResumeText; return this; }
        public Builder overallAtsScore(Integer overallAtsScore) { this.overallAtsScore = overallAtsScore; return this; }
        public Builder formattingScore(Integer formattingScore) { this.formattingScore = formattingScore; return this; }
        public Builder keywordMatchScore(Integer keywordMatchScore) { this.keywordMatchScore = keywordMatchScore; return this; }
        public Builder impactVerbScore(Integer impactVerbScore) { this.impactVerbScore = impactVerbScore; return this; }
        public Builder extractedSkills(List<String> extractedSkills) { this.extractedSkills = extractedSkills; return this; }
        public Builder missingCriticalSkills(List<String> missingCriticalSkills) { this.missingCriticalSkills = missingCriticalSkills; return this; }
        public Builder strengths(List<String> strengths) { this.strengths = strengths; return this; }
        public Builder formattingWarnings(List<String> formattingWarnings) { this.formattingWarnings = formattingWarnings; return this; }
        public Builder improvementRecommendations(List<String> improvementRecommendations) { this.improvementRecommendations = improvementRecommendations; return this; }
        public Builder bulletEnhancements(List<BulletEnhancement> bulletEnhancements) { this.bulletEnhancements = bulletEnhancements; return this; }
        public Builder summary(String summary) { this.summary = summary; return this; }
        public Builder uploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; return this; }
        public Builder candidateName(String candidateName) { this.candidateName = candidateName; return this; }
        public Builder candidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; return this; }
        public Builder fileContentBase64(String fileContentBase64) { this.fileContentBase64 = fileContentBase64; return this; }
        public Builder jobReadinessStatus(String jobReadinessStatus) { this.jobReadinessStatus = jobReadinessStatus; return this; }
        public Builder jobReadinessRoadmap(List<String> jobReadinessRoadmap) { this.jobReadinessRoadmap = jobReadinessRoadmap; return this; }
        public Builder recommendedProject(String recommendedProject) { this.recommendedProject = recommendedProject; return this; }

        public Builder atsScoreOutOf10(Double atsScoreOutOf10) { this.atsScoreOutOf10 = atsScoreOutOf10; return this; }

        public ResumeDTO build() {
            ResumeDTO dto = new ResumeDTO(id, filename, fileType, fileSizeBytes, targetJobRole, targetJobDescription, rawResumeText,
                    overallAtsScore, formattingScore, keywordMatchScore, impactVerbScore, extractedSkills,
                    missingCriticalSkills, strengths, formattingWarnings, improvementRecommendations,
                    bulletEnhancements, summary, uploadedAt);
            dto.setCandidateName(candidateName);
            dto.setCandidateEmail(candidateEmail);
            dto.setFileContentBase64(fileContentBase64);
            dto.setJobReadinessStatus(jobReadinessStatus);
            dto.setJobReadinessRoadmap(jobReadinessRoadmap);
            dto.setRecommendedProject(recommendedProject);
            dto.setAtsScoreOutOf10(atsScoreOutOf10 != null ? atsScoreOutOf10 : (overallAtsScore != null ? Math.round((overallAtsScore / 10.0) * 10.0) / 10.0 : 0.0));
            return dto;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public String getTargetJobRole() { return targetJobRole; }
    public void setTargetJobRole(String targetJobRole) { this.targetJobRole = targetJobRole; }

    public String getTargetJobDescription() { return targetJobDescription; }
    public void setTargetJobDescription(String targetJobDescription) { this.targetJobDescription = targetJobDescription; }

    public String getRawResumeText() { return rawResumeText; }
    public void setRawResumeText(String rawResumeText) { this.rawResumeText = rawResumeText; }

    public Integer getOverallAtsScore() { return overallAtsScore; }
    public void setOverallAtsScore(Integer overallAtsScore) { this.overallAtsScore = overallAtsScore; }

    public Double getAtsScoreOutOf10() {
        if (atsScoreOutOf10 != null) return atsScoreOutOf10;
        if (overallAtsScore == null) return 0.0;
        return Math.round((overallAtsScore / 10.0) * 10.0) / 10.0;
    }
    public void setAtsScoreOutOf10(Double atsScoreOutOf10) { this.atsScoreOutOf10 = atsScoreOutOf10; }

    public Integer getFormattingScore() { return formattingScore; }
    public void setFormattingScore(Integer formattingScore) { this.formattingScore = formattingScore; }

    public Integer getKeywordMatchScore() { return keywordMatchScore; }
    public void setKeywordMatchScore(Integer keywordMatchScore) { this.keywordMatchScore = keywordMatchScore; }

    public Integer getImpactVerbScore() { return impactVerbScore; }
    public void setImpactVerbScore(Integer impactVerbScore) { this.impactVerbScore = impactVerbScore; }

    public List<String> getExtractedSkills() { return extractedSkills; }
    public void setExtractedSkills(List<String> extractedSkills) { this.extractedSkills = extractedSkills; }

    public List<String> getMissingCriticalSkills() { return missingCriticalSkills; }
    public void setMissingCriticalSkills(List<String> missingCriticalSkills) { this.missingCriticalSkills = missingCriticalSkills; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<String> getFormattingWarnings() { return formattingWarnings; }
    public void setFormattingWarnings(List<String> formattingWarnings) { this.formattingWarnings = formattingWarnings; }

    public List<String> getImprovementRecommendations() { return improvementRecommendations; }
    public void setImprovementRecommendations(List<String> improvementRecommendations) { this.improvementRecommendations = improvementRecommendations; }

    public List<BulletEnhancement> getBulletEnhancements() { return bulletEnhancements; }
    public void setBulletEnhancements(List<BulletEnhancement> bulletEnhancements) { this.bulletEnhancements = bulletEnhancements; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public String getFileContentBase64() { return fileContentBase64; }
    public void setFileContentBase64(String fileContentBase64) { this.fileContentBase64 = fileContentBase64; }

    public String getJobReadinessStatus() { return jobReadinessStatus; }
    public void setJobReadinessStatus(String jobReadinessStatus) { this.jobReadinessStatus = jobReadinessStatus; }

    public List<String> getJobReadinessRoadmap() { return jobReadinessRoadmap; }
    public void setJobReadinessRoadmap(List<String> jobReadinessRoadmap) { this.jobReadinessRoadmap = jobReadinessRoadmap; }

    public String getRecommendedProject() { return recommendedProject; }
    public void setRecommendedProject(String recommendedProject) { this.recommendedProject = recommendedProject; }
}
