package com.jobproof.dto;

public class CompanyDTO {
    private Long id;
    private String name;
    private String website;
    private String careerPage;
    private String industry;
    private String description;
    private Integer verificationScore;

    public CompanyDTO() {}

    public CompanyDTO(Long id, String name, String website, String careerPage, String industry, String description, Integer verificationScore) {
        this.id = id;
        this.name = name;
        this.website = website;
        this.careerPage = careerPage;
        this.industry = industry;
        this.description = description;
        this.verificationScore = verificationScore;
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

    public static CompanyDTOBuilder builder() { return new CompanyDTOBuilder(); }

    public static class CompanyDTOBuilder {
        private Long id;
        private String name;
        private String website;
        private String careerPage;
        private String industry;
        private String description;
        private Integer verificationScore;

        public CompanyDTOBuilder id(Long id) { this.id = id; return this; }
        public CompanyDTOBuilder name(String name) { this.name = name; return this; }
        public CompanyDTOBuilder website(String website) { this.website = website; return this; }
        public CompanyDTOBuilder careerPage(String careerPage) { this.careerPage = careerPage; return this; }
        public CompanyDTOBuilder industry(String industry) { this.industry = industry; return this; }
        public CompanyDTOBuilder description(String description) { this.description = description; return this; }
        public CompanyDTOBuilder verificationScore(Integer verificationScore) { this.verificationScore = verificationScore; return this; }

        public CompanyDTO build() {
            return new CompanyDTO(id, name, website, careerPage, industry, description, verificationScore);
        }
    }
}
