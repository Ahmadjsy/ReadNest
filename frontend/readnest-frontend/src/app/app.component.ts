import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
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
  this.router.events.subscribe(event => {
  if (event instanceof NavigationStart) {
    const isLoggedIn = this.authService.isLoggedIn();
    const url = event.url;

    if (isLoggedIn && (url === '/login' || url === '/register')) {
      if (this.router.url !== '/books') {
        this.router.navigate(['/books']);
      }
    }

    if (!isLoggedIn && url !== '/login' && url !== '/register') {
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    }
  }
});
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
