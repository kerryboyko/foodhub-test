import { describe, expect, it } from 'vitest';
import { createFallbackKitchenSummary } from './createFallbackKitchenSummary';
import type { CheckoutRequestData } from '@/schemas/checkoutRequest';

function createOrder(overrides: Partial<CheckoutRequestData> = {}) {
  return {
    customer: {
      name: 'Kerry Ann Burke',
      email: 'test@example.com',
      phone: '202 202 2020',
      fulfilmentType: 'delivery',
      notes: ''
    },
    order: {
      items: [
        {
          id: 'spring-rolls',
          name: 'Vegetable Spring Rolls',
          priceCents: 595,
          quantity: 2
        },
        {
          id: 'dumplings',
          name: 'Dumplings',
          priceCents: 695,
          quantity: 3
        }
      ]
    },
    ...overrides
  };
}

describe('createFallbackKitchenSummary', () => {
  it('returns a fallback summary with the fulfilment type and total item quantity', () => {
    const order = createOrder();

    expect(createFallbackKitchenSummary(order as any)).toBe(
      'delivery order with 5 item(s). No customer notes provided. AI summary unavailable: using fallback kitchen summary.'
    );
  });

  it('includes customer notes when provided', () => {
    const order = createOrder({
      customer: {
        name: 'Kerry Ann Burke',
        email: 'test@example.com',
        phone: '202 202 2020',
        fulfilmentType: 'collection',
        notes: 'Extra soy sauce please.'
      }
    });

    expect(createFallbackKitchenSummary(order as any)).toBe(
      'collection order with 5 item(s). Customer note: Extra soy sauce please. AI summary unavailable: using fallback kitchen summary.'
    );
  });

  it('counts quantities, not distinct line items', () => {
    const order = createOrder({
      order: {
        items: [
          {
            id: 'spring-rolls',
            name: 'Vegetable Spring Rolls',
            priceCents: 595,
            quantity: 10
          }
        ]
      }
    } as any);

    expect(createFallbackKitchenSummary(order as any)).toContain(
      'delivery order with 10 item(s).'
    );
  });

  it('handles an empty order', () => {
    const order = createOrder({
      order: {
        items: []
      }
    } as any);

    expect(createFallbackKitchenSummary(order as any)).toBe(
      'delivery order with 0 item(s). No customer notes provided. AI summary unavailable: using fallback kitchen summary.'
    );
  });
});
