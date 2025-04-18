package com.readnest.backend.service;

import com.readnest.backend.model.Book;
import com.readnest.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
        if (bookRepository.existsByTitleAndAuthor(book.getTitle(), book.getAuthor())) {
            throw new IllegalArgumentException("This book already exists.");
        }
        return bookRepository.save(book);
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
