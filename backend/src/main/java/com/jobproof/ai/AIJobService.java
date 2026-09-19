package com.jobproof.ai;

import com.jobproof.entity.Job;
import com.jobproof.entity.JobSkill;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class AIJobService {

    private final GeminiClientService geminiClientService;

    public AIJobService(GeminiClientService geminiClientService) {
        this.geminiClientService = geminiClientService;
    }

    public void analyzeAndEnrichJob(Job job) {
        if (job == null) return;

        // 1. Generate Executive AI Summary using Google Gemini API if missing
        if (job.getSummary() == null || job.getSummary().isBlank()) {
            String companyName = job.getCompany() != null ? job.getCompany().getName() : "the employer";
            String prompt = String.format(
                "Write a 2-sentence professional executive summary for the job posting '%s' at '%s'. Focus on engineering impact and team collaboration.",
                job.getTitle(), companyName
            );
            job.setSummary(geminiClientService.generateContent(prompt));
        }

        // 2. Extract & Categorize Role
        if (job.getRole() == null || job.getRole().isBlank()) {
            job.setRole(categorizeRole(job.getTitle()));
        }

        // 3. Extract Required Skills if empty
        if (job.getSkills() == null || job.getSkills().isEmpty()) {
            List<String> extractedSkills = extractSkills(job.getTitle(), job.getDescription());
            List<JobSkill> jobSkills = new ArrayList<>();
            for (String skillName : extractedSkills) {
                jobSkills.add(JobSkill.builder().job(job).skill(skillName).build());
            }
            job.setSkills(jobSkills);
        }

        // 4. Extract Selection Process Flow
        if (job.getSelectionProcess() == null || job.getSelectionProcess().isBlank()) {
            job.setSelectionProcess("Resume Screening -> Online Assessment -> Technical Interview -> HR Offer");
        }

        // 5. Check Salary Transparency Flag
        if (job.getSalaryMin() == null && job.getSalaryMax() == null) {
            job.setIsSalaryEstimated(true);
        }
    }

    private String categorizeRole(String title) {
        if (title == null) return "Software Engineering";
        String t = title.toLowerCase();
        if (t.contains("backend") || t.contains("java") || t.contains("spring")) {
            return "Backend Development";
        } else if (t.contains("frontend") || t.contains("react") || t.contains("ui")) {
            return "Frontend Development";
        } else if (t.contains("full") || t.contains("stack")) {
            return "Full Stack Development";
        } else if (t.contains("ai") || t.contains("data") || t.contains("machine")) {
            return "AI & Data Engineering";
        }
        return "Software Engineering";
    }

    private List<String> extractSkills(String title, String description) {
        List<String> result = new ArrayList<>();
        String combined = ((title != null ? title : "") + " " + (description != null ? description : "")).toLowerCase();

        if (combined.contains("java")) result.add("Java");
        if (combined.contains("spring")) result.add("Spring Boot");
        if (combined.contains("react")) result.add("React.js");
        if (combined.contains("sql") || combined.contains("postgres")) result.add("SQL");
        if (combined.contains("rest") || combined.contains("api")) result.add("REST API");
        if (combined.contains("docker")) result.add("Docker");
        if (combined.contains("figma")) result.add("Figma");
        if (combined.contains("python")) result.add("Python");

        if (result.isEmpty()) {
            result.addAll(Arrays.asList("Java", "Spring Boot", "REST API", "SQL"));
        }
        return result;
    }
}
