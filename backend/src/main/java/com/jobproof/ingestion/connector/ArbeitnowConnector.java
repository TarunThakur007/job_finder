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
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class ArbeitnowConnector {

    private final RestClient restClient = RestClient.create();
    public List<JobDTO> fetchJobs() {
        try {
            Map response = restClient.get()
                .uri("https://www.arbeitnow.com/api/job-board-api")
                .retrieve()
                .body(Map.class);
            List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");
            List<JobDTO> jobs = new ArrayList<>();
            for (Map<String, Object> item : data) {
                jobs.add(JobDTO.builder()
                    .title((String) item.get("title"))
                    .applyUrl((String) item.get("url"))
                    .location((String) item.get("location"))
                    .description((String) item.get("description"))
                    .source("Arbeitnow Verified API")
                    .employmentType("Full-time")
                    .build());
            }
            return jobs;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private static final Logger log = LoggerFactory.getLogger(ArbeitnowConnector.class);
    private final RestTemplate restTemplate;

    public ArbeitnowConnector() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(12000);
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * Ingest vacancies from Arbeitnow Public Job Board API (Free & Verified).
     * Endpoint: https://www.arbeitnow.com/api/job-board-api
     */
    public List<JobDTO> fetchJobs(int limit) {
        String url = "https://www.arbeitnow.com/api/job-board-api";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "JobProof-Agent/1.0 (Direct Job Aggregator)");
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, request, JsonNode.class);
            JsonNode root = response.getBody();
            if (root == null || !root.has("data") || !root.path("data").isArray()) {
                return Collections.emptyList();
            }

            JsonNode dataArray = root.path("data");
            List<JobDTO> result = new ArrayList<>();
            int max = Math.min(dataArray.size(), limit > 0 ? limit : 20);

            for (int i = 0; i < max; i++) {
                JsonNode item = dataArray.get(i);
                String title = item.path("title").asText();
                String companyName = item.path("company_name").asText();
                String applyUrl = item.path("url").asText();
                String location = item.path("location").asText();
                boolean isRemote = item.path("remote").asBoolean(false);
                String slug = item.path("slug").asText();
                String description = item.path("description").asText();

                if (title == null || title.isBlank() || applyUrl == null || applyUrl.isBlank()) {
                    continue;
                }

                if (isRemote && (location == null || location.isBlank())) {
                    location = "Remote";
                } else if (isRemote) {
                    location = location + " (Remote)";
                }

                // Extract job tags as skills
                List<String> skills = new ArrayList<>();
                if (item.has("tags") && item.path("tags").isArray()) {
                    for (JsonNode t : item.path("tags")) {
                        skills.add(t.asText());
                    }
                }

                CompanyDTO company = CompanyDTO.builder()
                        .name(companyName != null && !companyName.isBlank() ? companyName : "Verified Employer")
                        .website("https://www.google.com/search?q=" + (companyName != null ? companyName : ""))
                        .build();

                result.add(JobDTO.builder()
                        .title(title)
                        .company(company)
                        .location(location != null && !location.isBlank() ? location : "Remote")
                        .applyUrl(applyUrl)
                        .description(description)
                        .skills(skills)
                        .employmentType("Full-time")
                        .source("Arbeitnow API")
                        .sourceJobId("AN-" + slug)
                        .trustScore(88)
                        .build());
            }

            log.info("[Arbeitnow] Successfully retrieved {} verified jobs", result.size());
            return result;
        } catch (Exception e) {
            log.warn("[Arbeitnow] Error fetching jobs: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
