export class CommentResponse {
  content: string;
  bookId: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateCommentRequest {
  content: string;
}

export class UpdateCommentRequest {
  content?: string;
}
