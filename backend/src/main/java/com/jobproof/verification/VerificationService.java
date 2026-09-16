package com.jobproof.verification;

import com.jobproof.dto.VerificationDTO;
import com.jobproof.entity.Company;
import com.jobproof.entity.Job;
import com.jobproof.entity.VerificationResult;
import com.jobproof.repository.VerificationResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationResultRepository verificationResultRepository;

    @Transactional
    public VerificationDTO evaluateJobTrustScore(Job job) {
        List<String> reasons = new ArrayList<>();

        // 1. Company Legitimacy Check (Max 25)
        int companyScore = evaluateCompany(job.getCompany(), reasons);

        // 2. Official Source Check (Max 20)
        int sourceScore = evaluateSource(job.getSource(), reasons);

        // 3. Application URL Check (Max 20)
        int urlScore = evaluateUrl(job.getApplyUrl(), job.getCompany(), reasons);

        // 4. Job Freshness Check (Max 15)
        int freshnessScore = evaluateFreshness(job.getPostedDate(), reasons);

        // 5. Description Quality & Safety Check (Max 10)
        int contentScore = evaluateContent(job.getDescription(), reasons);

        // 6. AI Confidence Check (Max 10)
        int aiScore = evaluateAiConfidence(job, reasons);

        int finalScore = companyScore + sourceScore + urlScore + freshnessScore + contentScore + aiScore;
        finalScore = Math.min(100, Math.max(0, finalScore));

        Job.VerificationStatus status;
        if (finalScore >= 90) {
            status = Job.VerificationStatus.HIGHLY_TRUSTED;
        } else if (finalScore >= 75) {
            status = Job.VerificationStatus.TRUSTED;
        } else if (finalScore >= 50) {
            status = Job.VerificationStatus.NEEDS_REVIEW;
        } else {
            status = Job.VerificationStatus.HIGH_RISK;
        }

        job.setTrustScore(finalScore);
        job.setVerificationStatus(status);
        job.setLastVerified(LocalDateTime.now());

        VerificationResult result = verificationResultRepository.findByJob(job)
                .orElseGet(() -> VerificationResult.builder().job(job).build());

        result.setCompanyScore(companyScore);
        result.setSourceScore(sourceScore);
        result.setUrlScore(urlScore);
        result.setFreshnessScore(freshnessScore);
        result.setContentScore(contentScore);
        result.setAiScore(aiScore);
        result.setFinalScore(finalScore);
        result.setReasons(String.join("; ", reasons));
        
        verificationResultRepository.save(result);

        return VerificationDTO.builder()
                .jobId(job.getId())
                .companyScore(companyScore)
                .sourceScore(sourceScore)
                .urlScore(urlScore)
                .freshnessScore(freshnessScore)
                .contentScore(contentScore)
                .aiScore(aiScore)
                .finalScore(finalScore)
                .status(status.name())
                .reasons(reasons)
                .build();
    }

    private int evaluateCompany(Company company, List<String> reasons) {
        if (company == null) {
            reasons.add("Company profile missing (-25 pts)");
            return 5;
        }
        int score = 15;
        if (company.getWebsite() != null && !company.getWebsite().isBlank()) {
            score += 5;
            reasons.add("✓ Official company website verified");
        }
        if (company.getCareerPage() != null && !company.getCareerPage().isBlank()) {
            score += 5;
            reasons.add("✓ Employer career portal verified");
        }
        return score;
    }

    private int evaluateSource(String source, List<String> reasons) {
        if (source == null || source.isBlank()) {
            reasons.add("Unknown job source (-10 pts)");
            return 10;
        }
        String s = source.toLowerCase();
        if (s.contains("adzuna") || s.contains("jooble") || s.contains("direct") || s.contains("official")) {
            reasons.add("✓ Recognized legitimate job source");
            return 20;
        }
        reasons.add("Third-party job feed source");
        return 15;
    }

    private int evaluateUrl(String url, Company company, List<String> reasons) {
        if (url == null || url.isBlank()) {
            reasons.add("Missing application URL (-20 pts)");
            return 0;
        }
        if (url.startsWith("https://")) {
            reasons.add("✓ Secure HTTPS application link");
            if (company != null && company.getWebsite() != null) {
                String domain = extractDomain(company.getWebsite());
                if (!domain.isEmpty() && url.toLowerCase().contains(domain)) {
                    reasons.add("✓ Application URL matches employer corporate domain");
                    return 20;
                }
            }
            return 17;
        }
        reasons.add("Insecure HTTP URL (-5 pts)");
        return 10;
    }

    private int evaluateFreshness(LocalDateTime postedDate, List<String> reasons) {
        if (postedDate == null) {
            return 10;
        }
        long hours = Duration.between(postedDate, LocalDateTime.now()).toHours();
        if (hours <= 48) {
            reasons.add("✓ Fresh listing posted within 48 hours");
            return 15;
        } else if (hours <= 168) {
            reasons.add("Listing posted within 7 days");
            return 12;
        } else {
            reasons.add("Older job listing (> 7 days)");
            return 8;
        }
    }

    private int evaluateContent(String description, List<String> reasons) {
        if (description == null || description.length() < 50) {
            reasons.add("Short or vague description (-5 pts)");
            return 5;
        }
        String descLower = description.toLowerCase();
        if (descLower.contains("pay registration fee") || descLower.contains("send money") || descLower.contains("wire transfer")) {
            reasons.add("⚠ Suspicious payment/fee indicator detected (-10 pts)");
            return 0;
        }
        reasons.add("✓ Detailed job responsibilities & requirements");
        return 10;
    }

    private int evaluateAiConfidence(Job job, List<String> reasons) {
        if (job.getSkills() != null && !job.getSkills().isEmpty()) {
            reasons.add("✓ Structured skill requirements identified");
            return 10;
        }
        return 7;
    }

    private String extractDomain(String url) {
        try {
            String clean = url.replace("https://", "").replace("http://", "").replace("www.", "");
            int slashIdx = clean.indexOf('/');
            if (slashIdx != -1) {
                clean = clean.substring(0, slashIdx);
            }
            return clean.toLowerCase();
        } catch (Exception e) {
            return "";
        }
    }
}
