import { ProductResponse } from '../product/product.model';
import { Supplier } from '@prisma/client';

export class SupplierResponse implements Supplier {
  id: number;
  name: string;
  phone: string;
  address: string;
  products?: ProductResponse[];
}

export class CreateSupplierRequest {
  name: string;
  phone: string;
  address?: string;
}

export class UpdateSupplierRequest {
  name?: string;
  phone?: string;
  address?: string;
}
