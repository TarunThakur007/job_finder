package com.jobproof.scheduler;

import com.jobproof.ingestion.JobDiscoveryAgent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class JobDiscoveryScheduler {

    private static final Logger log = LoggerFactory.getLogger(JobDiscoveryScheduler.class);

    private final JobDiscoveryAgent discoveryAgent;

    public JobDiscoveryScheduler(JobDiscoveryAgent discoveryAgent) {
        this.discoveryAgent = discoveryAgent;
    }

    /**
     * Periodically discovers vacancies from target companies (every 6 hours).
     * Automatically stages them for Admin review.
     */
    @Scheduled(cron = "${jobproof.scheduler.discovery-cron:0 0 */6 * * *}")
    public void executeScheduledDiscovery() {
        log.info("[Scheduler] Starting scheduled ATS vacancy discovery...");
        try {
            int newVacancies = discoveryAgent.runDiscovery();
            log.info("[Scheduler] Discovery cycle completed. {} new vacancies added to Admin staging queue.", newVacancies);
        } catch (Exception e) {
            log.error("[Scheduler] Error during scheduled discovery: {}", e.getMessage());
        }
    }
}
