package com.jobproof.dto;

public class CompanyDTO {
    private Long id;
    private String name;
    private String website;
    private String careerPage;
    private String industry;
    private String description;
    private String linkedinUrl;
    private String officeLocations;
    private String headquarters;
    private Integer verificationScore;

    public CompanyDTO() {}

    public CompanyDTO(Long id, String name, String website, String careerPage, String industry, String description, Integer verificationScore) {
        this(id, name, website, careerPage, industry, description, verificationScore, null, null, null);
    }

    public CompanyDTO(Long id, String name, String website, String careerPage, String industry, String description, Integer verificationScore, String linkedinUrl, String officeLocations, String headquarters) {
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

    public static CompanyDTOBuilder builder() { return new CompanyDTOBuilder(); }

    public static class CompanyDTOBuilder {
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

        public CompanyDTOBuilder id(Long id) { this.id = id; return this; }
        public CompanyDTOBuilder name(String name) { this.name = name; return this; }
        public CompanyDTOBuilder website(String website) { this.website = website; return this; }
        public CompanyDTOBuilder careerPage(String careerPage) { this.careerPage = careerPage; return this; }
        public CompanyDTOBuilder industry(String industry) { this.industry = industry; return this; }
        public CompanyDTOBuilder description(String description) { this.description = description; return this; }
        public CompanyDTOBuilder verificationScore(Integer verificationScore) { this.verificationScore = verificationScore; return this; }
        public CompanyDTOBuilder linkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; return this; }
        public CompanyDTOBuilder officeLocations(String officeLocations) { this.officeLocations = officeLocations; return this; }
        public CompanyDTOBuilder headquarters(String headquarters) { this.headquarters = headquarters; return this; }

        public CompanyDTO build() {
            return new CompanyDTO(id, name, website, careerPage, industry, description, verificationScore, linkedinUrl, officeLocations, headquarters);
        }
    }
}
