package com.jobproof.repository;

import com.jobproof.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

// Spring Data JPA repository for Job entity
@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    Optional<Job> findByApplyUrl(String applyUrl);

    Optional<Job> findBySourceAndSourceJobId(String source, String sourceJobId);

    List<Job> findTop10ByOrderByPostedDateDesc();

    List<Job> findByTrustScoreGreaterThanEqual(Integer minScore);

    List<Job> findByVerificationStatus(Job.VerificationStatus status);

    List<Job> findByVerificationStatusIn(Collection<Job.VerificationStatus> statuses);

    @Query("SELECT j FROM Job j LEFT JOIN FETCH j.company WHERE j.verificationStatus != :needsReview ORDER BY j.postedDate DESC")
    List<Job> findAllApprovedJobsWithCompany(@Param("needsReview") Job.VerificationStatus needsReview);

    @Query("SELECT j FROM Job j LEFT JOIN FETCH j.company WHERE j.verificationStatus != :closedStatus AND j.verificationStatus != :needsReview ORDER BY j.postedDate DESC")
    List<Job> findAllActiveWithCompany(@Param("closedStatus") Job.VerificationStatus closedStatus, @Param("needsReview") Job.VerificationStatus needsReview);

    @Query(value = "SELECT j FROM Job j LEFT JOIN FETCH j.company WHERE j.verificationStatus != :needsReview",
           countQuery = "SELECT COUNT(j) FROM Job j WHERE j.verificationStatus != :needsReview")
    Page<Job> findActiveJobsPaged(@Param("needsReview") Job.VerificationStatus needsReview, Pageable pageable);

    @Query("SELECT j FROM Job j LEFT JOIN FETCH j.company WHERE " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.company.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.role) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "j.verificationStatus != :needsReview")
    List<Job> searchJobsByKeyword(@Param("query") String query, @Param("needsReview") Job.VerificationStatus needsReview);

    @Query(value = "SELECT j FROM Job j LEFT JOIN FETCH j.company WHERE " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.company.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.role) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "j.verificationStatus != :needsReview",
           countQuery = "SELECT COUNT(j) FROM Job j WHERE " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.company.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.role) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "j.verificationStatus != :needsReview")
    Page<Job> searchActiveJobsPaged(@Param("query") String query, @Param("needsReview") Job.VerificationStatus needsReview, Pageable pageable);

    long countByRoleIgnoreCase(String role);

    @Query("SELECT COUNT(j) FROM Job j WHERE LOWER(j.company.name) = LOWER(:companyName) AND LOWER(j.role) = LOWER(:role)")
    long countByCompanyAndRole(@Param("companyName") String companyName, @Param("role") String role);
}
