import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';
import { getOrderById } from '@/lib/storage/getOrderById';
import { Order } from '@/schemas/order';

vi.mock('@/lib/storage/getOrderById', () => ({
  getOrderById: vi.fn()
}));

const mockOrder = {
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
  kitchenSummary: 'Kitchen summary'
} as Order;

describe('GET /api/order-confirmation/[orderId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the order when found', async () => {
    vi.mocked(getOrderById).mockResolvedValue(mockOrder);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({
        orderId: 'test-order-id'
      })
    });

    expect(getOrderById).toHaveBeenCalledWith('test-order-id');

    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual({
      order: mockOrder
    });
  });

  it('returns 404 when the order does not exist', async () => {
    vi.mocked(getOrderById).mockResolvedValue(null);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({
        orderId: 'missing-order-id'
      })
    });

    expect(getOrderById).toHaveBeenCalledWith('missing-order-id');

    expect(response.status).toBe(404);

    await expect(response.json()).resolves.toEqual({
      message: 'Order not found'
    });
  });

  it('uses the orderId from route params', async () => {
    vi.mocked(getOrderById).mockResolvedValue(mockOrder);

    await GET(new Request('http://localhost'), {
      params: Promise.resolve({
        orderId: 'abc-123'
      })
    });

    expect(getOrderById).toHaveBeenCalledWith('abc-123');
  });
});
