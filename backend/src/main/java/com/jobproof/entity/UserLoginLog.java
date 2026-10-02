package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_login_logs")
public class UserLoginLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String email;

    @Column(name = "login_status", nullable = false)
    private String loginStatus = "SUCCESS";

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "logged_in_at", nullable = false, updatable = false)
    private LocalDateTime loggedInAt;

    public UserLoginLog() {}

    public UserLoginLog(Long id, Long userId, String email, String loginStatus, String ipAddress, String userAgent, LocalDateTime loggedInAt) {
        this.id = id;
        this.userId = userId;
        this.email = email;
        this.loginStatus = loginStatus != null ? loginStatus : "SUCCESS";
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.loggedInAt = loggedInAt != null ? loggedInAt : LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.loggedInAt == null) {
            this.loggedInAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLoginStatus() { return loginStatus; }
    public void setLoginStatus(String loginStatus) { this.loginStatus = loginStatus; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public LocalDateTime getLoggedInAt() { return loggedInAt; }
    public void setLoggedInAt(LocalDateTime loggedInAt) { this.loggedInAt = loggedInAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String email;
        private String loginStatus = "SUCCESS";
        private String ipAddress;
        private String userAgent;
        private LocalDateTime loggedInAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder loginStatus(String loginStatus) { this.loginStatus = loginStatus; return this; }
        public Builder ipAddress(String ipAddress) { this.ipAddress = ipAddress; return this; }
        public Builder userAgent(String userAgent) { this.userAgent = userAgent; return this; }
        public Builder loggedInAt(LocalDateTime loggedInAt) { this.loggedInAt = loggedInAt; return this; }

        public UserLoginLog build() {
            return new UserLoginLog(id, userId, email, loginStatus, ipAddress, userAgent, loggedInAt);
        }
    }
}
