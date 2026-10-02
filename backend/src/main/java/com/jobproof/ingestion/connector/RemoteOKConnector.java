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
public class RemoteOKConnector {

    private static final Logger log = LoggerFactory.getLogger(RemoteOKConnector.class);
    private final RestTemplate restTemplate;

    public RemoteOKConnector() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(12000);
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * Ingest vacancies from RemoteOK API (Free & Verified Remote Developer Jobs).
     * Endpoint: https://remoteok.com/api
     */
    public List<JobDTO> fetchJobs(int limit) {
        String url = "https://remoteok.com/api";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, request, JsonNode.class);
            JsonNode root = response.getBody();
            if (root == null || !root.isArray()) {
                return Collections.emptyList();
            }

            List<JobDTO> result = new ArrayList<>();
            int max = limit > 0 ? limit : 20;

            for (JsonNode item : root) {
                if (result.size() >= max) {
                    break;
                }

                // Skip non-job metadata/legal entries
                if (!item.has("id") || !item.has("position")) {
                    continue;
                }

                String title = item.path("position").asText();
                String companyName = item.path("company").asText();
                String applyUrl = item.path("apply_url").asText();
                if (applyUrl == null || applyUrl.isBlank()) {
                    applyUrl = item.path("url").asText();
                }
                String location = item.path("location").asText("Remote");
                String description = item.path("description").asText();
                String id = item.path("id").asText();

                if (title == null || title.isBlank() || applyUrl == null || applyUrl.isBlank()) {
                    continue;
                }

                // Tags as skills
                List<String> skills = new ArrayList<>();
                if (item.has("tags") && item.path("tags").isArray()) {
                    for (JsonNode t : item.path("tags")) {
                        skills.add(t.asText());
                    }
                }

                CompanyDTO company = CompanyDTO.builder()
                        .name(companyName != null && !companyName.isBlank() ? companyName : "Remote Employer")
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
                        .source("RemoteOK API")
                        .sourceJobId("ROK-" + id)
                        .trustScore(87)
                        .build());
            }

            log.info("[RemoteOK] Successfully retrieved {} remote jobs", result.size());
            return result;
        } catch (Exception e) {
            log.warn("[RemoteOK] Error fetching jobs: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
