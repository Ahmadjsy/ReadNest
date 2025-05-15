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
  getProgressHeight(book: Book): number {
    const total = book.totalPages ?? 0;
    const read = book.pagesRead ?? 0;
    return total > 0 ? Math.min((read / total) * 100, 100) : 0;
  }
  sortOption: string = 'author-asc';

  sortBooks(): void {
    localStorage.setItem('sortOption', this.sortOption);

    const getString = (str?: string) => str?.toLowerCase() || '';
    const getNumber = (num?: number) => num ?? 0;
      console.log('Sorting: unread-first');
      this.books.forEach(book =>
        console.log(`${book.title} → "${book.readingStatus}"`)
      );
    this.books.sort((a, b) => {
      switch (this.sortOption) {
        case 'author-asc':
          return getString(a.author).localeCompare(getString(b.author), undefined, {
            sensitivity: 'base',
          });
        case 'author-desc':
          return getString(b.author).localeCompare(getString(a.author), undefined, {
            sensitivity: 'base',
          });
        case 'title-asc':
          return getString(a.title).localeCompare(getString(b.title), undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        case 'title-desc':
          return getString(b.title).localeCompare(getString(a.title), undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        case 'reread-desc':
          return getNumber(b.reReadability) - getNumber(a.reReadability);
        case 'reread-asc':
          return getNumber(a.reReadability) - getNumber(b.reReadability);
        case 'unread-first':
          const statusA = getString(a.readingStatus);
          const statusB = getString(b.readingStatus);

          if (statusA === 'unread' && statusB !== 'unread') return -1;
          if (statusA !== 'unread' && statusB === 'unread') return 1;

          return getString(a.title).localeCompare(getString(b.title), undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        default:
          return 0;
      }
    });
  } 
  
}
