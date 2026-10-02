package com.jobproof.verification.company;

import com.jobproof.dto.CompanyVerificationDTO;
import com.jobproof.entity.Company;
import com.jobproof.ingestion.TargetCompanyConfig;
import com.jobproof.repository.CompanyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CompanyVerificationService {

    private static final Logger log = LoggerFactory.getLogger(CompanyVerificationService.class);

    private final ClearbitVerificationClient clearbitClient;
    private final BrandfetchVerificationClient brandfetchClient;
    private final TargetCompanyConfig targetCompanyConfig;
    private final CompanyRepository companyRepository;

    public CompanyVerificationService(
            ClearbitVerificationClient clearbitClient,
            BrandfetchVerificationClient brandfetchClient,
            TargetCompanyConfig targetCompanyConfig,
            CompanyRepository companyRepository) {
        this.clearbitClient = clearbitClient;
        this.brandfetchClient = brandfetchClient;
        this.targetCompanyConfig = targetCompanyConfig;
        this.companyRepository = companyRepository;
    }

    /**
     * Verifies a company across Clearbit, Brandfetch, and Official Registry.
     */
    public CompanyVerificationDTO verifyCompany(String companyName) {
        if (companyName == null || companyName.isBlank()) {
            return CompanyVerificationDTO.builder()
                    .verified(false)
                    .confidenceScore(0)
                    .reasons(List.of("Company name is empty or missing"))
                    .build();
        }

        String name = companyName.trim();
        List<String> sources = new ArrayList<>();
        List<String> reasons = new ArrayList<>();
        int score = 0;
        String verifiedDomain = null;
        String logoUrl = null;
        boolean isClaimed = false;

        // 1. Check Official Corporate Target Registry
        boolean inRegistry = targetCompanyConfig.getTargetCompanies().stream()
                .anyMatch(t -> t.name().equalsIgnoreCase(name) || t.slug().equalsIgnoreCase(name));
        if (inRegistry) {
            score += 35;
            sources.add("Official Target Registry");
            reasons.add("✓ Authenticated against JobProof Official Corporate Registry (+35 pts)");
        }

        // 2. Clearbit Autocomplete Verification
        Optional<ClearbitVerificationClient.ClearbitResult> clearbitOpt = clearbitClient.verifyCompany(name);
        if (clearbitOpt.isPresent()) {
            ClearbitVerificationClient.ClearbitResult cb = clearbitOpt.get();
            score += 35;
            verifiedDomain = cb.domain();
            logoUrl = cb.logoUrl();
            sources.add("Clearbit Autocomplete API");
            reasons.add("✓ Verified by Clearbit Autocomplete: Official domain '" + cb.domain() + "' (+35 pts)");
        }

        // 3. Brandfetch Brand Verification
        Optional<BrandfetchVerificationClient.BrandfetchResult> brandfetchOpt = brandfetchClient.verifyCompany(name);
        if (brandfetchOpt.isPresent()) {
            BrandfetchVerificationClient.BrandfetchResult bf = brandfetchOpt.get();
            score += 30;
            if (verifiedDomain == null) {
                verifiedDomain = bf.domain();
            }
            if (logoUrl == null) {
                logoUrl = bf.iconUrl();
            }
            isClaimed = bf.claimed();
            sources.add("Brandfetch API");
            String bfDetail = "✓ Verified by Brandfetch: Domain '" + bf.domain() + "'";
            if (bf.verified()) {
                bfDetail += " (Verified Brand Checkmark)";
                score += 10;
            }
            if (bf.claimed()) {
                bfDetail += " (Claimed Corporate Identity)";
                score += 5;
            }
            reasons.add(bfDetail + " (+30 pts)");
        }

        if (sources.isEmpty()) {
            reasons.add("⚠ Unverified Employer: Domain could not be verified via Clearbit or Brandfetch");
        }

        int finalScore = Math.min(100, Math.max(0, score));
        boolean verified = finalScore >= 50;

        return CompanyVerificationDTO.builder()
                .companyName(name)
                .verified(verified)
                .verifiedDomain(verifiedDomain)
                .logoUrl(logoUrl)
                .confidenceScore(finalScore)
                .isClaimed(isClaimed)
                .sources(sources)
                .reasons(reasons)
                .build();
    }

    /**
     * Verifies and enriches an existing Company entity in the database.
     */
    @Transactional
    public Company verifyAndEnrichCompany(Company company) {
        if (company == null || company.getName() == null) {
            return company;
        }

        CompanyVerificationDTO vResult = verifyCompany(company.getName());
        if (vResult.isVerified()) {
            if (vResult.getVerifiedDomain() != null && !vResult.getVerifiedDomain().isBlank()) {
                String fullWeb = "https://" + vResult.getVerifiedDomain();
                company.setWebsite(fullWeb);
                if (company.getCareerPage() == null || company.getCareerPage().isBlank() || company.getCareerPage().contains("employer.com")) {
                    company.setCareerPage(fullWeb + "/careers");
                }
            }
            company.setVerificationScore(Math.max(company.getVerificationScore() != null ? company.getVerificationScore() : 0, vResult.getConfidenceScore()));
            companyRepository.save(company);
        }
        return company;
    }
}
