package com.jobproof.service;

import com.jobproof.dto.AuthRequest;
import com.jobproof.dto.AuthResponse;
import com.jobproof.dto.UserDTO;
import com.jobproof.entity.User;
import com.jobproof.entity.UserLoginLog;
import com.jobproof.repository.UserLoginLogRepository;
import com.jobproof.repository.UserRepository;
import com.jobproof.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final UserLoginLogRepository userLoginLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       UserLoginLogRepository userLoginLogRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.userLoginLogRepository = userLoginLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(AuthRequest req, String ipAddress, String userAgent) {
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email cannot be blank");
        }
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password cannot be blank");
        }

        String cleanEmail = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new IllegalArgumentException("An account with email " + cleanEmail + " already exists. Please log in.");
        }

        String name = (req.getName() != null && !req.getName().isBlank()) ? req.getName().trim() : cleanEmail.split("@")[0];

        // BCrypt hash password
        String hashedPassword = passwordEncoder.encode(req.getPassword());

        User user = User.builder()
                .name(name)
                .email(cleanEmail)
                .password(hashedPassword)
                .role(User.Role.ROLE_USER)
                .lastLoginAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        // Record initial login log
        userLoginLogRepository.save(UserLoginLog.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .loginStatus("SUCCESS")
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .loggedInAt(LocalDateTime.now())
                .build());

        log.info("[AuthService] Registered new candidate user id={}, email={}", savedUser.getId(), savedUser.getEmail());

        return createAuthResponse(savedUser);
    }

    @Transactional
    public AuthResponse login(AuthRequest req, String ipAddress, String userAgent) {
        String cleanEmail = req.getEmail() != null ? req.getEmail().trim().toLowerCase() : "";
        
        User user = userRepository.findByEmail(cleanEmail).orElse(null);

        if (user == null) {
            // Auto-provision master administrator or recruiter if not yet in database
            if ("admin@jobproof.io".equals(cleanEmail) || "alex.vance@jobproof.io".equals(cleanEmail)) {
                log.info("[AuthService] Auto-provisioning master Platform Administrator {}...", cleanEmail);
                String adminPass = req.getPassword() != null ? req.getPassword() : "Admin@123";
                user = userRepository.save(User.builder()
                        .name("Platform Admin Author")
                        .email(cleanEmail)
                        .password(passwordEncoder.encode(adminPass))
                        .role(User.Role.ROLE_ADMIN)
                        .headline("Chief Platform Administrator")
                        .company("JobProof Core")
                        .lastLoginAt(LocalDateTime.now())
                        .build());
            } else if ("employee@jobproof.io".equals(cleanEmail) || "sarah.jenkins@google.com".equals(cleanEmail)) {
                log.info("[AuthService] Auto-provisioning Recruiter {}...", cleanEmail);
                String empPass = req.getPassword() != null ? req.getPassword() : "Employee@123";
                user = userRepository.save(User.builder()
                        .name("Sarah Jenkins")
                        .email(cleanEmail)
                        .password(passwordEncoder.encode(empPass))
                        .role(User.Role.ROLE_EMPLOYEE)
                        .headline("Company Recruiter & Hiring Partner")
                        .company("Google")
                        .lastLoginAt(LocalDateTime.now())
                        .build());
            } else {
                // Record failed attempt
                userLoginLogRepository.save(UserLoginLog.builder()
                        .userId(null)
                        .email(cleanEmail)
                        .loginStatus("FAILED_USER_NOT_FOUND")
                        .ipAddress(ipAddress)
                        .userAgent(userAgent)
                        .loggedInAt(LocalDateTime.now())
                        .build());
                throw new IllegalArgumentException("No account found for " + cleanEmail + ". Please sign up first.");
            }
        }

        // Validate password with BCrypt (with graceful upgrade for legacy records)
        boolean passwordMatches = false;
        if (req.getPassword() != null && user.getPassword() != null) {
            if (user.getPassword().startsWith("$2a$") || user.getPassword().startsWith("$2b$") || user.getPassword().startsWith("$2y$")) {
                passwordMatches = passwordEncoder.matches(req.getPassword(), user.getPassword());
            } else if (user.getPassword().equals(req.getPassword())) {
                passwordMatches = true;
                // Upgrade plaintext password to BCrypt hash in DB
                user.setPassword(passwordEncoder.encode(req.getPassword()));
                userRepository.save(user);
            }
        }

        if (!passwordMatches) {
            userLoginLogRepository.save(UserLoginLog.builder()
                    .userId(user.getId())
                    .email(cleanEmail)
                    .loginStatus("FAILED_INVALID_PASSWORD")
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .loggedInAt(LocalDateTime.now())
                    .build());
            throw new IllegalArgumentException("Invalid credentials. Please verify your password.");
        }

        // Update last login timestamp
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Record successful login audit log
        userLoginLogRepository.save(UserLoginLog.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .loginStatus("SUCCESS")
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .loggedInAt(LocalDateTime.now())
                .build());

        log.info("[AuthService] User logged in successfully: id={}, email={}", user.getId(), user.getEmail());

        return createAuthResponse(user);
    }

    public UserDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return mapToDTO(user);
    }

    public UserDTO getUserProfileByEmail(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        return mapToDTO(user);
    }

    private AuthResponse createAuthResponse(User user) {
        String role = user.getRole() != null ? user.getRole().name() : "ROLE_USER";
        String token = jwtService.generateToken(user.getEmail(), role);
        UserDTO userDTO = mapToDTO(user);
        return AuthResponse.builder()
                .token(token)
                .user(userDTO)
                .build();
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : "ROLE_USER")
                .company(user.getCompany())
                .title(user.getHeadline() != null ? user.getHeadline() : "Candidate")
                .createdAt(user.getCreatedAt())
                .permissions(List.of("VIEW_JOBS", "APPLY_JOBS", "ANALYZE_RESUME", "SHARE_EXPERIENCE"))
                .build();
    }
}
