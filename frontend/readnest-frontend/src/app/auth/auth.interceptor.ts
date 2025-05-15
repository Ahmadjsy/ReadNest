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
        const shouldLogout =
        (err.status === 401 || err.status === 403) &&
        !req.url.includes('/auth/') &&
        !req.url.includes('/api/books') &&
        err.error?.message !== 'Book already exists';


        if (shouldLogout) {
          console.warn('Token expired or unauthorized — logging out.');
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
      }
    })
  );
};

