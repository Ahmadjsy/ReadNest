import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../book';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  selectedCoverFile: File | null = null;
  isImageModalOpen = false;
  previewUrl: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private http: HttpClient
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
    if (!this.book) return;
  
    if (this.book.totalPages < 1) {
      alert('Total pages must be at least 1.');
      return;
    }
  
    if (this.book.pagesRead < 0) {
      alert('Pages read cannot be negative.');
      return;
    }
  
    if (this.book.pagesRead > this.book.totalPages) {
      alert('Pages read cannot exceed total pages.');
      return;
    }
  
    if (this.selectedCoverFile && this.book.id) {
      const formData = new FormData();
      formData.append('cover', this.selectedCoverFile);
  
      this.http.put<Book>(`http://localhost:8080/api/books/${this.book.id}/cover`, formData)
        .subscribe({
          next: (updatedBook) => {
            this.book!.coverUrl = updatedBook.coverUrl;
            this.selectedCoverFile = null;
            this.updateBookInfo();
          },
          error: (err) => {
            console.error('Error uploading cover:', err);
            alert('Failed to upload cover image.');
          }
        });
    } else {
      this.updateBookInfo();
    }
  }
  

  updateBookInfo(): void {
    if (!this.book || !this.book.id) return;
  
    this.bookService.updateBook(this.book).subscribe({
      next: () => {
        alert('Changes saved successfully!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error saving changes:', err);
        alert('Failed to save changes.');
      }
    });
  }

  getCoverImageUrl(): string {
    if (this.previewUrl) return this.previewUrl;
  
    if (!this.book?.coverUrl) return 'assets/noimage.png';
  
    if (this.book.coverUrl.startsWith('http') || this.book.coverUrl.startsWith('assets/')) {
      return this.book.coverUrl;
    }
  
    return `http://localhost:8080${this.book.coverUrl}`;
  }
  

  async onCoverFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;
  
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true
    };
  
    try {
      const compressedFile = await imageCompression(file, options);
      this.selectedCoverFile = compressedFile;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Compression error:', error);
      alert('Failed to compress image.');
    }
  }
  
  

  toggleImageModal(): void {
    this.isImageModalOpen = !this.isImageModalOpen;
  }
}
