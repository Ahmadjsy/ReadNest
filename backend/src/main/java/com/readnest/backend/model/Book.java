package com.readnest.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 512)
    private String title;
    @Column(length = 512)
    private String author;
    @Column(length = 512)
    private String category;
    @Column(columnDefinition = "TEXT")
    private String description;
    private int totalPages;
    private int pagesRead;
    @Column(columnDefinition = "TEXT")
    private String notes;
    private int rating;
    @Column(length = 2048)
    private String coverUrl;
    private String readingStatus;
    // Constructors
    public Book() {}

    public Book(String title, String author, String category, int totalPages) {
        this.title = title;
        this.author = author;
        this.category = category;
        this.totalPages = totalPages;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getPagesRead() {
        return pagesRead;
    }

    public void setPagesRead(int pagesRead) {
        this.pagesRead = pagesRead;
    }
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
    public String getCoverUrl() {
        return coverUrl;
    }
    
    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }
    public String getReadingStatus() {
        return readingStatus;
    }
    
    public void setReadingStatus(String readingStatus) {
        this.readingStatus = readingStatus;
    }    
}
