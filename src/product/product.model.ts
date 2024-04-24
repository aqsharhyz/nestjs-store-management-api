import { CategoryResponse } from '../category/category.model';
import { SupplierResponse } from '../supplier/supplier.model';

export class ProductResponse {
  id: number;
  code: string;
  name: string;
  price: number;
  description: string;
  weight: number;
  stock: number;
  product_image: string;
  category_id: number;
  category?: CategoryResponse;
  supplier_id?: number;
  supplier?: SupplierResponse;
  created_at?: Date;
  updated_at?: Date;
}

export class CreateProductRequest {
  code: string;
  name: string;
  price: number;
  description: string;
  weight: number;
  stock: number;
  product_image: string;
  category_id: number;
  supplier_id: number;
}

export class updateProductRequest {
  code?: string;
  name?: string;
  price?: number;
  description?: string;
  weight?: number;
  stock?: number;
  product_image: string;
  category_id?: number;
  supplier_id?: number;
}

export class updateProductStockRequest {
  quantity: number;
}

export class SearchProductRequest {
  code?: string;
  name?: string;
  price?: number;
  description?: string;
  weight?: number;
  stock?: number;
  category_id?: number;
  supplier_id?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export class SimpleSearchProductRequest {
  search?: string;
  page?: number;
}
