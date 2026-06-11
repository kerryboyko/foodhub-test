// src/app/api/checkout/route.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CheckoutRequestData } from '@/schemas/checkoutRequest';

const mocks = vi.hoisted(() => ({
  saveOrder: vi.fn()
}));

vi.mock('./saveOrder', () => ({
  saveOrder: mocks.saveOrder
}));

import { POST } from './route';
import { saveOrder } from './saveOrder';

describe('POST /api/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 201 and the order ID for a valid checkout', async () => {
    const checkoutRequest = {
      customer: {
        name: 'Bob',
        email: 'bob@example.com',
        phone: '555-1234',
        fulfilmentType: 'delivery',
        addressLine1: '123 Test Street',
        postcode: 'D01 TEST',
        creditCard: '4111111111111111',
        ccExpiration: '12/30',
        ccCVCcode: '123'
      },
      order: {
        items: [
          {
            id: 'item_1001',
            name: 'Vegetable Spring Rolls',
            priceCents: 595,
            quantity: 2
          }
        ],
        subtotalCents: 1190,
        deliveryChargeCents: 0,
        totalCents: 1190
      }
    } satisfies CheckoutRequestData;

    const savedOrder = {
      id: 'test-order-id',
      createdAt: '2026-06-11T12:00:00.000Z',
      ...checkoutRequest
    };

    mocks.saveOrder.mockResolvedValue(savedOrder);

    const request = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutRequest)
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(saveOrder).toHaveBeenCalledWith(checkoutRequest);

    expect(body).toEqual({
      message: 'Checkout successful',
      orderId: 'test-order-id'
    });
  });

  it('returns 400 for an invalid checkout payload', async () => {
    const request = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        customer: {
          name: '',
          fulfilmentType: 'teleportation'
        },
        order: {
          items: []
        }
      })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(saveOrder).not.toHaveBeenCalled();

    expect(body.message).toBe('Invalid checkout payload');
    expect(body.errors).toBeDefined();
  });

  it('returns 500 if saving the order fails', async () => {
    const checkoutRequest = {
      customer: {
        name: 'Bob',
        email: 'bob@example.com',
        phone: '555-1234',
        fulfilmentType: 'collection',
        creditCard: '4111111111111111',
        ccExpiration: '12/30',
        ccCVCcode: '123'
      },
      order: {
        items: [
          {
            id: 'item_1001',
            name: 'Vegetable Spring Rolls',
            priceCents: 595,
            quantity: 2
          }
        ],
        subtotalCents: 1190,
        deliveryChargeCents: 0,
        totalCents: 1190
      }
    } satisfies CheckoutRequestData;

    mocks.saveOrder.mockRejectedValue(new Error('Disk exploded'));

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const request = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutRequest)
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);

    expect(body).toEqual({
      message: 'Internal server error'
    });

    consoleErrorSpy.mockRestore();
  });
});
