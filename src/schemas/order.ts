import { z } from 'zod';
import { CheckoutSchema } from './checkout';
import { OrderSummarySchema } from './orderSummary';

export const OrderSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  customer: CheckoutSchema,
  order: OrderSummarySchema,
  kitchenSummary: z.string().nullable().optional()
});

export type Order = z.infer<typeof OrderSchema>;
