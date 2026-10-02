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

    public JobFreshnessAuditAgent(
            JobRepository jobRepository,
            EmployeeNotificationRepository notificationRepository) {
        this.jobRepository = jobRepository;
        this.notificationRepository = notificationRepository;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(4000);
        factory.setReadTimeout(5000);
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * Hourly AI Freshness Audit:
     * Iterates through all live listed jobs and verifies whether each role is still open.
     * If an employer closes or removes the listing, unpublishes the job and notifies an employee.
     *
     * @return count of closed jobs detected & notified
     */
    public int auditActiveJobs() {
        List<Job> activeJobs = jobRepository.findByVerificationStatusIn(
        List.of(Job.VerificationStatus.HIGHLY_TRUSTED, Job.VerificationStatus.TRUSTED)
        );


        log.info("[JobFreshnessAuditAgent] Starting hourly audit across {} live job openings...", activeJobs.size());
        int closedCount = 0;

        for (Job job : activeJobs) {
            String url = job.getApplyUrl();
            if (url == null || url.isBlank()) {
                continue;
            }

            ClosureCheckResult result = checkIsJobClosed(url, job.getTitle(), job.getCompany() != null ? job.getCompany().getName() : "");
            if (result.isClosed()) {
                handleJobClosure(job, result.reason());
                closedCount++;
            } else {
                job.setLastVerified(LocalDateTime.now());
                jobRepository.save(job);
            }
        }

        log.info("[JobFreshnessAuditAgent] Hourly audit completed. {} closed positions detected and notified to employees.", closedCount);
        return closedCount;
    }

    private void handleJobClosure(Job job, String reason) {
        log.warn("[JobFreshnessAuditAgent] Job #{} '{}' at '{}' is CLOSED ({})",
                job.getId(), job.getTitle(), job.getCompany() != null ? job.getCompany().getName() : "", reason);

        // 1. Immediately remove from live search by setting status to CLOSED
        job.setVerificationStatus(Job.VerificationStatus.CLOSED);
        job.setLastVerified(LocalDateTime.now());
        job.setSummary("AI Freshness Agent: Employer closed this role (" + reason + ") on " + LocalDateTime.now());
        jobRepository.save(job);

        // 2. Notify an employee (avoid creating duplicate unread notifications for the same job)
        boolean alreadyNotified = notificationRepository.existsByJobIdAndType(job.getId(), "JOB_CLOSED_ALERT");
        if (!alreadyNotified) {
            String companyName = job.getCompany() != null ? job.getCompany().getName() : "Employer";
            String alertMessage = String.format(
                    "The listed vacancy for '%s' at %s is no longer open. The official career endpoint indicates the position has been closed or removed (%s). JobProof has unlisted this role from the public portal.",
                    job.getTitle(), companyName, reason
            );

            EmployeeNotification notification = EmployeeNotification.builder()
                    .jobId(job.getId())
                    .jobTitle(job.getTitle())
                    .companyName(companyName)
                    .applyUrl(job.getApplyUrl())
                    .type("JOB_CLOSED_ALERT")
                    .reason(reason)
                    .message(alertMessage)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);
            log.info("[JobFreshnessAuditAgent] Created Employee Notification for closed job #{}", job.getId());
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
