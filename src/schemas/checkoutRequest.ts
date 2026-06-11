import z from 'zod';
import { CheckoutSchema } from './checkout';
import { OrderSummarySchema } from './orderSummary';

export const CheckoutRequestSchema = z.object({
  customer: CheckoutSchema,
  order: OrderSummarySchema
});

export type CheckoutRequestData = z.infer<typeof CheckoutRequestSchema>;
