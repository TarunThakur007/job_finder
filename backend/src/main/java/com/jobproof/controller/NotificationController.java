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

    public NotificationController(
            EmployeeNotificationRepository notificationRepository,
            JobFreshnessAuditAgent auditAgent) {
        this.notificationRepository = notificationRepository;
        this.auditAgent = auditAgent;
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
     * Trigger immediate AI freshness audit (check if any listed jobs are closed right now)
     */
    @PostMapping("/run-audit")
    public ResponseEntity<Map<String, Object>> triggerManualAudit() {
        int closedCount = auditAgent.auditActiveJobs();
        long unreadCount = notificationRepository.countByIsReadFalse();

        return ResponseEntity.ok(Map.of(
                "message", "AI Freshness Audit completed",
                "closedJobsDetected", closedCount,
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
