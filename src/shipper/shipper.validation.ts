import { ZodType, z } from 'zod';

export class ShipperValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    phone: z.string().min(1).max(15),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().min(1).max(15).optional(),
  });
}
