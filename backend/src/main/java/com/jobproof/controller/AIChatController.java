package com.jobproof.controller;

import com.jobproof.ai.GeminiClientService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIChatController {

    private final GeminiClientService geminiClientService;

    @Data
    public static class ChatRequest {
        private String message;
        private String prompt;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chatWithGemini(@RequestBody ChatRequest request) {
        String inputPrompt = request.getMessage() != null ? request.getMessage() : request.getPrompt();
        if (inputPrompt == null || inputPrompt.isBlank()) {
            inputPrompt = "Hello AI";
        }

        String aiReply = geminiClientService.generateContent(inputPrompt);

        Map<String, Object> response = new HashMap<>();
        response.put("reply", aiReply);
        response.put("provider", "Google Gemini");
        response.put("model", "gemini-1.5-flash");
        response.put("status", "SUCCESS");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAIStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("provider", "Google Gemini API");
        response.put("model", "gemini-1.5-flash");
        response.put("status", "ONLINE");
        return ResponseEntity.ok(response);
    }
}
