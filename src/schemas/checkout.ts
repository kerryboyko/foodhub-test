import { z } from 'zod';

export const CheckoutSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Enter a valid email'),
    fulfilmentType: z.enum(['delivery', 'collection']),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    postcode: z.string().optional(),
    notes: z.string().optional(),
    creditCard: z.string().optional(),
    ccExpiration: z.string().optional(),
    ccCVCcode: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.fulfilmentType === 'delivery') {
      if (!data.addressLine1) {
        ctx.addIssue({
          code: 'custom',
          path: ['addressLine1'],
          message: 'Address is required for delivery'
        });
      }

      if (!data.postcode) {
        ctx.addIssue({
          code: 'custom',
          path: ['postcode'],
          message: 'Postcode is required for delivery'
        });
      }
    }

    if (!data.creditCard) {
      ctx.addIssue({
        code: 'custom',
        path: ['creditCard'],
        message: 'Card number is required'
      });
    }

    if (!data.ccExpiration) {
      ctx.addIssue({
        code: 'custom',
        path: ['ccExpiration'],
        message: 'Expiration date is required'
      });
    }

    if (!data.ccCVCcode) {
      ctx.addIssue({
        code: 'custom',
        path: ['ccCVCcode'],
        message: 'CVC is required'
      });
    }
  });

export type CheckoutFormData = z.infer<typeof CheckoutSchema>;
