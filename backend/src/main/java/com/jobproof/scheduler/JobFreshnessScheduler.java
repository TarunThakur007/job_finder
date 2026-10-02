package com.jobproof.scheduler;

import com.jobproof.verification.JobFreshnessAuditAgent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class JobFreshnessScheduler {

    private static final Logger log = LoggerFactory.getLogger(JobFreshnessScheduler.class);

    private final JobFreshnessAuditAgent auditAgent;

    public JobFreshnessScheduler(JobFreshnessAuditAgent auditAgent) {
        this.auditAgent = auditAgent;
    }

    /**
     * Executes every hour at minute 0:
     * Audits all listed vacancies on the website, verifies whether the position is still open,
     * and automatically notifies employees if any role is closed.
     * Cron: "0 0 * * * *" = At second 0, minute 0, every hour
     */
    @Scheduled(cron = "${jobproof.scheduler.hourly-audit-cron:0 0 * * * *}")
    public void executeHourlyFreshnessAudit() {
        log.info("[JobFreshnessScheduler] Hourly scheduled audit starting: Checking for closed vacancies...");
        try {
            int closedDetected = auditAgent.auditActiveJobs();
            log.info("[JobFreshnessScheduler] Hourly audit finished. Detected and handled {} closed jobs.", closedDetected);
        } catch (Exception e) {
            log.error("[JobFreshnessScheduler] Error executing hourly vacancy audit: {}", e.getMessage());
        }
    }
}
