import z from 'zod';
import { CheckoutSchema } from './checkout';

export const OrderSchema = CheckoutSchema.extend({
  id: z.string(),
  createdAt: z.string()
});

export type Order = z.infer<typeof OrderSchema>;
