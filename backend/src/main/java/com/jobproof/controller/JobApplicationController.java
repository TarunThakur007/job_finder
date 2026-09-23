package com.jobproof.controller;

import com.jobproof.dto.JobApplicationDTO;
import com.jobproof.service.JobApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    public JobApplicationController(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<JobApplicationDTO> submitApplication(@RequestBody JobApplicationDTO dto) {
        JobApplicationDTO created = applicationService.submitApplication(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobApplicationDTO>> getMyApplications(@RequestParam String email) {
        return ResponseEntity.ok(applicationService.getApplicationsByEmail(email));
    }
}
