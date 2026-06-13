// src/app/unsafe-see-orders/page.test.tsx

import { render, screen } from '@testing-library/react';
import UnsafeSeeOrdersPage from './page';
import { getAllOrders } from '@/lib/storage/getAllOrders';
import { notFound } from 'next/navigation';

vi.mock('@/lib/storage/getAllOrders', () => ({
  getAllOrders: vi.fn()
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  })
}));

const mockOrders = [
  {
    id: 'order-123',
    createdAt: '2026-06-13T12:00:00.000Z',
    customer: {
      name: 'Kerry Ann Burke',
      email: 'kerry@example.com',
      phone: '202 202 2020',
      fulfilmentType: 'delivery',
      addressLine1: '123 Test Street',
      notes: 'Leave at door'
    },
    order: {
      items: [
        {
          id: 'spring-rolls',
          name: 'Spring Rolls',
          quantity: 2,
          priceCents: 595
        }
      ],
      subtotalCents: 1190,
      deliveryChargeCents: 0,
      totalCents: 1190
    },
    kitchenSummary: 'Pack separately'
  }
];

describe('UnsafeSeeOrdersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all orders', async () => {
    vi.mocked(getAllOrders).mockResolvedValue(mockOrders as any);

    const Page = await UnsafeSeeOrdersPage();

    render(Page);

    expect(
      screen.getByRole('heading', {
        name: /unsafe see orders page/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText('order-123')).toBeInTheDocument();
    expect(screen.getByText('Kerry Ann Burke')).toBeInTheDocument();
    expect(screen.getByText('2 x Spring Rolls')).toBeInTheDocument();
    expect(screen.getByText('delivery')).toBeInTheDocument();
    expect(screen.getByText('€11.90')).toBeInTheDocument();
    expect(screen.getByText('Pack separately')).toBeInTheDocument();
  });

  it('renders Pending when kitchen summary does not exist', async () => {
    vi.mocked(getAllOrders).mockResolvedValue([
      {
        ...mockOrders[0],
        kitchenSummary: undefined
      }
    ] as any);

    const Page = await UnsafeSeeOrdersPage();

    render(Page);

    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('calls notFound if orders are missing', async () => {
    vi.mocked(getAllOrders).mockResolvedValue(undefined as never);

    await expect(UnsafeSeeOrdersPage()).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFound).toHaveBeenCalled();
  });
});
