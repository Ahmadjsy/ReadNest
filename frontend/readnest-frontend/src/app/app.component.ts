import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Book } from './book';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'readnest-frontend';

  selectedBook: Book | null = null;

  handleEdit(book: Book): void {
    this.selectedBook = book;
  }
  toggleDarkMode(): void {
    document.body.classList.toggle('dark-mode');
  }  
}
