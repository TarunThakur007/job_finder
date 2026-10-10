package com.jobproof.dto;

import java.util.List;

public class ResumeJobMatchDTO {
    private JobDTO job;
    private Double compatibilityScoreOutOf10;
    private Integer compatibilityPercentage;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> skillSuggestions;
    private String nearestOfficeLocation;
    private String roleCategory;
    private Boolean isFresherEligible;

    public ResumeJobMatchDTO() {}

    public ResumeJobMatchDTO(JobDTO job, Double compatibilityScoreOutOf10, Integer compatibilityPercentage,
                             List<String> matchedSkills, List<String> missingSkills,
                             List<String> skillSuggestions, String nearestOfficeLocation,
                             String roleCategory, Boolean isFresherEligible) {
        this.job = job;
        this.compatibilityScoreOutOf10 = compatibilityScoreOutOf10;
        this.compatibilityPercentage = compatibilityPercentage;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.skillSuggestions = skillSuggestions;
        this.nearestOfficeLocation = nearestOfficeLocation;
        this.roleCategory = roleCategory;
        this.isFresherEligible = isFresherEligible;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private JobDTO job;
        private Double compatibilityScoreOutOf10;
        private Integer compatibilityPercentage;
        private List<String> matchedSkills;
        private List<String> missingSkills;
        private List<String> skillSuggestions;
        private String nearestOfficeLocation;
        private String roleCategory;
        private Boolean isFresherEligible;

        public Builder job(JobDTO job) { this.job = job; return this; }
        public Builder compatibilityScoreOutOf10(Double compatibilityScoreOutOf10) { this.compatibilityScoreOutOf10 = compatibilityScoreOutOf10; return this; }
        public Builder compatibilityPercentage(Integer compatibilityPercentage) { this.compatibilityPercentage = compatibilityPercentage; return this; }
        public Builder matchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; return this; }
        public Builder missingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; return this; }
        public Builder skillSuggestions(List<String> skillSuggestions) { this.skillSuggestions = skillSuggestions; return this; }
        public Builder nearestOfficeLocation(String nearestOfficeLocation) { this.nearestOfficeLocation = nearestOfficeLocation; return this; }
        public Builder roleCategory(String roleCategory) { this.roleCategory = roleCategory; return this; }
        public Builder isFresherEligible(Boolean isFresherEligible) { this.isFresherEligible = isFresherEligible; return this; }

        public ResumeJobMatchDTO build() {
            return new ResumeJobMatchDTO(job, compatibilityScoreOutOf10, compatibilityPercentage, matchedSkills, missingSkills, skillSuggestions, nearestOfficeLocation, roleCategory, isFresherEligible);
        }
    }

    public JobDTO getJob() { return job; }
    public void setJob(JobDTO job) { this.job = job; }

    public Double getCompatibilityScoreOutOf10() { return compatibilityScoreOutOf10; }
    public void setCompatibilityScoreOutOf10(Double compatibilityScoreOutOf10) { this.compatibilityScoreOutOf10 = compatibilityScoreOutOf10; }

    public Integer getCompatibilityPercentage() { return compatibilityPercentage; }
    public void setCompatibilityPercentage(Integer compatibilityPercentage) { this.compatibilityPercentage = compatibilityPercentage; }

    public List<String> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }

    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }

    public List<String> getSkillSuggestions() { return skillSuggestions; }
    public void setSkillSuggestions(List<String> skillSuggestions) { this.skillSuggestions = skillSuggestions; }

    public String getNearestOfficeLocation() { return nearestOfficeLocation; }
    public void setNearestOfficeLocation(String nearestOfficeLocation) { this.nearestOfficeLocation = nearestOfficeLocation; }

    public String getRoleCategory() { return roleCategory; }
    public void setRoleCategory(String roleCategory) { this.roleCategory = roleCategory; }

    public Boolean getIsFresherEligible() { return isFresherEligible; }
    public void setIsFresherEligible(Boolean isFresherEligible) { this.isFresherEligible = isFresherEligible; }
}
