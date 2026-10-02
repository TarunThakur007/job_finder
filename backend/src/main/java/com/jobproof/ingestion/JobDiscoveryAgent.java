package com.jobproof.ingestion;

import com.jobproof.ai.AIJobService;
import com.jobproof.dto.JobDTO;
import com.jobproof.entity.Company;
import com.jobproof.entity.Job;
import com.jobproof.ingestion.connector.*;
import com.jobproof.repository.CompanyRepository;
import com.jobproof.repository.JobRepository;
import com.jobproof.verification.VerificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class JobDiscoveryAgent {

    private static final Logger log = LoggerFactory.getLogger(JobDiscoveryAgent.class);

    private final TargetCompanyConfig companyConfig;
    private final GreenhouseConnector greenhouseConnector;
    private final LeverConnector leverConnector;
    private final AshbyConnector ashbyConnector;
    private final ArbeitnowConnector arbeitnowConnector;
    private final RemoteOKConnector remoteOKConnector;
    private final JobicyConnector jobicyConnector;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final VerificationService verificationService;
    private final AIJobService aiJobService;

    public JobDiscoveryAgent(
            TargetCompanyConfig companyConfig,
            GreenhouseConnector greenhouseConnector,
            LeverConnector leverConnector,
            AshbyConnector ashbyConnector,
            ArbeitnowConnector arbeitnowConnector,
            RemoteOKConnector remoteOKConnector,
            JobicyConnector jobicyConnector,
            JobRepository jobRepository,
            CompanyRepository companyRepository,
            VerificationService verificationService,
            AIJobService aiJobService) {
        this.companyConfig = companyConfig;
        this.greenhouseConnector = greenhouseConnector;
        this.leverConnector = leverConnector;
        this.ashbyConnector = ashbyConnector;
        this.arbeitnowConnector = arbeitnowConnector;
        this.remoteOKConnector = remoteOKConnector;
        this.jobicyConnector = jobicyConnector;
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.verificationService = verificationService;
        this.aiJobService = aiJobService;
    }

    /**
     * Runs comprehensive discovery across all connected sources:
     * 1. Official ATS feeds (Greenhouse, Lever, Ashby)
     * 2. Arbeitnow API (Verified job board feed)
     * 3. Jobicy Remote API (Verified engineering feed)
     * 4. RemoteOK API (Verified developer feed)
     */
    public int runDiscovery() {
        return runDiscoveryBySource("ALL");
    }

    /**
     * Runs discovery for a specific source: ATS, ARBEITNOW, REMOTEOK, JOBICY, or ALL
     */
    public int runDiscoveryBySource(String sourceName) {
        String filter = sourceName != null ? sourceName.trim().toUpperCase() : "ALL";
        log.info("[JobDiscoveryAgent] Initiating discovery pipeline for source: {}", filter);
        int totalStaged = 0;

        // 1. Official Direct ATS Ingestion
        if ("ALL".equals(filter) || "ATS".equals(filter)) {
            totalStaged += discoverFromAts();
        }

        // 2. Arbeitnow Public API (Free & Verified)
        if ("ALL".equals(filter) || "ARBEITNOW".equals(filter)) {
            try {
                List<JobDTO> candidates = arbeitnowConnector.fetchJobs(15);
                totalStaged += stageCandidates(candidates, 10, "Arbeitnow API Feed");
            } catch (Exception e) {
                log.error("[JobDiscoveryAgent] Error during Arbeitnow ingestion: {}", e.getMessage());
            }
        }

        // 3. Jobicy Remote Jobs API (Free & Verified)
        if ("ALL".equals(filter) || "JOBICY".equals(filter)) {
            try {
                List<JobDTO> candidates = jobicyConnector.fetchJobs(15);
                totalStaged += stageCandidates(candidates, 10, "Jobicy Remote API");
            } catch (Exception e) {
                log.error("[JobDiscoveryAgent] Error during Jobicy ingestion: {}", e.getMessage());
            }
        }

        // 4. RemoteOK Public API (Free & Verified)
        if ("ALL".equals(filter) || "REMOTEOK".equals(filter)) {
            try {
                List<JobDTO> candidates = remoteOKConnector.fetchJobs(15);
                totalStaged += stageCandidates(candidates, 10, "RemoteOK API Feed");
            } catch (Exception e) {
                log.error("[JobDiscoveryAgent] Error during RemoteOK ingestion: {}", e.getMessage());
            }
        }

        log.info("[JobDiscoveryAgent] Ingestion completed. Total staged for Employee/Admin review: {}", totalStaged);
        return totalStaged;
    }

    private int discoverFromAts() {
        int stagedCount = 0;
        for (TargetCompanyConfig.TargetCompany target : companyConfig.getTargetCompanies()) {
            try {
                List<JobDTO> candidates = switch (target.atsType()) {
                    case GREENHOUSE -> greenhouseConnector.fetchJobs(target.name(), target.slug());
                    case LEVER -> leverConnector.fetchJobs(target.name(), target.slug());
                    case ASHBY -> ashbyConnector.fetchJobs(target.name(), target.slug());
                };

                if (candidates.isEmpty()) {
                    continue;
                }

                Company company = getOrCreateCompany(target.name(), target.website(), target.website() + "/careers", 95);
                stagedCount += stageForCompany(candidates, company, 5, "Official " + target.atsType() + " Feed");
            } catch (Exception e) {
                log.error("[JobDiscoveryAgent] Error discovering ATS vacancies for {}: {}", target.name(), e.getMessage());
            }
        }
        return stagedCount;
    }

    private int stageCandidates(List<JobDTO> candidates, int limit, String sourceLabel) {
        if (candidates == null || candidates.isEmpty()) {
            return 0;
        }

        int count = 0;
        int max = Math.min(candidates.size(), limit);

        for (int i = 0; i < max; i++) {
            JobDTO draft = candidates.get(i);
            try {
                String cleanUrl = normalizeUrl(draft.getApplyUrl());
                if (cleanUrl == null || jobRepository.findByApplyUrl(cleanUrl).isPresent()) {
                    continue;
                }

                String cName = draft.getCompany() != null && draft.getCompany().getName() != null
                        ? draft.getCompany().getName()
                        : "Verified Employer";
                String cWeb = draft.getCompany() != null && draft.getCompany().getWebsite() != null
                        ? draft.getCompany().getWebsite()
                        : null;

                Company company = getOrCreateCompany(cName, cWeb, null, 88);

                String desc = draft.getDescription();
                if (desc != null && desc.length() > 4000) {
                    desc = desc.substring(0, 4000);
                }

                Job job = new Job();
                job.setTitle(draft.getTitle() != null && draft.getTitle().length() > 250 ? draft.getTitle().substring(0, 250) : draft.getTitle());
                job.setCompany(company);
                job.setLocation(draft.getLocation());
                job.setApplyUrl(cleanUrl);
                job.setSource(draft.getSource() != null ? draft.getSource() : sourceLabel);
                job.setSourceJobId(draft.getSourceJobId());
                job.setEmploymentType(draft.getEmploymentType() != null ? draft.getEmploymentType() : "Full-time");
                job.setDescription(desc != null && !desc.isBlank()
                        ? desc
                        : "Verified position discovered from " + company.getName() + " via " + sourceLabel + ".");
                job.setSalaryMin(draft.getSalaryMin());
                job.setSalaryMax(draft.getSalaryMax());
                job.setSalaryCurrency(draft.getSalaryCurrency() != null ? draft.getSalaryCurrency() : "USD");
                job.setIsSalaryEstimated(draft.getSalaryMin() == null && draft.getSalaryMax() == null);
                job.setVerificationStatus(Job.VerificationStatus.NEEDS_REVIEW); // Staged for Review!
                job.setPostedDate(LocalDateTime.now());
                job.setLastVerified(LocalDateTime.now());

                // Run AI analysis & enrichment
                aiJobService.analyzeAndEnrichJob(job);

                job = jobRepository.save(job);

                // Compute Trust Score & Evidence
                com.jobproof.dto.VerificationDTO vResult = verificationService.evaluateJobTrustScore(job);
                if (vResult != null && vResult.getReasons() != null && !vResult.getReasons().isEmpty()) {
                    String reasonSummary = String.join(" | ", vResult.getReasons());
                    if (reasonSummary.length() > 3500) {
                        reasonSummary = reasonSummary.substring(0, 3500);
                    }
                    job.setSummary(reasonSummary);
                }
                job.setVerificationStatus(Job.VerificationStatus.NEEDS_REVIEW);
                jobRepository.save(job);

                count++;
            } catch (Exception ex) {
                log.warn("[JobDiscoveryAgent] Skipping candidate '{}': {}", draft.getTitle(), ex.getMessage());
            }
        }
        return count;
    }

    private int stageForCompany(List<JobDTO> candidates, Company company, int limit, String sourceLabel) {
        int count = 0;
        int max = Math.min(candidates.size(), limit);

        for (int i = 0; i < max; i++) {
            JobDTO draft = candidates.get(i);
            String cleanUrl = normalizeUrl(draft.getApplyUrl());
            if (cleanUrl == null || jobRepository.findByApplyUrl(cleanUrl).isPresent()) {
                continue;
            }

            Job job = new Job();
            job.setTitle(draft.getTitle());
            job.setCompany(company);
            job.setLocation(draft.getLocation());
            job.setApplyUrl(cleanUrl);
            job.setSource(draft.getSource() != null ? draft.getSource() : sourceLabel);
            job.setSourceJobId(draft.getSourceJobId());
            job.setEmploymentType(draft.getEmploymentType() != null ? draft.getEmploymentType() : "Full-time");
            job.setDescription("Official opening discovered from " + company.getName() + " careers portal. Direct application endpoint verified.");
            job.setVerificationStatus(Job.VerificationStatus.NEEDS_REVIEW);
            job.setPostedDate(LocalDateTime.now());
            job.setLastVerified(LocalDateTime.now());

            aiJobService.analyzeAndEnrichJob(job);
            job = jobRepository.save(job);

            com.jobproof.dto.VerificationDTO vResult = verificationService.evaluateJobTrustScore(job);
            if (vResult != null && vResult.getReasons() != null && !vResult.getReasons().isEmpty()) {
                job.setSummary(String.join(" | ", vResult.getReasons()));
            }
            job.setVerificationStatus(Job.VerificationStatus.NEEDS_REVIEW);
            jobRepository.save(job);

            count++;
        }
        return count;
    }

    private Company getOrCreateCompany(String name, String website, String careerPage, int defaultScore) {
        return companyRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> companyRepository.save(
                        Company.builder()
                                .name(name)
                                .website(website != null ? website : "https://" + cleanDomain(name))
                                .careerPage(careerPage != null ? careerPage : (website != null ? website + "/careers" : "https://" + cleanDomain(name) + "/careers"))
                                .verificationScore(defaultScore)
                                .build()
                ));
    }

    private String cleanDomain(String companyName) {
        if (companyName == null) return "employer.com";
        return companyName.toLowerCase().replaceAll("[^a-z0-9]", "") + ".com";
    }

    private String normalizeUrl(String url) {
        if (url == null || url.isBlank()) return null;
        String clean = url.trim();
        int queryIdx = clean.indexOf('?');
        // Remove tracking params like utm_source, ref, etc.
        if (queryIdx != -1) {
            String base = clean.substring(0, queryIdx);
            String query = clean.substring(queryIdx + 1);
            String[] params = query.split("&");
            List<String> preserved = new ArrayList<>();
            for (String p : params) {
                if (!p.startsWith("utm_") && !p.startsWith("ref=") && !p.startsWith("source=")) {
                    preserved.add(p);
                }
            }
            if (preserved.isEmpty()) {
                return base;
            } else {
                return base + "?" + String.join("&", preserved);
            }
        }
        return clean;
    }
}
