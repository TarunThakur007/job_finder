package com.jobproof.dto;

import java.time.LocalDateTime;
import java.util.List;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String role;
    private String company;
    private String title;
    private String author;
    private List<String> permissions;
    private LocalDateTime createdAt;

    public UserDTO() {}

    public UserDTO(Long id, String name, String email, String password, String role, String company, String title, String author, List<String> permissions, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.company = company;
        this.title = title;
        this.author = author;
        this.permissions = permissions;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public List<String> getPermissions() { return permissions; }
    public void setPermissions(List<String> permissions) { this.permissions = permissions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private String role;
        private String company;
        private String title;
        private String author;
        private List<String> permissions;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder company(String company) { this.company = company; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder author(String author) { this.author = author; return this; }
        public Builder permissions(List<String> permissions) { this.permissions = permissions; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public UserDTO build() {
            return new UserDTO(id, name, email, password, role, company, title, author, permissions, createdAt);
        }
    }
}
