package com.readnest.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ✅ Let Spring handle ResponseStatusException itself
    @ExceptionHandler(ResponseStatusException.class)
    public void handleResponseStatusException(ResponseStatusException ex) {
        throw ex;
    }

    // ✅ Catch everything else and return 500 manually
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Server error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

