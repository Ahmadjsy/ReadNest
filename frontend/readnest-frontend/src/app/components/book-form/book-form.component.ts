import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../book';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
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
  searchResults: any[] = [];
  showSearchResults: boolean = false;

  newBook: Book = {
    isbn: '',
    title: '',
    author: '',
    category: '',
    totalPages: 1,
    pagesRead: 0,
    description: '',
    notes: '',
    readingStatus: 'Unread'
  };

  constructor(
    private bookService: BookService,
    private router: Router,
    private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingBook'] && this.editingBook) {
      this.newBook = { ...this.editingBook };
    }
  }

  updateReadingStatus(): void {
    if (!this.newBook) return;

    const read = this.newBook.pagesRead ?? 0;
    const total = this.newBook.totalPages ?? 0;

    if (read >= total && total > 0) {
      this.newBook.readingStatus = 'Read';
    } else if (read > 0) {
      this.newBook.readingStatus = 'Reading';
    } else {
      this.newBook.readingStatus = 'Unread';
    }
  }

  submitBook(): void {
    if (this.newBook.totalPages < 1) {
      alert('Total pages must be at least 1.');
      return;
    }
    if (this.newBook.pagesRead < 0) {
      alert('Pages read cannot be negative.');
      return;
    }
    if (this.newBook.pagesRead > this.newBook.totalPages) {
      alert('Pages read cannot exceed total pages.');
      return;
    }    
    if (!this.newBook.title || !this.newBook.author) {
      alert('Please provide a title and author.');
      return;
    }
    if (this.newBook.totalPages <= 0) {
      const proceed = confirm('Total Pages is not provided or is 0. Do you still want to continue?');
      if (!proceed) return;
    }
    if (this.newBook.id) {
      this.bookService.updateBook(this.newBook).subscribe({
        next: (book) => {
          console.log('Book updated:', book);
          alert('Book updated successfully!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error updating book:', err);
          alert('Error updating book');
        }
      });
    } else {
      this.updateReadingStatus();
      const formData = new FormData();
      formData.append('book', new Blob([JSON.stringify(this.newBook)], { type: 'application/json' }));
  
      if (this.selectedImageFile) {
        formData.append('cover', this.selectedImageFile);
      }
      this.bookService.addBook(formData).subscribe({
         next: (book) => {
      this.router.navigate(['/']);
    },
    error: (err) => {
      if (err.status === 409) {
        alert('This book already exists.');
      } else if (err.status === 401) {
        alert('Your session has expired. Please log in again.');
        this.authService.logout();
      } else {
        alert('An unexpected error occurred.');
        console.error(err);
      }
    }
  });
    }
  }
  getBestImageLink(book: any): string {
    const links = book.imageLinks || {};
  
    return (
      links.extraLarge ||
      links.large ||
      links.medium ||
      links.small ||
      links.smallThumbnail ||
      (links.thumbnail?.includes('zoom=') 
        ? links.thumbnail.replace(/zoom=\d/, 'zoom=2') 
        : links.thumbnail) ||
      'assets/noimage.png'
    );
  }
  selectSearchResult(result: any): void {
    const book = result.volumeInfo;
    this.newBook.isbn = result.volumeInfo.industryIdentifiers?.[0]?.identifier || '';
    this.newBook.title = book.title || '';
    this.newBook.author = book.authors?.[0] || 'Unknown Author';
    this.newBook.totalPages = book.pageCount || 0;
    this.newBook.category = book.categories?.[0] || 'Uncategorized';
    this.newBook.description = book.description || '';
  
    const links = book.imageLinks || {};
    const selectedUrl = links.extraLarge || links.large || links.medium || links.thumbnail || links.smallThumbnail || '';

    this.newBook.coverUrl = selectedUrl || 'assets/noimage.png';
    this.finalizeSelection();
  }
  
  finalizeSelection(): void {
    console.log('Final Cover URL:', this.newBook.coverUrl);
    this.searchResults = [];
    this.showSearchResults = false;
  }
  
  fetchBookInfo(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      alert('Please enter a title or ISBN.');
      return;
    }
  
    const isISBN = /^\d{10}(\d{3})?$/.test(query);
    const url = isISBN
    ? `https://www.googleapis.com/books/v1/volumes?q=isbn:${query}&maxResults=20&orderBy=relevance&langRestrict=en`
    : `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&maxResults=20&orderBy=relevance&langRestrict=en`;
  
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data.items || data.items.length === 0) {
          alert('No matching books found.');
          return;
        }
  
        this.searchResults = data.items.slice(0, 20);
        this.showSearchResults = true;
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        alert('Failed to fetch book info.');
      });
  }
  onSearchEnter(event: any): void {
    event.preventDefault();
    this.fetchBookInfo();
  }
  selectedImageFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImageFile = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  resetForm(): void {
    this.newBook = {
      isbn: '',
      title: '',
      author: '',
      category: '',
      totalPages: 0,
      pagesRead: 0,
      description: '',
      notes: '',
      coverUrl: '',
      readingStatus: 'Unread',
      reReadability: 0
    };
    this.searchQuery = '';
    this.previewUrl = null;
    this.editingBook = null;
  }
  
}
