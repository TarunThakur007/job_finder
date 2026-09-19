package com.jobproof.ingestion.connector;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobproof.dto.JobDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class AshbyConnector {

    private static final Logger log = LoggerFactory.getLogger(AshbyConnector.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper mapper = new ObjectMapper();

    public AshbyConnector() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(4000);
        factory.setReadTimeout(4000);
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * Ingest vacancies from Ashby GraphQL public board API
     * Endpoint: https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams
     */
    public List<JobDTO> fetchJobs(String companyName, String slug) {
        String url = "https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams";
        try {
            String query = """
                query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) {
                  jobBoard: jobBoardWithTeams(organizationHostedJobsPageName: $organizationHostedJobsPageName) {
                    jobPostings {
                      id
                      title
                      locationName
                      employmentType
                    }
                  }
                }
                """;

            Map<String, Object> body = Map.of(
                    "operationName", "ApiJobBoardWithTeams",
                    "variables", Map.of("organizationHostedJobsPageName", slug),
                    "query", query
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("User-Agent", "JobProof-Agent/1.0 (Direct ATS Verifier)");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return Collections.emptyList();
            }

            JsonNode root = mapper.readTree(response.getBody());
            JsonNode postings = root.path("data").path("jobBoard").path("jobPostings");
            List<JobDTO> result = new ArrayList<>();

            if (postings.isArray()) {
                for (JsonNode item : postings) {
                    String id = item.path("id").asText();
                    String title = item.path("title").asText();
                    String location = item.path("locationName").asText("Remote");
                    String employmentType = item.path("employmentType").asText("Full-time");
                    String applyUrl = "https://jobs.ashbyhq.com/" + slug + "/" + id + "/application";

                    if (title == null || title.isBlank()) {
                        continue;
                    }

                    result.add(JobDTO.builder()
                            .title(title)
                            .location(location)
                            .applyUrl(applyUrl)
                            .employmentType(employmentType)
                            .source("Ashby (" + companyName + ")")
                            .sourceJobId("ASH-" + id)
                            .trustScore(97)
                            .build());
                }
            }

            log.info("[Ashby] Successfully retrieved {} open vacancies from {}", result.size(), companyName);
            return result;
        } catch (Exception e) {
            log.warn("[Ashby] Could not fetch vacancies for {}: {}", slug, e.getMessage());
            return Collections.emptyList();
        }
    }
}
