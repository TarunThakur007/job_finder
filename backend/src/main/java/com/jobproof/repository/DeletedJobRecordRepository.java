package com.jobproof.repository;

import com.jobproof.entity.DeletedJobRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeletedJobRecordRepository extends JpaRepository<DeletedJobRecord, Long> {
    boolean existsByApplyUrl(String applyUrl);
    boolean existsByJobKey(String jobKey);
    Optional<DeletedJobRecord> findByApplyUrl(String applyUrl);
    Optional<DeletedJobRecord> findByJobKey(String jobKey);
}
