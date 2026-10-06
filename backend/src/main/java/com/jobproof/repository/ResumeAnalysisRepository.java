package com.jobproof.repository;

import com.jobproof.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    List<ResumeAnalysis> findAllByOrderByCreatedAtDesc();
    Optional<ResumeAnalysis> findByResumeId(Long resumeId);
}
