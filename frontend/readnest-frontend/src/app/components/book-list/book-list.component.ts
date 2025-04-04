import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../book';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    this.bookService.getBooks().subscribe({
      next: (data) => {
        console.log('Books loaded:', data);
        this.books = data;
      },
      error: (err) => {
        console.error('Error fetching books:', err);
      }
    });
  }
}
