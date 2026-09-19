package com.jobproof.controller;

import com.jobproof.dto.JobDTO;
import com.jobproof.entity.Job;
import com.jobproof.ingestion.JobDiscoveryAgent;
import com.jobproof.mapper.JobMapper;
import com.jobproof.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final JobDiscoveryAgent jobDiscoveryAgent;

    public AdminController(JobRepository jobRepository, JobMapper jobMapper, JobDiscoveryAgent jobDiscoveryAgent) {
        this.jobRepository = jobRepository;
        this.jobMapper = jobMapper;
        this.jobDiscoveryAgent = jobDiscoveryAgent;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalJobs = jobRepository.count();
        long pendingReview = jobRepository.findByVerificationStatus(Job.VerificationStatus.NEEDS_REVIEW).size();
        long highlyTrusted = jobRepository.findByVerificationStatus(Job.VerificationStatus.HIGHLY_TRUSTED).size();
        long suspiciousJobs = jobRepository.findByTrustScoreGreaterThanEqual(0).stream()
                .filter(j -> j.getTrustScore() < 75)
                .count();

        return ResponseEntity.ok(Map.of(
            "totalJobs", totalJobs,
            "activeJobs", totalJobs - pendingReview,
            "pendingReview", pendingReview,
            "suspiciousJobs", suspiciousJobs,
            "verifiedJobs", highlyTrusted
        ));
    }

    /**
     * Get all AI-discovered vacancies staged for Admin Review
     */
    @GetMapping("/vacancies/pending")
    public ResponseEntity<List<JobDTO>> getPendingVacancies() {
        List<JobDTO> pending = jobRepository.findByVerificationStatus(Job.VerificationStatus.NEEDS_REVIEW).stream()
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
        job.setVerificationStatus(Job.VerificationStatus.HIGHLY_TRUSTED);
        job.setTrustScore(98);
        job.setLastVerified(LocalDateTime.now());
        jobRepository.save(job);
        return ResponseEntity.ok(jobMapper.toJobDTO(job));
    }

    /**
     * Admin rejects and deletes an AI-staged vacancy
     */
    @DeleteMapping("/vacancies/{id}/reject")
    public ResponseEntity<Void> rejectVacancy(@PathVariable Long id) {
        jobRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Trigger on-demand ATS Discovery across Greenhouse, Lever, and Ashby
     */
    @PostMapping("/vacancies/discover")
    public ResponseEntity<Map<String, Object>> triggerDiscovery() {
        int stagedCount = jobDiscoveryAgent.runDiscovery();
        return ResponseEntity.ok(Map.of(
            "message", "AI Discovery completed across target companies",
            "stagedCount", stagedCount
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
        jobRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
