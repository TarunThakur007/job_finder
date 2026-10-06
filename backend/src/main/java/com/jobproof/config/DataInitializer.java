package com.jobproof.config;

import com.jobproof.entity.Company;
import com.jobproof.entity.Job;
import com.jobproof.entity.JobApplication;
import com.jobproof.entity.User;
import com.jobproof.ingestion.JobDiscoveryAgent;
import com.jobproof.repository.CompanyRepository;
import com.jobproof.repository.JobApplicationRepository;
import com.jobproof.repository.JobRepository;
import com.jobproof.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final JobDiscoveryAgent jobDiscoveryAgent;
    private final UserRepository userRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final com.jobproof.repository.UserExperienceRepository userExperienceRepository;
    private final com.jobproof.repository.EmployeeNotificationRepository notificationRepository;
    private final com.jobproof.service.JobService jobService;

    public DataInitializer(JobRepository jobRepository,
                           CompanyRepository companyRepository,
                           JobDiscoveryAgent jobDiscoveryAgent,
                           UserRepository userRepository,
                           JobApplicationRepository jobApplicationRepository,
                           com.jobproof.repository.UserExperienceRepository userExperienceRepository,
                           com.jobproof.repository.EmployeeNotificationRepository notificationRepository,
                           com.jobproof.service.JobService jobService) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.jobDiscoveryAgent = jobDiscoveryAgent;
        this.userRepository = userRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userExperienceRepository = userExperienceRepository;
        this.notificationRepository = notificationRepository;
        this.jobService = jobService;
    }

    @Override
    public void run(String... args) {
        log.info("[JobProof DataInitializer] Purging legacy dummy/mock companies...");

        List<String> dummyNames = List.of("xyz technologies", "nexus innovations", "datapulse systems");
        List<Job> allJobs = jobRepository.findAll();
        for (Job job : allJobs) {
            String cName = job.getCompany() != null ? job.getCompany().getName().toLowerCase() : "";
            if (dummyNames.contains(cName) || (job.getSource() != null && job.getSource().contains("Adzuna"))) {
                jobRepository.delete(job);
            }
        }

        List<Company> allCompanies = companyRepository.findAll();
        for (Company comp : allCompanies) {
            if (dummyNames.contains(comp.getName().toLowerCase())) {
                try {
                    companyRepository.delete(comp);
                } catch (Exception ignored) {}
            }
        }

        log.info("[JobProof DataInitializer] Purging duplicate listings across all companies...");
        int purgedDuplicates = jobService.purgeDuplicateJobs();
        if (purgedDuplicates > 0) {
            log.info("[JobProof DataInitializer] Purged {} duplicate vacancies from database.", purgedDuplicates);
        }

        log.info("[JobProof DataInitializer] Legacy dummy data cleaned. Ensuring real ATS company vacancies are discovered...");
        if (jobRepository.count() == 0) {
            jobDiscoveryAgent.runDiscovery();
        }

        // Initialize permissions: Grant permission to initial live jobs on user page, keep pending in employee permission list
        List<Job> allDiscovered = jobRepository.findAll();
        long approvedCount = allDiscovered.stream()
                .filter(j -> j.getVerificationStatus() == Job.VerificationStatus.HIGHLY_TRUSTED || j.getVerificationStatus() == Job.VerificationStatus.TRUSTED)
                .count();

        if (approvedCount == 0 && !allDiscovered.isEmpty()) {
            log.info("[JobProof DataInitializer] Initializing permissions: granting employee permission to initial 24 live vacancies on user page and keeping remaining staged jobs in employee permission list...");
            int initialApprovedLimit = Math.min(24, allDiscovered.size());
            for (int i = 0; i < initialApprovedLimit; i++) {
                Job j = allDiscovered.get(i);
                if (i >= initialApprovedLimit - 2) {
                    // Mark 2 vacancies as closed by the company to demonstrate hourly freshness notification & user dismissal
                    j.setVerificationStatus(Job.VerificationStatus.CLOSED);
                    j.setSummary("AI Freshness Agent: Employer stopped hiring for this role (Official career portal indicates job expired / closed)");
                    jobRepository.save(j);

                    String companyName = j.getCompany() != null ? j.getCompany().getName() : "Employer";
                    if (!notificationRepository.existsByJobIdAndType(j.getId(), "JOB_CLOSED_ALERT")) {
                        notificationRepository.save(com.jobproof.entity.EmployeeNotification.builder()
                                .jobId(j.getId())
                                .jobTitle(j.getTitle())
                                .companyName(companyName)
                                .applyUrl(j.getApplyUrl())
                                .type("JOB_CLOSED_ALERT")
                                .reason("Official Career Page Closed / 404")
                                .message(String.format("⚠️ Notice: '%s' has stopped hiring for '%s'. The employer has closed active applications.", companyName, j.getTitle()))
                                .isRead(false)
                                .createdAt(LocalDateTime.now())
                                .build());
                    }
                } else {
                    j.setVerificationStatus(Job.VerificationStatus.HIGHLY_TRUSTED);
                    j.setTrustScore(92 + (i % 7));
                    jobRepository.save(j);
                }
            }
        }

        log.info("[JobProof DataInitializer] Updating vacancy counts for all jobs based on real-time field openings...");
        int updated = jobService.recalculateAllFieldVacancies();
        log.info("[JobProof DataInitializer] Successfully updated {} jobs with real field vacancy counts.", updated);

        // Seed default Admin & Candidate users if not present
        if (!userRepository.existsByEmail("admin@jobproof.io")) {
            log.info("[JobProof DataInitializer] Seeding master platform administrator admin@jobproof.io...");
            userRepository.save(User.builder()
                    .name("Platform Admin Author")
                    .email("admin@jobproof.io")
                    .password("Admin@123")
                    .role(User.Role.ROLE_ADMIN)
                    .headline("Chief Platform Administrator")
                    .company("JobProof Core")
                    .build());
        }

        if (userRepository.count() <= 1) {
            log.info("[JobProof DataInitializer] Seeding candidate users...");
            userRepository.save(User.builder()
                    .name("Cooper Curtis")
                    .email("cooper.curtis@jobproof.io")
                    .password("Password@123")
                    .role(User.Role.ROLE_USER)
                    .build());

            userRepository.save(User.builder()
                    .name("Alex Morgan")
                    .email("alex.morgan@example.com")
                    .password("Password@123")
                    .role(User.Role.ROLE_USER)
                    .build());
        }

        // Seed initial candidate applications for Admin review
        if (jobApplicationRepository.count() == 0) {
            log.info("[JobProof DataInitializer] Seeding realistic candidate applications and resumes for Admin Review...");
            List<Job> liveJobs = jobRepository.findAll();
            if (!liveJobs.isEmpty()) {
                Job firstJob = liveJobs.get(0);
                Job secondJob = liveJobs.size() > 1 ? liveJobs.get(1) : firstJob;
                Job thirdJob = liveJobs.size() > 2 ? liveJobs.get(2) : firstJob;

                // 1. Cooper Curtis application
                jobApplicationRepository.save(JobApplication.builder()
                        .job(firstJob)
                        .applicantName("Cooper Curtis")
                        .applicantEmail("cooper.curtis@jobproof.io")
                        .applicantPhone("+1 (415) 890-1234")
                        .currentRole("Senior Full Stack Engineer")
                        .yearsOfExperience(6.0)
                        .linkedinUrl("https://linkedin.com/in/coopercurtis")
                        .portfolioUrl("https://github.com/coopercurtis")
                        .coverNote("I am passionate about high-scale distributed systems and user-centric web applications. Having led frontend and backend teams across multiple SaaS platforms, I am eager to contribute to your core architecture.")
                        .status("PENDING")
                        .atsMatchScore(96)
                        .skills("Java, Spring Boot, React, TypeScript, PostgreSQL, Docker, Kubernetes, AWS, Redis, GraphQL")
                        .resumeFileName("Cooper_Curtis_Senior_FullStack_Resume.pdf")
                        .resumeFileType("PDF")
                        .resumeParsedSummary("Results-driven Senior Full Stack Engineer with 6+ years of experience leading engineering teams and building high-throughput microservices in Java/Spring Boot and responsive React/Next.js architectures.")
                        .resumeExperience("Lead Full Stack Engineer @ Stripe (2022 - Present)\n- Scaled developer-facing API services processing 12M+ webhooks daily with 99.99% uptime.\n- Mentored 8 junior and mid-level engineers and spearheaded adoption of modern React & TypeScript design systems.\n\nSenior Software Engineer @ Airbnb (2019 - 2022)\n- Designed real-time availability indexing engine reducing query response latency by 45%.\n- Deployed containerized microservices to Kubernetes clusters across AWS and GCP.")
                        .resumeEducation("B.S. in Computer Science\nUniversity of California, Berkeley (2015 - 2019) — Magna Cum Laude")
                        .adminNotes("Top candidate profile with strong leadership experience at Stripe. Prioritize for screening.")
                        .build());

                // 2. Alex Morgan application
                jobApplicationRepository.save(JobApplication.builder()
                        .job(secondJob)
                        .applicantName("Alex Morgan")
                        .applicantEmail("alex.morgan@example.com")
                        .applicantPhone("+1 (212) 555-0199")
                        .currentRole("Senior Java Backend Engineer")
                        .yearsOfExperience(5.5)
                        .linkedinUrl("https://linkedin.com/in/alexmorgan-dev")
                        .portfolioUrl("https://github.com/alexmorgan")
                        .coverNote("My focus over the past 5 years has been on enterprise backend systems, relational database query optimization, and resilient messaging pipelines with Kafka and Redis.")
                        .status("SHORTLISTED")
                        .atsMatchScore(94)
                        .skills("Java 17, Spring Boot, PostgreSQL, Kafka, Microservices, Docker, Redis, REST API, Git")
                        .resumeFileName("Alex_Morgan_Java_Backend_Resume.pdf")
                        .resumeFileType("PDF")
                        .resumeParsedSummary("Senior Java Backend Specialist with extensive track record in high-concurrency architectures, PostgreSQL query tuning, and distributed microservices.")
                        .resumeExperience("Senior Backend Engineer @ Datadog (2021 - Present)\n- Architected distributed event stream ingestion pipelines handling 50k+ events/sec using Kafka and Spring Boot.\n- Reduced database connection bottlenecks by 60% with PgBouncer connection pooling.\n\nSoftware Engineer @ Twilio (2019 - 2021)\n- Developed RESTful messaging endpoints and automated CI/CD deployment pipelines.")
                        .resumeEducation("B.S. in Software Engineering\nGeorgia Institute of Technology (2015 - 2019)")
                        .adminNotes("Shortlisted for Round 1 Technical Architecture interview.")
                        .build());

                // 3. Priya Sharma application
                jobApplicationRepository.save(JobApplication.builder()
                        .job(thirdJob)
                        .applicantName("Priya Sharma")
                        .applicantEmail("priya.sharma@example.com")
                        .applicantPhone("+1 (650) 443-8821")
                        .currentRole("Full Stack React & Spring Boot Developer")
                        .yearsOfExperience(4.0)
                        .linkedinUrl("https://linkedin.com/in/priyasharma")
                        .portfolioUrl("https://priyasharma.io")
                        .coverNote("Excited to bring my experience in building interactive, accessible React frontends backed by Spring Boot REST APIs to your engineering team.")
                        .status("REVIEWING")
                        .atsMatchScore(89)
                        .skills("React.js, JavaScript, TypeScript, Spring Boot, Tailwind CSS, PostgreSQL, REST APIs, Redux")
                        .resumeFileName("Priya_Sharma_FullStack_React_Developer.pdf")
                        .resumeFileType("PDF")
                        .resumeParsedSummary("Versatile Full Stack developer with strong frontend competencies in React and Tailwind CSS paired with Spring Boot and PostgreSQL backend development.")
                        .resumeExperience("Full Stack Engineer @ FinTech Innovations (2022 - Present)\n- Developed customer onboarding portal reducing drop-off rates by 28%.\n- Built robust Spring Boot REST services with JWT authentication and RBAC.\n\nFrontend Engineer @ CloudCraft (2020 - 2022)\n- Created reusable design system component library in React & Tailwind CSS used across 4 enterprise products.")
                        .resumeEducation("B.Tech in Information Technology\nDelhi Technological University (2016 - 2020)")
                        .adminNotes("Under review by engineering manager.")
                        .build());
            }
        }

        // Seed initial candidate interview & work experiences
        if (userExperienceRepository.count() == 0) {
            log.info("[JobProof DataInitializer] Seeding realistic community interview & work experiences...");
            userExperienceRepository.save(com.jobproof.entity.UserExperience.builder()
                    .userName("Cooper Curtis")
                    .userEmail("cooper.curtis@jobproof.io")
                    .companyName("Stripe")
                    .jobTitle("Senior Backend Engineer")
                    .experienceType("INTERVIEW_EXPERIENCE")
                    .employmentType("FULL_TIME")
                    .workMode("HYBRID")
                    .location("San Francisco, CA (Hybrid)")
                    .yearsOfExperience(5.5)
                    .rating(5)
                    .difficultyLevel("HARD")
                    .interviewRounds(4)
                    .questionsAsked("1. Design an idempotent payment webhook delivery queue.\n2. Concurrency handling in PostgreSQL using pessimistic vs optimistic locks.\n3. Live coding: Rate limiter using token bucket algorithm in Java.")
                    .experienceStory("The interview process at Stripe was exceptionally thorough yet collaborative. Round 1 was an architecture deep dive, followed by 2 live coding sessions that simulated real Stripe engineering workflows. The interviewers were very supportive and guided discussions naturally.")
                    .tipsAndAdvice("Focus deeply on distributed systems, idempotency keys, database transaction isolation levels, and writing clean, testable code.")
                    .offerStatus("OFFERED_ACCEPTED")
                    .anonymous(false)
                    .upvotes(18)
                    .status("APPROVED")
                    .build());

            userExperienceRepository.save(com.jobproof.entity.UserExperience.builder()
                    .userName("Alex Morgan")
                    .userEmail("alex.morgan@example.com")
                    .companyName("Datadog")
                    .jobTitle("Cloud Infrastructure & SRE Engineer")
                    .experienceType("INTERVIEW_EXPERIENCE")
                    .employmentType("FULL_TIME")
                    .workMode("REMOTE")
                    .location("Remote, US")
                    .yearsOfExperience(4.5)
                    .rating(4)
                    .difficultyLevel("MEDIUM")
                    .interviewRounds(3)
                    .questionsAsked("1. How do you troubleshoot high tail latency in Kubernetes pods?\n2. Kafka partition rebalancing strategies.\n3. Prometheus metrics alerting best practices.")
                    .experienceStory("Very transparent communication from the recruitment team. The technical screening tested practical troubleshooting on Linux systems rather than abstract algorithmic puzzles.")
                    .tipsAndAdvice("Be ready to read log traces, explain eBPF or container networking basics, and highlight hands-on incident response experience.")
                    .offerStatus("OFFERED_ACCEPTED")
                    .anonymous(false)
                    .upvotes(12)
                    .status("APPROVED")
                    .build());
        }
    }
}

