import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../book';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnChanges {
  @Input() editingBook: Book | null = null;

  selectedLanguage: string = '';
  selectedCategory: string = '';
  searchQuery: string = '';

  newBook: Book = {
    title: '',
    author: '',
    category: '',
    totalPages: 0,
    pagesRead: 0,
    description: '',
    notes: '',
    rating: 0,
    readingStatus: 'Unread'
  };

  constructor(private bookService: BookService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingBook'] && this.editingBook) {
      this.newBook = { ...this.editingBook };
    }
  }

  submitBook(): void {
    if (this.newBook.id) {
      // Edit existing book
      this.bookService.updateBook(this.newBook).subscribe({
        next: (book) => {
          console.log('Book updated:', book);
          alert('Book updated successfully!');
        },
        error: (err) => {
          console.error('Error updating book:', err);
          alert('Error updating book');
        }
      });
    } else {
      // Add new book
      this.bookService.addBook(this.newBook).subscribe({
        next: (book) => {
          console.log('Book added:', book);
          alert('Book added successfully!');
        },
        error: (err) => {
          console.error('Error adding book:', err);
          alert('Error adding book');
        }
      });
    }
  
    console.log('Book to submit:', this.newBook);
  }  

  fetchBookInfo(): void {
    const query = this.searchQuery.trim();

    if (!query) {
      alert('Please enter a title or ISBN.');
      return;
    }

    const isISBN = /^\d{10}(\d{3})?$/.test(query);
    const url = isISBN
      ? `https://www.googleapis.com/books/v1/volumes?q=isbn:${query}`
      : `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (!data.items || data.items.length === 0) {
          alert('No matching books found.');
          return;
        }

        const book = data.items[0].volumeInfo;

        this.newBook.title = book.title || '';
        this.newBook.author = book.authors?.[0] || 'Unknown Author';
        this.newBook.totalPages = book.pageCount || 0;
        this.newBook.category = book.categories?.[0] || 'Uncategorized';
        this.newBook.description = book.description || '';
        this.newBook.coverUrl = book.imageLinks?.thumbnail || '';
        console.log('Cover URL:', this.newBook.coverUrl);
      })
      .catch(error => {
        console.error('Error fetching book info from Google Books:', error);
        alert('Failed to fetch book info.');
      });
  }
}
