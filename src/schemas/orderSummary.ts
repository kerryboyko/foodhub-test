import { z } from 'zod';

export const OrderSummaryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  priceCents: z.number().int().nonnegative(),
  quantity: z.number().int().positive()
});

export const OrderSummarySchema = z.object({
  items: z.array(OrderSummaryItemSchema).min(1),
  subtotalCents: z.number().int().nonnegative(),
  deliveryChargeCents: z.number().int().nonnegative(),
  totalCents: z.number().int().nonnegative()
});

export type OrderSummaryItem = z.infer<typeof OrderSummaryItemSchema>;
export type OrderSummary = z.infer<typeof OrderSummarySchema>;
