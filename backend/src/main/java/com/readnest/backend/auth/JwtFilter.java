package com.readnest.backend.auth;

import com.readnest.backend.model.User;
import com.readnest.backend.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.util.List;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepo;

    @Override
protected void doFilterInternal(HttpServletRequest request,
     HttpServletResponse response,
     FilterChain filterChain) throws ServletException, IOException {

    String path = request.getRequestURI();

    if (path.startsWith("/api/auth") || path.startsWith("/uploads")) {
    filterChain.doFilter(request, response);
    return;
}

    final String authHeader = request.getHeader("Authorization");
    String token = null;
    String email = null;

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
        try {
            email = jwtService.extractEmail(token);
        } catch (JwtException e) {
        }
    }

    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        User user = userRepo.findByEmail(email).orElse(null);
       if (user != null) {
        UsernamePasswordAuthenticationToken authToken =
        new UsernamePasswordAuthenticationToken(
            user,
            null,
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    SecurityContextHolder.getContext().setAuthentication(authToken);
    
}
    }

    filterChain.doFilter(request, response);
}
}
