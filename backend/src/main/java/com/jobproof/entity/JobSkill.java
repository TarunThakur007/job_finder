package com.jobproof.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "job_skills")
public class JobSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false)
    private String skill;

    public JobSkill() {}

    public JobSkill(Long id, Job job, String skill) {
        this.id = id;
        this.job = job;
        this.skill = skill;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public static JobSkillBuilder builder() { return new JobSkillBuilder(); }

    public static class JobSkillBuilder {
        private Long id;
        private Job job;
        private String skill;

        public JobSkillBuilder id(Long id) { this.id = id; return this; }
        public JobSkillBuilder job(Job job) { this.job = job; return this; }
        public JobSkillBuilder skill(String skill) { this.skill = skill; return this; }

        public JobSkill build() {
            return new JobSkill(id, job, skill);
        }
    }
}
