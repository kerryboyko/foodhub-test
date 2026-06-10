// OrderSummary.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import OrderSummary from './OrderSummary';
import { useCheckoutCart } from '@/hooks/checkout/useCheckoutCart';

vi.mock('@/hooks/checkout/useCheckoutCart');

const mockUseCheckoutCart = vi.mocked(useCheckoutCart);

describe('OrderSummary', () => {
  it('renders no items when the cart is empty', () => {
    mockUseCheckoutCart.mockReturnValue({
      items: [],
      subtotalCents: 0,
      clearCart: vi.fn(),
      isCartEmpty: true
    });

    render(<OrderSummary />);

    expect(screen.queryByTestId(/item-name-/)).not.toBeInTheDocument();
  });

  it('renders a single item', () => {
    mockUseCheckoutCart.mockReturnValue({
      items: [
        {
          id: 'pizza-1',
          name: 'Pepperoni Pizza',
          priceCents: 1299,
          quantity: 2,
          description: '',
          allergens: [],
          available: true,
          image: ''
        }
      ],
      subtotalCents: 2598,
      clearCart: vi.fn(),
      isCartEmpty: false
    });

    render(<OrderSummary />);

    expect(screen.getByTestId('item-name-Pepperoni Pizza')).toHaveTextContent(
      'Pepperoni Pizza'
    );

    expect(
      screen.getByTestId('item-quantity-Pepperoni Pizza')
    ).toHaveTextContent('Quantity: 2');

    expect(screen.getByTestId('item-price-Pepperoni Pizza')).toHaveTextContent(
      /25\.98/
    );
  });

  it('renders multiple items', () => {
    mockUseCheckoutCart.mockReturnValue({
      items: [
        {
          id: 'pizza-1',
          name: 'Pepperoni Pizza',
          priceCents: 1299,
          quantity: 2,
          description: '',
          allergens: [],
          available: true,
          image: ''
        },
        {
          id: 'chips-1',
          name: 'Large Chips',
          priceCents: 399,
          quantity: 1,
          description: '',
          allergens: [],
          available: true,
          image: ''
        }
      ],
      subtotalCents: 2997,
      clearCart: vi.fn(),
      isCartEmpty: false
    });

    render(<OrderSummary />);

    expect(screen.getByTestId('item-name-Pepperoni Pizza')).toBeInTheDocument();

    expect(screen.getByTestId('item-name-Large Chips')).toBeInTheDocument();
  });
});
