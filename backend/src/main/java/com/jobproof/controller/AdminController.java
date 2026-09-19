package com.jobproof.controller;

import com.jobproof.dto.JobDTO;
import com.jobproof.mapper.JobMapper;
import com.jobproof.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalJobs = jobRepository.count();
        long suspiciousJobs = jobRepository.findByTrustScoreGreaterThanEqual(0).stream()
                .filter(j -> j.getTrustScore() < 75)
                .count();

        return ResponseEntity.ok(Map.of(
            "totalJobs", totalJobs,
            "activeJobs", totalJobs,
            "suspiciousJobs", suspiciousJobs,
            "verifiedJobs", totalJobs - suspiciousJobs
        ));
    }

    @GetMapping("/suspicious-jobs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<JobDTO>> getSuspiciousJobs() {
        List<JobDTO> suspicious = jobRepository.findAll().stream()
                .filter(j -> j.getTrustScore() != null && j.getTrustScore() < 75)
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(suspicious);
    }

    @DeleteMapping("/jobs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
