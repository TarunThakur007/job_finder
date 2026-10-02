package com.jobproof.dto;

import java.time.LocalDateTime;

public class UserExperienceDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String companyName;
    private String jobTitle;
    private String experienceType;
    private String employmentType;
    private String workMode;
    private String location;
    private Double yearsOfExperience;
    private Integer rating;
    private String difficultyLevel;
    private Integer interviewRounds;
    private String questionsAsked;
    private String experienceStory;
    private String tipsAndAdvice;
    private String offerStatus;
    private Boolean anonymous;
    private Integer upvotes;
    private String status;
    private LocalDateTime createdAt;

    public UserExperienceDTO() {}

    public UserExperienceDTO(Long id, Long userId, String userName, String userEmail, String companyName, 
                             String jobTitle, String experienceType, String employmentType, String workMode, 
                             String location, Double yearsOfExperience, Integer rating, String difficultyLevel, 
                             Integer interviewRounds, String questionsAsked, String experienceStory, 
                             String tipsAndAdvice, String offerStatus, Boolean anonymous, Integer upvotes, 
                             String status, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.experienceType = experienceType;
        this.employmentType = employmentType;
        this.workMode = workMode;
        this.location = location;
        this.yearsOfExperience = yearsOfExperience;
        this.rating = rating;
        this.difficultyLevel = difficultyLevel;
        this.interviewRounds = interviewRounds;
        this.questionsAsked = questionsAsked;
        this.experienceStory = experienceStory;
        this.tipsAndAdvice = tipsAndAdvice;
        this.offerStatus = offerStatus;
        this.anonymous = anonymous;
        this.upvotes = upvotes;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getExperienceType() { return experienceType; }
    public void setExperienceType(String experienceType) { this.experienceType = experienceType; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Double yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public Integer getInterviewRounds() { return interviewRounds; }
    public void setInterviewRounds(Integer interviewRounds) { this.interviewRounds = interviewRounds; }

    public String getQuestionsAsked() { return questionsAsked; }
    public void setQuestionsAsked(String questionsAsked) { this.questionsAsked = questionsAsked; }

    public String getExperienceStory() { return experienceStory; }
    public void setExperienceStory(String experienceStory) { this.experienceStory = experienceStory; }

    public String getTipsAndAdvice() { return tipsAndAdvice; }
    public void setTipsAndAdvice(String tipsAndAdvice) { this.tipsAndAdvice = tipsAndAdvice; }

    public String getOfferStatus() { return offerStatus; }
    public void setOfferStatus(String offerStatus) { this.offerStatus = offerStatus; }

    public Boolean getAnonymous() { return anonymous; }
    public void setAnonymous(Boolean anonymous) { this.anonymous = anonymous; }

    public Integer getUpvotes() { return upvotes; }
    public void setUpvotes(Integer upvotes) { this.upvotes = upvotes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private String companyName;
        private String jobTitle;
        private String experienceType;
        private String employmentType;
        private String workMode;
        private String location;
        private Double yearsOfExperience;
        private Integer rating;
        private String difficultyLevel;
        private Integer interviewRounds;
        private String questionsAsked;
        private String experienceStory;
        private String tipsAndAdvice;
        private String offerStatus;
        private Boolean anonymous;
        private Integer upvotes;
        private String status;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder userName(String userName) { this.userName = userName; return this; }
        public Builder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public Builder companyName(String companyName) { this.companyName = companyName; return this; }
        public Builder jobTitle(String jobTitle) { this.jobTitle = jobTitle; return this; }
        public Builder experienceType(String experienceType) { this.experienceType = experienceType; return this; }
        public Builder employmentType(String employmentType) { this.employmentType = employmentType; return this; }
        public Builder workMode(String workMode) { this.workMode = workMode; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder yearsOfExperience(Double yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; return this; }
        public Builder rating(Integer rating) { this.rating = rating; return this; }
        public Builder difficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; return this; }
        public Builder interviewRounds(Integer interviewRounds) { this.interviewRounds = interviewRounds; return this; }
        public Builder questionsAsked(String questionsAsked) { this.questionsAsked = questionsAsked; return this; }
        public Builder experienceStory(String experienceStory) { this.experienceStory = experienceStory; return this; }
        public Builder tipsAndAdvice(String tipsAndAdvice) { this.tipsAndAdvice = tipsAndAdvice; return this; }
        public Builder offerStatus(String offerStatus) { this.offerStatus = offerStatus; return this; }
        public Builder anonymous(Boolean anonymous) { this.anonymous = anonymous; return this; }
        public Builder upvotes(Integer upvotes) { this.upvotes = upvotes; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public UserExperienceDTO build() {
            return new UserExperienceDTO(id, userId, userName, userEmail, companyName, jobTitle, 
                    experienceType, employmentType, workMode, location, yearsOfExperience, 
                    rating, difficultyLevel, interviewRounds, questionsAsked, experienceStory, 
                    tipsAndAdvice, offerStatus, anonymous, upvotes, status, createdAt);
        }
    }
}
