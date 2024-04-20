import { ZodType, z } from 'zod';

export class CategoryValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(50),
    description: z.string().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(50).optional(),
    description: z.string().optional(),
  });
}
