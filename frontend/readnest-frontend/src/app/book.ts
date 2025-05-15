export interface Book {
  id?: number;
  isbn: String;
  title: string;
  author: string;
  category: string;
  totalPages: number;
  pagesRead: number;
  notes: string;
  description?: string;
  coverUrl?: string;
  readingStatus: string;
  reReadability?: number;
}
