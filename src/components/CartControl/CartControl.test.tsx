// CartControl.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import CartControl from './CartControl';
import { useCartStore } from '@/stores/cartStore';
import type { MenuItem } from '@/schemas/menu';

/* We're testing this with the real Zustand store, not mocks. It’s cleaner and catches the wiring bugs. */

const item: MenuItem = {
  id: 'pizza-1',
  name: 'Pepperoni Pizza',
  description: 'A pizza with pepperoni',
  priceCents: 1299,
  allergens: ['gluten', 'milk'],
  available: true,
  image: ''
};

beforeEach(() => {
  useCartStore.setState({
    itemIds: [],
    itemsById: {}
  });
});

describe('CartControl', () => {
  it('shows an add button when the item is not in the cart', () => {
    render(<CartControl item={item} />);

    expect(screen.getByTestId('cart-control-add-pizza-1')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /add pepperoni pizza to cart/i })
    ).toBeEnabled();
  });

  it('disables the add button when the item is unavailable', () => {
    render(<CartControl item={{ ...item, available: false }} />);

    expect(
      screen.getByRole('button', { name: /add pepperoni pizza to cart/i })
    ).toBeDisabled();

    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });

  it('adds the item to the cart when add is clicked', async () => {
    const user = userEvent.setup();

    render(<CartControl item={item} />);

    await user.click(
      screen.getByRole('button', { name: /add pepperoni pizza/i })
    );

    expect(
      screen.getByTestId('cart-control-quantity-pizza-1')
    ).toHaveTextContent('1');
  });

  it('shows quantity controls when the item is already in the cart', () => {
    useCartStore.setState({
      itemIds: [item.id],
      itemsById: {
        [item.id]: {
          ...item,
          quantity: 2
        }
      }
    });

    render(<CartControl item={item} />);

    expect(
      screen.getByTestId('cart-control-quantity-pizza-1')
    ).toHaveTextContent('2');

    expect(
      screen.getByRole('button', { name: /increase quantity/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /decrease quantity/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /remove pepperoni pizza/i })
    ).toBeInTheDocument();
  });

  it('increments the quantity', async () => {
    const user = userEvent.setup();

    useCartStore.setState({
      itemIds: [item.id],
      itemsById: {
        [item.id]: {
          ...item,
          quantity: 2
        }
      }
    });

    render(<CartControl item={item} />);

    await user.click(
      screen.getByRole('button', { name: /increase quantity/i })
    );

    expect(
      screen.getByTestId('cart-control-quantity-pizza-1')
    ).toHaveTextContent('3');
  });

  it('decrements the quantity', async () => {
    const user = userEvent.setup();

    useCartStore.setState({
      itemIds: [item.id],
      itemsById: {
        [item.id]: {
          ...item,
          quantity: 2
        }
      }
    });

    render(<CartControl item={item} />);

    await user.click(
      screen.getByRole('button', { name: /decrease quantity/i })
    );

    expect(
      screen.getByTestId('cart-control-quantity-pizza-1')
    ).toHaveTextContent('1');
  });

  it('removes the item from the cart', async () => {
    const user = userEvent.setup();

    useCartStore.setState({
      itemIds: [item.id],
      itemsById: {
        [item.id]: {
          ...item,
          quantity: 2
        }
      }
    });

    render(<CartControl item={item} />);

    await user.click(
      screen.getByRole('button', { name: /remove pepperoni pizza/i })
    );

    expect(
      screen.getByRole('button', { name: /add pepperoni pizza/i })
    ).toBeInTheDocument();
  });
});
