package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private UserResume resume;

    @Column(name = "target_job_role", nullable = false)
    private String targetJobRole;

    @Column(name = "overall_ats_score", nullable = false)
    private Integer overallAtsScore;

    @Column(name = "formatting_score", nullable = false)
    private Integer formattingScore;

    @Column(name = "keyword_match_score", nullable = false)
    private Integer keywordMatchScore;

    @Column(name = "impact_verb_score", nullable = false)
    private Integer impactVerbScore;

    @Column(name = "extracted_skills", columnDefinition = "TEXT")
    private String extractedSkills;

    @Column(name = "missing_critical_skills", columnDefinition = "TEXT")
    private String missingCriticalSkills;

    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "formatting_warnings", columnDefinition = "TEXT")
    private String formattingWarnings;

    @Column(name = "improvement_recommendations", columnDefinition = "TEXT")
    private String improvementRecommendations;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ResumeAnalysis() {}

    public ResumeAnalysis(Long id, UserResume resume, String targetJobRole, Integer overallAtsScore,
                          Integer formattingScore, Integer keywordMatchScore, Integer impactVerbScore,
                          String extractedSkills, String missingCriticalSkills, String strengths,
                          String formattingWarnings, String improvementRecommendations,
                          String summary, LocalDateTime createdAt) {
        this.id = id;
        this.resume = resume;
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
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserResume getResume() { return resume; }
    public void setResume(UserResume resume) { this.resume = resume; }

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

    public String getExtractedSkills() { return extractedSkills; }
    public void setExtractedSkills(String extractedSkills) { this.extractedSkills = extractedSkills; }

    public String getMissingCriticalSkills() { return missingCriticalSkills; }
    public void setMissingCriticalSkills(String missingCriticalSkills) { this.missingCriticalSkills = missingCriticalSkills; }

    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }

    public String getFormattingWarnings() { return formattingWarnings; }
    public void setFormattingWarnings(String formattingWarnings) { this.formattingWarnings = formattingWarnings; }

    public String getImprovementRecommendations() { return improvementRecommendations; }
    public void setImprovementRecommendations(String improvementRecommendations) { this.improvementRecommendations = improvementRecommendations; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ResumeAnalysisBuilder builder() {
        return new ResumeAnalysisBuilder();
    }

    public static class ResumeAnalysisBuilder {
        private Long id;
        private UserResume resume;
        private String targetJobRole;
        private Integer overallAtsScore;
        private Integer formattingScore;
        private Integer keywordMatchScore;
        private Integer impactVerbScore;
        private String extractedSkills;
        private String missingCriticalSkills;
        private String strengths;
        private String formattingWarnings;
        private String improvementRecommendations;
        private String summary;
        private LocalDateTime createdAt;

        public ResumeAnalysisBuilder id(Long id) { this.id = id; return this; }
        public ResumeAnalysisBuilder resume(UserResume resume) { this.resume = resume; return this; }
        public ResumeAnalysisBuilder targetJobRole(String targetJobRole) { this.targetJobRole = targetJobRole; return this; }
        public ResumeAnalysisBuilder overallAtsScore(Integer overallAtsScore) { this.overallAtsScore = overallAtsScore; return this; }
        public ResumeAnalysisBuilder formattingScore(Integer formattingScore) { this.formattingScore = formattingScore; return this; }
        public ResumeAnalysisBuilder keywordMatchScore(Integer keywordMatchScore) { this.keywordMatchScore = keywordMatchScore; return this; }
        public ResumeAnalysisBuilder impactVerbScore(Integer impactVerbScore) { this.impactVerbScore = impactVerbScore; return this; }
        public ResumeAnalysisBuilder extractedSkills(String extractedSkills) { this.extractedSkills = extractedSkills; return this; }
        public ResumeAnalysisBuilder missingCriticalSkills(String missingCriticalSkills) { this.missingCriticalSkills = missingCriticalSkills; return this; }
        public ResumeAnalysisBuilder strengths(String strengths) { this.strengths = strengths; return this; }
        public ResumeAnalysisBuilder formattingWarnings(String formattingWarnings) { this.formattingWarnings = formattingWarnings; return this; }
        public ResumeAnalysisBuilder improvementRecommendations(String improvementRecommendations) { this.improvementRecommendations = improvementRecommendations; return this; }
        public ResumeAnalysisBuilder summary(String summary) { this.summary = summary; return this; }
        public ResumeAnalysisBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ResumeAnalysis build() {
            return new ResumeAnalysis(id, resume, targetJobRole, overallAtsScore, formattingScore,
                    keywordMatchScore, impactVerbScore, extractedSkills, missingCriticalSkills,
                    strengths, formattingWarnings, improvementRecommendations, summary, createdAt);
        }
    }
}
