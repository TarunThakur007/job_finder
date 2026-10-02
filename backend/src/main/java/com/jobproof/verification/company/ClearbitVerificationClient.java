package com.jobproof.verification.company;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class ClearbitVerificationClient {

    private static final Logger log = LoggerFactory.getLogger(ClearbitVerificationClient.class);
    private final RestTemplate restTemplate;

    public ClearbitVerificationClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(4000);
        factory.setReadTimeout(5000);
        this.restTemplate = new RestTemplate(factory);
    }

    public record ClearbitResult(String name, String domain, String logoUrl, boolean verified) {}

    /**
     * Verifies company name against Clearbit Company Autocomplete API (Free, No Auth Required).
     * Endpoint: https://autocomplete.clearbit.com/v1/companies/suggest?query={companyName}
     */
    public Optional<ClearbitResult> verifyCompany(String companyName) {
        if (companyName == null || companyName.isBlank()) {
            return Optional.empty();
        }

        try {
            String encoded = URLEncoder.encode(companyName.trim(), StandardCharsets.UTF_8);
            String url = "https://autocomplete.clearbit.com/v1/companies/suggest?query=" + encoded;

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "JobProof-VerificationAgent/1.0");
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, request, JsonNode.class);
            JsonNode root = response.getBody();

            if (root != null && root.isArray() && root.size() > 0) {
                // Find closest match or take top suggest
                for (JsonNode item : root) {
                    String candidateName = item.path("name").asText("");
                    String domain = item.path("domain").asText("");
                    String logo = item.path("logo").asText(null);

                    if (!domain.isBlank()) {
                        log.info("[Clearbit] Verified company '{}' -> domain: '{}'", companyName, domain);
                        return Optional.of(new ClearbitResult(candidateName, domain, logo, true));
                    }
                }
            }
            return Optional.empty();
        } catch (Exception e) {
            log.warn("[Clearbit] Error verifying company '{}': {}", companyName, e.getMessage());
            return Optional.empty();
        }
    }
}
