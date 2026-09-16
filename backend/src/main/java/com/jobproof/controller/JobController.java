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
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
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
}
