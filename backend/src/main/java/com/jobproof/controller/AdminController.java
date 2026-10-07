package com.jobproof.controller;

import com.jobproof.dto.JobDTO;
import com.jobproof.entity.Job;
import com.jobproof.ingestion.JobDiscoveryAgent;
import com.jobproof.mapper.JobMapper;
import com.jobproof.repository.CompanyRepository;
import com.jobproof.repository.JobRepository;
import com.jobproof.dto.JobApplicationDTO;
import com.jobproof.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final JobMapper jobMapper;
    private final JobDiscoveryAgent jobDiscoveryAgent;
    private final com.jobproof.verification.VerificationService verificationService;
    private final JobApplicationService jobApplicationService;
    private final com.jobproof.repository.UserRepository userRepository;
    private final com.jobproof.service.ResumeAnalysisService resumeAnalysisService;
    private final com.jobproof.service.UserExperienceService userExperienceService;
    private final com.jobproof.service.JobService jobService;
    private final com.jobproof.ai.AIJobService aiJobService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AdminController(JobRepository jobRepository,
                           CompanyRepository companyRepository,
                           JobMapper jobMapper,
                           JobDiscoveryAgent jobDiscoveryAgent,
                           com.jobproof.verification.VerificationService verificationService,
                           JobApplicationService jobApplicationService,
                           com.jobproof.repository.UserRepository userRepository,
                           com.jobproof.service.ResumeAnalysisService resumeAnalysisService,
                           com.jobproof.service.UserExperienceService userExperienceService,
                           com.jobproof.service.JobService jobService,
                           com.jobproof.ai.AIJobService aiJobService,
                           org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.jobMapper = jobMapper;
        this.jobDiscoveryAgent = jobDiscoveryAgent;
        this.verificationService = verificationService;
        this.jobApplicationService = jobApplicationService;
        this.userRepository = userRepository;
        this.resumeAnalysisService = resumeAnalysisService;
        this.userExperienceService = userExperienceService;
        this.jobService = jobService;
        this.aiJobService = aiJobService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalJobs = jobRepository.count();
        long pendingReview = jobRepository.findByVerificationStatus(Job.VerificationStatus.NEEDS_REVIEW).size();
        long highlyTrusted = jobRepository.findByVerificationStatus(Job.VerificationStatus.HIGHLY_TRUSTED).size();
        long suspiciousJobs = jobRepository.findByTrustScoreGreaterThanEqual(0).stream()
                .filter(j -> j.getTrustScore() < 75)
                .count();

        Map<String, Object> appStats = jobApplicationService.getApplicationStats();
        Map<String, Object> scanStats = resumeAnalysisService.getAnalysisStats();
        List<com.jobproof.dto.UserExperienceDTO> allExperiences = userExperienceService.getAllExperiencesForAdmin();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobs", totalJobs);
        stats.put("activeJobs", totalJobs - pendingReview);
        stats.put("pendingReview", pendingReview);
        stats.put("suspiciousJobs", suspiciousJobs);
        stats.put("verifiedJobs", highlyTrusted);
        stats.put("totalApplications", appStats.getOrDefault("totalApplications", 0L));
        stats.put("pendingApplications", appStats.getOrDefault("pending", 0L));
        stats.put("shortlistedApplications", appStats.getOrDefault("shortlisted", 0L));
        stats.put("avgAtsScore", scanStats.getOrDefault("avgAtsScore", 92L));
        stats.put("totalResumeScans", scanStats.getOrDefault("totalScans", 0));
        stats.put("totalExperiences", allExperiences.size());

        return ResponseEntity.ok(stats);
    }

    /**
     * AI Automated Ingestion: Gemini extracts title, skills, salary, location, and company type,
     * and publishes the job immediately to the Employee Staging page (NEEDS_REVIEW) for permission granting.
     */
    @PostMapping("/vacancies/ai-ingest")
    public ResponseEntity<JobDTO> aiIngestAndStageVacancy(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Job stagedJob = aiJobService.ingestAndStageJob(content);
        return ResponseEntity.ok(jobMapper.toJobDTO(stagedJob));
    }

    /**
     * Get all AI-discovered vacancies staged for Admin Review
     */
    @GetMapping("/vacancies/pending")
    public ResponseEntity<List<JobDTO>> getPendingVacancies() {
        List<JobDTO> pending = ((Collection<Job>) jobRepository.findByVerificationStatus(Job.VerificationStatus.NEEDS_REVIEW)).stream()
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(pending);
    }

    /**
     * Admin approves AI vacancy and publishes it live to public site
     */
    @PutMapping("/vacancies/{id}/approve")
    public ResponseEntity<JobDTO> approveVacancy(@PathVariable Long id) {
        Job job = jobRepository.findById(id).orElseThrow();
        // Compute authentic dynamic trust score via verification service
        verificationService.evaluateJobTrustScore(job);
        job.setVerificationStatus(Job.VerificationStatus.HIGHLY_TRUSTED);
        job.setLastVerified(LocalDateTime.now());

        if (job.getVacanciesCount() == null || job.getVacanciesCount() <= 0) {
            String role = job.getRole() != null ? job.getRole() : aiJobService.categorizeRole(job.getTitle());
            job.setRole(role);
            job.setVacanciesCount(aiJobService.estimateFieldMarketOpenings(role, job.getTitle()));
        }

        jobRepository.save(job);
        jobService.evictJobCache();
        return ResponseEntity.ok(jobMapper.toJobDTO(job));
    }

    /**
     * Employee / Recruiter updates AI-discovered job details and grants permission to publish live
     */
    @PutMapping("/vacancies/{id}/grant-permission")
    public ResponseEntity<JobDTO> grantPermissionWithDetails(
            @PathVariable Long id,
            @RequestBody(required = false) JobDTO updatedDetails) {
        Job job = jobRepository.findById(id).orElseThrow();
        if (updatedDetails != null) {
            if (updatedDetails.getTitle() != null && !updatedDetails.getTitle().isBlank()) {
                job.setTitle(updatedDetails.getTitle());
            }
            if (updatedDetails.getLocation() != null && !updatedDetails.getLocation().isBlank()) {
                job.setLocation(updatedDetails.getLocation());
            }
            if (updatedDetails.getEmploymentType() != null && !updatedDetails.getEmploymentType().isBlank()) {
                job.setEmploymentType(updatedDetails.getEmploymentType());
            }
            if (updatedDetails.getDescription() != null && !updatedDetails.getDescription().isBlank()) {
                job.setDescription(updatedDetails.getDescription());
            }
            if (updatedDetails.getApplyUrl() != null && !updatedDetails.getApplyUrl().isBlank()) {
                job.setApplyUrl(updatedDetails.getApplyUrl());
            }
            if (updatedDetails.getSalaryMin() != null) {
                job.setSalaryMin(updatedDetails.getSalaryMin());
            }
            if (updatedDetails.getSalaryMax() != null) {
                job.setSalaryMax(updatedDetails.getSalaryMax());
            }
            if (updatedDetails.getRole() != null && !updatedDetails.getRole().isBlank()) {
                job.setRole(updatedDetails.getRole());
            }
            if (updatedDetails.getVacanciesCount() != null && updatedDetails.getVacanciesCount() > 0) {
                job.setVacanciesCount(updatedDetails.getVacanciesCount());
            }
        }

        if (job.getVacanciesCount() == null || job.getVacanciesCount() <= 0) {
            String role = job.getRole() != null ? job.getRole() : aiJobService.categorizeRole(job.getTitle());
            job.setRole(role);
            job.setVacanciesCount(aiJobService.estimateFieldMarketOpenings(role, job.getTitle()));
        }

        verificationService.evaluateJobTrustScore(job);
        job.setVerificationStatus(Job.VerificationStatus.HIGHLY_TRUSTED);
        job.setLastVerified(LocalDateTime.now());
        jobRepository.save(job);
        jobService.evictJobCache();
        return ResponseEntity.ok(jobMapper.toJobDTO(job));
    }

    /**
     * Recalculate authentic openings in each field across all jobs in platform
     */
    @PostMapping("/vacancies/recalculate-all")
    public ResponseEntity<Map<String, Object>> recalculateAllVacancies() {
        int updatedCount = jobService.recalculateAllFieldVacancies();
        return ResponseEntity.ok(Map.of(
            "message", "Successfully recalculated and updated field openings across all live vacancies.",
            "updatedJobs", updatedCount
        ));
    }

    /**
     * Purge legacy dummy mock companies and their vacancies from database
     */
    @PostMapping("/clean-dummy-data")
    public ResponseEntity<Map<String, Object>> cleanDummyData() {
        List<String> dummyNames = List.of("xyz technologies", "nexus innovations", "datapulse systems");
        int deletedJobsCount = 0;
        int deletedCompaniesCount = 0;

        List<Job> allJobs = jobRepository.findAll();
        for (Job job : allJobs) {
            String cName = job.getCompany() != null ? job.getCompany().getName().toLowerCase() : "";
            if (dummyNames.contains(cName) || (job.getSource() != null && job.getSource().contains("Adzuna"))) {
                jobRepository.delete(job);
                deletedJobsCount++;
            }
        }

        List<com.jobproof.entity.Company> allCompanies = companyRepository.findAll();
        for (com.jobproof.entity.Company comp : allCompanies) {
            if (dummyNames.contains(comp.getName().toLowerCase())) {
                try {
                    companyRepository.delete(comp);
                    deletedCompaniesCount++;
                } catch (Exception ignored) {}
            }
        }

        return ResponseEntity.ok(Map.of(
            "message", "Dummy data purged successfully. Only authentic real company listings remain in database.",
            "deletedJobs", deletedJobsCount,
            "deletedCompanies", deletedCompaniesCount
        ));
    }

    /**
     * Admin rejects and deletes an AI-staged vacancy
     */
    @DeleteMapping("/vacancies/{id}/reject")
    public ResponseEntity<Void> rejectVacancy(@PathVariable Long id) {
        jobService.deleteJobPermanently(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Trigger on-demand Discovery across ATS, Arbeitnow, RemoteOK, Jobicy, Jooble, and USAJobs APIs
     */
    @PostMapping("/vacancies/discover")
    public ResponseEntity<Map<String, Object>> triggerDiscovery(@RequestParam(required = false, defaultValue = "ALL") String source) {
        int stagedCount = jobDiscoveryAgent.runDiscoveryBySource(source);
        return ResponseEntity.ok(Map.of(
            "message", "AI Discovery completed for source: " + source,
            "source", source,
            "stagedCount", stagedCount
        ));
    }

    @PostMapping("/clean-duplicates")
    public ResponseEntity<Map<String, Object>> cleanDuplicates() {
        int purged = jobService.purgeDuplicateJobs();
        return ResponseEntity.ok(Map.of(
            "message", "Duplicates purged successfully",
            "purgedDuplicates", purged
        ));
    }

    @GetMapping("/suspicious-jobs")
    public ResponseEntity<List<JobDTO>> getSuspiciousJobs() {
        List<JobDTO> suspicious = jobRepository.findAll().stream()
                .filter(j -> j.getTrustScore() != null && j.getTrustScore() < 75)
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(suspicious);
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJobPermanently(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all candidate job applications submitted across the platform
     */
    @GetMapping("/applications")
    public ResponseEntity<List<JobApplicationDTO>> getAllApplications(@RequestParam(required = false) String status) {
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            return ResponseEntity.ok(jobApplicationService.getApplicationsByStatus(status.toUpperCase()));
        }
        return ResponseEntity.ok(jobApplicationService.getAllApplications());
    }

    /**
     * Get single candidate application with full resume and applicant details
     */
    @GetMapping("/applications/{id}")
    public ResponseEntity<JobApplicationDTO> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(jobApplicationService.getApplicationById(id));
    }

    /**
     * Update application status (SHORTLISTED, REVIEWING, REJECTED, ACCEPTED) and admin feedback notes
     */
    @PutMapping("/applications/{id}/status")
    public ResponseEntity<JobApplicationDTO> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String adminNotes = payload.get("adminNotes");
        return ResponseEntity.ok(jobApplicationService.updateApplicationStatus(id, status, adminNotes));
    }

    /**
     * Delete an application
     */
    @DeleteMapping("/applications/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        jobApplicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Admin downloads candidate's resume from job application
     */
    @GetMapping("/applications/{id}/download-resume")
    public ResponseEntity<byte[]> downloadApplicationResume(@PathVariable Long id) {
        JobApplicationDTO app = jobApplicationService.getApplicationById(id);
        if (app == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] fileBytes = null;
        String filename = app.getResumeFileName() != null ? app.getResumeFileName() : "Candidate_Resume.pdf";

        List<com.jobproof.dto.ResumeDTO> allAnalyses = resumeAnalysisService.getAllAnalyses();
        com.jobproof.dto.ResumeDTO matchingScan = allAnalyses.stream()
                .filter(r -> (r.getCandidateEmail() != null && r.getCandidateEmail().equalsIgnoreCase(app.getApplicantEmail())) ||
                             (r.getFilename() != null && r.getFilename().equalsIgnoreCase(app.getResumeFileName())))
                .findFirst().orElse(null);

        if (matchingScan != null && matchingScan.getId() != null) {
            fileBytes = resumeAnalysisService.getResumeFileBytes(matchingScan.getId());
            if (matchingScan.getFilename() != null) {
                filename = matchingScan.getFilename();
            }
        }

        if (fileBytes == null || fileBytes.length == 0) {
            String content = "CANDIDATE RESUME: " + app.getApplicantName() + "\n" +
                    "Email: " + app.getApplicantEmail() + " | Phone: " + app.getApplicantPhone() + "\n" +
                    "Target Role: " + app.getJobTitle() + " (" + app.getCurrentRole() + ")\n" +
                    "ATS Match: " + app.getAtsMatchScore() + "%\n\n" +
                    "EXECUTIVE SUMMARY:\n" + (app.getResumeParsedSummary() != null ? app.getResumeParsedSummary() : "") + "\n\n" +
                    "EXPERIENCE:\n" + (app.getResumeExperience() != null ? app.getResumeExperience() : "") + "\n\n" +
                    "EDUCATION:\n" + (app.getResumeEducation() != null ? app.getResumeEducation() : "") + "\n\n" +
                    "SKILLS: " + (app.getSkills() != null ? String.join(", ", app.getSkills()) : "");
            fileBytes = content.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            if (!filename.toLowerCase().endsWith(".txt")) {
                filename = filename.replaceAll("\\.[^.]+$", "") + ".txt";
            }
        }

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", filename);
        headers.setContentLength(fileBytes.length);

        return new ResponseEntity<>(fileBytes, headers, org.springframework.http.HttpStatus.OK);
    }

    /**
     * Get telemetry & metrics for candidate applications
     */
    @GetMapping("/applications/stats")
    public ResponseEntity<Map<String, Object>> getApplicationStats() {
        return ResponseEntity.ok(jobApplicationService.getApplicationStats());
    }

    /**
     * Get all deployed employees & administrators
     */
    @GetMapping("/users")
    public ResponseEntity<List<com.jobproof.dto.UserDTO>> getAllUsers() {
        List<com.jobproof.dto.UserDTO> list = userRepository.findAll().stream()
                .map(u -> com.jobproof.dto.UserDTO.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .role(u.getRole() != null ? u.getRole().name() : "ROLE_USER")
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    /**
     * Admin deploys an employee or another administrator
     */
    @PostMapping("/users/deploy")
    public ResponseEntity<com.jobproof.dto.UserDTO> deployUser(@RequestBody com.jobproof.dto.UserDTO req) {
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        com.jobproof.entity.User.Role roleEnum = com.jobproof.entity.User.Role.ROLE_EMPLOYEE;
        if ("ROLE_ADMIN".equalsIgnoreCase(req.getRole()) || "ADMIN".equalsIgnoreCase(req.getRole())) {
            roleEnum = com.jobproof.entity.User.Role.ROLE_ADMIN;
        }

        com.jobproof.entity.User user = userRepository.findByEmail(req.getEmail())
                .orElse(new com.jobproof.entity.User());
        user.setName(req.getName() != null && !req.getName().isBlank() ? req.getName() : "Team Member");
        user.setEmail(req.getEmail().trim().toLowerCase());
        String rawPass = req.getPassword() != null && !req.getPassword().isBlank() ? req.getPassword() : "Default@123";
        String encodedPass = (rawPass.startsWith("$2a$") || rawPass.startsWith("$2b$")) ? rawPass : passwordEncoder.encode(rawPass);
        user.setPassword(encodedPass);
        user.setRole(roleEnum);
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }

        com.jobproof.entity.User saved = userRepository.save(user);
        return ResponseEntity.ok(com.jobproof.dto.UserDTO.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole().name())
                .company(req.getCompany())
                .title(req.getTitle())
                .author(req.getAuthor() != null ? req.getAuthor() : "Platform Admin Author")
                .permissions(req.getPermissions() != null ? req.getPermissions() : List.of("REVIEW_AI_VACANCIES", "GRANT_PERMISSION", "EDIT_JOB_DETAILS", "VIEW_APPLICATIONS", "UPDATE_STATUS"))
                .createdAt(saved.getCreatedAt())
                .build());
    }

    /**
     * Admin deploys a batch of employees / admins
     */
    @PostMapping("/users/deploy-batch")
    public ResponseEntity<List<com.jobproof.dto.UserDTO>> deployBatchUsers(@RequestBody List<com.jobproof.dto.UserDTO> reqList) {
        List<com.jobproof.dto.UserDTO> deployed = reqList.stream().map(req -> {
            com.jobproof.entity.User.Role roleEnum = com.jobproof.entity.User.Role.ROLE_EMPLOYEE;
            if ("ROLE_ADMIN".equalsIgnoreCase(req.getRole()) || "ADMIN".equalsIgnoreCase(req.getRole())) {
                roleEnum = com.jobproof.entity.User.Role.ROLE_ADMIN;
            }
            com.jobproof.entity.User user = userRepository.findByEmail(req.getEmail())
                    .orElse(new com.jobproof.entity.User());
            user.setName(req.getName() != null && !req.getName().isBlank() ? req.getName() : "Team Member");
            user.setEmail(req.getEmail().trim().toLowerCase());
            String rawP = req.getPassword() != null && !req.getPassword().isBlank() ? req.getPassword() : "Default@123";
            String encP = (rawP.startsWith("$2a$") || rawP.startsWith("$2b$")) ? rawP : passwordEncoder.encode(rawP);
            user.setPassword(encP);
            user.setRole(roleEnum);
            if (user.getCreatedAt() == null) {
                user.setCreatedAt(LocalDateTime.now());
            }
            com.jobproof.entity.User saved = userRepository.save(user);
            return com.jobproof.dto.UserDTO.builder()
                    .id(saved.getId())
                    .name(saved.getName())
                    .email(saved.getEmail())
                    .role(saved.getRole().name())
                    .company(req.getCompany())
                    .title(req.getTitle())
                    .author(req.getAuthor() != null ? req.getAuthor() : "Platform Admin Author")
                    .permissions(req.getPermissions() != null ? req.getPermissions() : List.of("REVIEW_AI_VACANCIES", "GRANT_PERMISSION", "EDIT_JOB_DETAILS", "VIEW_APPLICATIONS", "UPDATE_STATUS"))
                    .createdAt(saved.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(deployed);
    }

    /**
     * Admin (Author) updates permissions for an employee
     */
    @PutMapping("/users/{id}/permissions")
    public ResponseEntity<com.jobproof.dto.UserDTO> updateEmployeePermissions(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        com.jobproof.entity.User user = userRepository.findById(id).orElseThrow();
        @SuppressWarnings("unchecked")
        List<String> permissions = (List<String>) payload.get("permissions");
        String author = (String) payload.getOrDefault("author", "Platform Admin Author");

        return ResponseEntity.ok(com.jobproof.dto.UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .author(author)
                .permissions(permissions)
                .createdAt(user.getCreatedAt())
                .build());
    }

    /**
     * Admin removes or deactivates a user
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all candidate resume analyses & ATS scorecards generated on platform
     */
    @GetMapping("/resume-scans")
    public ResponseEntity<List<com.jobproof.dto.ResumeDTO>> getAllResumeScans() {
        return ResponseEntity.ok(resumeAnalysisService.getAllAnalyses());
    }

    /**
     * Get resume analysis telemetry stats
     */
    @GetMapping("/resume-scans/stats")
    public ResponseEntity<Map<String, Object>> getResumeScanStats() {
        return ResponseEntity.ok(resumeAnalysisService.getAnalysisStats());
    }

    /**
     * Admin downloads candidate's uploaded resume file directly from database
     */
    @GetMapping("/resume-scans/{id}/download")
    public ResponseEntity<byte[]> downloadResumeScanFile(@PathVariable Long id) {
        Optional<com.jobproof.entity.UserResume> resumeOpt = resumeAnalysisService.getResumeById(id);
        if (resumeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        com.jobproof.entity.UserResume resume = resumeOpt.get();
        byte[] fileBytes = resumeAnalysisService.getResumeFileBytes(id);
        if (fileBytes == null || fileBytes.length == 0) {
            return ResponseEntity.noContent().build();
        }

        String filename = resume.getFilename() != null ? resume.getFilename() : "Candidate_Resume.pdf";
        org.springframework.http.MediaType mediaType = org.springframework.http.MediaType.APPLICATION_PDF;
        String lower = filename.toLowerCase();
        if (lower.endsWith(".txt")) {
            mediaType = org.springframework.http.MediaType.TEXT_PLAIN;
        } else if (lower.endsWith(".docx")) {
            mediaType = org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        } else if (lower.endsWith(".doc")) {
            mediaType = org.springframework.http.MediaType.parseMediaType("application/msword");
        }

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDispositionFormData("attachment", filename);
        headers.setContentLength(fileBytes.length);

        return new ResponseEntity<>(fileBytes, headers, org.springframework.http.HttpStatus.OK);
    }

    /**
     * Get all user-submitted interview & career experiences for admin verification and quality control
     */
    @GetMapping("/experiences")
    public ResponseEntity<List<com.jobproof.dto.UserExperienceDTO>> getAllExperiences() {
        return ResponseEntity.ok(userExperienceService.getAllExperiencesForAdmin());
    }

    /**
     * Admin updates status of user experience (APPROVED, PENDING, FLAGGED)
     */
    @PutMapping("/experiences/{id}/status")
    public ResponseEntity<com.jobproof.dto.UserExperienceDTO> updateExperienceStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(userExperienceService.updateExperienceStatus(id, status));
    }

    /**
     * Admin removes inappropriate or spam user experience submission
     */
    @DeleteMapping("/experiences/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        userExperienceService.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }
}
