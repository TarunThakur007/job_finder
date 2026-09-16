package com.jobproof.dto;

import java.util.List;

public class VerificationDTO {
    private Long jobId;
    private Integer companyScore;
    private Integer sourceScore;
    private Integer urlScore;
    private Integer freshnessScore;
    private Integer contentScore;
    private Integer aiScore;
    private Integer finalScore;
    private String status;
    private List<String> reasons;

    public VerificationDTO() {}

    public VerificationDTO(Long jobId, Integer companyScore, Integer sourceScore, Integer urlScore, Integer freshnessScore, Integer contentScore, Integer aiScore, Integer finalScore, String status, List<String> reasons) {
        this.jobId = jobId;
        this.companyScore = companyScore;
        this.sourceScore = sourceScore;
        this.urlScore = urlScore;
        this.freshnessScore = freshnessScore;
        this.contentScore = contentScore;
        this.aiScore = aiScore;
        this.finalScore = finalScore;
        this.status = status;
        this.reasons = reasons;
    }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons; }

    public static VerificationDTOBuilder builder() { return new VerificationDTOBuilder(); }

    public static class VerificationDTOBuilder {
        private Long jobId;
        private Integer companyScore;
        private Integer sourceScore;
        private Integer urlScore;
        private Integer freshnessScore;
        private Integer contentScore;
        private Integer aiScore;
        private Integer finalScore;
        private String status;
        private List<String> reasons;

        public VerificationDTOBuilder jobId(Long jobId) { this.jobId = jobId; return this; }
        public VerificationDTOBuilder companyScore(Integer companyScore) { this.companyScore = companyScore; return this; }
        public VerificationDTOBuilder sourceScore(Integer sourceScore) { this.sourceScore = sourceScore; return this; }
        public VerificationDTOBuilder urlScore(Integer urlScore) { this.urlScore = urlScore; return this; }
        public VerificationDTOBuilder freshnessScore(Integer freshnessScore) { this.freshnessScore = freshnessScore; return this; }
        public VerificationDTOBuilder contentScore(Integer contentScore) { this.contentScore = contentScore; return this; }
        public VerificationDTOBuilder aiScore(Integer aiScore) { this.aiScore = aiScore; return this; }
        public VerificationDTOBuilder finalScore(Integer finalScore) { this.finalScore = finalScore; return this; }
        public VerificationDTOBuilder status(String status) { this.status = status; return this; }
        public VerificationDTOBuilder reasons(List<String> reasons) { this.reasons = reasons; return this; }

        public VerificationDTO build() {
            return new VerificationDTO(jobId, companyScore, sourceScore, urlScore, freshnessScore, contentScore, aiScore, finalScore, status, reasons);
        }
    }
}
