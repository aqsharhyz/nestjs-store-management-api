import { CategoryResponse } from 'src/category/category.model';

export class ProductResponse {
  id: number;
  code: string;
  name: string;
  price: number;
  description: string;
  quantityInStock: number;
  categoryId?: number;
  category?: CategoryResponse;
  supplierId?: number;
  //   supplier?: SupplierResponse;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CreateProductRequest {
  code: string;
  name: string;
  price: number;
  description: string;
  quantityInStock: number;
  categoryId: number;
  supplierId: number;
}

export class updateProductRequest {
  code?: string;
  name?: string;
  price?: number;
  description?: string;
  quantityInStock?: number;
  categoryId?: number;
  supplierId?: number;
}

export class updateProductStockRequest {
  quantity: number;
}

export class SearchProductRequest {}

export class SimpleSearchProductRequest {}
