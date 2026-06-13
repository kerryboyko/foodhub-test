import { z } from 'zod';
import { CheckoutSchema, SafeCheckoutSchema } from './checkout';
import { OrderSummarySchema } from './orderSummary';

export const OrderSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  customer: CheckoutSchema,
  order: OrderSummarySchema,
  kitchenSummary: z.string().nullable().optional()
});

export const StoredOrderSchema = OrderSchema.omit({
  customer: true
}).extend({
  customer: SafeCheckoutSchema
});

export type Order = z.infer<typeof OrderSchema>;
export type StoredOrder = z.infer<typeof StoredOrderSchema>;
