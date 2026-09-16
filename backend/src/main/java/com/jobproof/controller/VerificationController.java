package com.jobproof.controller;

import com.jobproof.dto.VerificationDTO;
import com.jobproof.entity.Job;
import com.jobproof.repository.JobRepository;
import com.jobproof.verification.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class VerificationController {

    private final JobRepository jobRepository;
    private final VerificationService verificationService;

    @GetMapping("/{id}/verification")
    public ResponseEntity<VerificationDTO> getVerificationResult(@PathVariable Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        VerificationDTO dto = verificationService.evaluateJobTrustScore(job);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<VerificationDTO> reVerifyJob(@PathVariable Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        VerificationDTO dto = verificationService.evaluateJobTrustScore(job);
        return ResponseEntity.ok(dto);
    }
}
