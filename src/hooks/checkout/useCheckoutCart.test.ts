// useCheckoutCart.test.ts

import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useCheckoutCart } from './useCheckoutCart';
import { useCartStore } from '@/stores/cartStore';

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
    itemsById: {},
    itemIds: []
  });
});

describe('useCheckoutCart', () => {
  it('returns an empty cart initially', () => {
    const { result } = renderHook(() => useCheckoutCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.subtotalCents).toBe(0);
    expect(result.current.isCartEmpty).toBe(true);
  });

  it('returns cart items and subtotal', () => {
    act(() => {
      useCartStore.getState().addItem(pizza);
      useCartStore.getState().addItem(pizza);
    });

    const { result } = renderHook(() => useCheckoutCart());

    expect(result.current.items).toHaveLength(1);

    expect(result.current.items[0]).toMatchObject({
      id: 'pizza-1',
      quantity: 2
    });

    expect(result.current.subtotalCents).toBe(2598);
    expect(result.current.isCartEmpty).toBe(false);
  });

  it('clears the cart', () => {
    act(() => {
      useCartStore.getState().addItem(pizza);
    });

    const { result } = renderHook(() => useCheckoutCart());

    expect(result.current.isCartEmpty).toBe(false);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.subtotalCents).toBe(0);
    expect(result.current.isCartEmpty).toBe(true);
  });

  it('updates when the store changes', () => {
    const { result } = renderHook(() => useCheckoutCart());

    expect(result.current.items).toEqual([]);

    act(() => {
      useCartStore.getState().addItem(pizza);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.subtotalCents).toBe(1299);
  });
});
