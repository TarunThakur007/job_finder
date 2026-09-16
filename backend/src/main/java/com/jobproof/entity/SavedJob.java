package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_jobs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "job_id"})
})
public class SavedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public SavedJob() {}

    public SavedJob(Long id, User user, Job job, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.job = job;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static SavedJobBuilder builder() { return new SavedJobBuilder(); }

    public static class SavedJobBuilder {
        private Long id;
        private User user;
        private Job job;
        private LocalDateTime createdAt;

        public SavedJobBuilder id(Long id) { this.id = id; return this; }
        public SavedJobBuilder user(User user) { this.user = user; return this; }
        public SavedJobBuilder job(Job job) { this.job = job; return this; }
        public SavedJobBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public SavedJob build() {
            return new SavedJob(id, user, job, createdAt);
        }
    }
}
