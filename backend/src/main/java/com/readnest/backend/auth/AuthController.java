package com.readnest.backend.auth;

import com.readnest.backend.model.User;
import com.readnest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Collections;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthenticationManager authManager;
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user, BindingResult result) {
        if (result.hasErrors()) {
            String errorMessage = result.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", errorMessage));
        }

        if (userRepo.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Email already registered."));
        }

        String rawPassword = user.getPassword();


        if (rawPassword.length() < 8 ||
            !rawPassword.matches(".*[A-Z].*") ||
            !rawPassword.matches(".*[a-z].*") ||
            !rawPassword.matches(".*\\d.*") ||
            !rawPassword.matches(".*[@$!%*?&].*")) {
            return ResponseEntity.badRequest().body(Collections.singletonMap(
                "message", "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
            ));
        }

        user.setPassword(passwordEncoder.encode(rawPassword));
        userRepo.save(user);

        return ResponseEntity.ok(Collections.singletonMap("message", "User registered successfully"));
    }

   @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request, BindingResult result) {
        if (result.hasErrors()) {
            String errorMessage = result.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", errorMessage));
        }

        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepo.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
