// useCheckoutCartWithFulfilment.test.ts

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { DELIVERY_FEE_CENTS, DELIVERY_WAIVER_MINIMUM } from '@/data/constants';
import { formatPrice } from '@/lib/formatPrice';
import { useCartStore } from '@/stores/cartStore';
import { useCheckoutCartWithFulfilment } from './useCheckoutCartWithFulfilment';

const pizza = {
  id: 'pizza-1',
  name: 'Pepperoni Pizza',
  description: '',
  priceCents: 1299,
  allergens: [],
  available: true
};

beforeEach(() => {
  useCartStore.setState({
    itemsById: {},
    itemIds: []
  });
});

describe('useCheckoutCartWithFulfilment', () => {
  it('returns empty cart state with delivery fee when cart is empty and fulfilment is delivery', () => {
    const { result } = renderHook(() =>
      useCheckoutCartWithFulfilment({ fulfilmentType: 'delivery' })
    );

    expect(result.current.items).toEqual([]);
    expect(result.current.subtotalCents).toBe(0);
    expect(result.current.isCartEmpty).toBe(true);
    expect(result.current.deliveryChargeCents).toBe(DELIVERY_FEE_CENTS);
    expect(result.current.totalCents).toBe(DELIVERY_FEE_CENTS);
    expect(result.current.deliveryFeeDisplay).toBe(
      `Delivery: ${formatPrice(DELIVERY_FEE_CENTS)}`
    );
  });

  it('returns no delivery fee for collection', () => {
    act(() => {
      useCartStore.getState().addItem(pizza);
    });

    const { result } = renderHook(() =>
      useCheckoutCartWithFulfilment({ fulfilmentType: 'collection' })
    );

    expect(result.current.items).toHaveLength(1);
    expect(result.current.subtotalCents).toBe(1299);
    expect(result.current.isCartEmpty).toBe(false);
    expect(result.current.deliveryChargeCents).toBe(0);
    expect(result.current.totalCents).toBe(1299);
    expect(result.current.deliveryFeeDisplay).toBeNull();
  });

  it('adds delivery fee when delivery subtotal is below waiver minimum', () => {
    act(() => {
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
    });

    const { result } = renderHook(() =>
      useCheckoutCartWithFulfilment({ fulfilmentType: 'delivery' })
    );

    expect(result.current.subtotalCents).toBe(DELIVERY_WAIVER_MINIMUM - 1);
    expect(result.current.deliveryChargeCents).toBe(DELIVERY_FEE_CENTS);
    expect(result.current.totalCents).toBe(
      DELIVERY_WAIVER_MINIMUM - 1 + DELIVERY_FEE_CENTS
    );
    expect(result.current.deliveryFeeDisplay).toBe(
      `Delivery: ${formatPrice(DELIVERY_FEE_CENTS)}`
    );
  });

  it('returns free delivery when delivery subtotal meets waiver minimum', () => {
    act(() => {
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
    });

    const { result } = renderHook(() =>
      useCheckoutCartWithFulfilment({ fulfilmentType: 'delivery' })
    );

    expect(result.current.deliveryChargeCents).toBe(0);
    expect(result.current.totalCents).toBe(DELIVERY_WAIVER_MINIMUM);
    expect(result.current.deliveryFeeDisplay).toBe(
      'This order qualifies for free delivery!'
    );
  });

  it('updates totals when fulfilment type changes', () => {
    act(() => {
      useCartStore.getState().addItem(pizza);
    });

    const { result, rerender } = renderHook(
      ({ fulfilmentType }) => useCheckoutCartWithFulfilment({ fulfilmentType }),
      {
        initialProps: {
          fulfilmentType: 'delivery' as const
        }
      }
    );

    expect(result.current.deliveryChargeCents).toBe(DELIVERY_FEE_CENTS);
    expect(result.current.totalCents).toBe(1299 + DELIVERY_FEE_CENTS);

    rerender({
      fulfilmentType: 'collection'
    });

    expect(result.current.deliveryChargeCents).toBe(0);
    expect(result.current.totalCents).toBe(1299);
    expect(result.current.deliveryFeeDisplay).toBeNull();
  });

  it('clears the cart', () => {
    act(() => {
      useCartStore.getState().addItem(pizza);
    });

    const { result } = renderHook(() =>
      useCheckoutCartWithFulfilment({ fulfilmentType: 'delivery' })
    );

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.subtotalCents).toBe(0);
    expect(result.current.isCartEmpty).toBe(true);
  });
});
