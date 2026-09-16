package com.jobproof.repository;

import com.jobproof.entity.Job;
import com.jobproof.entity.VerificationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationResultRepository extends JpaRepository<VerificationResult, Long> {
    Optional<VerificationResult> findByJob(Job job);
    Optional<VerificationResult> findByJobId(Long jobId);
}
