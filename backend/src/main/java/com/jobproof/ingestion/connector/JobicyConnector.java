package com.jobproof.ingestion.connector;

import com.fasterxml.jackson.databind.JsonNode;
import com.jobproof.dto.CompanyDTO;
import com.jobproof.dto.JobDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class JobicyConnector {

    private static final Logger log = LoggerFactory.getLogger(JobicyConnector.class);
    private final RestTemplate restTemplate;

    public JobicyConnector() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(12000);
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * Ingest vacancies from Jobicy Remote API (Free tier, official REST API).
     * Endpoint: https://jobicy.com/api/v2/remote-jobs?count=25&industry=engineering
     */
    public List<JobDTO> fetchJobs(int limit) {
        int count = limit > 0 ? limit : 20;
        String url = "https://jobicy.com/api/v2/remote-jobs?count=" + count + "&industry=engineering";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "JobProof-Agent/1.0 (Direct Job Aggregator)");
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, request, JsonNode.class);
            JsonNode root = response.getBody();
            if (root == null || !root.has("jobs") || !root.path("jobs").isArray()) {
                return Collections.emptyList();
            }

            JsonNode jobsArray = root.path("jobs");
            List<JobDTO> result = new ArrayList<>();

            for (JsonNode item : jobsArray) {
                String title = item.path("jobTitle").asText();
                String companyName = item.path("companyName").asText();
                String applyUrl = item.path("url").asText();
                String location = item.path("jobGeo").asText("Remote");
                String description = item.path("jobDescription").asText();
                if (description == null || description.isBlank()) {
                    description = item.path("jobExcerpt").asText();
                }
                String id = item.path("id").asText();

                Double salaryMin = item.hasNonNull("salaryMin") ? item.path("salaryMin").asDouble() : null;
                Double salaryMax = item.hasNonNull("salaryMax") ? item.path("salaryMax").asDouble() : null;
                String salaryCurrency = item.hasNonNull("salaryCurrency") ? item.path("salaryCurrency").asText("USD") : "USD";

                String employmentType = "Full-time";
                if (item.has("jobType") && item.path("jobType").isArray() && item.path("jobType").size() > 0) {
                    employmentType = item.path("jobType").get(0).asText("Full-time");
                }

                if (title == null || title.isBlank() || applyUrl == null || applyUrl.isBlank()) {
                    continue;
                }

                CompanyDTO company = CompanyDTO.builder()
                        .name(companyName != null && !companyName.isBlank() ? companyName : "Engineering Employer")
                        .website("https://www.google.com/search?q=" + (companyName != null ? companyName : ""))
                        .build();

                result.add(JobDTO.builder()
                        .title(title)
                        .company(company)
                        .location(location != null && !location.isBlank() ? location : "Remote")
                        .applyUrl(applyUrl)
                        .description(description)
                        .employmentType(employmentType)
                        .salaryMin(salaryMin)
                        .salaryMax(salaryMax)
                        .salaryCurrency(salaryCurrency)
                        .source("Jobicy API")
                        .sourceJobId("JOBICY-" + id)
                        .trustScore(90)
                        .build());
            }

            log.info("[Jobicy] Successfully retrieved {} engineering jobs", result.size());
            return result;
        } catch (Exception e) {
            log.warn("[Jobicy] Error fetching jobs: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
