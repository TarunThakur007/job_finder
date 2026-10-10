package com.jobproof.service;

import com.jobproof.dto.JobDTO;
import com.jobproof.dto.ResumeJobMatchDTO;
import com.jobproof.dto.ResumeMatchResultDTO;
import com.jobproof.entity.Job;
import com.jobproof.mapper.JobMapper;
import com.jobproof.repository.JobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ResumeMatcherService {

    private static final Logger log = LoggerFactory.getLogger(ResumeMatcherService.class);

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;

    // Standard high-demand fresher skill benchmark catalog
    private static final Map<String, List<String>> ROLE_BENCHMARK_SKILLS = new LinkedHashMap<>();

    static {
        ROLE_BENCHMARK_SKILLS.put("BACKEND", List.of("Java", "Spring Boot", "REST API", "SQL", "PostgreSQL", "Docker", "Git", "Microservices", "Redis", "Kafka"));
        ROLE_BENCHMARK_SKILLS.put("FRONTEND", List.of("React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Redux", "REST API", "Git", "Next.js"));
        ROLE_BENCHMARK_SKILLS.put("FULLSTACK", List.of("Java", "Spring Boot", "React", "JavaScript", "SQL", "REST API", "Docker", "Git", "PostgreSQL", "Node.js"));
        ROLE_BENCHMARK_SKILLS.put("DATA", List.of("Python", "SQL", "Pandas", "NumPy", "FastAPI", "Machine Learning", "Git", "Docker", "PostgreSQL"));
        ROLE_BENCHMARK_SKILLS.put("DEVOPS", List.of("Docker", "Kubernetes", "Linux", "AWS", "CI/CD", "Git", "Terraform", "Bash", "Python"));
    }

    private static final List<String> COMMON_TECH_SKILLS = List.of(
            "Java", "Spring Boot", "Spring", "Python", "JavaScript", "TypeScript", "React", "Node.js",
            "Express", "Next.js", "Angular", "Vue", "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis",
            "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Git", "GitHub", "REST API", "GraphQL",
            "Microservices", "HTML5", "CSS3", "Tailwind CSS", "Linux", "Kafka", "RabbitMQ", "CI/CD",
            "C++", "C#", "Go", "Golang", "Django", "FastAPI", "Flask", "Pandas", "NumPy", "TensorFlow",
            "PyTorch", "Hibernate", "JPA", "JUnit", "Data Structures", "Algorithms"
    );

    public ResumeMatcherService(JobRepository jobRepository, JobMapper jobMapper) {
        this.jobRepository = jobRepository;
        this.jobMapper = jobMapper;
    }

    /**
     * Parses raw resume text to extract skills if not already supplied
     */
    public List<String> extractSkillsFromResume(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return Collections.emptyList();
        }
        Set<String> extracted = new LinkedHashSet<>();
        String lower = rawText.toLowerCase();

        for (String skill : COMMON_TECH_SKILLS) {
            String pattern = "(?i)\\b" + Pattern.quote(skill.toLowerCase()) + "\\b";
            if (Pattern.compile(pattern).matcher(lower).find()) {
                extracted.add(skill);
            }
        }
        return new ArrayList<>(extracted);
    }

    /**
     * Matches candidate's extracted skills against all active verified jobs
     */
    public ResumeMatchResultDTO matchResumeToActiveJobs(List<String> resumeSkills, String targetRole, String userLocation) {
        if (resumeSkills == null) {
            resumeSkills = new ArrayList<>();
        }
        String normalizedRole = (targetRole != null && !targetRole.isBlank()) ? targetRole : "Software Engineer";
        String roleCategory = categorizeRole(normalizedRole);

        List<String> roleBenchmark = ROLE_BENCHMARK_SKILLS.getOrDefault(roleCategory, ROLE_BENCHMARK_SKILLS.get("BACKEND"));

        // Identify missing critical skills for the role
        Set<String> userSkillsLower = resumeSkills.stream().map(String::toLowerCase).collect(Collectors.toSet());
        List<String> missingSkillsForRole = new ArrayList<>();
        for (String benchmark : roleBenchmark) {
            if (!userSkillsLower.contains(benchmark.toLowerCase())) {
                missingSkillsForRole.add(benchmark);
            }
        }

        // Calculate candidate score out of 10 for the target role
        int matchedBenchmarkCount = roleBenchmark.size() - missingSkillsForRole.size();
        double skillCoverage = (double) matchedBenchmarkCount / roleBenchmark.size();
        double baseScore = Math.min(9.8, Math.max(3.5, (skillCoverage * 7.5) + (resumeSkills.size() >= 5 ? 2.0 : 1.2)));
        double resumeScoreOutOf10 = Math.round(baseScore * 10.0) / 10.0;
        int atsPercentage = (int) Math.round(resumeScoreOutOf10 * 10.0);

        String readiness;
        if (resumeScoreOutOf10 >= 8.5) {
            readiness = "Job Ready (High resonance for SDE-1 & Fresher Hiring Drives)";
        } else if (resumeScoreOutOf10 >= 7.0) {
            readiness = "Near Ready (Close key skill gaps to achieve >90% shortlist rate)";
        } else {
            readiness = "Foundational Stage (Strengthen core frameworks & build portfolio projects)";
        }

        // Generate tailored skill suggestions
        List<String> rolePreparationTips = generatePreparationTips(roleCategory, missingSkillsForRole, resumeScoreOutOf10);

        // Fetch all active verified jobs from database
        List<Job> activeJobs = jobRepository.findAllApprovedJobsWithCompany(Job.VerificationStatus.NEEDS_REVIEW);
        if (activeJobs.isEmpty()) {
            activeJobs = jobRepository.findAll();
        }

        List<ResumeJobMatchDTO> matchedJobDTOs = new ArrayList<>();

        for (Job job : activeJobs) {
            if (job.getVerificationStatus() == Job.VerificationStatus.CLOSED) {
                continue;
            }

            JobDTO jobDto = jobMapper.toJobDTO(job);
            List<String> jobSkills = jobDto.getSkills();
            if (jobSkills == null || jobSkills.isEmpty()) {
                jobSkills = roleBenchmark.subList(0, Math.min(5, roleBenchmark.size()));
            }

            // Calculate skill intersection
            List<String> matchedWithJob = new ArrayList<>();
            List<String> missingFromJob = new ArrayList<>();

            for (String js : jobSkills) {
                if (userSkillsLower.contains(js.toLowerCase())) {
                    matchedWithJob.add(js);
                } else {
                    missingFromJob.add(js);
                }
            }

            // Calculate compatibility score out of 10 for this specific job
            double jobSkillRatio = jobSkills.isEmpty() ? 0.6 : (double) matchedWithJob.size() / jobSkills.size();
            boolean roleMatches = isRoleMatch(jobDto.getTitle(), jobDto.getRole(), normalizedRole);
            boolean isFresher = isFresherEligible(jobDto);

            double score = (jobSkillRatio * 6.5) + (roleMatches ? 2.2 : 0.8) + (isFresher ? 1.3 : 0.7);
            score = Math.min(9.9, Math.max(2.5, score));
            double jobScoreOutOf10 = Math.round(score * 10.0) / 10.0;
            int jobPercentage = (int) Math.round(jobScoreOutOf10 * 10.0);

            // Job-specific skill suggestions
            List<String> jobSuggestions = new ArrayList<>();
            if (!missingFromJob.isEmpty()) {
                for (String m : missingFromJob.stream().limit(3).toList()) {
                    jobSuggestions.add("Learn " + m + " to boost your match for this " + jobDto.getTitle() + " vacancy.");
                }
            } else {
                jobSuggestions.add("Strong alignment! Highlight your practical " + String.join(", ", matchedWithJob.stream().limit(3).toList()) + " projects in your application.");
            }

            // Nearest Office Location detection
            String nearestLocation = calculateNearestOffice(jobDto, userLocation);

            matchedJobDTOs.add(ResumeJobMatchDTO.builder()
                    .job(jobDto)
                    .compatibilityScoreOutOf10(jobScoreOutOf10)
                    .compatibilityPercentage(jobPercentage)
                    .matchedSkills(matchedWithJob)
                    .missingSkills(missingFromJob)
                    .skillSuggestions(jobSuggestions)
                    .nearestOfficeLocation(nearestLocation)
                    .roleCategory(categorizeRole(jobDto.getTitle()))
                    .isFresherEligible(isFresher)
                    .build());
        }

        // Sort matched jobs by compatibility score descending
        matchedJobDTOs.sort((a, b) -> Double.compare(b.getCompatibilityScoreOutOf10(), a.getCompatibilityScoreOutOf10()));

        return ResumeMatchResultDTO.builder()
                .resumeScoreOutOf10(resumeScoreOutOf10)
                .overallAtsScore(atsPercentage)
                .targetJobRole(normalizedRole)
                .candidateReadiness(readiness)
                .extractedSkills(resumeSkills)
                .recommendedSkillsToLearn(missingSkillsForRole.stream().limit(5).collect(Collectors.toList()))
                .rolePreparationTips(rolePreparationTips)
                .userLocation(userLocation != null ? userLocation : "Bengaluru / India")
                .totalMatchedJobsCount(matchedJobDTOs.size())
                .matchedJobs(matchedJobDTOs)
                .build();
    }

    private String categorizeRole(String title) {
        if (title == null) return "BACKEND";
        String t = title.toUpperCase();
        if (t.contains("FRONTEND") || t.contains("REACT") || t.contains("UI") || t.contains("WEB")) return "FRONTEND";
        if (t.contains("FULLSTACK") || t.contains("FULL STACK")) return "FULLSTACK";
        if (t.contains("DATA") || t.contains("AI") || t.contains("ML") || t.contains("PYTHON")) return "DATA";
        if (t.contains("DEVOPS") || t.contains("CLOUD") || t.contains("SRE") || t.contains("INFRA")) return "DEVOPS";
        return "BACKEND";
    }

    private boolean isRoleMatch(String jobTitle, String jobRole, String targetRole) {
        if (jobTitle == null && jobRole == null) return false;
        String combined = ((jobTitle != null ? jobTitle : "") + " " + (jobRole != null ? jobRole : "")).toLowerCase();
        String target = targetRole.toLowerCase();

        for (String part : target.split("\\s+")) {
            if (part.length() > 2 && !List.of("engineer", "developer", "software", "specialist").contains(part)) {
                if (combined.contains(part)) return true;
            }
        }
        return combined.contains("software") || combined.contains("developer");
    }

    private boolean isFresherEligible(JobDTO job) {
        String title = job.getTitle() != null ? job.getTitle().toLowerCase() : "";
        String exp = job.getExperienceLevel() != null ? job.getExperienceLevel().toLowerCase() : "";
        return exp.contains("fresher") || exp.contains("entry") || exp.contains("0-1") || exp.contains("intern") ||
               title.contains("intern") || title.contains("graduate") || title.contains("associate") ||
               title.contains("sde 1") || title.contains("sde-1") || title.contains("fresher") || title.contains("trainee");
    }

    private String calculateNearestOffice(JobDTO job, String userLocation) {
        String officeLocs = (job.getCompany() != null && job.getCompany().getOfficeLocations() != null)
                ? job.getCompany().getOfficeLocations()
                : (job.getLocation() != null ? job.getLocation() : "Bengaluru, Karnataka");

        if (userLocation == null || userLocation.isBlank()) {
            return officeLocs.split("\\|")[0].trim();
        }

        String userLocLower = userLocation.toLowerCase();
        String[] offices = officeLocs.split("\\|");
        for (String off : offices) {
            String trimmed = off.trim();
            if (trimmed.toLowerCase().contains(userLocLower) || userLocLower.contains(trimmed.toLowerCase())) {
                return trimmed + " (Nearest to you)";
            }
            // Common Indian city matching
            for (String city : List.of("bengaluru", "bangalore", "hyderabad", "pune", "gurgaon", "gurugram", "noida", "delhi", "mumbai", "chennai")) {
                if (userLocLower.contains(city) && trimmed.toLowerCase().contains(city)) {
                    return trimmed + " (Nearest to you)";
                }
            }
        }
        return offices[0].trim();
    }

    private List<String> generatePreparationTips(String roleCategory, List<String> missingSkills, double scoreOutOf10) {
        List<String> tips = new ArrayList<>();
        if (!missingSkills.isEmpty()) {
            String topMissing = String.join(", ", missingSkills.stream().limit(3).toList());
            tips.add("Focus on adding " + topMissing + " to your skills section to immediately boost your candidate score past 9.0.");
        }
        switch (roleCategory) {
            case "BACKEND" -> {
                tips.add("Build a production-grade REST API project with Spring Boot and PostgreSQL demonstrating pagination, JWT auth, and Docker.");
                tips.add("Practice Core Java OOP, Multi-threading, and Collections frequently asked in off-campus coding rounds.");
            }
            case "FRONTEND" -> {
                tips.add("Deploy a responsive React application with state management (Redux/Zustand) and clean CSS or Tailwind.");
                tips.add("Master JavaScript event loop, promises, async/await, and DOM manipulation for technical interviews.");
            }
            case "FULLSTACK" -> {
                tips.add("Implement an end-to-end fullstack portal integrating React with a Spring Boot or Node REST backend.");
                tips.add("Showcase database normalization and API contract design in your GitHub repositories.");
            }
            default -> {
                tips.add("Pin 2-3 verified GitHub repositories with comprehensive READMEs demonstrating real problem-solving.");
                tips.add("Ensure your resume contains quantitative metrics (e.g. 'Reduced query latency by 30%') rather than generic descriptions.");
            }
        }
        return tips;
    }
}
