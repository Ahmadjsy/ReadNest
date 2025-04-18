import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../book';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  statusFilter: string = '';
  books: Book[] = [];

  constructor(private bookService: BookService) {}

  get filteredBooks(): Book[] {
    return this.statusFilter
      ? this.books.filter(book => book.readingStatus === this.statusFilter)
      : this.books;
  }
  @Output() bookToEdit = new EventEmitter<Book>();

  editBook(book: Book): void {
    this.bookToEdit.emit(book);
  } 
  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter(book => book.id !== id);
          alert('Book deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          alert('Failed to delete book.');
        }
      });
    }
  }   
  ngOnInit(): void {
    const savedSort = localStorage.getItem('sortOption');
  if (savedSort) {
    this.sortOption = savedSort;
  }
    this.bookService.getBooks().subscribe({
      next: (data) => {
        console.log('Books loaded:', data);
        this.books = data;
        this.sortBooks();
      },
      error: (err) => {
        console.error('Error fetching books:', err);
      }
    });
  }
  getCoverImageUrl(book: Book): string {
    if (!book.coverUrl) return 'assets/noimage.png';
    if (book.coverUrl.startsWith('http')) {
      return book.coverUrl;
    }
    if (book.coverUrl.startsWith('assets/')) {
      return book.coverUrl;
    }
    return `http://localhost:8080${book.coverUrl}`;
  }
  
  sortOption: string = 'author-asc';

  sortBooks(): void {
    localStorage.setItem('sortOption', this.sortOption);
  
    this.books.sort((a, b) => {
      const getString = (str?: string) => str?.toLowerCase() || '';
      const getNumber = (num?: number) => num ?? 0;
  
      switch (this.sortOption) {
        case 'author-asc':
          return getString(a.author).localeCompare(getString(b.author));
        case 'author-desc':
          return getString(b.author).localeCompare(getString(a.author));
        case 'title-asc':
          return getString(a.title).localeCompare(getString(b.title));
        case 'title-desc':
          return getString(b.title).localeCompare(getString(a.title));
        case 'reread-desc':
          return getNumber(b.reReadability) - getNumber(a.reReadability);
        case 'reread-asc':
          return getNumber(a.reReadability) - getNumber(b.reReadability);
        case 'unread-first':
          return (a.readingStatus === 'Unread' ? -1 : 1) - (b.readingStatus === 'Unread' ? -1 : 1);
        default:
          return 0;
      }
    });
  }
  
}
