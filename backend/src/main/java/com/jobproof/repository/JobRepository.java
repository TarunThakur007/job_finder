package com.jobproof.repository;

import com.jobproof.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    Optional<Job> findByApplyUrl(String applyUrl);

    Optional<Job> findBySourceAndSourceJobId(String source, String sourceJobId);

    List<Job> findTop10ByOrderByPostedDateDesc();

    List<Job> findByTrustScoreGreaterThanEqual(Integer minScore);

    List<Job> findByVerificationStatus(Job.VerificationStatus status);

    @Query("SELECT j FROM Job j WHERE " +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.company.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.role) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Job> searchJobsByKeyword(@Param("query") String query);
}
