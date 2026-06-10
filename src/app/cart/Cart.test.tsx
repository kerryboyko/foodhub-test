// Cart.test.tsx

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import Cart from './Cart';
import { useCartStore } from '@/stores/cartStore';
import { DELIVERY_FEE_CENTS, DELIVERY_WAIVER_MINIMUM } from '@/data/constants';
import { formatPrice } from '@/lib/formatPrice';

const pizza = {
  id: 'pizza-1',
  name: 'Pepperoni Pizza',
  description: '',
  priceCents: 1299,
  allergens: [],
  available: true,
  image: ''
};

beforeEach(() => {
  useCartStore.setState({
    itemIds: [],
    itemsById: {}
  });
});

describe('Cart', () => {
  it('renders subtotal and delivery fee for an empty cart', () => {
    render(<Cart />);

    expect(screen.getByText(`Subtotal: ${formatPrice(0)}`)).toBeInTheDocument();

    expect(
      screen.getByText(`Delivery: ${formatPrice(DELIVERY_FEE_CENTS)}`)
    ).toBeInTheDocument();
  });

  it('renders cart items', () => {
    useCartStore.setState({
      itemIds: ['pizza-1'],
      itemsById: {
        'pizza-1': {
          ...pizza,
          quantity: 2
        }
      }
    });

    render(<Cart />);

    expect(
      screen.getByRole('heading', { name: 'Pepperoni Pizza' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(`Subtotal: ${formatPrice(1299 * 2)}`)
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('cart-control-quantity-pizza-1')
    ).toHaveTextContent('2');
  });

  it('shows free delivery message when subtotal meets waiver minimum', () => {
    useCartStore.setState({
      itemIds: ['pizza-1'],
      itemsById: {
        'pizza-1': {
          ...pizza,
          priceCents: DELIVERY_WAIVER_MINIMUM,
          quantity: 1
        }
      }
    });

    render(<Cart />);

    expect(
      screen.getByText('This order qualifies for free delivery!')
    ).toBeInTheDocument();

    expect(
      screen.queryByText(`Delivery: ${formatPrice(DELIVERY_FEE_CENTS)}`)
    ).not.toBeInTheDocument();
  });

  it('shows delivery fee when subtotal is below waiver minimum', () => {
    useCartStore.setState({
      itemIds: ['pizza-1'],
      itemsById: {
        'pizza-1': {
          ...pizza,
          priceCents: DELIVERY_WAIVER_MINIMUM - 1,
          quantity: 1
        }
      }
    });

    render(<Cart />);

    expect(
      screen.getByText(`Delivery: ${formatPrice(DELIVERY_FEE_CENTS)}`)
    ).toBeInTheDocument();
  });
});
