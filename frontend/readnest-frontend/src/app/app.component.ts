import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Book } from './book';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'readnest-frontend';
  selectedBook: Book | null = null;

  constructor(public authService: AuthService, private router: Router) {
    const isLoggedIn = this.authService.isLoggedIn();
    const currentRoute = this.router.url;

    if (!isLoggedIn && currentRoute !== '/login') {
      this.router.navigate(['/login']);
    }

    if (isLoggedIn && (currentRoute === '/login' || currentRoute === '/register')) {
      this.router.navigate(['/books']);
    }
  }

  handleEdit(book: Book): void {
    this.selectedBook = book;
  }

  toggleDarkMode(): void {
    document.body.classList.toggle('dark-mode');
  }

  logout(): void {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
