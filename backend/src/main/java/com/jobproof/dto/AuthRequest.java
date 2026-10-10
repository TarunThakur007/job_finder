package com.jobproof.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthRequest {
    
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String portal; // "user", "employee", "admin"

    public AuthRequest() {}

    public AuthRequest(String name, String email, String password) {
        this(name, email, password, null);
    }

    public AuthRequest(String name, String email, String password, String portal) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.portal = portal;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPortal() { return portal; }
    public void setPortal(String portal) { this.portal = portal; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name;
        private String email;
        private String password;
        private String portal;

        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder portal(String portal) { this.portal = portal; return this; }

        public AuthRequest build() {
            return new AuthRequest(name, email, password, portal);
        }
    }
}
