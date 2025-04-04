export interface Book {
  id?: number;
  title: string;
  author: string;
  category: string;
  totalPages: number;
  pagesRead: number;
  notes: string;
  rating: number;
  description?: string;
  coverUrl?: string;
  readingStatus: string;
}
