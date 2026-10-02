package com.jobproof.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth",
                    "/api/auth/**", 
                    "/api/experiences",
                    "/api/experiences/**", 
                    "/api/users",
                    "/api/users/**",
                    "/api/admin",
                    "/api/admin/**", 
                    "/api/employee",
                    "/api/employee/**", 
                    "/api/applications",
                    "/api/applications/**", 
                    "/api/public",
                    "/api/public/**", 
                    "/api/jobs",
                    "/api/jobs/**", 
                    "/api/companies",
                    "/api/companies/**", 
                    "/api/ai",
                    "/api/ai/**", 
                    "/api/health",
                    "/api/health/**", 
                    "/api/resumes",
                    "/api/resumes/**", 
                    "/api/notifications",
                    "/api/notifications/**",
                    "/h2-console/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
