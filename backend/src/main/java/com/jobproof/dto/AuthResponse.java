package com.jobproof.dto;

public class AuthResponse {
    private String token;
    private UserDTO user;

    public AuthResponse() {}

    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token;
        private UserDTO user;

        public Builder token(String token) { this.token = token; return this; }
        public Builder user(UserDTO user) { this.user = user; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, user);
        }
    }
}
