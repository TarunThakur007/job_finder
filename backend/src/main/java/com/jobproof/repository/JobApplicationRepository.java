package com.jobproof.repository;

import com.jobproof.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findAllByOrderByAppliedAtDesc();

    List<JobApplication> findByStatusOrderByAppliedAtDesc(String status);

    List<JobApplication> findByJobIdOrderByAppliedAtDesc(Long jobId);

    List<JobApplication> findByApplicantEmailOrderByAppliedAtDesc(String applicantEmail);

    long countByStatus(String status);
}
