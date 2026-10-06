package com.jobproof.repository;

import com.jobproof.entity.UserResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserResumeRepository extends JpaRepository<UserResume, Long> {
    List<UserResume> findAllByOrderByUploadedAtDesc();
    List<UserResume> findByUserIdOrderByUploadedAtDesc(Long userId);
    List<UserResume> findByCandidateEmailIgnoreCaseOrderByUploadedAtDesc(String candidateEmail);
}
