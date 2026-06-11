import { describe, expect, it } from 'vitest';
import { OrderSchema } from './order';

describe('OrderSchema', () => {
  const validOrder = {
    id: 'test-order-id',
    createdAt: '2026-06-11T12:00:00.000Z',
    customer: {
      name: 'Bob',
      email: 'bob@example.com',
      phone: '555-1234',
      fulfilmentType: 'delivery',
      notes: '',
      addressLine1: '123 Test Street',
      addressLine2: '',
      postcode: 'D01 TEST',
      creditCard: '4111111111111111',
      ccExpiration: '12/30',
      ccCVCcode: '123'
    },
    order: {
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
    },
    kitchenSummary: 'Prepare 2 spring rolls for delivery.'
  };

  it('accepts a valid order', () => {
    expect(OrderSchema.parse(validOrder)).toEqual(validOrder);
  });

  it('accepts an order without a kitchen summary', () => {
    const { kitchenSummary: _kitchenSummary, ...orderWithoutKitchenSummary } =
      validOrder;

    expect(OrderSchema.parse(orderWithoutKitchenSummary)).toEqual(
      orderWithoutKitchenSummary
    );
  });

  it('rejects an order without an id', () => {
    const { id: _id, ...orderWithoutId } = validOrder;

    expect(() => OrderSchema.parse(orderWithoutId)).toThrow();
  });

  it('rejects an order without createdAt', () => {
    const { createdAt: _createdAt, ...orderWithoutCreatedAt } = validOrder;

    expect(() => OrderSchema.parse(orderWithoutCreatedAt)).toThrow();
  });

  it('rejects an order with an invalid customer', () => {
    const invalidOrder = {
      ...validOrder,
      customer: {
        ...validOrder.customer,
        email: 'not-an-email'
      }
    };

    expect(() => OrderSchema.parse(invalidOrder)).toThrow();
  });

  it('rejects an order with an invalid order summary', () => {
    const invalidOrder = {
      ...validOrder,
      order: {
        ...validOrder.order,
        totalCents: -1
      }
    };

    expect(() => OrderSchema.parse(invalidOrder)).toThrow();
  });

  it('rejects a non-string kitchen summary', () => {
    const invalidOrder = {
      ...validOrder,
      kitchenSummary: 123
    };

    expect(() => OrderSchema.parse(invalidOrder)).toThrow();
  });
});
