package com.readnest.backend.repository;

import com.readnest.backend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import com.readnest.backend.model.User;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    boolean existsByTitleAndAuthor(String title, String author);
    List<Book> findByUser(User user);
    boolean existsByTitleAndAuthorAndUser(String title, String author, User user);
}
