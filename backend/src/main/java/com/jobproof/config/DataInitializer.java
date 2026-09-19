package com.jobproof.config;

import com.jobproof.entity.Company;
import com.jobproof.entity.Job;
import com.jobproof.ingestion.JobDiscoveryAgent;
import com.jobproof.repository.CompanyRepository;
import com.jobproof.repository.JobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final JobDiscoveryAgent jobDiscoveryAgent;

    public DataInitializer(JobRepository jobRepository,
                           CompanyRepository companyRepository,
                           JobDiscoveryAgent jobDiscoveryAgent) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.jobDiscoveryAgent = jobDiscoveryAgent;
    }

    @Override
    public void run(String... args) {
        log.info("[JobProof DataInitializer] Purging legacy dummy/mock companies...");

        List<String> dummyNames = List.of("xyz technologies", "nexus innovations", "datapulse systems");
        List<Job> allJobs = jobRepository.findAll();
        for (Job job : allJobs) {
            String cName = job.getCompany() != null ? job.getCompany().getName().toLowerCase() : "";
            if (dummyNames.contains(cName) || (job.getSource() != null && job.getSource().contains("Adzuna"))) {
                jobRepository.delete(job);
            }
        }

        List<Company> allCompanies = companyRepository.findAll();
        for (Company comp : allCompanies) {
            if (dummyNames.contains(comp.getName().toLowerCase())) {
                try {
                    companyRepository.delete(comp);
                } catch (Exception ignored) {}
            }
        }

        log.info("[JobProof DataInitializer] Legacy dummy data cleaned. Ensuring real ATS company vacancies are discovered...");
        if (jobRepository.count() == 0) {
            jobDiscoveryAgent.runDiscovery();
        }
    }
}
