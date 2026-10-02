package com.jobproof.repository;

import com.jobproof.entity.UserExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserExperienceRepository extends JpaRepository<UserExperience, Long> {

    List<UserExperience> findByStatusOrderByCreatedAtDesc(String status);

    List<UserExperience> findByCompanyNameIgnoreCaseAndStatusOrderByCreatedAtDesc(String companyName, String status);

    List<UserExperience> findByExperienceTypeAndStatusOrderByCreatedAtDesc(String experienceType, String status);

    List<UserExperience> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT e FROM UserExperience e WHERE e.status = :status AND " +
           "(LOWER(e.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.jobTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.experienceStory) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.questionsAsked) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<UserExperience> searchExperiences(@Param("query") String query, @Param("status") String status);
}
