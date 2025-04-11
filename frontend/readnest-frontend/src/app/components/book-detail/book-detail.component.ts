import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../book';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBooks().subscribe((books) => {
      this.book = books.find((b) => b.id === id) || null;
    });
  }

  deleteBook(): void {
    if (!this.book || !this.book.id) {
      alert('Book not found or ID missing.');
      return;
    }

    const confirmed = confirm('Are you sure you want to delete this book?');
    if (!confirmed) return;

    this.bookService.deleteBook(this.book.id).subscribe({
      next: () => {
        alert('Book deleted successfully!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error deleting book:', err);
        alert('Error deleting book');
      }
    });
  }

  saveChanges(): void {
    if (this.book && this.book.id) {
      this.bookService.updateBook(this.book).subscribe({
        next: (updatedBook) => {
          console.log('Book updated:', updatedBook);
          alert('Changes saved successfully!');
        },
        error: (err) => {
          console.error('Error saving changes:', err);
          alert('Failed to save changes.');
        }
      });
    }
  }
}
