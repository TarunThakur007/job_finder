package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deleted_job_records", indexes = {
    @Index(name = "idx_deleted_jobs_apply_url", columnList = "apply_url"),
    @Index(name = "idx_deleted_jobs_job_key", columnList = "job_key")
})
public class DeletedJobRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "apply_url", length = 1000)
    private String applyUrl;

    @Column(name = "job_key", length = 500)
    private String jobKey;

    @Column(name = "title")
    private String title;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public DeletedJobRecord() {}

    public DeletedJobRecord(String applyUrl, String jobKey, String title, String companyName) {
        this.applyUrl = applyUrl;
        this.jobKey = jobKey;
        this.title = title;
        this.companyName = companyName;
        this.deletedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getApplyUrl() { return applyUrl; }
    public void setApplyUrl(String applyUrl) { this.applyUrl = applyUrl; }

    public String getJobKey() { return jobKey; }
    public void setJobKey(String jobKey) { this.jobKey = jobKey; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
