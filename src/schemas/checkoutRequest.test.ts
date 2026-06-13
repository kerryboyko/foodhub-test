import { describe, expect, it } from 'vitest';
import { CheckoutRequestSchema } from './checkoutRequest';

describe('CheckoutRequestSchema', () => {
  const validCheckoutRequest = {
    customer: {
      name: 'Kerry Ann Burke',
      email: 'kerry@example.com',
      phone: '202 202 2020',
      addressLine1: '123 Test Street',
      notes: 'Please ring the bell',
      fulfilmentType: 'delivery',
      postcode: '90210',
      ccExpiration: '12/99',
      ccCVCcode: '999',
      creditCard: '4242424242424242'
    },
    order: {
      items: [
        {
          id: 'vegetable-spring-rolls',
          name: 'Vegetable Spring Rolls',
          priceCents: 595,
          quantity: 2
        }
      ],
      subtotalCents: 1190,
      deliveryChargeCents: 0,
      totalCents: 1190
    }
  };

  it('accepts a valid checkout request', () => {
    const result = CheckoutRequestSchema.safeParse(validCheckoutRequest);
    expect(result.success).toBe(true);
  });

  it('rejects a request without customer details', () => {
    const invalidCheckoutRequest = {
      ...validCheckoutRequest,
      customer: undefined
    };

    const result = CheckoutRequestSchema.safeParse(invalidCheckoutRequest);

    expect(result.success).toBe(false);
  });

  it('rejects a request without an order summary', () => {
    const invalidCheckoutRequest = {
      ...validCheckoutRequest,
      order: undefined
    };

    const result = CheckoutRequestSchema.safeParse(invalidCheckoutRequest);

    expect(result.success).toBe(false);
  });

  it('rejects a request with invalid customer details', () => {
    const invalidCheckoutRequest = {
      ...validCheckoutRequest,
      customer: {
        ...validCheckoutRequest.customer,
        email: 'not-an-email'
      }
    };

    const result = CheckoutRequestSchema.safeParse(invalidCheckoutRequest);

    expect(result.success).toBe(false);
  });

  it('rejects a request with invalid order details', () => {
    const invalidCheckoutRequest = {
      ...validCheckoutRequest,
      order: {
        ...validCheckoutRequest.order,
        totalCents: -100
      }
    };

    const result = CheckoutRequestSchema.safeParse(invalidCheckoutRequest);

    expect(result.success).toBe(false);
  });
});
