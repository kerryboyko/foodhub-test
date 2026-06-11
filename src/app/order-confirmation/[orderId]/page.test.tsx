import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OrderConfirmationPage from './page';
import { getOrderById } from '@/app/api/checkout/getOrderById';

vi.mock('@/app/api/checkout/getOrderById', () => ({
  getOrderById: vi.fn()
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  })
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
  kitchenSummary:
    'Prepare 2 vegetable spring rolls for delivery. Customer requested no onions.'
};

describe('OrderConfirmationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the confirmed order details', async () => {
    vi.mocked(getOrderById).mockResolvedValue(mockOrder);

    render(
      await OrderConfirmationPage({
        params: Promise.resolve({ orderId: 'test-order-id' })
      })
    );

    expect(getOrderById).toHaveBeenCalledWith('test-order-id');

    expect(
      screen.getByRole('heading', { name: 'Order Confirmed' })
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('order-confirmation-test-order-id')
    ).toHaveTextContent('Order ID: test-order-id');

    expect(screen.getByTestId('order-confirmation-name')).toHaveTextContent(
      'Bob'
    );
    expect(screen.getByTestId('order-confirmation-email')).toHaveTextContent(
      'bob@example.com'
    );
    expect(screen.getByTestId('order-confirmation-phone')).toHaveTextContent(
      '555-1234'
    );

    expect(
      screen.getByTestId('order-confirmation-item-quantity-name-spring-rolls')
    ).toHaveTextContent('2 × Vegetable Spring Rolls');

    expect(
      screen.getByTestId('order-confirmation-item-price-spring-rolls')
    ).toHaveTextContent('€11.90');

    expect(
      screen.getByTestId('order-confirmation-kitchen-summary')
    ).toHaveTextContent(
      'Prepare 2 vegetable spring rolls for delivery. Customer requested no onions.'
    );

    expect(
      screen.getByTestId('order-confirmation-total-price')
    ).toHaveTextContent('€14.90');
  });

  it('does not display the kitchen summary section when there is no kitchen summary', async () => {
    vi.mocked(getOrderById).mockResolvedValue({
      ...mockOrder,
      kitchenSummary: undefined
    } as any);

    render(
      await OrderConfirmationPage({
        params: Promise.resolve({ orderId: 'test-order-id' })
      })
    );

    expect(
      screen.queryByRole('heading', { name: 'AI Kitchen Summary' })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('order-confirmation-kitchen-summary')
    ).not.toBeInTheDocument();
  });

  it('calls notFound when the order does not exist', async () => {
    vi.mocked(getOrderById).mockResolvedValue(null);

    await expect(
      OrderConfirmationPage({
        params: Promise.resolve({ orderId: 'missing-order-id' })
      })
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(getOrderById).toHaveBeenCalledWith('missing-order-id');
    expect(notFound).toHaveBeenCalledOnce();
  });
});
