package com.jobproof.ingestion.connector;

import com.fasterxml.jackson.databind.JsonNode;
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
public class GreenhouseConnector {

    private static final Logger log = LoggerFactory.getLogger(GreenhouseConnector.class);
    private final RestTemplate restTemplate;

    public GreenhouseConnector() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(4000);
        factory.setReadTimeout(4000);
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * Ingest vacancies from Greenhouse public job board API
     * Endpoint: https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=false
     */
    public List<JobDTO> fetchJobs(String companyName, String slug) {
        String url = "https://boards-api.greenhouse.io/v1/boards/" + slug + "/jobs?content=false";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "JobProof-Agent/1.0 (Direct ATS Verifier)");
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, request, JsonNode.class);
            JsonNode root = response.getBody();
            if (root == null || !root.has("jobs")) {
                return Collections.emptyList();
            }

            JsonNode jobs = root.path("jobs");
            List<JobDTO> result = new ArrayList<>();

            for (JsonNode item : jobs) {
                String title = item.path("title").asText();
                String applyUrl = item.path("absolute_url").asText(); // Direct application link!
                String location = item.path("location").path("name").asText("Remote");
                String id = item.path("id").asText();

                if (title == null || title.isBlank() || applyUrl == null || applyUrl.isBlank()) {
                    continue;
                }

                result.add(JobDTO.builder()
                        .title(title)
                        .location(location)
                        .applyUrl(applyUrl)
                        .source("Greenhouse (" + companyName + ")")
                        .sourceJobId("GH-" + id)
                        .employmentType("Fulltime")
                        .trustScore(98)
                        .build());
            }

            log.info("[Greenhouse] Successfully retrieved {} open vacancies from {}", result.size(), companyName);
            return result;
        } catch (Exception e) {
            log.warn("[Greenhouse] Could not fetch vacancies for {}: {}", slug, e.getMessage());
            return Collections.emptyList();
        }
    }
}
