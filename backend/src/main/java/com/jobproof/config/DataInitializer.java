package com.jobproof.config;

import com.jobproof.dto.JobDTO;
import com.jobproof.dto.CompanyDTO;
import com.jobproof.service.JobService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final JobService jobService;

    public DataInitializer(JobService jobService) {
        this.jobService = jobService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("[JobRadar AI] Checking data initialization...");
        if (!jobService.getAllJobs().isEmpty()) {
            System.out.println("[JobRadar AI] Jobs dataset already populated.");
            return;
        }

        System.out.println("[JobRadar AI] Seeding initial verified job vacancies...");

        // Job 1
        jobService.createAndVerifyJob(JobDTO.builder()
                .title("Senior Java Backend Engineer")
                .company(CompanyDTO.builder().name("XYZ Technologies").website("https://xyztech.com").careerPage("https://xyztech.com/careers").industry("Software & Tech").build())
                .role("Backend Development")
                .experienceLevel("3-5 years")
                .location("Bangalore, India (Hybrid)")
                .employmentType("Full-time")
                .salaryMin(1400000.0)
                .salaryMax(2200000.0)
                .salaryCurrency("INR")
                .isSalaryEstimated(false)
                .description("Looking for an experienced Senior Java Developer to design scalable Spring Boot microservices, optimize PostgreSQL query performance, and build resilient REST APIs.")
                .applyUrl("https://xyztech.com/careers/job/104")
                .source("Official Career Portal")
                .sourceJobId("XYZ-104")
                .skills(Arrays.asList("Java", "Spring Boot", "REST API", "SQL", "Docker"))
                .build());

        // Job 2
        jobService.createAndVerifyJob(JobDTO.builder()
                .title("Full Stack React & Spring Boot Developer")
                .company(CompanyDTO.builder().name("Nexus Innovations").website("https://nexusinnovations.com").careerPage("https://nexusinnovations.com/careers").industry("Cloud Solutions").build())
                .role("Full Stack Development")
                .experienceLevel("1-3 years")
                .location("Remote, India")
                .employmentType("Full-time")
                .salaryMin(1800000.0)
                .salaryMax(2400000.0)
                .salaryCurrency("INR")
                .isSalaryEstimated(false)
                .description("Develop full-stack web applications using React 18 frontend and Spring Boot Java backend services. Require clean architecture and modern UX implementation.")
                .applyUrl("https://nexusinnovations.com/careers/apply/302")
                .source("Nexus ATS Portal")
                .sourceJobId("NEX-302")
                .skills(Arrays.asList("Java", "Spring Boot", "React.js", "REST API"))
                .build());

        // Job 3
        jobService.createAndVerifyJob(JobDTO.builder()
                .title("AI & Data Pipeline Engineer")
                .company(CompanyDTO.builder().name("DataPulse Systems").website("https://datapulse.ai").careerPage("https://datapulse.ai/careers").industry("Artificial Intelligence").build())
                .role("AI & Data Engineering")
                .experienceLevel("0-2 years")
                .location("Hyderabad, India")
                .employmentType("Full-time")
                .salaryMin(800000.0)
                .salaryMax(1200000.0)
                .salaryCurrency("INR")
                .isSalaryEstimated(true)
                .description("Build real-time data ingestion pipelines and integrate AI model endpoints using Spring AI, Python, and SQL databases.")
                .applyUrl("https://datapulse.ai/careers/openings/771")
                .source("Adzuna Official Feed")
                .sourceJobId("ADZ-771")
                .skills(Arrays.asList("Java", "Python", "SQL", "Spring Boot"))
                .build());

        System.out.println("[JobRadar AI] Initial dataset successfully initialized!");
    }
}
