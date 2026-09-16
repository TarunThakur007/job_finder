package com.jobproof.service;

import com.jobproof.ai.AIJobService;
import com.jobproof.dto.JobDTO;
import com.jobproof.entity.Company;
import com.jobproof.entity.Job;
import com.jobproof.mapper.JobMapper;
import com.jobproof.repository.JobRepository;
import com.jobproof.verification.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyService companyService;
    private final AIJobService aiJobService;
    private final VerificationService verificationService;
    private final JobMapper jobMapper;

    @Transactional(readOnly = true)
    public List<JobDTO> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
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
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobDTO> getVerifiedJobs(Integer minScore) {
        int scoreThreshold = minScore != null ? minScore : 80;
        return jobRepository.findByTrustScoreGreaterThanEqual(scoreThreshold).stream()
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobDTO> searchJobs(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllJobs();
        }
        return jobRepository.searchJobsByKeyword(keyword.trim()).stream()
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobDTO createAndVerifyJob(JobDTO dto) {
        Company company = companyService.getOrCreateCompany(
                dto.getCompany() != null ? dto.getCompany().getName() : "XYZ Technologies",
                dto.getCompany() != null ? dto.getCompany().getWebsite() : null,
                dto.getCompany() != null ? dto.getCompany().getCareerPage() : null,
                dto.getCompany() != null ? dto.getCompany().getIndustry() : "Technology"
        );

        Job job = Job.builder()
                .title(dto.getTitle())
                .company(company)
                .role(dto.getRole())
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
                .build();

        // Enrich with AI
        aiJobService.analyzeAndEnrichJob(job);

        // Save & Calculate Verification Score
        job = jobRepository.save(job);
        verificationService.evaluateJobTrustScore(job);

        return jobMapper.toJobDTO(jobRepository.save(job));
    }
}
