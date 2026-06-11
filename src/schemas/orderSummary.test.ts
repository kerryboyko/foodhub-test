import { describe, expect, it } from 'vitest';
import { OrderSummaryItemSchema, OrderSummarySchema } from './orderSummary';

/* N.B.: this schema validates shape, not arithmetic correctness. So this would currently pass:

{
  subtotalCents: 1000,
  deliveryChargeCents: 300,
  totalCents: 999999
}

The schema itself can be used to enforce the maths, by adding .refine(), but
this seems like overkill.

*/
describe('OrderSummaryItemSchema', () => {
  const validItem = {
    id: 'spring-rolls',
    name: 'Vegetable Spring Rolls',
    priceCents: 595,
    quantity: 2
  };

  it('accepts a valid order summary item', () => {
    expect(OrderSummaryItemSchema.parse(validItem)).toEqual(validItem);
  });

  it('rejects a negative price', () => {
    expect(() =>
      OrderSummaryItemSchema.parse({
        ...validItem,
        priceCents: -1
      })
    ).toThrow();
  });

  it('rejects a decimal price', () => {
    expect(() =>
      OrderSummaryItemSchema.parse({
        ...validItem,
        priceCents: 595.5
      })
    ).toThrow();
  });

  it('rejects a zero quantity', () => {
    expect(() =>
      OrderSummaryItemSchema.parse({
        ...validItem,
        quantity: 0
      })
    ).toThrow();
  });

  it('rejects a decimal quantity', () => {
    expect(() =>
      OrderSummaryItemSchema.parse({
        ...validItem,
        quantity: 1.5
      })
    ).toThrow();
  });
});

describe('OrderSummarySchema', () => {
  const validSummary = {
    items: [
      {
        id: 'spring-rolls',
        name: 'Vegetable Spring Rolls',
        priceCents: 595,
        quantity: 2
      }
    ],
    subtotalCents: 1190,
    deliveryChargeCents: 300,
    totalCents: 1490
  };

  it('accepts a valid order summary', () => {
    expect(OrderSummarySchema.parse(validSummary)).toEqual(validSummary);
  });

  it('rejects an order summary with no items', () => {
    expect(() =>
      OrderSummarySchema.parse({
        ...validSummary,
        items: []
      })
    ).toThrow();
  });

  it('rejects a negative subtotal', () => {
    expect(() =>
      OrderSummarySchema.parse({
        ...validSummary,
        subtotalCents: -1
      })
    ).toThrow();
  });

  it('rejects a negative delivery charge', () => {
    expect(() =>
      OrderSummarySchema.parse({
        ...validSummary,
        deliveryChargeCents: -1
      })
    ).toThrow();
  });

  it('rejects a negative total', () => {
    expect(() =>
      OrderSummarySchema.parse({
        ...validSummary,
        totalCents: -1
      })
    ).toThrow();
  });

  it('rejects decimal cent values', () => {
    expect(() =>
      OrderSummarySchema.parse({
        ...validSummary,
        totalCents: 1490.5
      })
    ).toThrow();
  });
});
