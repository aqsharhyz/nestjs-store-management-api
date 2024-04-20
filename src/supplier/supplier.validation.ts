import { ZodType, z } from 'zod';

export class SupplierValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(50),
    phone: z.string().min(1).max(15),
    address: z.string().min(1).max(255).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(50).optional(),
    phone: z.string().min(1).max(15).optional(),
    address: z.string().min(1).max(255).optional(),
  });
}
