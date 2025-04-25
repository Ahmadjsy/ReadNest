import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Invalid email or password.';
      }
    });
  }
}
