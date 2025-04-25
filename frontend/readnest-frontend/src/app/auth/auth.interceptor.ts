import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  const router = inject(Router);

  return next(cloned).pipe(
    tap({
      error: (err) => {
        if (err.status === 403 || err.status === 401) {
          console.warn('Token expired or unauthorized — logging out.');
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
      }
    })
  );
};
