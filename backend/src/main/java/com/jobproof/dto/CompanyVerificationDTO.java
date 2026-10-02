package com.jobproof.dto;

import java.util.ArrayList;
import java.util.List;

public class CompanyVerificationDTO {
    private boolean verified;
    private String companyName;
    private String verifiedDomain;
    private String logoUrl;
    private Integer confidenceScore;
    private List<String> sources = new ArrayList<>();
    private List<String> reasons = new ArrayList<>();
    private Boolean isClaimed;

    public CompanyVerificationDTO() {}

    public CompanyVerificationDTO(boolean verified, String companyName, String verifiedDomain, String logoUrl, Integer confidenceScore, List<String> sources, List<String> reasons, Boolean isClaimed) {
        this.verified = verified;
        this.companyName = companyName;
        this.verifiedDomain = verifiedDomain;
        this.logoUrl = logoUrl;
        this.confidenceScore = confidenceScore;
        this.sources = sources;
        this.reasons = reasons;
        this.isClaimed = isClaimed;
    }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getVerifiedDomain() { return verifiedDomain; }
    public void setVerifiedDomain(String verifiedDomain) { this.verifiedDomain = verifiedDomain; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public Integer getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Integer confidenceScore) { this.confidenceScore = confidenceScore; }

    public List<String> getSources() { return sources; }
    public void setSources(List<String> sources) { this.sources = sources; }

    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons; }

    public Boolean getIsClaimed() { return isClaimed; }
    public void setIsClaimed(Boolean isClaimed) { this.isClaimed = isClaimed; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private boolean verified;
        private String companyName;
        private String verifiedDomain;
        private String logoUrl;
        private Integer confidenceScore = 0;
        private List<String> sources = new ArrayList<>();
        private List<String> reasons = new ArrayList<>();
        private Boolean isClaimed = false;

        public Builder verified(boolean verified) { this.verified = verified; return this; }
        public Builder companyName(String companyName) { this.companyName = companyName; return this; }
        public Builder verifiedDomain(String verifiedDomain) { this.verifiedDomain = verifiedDomain; return this; }
        public Builder logoUrl(String logoUrl) { this.logoUrl = logoUrl; return this; }
        public Builder confidenceScore(Integer score) { this.confidenceScore = score; return this; }
        public Builder sources(List<String> sources) { this.sources = sources; return this; }
        public Builder reasons(List<String> reasons) { this.reasons = reasons; return this; }
        public Builder isClaimed(Boolean isClaimed) { this.isClaimed = isClaimed; return this; }

        public CompanyVerificationDTO build() {
            return new CompanyVerificationDTO(verified, companyName, verifiedDomain, logoUrl, confidenceScore, sources, reasons, isClaimed);
        }
    }
}
