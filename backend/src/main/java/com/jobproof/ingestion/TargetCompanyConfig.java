package com.jobproof.ingestion;

import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class TargetCompanyConfig {

    public record TargetCompany(String name, String slug, AtsType atsType, String website) {}

    // Curated list of top tech & global remote companies using Greenhouse, Lever, and Ashby
    private final List<TargetCompany> targetCompanies = List.of(
        // Greenhouse Companies
        new TargetCompany("Figma", "figma", AtsType.GREENHOUSE, "https://figma.com"),
        new TargetCompany("Stripe", "stripe", AtsType.GREENHOUSE, "https://stripe.com"),
        new TargetCompany("GitLab", "gitlab", AtsType.GREENHOUSE, "https://gitlab.com"),
        new TargetCompany("Discord", "discord", AtsType.GREENHOUSE, "https://discord.com"),
        new TargetCompany("Cloudflare", "cloudflare", AtsType.GREENHOUSE, "https://cloudflare.com"),

        // Lever Companies
        new TargetCompany("Spotify", "spotify", AtsType.LEVER, "https://spotify.com"),
        new TargetCompany("Netflix", "netflix", AtsType.LEVER, "https://netflix.com"),

        // Ashby Companies
        new TargetCompany("Linear", "linear", AtsType.ASHBY, "https://linear.app"),
        new TargetCompany("Ramp", "ramp", AtsType.ASHBY, "https://ramp.com")
    );

    public List<TargetCompany> getTargetCompanies() {
        return targetCompanies;
    }
}
