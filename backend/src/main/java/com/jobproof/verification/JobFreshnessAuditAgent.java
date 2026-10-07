package com.jobproof.verification;

import com.jobproof.entity.EmployeeNotification;
import com.jobproof.entity.Job;
import com.jobproof.repository.EmployeeNotificationRepository;
import com.jobproof.repository.JobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobFreshnessAuditAgent {

    private static final Logger log = LoggerFactory.getLogger(JobFreshnessAuditAgent.class);

    private final JobRepository jobRepository;
    private final EmployeeNotificationRepository notificationRepository;
    private final RestTemplate restTemplate;
    private final CacheManager cacheManager;

    public JobFreshnessAuditAgent(
            JobRepository jobRepository,
            EmployeeNotificationRepository notificationRepository,
            CacheManager cacheManager) {
        this.jobRepository = jobRepository;
        this.notificationRepository = notificationRepository;
        this.cacheManager = cacheManager;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(4000);
        factory.setReadTimeout(5000);
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * Hourly AI Freshness Audit:
     * Iterates through all live listed jobs and verifies whether each role is still open.
     * When an employer closes or removes a listing, the AI does NOT auto-close the job;
     * instead, it gives an update/notification to the employee so the job can be closed
     * strictly with the permission of the employee.
     *
     * @return count of closed jobs detected and flagged for employee permission
     */
    public int auditActiveJobs() {
        List<Job> activeJobs = jobRepository.findAllActiveWithCompany(Job.VerificationStatus.CLOSED, Job.VerificationStatus.NEEDS_REVIEW);

        log.info("[JobFreshnessAuditAgent] Starting hourly audit across {} live job openings...", activeJobs.size());
        int flaggedCount = 0;

        for (Job job : activeJobs) {
            String url = job.getApplyUrl();
            if (url == null || url.isBlank()) {
                continue;
            }

            ClosureCheckResult result = checkIsJobClosed(url, job.getTitle(), job.getCompany() != null ? job.getCompany().getName() : "");
            if (result.isClosed()) {
                handleJobClosureAdvisory(job, result.reason());
                flaggedCount++;
            } else {
                job.setLastVerified(LocalDateTime.now());
                jobRepository.save(job);
            }
        }

        if (flaggedCount > 0) {
            EmployeeNotification summaryNotification = EmployeeNotification.builder()
                    .jobId(0L)
                    .jobTitle("AI Audit Update: " + flaggedCount + " Closure Permission Request(s)")
                    .companyName("AI Freshness Sentinel")
                    .applyUrl("")
                    .type("HOURLY_AUDIT_SUMMARY")
                    .reason("Automated Scan Advisory")
                    .message(String.format("Hourly AI scan complete: %d listed role(s) appear closed on employer sites. Updates have been dispatched to the employee queue. Jobs remain listed until an employee grants permission to close.", flaggedCount))
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(summaryNotification);
        }

        log.info("[JobFreshnessAuditAgent] Hourly audit completed. {} potential closures detected and dispatched to employee queue for closure permission.", flaggedCount);
        return flaggedCount;
    }

    /**
     * AI generates an advisory notification to the employee.
     * POLICY MANDATE: AI does NOT unilaterally close jobs.
     * Job closing can ONLY be executed with the explicit permission of an employee.
     */
    private void handleJobClosureAdvisory(Job job, String reason) {
        log.warn("[JobFreshnessAuditAgent] Job #{} '{}' at '{}' detected as closed by employer ({}) - Seeking Employee Permission to close",
                job.getId(), job.getTitle(), job.getCompany() != null ? job.getCompany().getName() : "", reason);

        // 1. Tag job with AI freshness advisory note (job remains listed until employee approves closure)
        job.setLastVerified(LocalDateTime.now());
        job.setSummary("AI Freshness Sentinel Advisory: Employer appears to have closed hiring (" + reason + ") on " + LocalDateTime.now() + ". Employee permission required to close.");
        jobRepository.save(job);

        // 2. Dispatch notification to employee (avoid duplicate alerts for the same job)
        boolean alreadyNotified = notificationRepository.existsByJobIdAndType(job.getId(), "JOB_CLOSURE_RECOMMENDED");
        if (!alreadyNotified) {
            String companyName = job.getCompany() != null ? job.getCompany().getName() : "Employer";
            String alertMessage = String.format(
                    "⚠️ AI Closure Notice: Employer appears to have stopped hiring for '%s' at '%s' (%s). As per policy, this position remains active until an employee grants permission to close.",
                    job.getTitle(), companyName, reason
            );

            EmployeeNotification notification = EmployeeNotification.builder()
                    .jobId(job.getId())
                    .jobTitle(job.getTitle())
                    .companyName(companyName)
                    .applyUrl(job.getApplyUrl())
                    .type("JOB_CLOSURE_RECOMMENDED")
                    .reason(reason)
                    .message(alertMessage)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);
            log.info("[JobFreshnessAuditAgent] Created Employee Notification for closure permission request on job #{}", job.getId());
        }
    }

    public record ClosureCheckResult(boolean isClosed, String reason) {}

    private ClosureCheckResult checkIsJobClosed(String applyUrl, String jobTitle, String companyName) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (JobProof Freshness Agent)");
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(applyUrl, HttpMethod.GET, request, String.class);
            int statusCode = response.getStatusCode().value();

            if (statusCode == 404 || statusCode == 410) {
                return new ClosureCheckResult(true, "HTTP " + statusCode + " Not Found - Endpoint Removed");
            }

            String body = response.getBody();
            if (body != null) {
                String bodyLower = body.toLowerCase();

                // Common ATS closure phrases (Greenhouse, Lever, Ashby, Workday, etc.)
                if (bodyLower.contains("this job has expired") ||
                    bodyLower.contains("this position has been closed") ||
                    bodyLower.contains("no longer accepting applications") ||
                    bodyLower.contains("this posting has been closed") ||
                    bodyLower.contains("job is no longer available") ||
                    bodyLower.contains("this role is no longer open") ||
                    bodyLower.contains("this vacancy has been filled") ||
                    bodyLower.contains("this listing is no longer active") ||
                    bodyLower.contains("application period has ended")) {
                    return new ClosureCheckResult(true, "Career Portal Message: Listing closed or no longer accepting applications");
                }
            }

            return new ClosureCheckResult(false, "Active 200 OK");
        } catch (HttpClientErrorException.NotFound | HttpClientErrorException.Gone e) {
            return new ClosureCheckResult(true, "HTTP 404/410 Page Not Found");
        } catch (HttpClientErrorException.Forbidden e) {
            // Some career pages return 403 when posting expires
            return new ClosureCheckResult(false, "Protected Endpoint (HTTP 403)");
        } catch (Exception e) {
            // Transient network timeouts should not immediately mark job as closed
            return new ClosureCheckResult(false, "Connection check: " + e.getMessage());
        }
    }
}
