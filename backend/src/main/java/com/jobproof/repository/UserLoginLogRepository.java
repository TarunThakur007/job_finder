package com.jobproof.repository;

import com.jobproof.entity.UserLoginLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserLoginLogRepository extends JpaRepository<UserLoginLog, Long> {
    List<UserLoginLog> findByUserIdOrderByLoggedInAtDesc(Long userId);
    List<UserLoginLog> findByEmailOrderByLoggedInAtDesc(String email);
    List<UserLoginLog> findTop20ByOrderByLoggedInAtDesc();
}
