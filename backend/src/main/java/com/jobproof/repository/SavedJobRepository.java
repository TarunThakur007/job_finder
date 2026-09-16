package com.jobproof.repository;

import com.jobproof.entity.Job;
import com.jobproof.entity.SavedJob;
import com.jobproof.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUserOrderByCreatedAtDesc(User user);
    Optional<SavedJob> findByUserAndJob(User user, Job job);
    boolean existsByUserAndJob(User user, Job job);
    void deleteByUserAndJob(User user, Job job);
}
