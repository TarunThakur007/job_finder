package com.jobproof.controller;

import com.jobproof.dto.JobDTO;
import com.jobproof.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
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
}
