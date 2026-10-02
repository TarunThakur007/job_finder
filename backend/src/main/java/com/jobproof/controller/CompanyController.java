package com.jobproof.controller;

import com.jobproof.dto.CompanyDTO;
import com.jobproof.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;
    private final com.jobproof.verification.company.CompanyVerificationService companyVerificationService;

    public CompanyController(CompanyService companyService,
                             com.jobproof.verification.company.CompanyVerificationService companyVerificationService) {
        this.companyService = companyService;
        this.companyVerificationService = companyVerificationService;
    }

    @GetMapping
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDTO> getCompanyById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    /**
     * Real-time verification of any company using Clearbit Autocomplete and Brandfetch APIs
     */
    @GetMapping("/verify")
    public ResponseEntity<com.jobproof.dto.CompanyVerificationDTO> verifyCompany(@RequestParam String name) {
        return ResponseEntity.ok(companyVerificationService.verifyCompany(name));
    }
}
