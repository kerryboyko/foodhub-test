// src/stores/cart-store.test.ts

import { beforeEach, describe, expect, it } from 'vitest';

import {
  selectCartIsEmpty,
  selectCartItems,
  selectSubtotalCents,
  useCartStore,
  type CartState
} from './cartStore';

import type { MenuItem } from '@/schemas/menu';

const pizza: MenuItem = {
  id: 'pizza-1',
  name: 'Pepperoni Pizza',
  description: 'Pizza with pepperoni',
  priceCents: 1299,
  allergens: ['gluten', 'milk'],
  available: true,
  image: ''
};

const chips: MenuItem = {
  id: 'chips-1',
  name: 'Large Chips',
  description: 'A large portion of chips',
  priceCents: 399,
  allergens: [],
  available: true,
  image: ''
};

const emptyState: CartState = {
  itemsById: {},
  itemIds: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {}
};

beforeEach(() => {
  useCartStore.setState({
    itemsById: {},
    itemIds: []
  });
});

describe('cart selectors', () => {
  it('selectCartItems returns cart items in itemIds order', () => {
    const state: CartState = {
      ...emptyState,
      itemIds: ['chips-1', 'pizza-1'],
      itemsById: {
        'pizza-1': {
          ...pizza,
          quantity: 2
        },
        'chips-1': {
          ...chips,
          quantity: 1
        }
      }
    };

    expect(selectCartItems(state)).toEqual([
      {
        ...chips,
        quantity: 1
      },
      {
        ...pizza,
        quantity: 2
      }
    ]);
  });

  it('selectCartItems filters missing items', () => {
    const state: CartState = {
      ...emptyState,
      itemIds: ['pizza-1', 'missing-item'],
      itemsById: {
        'pizza-1': {
          ...pizza,
          quantity: 1
        }
      }
    };

    expect(selectCartItems(state)).toEqual([
      {
        ...pizza,
        quantity: 1
      }
    ]);
  });

  it('selectSubtotalCents returns the cart subtotal', () => {
    const state: CartState = {
      ...emptyState,
      itemIds: ['pizza-1', 'chips-1'],
      itemsById: {
        'pizza-1': {
          ...pizza,
          quantity: 2
        },
        'chips-1': {
          ...chips,
          quantity: 3
        }
      }
    };

    expect(selectSubtotalCents(state)).toBe(1299 * 2 + 399 * 3);
  });

  it('selectCartIsEmpty returns true when there are no item ids', () => {
    expect(selectCartIsEmpty(emptyState)).toBe(true);
  });

  it('selectCartIsEmpty returns false when there are item ids', () => {
    const state: CartState = {
      ...emptyState,
      itemIds: ['pizza-1']
    };

    expect(selectCartIsEmpty(state)).toBe(false);
  });
});

describe('useCartStore actions', () => {
  it('starts with an empty cart', () => {
    const state = useCartStore.getState();

    expect(state.itemIds).toEqual([]);
    expect(state.itemsById).toEqual({});
  });

  it('adds an item to the cart', () => {
    useCartStore.getState().addItem(pizza);

    const state = useCartStore.getState();

    expect(state.itemIds).toEqual(['pizza-1']);
    expect(state.itemsById['pizza-1']).toEqual({
      ...pizza,
      quantity: 1
    });
  });

  it('increments quantity when adding the same item again', () => {
    useCartStore.getState().addItem(pizza);
    useCartStore.getState().addItem(pizza);

    const state = useCartStore.getState();

    expect(state.itemIds).toEqual(['pizza-1']);
    expect(state.itemsById['pizza-1']?.quantity).toBe(2);
  });

  it('updates item quantity', () => {
    useCartStore.getState().addItem(pizza);

    useCartStore.getState().updateQuantity('pizza-1', 5);

    expect(useCartStore.getState().itemsById['pizza-1']?.quantity).toBe(5);
  });

  it('removes an item from the cart', () => {
    useCartStore.getState().addItem(pizza);
    useCartStore.getState().addItem(chips);

    useCartStore.getState().removeItem('pizza-1');

    const state = useCartStore.getState();

    expect(state.itemIds).toEqual(['chips-1']);
    expect(state.itemsById['pizza-1']).toBeUndefined();
    expect(state.itemsById['chips-1']).toEqual({
      ...chips,
      quantity: 1
    });
  });

  it('clears the cart', () => {
    useCartStore.getState().addItem(pizza);
    useCartStore.getState().addItem(chips);

    useCartStore.getState().clearCart();

    const state = useCartStore.getState();

    expect(state.itemIds).toEqual([]);
    expect(state.itemsById).toEqual({});
  });
});
