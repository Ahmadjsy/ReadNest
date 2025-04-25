import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';
  success: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
  
    this.authService.register({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.success = res.message;
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.error = 'Registration failed. Email may already be taken.';
        this.success = '';
      }
    });
  }
}
