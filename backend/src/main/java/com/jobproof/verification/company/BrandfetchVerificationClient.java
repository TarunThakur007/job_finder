package com.jobproof.verification.company;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
public class BrandfetchVerificationClient {

    private static final Logger log = LoggerFactory.getLogger(BrandfetchVerificationClient.class);
    private final RestTemplate restTemplate;

    @Value("${brandfetch.api.key:}")
    private String apiKey;

    public BrandfetchVerificationClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(4000);
        factory.setReadTimeout(5000);
        this.restTemplate = new RestTemplate(factory);
    }

    public record BrandfetchResult(
            String name,
            String domain,
            String iconUrl,
            boolean verified,
            boolean claimed,
            double qualityScore) {}

    /**
     * Verifies company identity and authenticity against Brandfetch Search API.
     * Endpoint: https://api.brandfetch.io/v2/search/{query}
     */
    public Optional<BrandfetchResult> verifyCompany(String companyName) {
        if (companyName == null || companyName.isBlank()) {
            return Optional.empty();
        }

        try {
            String encoded = URLEncoder.encode(companyName.trim(), StandardCharsets.UTF_8);
            String url = "https://api.brandfetch.io/v2/search/" + encoded;

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "JobProof-VerificationAgent/1.0");
            if (apiKey != null && !apiKey.isBlank()) {
                headers.set("Authorization", "Bearer " + apiKey.trim());
            }

            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, request, JsonNode.class);
            JsonNode root = response.getBody();

            if (root != null && root.isArray() && root.size() > 0) {
                // Find top matching brand
                for (JsonNode item : root) {
                    String domain = item.path("domain").asText("");
                    String name = item.path("name").asText(companyName);
                    String icon = item.path("icon").asText(null);
                    boolean verified = item.path("verified").asBoolean(false);
                    boolean claimed = item.path("claimed").asBoolean(false);
                    double score = item.path("qualityScore").asDouble(0.0);

                    if (!domain.isBlank()) {
                        log.info("[Brandfetch] Verified brand '{}' -> domain: '{}', verified: {}, qualityScore: {}",
                                companyName, domain, verified, score);
                        return Optional.of(new BrandfetchResult(name, domain, icon, verified, claimed, score));
                    }
                }
            }
            return Optional.empty();
        } catch (Exception e) {
            log.warn("[Brandfetch] Error verifying company '{}': {}", companyName, e.getMessage());
            return Optional.empty();
        }
    }
}
