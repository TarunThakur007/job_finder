package com.jobproof.mapper;

import com.jobproof.dto.CompanyDTO;
import com.jobproof.dto.JobDTO;
import com.jobproof.entity.Company;
import com.jobproof.entity.Job;
import com.jobproof.entity.JobSkill;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JobMapper {

    public CompanyDTO toCompanyDTO(Company company) {
        if (company == null) return null;
        return CompanyDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .website(company.getWebsite())
                .careerPage(company.getCareerPage())
                .industry(company.getIndustry())
                .description(company.getDescription())
                .verificationScore(company.getVerificationScore())
                .build();
    }

    public JobDTO toJobDTO(Job job) {
        if (job == null) return null;

        List<String> skillList = job.getSkills() != null ?
                job.getSkills().stream().map(JobSkill::getSkill).collect(Collectors.toList()) :
                Collections.emptyList();

        List<String> selectionProcessList = job.getSelectionProcess() != null ?
                Arrays.stream(job.getSelectionProcess().split(" -> "))
                      .map(String::trim)
                      .filter(s -> !s.isEmpty())
                      .collect(Collectors.toList()) :
                Collections.emptyList();

        String salaryStr;
        if (job.getSalaryMin() != null && job.getSalaryMax() != null) {
            salaryStr = String.format("₹%.0f - ₹%.0f / yr", job.getSalaryMin(), job.getSalaryMax());
        } else if (job.getSalaryMin() != null) {
            salaryStr = String.format("From ₹%.0f / yr", job.getSalaryMin());
        } else {
            salaryStr = "Salary not disclosed";
        }

        if (Boolean.TRUE.equals(job.getIsSalaryEstimated()) && !"Salary not disclosed".equals(salaryStr)) {
            salaryStr += " (Estimated)";
        }

        List<String> evidenceList;
        if (job.getSummary() != null && job.getSummary().contains(" | ")) {
            evidenceList = Arrays.stream(job.getSummary().split(" \\| "))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        } else if (job.getSummary() != null && job.getSummary().contains("; ")) {
            evidenceList = Arrays.stream(job.getSummary().split("; "))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        } else {
            evidenceList = Arrays.asList(
                    "Official Employer Site",
                    "Direct Application",
                    "Active Listing"
            );
        }

        return JobDTO.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(toCompanyDTO(job.getCompany()))
                .role(job.getRole())
                .experienceLevel(job.getExperienceLevel())
                .location(job.getLocation())
                .employmentType(job.getEmploymentType())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .salaryCurrency(job.getSalaryCurrency())
                .isSalaryEstimated(job.getIsSalaryEstimated())
                .salaryDisplay(salaryStr)
                .description(job.getDescription())
                .summary(job.getSummary())
                .selectionProcess(selectionProcessList)
                .applyUrl(job.getApplyUrl())
                .source(job.getSource())
                .sourceJobId(job.getSourceJobId())
                .trustScore(job.getTrustScore())
                .verificationStatus(job.getVerificationStatus() != null ? job.getVerificationStatus().name() : "TRUSTED")
                .postedDate(job.getPostedDate())
                .lastVerified(job.getLastVerified())
                .skills(skillList)
                .evidence(evidenceList)
                .build();
    }
}
