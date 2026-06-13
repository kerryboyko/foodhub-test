import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import CheckoutForm from './CheckoutForm';
import { useCheckoutCartWithFulfilment } from '@/hooks/checkout/useCheckoutCartWithFulfilment';

const routerMocks = vi.hoisted(() => ({
  push: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerMocks.push
  })
}));

vi.mock('@/hooks/checkout/useCheckoutCartWithFulfilment');

const mockUseCheckoutCartWithFulfilment = vi.mocked(
  useCheckoutCartWithFulfilment
);

const clearCart = vi.fn();

describe('CheckoutForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          message: 'Checkout successful',
          orderId: 'test-order-id'
        })
      })
    );

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

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders checkout totals and form fields', () => {
    render(<CheckoutForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    expect(
      screen.getByTestId('fulfilment-fields-radio-collection')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('fulfilment-fields-radio-delivery')
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

    await user.click(screen.getByTestId('fulfilment-fields-radio-collection'));

    expect(
      screen.getByTestId('fulfilment-fields-radio-delivery')
    ).toBeInTheDocument();

    expect(screen.queryByLabelText(/address line 1/i)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/postcode\/zipcode/i)
    ).not.toBeInTheDocument();
  });

  it('submits a valid collection order, clears the cart, and redirects', async () => {
    const user = userEvent.setup();

    render(<CheckoutForm />);

    await user.type(screen.getByLabelText(/name/i), 'Kerry Ann');
    await user.type(screen.getByLabelText(/phone/i), '0871234567');
    await user.type(screen.getByLabelText(/email/i), 'kerry@example.com');

    await user.click(screen.getByTestId('fulfilment-fields-radio-collection'));
    expect(
      screen.getByTestId('fulfilment-fields-radio-delivery')
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/credit card/i), '4242424242424242');
    await user.type(screen.getByLabelText(/expiration date/i), '12/30');
    await user.type(screen.getByLabelText(/cvc code/i), '123');

    await user.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/checkout',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: expect.any(String)
        })
      );
    });

    const [, options] = vi.mocked(fetch).mock.calls[0];
    const payload = JSON.parse(options?.body as string);

    expect(payload).toEqual({
      customer: expect.objectContaining({
        name: 'Kerry Ann',
        phone: '0871234567',
        email: 'kerry@example.com',
        fulfilmentType: 'collection',
        creditCard: '4242424242424242',
        ccExpiration: '12/30',
        ccCVCcode: '123'
      }),
      order: {
        items: [
          {
            id: 'pizza-1',
            name: 'Pepperoni Pizza',
            priceCents: 1299,
            quantity: 2
          }
        ],
        subtotalCents: 2598,
        deliveryChargeCents: 499,
        totalCents: 3097
      }
    });

    expect(clearCart).toHaveBeenCalledOnce();

    await waitFor(() => {
      expect(routerMocks.push).toHaveBeenCalledWith(
        '/order-confirmation/test-order-id'
      );
    });
  });
  it('displays an error when checkout fails', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          message: 'Payment failed'
        })
      })
    );

    render(<CheckoutForm />);

    await user.type(screen.getByLabelText(/name/i), 'Kerry Ann');
    await user.type(screen.getByLabelText(/phone/i), '0871234567');
    await user.type(screen.getByLabelText(/email/i), 'kerry@example.com');

    await user.click(screen.getByTestId('fulfilment-fields-radio-collection'));

    expect(
      screen.getByTestId('fulfilment-fields-radio-delivery')
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/credit card/i), '4242424242424242');
    await user.type(screen.getByLabelText(/expiration date/i), '12/30');
    await user.type(screen.getByLabelText(/cvc code/i), '123');

    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Payment failed'
    );

    expect(clearCart).not.toHaveBeenCalled();
    expect(routerMocks.push).not.toHaveBeenCalled();
  });
  it('displays the fallback checkout error when the API does not return a message', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({})
      })
    );

    render(<CheckoutForm />);

    await user.type(screen.getByLabelText(/name/i), 'Kerry Ann');
    await user.type(screen.getByLabelText(/phone/i), '0871234567');
    await user.type(screen.getByLabelText(/email/i), 'kerry@example.com');

    await user.click(screen.getByTestId('fulfilment-fields-radio-collection'));

    expect(
      screen.getByTestId('fulfilment-fields-radio-delivery')
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/credit card/i), '4242424242424242');
    await user.type(screen.getByLabelText(/expiration date/i), '12/30');
    await user.type(screen.getByLabelText(/cvc code/i), '123');

    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Checkout failed'
    );

    expect(clearCart).not.toHaveBeenCalled();
    expect(routerMocks.push).not.toHaveBeenCalled();
  });
});
