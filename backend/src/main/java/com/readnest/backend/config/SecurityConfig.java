package com.readnest.backend.config;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import com.readnest.backend.auth.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

   @Bean
public SecurityFilterChain filterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .exceptionHandling(exception -> exception
            .accessDeniedHandler((request, response, accessDeniedException) -> {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200"); 
                response.getWriter().write("Access Denied");
            })
            .authenticationEntryPoint((request, response, authException) -> {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
                response.getWriter().write("Unauthorized");
            })
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}


    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
}
