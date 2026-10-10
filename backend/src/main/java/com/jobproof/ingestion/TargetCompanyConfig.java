package com.jobproof.ingestion;

import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class TargetCompanyConfig {

    public record TargetCompany(
            String name,
            String slug,
            AtsType atsType,
            String website,
            String linkedinUrl,
            String officeLocations,
            String industry,
            String description
    ) {}

    // Curated list of top Indian tech startups, unicorns, and product engineering hubs using Greenhouse, Lever, and Ashby
    private final List<TargetCompany> targetCompanies = List.of(
        // High-Volume Indian Tech Employers & Unicorns on Greenhouse
        new TargetCompany(
                "Thoughtworks",
                "thoughtworks",
                AtsType.GREENHOUSE,
                "https://www.thoughtworks.com",
                "https://www.linkedin.com/company/thoughtworks/",
                "Koramangala, Bengaluru, Karnataka | Yerwada, Pune, Maharashtra | Cyber City, Gurugram | Hyderabad | Chennai",
                "Global Tech Consultancy & Software Excellence",
                "Thoughtworks is renowned globally and across India for hiring fresh graduates and engineers, fostering strong engineering culture, test-driven development, and distributed systems."
        ),
        new TargetCompany(
                "Rubrik",
                "rubrik",
                AtsType.GREENHOUSE,
                "https://www.rubrik.com",
                "https://www.linkedin.com/company/rubrik-inc/",
                "Outer Ring Road, Bengaluru, Karnataka",
                "Zero Trust Data Security & Cloud",
                "Rubrik is a market leader in Zero Trust data security. Its flagship Bengaluru R&D engineering center builds cutting-edge enterprise cloud data protection and cyber resilience platforms."
        ),
        new TargetCompany(
                "Turing",
                "turing",
                AtsType.GREENHOUSE,
                "https://www.turing.com",
                "https://www.linkedin.com/company/turingcom/",
                "Remote - India / Worldwide",
                "AI-Powered Developer Platform",
                "Turing connects top software developers from India with high-growth Silicon Valley tech companies."
        ),
        new TargetCompany(
                "Swiggy",
                "swiggy",
                AtsType.GREENHOUSE,
                "https://www.swiggy.com",
                "https://www.linkedin.com/company/swiggy-in/",
                "Koramangala & Marathahalli, Bengaluru, Karnataka | Gurugram, Haryana | Mumbai",
                "Quick Commerce, FoodTech & Logistics",
                "Swiggy is India's leading on-demand convenience platform. Its engineering organization builds hyperscale distributed routing systems, real-time dispatch algorithms, and high-throughput order ledgers."
        ),
        new TargetCompany(
                "CRED",
                "cred",
                AtsType.GREENHOUSE,
                "https://cred.club",
                "https://www.linkedin.com/company/cred-club/",
                "Indiranagar, Bengaluru, Karnataka",
                "Fintech & Consumer Tech",
                "CRED is a members-only financial club celebrating creditworthy individuals. Engineering teams architect low-latency event-driven microservices, high-security transaction vaults, and gamified mobile UI."
        ),
        new TargetCompany(
                "Razorpay",
                "razorpay",
                AtsType.GREENHOUSE,
                "https://razorpay.com",
                "https://www.linkedin.com/company/razorpay/",
                "SJR Cyber Ladu, Bengaluru, Karnataka | Mumbai | Delhi NCR",
                "Fintech, Banking & Payments Gateway",
                "Razorpay is India's first full-stack financial solutions company powering merchant payments, automated payouts, neo-banking, and corporate credit cards with 99.99% uptime."
        ),
        new TargetCompany(
                "Postman",
                "postman",
                AtsType.GREENHOUSE,
                "https://www.postman.com",
                "https://www.linkedin.com/company/postman-platform/",
                "Indiranagar, Bengaluru, Karnataka",
                "Developer Tools & API Infrastructure",
                "Postman is the leading API platform used by 30+ million developers across the globe. Engineering in Bengaluru drives core collaboration, API testing runtime, and protocol design."
        ),
        new TargetCompany(
                "Urban Company",
                "urbancompany",
                AtsType.GREENHOUSE,
                "https://www.urbancompany.com",
                "https://www.linkedin.com/company/urbancompany/",
                "Udyog Vihar, Gurugram, Haryana | Bengaluru, Karnataka",
                "Home Services Marketplace & Deep Tech",
                "Urban Company is Asia's largest home services platform. Its tech hub builds complex partner scheduling graphs, demand matching engines, and predictive operations tools."
        ),
        new TargetCompany(
                "BrowserStack",
                "browserstack",
                AtsType.GREENHOUSE,
                "https://www.browserstack.com",
                "https://www.linkedin.com/company/browserstack/",
                "Bandra Kurla Complex (BKC), Mumbai, Maharashtra | Bengaluru, Karnataka",
                "Cloud Testing & DevTools",
                "BrowserStack is the world's leading software testing platform on the cloud, powering over 2 million tests daily across real Android, iOS, and desktop browsers."
        ),
        new TargetCompany(
                "Slice",
                "slice",
                AtsType.GREENHOUSE,
                "https://sliceit.com",
                "https://www.linkedin.com/company/sliceit/",
                "Indiranagar, Bengaluru, Karnataka",
                "Fintech & Digital Banking",
                "Slice is a cutting-edge Indian fintech focused on consumer payments and modern banking experiences designed specifically for Gen-Z and millennial digital natives."
        ),
        new TargetCompany(
                "InMobi",
                "inmobi",
                AtsType.GREENHOUSE,
                "https://www.inmobi.com",
                "https://www.linkedin.com/company/inmobi/",
                "Kadubeesanahalli, Outer Ring Road, Bengaluru, Karnataka | Delhi NCR",
                "AdTech, Artificial Intelligence & Data",
                "InMobi is India's first unicorn, operating an AI-driven marketing cloud and glance smart lock screen platform reaching hundreds of millions of active users daily."
        ),
        new TargetCompany(
                "PhonePe",
                "phonepe",
                AtsType.GREENHOUSE,
                "https://www.phonepe.com",
                "https://www.linkedin.com/company/phonepe-internet/",
                "Bellandur, Bengaluru, Karnataka | Pune | Mumbai",
                "Digital Payments & Financial Services",
                "PhonePe is India's leading digital payments app processing billions of monthly UPI transactions on high-performance distributed architectures with sub-second latency."
        ),
        new TargetCompany(
                "Chargebee",
                "chargebee",
                AtsType.GREENHOUSE,
                "https://www.chargebee.com",
                "https://www.linkedin.com/company/chargebee/",
                "DLF Cybercity, Manapakkam, Chennai, Tamil Nadu | Bengaluru, Karnataka",
                "Subscription Billing & Revenue Ops SaaS",
                "Chargebee is a recurring billing and subscription management platform built in Chennai that empowers thousands of high-growth SaaS businesses globally."
        ),
        new TargetCompany(
                "Juspay",
                "juspay",
                AtsType.GREENHOUSE,
                "https://juspay.in",
                "https://www.linkedin.com/company/juspay/",
                "Koramangala, Bengaluru, Karnataka",
                "Payments Infrastructure & Functional Programming",
                "Juspay processes over 100 million transactions daily for Amazon, Swiggy, and Cred. Renowned for its Haskell, PureScript, and functional programming engineering excellence."
        ),

        // Lever Indian Unicorns & Startups
        new TargetCompany(
                "Zepto",
                "zepto",
                AtsType.LEVER,
                "https://www.zeptonow.com",
                "https://www.linkedin.com/company/zeptonow/",
                "Andheri East, Mumbai, Maharashtra | Koramangala, Bengaluru, Karnataka",
                "10-Minute Quick Commerce & Supply Chain",
                "Zepto is India's fastest-growing quick-commerce unicorn. Its engineering stack optimizes dark-store warehouse micro-logistics, predictive inventory, and real-time delivery routing."
        ),
        new TargetCompany(
                "CleverTap",
                "clevertap",
                AtsType.LEVER,
                "https://clevertap.com",
                "https://www.linkedin.com/company/clevertap/",
                "Wadhwa Solitaire, Mumbai, Maharashtra | Bengaluru, Karnataka",
                "Customer Engagement & Real-time Analytics",
                "CleverTap powers retention and engagement for top Indian mobile apps, processing billions of behavioral events every second on a custom in-memory database engine."
        ),
        new TargetCompany(
                "Groww",
                "groww",
                AtsType.LEVER,
                "https://groww.in",
                "https://www.linkedin.com/company/groww.in/",
                "Vaishnavi Tech Park, Bellandur, Bengaluru, Karnataka",
                "WealthTech, Stocks & Mutual Funds",
                "Groww makes investing accessible, transparent, and direct for over 40 million Indians. Engineering focuses on zero-latency order execution, security compliance, and sleek UX."
        ),

        // Ashby Global & Indian Remote Startups
        new TargetCompany(
                "Linear",
                "linear",
                AtsType.ASHBY,
                "https://linear.app",
                "https://www.linkedin.com/company/linear-app/",
                "Remote - India / Worldwide",
                "Developer Productivity & Issue Tracking",
                "Linear builds the gold-standard issue tracking and product development system for world-class high-velocity software teams."
        ),
        new TargetCompany(
                "Ramp",
                "ramp",
                AtsType.ASHBY,
                "https://ramp.com",
                "https://www.linkedin.com/company/ramp-financial/",
                "Remote - India / Global",
                "Financial Automation & Corporate Cards",
                "Ramp designs the fastest growing corporate finance platform in history, automating accounting, spend policies, and vendor management."
        )
    );

    public List<TargetCompany> getTargetCompanies() {
        return targetCompanies;
    }
}
