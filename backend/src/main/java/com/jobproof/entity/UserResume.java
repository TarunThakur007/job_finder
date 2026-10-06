package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_resumes")
public class UserResume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String filename;

    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Column(name = "file_size_bytes", nullable = false)
    private Long fileSizeBytes;

    @Column(name = "candidate_name")
    private String candidateName;

    @Column(name = "candidate_email")
    private String candidateEmail;

    @Column(name = "file_content_base64", columnDefinition = "TEXT")
    private String fileContentBase64;

    @Column(name = "raw_extracted_text", columnDefinition = "TEXT")
    private String rawExtractedText;

    @Column(name = "parsed_contact_info", columnDefinition = "TEXT")
    private String parsedContactInfo;

    @Column(name = "parsed_skills", columnDefinition = "TEXT")
    private String parsedSkills;

    @Column(name = "parsed_experience", columnDefinition = "TEXT")
    private String parsedExperience;

    @Column(name = "parsed_education", columnDefinition = "TEXT")
    private String parsedEducation;

    @Column(nullable = false)
    private String status;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public UserResume() {}

    public UserResume(Long id, User user, String filename, String fileType, Long fileSizeBytes,
                      String candidateName, String candidateEmail, String fileContentBase64,
                      String rawExtractedText, String parsedContactInfo, String parsedSkills,
                      String parsedExperience, String parsedEducation, String status,
                      LocalDateTime uploadedAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.filename = filename;
        this.fileType = fileType;
        this.fileSizeBytes = fileSizeBytes;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.fileContentBase64 = fileContentBase64;
        this.rawExtractedText = rawExtractedText;
        this.parsedContactInfo = parsedContactInfo;
        this.parsedSkills = parsedSkills;
        this.parsedExperience = parsedExperience;
        this.parsedEducation = parsedEducation;
        this.status = status;
        this.uploadedAt = uploadedAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PARSED";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public String getFileContentBase64() { return fileContentBase64; }
    public void setFileContentBase64(String fileContentBase64) { this.fileContentBase64 = fileContentBase64; }

    public String getRawExtractedText() { return rawExtractedText; }
    public void setRawExtractedText(String rawExtractedText) { this.rawExtractedText = rawExtractedText; }

    public String getParsedContactInfo() { return parsedContactInfo; }
    public void setParsedContactInfo(String parsedContactInfo) { this.parsedContactInfo = parsedContactInfo; }

    public String getParsedSkills() { return parsedSkills; }
    public void setParsedSkills(String parsedSkills) { this.parsedSkills = parsedSkills; }

    public String getParsedExperience() { return parsedExperience; }
    public void setParsedExperience(String parsedExperience) { this.parsedExperience = parsedExperience; }

    public String getParsedEducation() { return parsedEducation; }
    public void setParsedEducation(String parsedEducation) { this.parsedEducation = parsedEducation; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static UserResumeBuilder builder() {
        return new UserResumeBuilder();
    }

    public static class UserResumeBuilder {
        private Long id;
        private User user;
        private String filename;
        private String fileType;
        private Long fileSizeBytes;
        private String candidateName;
        private String candidateEmail;
        private String fileContentBase64;
        private String rawExtractedText;
        private String parsedContactInfo;
        private String parsedSkills;
        private String parsedExperience;
        private String parsedEducation;
        private String status;
        private LocalDateTime uploadedAt;
        private LocalDateTime updatedAt;

        public UserResumeBuilder id(Long id) { this.id = id; return this; }
        public UserResumeBuilder user(User user) { this.user = user; return this; }
        public UserResumeBuilder filename(String filename) { this.filename = filename; return this; }
        public UserResumeBuilder fileType(String fileType) { this.fileType = fileType; return this; }
        public UserResumeBuilder fileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; return this; }
        public UserResumeBuilder candidateName(String candidateName) { this.candidateName = candidateName; return this; }
        public UserResumeBuilder candidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; return this; }
        public UserResumeBuilder fileContentBase64(String fileContentBase64) { this.fileContentBase64 = fileContentBase64; return this; }
        public UserResumeBuilder rawExtractedText(String rawExtractedText) { this.rawExtractedText = rawExtractedText; return this; }
        public UserResumeBuilder parsedContactInfo(String parsedContactInfo) { this.parsedContactInfo = parsedContactInfo; return this; }
        public UserResumeBuilder parsedSkills(String parsedSkills) { this.parsedSkills = parsedSkills; return this; }
        public UserResumeBuilder parsedExperience(String parsedExperience) { this.parsedExperience = parsedExperience; return this; }
        public UserResumeBuilder parsedEducation(String parsedEducation) { this.parsedEducation = parsedEducation; return this; }
        public UserResumeBuilder status(String status) { this.status = status; return this; }
        public UserResumeBuilder uploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; return this; }
        public UserResumeBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public UserResume build() {
            return new UserResume(id, user, filename, fileType, fileSizeBytes, candidateName, candidateEmail,
                    fileContentBase64, rawExtractedText, parsedContactInfo, parsedSkills, parsedExperience,
                    parsedEducation, status, uploadedAt, updatedAt);
        }
    }
}
