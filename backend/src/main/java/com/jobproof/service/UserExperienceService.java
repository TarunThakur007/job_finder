package com.jobproof.service;

import com.jobproof.dto.UserExperienceDTO;
import com.jobproof.entity.UserExperience;
import com.jobproof.repository.UserExperienceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserExperienceService {

    private static final Logger log = LoggerFactory.getLogger(UserExperienceService.class);

    private final UserExperienceRepository userExperienceRepository;

    public UserExperienceService(UserExperienceRepository userExperienceRepository) {
        this.userExperienceRepository = userExperienceRepository;
    }

    public List<UserExperienceDTO> getExperiences(String company, String type, String query) {
        List<UserExperience> list;

        if (query != null && !query.isBlank()) {
            list = userExperienceRepository.searchExperiences(query.trim(), "APPROVED");
        } else if (company != null && !company.isBlank()) {
            list = userExperienceRepository.findByCompanyNameIgnoreCaseAndStatusOrderByCreatedAtDesc(company.trim(), "APPROVED");
        } else if (type != null && !type.isBlank()) {
            list = userExperienceRepository.findByExperienceTypeAndStatusOrderByCreatedAtDesc(type.trim(), "APPROVED");
        } else {
            list = userExperienceRepository.findByStatusOrderByCreatedAtDesc("APPROVED");
        }

        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<UserExperienceDTO> getExperiencesByUser(Long userId) {
        return userExperienceRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserExperienceDTO createExperience(UserExperienceDTO dto) {
        if (dto.getCompanyName() == null || dto.getCompanyName().isBlank()) {
            throw new IllegalArgumentException("Company name is required");
        }
        if (dto.getJobTitle() == null || dto.getJobTitle().isBlank()) {
            throw new IllegalArgumentException("Job title/role is required");
        }
        if (dto.getExperienceStory() == null || dto.getExperienceStory().isBlank()) {
            throw new IllegalArgumentException("Experience details or story cannot be empty");
        }

        UserExperience entity = UserExperience.builder()
                .userId(dto.getUserId())
                .userName(Boolean.TRUE.equals(dto.getAnonymous()) ? "Anonymous Candidate" : (dto.getUserName() != null ? dto.getUserName() : "Community Member"))
                .userEmail(dto.getUserEmail() != null ? dto.getUserEmail() : "anonymous@jobproof.io")
                .companyName(dto.getCompanyName().trim())
                .jobTitle(dto.getJobTitle().trim())
                .experienceType(dto.getExperienceType() != null ? dto.getExperienceType() : "INTERVIEW_EXPERIENCE")
                .employmentType(dto.getEmploymentType() != null ? dto.getEmploymentType() : "FULL_TIME")
                .workMode(dto.getWorkMode() != null ? dto.getWorkMode() : "HYBRID")
                .location(dto.getLocation())
                .yearsOfExperience(dto.getYearsOfExperience() != null ? dto.getYearsOfExperience() : 0.0)
                .rating(dto.getRating() != null ? dto.getRating() : 5)
                .difficultyLevel(dto.getDifficultyLevel() != null ? dto.getDifficultyLevel() : "MEDIUM")
                .interviewRounds(dto.getInterviewRounds() != null ? dto.getInterviewRounds() : 1)
                .questionsAsked(dto.getQuestionsAsked())
                .experienceStory(dto.getExperienceStory())
                .tipsAndAdvice(dto.getTipsAndAdvice())
                .offerStatus(dto.getOfferStatus() != null ? dto.getOfferStatus() : "OFFERED_ACCEPTED")
                .anonymous(Boolean.TRUE.equals(dto.getAnonymous()))
                .upvotes(0)
                .status("APPROVED")
                .build();

        UserExperience saved = userExperienceRepository.save(entity);
        log.info("[UserExperienceService] Saved new experience id={} for company={}", saved.getId(), saved.getCompanyName());

        return mapToDTO(saved);
    }

    @Transactional
    public UserExperienceDTO upvoteExperience(Long id) {
        UserExperience experience = userExperienceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Experience not found: " + id));
        experience.setUpvotes((experience.getUpvotes() != null ? experience.getUpvotes() : 0) + 1);
        UserExperience updated = userExperienceRepository.save(experience);
        return mapToDTO(updated);
    }

    private UserExperienceDTO mapToDTO(UserExperience entity) {
        return UserExperienceDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .userName(Boolean.TRUE.equals(entity.getAnonymous()) ? "Anonymous Candidate" : entity.getUserName())
                .userEmail(Boolean.TRUE.equals(entity.getAnonymous()) ? "hidden" : entity.getUserEmail())
                .companyName(entity.getCompanyName())
                .jobTitle(entity.getJobTitle())
                .experienceType(entity.getExperienceType())
                .employmentType(entity.getEmploymentType())
                .workMode(entity.getWorkMode())
                .location(entity.getLocation())
                .yearsOfExperience(entity.getYearsOfExperience())
                .rating(entity.getRating())
                .difficultyLevel(entity.getDifficultyLevel())
                .interviewRounds(entity.getInterviewRounds())
                .questionsAsked(entity.getQuestionsAsked())
                .experienceStory(entity.getExperienceStory())
                .tipsAndAdvice(entity.getTipsAndAdvice())
                .offerStatus(entity.getOfferStatus())
                .anonymous(entity.getAnonymous())
                .upvotes(entity.getUpvotes())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
