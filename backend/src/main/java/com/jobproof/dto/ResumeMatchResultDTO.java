package com.jobproof.dto;

import java.util.List;

public class ResumeMatchResultDTO {
    private Double resumeScoreOutOf10;
    private Integer overallAtsScore;
    private String targetJobRole;
    private String candidateReadiness;
    private List<String> extractedSkills;
    private List<String> recommendedSkillsToLearn;
    private List<String> rolePreparationTips;
    private String userLocation;
    private Integer totalMatchedJobsCount;
    private List<ResumeJobMatchDTO> matchedJobs;

    public ResumeMatchResultDTO() {}

    public ResumeMatchResultDTO(Double resumeScoreOutOf10, Integer overallAtsScore, String targetJobRole,
                                String candidateReadiness, List<String> extractedSkills,
                                List<String> recommendedSkillsToLearn, List<String> rolePreparationTips,
                                String userLocation, Integer totalMatchedJobsCount,
                                List<ResumeJobMatchDTO> matchedJobs) {
        this.resumeScoreOutOf10 = resumeScoreOutOf10;
        this.overallAtsScore = overallAtsScore;
        this.targetJobRole = targetJobRole;
        this.candidateReadiness = candidateReadiness;
        this.extractedSkills = extractedSkills;
        this.recommendedSkillsToLearn = recommendedSkillsToLearn;
        this.rolePreparationTips = rolePreparationTips;
        this.userLocation = userLocation;
        this.totalMatchedJobsCount = totalMatchedJobsCount;
        this.matchedJobs = matchedJobs;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Double resumeScoreOutOf10;
        private Integer overallAtsScore;
        private String targetJobRole;
        private String candidateReadiness;
        private List<String> extractedSkills;
        private List<String> recommendedSkillsToLearn;
        private List<String> rolePreparationTips;
        private String userLocation;
        private Integer totalMatchedJobsCount;
        private List<ResumeJobMatchDTO> matchedJobs;

        public Builder resumeScoreOutOf10(Double resumeScoreOutOf10) { this.resumeScoreOutOf10 = resumeScoreOutOf10; return this; }
        public Builder overallAtsScore(Integer overallAtsScore) { this.overallAtsScore = overallAtsScore; return this; }
        public Builder targetJobRole(String targetJobRole) { this.targetJobRole = targetJobRole; return this; }
        public Builder candidateReadiness(String candidateReadiness) { this.candidateReadiness = candidateReadiness; return this; }
        public Builder extractedSkills(List<String> extractedSkills) { this.extractedSkills = extractedSkills; return this; }
        public Builder recommendedSkillsToLearn(List<String> recommendedSkillsToLearn) { this.recommendedSkillsToLearn = recommendedSkillsToLearn; return this; }
        public Builder rolePreparationTips(List<String> rolePreparationTips) { this.rolePreparationTips = rolePreparationTips; return this; }
        public Builder userLocation(String userLocation) { this.userLocation = userLocation; return this; }
        public Builder totalMatchedJobsCount(Integer totalMatchedJobsCount) { this.totalMatchedJobsCount = totalMatchedJobsCount; return this; }
        public Builder matchedJobs(List<ResumeJobMatchDTO> matchedJobs) { this.matchedJobs = matchedJobs; return this; }

        public ResumeMatchResultDTO build() {
            return new ResumeMatchResultDTO(resumeScoreOutOf10, overallAtsScore, targetJobRole, candidateReadiness, extractedSkills, recommendedSkillsToLearn, rolePreparationTips, userLocation, totalMatchedJobsCount, matchedJobs);
        }
    }

    public Double getResumeScoreOutOf10() { return resumeScoreOutOf10; }
    public void setResumeScoreOutOf10(Double resumeScoreOutOf10) { this.resumeScoreOutOf10 = resumeScoreOutOf10; }

    public Integer getOverallAtsScore() { return overallAtsScore; }
    public void setOverallAtsScore(Integer overallAtsScore) { this.overallAtsScore = overallAtsScore; }

    public String getTargetJobRole() { return targetJobRole; }
    public void setTargetJobRole(String targetJobRole) { this.targetJobRole = targetJobRole; }

    public String getCandidateReadiness() { return candidateReadiness; }
    public void setCandidateReadiness(String candidateReadiness) { this.candidateReadiness = candidateReadiness; }

    public List<String> getExtractedSkills() { return extractedSkills; }
    public void setExtractedSkills(List<String> extractedSkills) { this.extractedSkills = extractedSkills; }

    public List<String> getRecommendedSkillsToLearn() { return recommendedSkillsToLearn; }
    public void setRecommendedSkillsToLearn(List<String> recommendedSkillsToLearn) { this.recommendedSkillsToLearn = recommendedSkillsToLearn; }

    public List<String> getRolePreparationTips() { return rolePreparationTips; }
    public void setRolePreparationTips(List<String> rolePreparationTips) { this.rolePreparationTips = rolePreparationTips; }

    public String getUserLocation() { return userLocation; }
    public void setUserLocation(String userLocation) { this.userLocation = userLocation; }

    public Integer getTotalMatchedJobsCount() { return totalMatchedJobsCount; }
    public void setTotalMatchedJobsCount(Integer totalMatchedJobsCount) { this.totalMatchedJobsCount = totalMatchedJobsCount; }

    public List<ResumeJobMatchDTO> getMatchedJobs() { return matchedJobs; }
    public void setMatchedJobs(List<ResumeJobMatchDTO> matchedJobs) { this.matchedJobs = matchedJobs; }
}
