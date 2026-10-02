package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_experiences")
public class UserExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "experience_type", nullable = false)
    private String experienceType = "INTERVIEW_EXPERIENCE"; // 'INTERVIEW_EXPERIENCE', 'WORK_EXPERIENCE', 'CAREER_TIPS'

    @Column(name = "employment_type")
    private String employmentType = "FULL_TIME"; // 'FULL_TIME', 'INTERNSHIP', 'CONTRACT'

    @Column(name = "work_mode")
    private String workMode = "HYBRID"; // 'REMOTE', 'HYBRID', 'ONSITE'

    @Column(name = "location")
    private String location;

    @Column(name = "years_of_experience")
    private Double yearsOfExperience = 0.0;

    @Column(name = "rating")
    private Integer rating = 5; // 1 to 5

    @Column(name = "difficulty_level")
    private String difficultyLevel = "MEDIUM"; // 'EASY', 'MEDIUM', 'HARD', 'VERY_HARD'

    @Column(name = "interview_rounds")
    private Integer interviewRounds = 1;

    @Column(name = "questions_asked", length = 4000)
    private String questionsAsked;

    @Column(name = "experience_story", nullable = false, length = 4000)
    private String experienceStory;

    @Column(name = "tips_and_advice", length = 4000)
    private String tipsAndAdvice;

    @Column(name = "offer_status")
    private String offerStatus = "OFFERED_ACCEPTED"; // 'OFFERED_ACCEPTED', 'OFFERED_DECLINED', 'REJECTED', 'PENDING'

    @Column(name = "anonymous")
    private Boolean anonymous = false;

    @Column(name = "upvotes")
    private Integer upvotes = 0;

    @Column(name = "status")
    private String status = "APPROVED"; // 'APPROVED', 'PENDING_REVIEW', 'FLAGGED'

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public UserExperience() {}

    public UserExperience(Long id, Long userId, String userName, String userEmail, String companyName,
                          String jobTitle, String experienceType, String employmentType, String workMode,
                          String location, Double yearsOfExperience, Integer rating, String difficultyLevel,
                          Integer interviewRounds, String questionsAsked, String experienceStory,
                          String tipsAndAdvice, String offerStatus, Boolean anonymous, Integer upvotes,
                          String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.experienceType = experienceType != null ? experienceType : "INTERVIEW_EXPERIENCE";
        this.employmentType = employmentType != null ? employmentType : "FULL_TIME";
        this.workMode = workMode != null ? workMode : "HYBRID";
        this.location = location;
        this.yearsOfExperience = yearsOfExperience != null ? yearsOfExperience : 0.0;
        this.rating = rating != null ? rating : 5;
        this.difficultyLevel = difficultyLevel != null ? difficultyLevel : "MEDIUM";
        this.interviewRounds = interviewRounds != null ? interviewRounds : 1;
        this.questionsAsked = questionsAsked;
        this.experienceStory = experienceStory;
        this.tipsAndAdvice = tipsAndAdvice;
        this.offerStatus = offerStatus != null ? offerStatus : "OFFERED_ACCEPTED";
        this.anonymous = anonymous != null ? anonymous : false;
        this.upvotes = upvotes != null ? upvotes : 0;
        this.status = status != null ? status : "APPROVED";
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.upvotes == null) this.upvotes = 0;
        if (this.rating == null) this.rating = 5;
        if (this.anonymous == null) this.anonymous = false;
        if (this.status == null) this.status = "APPROVED";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private String companyName;
        private String jobTitle;
        private String experienceType = "INTERVIEW_EXPERIENCE";
        private String employmentType = "FULL_TIME";
        private String workMode = "HYBRID";
        private String location;
        private Double yearsOfExperience = 0.0;
        private Integer rating = 5;
        private String difficultyLevel = "MEDIUM";
        private Integer interviewRounds = 1;
        private String questionsAsked;
        private String experienceStory;
        private String tipsAndAdvice;
        private String offerStatus = "OFFERED_ACCEPTED";
        private Boolean anonymous = false;
        private Integer upvotes = 0;
        private String status = "APPROVED";
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

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
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public UserExperience build() {
            return new UserExperience(id, userId, userName, userEmail, companyName, jobTitle, 
                    experienceType, employmentType, workMode, location, yearsOfExperience, 
                    rating, difficultyLevel, interviewRounds, questionsAsked, experienceStory, 
                    tipsAndAdvice, offerStatus, anonymous, upvotes, status, createdAt, updatedAt);
        }
    }
}
