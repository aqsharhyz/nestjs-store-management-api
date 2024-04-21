import { ProductResponse } from 'src/product/product.model';

export class CategoryResponse {
  id?: number;
  name: string;
  // description?: string;
  products?: ProductResponse[];
}

export class CreateCategoryRequest {
  name: string;
  // description?: string;
}

export class UpdateCategoryRequest {
  name?: string;
  // description?: string;
}
