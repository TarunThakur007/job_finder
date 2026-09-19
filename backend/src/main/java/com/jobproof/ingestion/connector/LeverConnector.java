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
public class LeverConnector {

    private static final Logger log = LoggerFactory.getLogger(LeverConnector.class);
    private final RestTemplate restTemplate;

    public LeverConnector() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(4000);
        factory.setReadTimeout(4000);
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * Ingest vacancies from Lever public postings API
     * Endpoint: https://api.lever.co/v0/postings/{slug}?mode=json
     */
    public List<JobDTO> fetchJobs(String companyName, String slug) {
        String url = "https://api.lever.co/v0/postings/" + slug + "?mode=json";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "JobProof-Agent/1.0 (Direct ATS Verifier)");
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, request, JsonNode.class);
            JsonNode root = response.getBody();
            List<JobDTO> result = new ArrayList<>();

            if (root != null && root.isArray()) {
                for (JsonNode item : root) {
                    String title = item.path("text").asText();
                    String applyUrl = item.path("applyUrl").asText(); // Direct application form!
                    if (applyUrl == null || applyUrl.isBlank()) {
                        applyUrl = item.path("hostedUrl").asText();
                    }
                    String location = item.path("categories").path("location").asText("Remote");
                    String commitment = item.path("categories").path("commitment").asText("Full-time");
                    String id = item.path("id").asText();

                    if (title == null || title.isBlank() || applyUrl == null || applyUrl.isBlank()) {
                        continue;
                    }

                    result.add(JobDTO.builder()
                            .title(title)
                            .location(location)
                            .applyUrl(applyUrl)
                            .employmentType(commitment)
                            .source("Lever (" + companyName + ")")
                            .sourceJobId("LEV-" + id)
                            .trustScore(96)
                            .build());
                }
            }

            log.info("[Lever] Successfully retrieved {} open vacancies from {}", result.size(), companyName);
            return result;
        } catch (Exception e) {
            log.warn("[Lever] Could not fetch vacancies for {}: {}", slug, e.getMessage());
            return Collections.emptyList();
        }
    }
}
