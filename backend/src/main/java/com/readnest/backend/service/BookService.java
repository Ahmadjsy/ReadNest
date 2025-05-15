package com.readnest.backend.service;

import com.readnest.backend.model.Book;
import com.readnest.backend.repository.BookRepository;
import com.readnest.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book createBook(Book book) {
        if (bookRepository.existsByTitleAndAuthorAndUser(book.getTitle(), book.getAuthor(), book.getUser())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This book already exists.");
        }
        int read = book.getPagesRead();
        int total = book.getTotalPages();
        if (read >= total && total > 0) {
            book.setReadingStatus("Read");
        } else if (read > 0) {
            book.setReadingStatus("Reading");
        } else {
            book.setReadingStatus("Unread");
        }
        return bookRepository.save(book);
    }
    public List<Book> getBooksByUser(User user) {
        return bookRepository.findByUser(user); 
    }
    public Book updateBook(Long id, Book bookDetails) {
    Book book = bookRepository.findById(id).orElseThrow();
    book.setTitle(bookDetails.getTitle());
    book.setAuthor(bookDetails.getAuthor());
    book.setCategory(bookDetails.getCategory());
    book.setTotalPages(bookDetails.getTotalPages());
    book.setPagesRead(bookDetails.getPagesRead());
    book.setNotes(bookDetails.getNotes());
    book.setDescription(bookDetails.getDescription());
    book.setCoverUrl(bookDetails.getCoverUrl());
    book.setReadingStatus(bookDetails.getReadingStatus());
    book.setReReadability(bookDetails.getReReadability());
    int read = bookDetails.getPagesRead();
    int total = bookDetails.getTotalPages();
    if (read >= total && total > 0) {
        book.setReadingStatus("Read");
    } else if (read > 0) {
        book.setReadingStatus("Reading");
    } else {
        book.setReadingStatus("Unread");
    }
    return bookRepository.save(book);
}

public Book updateCover(Long id, String newCoverUrl) {
    Book book = bookRepository.findById(id).orElseThrow();

    String oldCover = book.getCoverUrl();
    if (oldCover != null && oldCover.startsWith("/uploads/")) {
        File oldFile = new File("uploads", oldCover.substring("/uploads/".length()));
        if (oldFile.exists()) {
            oldFile.delete();
        }
    }

    book.setCoverUrl(newCoverUrl);
    return bookRepository.save(book);
}

public boolean existsByIsbnAndUser(String isbn, User user) {
    return bookRepository.existsByIsbnAndUserId(isbn, user.getId());
}

public void deleteBook(Long id) {
    Book book = bookRepository.findById(id).orElseThrow();

    String coverUrl = book.getCoverUrl();
    if (coverUrl != null && coverUrl.startsWith("/uploads/")) {
        File imageFile = new File("uploads", coverUrl.substring("/uploads/".length()));
        if (imageFile.exists()) {
            imageFile.delete();
        }
    }

    bookRepository.deleteById(id);
}
public Book getBookById(Long id) {
    return bookRepository.findById(id).orElseThrow();
}
}
