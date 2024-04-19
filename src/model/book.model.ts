import { CommentResponse } from './comment.model';

export class BookResponse {
  id: number;
  title: string;
  year: number;
  author: string;
  publisher: string;
  isFinished: boolean;
  categoryName: string | number;
  comments?: CommentResponse[];
}

export class CreateBookRequest {
  title: string;
  year: number;
  author: string;
  publisher: string;
  isFinished: boolean;
  categoryName: string | number;
}

export class UpdateBookRequest {
  id: number;
  title?: string;
  year?: number;
  author?: string;
  publisher?: string;
  isFinished?: boolean;
  categoryName?: string | number;
}

export class SearchBookRequest {
  title?: string;
  year?: number;
  author?: string;
  publisher?: string;
  isFinished?: boolean;
  categoryName?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export class SimpleSearchBookRequest {
  search?: string;
  page?: number;
}
