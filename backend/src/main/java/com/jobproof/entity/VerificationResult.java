package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_results")
public class VerificationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false, unique = true)
    private Job job;

    @Column(name = "company_score")
    private Integer companyScore;

    @Column(name = "source_score")
    private Integer sourceScore;

    @Column(name = "url_score")
    private Integer urlScore;

    @Column(name = "freshness_score")
    private Integer freshnessScore;

    @Column(name = "content_score")
    private Integer contentScore;

    @Column(name = "ai_score")
    private Integer aiScore;

    @Column(name = "final_score")
    private Integer finalScore;

    @Column(length = 2000)
    private String reasons;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    public VerificationResult() {}

    public VerificationResult(Long id, Job job, Integer companyScore, Integer sourceScore, Integer urlScore, Integer freshnessScore, Integer contentScore, Integer aiScore, Integer finalScore, String reasons, LocalDateTime verifiedAt) {
        this.id = id;
        this.job = job;
        this.companyScore = companyScore;
        this.sourceScore = sourceScore;
        this.urlScore = urlScore;
        this.freshnessScore = freshnessScore;
        this.contentScore = contentScore;
        this.aiScore = aiScore;
        this.finalScore = finalScore;
        this.reasons = reasons;
        this.verifiedAt = verifiedAt;
    }

    @PrePersist
    protected void onVerify() {
        this.verifiedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public Integer getCompanyScore() { return companyScore; }
    public void setCompanyScore(Integer companyScore) { this.companyScore = companyScore; }

    public Integer getSourceScore() { return sourceScore; }
    public void setSourceScore(Integer sourceScore) { this.sourceScore = sourceScore; }

    public Integer getUrlScore() { return urlScore; }
    public void setUrlScore(Integer urlScore) { this.urlScore = urlScore; }

    public Integer getFreshnessScore() { return freshnessScore; }
    public void setFreshnessScore(Integer freshnessScore) { this.freshnessScore = freshnessScore; }

    public Integer getContentScore() { return contentScore; }
    public void setContentScore(Integer contentScore) { this.contentScore = contentScore; }

    public Integer getAiScore() { return aiScore; }
    public void setAiScore(Integer aiScore) { this.aiScore = aiScore; }

    public Integer getFinalScore() { return finalScore; }
    public void setFinalScore(Integer finalScore) { this.finalScore = finalScore; }

    public String getReasons() { return reasons; }
    public void setReasons(String reasons) { this.reasons = reasons; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public static VerificationResultBuilder builder() { return new VerificationResultBuilder(); }

    public static class VerificationResultBuilder {
        private Long id;
        private Job job;
        private Integer companyScore;
        private Integer sourceScore;
        private Integer urlScore;
        private Integer freshnessScore;
        private Integer contentScore;
        private Integer aiScore;
        private Integer finalScore;
        private String reasons;
        private LocalDateTime verifiedAt;

        public VerificationResultBuilder id(Long id) { this.id = id; return this; }
        public VerificationResultBuilder job(Job job) { this.job = job; return this; }
        public VerificationResultBuilder companyScore(Integer companyScore) { this.companyScore = companyScore; return this; }
        public VerificationResultBuilder sourceScore(Integer sourceScore) { this.sourceScore = sourceScore; return this; }
        public VerificationResultBuilder urlScore(Integer urlScore) { this.urlScore = urlScore; return this; }
        public VerificationResultBuilder freshnessScore(Integer freshnessScore) { this.freshnessScore = freshnessScore; return this; }
        public VerificationResultBuilder contentScore(Integer contentScore) { this.contentScore = contentScore; return this; }
        public VerificationResultBuilder aiScore(Integer aiScore) { this.aiScore = aiScore; return this; }
        public VerificationResultBuilder finalScore(Integer finalScore) { this.finalScore = finalScore; return this; }
        public VerificationResultBuilder reasons(String reasons) { this.reasons = reasons; return this; }
        public VerificationResultBuilder verifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; return this; }

        public VerificationResult build() {
            return new VerificationResult(id, job, companyScore, sourceScore, urlScore, freshnessScore, contentScore, aiScore, finalScore, reasons, verifiedAt);
        }
    }
}
