import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { Book } from './book';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookListComponent, BookFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'readnest-frontend';

  selectedBook: Book | null = null;

  handleEdit(book: Book): void {
    this.selectedBook = book;
  }
}
