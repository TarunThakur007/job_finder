package com.jobproof.controller;

import com.jobproof.dto.UserExperienceDTO;
import com.jobproof.service.UserExperienceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/experiences")
public class UserExperienceController {

    private final UserExperienceService userExperienceService;

    public UserExperienceController(UserExperienceService userExperienceService) {
        this.userExperienceService = userExperienceService;
    }

    @GetMapping
    public ResponseEntity<List<UserExperienceDTO>> getExperiences(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String query) {
        List<UserExperienceDTO> list = userExperienceService.getExperiences(company, type, query);
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<?> createExperience(@RequestBody UserExperienceDTO dto) {
        try {
            UserExperienceDTO created = userExperienceService.createExperience(dto);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to save experience: " + ex.getMessage()));
        }
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<?> upvoteExperience(@PathVariable Long id) {
        try {
            UserExperienceDTO updated = userExperienceService.upvoteExperience(id);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserExperienceDTO>> getUserExperiences(@PathVariable Long userId) {
        return ResponseEntity.ok(userExperienceService.getExperiencesByUser(userId));
    }
}
