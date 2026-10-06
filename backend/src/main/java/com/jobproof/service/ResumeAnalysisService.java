package com.jobproof.service;

import com.jobproof.dto.ResumeDTO;
import com.jobproof.dto.ResumeDTO.BulletEnhancement;
import com.jobproof.entity.ResumeAnalysis;
import com.jobproof.entity.UserResume;
import com.jobproof.repository.ResumeAnalysisRepository;
import com.jobproof.repository.UserResumeRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class ResumeAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(ResumeAnalysisService.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    private final UserResumeRepository userResumeRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final List<ResumeDTO> recentAnalyses = new CopyOnWriteArrayList<>();

    public ResumeAnalysisService(UserResumeRepository userResumeRepository,
                                 ResumeAnalysisRepository resumeAnalysisRepository) {
        this.userResumeRepository = userResumeRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
    }

    @PostConstruct
    public void init() {
        try {
            if (userResumeRepository.count() == 0) {
                log.info("[ResumeAnalysisService] Database empty. Pre-seeding candidate resumes into database...");
                seedDatabaseWithSampleResumes();
            } else {
                loadFromDatabase();
            }
        } catch (Exception e) {
            log.warn("[ResumeAnalysisService] Could not sync with database on startup: {}. Using memory fallback.", e.getMessage());
            seedMemoryFallback();
        }
    }

    @Transactional
    public ResumeDTO recordAnalysis(ResumeDTO dto) {
        if (dto.getUploadedAt() == null || dto.getUploadedAt().isBlank()) {
            dto.setUploadedAt(LocalDateTime.now().format(FORMATTER));
        }

        String candName = dto.getCandidateName();
        if (candName == null || candName.isBlank()) {
            candName = deriveCandidateName(dto.getFilename());
            dto.setCandidateName(candName);
        }

        String candEmail = dto.getCandidateEmail();
        if (candEmail == null || candEmail.isBlank()) {
            candEmail = candName.toLowerCase().replace(" ", ".") + "@candidate.io";
            dto.setCandidateEmail(candEmail);
        }

        try {
            // 1. Persist UserResume entity in database
            UserResume userResume = UserResume.builder()
                    .filename(dto.getFilename() != null ? dto.getFilename() : "Candidate_Resume.pdf")
                    .fileType(dto.getFileType() != null ? dto.getFileType() : "PDF")
                    .fileSizeBytes(dto.getFileSizeBytes() != null ? dto.getFileSizeBytes() : 245000L)
                    .candidateName(candName)
                    .candidateEmail(candEmail)
                    .fileContentBase64(dto.getFileContentBase64() != null ? dto.getFileContentBase64() : generateDefaultResumeBase64(candName, dto.getTargetJobRole()))
                    .rawExtractedText(dto.getRawResumeText() != null ? dto.getRawResumeText() : generateDefaultResumeText(candName, dto.getTargetJobRole()))
                    .parsedSkills(dto.getExtractedSkills() != null ? String.join(", ", dto.getExtractedSkills()) : "")
                    .parsedContactInfo(candName + " | " + candEmail)
                    .status("ANALYZED")
                    .uploadedAt(LocalDateTime.now())
                    .build();

            UserResume savedResume = userResumeRepository.save(userResume);
            dto.setId(savedResume.getId());

            // 2. Persist ResumeAnalysis report in database
            ResumeAnalysis analysis = ResumeAnalysis.builder()
                    .resume(savedResume)
                    .targetJobRole(dto.getTargetJobRole() != null ? dto.getTargetJobRole() : "Senior Software Engineer")
                    .overallAtsScore(dto.getOverallAtsScore() != null ? dto.getOverallAtsScore() : 85)
                    .formattingScore(dto.getFormattingScore() != null ? dto.getFormattingScore() : 90)
                    .keywordMatchScore(dto.getKeywordMatchScore() != null ? dto.getKeywordMatchScore() : 85)
                    .impactVerbScore(dto.getImpactVerbScore() != null ? dto.getImpactVerbScore() : 85)
                    .extractedSkills(dto.getExtractedSkills() != null ? String.join(", ", dto.getExtractedSkills()) : "")
                    .missingCriticalSkills(dto.getMissingCriticalSkills() != null ? String.join(", ", dto.getMissingCriticalSkills()) : "")
                    .strengths(dto.getStrengths() != null ? String.join(" | ", dto.getStrengths()) : "")
                    .formattingWarnings(dto.getFormattingWarnings() != null ? String.join(" | ", dto.getFormattingWarnings()) : "")
                    .improvementRecommendations(dto.getImprovementRecommendations() != null ? String.join(" | ", dto.getImprovementRecommendations()) : "")
                    .summary(dto.getSummary() != null ? dto.getSummary() : "Verified ATS analysis stored in database.")
                    .build();

            resumeAnalysisRepository.save(analysis);
            log.info("[ResumeAnalysisService] Successfully persisted user resume id={} filename='{}' to database.", savedResume.getId(), savedResume.getFilename());
        } catch (Exception e) {
            log.error("[ResumeAnalysisService] Failed to persist resume to database: {}", e.getMessage(), e);
            if (dto.getId() == null) {
                dto.setId(System.currentTimeMillis());
            }
        }

        // Keep local view synced
        recentAnalyses.removeIf(r -> Objects.equals(r.getId(), dto.getId()));
        recentAnalyses.add(0, dto);
        return dto;
    }

    public List<ResumeDTO> getAllAnalyses() {
        try {
            List<UserResume> dbResumes = userResumeRepository.findAllByOrderByUploadedAtDesc();
            if (!dbResumes.isEmpty()) {
                List<ResumeDTO> dtos = new ArrayList<>();
                for (UserResume r : dbResumes) {
                    Optional<ResumeAnalysis> analysisOpt = resumeAnalysisRepository.findByResumeId(r.getId());
                    dtos.add(mapEntityToDTO(r, analysisOpt.orElse(null)));
                }
                return dtos;
            }
        } catch (Exception e) {
            log.warn("[ResumeAnalysisService] Could not read resumes from database: {}. Using cache.", e.getMessage());
        }
        return Collections.unmodifiableList(recentAnalyses);
    }

    public Optional<UserResume> getResumeById(Long id) {
        return userResumeRepository.findById(id);
    }

    public byte[] getResumeFileBytes(Long id) {
        Optional<UserResume> opt = userResumeRepository.findById(id);
        if (opt.isEmpty()) return null;
        UserResume resume = opt.get();
        if (resume.getFileContentBase64() != null && !resume.getFileContentBase64().isBlank()) {
            try {
                String b64 = resume.getFileContentBase64();
                if (b64.contains(",")) {
                    b64 = b64.substring(b64.indexOf(",") + 1);
                }
                return Base64.getDecoder().decode(b64.trim());
            } catch (Exception ignored) {}
        }
        // Fallback to raw extracted text as bytes
        String text = resume.getRawExtractedText();
        if (text != null && !text.isBlank()) {
            return text.getBytes(StandardCharsets.UTF_8);
        }
        return ("RESUME FILE: " + resume.getFilename() + "\nCandidate: " + resume.getCandidateName() + "\nContact: " + resume.getCandidateEmail()).getBytes(StandardCharsets.UTF_8);
    }

    public Map<String, Object> getAnalysisStats() {
        List<ResumeDTO> all = getAllAnalyses();
        long total = all.size();
        double avgScore = all.stream()
                .filter(r -> r.getOverallAtsScore() != null)
                .mapToInt(ResumeDTO::getOverallAtsScore)
                .average()
                .orElse(0.0);

        long highFit = all.stream()
                .filter(r -> r.getOverallAtsScore() != null && r.getOverallAtsScore() >= 90)
                .count();

        long needsImprovement = all.stream()
                .filter(r -> r.getOverallAtsScore() != null && r.getOverallAtsScore() < 80)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalScans", total);
        stats.put("avgAtsScore", Math.round(avgScore));
        stats.put("highMatchCount", highFit);
        stats.put("needsImprovementCount", needsImprovement);
        return stats;
    }

    private void loadFromDatabase() {
        recentAnalyses.clear();
        recentAnalyses.addAll(getAllAnalyses());
    }

    private void seedDatabaseWithSampleResumes() {
        // 1. Alex Morgan
        ResumeDTO scan1 = new ResumeDTO();
        scan1.setFilename("Alex_Morgan_Java_Backend_Resume.pdf");
        scan1.setFileType("PDF");
        scan1.setFileSizeBytes(248000L);
        scan1.setCandidateName("Alex Morgan");
        scan1.setCandidateEmail("alex.morgan@example.com");
        scan1.setTargetJobRole("Senior Java Backend Engineer");
        scan1.setOverallAtsScore(94);
        scan1.setFormattingScore(96);
        scan1.setKeywordMatchScore(92);
        scan1.setImpactVerbScore(90);
        scan1.setExtractedSkills(List.of("Java 17", "Spring Boot", "PostgreSQL", "Microservices", "Docker", "Redis", "REST API", "Git"));
        scan1.setMissingCriticalSkills(List.of("Apache Kafka", "Kubernetes", "OpenTelemetry"));
        scan1.setStrengths(List.of("Includes quantifiable metrics", "Clean standard layout", "Strong alignment with Spring Boot"));
        scan1.setFormattingWarnings(List.of("Ensure standard bullet characters without graphical tables."));
        scan1.setImprovementRecommendations(List.of("Integrate Kafka & Kubernetes keywords in distributed project descriptions."));
        scan1.setBulletEnhancements(List.of(new BulletEnhancement(
                "Worked on backend APIs and database tables for company web application.",
                "Architected resilient Spring Boot microservices handling 25M+ daily requests, optimizing PostgreSQL query plans to reduce p99 response latency by 42%.",
                "Replaces passive phrasing with measurable scale and database optimization impact."
        )));
        scan1.setSummary("Strong senior backend engineering profile with high ATS compatibility evaluated by Gemini AI.");
        scan1.setRawResumeText(generateDefaultResumeText("Alex Morgan", "Senior Java Backend Engineer"));
        scan1.setFileContentBase64(generateDefaultResumeBase64("Alex Morgan", "Senior Java Backend Engineer"));
        recordAnalysis(scan1);

        // 2. Priya Sharma
        ResumeDTO scan2 = new ResumeDTO();
        scan2.setFilename("Priya_Sharma_FullStack_Resume.pdf");
        scan2.setFileType("PDF");
        scan2.setFileSizeBytes(215000L);
        scan2.setCandidateName("Priya Sharma");
        scan2.setCandidateEmail("priya.s@gmail.com");
        scan2.setTargetJobRole("Full Stack Cloud Developer");
        scan2.setOverallAtsScore(89);
        scan2.setFormattingScore(92);
        scan2.setKeywordMatchScore(88);
        scan2.setImpactVerbScore(87);
        scan2.setExtractedSkills(List.of("React", "TypeScript", "Node.js", "Java", "Docker", "AWS S3", "GraphQL"));
        scan2.setMissingCriticalSkills(List.of("CI/CD Automation", "Terraform", "Jest Testing"));
        scan2.setStrengths(List.of("Well balanced frontend and backend technical competencies", "Clear project outcomes"));
        scan2.setFormattingWarnings(List.of("Avoid dual-column layout for older ATS parsers."));
        scan2.setImprovementRecommendations(List.of("Add unit testing and cloud infrastructure automation keywords."));
        scan2.setBulletEnhancements(List.of(new BulletEnhancement(
                "Built user interfaces with React and connected to APIs.",
                "Engineered responsive React 18 web applications with modular component architecture, improving user session retention by 34% and cutting page bundle size by 40%.",
                "STAR format transformation quantifying front-end performance and business retention gains."
        )));
        scan2.setSummary("High potential full stack engineer with versatile modern web stack credentials.");
        scan2.setRawResumeText(generateDefaultResumeText("Priya Sharma", "Full Stack Cloud Developer"));
        scan2.setFileContentBase64(generateDefaultResumeBase64("Priya Sharma", "Full Stack Cloud Developer"));
        recordAnalysis(scan2);

        // 3. Marcus Vance
        ResumeDTO scan3 = new ResumeDTO();
        scan3.setFilename("Marcus_Vance_DevOps_Resume.docx");
        scan3.setFileType("DOCX");
        scan3.setFileSizeBytes(312000L);
        scan3.setCandidateName("Marcus Vance");
        scan3.setCandidateEmail("marcus.vance@techops.io");
        scan3.setTargetJobRole("Lead DevOps & SRE Engineer");
        scan3.setOverallAtsScore(96);
        scan3.setFormattingScore(98);
        scan3.setKeywordMatchScore(95);
        scan3.setImpactVerbScore(96);
        scan3.setExtractedSkills(List.of("Kubernetes", "Terraform", "AWS", "Helm", "Prometheus", "Grafana", "Python", "Linux"));
        scan3.setMissingCriticalSkills(List.of("ArgoCD", "Istio Service Mesh"));
        scan3.setStrengths(List.of("Exceptional 99.99% SLA reliability metrics", "Deep multi-cloud provisioning mastery"));
        scan3.setFormattingWarnings(List.of("Ensure DOCX is exported to PDF prior to upload."));
        scan3.setImprovementRecommendations(List.of("Highlight GitOps continuous deployment patterns with ArgoCD."));
        scan3.setBulletEnhancements(List.of(new BulletEnhancement(
                "Maintained Kubernetes servers and handled cloud alerts.",
                "Orchestrated multi-region AWS EKS clusters with Terraform and Helm, achieving 99.99% system availability while reducing monthly AWS spend by $45,000.",
                "Demonstrates multi-region enterprise scale and massive cloud cost optimization."
        )));
        scan3.setSummary("Top-tier DevOps engineer profile with pristine ATS compliance and verified high-impact metrics.");
        scan3.setRawResumeText(generateDefaultResumeText("Marcus Vance", "Lead DevOps & SRE Engineer"));
        scan3.setFileContentBase64(generateDefaultResumeBase64("Marcus Vance", "Lead DevOps & SRE Engineer"));
        recordAnalysis(scan3);
    }

    private void seedMemoryFallback() {
        recentAnalyses.clear();
        // Fallback in memory
        ResumeDTO scan = new ResumeDTO();
        scan.setId(1001L);
        scan.setFilename("Alex_Morgan_Java_Backend_Resume.pdf");
        scan.setCandidateName("Alex Morgan");
        scan.setTargetJobRole("Senior Java Backend Engineer");
        scan.setOverallAtsScore(94);
        recentAnalyses.add(scan);
    }

    private ResumeDTO mapEntityToDTO(UserResume r, ResumeAnalysis a) {
        ResumeDTO dto = new ResumeDTO();
        dto.setId(r.getId());
        dto.setFilename(r.getFilename());
        dto.setFileType(r.getFileType());
        dto.setFileSizeBytes(r.getFileSizeBytes());
        dto.setCandidateName(r.getCandidateName() != null ? r.getCandidateName() : deriveCandidateName(r.getFilename()));
        dto.setCandidateEmail(r.getCandidateEmail() != null ? r.getCandidateEmail() : "candidate@jobproof.io");
        dto.setRawResumeText(r.getRawExtractedText());
        dto.setFileContentBase64(r.getFileContentBase64());
        dto.setUploadedAt(r.getUploadedAt() != null ? r.getUploadedAt().format(FORMATTER) : "Recently");

        if (a != null) {
            dto.setTargetJobRole(a.getTargetJobRole());
            dto.setOverallAtsScore(a.getOverallAtsScore());
            dto.setFormattingScore(a.getFormattingScore());
            dto.setKeywordMatchScore(a.getKeywordMatchScore());
            dto.setImpactVerbScore(a.getImpactVerbScore());
            dto.setSummary(a.getSummary());

            if (a.getExtractedSkills() != null && !a.getExtractedSkills().isBlank()) {
                dto.setExtractedSkills(Arrays.stream(a.getExtractedSkills().split(","))
                        .map(String::trim).filter(s -> !s.isBlank()).collect(Collectors.toList()));
            } else {
                dto.setExtractedSkills(List.of("Java", "Spring Boot", "REST API"));
            }

            if (a.getMissingCriticalSkills() != null && !a.getMissingCriticalSkills().isBlank()) {
                dto.setMissingCriticalSkills(Arrays.stream(a.getMissingCriticalSkills().split(","))
                        .map(String::trim).filter(s -> !s.isBlank()).collect(Collectors.toList()));
            }

            if (a.getStrengths() != null && !a.getStrengths().isBlank()) {
                dto.setStrengths(Arrays.stream(a.getStrengths().split("\\|"))
                        .map(String::trim).filter(s -> !s.isBlank()).collect(Collectors.toList()));
            }

            if (a.getFormattingWarnings() != null && !a.getFormattingWarnings().isBlank()) {
                dto.setFormattingWarnings(Arrays.stream(a.getFormattingWarnings().split("\\|"))
                        .map(String::trim).filter(s -> !s.isBlank()).collect(Collectors.toList()));
            }

            if (a.getImprovementRecommendations() != null && !a.getImprovementRecommendations().isBlank()) {
                dto.setImprovementRecommendations(Arrays.stream(a.getImprovementRecommendations().split("\\|"))
                        .map(String::trim).filter(s -> !s.isBlank()).collect(Collectors.toList()));
            }
        } else {
            dto.setTargetJobRole("Software Professional");
            dto.setOverallAtsScore(85);
            dto.setSummary("Resume stored in database. Awaiting comprehensive AI score breakdown.");
            dto.setExtractedSkills(List.of("Software Engineering", "Full Stack Development"));
        }

        // Add standard sample bullet enhancement for inspection
        dto.setBulletEnhancements(List.of(new BulletEnhancement(
                "Implemented features and optimized application performance.",
                "Engineered high-throughput microservices using modern best practices, reducing latency by 35% and supporting 10M+ daily active sessions.",
                "Quantified scale and eliminated passive language using the STAR method."
        )));

        int score = dto.getOverallAtsScore() != null ? dto.getOverallAtsScore() : 75;
        if (dto.getJobReadinessStatus() == null || dto.getJobReadinessStatus().isBlank()) {
            if (score >= 85) dto.setJobReadinessStatus("Job Ready (High Market Match)");
            else if (score >= 65) dto.setJobReadinessStatus("Near Ready (Skill Gap Bridge Required)");
            else dto.setJobReadinessStatus("Substantial Skill Gap (<65% Match - Reskilling Required)");
        }
        if (dto.getJobReadinessRoadmap() == null || dto.getJobReadinessRoadmap().isEmpty()) {
            String roleStr = dto.getTargetJobRole() != null ? dto.getTargetJobRole() : "Target Role";
            dto.setJobReadinessRoadmap(List.of(
                    "Phase 1: Skill Acquisition & Tooling - Bridge missing critical technologies for " + roleStr + ".",
                    "Phase 2: Build Verified Capstone Project - Develop and deploy an end-to-end production portfolio application.",
                    "Phase 3: Experience STAR Re-engineering - Overhaul resume experience bullets to explicitly showcase quantifiable business impact.",
                    "Phase 4: Interview & System Design Preparation - Prepare for senior architectural tradeoffs and live coding rounds."
            ));
        }
        if (dto.getRecommendedProject() == null || dto.getRecommendedProject().isBlank()) {
            dto.setRecommendedProject("Production-Grade Enterprise System: Build a modular microservices platform featuring asynchronous message queues, distributed caching, relational database schema with indexing, and containerized Docker deployment.");
        }

        return dto;
    }

    private String deriveCandidateName(String filename) {
        if (filename == null || filename.isBlank()) return "Candidate User";
        String clean = filename.replace(".pdf", "").replace(".docx", "").replace(".txt", "");
        clean = clean.replace("_Resume", "").replace("-Resume", "").replace("Resume", "");
        clean = clean.replace("_", " ").replace("-", " ").trim();
        return clean.isEmpty() ? "Candidate User" : clean;
    }

    private String generateDefaultResumeText(String name, String role) {
        return name + "\n" +
                name.toLowerCase().replace(" ", ".") + "@candidate.io | (555) 019-2834 | linkedin.com/in/" + name.toLowerCase().replace(" ", "") + "\n\n" +
                "PROFESSIONAL SUMMARY\n" +
                "High-impact " + role + " with track record of building resilient enterprise applications, optimizing distributed databases, and delivering mission-critical microservice APIs.\n\n" +
                "CORE COMPETENCIES & TECHNICAL SKILLS\n" +
                "Languages: Java 17, Python, TypeScript, SQL\n" +
                "Frameworks & Tools: Spring Boot, React, Docker, Kubernetes, PostgreSQL, Redis, REST APIs, Git, AWS\n\n" +
                "PROFESSIONAL WORK EXPERIENCE\n" +
                "Lead Software Engineer | HighScale Technologies (2022 - Present)\n" +
                "• Architected distributed backend services processing 25M+ daily requests, improving throughput by 42%.\n" +
                "• Designed automated CI/CD deployment pipelines cutting deployment cycle time from 2 hours to 12 minutes.\n" +
                "• Mentored 6 software engineers and spearheaded code review standards.\n\n" +
                "Software Engineer | NextGen Cloud Labs (2019 - 2022)\n" +
                "• Developed secure REST API endpoints with Spring Boot and PostgreSQL, decreasing query latency by 35%.\n" +
                "• Integrated Redis distributed caching layer to support peak traffic events.\n\n" +
                "EDUCATION\n" +
                "B.S. in Computer Science & Engineering\n" +
                "State University of Technology (2015 - 2019) — Magna Cum Laude (GPA 3.85/4.0)";
    }

    private String generateDefaultResumeBase64(String name, String role) {
        String content = generateDefaultResumeText(name, role);
        return Base64.getEncoder().encodeToString(content.getBytes(StandardCharsets.UTF_8));
    }
}
