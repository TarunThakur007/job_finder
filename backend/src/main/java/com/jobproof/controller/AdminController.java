package com.jobproof.controller;

import com.jobproof.dto.JobDTO;
import com.jobproof.entity.Job;
import com.jobproof.mapper.JobMapper;
import com.jobproof.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;

    @GetMapping("/stats")
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
