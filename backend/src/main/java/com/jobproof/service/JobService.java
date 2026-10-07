package com.jobproof.service;

import com.jobproof.ai.AIJobService;
import com.jobproof.dto.JobDTO;
import com.jobproof.entity.Company;
import com.jobproof.entity.Job;
import com.jobproof.mapper.JobMapper;
import com.jobproof.repository.JobRepository;
import com.jobproof.verification.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobproof.entity.DeletedJobRecord;
import com.jobproof.repository.DeletedJobRecordRepository;
import com.jobproof.repository.EmployeeNotificationRepository;
import com.jobproof.repository.JobApplicationRepository;
import com.jobproof.repository.SavedJobRepository;
import com.jobproof.repository.VerificationResultRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyService companyService;
    private final AIJobService aiJobService;
    private final VerificationService verificationService;
    private final JobMapper jobMapper;
    private final DeletedJobRecordRepository deletedJobRecordRepository;
    private final SavedJobRepository savedJobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final VerificationResultRepository verificationResultRepository;
    private final EmployeeNotificationRepository notificationRepository;

    public JobService(JobRepository jobRepository, CompanyService companyService,
                      AIJobService aiJobService, VerificationService verificationService,
                      JobMapper jobMapper,
                      DeletedJobRecordRepository deletedJobRecordRepository,
                      SavedJobRepository savedJobRepository,
                      JobApplicationRepository jobApplicationRepository,
                      VerificationResultRepository verificationResultRepository,
                      EmployeeNotificationRepository notificationRepository) {
        this.jobRepository = jobRepository;
        this.companyService = companyService;
        this.aiJobService = aiJobService;
        this.verificationService = verificationService;
        this.jobMapper = jobMapper;
        this.deletedJobRecordRepository = deletedJobRecordRepository;
        this.savedJobRepository = savedJobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.verificationResultRepository = verificationResultRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "jobs", key = "'all'")
    public List<JobDTO> getAllJobs() {
        return jobRepository.findAllApprovedJobsWithCompany(Job.VerificationStatus.NEEDS_REVIEW).stream()
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "jobs", key = "'page_' + #page + '_' + #size + '_' + (#query != null ? #query : '')")
    public Page<JobDTO> getPaginatedJobs(int page, int size, String query) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by(Sort.Direction.DESC, "postedDate"));
        if (query != null && !query.isBlank()) {
            return jobRepository.searchActiveJobsPaged(query.trim(), Job.VerificationStatus.NEEDS_REVIEW, pageable)
                    .map(jobMapper::toJobDTO);
        }
        return jobRepository.findActiveJobsPaged(Job.VerificationStatus.NEEDS_REVIEW, pageable)
                .map(jobMapper::toJobDTO);
    }

    @Transactional(readOnly = true)
    public JobDTO getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job vacancy not found with id: " + id));
        return jobMapper.toJobDTO(job);
    }

    @Transactional(readOnly = true)
    public List<JobDTO> getLatestJobs() {
        return jobRepository.findTop10ByOrderByPostedDateDesc().stream()
                .filter(job -> job.getVerificationStatus() != Job.VerificationStatus.CLOSED && job.getVerificationStatus() != Job.VerificationStatus.NEEDS_REVIEW)
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobDTO> getVerifiedJobs(Integer minScore) {
        int scoreThreshold = minScore != null ? minScore : 80;
        return jobRepository.findByTrustScoreGreaterThanEqual(scoreThreshold).stream()
                .filter(job -> job.getVerificationStatus() != Job.VerificationStatus.CLOSED && job.getVerificationStatus() != Job.VerificationStatus.NEEDS_REVIEW)
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobDTO> searchJobs(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllJobs();
        }
        // Search jobs matching keyword across title, company, role, or location
        return jobRepository.searchJobsByKeyword(keyword.trim(), Job.VerificationStatus.NEEDS_REVIEW).stream()
                .filter(job -> job.getVerificationStatus() != Job.VerificationStatus.CLOSED)
                .map(job -> jobMapper.toJobDTO(job))
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobDTO createAndVerifyJob(JobDTO dto) {
        Company company = companyService.getOrCreateCompany(
                dto.getCompany() != null ? dto.getCompany().getName() : "XYZ Technologies",
                dto.getCompany() != null ? dto.getCompany().getWebsite() : null,
                dto.getCompany() != null ? dto.getCompany().getCareerPage() : null,
                dto.getCompany() != null ? dto.getCompany().getIndustry() : "Technology"
        );

        String field = dto.getRole() != null && !dto.getRole().isBlank()
                ? dto.getRole()
                : aiJobService.categorizeRole(dto.getTitle());

        Integer vacancies = dto.getVacanciesCount();
        if (vacancies == null || vacancies <= 0) {
            long existingCount = jobRepository.countByRoleIgnoreCase(field);
            vacancies = existingCount > 0 ? (int) (existingCount + 1) : aiJobService.estimateFieldMarketOpenings(field, dto.getTitle());
        }

        Job job = Job.builder()
                .title(dto.getTitle())
                .company(company)
                .role(field)
                .experienceLevel(dto.getExperienceLevel())
                .location(dto.getLocation())
                .employmentType(dto.getEmploymentType())
                .salaryMin(dto.getSalaryMin())
                .salaryMax(dto.getSalaryMax())
                .salaryCurrency(dto.getSalaryCurrency() != null ? dto.getSalaryCurrency() : "INR")
                .isSalaryEstimated(dto.getIsSalaryEstimated())
                .description(dto.getDescription())
                .summary(dto.getSummary())
                .applyUrl(dto.getApplyUrl())
                .source(dto.getSource() != null ? dto.getSource() : "Direct Employer")
                .sourceJobId(dto.getSourceJobId())
                .vacanciesCount(vacancies)
                .build();

        // Enrich with AI
        aiJobService.analyzeAndEnrichJob(job);

        // Save & Calculate Verification Score
        job = jobRepository.save(job);
        verificationService.evaluateJobTrustScore(job);

        return jobMapper.toJobDTO(jobRepository.save(job));
    }

    /**
     * Recalculates and updates the authentic number of active openings in each field across all jobs in the database
     */
    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public int recalculateAllFieldVacancies() {
        List<Job> allJobs = jobRepository.findAll();
        if (allJobs.isEmpty()) return 0;

        java.util.Map<String, List<Job>> byRole = allJobs.stream()
                .collect(Collectors.groupingBy(j -> {
                    if (j.getRole() != null && !j.getRole().isBlank()) {
                        return j.getRole();
                    }
                    return aiJobService.categorizeRole(j.getTitle());
                }));

        java.util.Map<String, Long> companyRoleCounts = allJobs.stream()
                .collect(Collectors.groupingBy(j -> {
                    String cName = j.getCompany() != null ? j.getCompany().getName().toLowerCase() : "";
                    String r = j.getRole() != null && !j.getRole().isBlank() ? j.getRole() : aiJobService.categorizeRole(j.getTitle());
                    return cName + "::" + r;
                }, Collectors.counting()));

        int updatedCount = 0;
        for (Job job : allJobs) {
            String role = job.getRole() != null && !job.getRole().isBlank()
                    ? job.getRole()
                    : aiJobService.categorizeRole(job.getTitle());
            job.setRole(role);

            int explicit = aiJobService.extractExplicitHeadcount(job.getTitle(), job.getDescription());
            int newVacancies;
            if (explicit > 0) {
                newVacancies = explicit;
            } else {
                String cName = job.getCompany() != null ? job.getCompany().getName().toLowerCase() : "";
                long countAtComp = companyRoleCounts.getOrDefault(cName + "::" + role, 1L);
                int totalInField = byRole.getOrDefault(role, java.util.Collections.emptyList()).size();

                if (countAtComp > 2) {
                    newVacancies = (int) countAtComp;
                } else if (totalInField > 1) {
                    newVacancies = totalInField;
                } else {
                    newVacancies = aiJobService.estimateFieldMarketOpenings(role, job.getTitle());
                }
            }
            job.setVacanciesCount(newVacancies);
            jobRepository.save(job);
            updatedCount++;
        }
        evictJobCache();
        return updatedCount;
    }

    @CacheEvict(value = "jobs", allEntries = true)
    public void evictJobCache() {
        // Evicts Spring cache so newly approved jobs or closed jobs immediately reflect
    }

    @CacheEvict(value = "jobs", allEntries = true)
    @Transactional
    public JobDTO removeOrCloseJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job vacancy not found with id: " + id));
        job.setVerificationStatus(Job.VerificationStatus.CLOSED);
        job.setLastVerified(java.time.LocalDateTime.now());
        job.setSummary("Closed: Hiring stopped by employer on " + java.time.LocalDateTime.now());
        job = jobRepository.save(job);

        // Automatically delete notifications associated with this job when removed/closed by employee
        try {
            notificationRepository.deleteByJobId(id);
        } catch (Exception ignored) {}

        return jobMapper.toJobDTO(job);
    }

    public List<JobDTO> getClosedJobs() {
        // Return closed jobs, deduplicated by jobKey
        Map<String, Job> uniqueClosed = new java.util.LinkedHashMap<>();
        for (Job job : jobRepository.findAll()) {
            if (job.getVerificationStatus() == Job.VerificationStatus.CLOSED) {
                String c = job.getCompany() != null ? job.getCompany().getName() : "";
                String key = generateJobKey(job.getTitle(), c);
                uniqueClosed.putIfAbsent(key, job);
            }
        }
        return uniqueClosed.values().stream()
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
    }

    @CacheEvict(value = "jobs", allEntries = true)
    @Transactional
    public int removeAllClosedJobs() {
        List<Job> closedJobs = jobRepository.findAll().stream()
                .filter(j -> j.getVerificationStatus() == Job.VerificationStatus.CLOSED)
                .collect(Collectors.toList());
        int count = closedJobs.size();
        for (Job job : closedJobs) {
            deleteJobPermanently(job.getId());
        }
        return count;
    }

    @CacheEvict(value = "jobs", allEntries = true)
    @Transactional
    public JobDTO reopenJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job vacancy not found with id: " + id));
        job.setVerificationStatus(Job.VerificationStatus.HIGHLY_TRUSTED);
        job.setLastVerified(java.time.LocalDateTime.now());
        job.setSummary("Reopened by employer on " + java.time.LocalDateTime.now());
        job = jobRepository.save(job);
        return jobMapper.toJobDTO(job);
    }

    @CacheEvict(value = "jobs", allEntries = true)
    @Transactional
    public void deleteJobPermanently(Long id) {
        Job job = jobRepository.findById(id).orElse(null);
        if (job == null) return;

        // 1. Record in persistent blacklist so crawler / discovery never brings this post back again
        recordDeletedJob(job);

        // 2. Cascade delete dependent relationships to prevent foreign key errors
        try {
            jobApplicationRepository.deleteByJob(job);
        } catch (Exception ignored) {}

        try {
            savedJobRepository.deleteByJob(job);
        } catch (Exception ignored) {}

        try {
            verificationResultRepository.deleteByJob(job);
        } catch (Exception ignored) {}

        try {
            notificationRepository.deleteByJobId(id);
        } catch (Exception ignored) {}

        // 3. Delete the job record
        jobRepository.delete(job);
        evictJobCache();
    }

    private void recordDeletedJob(Job job) {
        if (job == null) return;
        String applyUrl = job.getApplyUrl();
        String cName = job.getCompany() != null ? job.getCompany().getName() : "";
        String title = job.getTitle() != null ? job.getTitle() : "";
        String jobKey = generateJobKey(title, cName);

        if (applyUrl != null && !applyUrl.isBlank()) {
            if (!deletedJobRecordRepository.existsByApplyUrl(applyUrl)) {
                deletedJobRecordRepository.save(new DeletedJobRecord(applyUrl, jobKey, title, cName));
            }
        } else if (!jobKey.isBlank()) {
            if (!deletedJobRecordRepository.existsByJobKey(jobKey)) {
                deletedJobRecordRepository.save(new DeletedJobRecord(null, jobKey, title, cName));
            }
        }
    }

    public static String generateJobKey(String title, String companyName) {
        String t = title != null ? title.trim().toLowerCase().replaceAll("\\s+", " ") : "";
        String c = companyName != null ? companyName.trim().toLowerCase().replaceAll("\\s+", " ") : "";
        return t + "::" + c;
    }

    /**
     * Purges duplicate job records that share identical title and company, keeping the single best verified record.
     */
    @CacheEvict(value = "jobs", allEntries = true)
    @Transactional
    public int purgeDuplicateJobs() {
        List<Job> allJobs = jobRepository.findAll();
        Map<String, List<Job>> grouped = allJobs.stream()
                .filter(j -> j.getTitle() != null && j.getCompany() != null)
                .collect(Collectors.groupingBy(j -> generateJobKey(j.getTitle(), j.getCompany().getName())));

        int purgedCount = 0;
        for (Map.Entry<String, List<Job>> entry : grouped.entrySet()) {
            List<Job> duplicates = entry.getValue();
            if (duplicates.size() > 1) {
                // Sort to keep the highest quality listing:
                // 1. HIGHLY_TRUSTED / TRUSTED over CLOSED over NEEDS_REVIEW
                // 2. Highest trust score
                // 3. Highest id (most recent)
                duplicates.sort((a, b) -> {
                    int statusWeightA = a.getVerificationStatus() == Job.VerificationStatus.HIGHLY_TRUSTED ? 3 :
                                        a.getVerificationStatus() == Job.VerificationStatus.TRUSTED ? 2 :
                                        a.getVerificationStatus() == Job.VerificationStatus.CLOSED ? 1 : 0;
                    int statusWeightB = b.getVerificationStatus() == Job.VerificationStatus.HIGHLY_TRUSTED ? 3 :
                                        b.getVerificationStatus() == Job.VerificationStatus.TRUSTED ? 2 :
                                        b.getVerificationStatus() == Job.VerificationStatus.CLOSED ? 1 : 0;
                    if (statusWeightA != statusWeightB) return Integer.compare(statusWeightB, statusWeightA);

                    int scoreA = a.getTrustScore() != null ? a.getTrustScore() : 0;
                    int scoreB = b.getTrustScore() != null ? b.getTrustScore() : 0;
                    if (scoreA != scoreB) return Integer.compare(scoreB, scoreA);

                    return Long.compare(b.getId() != null ? b.getId() : 0, a.getId() != null ? a.getId() : 0);
                });

                // Keep duplicates.get(0), remove the remaining duplicate posts
                for (int i = 1; i < duplicates.size(); i++) {
                    Job duplicate = duplicates.get(i);
                    deleteJobPermanently(duplicate.getId());
                    purgedCount++;
                }
            }
        }
        return purgedCount;
    }
}
