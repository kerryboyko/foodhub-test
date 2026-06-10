import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import CheckoutForm from './CheckoutForm';
import { useCheckoutCartWithFulfilment } from '@/hooks/checkout/useCheckoutCartWithFulfilment';

// This tests the checkout flow, but since useCheckoutCartWithFulfilment already has
// it's own hook tests, we choose to mock the hook and just
// focuses on rendering and submit behavior.

vi.mock('@/hooks/checkout/useCheckoutCartWithFulfilment');

const mockUseCheckoutCartWithFulfilment = vi.mocked(
  useCheckoutCartWithFulfilment
);

const clearCart = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  mockUseCheckoutCartWithFulfilment.mockReturnValue({
    items: [
      {
        id: 'pizza-1',
        name: 'Pepperoni Pizza',
        description: '',
        priceCents: 1299,
        allergens: [],
        available: true,
        quantity: 2,
        image: ''
      }
    ],
    subtotalCents: 2598,
    clearCart,
    totalCents: 3097,
    deliveryChargeCents: 499,
    isCartEmpty: false,
    deliveryFeeDisplay: 'Delivery: €4.99'
  });
});

describe('CheckoutForm', () => {
  it('renders checkout totals and form fields', () => {
    render(<CheckoutForm />);

    expect(screen.getByText('Subtotal: €25.98')).toBeInTheDocument();
    expect(screen.getByText('Delivery: €4.99')).toBeInTheDocument();
    expect(screen.getByText('Total: €30.97')).toBeInTheDocument();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    expect(
      screen.getByRole('radio', { name: /delivery/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /collection/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/credit card/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiration date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvc code/i)).toBeInTheDocument();
  });

  it('disables the submit button when the cart is empty', () => {
    mockUseCheckoutCartWithFulfilment.mockReturnValue({
      items: [],
      subtotalCents: 0,
      clearCart,
      totalCents: 0,
      deliveryChargeCents: 0,
      isCartEmpty: true,
      deliveryFeeDisplay: null
    });

    render(<CheckoutForm />);

    expect(screen.getByRole('button', { name: /place order/i })).toBeDisabled();
  });

  it('hides delivery address fields when collection is selected', async () => {
    const user = userEvent.setup();

    render(<CheckoutForm />);

    expect(screen.getByLabelText(/address line 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postcode\/zipcode/i)).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /collection/i }));

    expect(screen.queryByLabelText(/address line 1/i)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/postcode\/zipcode/i)
    ).not.toBeInTheDocument();
  });

  it('submits a valid collection order and clears the cart', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<CheckoutForm />);

    await user.type(screen.getByLabelText(/name/i), 'Kerry Ann');
    await user.type(screen.getByLabelText(/phone/i), '0871234567');
    await user.type(screen.getByLabelText(/email/i), 'kerry@example.com');

    await user.click(screen.getByRole('radio', { name: /collection/i }));

    await user.type(screen.getByLabelText(/credit card/i), '4242424242424242');
    await user.type(screen.getByLabelText(/expiration date/i), '12/30');
    await user.type(screen.getByLabelText(/cvc code/i), '123');

    await user.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Fake checkout submitted:',
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Kerry Ann',
            phone: '0871234567',
            email: 'kerry@example.com',
            fulfilmentType: 'collection'
          }),
          order: expect.objectContaining({
            subtotalCents: 2598,
            deliveryChargeCents: 499,
            totalCents: 3097
          })
        })
      );
    });

    expect(clearCart).toHaveBeenCalled();
  });
});
