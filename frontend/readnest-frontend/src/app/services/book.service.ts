import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../book';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(formData: FormData): Observable<Book> {
  const token = localStorage.getItem('token'); 
  return this.http.post<Book>(this.apiUrl, formData, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
}

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${book.id}`, book);
  }
  deleteBook(id: number) {
    return this.http.delete(`http://localhost:8080/api/books/${id}`);
  }
  
}
