package com.jobproof.controller;

import com.jobproof.dto.AuthRequest;
import com.jobproof.dto.AuthResponse;
import com.jobproof.dto.UserDTO;
import com.jobproof.entity.UserLoginLog;
import com.jobproof.repository.UserLoginLogRepository;
import com.jobproof.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserLoginLogRepository userLoginLogRepository;

    public AuthController(AuthService authService, UserLoginLogRepository userLoginLogRepository) {
        this.authService = authService;
        this.userLoginLogRepository = userLoginLogRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest req, HttpServletRequest request) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            AuthResponse response = authService.register(req, ip, userAgent);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Registration error: " + ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req, HttpServletRequest request) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            AuthResponse response = authService.login(req, ip, userAgent);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Login error: " + ex.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestParam String email) {
        try {
            UserDTO profile = authService.getUserProfileByEmail(email);
            return ResponseEntity.ok(profile);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/login-logs")
    public ResponseEntity<List<UserLoginLog>> getRecentLoginLogs() {
        List<UserLoginLog> logs = userLoginLogRepository.findTop20ByOrderByLoggedInAtDesc();
        return ResponseEntity.ok(logs);
    }
}
