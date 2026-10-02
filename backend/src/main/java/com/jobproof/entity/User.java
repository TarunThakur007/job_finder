package com.jobproof.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "headline")
    private String headline;

    @Column(name = "company")
    private String company;

    @Column(name = "location")
    private String location;

    @Column(name = "phone")
    private String phone;

    @Column(name = "bio", length = 2000)
    private String bio;

    @Column(name = "years_of_experience")
    private Double yearsOfExperience = 0.0;

    @Column(name = "skills", length = 2000)
    private String skills;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public User() {}

    public User(Long id, String name, String email, String password, Role role, 
                String headline, String company, String location, String phone, 
                String bio, Double yearsOfExperience, String skills, 
                LocalDateTime lastLoginAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.headline = headline;
        this.company = company;
        this.location = location;
        this.phone = phone;
        this.bio = bio;
        this.yearsOfExperience = yearsOfExperience != null ? yearsOfExperience : 0.0;
        this.skills = skills;
        this.lastLoginAt = lastLoginAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Double getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Double yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static UserBuilder builder() { return new UserBuilder(); }

    public static class UserBuilder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private Role role;
        private String headline;
        private String company;
        private String location;
        private String phone;
        private String bio;
        private Double yearsOfExperience = 0.0;
        private String skills;
        private LocalDateTime lastLoginAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder headline(String headline) { this.headline = headline; return this; }
        public UserBuilder company(String company) { this.company = company; return this; }
        public UserBuilder location(String location) { this.location = location; return this; }
        public UserBuilder phone(String phone) { this.phone = phone; return this; }
        public UserBuilder bio(String bio) { this.bio = bio; return this; }
        public UserBuilder yearsOfExperience(Double yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; return this; }
        public UserBuilder skills(String skills) { this.skills = skills; return this; }
        public UserBuilder lastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public User build() {
            return new User(id, name, email, password, role, headline, company, location, 
                            phone, bio, yearsOfExperience, skills, lastLoginAt, createdAt, updatedAt);
        }
    }

    public enum Role {
        ROLE_USER,
        ROLE_EMPLOYEE,
        ROLE_ADMIN
    }
}
