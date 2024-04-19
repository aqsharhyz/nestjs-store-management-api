import { ZodType, z } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(6).max(100),
    name: z.string().min(1).max(100),
    email: z.string().email(),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE_PROFILE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
  });

  static readonly UPDATE_PASSWORD: ZodType = z.object({
    old_password: z.string().min(6).max(100),
    new_password: z.string().min(6).max(100),
  });
}
