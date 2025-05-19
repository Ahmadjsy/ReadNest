package com.readnest.backend.controller;

import com.readnest.backend.model.Book;
import com.readnest.backend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import com.readnest.backend.model.User; 

@RestController
@RequestMapping("/api/books")

public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getUserBooks() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return bookService.getBooksByUser(user);
    }

   @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createBook(
            @RequestPart("book") Book book,
            @RequestPart(value = "cover", required = false) MultipartFile coverFile
    ) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    User user = (User) auth.getPrincipal();
    book.setUser(user);

    boolean duplicate = bookService.existsByIsbnAndUser(book.getIsbn(), user);
    System.out.println("Checking for duplicate ISBN: " + book.getIsbn());

    if (duplicate) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Book already exists.");
    }

    if (coverFile != null && !coverFile.isEmpty()) {
        try {
            String uploadPath = new File("uploads").getAbsolutePath();
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + coverFile.getOriginalFilename();
            File dest = new File(uploadDir, fileName);
            coverFile.transferTo(dest);

            book.setCoverUrl("/uploads/" + fileName);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save cover image", e);
        }
    }

    System.out.println("Saving book: " + book.getTitle());
    Book savedBook = bookService.createBook(book);
    return ResponseEntity.ok(savedBook);
}

    @CrossOrigin(origins = "http://localhost:4200")
    @PutMapping(path = "/{id}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Book updateBookCover(
        @PathVariable Long id,
        @RequestPart("cover") MultipartFile coverFile
    ) {
        if (coverFile != null && !coverFile.isEmpty()) {
            try {
                String uploadPath = new File("uploads").getAbsolutePath();
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) uploadDir.mkdirs();
    
                String fileName = System.currentTimeMillis() + "_" + coverFile.getOriginalFilename();
                File dest = new File(uploadDir, fileName);
                coverFile.transferTo(dest);
    
                String coverUrl = "/uploads/" + fileName;
    
                return bookService.updateCover(id, coverUrl);
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to save cover image", e);
            }
        }
    
        return bookService.getBookById(id);
    }
    @CrossOrigin(origins = "http://localhost:4200")
    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        return bookService.updateBook(id, book);
    }


    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }
    
}
