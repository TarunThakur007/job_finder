package com.jobproof.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public discovery and health endpoints
                .requestMatchers(
                    "/api/auth/**",
                    "/api/health/**",
                    "/actuator/**",
                    "/error",
                    "/h2-console/**"
                ).permitAll()
                // Read-only job and company browsing is public
                .requestMatchers(HttpMethod.GET, "/api/jobs/**", "/api/companies/**", "/api/experiences/**").permitAll()
                // AI chat assistant status / chat public or authenticated
                .requestMatchers("/api/ai/**").permitAll()
                // Protected Admin Endpoints
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                // Protected Employee / Recruiter Endpoints
                .requestMatchers("/api/employee/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_EMPLOYEE")
                // Any other authenticated request
                .anyRequest().permitAll()
            )
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
