package com.jobproof.service;

import com.jobproof.dto.CompanyDTO;
import com.jobproof.entity.Company;
import com.jobproof.mapper.JobMapper;
import com.jobproof.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final JobMapper jobMapper;

    public CompanyService(CompanyRepository companyRepository, JobMapper jobMapper) {
        this.companyRepository = companyRepository;
        this.jobMapper = jobMapper;
    }

    @Transactional(readOnly = true)
    public List<CompanyDTO> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(jobMapper::toCompanyDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompanyDTO getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        return jobMapper.toCompanyDTO(company);
    }

    @Transactional
    public Company getOrCreateCompany(String name, String website, String careerPage, String industry) {
        return companyRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> companyRepository.save(
                        Company.builder()
                                .name(name)
                                .website(website != null ? website : "https://" + name.toLowerCase().replaceAll("[^a-z0-9]", "") + ".com")
                                .careerPage(careerPage != null ? careerPage : "https://" + name.toLowerCase().replaceAll("[^a-z0-9]", "") + ".com/careers")
                                .industry(industry != null ? industry : "Technology")
                                .verificationScore(90)
                                .build()
                ));
    }
}
