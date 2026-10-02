package com.jobproof.repository;

import com.jobproof.entity.EmployeeNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeNotificationRepository extends JpaRepository<EmployeeNotification, Long> {

    List<EmployeeNotification> findByOrderByCreatedAtDesc();

    List<EmployeeNotification> findByIsReadFalseOrderByCreatedAtDesc();

    long countByIsReadFalse();

    boolean existsByJobIdAndType(Long jobId, String type);
}
