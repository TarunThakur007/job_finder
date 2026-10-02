package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_notifications")
public class EmployeeNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "apply_url", length = 1000)
    private String applyUrl;

    @Column(nullable = false)
    private String type; // "JOB_CLOSED_ALERT", "DEAD_LINK_404", "EXPIRED_LISTING"

    @Column(length = 2000)
    private String reason;

    @Column(length = 2000, nullable = false)
    private String message;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public EmployeeNotification() {}

    public EmployeeNotification(Long id, Long jobId, String jobTitle, String companyName, String applyUrl, String type, String reason, String message, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.applyUrl = applyUrl;
        this.type = type;
        this.reason = reason;
        this.message = message;
        this.isRead = isRead != null ? isRead : false;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isRead == null) {
            this.isRead = false;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getApplyUrl() { return applyUrl; }
    public void setApplyUrl(String applyUrl) { this.applyUrl = applyUrl; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long jobId;
        private String jobTitle;
        private String companyName;
        private String applyUrl;
        private String type = "JOB_CLOSED_ALERT";
        private String reason;
        private String message;
        private Boolean isRead = false;
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder jobId(Long jobId) { this.jobId = jobId; return this; }
        public Builder jobTitle(String jobTitle) { this.jobTitle = jobTitle; return this; }
        public Builder companyName(String companyName) { this.companyName = companyName; return this; }
        public Builder applyUrl(String applyUrl) { this.applyUrl = applyUrl; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public EmployeeNotification build() {
            return new EmployeeNotification(id, jobId, jobTitle, companyName, applyUrl, type, reason, message, isRead, createdAt);
        }
    }
}
