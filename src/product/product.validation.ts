import { ZodType, z } from 'zod';

export class ProductValidation {
  static readonly CREATE: ZodType = z.object({
    code: z.string().min(1).max(15),
    name: z.string().min(3).max(100),
    price: z.number().positive().max(1000000000),
    description: z.string().min(3).max(500),
    weight: z.number().positive().max(1_000_000_000),
    stock: z.number().int().positive().max(100000),
    product_image: z.string(),
    category_id: z.number().int().positive(),
    supplier_id: z.number().int().positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    code: z.string().min(1).max(15).optional(),
    name: z.string().min(3).max(100).optional(),
    price: z.number().positive().max(1000000000).optional(),
    description: z.string().min(3).max(500).optional(),
    weight: z.number().positive().max(1_000_000_000).optional(),
    stock: z.number().int().positive().max(100000).optional(),
    product_image: z.string().optional(),
    category_id: z.number().int().positive().optional(),
    supplier_id: z.number().int().positive().optional(),
  });

  static readonly UPDATE_STOCK: ZodType = z.object({
    quantity: z.number().int().positive(),
  });

  static readonly SEARCH: ZodType = z.object({
    code: z.string().min(1).max(15).optional(),
    name: z.string().min(3).max(100).optional(),
    price: z.number().positive().max(1000000000).optional(),
    description: z.string().min(3).max(500).optional(),
    weight: z.number().positive().max(1_000_000_000).optional(),
    stock: z.number().int().positive().max(100000).optional(),
    category_id: z.number().int().positive().optional(),
    supplier_id: z.number().int().positive().optional(),
    page: z.number().int().positive().optional().default(1),
    size: z.number().int().positive().optional().default(10),
    sort: z.string().optional(),
  });

  static readonly SIMPLE_SEARCH: ZodType = z.object({
    search: z.string().min(1).max(100),
    page: z.number().int().positive().optional().default(1),
  });
}
