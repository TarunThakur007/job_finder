package com.jobproof.controller;

import com.jobproof.dto.JobDTO;
import com.jobproof.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobproof.entity.Job;
import com.jobproof.mapper.JobMapper;
import com.jobproof.verification.JobFreshnessAuditAgent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final JobFreshnessAuditAgent auditAgent;
    private final JobMapper jobMapper;

    public JobController(JobService jobService, JobFreshnessAuditAgent auditAgent, JobMapper jobMapper) {
        this.jobService = jobService;
        this.auditAgent = auditAgent;
        this.jobMapper = jobMapper;
    }

    @GetMapping
    public ResponseEntity<?> getAllJobs(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String q) {
        if (page != null && size != null) {
            return ResponseEntity.ok(jobService.getPaginatedJobs(page, size, q));
        }
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/closed")
    public ResponseEntity<List<JobDTO>> getClosedJobs() {
        return ResponseEntity.ok(jobService.getClosedJobs());
    }

    @DeleteMapping("/closed/all")
    public ResponseEntity<?> removeAllClosedJobs() {
        int removedCount = jobService.removeAllClosedJobs();
        return ResponseEntity.ok(java.util.Map.of(
            "message", "Successfully removed all closed jobs",
            "removedCount", removedCount
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<JobDTO>> getLatestJobs() {
        return ResponseEntity.ok(jobService.getLatestJobs());
    }

    @GetMapping("/verified")
    public ResponseEntity<List<JobDTO>> getVerifiedJobs(@RequestParam(required = false, defaultValue = "80") Integer minScore) {
        return ResponseEntity.ok(jobService.getVerifiedJobs(minScore));
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobDTO>> searchJobs(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(jobService.searchJobs(q));
    }


    @PostMapping
    public ResponseEntity<JobDTO> createAndVerifyJob(@RequestBody JobDTO dto) {
        JobDTO created = jobService.createAndVerifyJob(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeJob(@PathVariable Long id) {
        jobService.deleteJobPermanently(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deleteJobPermanently(@PathVariable Long id) {
        jobService.deleteJobPermanently(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<JobDTO> closeJob(@PathVariable Long id) {
        JobDTO updated = jobService.removeOrCloseJob(id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/reopen")
    public ResponseEntity<JobDTO> reopenJob(@PathVariable Long id) {
        JobDTO updated = jobService.reopenJob(id);
        return ResponseEntity.ok(updated);
    }

    /**
     * AI On-Demand Single Job Freshness Audit:
     * Directly tests employer career endpoint for this opening, verifies whether it's still open,
     * updates lastVerified timestamp to current time, and returns updated JobDTO.
     */
    @PostMapping("/{id}/audit")
    public ResponseEntity<JobDTO> auditJobOpening(@PathVariable Long id) {
        Job updated = auditAgent.auditSingleJob(id);
        return ResponseEntity.ok(jobMapper.toJobDTO(updated));
    }

    /**
     * Trigger freshness audit across all live active jobs.
     */
    @PostMapping("/audit/all")
    public ResponseEntity<Map<String, Object>> auditAllJobs() {
        int flagged = auditAgent.auditActiveJobs();
        return ResponseEntity.ok(Map.of(
            "message", "AI Freshness Audit completed across active jobs",
            "flaggedCount", flagged
        ));
    }
}
