package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String website;

    @Column(name = "career_page")
    private String careerPage;

    private String industry;

    @Column(length = 2000)
    private String description;

    @Column(name = "verification_score")
    private Integer verificationScore;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "office_locations", length = 1000)
    private String officeLocations;

    private String headquarters;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Company() {}

    public Company(Long id, String name, String website, String careerPage, String industry, String description, Integer verificationScore, LocalDateTime createdAt) {
        this(id, name, website, careerPage, industry, description, verificationScore, null, null, null, createdAt);
    }

    public Company(Long id, String name, String website, String careerPage, String industry, String description, Integer verificationScore, String linkedinUrl, String officeLocations, String headquarters, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.website = website;
        this.careerPage = careerPage;
        this.industry = industry;
        this.description = description;
        this.verificationScore = verificationScore;
        this.linkedinUrl = linkedinUrl;
        this.officeLocations = officeLocations;
        this.headquarters = headquarters;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.verificationScore == null) {
            this.verificationScore = 80;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getCareerPage() { return careerPage; }
    public void setCareerPage(String careerPage) { this.careerPage = careerPage; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getVerificationScore() { return verificationScore; }
    public void setVerificationScore(Integer verificationScore) { this.verificationScore = verificationScore; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getOfficeLocations() { return officeLocations; }
    public void setOfficeLocations(String officeLocations) { this.officeLocations = officeLocations; }

    public String getHeadquarters() { return headquarters; }
    public void setHeadquarters(String headquarters) { this.headquarters = headquarters; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static CompanyBuilder builder() {
        return new CompanyBuilder();
    }

    public static class CompanyBuilder {
        private Long id;
        private String name;
        private String website;
        private String careerPage;
        private String industry;
        private String description;
        private Integer verificationScore;
        private String linkedinUrl;
        private String officeLocations;
        private String headquarters;
        private LocalDateTime createdAt;

        public CompanyBuilder id(Long id) { this.id = id; return this; }
        public CompanyBuilder name(String name) { this.name = name; return this; }
        public CompanyBuilder website(String website) { this.website = website; return this; }
        public CompanyBuilder careerPage(String careerPage) { this.careerPage = careerPage; return this; }
        public CompanyBuilder industry(String industry) { this.industry = industry; return this; }
        public CompanyBuilder description(String description) { this.description = description; return this; }
        public CompanyBuilder verificationScore(Integer verificationScore) { this.verificationScore = verificationScore; return this; }
        public CompanyBuilder linkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; return this; }
        public CompanyBuilder officeLocations(String officeLocations) { this.officeLocations = officeLocations; return this; }
        public CompanyBuilder headquarters(String headquarters) { this.headquarters = headquarters; return this; }
        public CompanyBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Company build() {
            return new Company(id, name, website, careerPage, industry, description, verificationScore, linkedinUrl, officeLocations, headquarters, createdAt);
        }
    }
}
