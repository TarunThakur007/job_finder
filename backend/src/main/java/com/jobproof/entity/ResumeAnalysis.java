package com.jobproof.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(name = "extracted_skills", columnDefinition = "JSONB")
    private String extractedSkills;

    @Column(name = "missing_critical_skills", columnDefinition = "JSONB")
    private String missingCriticalSkills;

    @Column(name = "strengths", columnDefinition = "JSONB")
    private String strengths;

    @Column(name = "formatting_warnings", columnDefinition = "JSONB")
    private String formattingWarnings;

    @Column(name = "improvement_recommendations", columnDefinition = "JSONB")
    private String improvementRecommendations;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
