package com.jobproof.service;

import com.jobproof.dto.JobApplicationDTO;
import com.jobproof.entity.Job;
import com.jobproof.entity.JobApplication;
import com.jobproof.entity.User;
import com.jobproof.repository.JobApplicationRepository;
import com.jobproof.repository.JobRepository;
import com.jobproof.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    public JobApplicationService(JobApplicationRepository applicationRepository,
                                 JobRepository jobRepository,
                                 UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public JobApplicationDTO submitApplication(JobApplicationDTO dto) {
        Job job = null;
        if (dto.getJobId() != null) {
            job = jobRepository.findById(dto.getJobId()).orElse(null);
        }
        if (job == null) {
            List<Job> allJobs = jobRepository.findAll();
            if (!allJobs.isEmpty()) {
                job = allJobs.get(0);
            } else {
                throw new RuntimeException("No active job opening found to link application.");
            }
        }

        User user = null;
        if (dto.getUserId() != null) {
            user = userRepository.findById(dto.getUserId()).orElse(null);
        } else if (dto.getApplicantEmail() != null) {
            user = userRepository.findByEmail(dto.getApplicantEmail()).orElse(null);
        }

        int atsScore = dto.getAtsMatchScore() != null ? dto.getAtsMatchScore() : 92;
        String skillsStr = dto.getSkills() != null ? String.join(", ", dto.getSkills()) : "Java, Spring Boot, React, SQL, Cloud";

        JobApplication entity = JobApplication.builder()
                .job(job)
                .user(user)
                .applicantName(dto.getApplicantName() != null ? dto.getApplicantName() : "Applicant")
                .applicantEmail(dto.getApplicantEmail() != null ? dto.getApplicantEmail() : "applicant@example.com")
                .applicantPhone(dto.getApplicantPhone() != null ? dto.getApplicantPhone() : "+1 (555) 234-5678")
                .currentRole(dto.getCurrentRole() != null ? dto.getCurrentRole() : "Software Developer")
                .yearsOfExperience(dto.getYearsOfExperience() != null ? dto.getYearsOfExperience() : 4.5)
                .linkedinUrl(dto.getLinkedinUrl() != null ? dto.getLinkedinUrl() : "https://linkedin.com/in/applicant")
                .portfolioUrl(dto.getPortfolioUrl() != null ? dto.getPortfolioUrl() : "https://github.com/applicant")
                .coverNote(dto.getCoverNote() != null ? dto.getCoverNote() : "I am enthusiastic about this opportunity and believe my skill set aligns directly with your engineering requirements.")
                .status("PENDING")
                .atsMatchScore(atsScore)
                .skills(skillsStr)
                .resumeFileName(dto.getResumeFileName() != null ? dto.getResumeFileName() : "Candidate_Resume.pdf")
                .resumeFileType(dto.getResumeFileType() != null ? dto.getResumeFileType() : "PDF")
                .resumeParsedSummary(dto.getResumeParsedSummary() != null ? dto.getResumeParsedSummary() : "Demonstrated track record of delivering resilient cloud services, microservice APIs, and responsive web applications with strong metrics.")
                .resumeExperience(dto.getResumeExperience() != null ? dto.getResumeExperience() : "Lead Software Engineer @ HighTech Solutions (2022-Present)\n- Architected and scaled microservices handling 5M+ daily requests.\n- Reduced backend API latency by 35% using caching and query optimization.\n\nSoftware Developer @ Innovate Corp (2020-2022)\n- Built REST APIs in Java and Spring Boot, integrating with PostgreSQL and Redis.")
                .resumeEducation(dto.getResumeEducation() != null ? dto.getResumeEducation() : "B.S. in Computer Science & Engineering\nState University of Technology (2016-2020) — GPA 3.8/4.0")
                .adminNotes(dto.getAdminNotes())
                .build();

        JobApplication saved = applicationRepository.save(entity);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<JobApplicationDTO> getAllApplications() {
        return applicationRepository.findAllByOrderByAppliedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobApplicationDTO> getApplicationsByStatus(String status) {
        return applicationRepository.findByStatusOrderByAppliedAtDesc(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobApplicationDTO getApplicationById(Long id) {
        JobApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job application not found with id: " + id));
        return toDTO(app);
    }

    @Transactional(readOnly = true)
    public List<JobApplicationDTO> getApplicationsByEmail(String email) {
        return applicationRepository.findByApplicantEmailOrderByAppliedAtDesc(email).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobApplicationDTO updateApplicationStatus(Long id, String status, String adminNotes) {
        JobApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job application not found with id: " + id));
        if (status != null && !status.isBlank()) {
            app.setStatus(status.toUpperCase().trim());
        }
        if (adminNotes != null) {
            app.setAdminNotes(adminNotes);
        }
        app.setUpdatedAt(LocalDateTime.now());
        JobApplication updated = applicationRepository.save(app);
        return toDTO(updated);
    }

    @Transactional
    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getApplicationStats() {
        long total = applicationRepository.count();
        long pending = applicationRepository.countByStatus("PENDING");
        long reviewing = applicationRepository.countByStatus("REVIEWING");
        long shortlisted = applicationRepository.countByStatus("SHORTLISTED");
        long rejected = applicationRepository.countByStatus("REJECTED");
        long accepted = applicationRepository.countByStatus("ACCEPTED");

        List<JobApplication> all = applicationRepository.findAll();
        double avgScore = all.stream()
                .filter(a -> a.getAtsMatchScore() != null)
                .mapToInt(JobApplication::getAtsMatchScore)
                .average()
                .orElse(0.0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", total);
        stats.put("pending", pending);
        stats.put("reviewing", reviewing);
        stats.put("shortlisted", shortlisted);
        stats.put("rejected", rejected);
        stats.put("accepted", accepted);
        stats.put("avgAtsScore", Math.round(avgScore));
        return stats;
    }

    public JobApplicationDTO toDTO(JobApplication entity) {
        if (entity == null) return null;

        List<String> skillsList = Collections.emptyList();
        if (entity.getSkills() != null && !entity.getSkills().isBlank()) {
            skillsList = Arrays.stream(entity.getSkills().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        String jobTitle = entity.getJob() != null ? entity.getJob().getTitle() : "Position";
        String companyName = (entity.getJob() != null && entity.getJob().getCompany() != null)
                ? entity.getJob().getCompany().getName() : "Company";
        String location = entity.getJob() != null ? entity.getJob().getLocation() : "Remote";
        String jobType = entity.getJob() != null ? entity.getJob().getEmploymentType() : "Fulltime";

        return JobApplicationDTO.builder()
                .id(entity.getId())
                .jobId(entity.getJob() != null ? entity.getJob().getId() : null)
                .jobTitle(jobTitle)
                .companyName(companyName)
                .jobLocation(location)
                .jobType(jobType)
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .applicantName(entity.getApplicantName())
                .applicantEmail(entity.getApplicantEmail())
                .applicantPhone(entity.getApplicantPhone())
                .currentRole(entity.getCurrentRole())
                .yearsOfExperience(entity.getYearsOfExperience())
                .linkedinUrl(entity.getLinkedinUrl())
                .portfolioUrl(entity.getPortfolioUrl())
                .coverNote(entity.getCoverNote())
                .status(entity.getStatus())
                .atsMatchScore(entity.getAtsMatchScore())
                .skills(skillsList)
                .resumeFileName(entity.getResumeFileName())
                .resumeFileType(entity.getResumeFileType())
                .resumeParsedSummary(entity.getResumeParsedSummary())
                .resumeExperience(entity.getResumeExperience())
                .resumeEducation(entity.getResumeEducation())
                .adminNotes(entity.getAdminNotes())
                .appliedAt(entity.getAppliedAt() != null ? entity.getAppliedAt().format(FORMATTER) : "")
                .updatedAt(entity.getUpdatedAt() != null ? entity.getUpdatedAt().format(FORMATTER) : "")
                .build();
    }
}
