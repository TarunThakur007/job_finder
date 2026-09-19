package com.jobproof.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDTO {
    private Long id;
    private String filename;
    private String fileType;
    private Long fileSizeBytes;
    private String targetJobRole;
    private Integer overallAtsScore;
    private Integer formattingScore;
    private Integer keywordMatchScore;
    private Integer impactVerbScore;
    private List<String> extractedSkills;
    private List<String> missingCriticalSkills;
    private List<String> strengths;
    private List<String> formattingWarnings;
    private List<String> improvementRecommendations;
    private String summary;
    private String uploadedAt;
}
