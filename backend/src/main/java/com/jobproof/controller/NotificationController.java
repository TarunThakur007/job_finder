package com.jobproof.controller;

import com.jobproof.entity.EmployeeNotification;
import com.jobproof.repository.EmployeeNotificationRepository;
import com.jobproof.verification.JobFreshnessAuditAgent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final EmployeeNotificationRepository notificationRepository;
    private final JobFreshnessAuditAgent auditAgent;
    private final com.jobproof.repository.JobRepository jobRepository;
    private final com.jobproof.service.JobService jobService;

    public NotificationController(
            EmployeeNotificationRepository notificationRepository,
            JobFreshnessAuditAgent auditAgent,
            com.jobproof.repository.JobRepository jobRepository,
            com.jobproof.service.JobService jobService) {
        this.notificationRepository = notificationRepository;
        this.auditAgent = auditAgent;
        this.jobRepository = jobRepository;
        this.jobService = jobService;
    }

    /**
     * Get all employee alerts & notifications (with unread count)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications() {
        List<EmployeeNotification> all = notificationRepository.findByOrderByCreatedAtDesc();
        long unreadCount = notificationRepository.countByIsReadFalse();

        return ResponseEntity.ok(Map.of(
                "unreadCount", unreadCount,
                "totalCount", all.size(),
                "notifications", all
        ));
    }

    /**
     * Mark an alert as read / acknowledged
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<EmployeeNotification> markAsRead(@PathVariable Long id) {
        EmployeeNotification notification = notificationRepository.findById(id).orElseThrow();
        notification.setIsRead(true);
        return ResponseEntity.ok(notificationRepository.save(notification));
    }

    /**
     * Employee grants permission to close a job flagged by AI audit
     */
    @PostMapping("/{id}/confirm-close")
    public ResponseEntity<Map<String, Object>> confirmCloseWithPermission(@PathVariable Long id) {
        EmployeeNotification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + id));

        Long jobId = notification.getJobId();
        if (jobId != null && jobId > 0) {
            jobRepository.findById(jobId).ifPresent(job -> {
                job.setVerificationStatus(com.jobproof.entity.Job.VerificationStatus.CLOSED);
                job.setSummary("Closed with Employee Permission: Confirmed closed by Employee on " + java.time.LocalDateTime.now());
                job.setLastVerified(java.time.LocalDateTime.now());
                jobRepository.save(job);
            });
            jobService.evictJobCache();
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Employee permission granted. Vacancy has been unlisted and moved to Closed status.",
                "jobId", jobId != null ? jobId : 0L
        ));
    }

    /**
     * Trigger immediate AI freshness audit (check if any listed jobs are closed right now)
     */
    @PostMapping("/run-audit")
    public ResponseEntity<Map<String, Object>> triggerManualAudit() {
        int flaggedCount = auditAgent.auditActiveJobs();
        long unreadCount = notificationRepository.countByIsReadFalse();

        return ResponseEntity.ok(Map.of(
                "message", "AI Freshness Audit completed",
                "flaggedCount", flaggedCount,
                "unreadNotifications", unreadCount
        ));
    }

    /**
     * Dismiss / delete notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> dismissNotification(@PathVariable Long id) {
        notificationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
