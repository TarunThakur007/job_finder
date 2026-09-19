package com.jobproof.dto;

import java.util.List;

public class ResumeDTO {
    private Long id;
    private String filename;
    private String fileType;
    private Long fileSizeBytes;
    private String targetJobRole;
    private Integer overallAtsScore;
    private Integer formattingScore;
    private Integer keywordMatchScore;
    private Integer impactVerbScore;
    private List<String> extractedSkills;
    private List<String> missingCriticalSkills;
    private List<String> strengths;
    private List<String> formattingWarnings;
    private List<String> improvementRecommendations;
    private String summary;
    private String uploadedAt;

    public ResumeDTO() {}

    public ResumeDTO(Long id, String filename, String fileType, Long fileSizeBytes, String targetJobRole,
                     Integer overallAtsScore, Integer formattingScore, Integer keywordMatchScore,
                     Integer impactVerbScore, List<String> extractedSkills, List<String> missingCriticalSkills,
                     List<String> strengths, List<String> formattingWarnings,
                     List<String> improvementRecommendations, String summary, String uploadedAt) {
        this.id = id;
        this.filename = filename;
        this.fileType = fileType;
        this.fileSizeBytes = fileSizeBytes;
        this.targetJobRole = targetJobRole;
        this.overallAtsScore = overallAtsScore;
        this.formattingScore = formattingScore;
        this.keywordMatchScore = keywordMatchScore;
        this.impactVerbScore = impactVerbScore;
        this.extractedSkills = extractedSkills;
        this.missingCriticalSkills = missingCriticalSkills;
        this.strengths = strengths;
        this.formattingWarnings = formattingWarnings;
        this.improvementRecommendations = improvementRecommendations;
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
        private Integer overallAtsScore;
        private Integer formattingScore;
        private Integer keywordMatchScore;
        private Integer impactVerbScore;
        private List<String> extractedSkills;
        private List<String> missingCriticalSkills;
        private List<String> strengths;
        private List<String> formattingWarnings;
        private List<String> improvementRecommendations;
        private String summary;
        private String uploadedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder filename(String filename) { this.filename = filename; return this; }
        public Builder fileType(String fileType) { this.fileType = fileType; return this; }
        public Builder fileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; return this; }
        public Builder targetJobRole(String targetJobRole) { this.targetJobRole = targetJobRole; return this; }
        public Builder overallAtsScore(Integer overallAtsScore) { this.overallAtsScore = overallAtsScore; return this; }
        public Builder formattingScore(Integer formattingScore) { this.formattingScore = formattingScore; return this; }
        public Builder keywordMatchScore(Integer keywordMatchScore) { this.keywordMatchScore = keywordMatchScore; return this; }
        public Builder impactVerbScore(Integer impactVerbScore) { this.impactVerbScore = impactVerbScore; return this; }
        public Builder extractedSkills(List<String> extractedSkills) { this.extractedSkills = extractedSkills; return this; }
        public Builder missingCriticalSkills(List<String> missingCriticalSkills) { this.missingCriticalSkills = missingCriticalSkills; return this; }
        public Builder strengths(List<String> strengths) { this.strengths = strengths; return this; }
        public Builder formattingWarnings(List<String> formattingWarnings) { this.formattingWarnings = formattingWarnings; return this; }
        public Builder improvementRecommendations(List<String> improvementRecommendations) { this.improvementRecommendations = improvementRecommendations; return this; }
        public Builder summary(String summary) { this.summary = summary; return this; }
        public Builder uploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; return this; }

        public ResumeDTO build() {
            return new ResumeDTO(id, filename, fileType, fileSizeBytes, targetJobRole, overallAtsScore,
                    formattingScore, keywordMatchScore, impactVerbScore, extractedSkills,
                    missingCriticalSkills, strengths, formattingWarnings, improvementRecommendations,
                    summary, uploadedAt);
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

    public Integer getOverallAtsScore() { return overallAtsScore; }
    public void setOverallAtsScore(Integer overallAtsScore) { this.overallAtsScore = overallAtsScore; }

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

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; }
}
