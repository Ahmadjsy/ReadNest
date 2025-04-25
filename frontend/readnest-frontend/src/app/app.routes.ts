import { Routes } from '@angular/router';

import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'add', component: BookFormComponent },
  { path: 'book/:id', component: BookDetailComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
