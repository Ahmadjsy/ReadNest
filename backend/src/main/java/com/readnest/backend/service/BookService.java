package com.readnest.backend.service;

import com.readnest.backend.model.Book;
import com.readnest.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book createBook(Book book) {
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


    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
