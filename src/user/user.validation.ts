import { ZodType, z } from 'zod';

function phoneNumberVerification(value: string): boolean {
  return /^\+?[1-9]\d{1,14}$/.test(value);
}

function passwordValidation(password: string): boolean {
  // Implement your password validation logic here
  // For example, you can check if the password contains at least one digit, one lowercase letter, one uppercase letter, and one special character:
  return (
    /\d/.test(password) &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)
  );
}

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3).max(100),
    password: z
      .string()
      .min(6)
      .max(100)
      .refine((value) => /\d/.test(value), {
        message: 'Password must contain at least one digit',
      })
      .refine((value) => /[a-z]/.test(value), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine(
        (value) => /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value),
        {
          message: 'Password must contain at least one special character',
        },
      ),
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().refine(phoneNumberVerification, {
      message: 'Invalid phone number',
    }),
    address: z.string().min(1).max(200).optional(),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE_PROFILE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z
      .string()
      .refine(phoneNumberVerification, {
        message: 'Invalid phone number',
      })
      .optional(),
    address: z.string().min(1).max(200).optional(),
  });

  static readonly UPDATE_PASSWORD: ZodType = z.object({
    old_password: z.string().min(1).max(100),
    new_password: z.string().min(6).max(100).refine(passwordValidation, {
      message:
        'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character',
    }),
  });
}
