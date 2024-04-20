import { ZodType, z } from 'zod';

export class OrderValidation {
  static readonly CREATE: ZodType = z.object({
    shippingPrice: z.number().positive(),
    comment: z.string().max(255).optional(),
    status: z
      .enum(['In Process', 'Shipped', 'Cancelled', 'Completed'])
      .optional()
      .default('In Process'),
    shipperId: z.number().int().positive(),
    orderDate: z.date().max(new Date()),
    requiredDate: z.date(),
    shippedDate: z.date().optional(),
    orderDetail: z.array(
      z.object({
        productId: z.number().int().positive(),
        quantityOrdered: z.number().int().positive(),
        priceEach: z.number().positive(),
      }),
    ),
  });

  static readonly USER_UPDATE: ZodType = z.object({
    comment: z.string().max(255).optional(),
  });

  static readonly SHIPPING_UPDATE: ZodType = z.object({
    shippedDate: z.date().optional(),
    status: z
      .enum(['In Process', 'Shipped', 'Cancelled', 'Completed'])
      .optional(),
  });
}
