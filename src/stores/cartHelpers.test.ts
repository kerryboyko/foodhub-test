// src/features/cart/cart-helpers.test.ts
import { describe, expect, it } from 'vitest';
import type { MenuItem } from '@/schemas/menu';
import type { CartState } from './cartStore';
import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantityInCart
} from './cartHelpers';

/* These helpers can be tested as pure functions, without needing to set up the entire store. */

const springRolls: MenuItem = {
  id: 'item_1001',
  name: 'Vegetable Spring Rolls',
  description: 'Crispy pastry rolls.',
  priceCents: 595,
  allergens: ['gluten', 'soy'],
  available: true,
  image: '/images/menu/vegetable-spring-rolls.jpg'
};

const fries: MenuItem = {
  id: 'item_4001',
  name: 'Skinny Fries',
  description: 'Crisp golden fries.',
  priceCents: 395,
  allergens: [],
  available: true,
  image: '/images/menu/skinny-fries.jpg'
};

function createCartState(overrides: Partial<CartState> = {}): CartState {
  return {
    itemsById: {},
    itemIds: [],
    addItem: () => undefined,
    removeItem: () => undefined,
    updateQuantity: () => undefined,
    clearCart: () => undefined,
    getItems: () => [],
    subtotalCents: () => 0,
    ...overrides
  };
}

describe('cart helpers', () => {
  describe('addItemToCart', () => {
    it('adds a new item with quantity 1', () => {
      const state = createCartState();

      const nextState = addItemToCart(state, springRolls);

      expect(nextState.itemsById.item_1001).toMatchObject({
        id: 'item_1001',
        quantity: 1
      });
      expect(nextState.itemIds).toEqual(['item_1001']);
    });

    it('increments quantity when the item already exists', () => {
      const state = addItemToCart(createCartState(), springRolls);

      const nextState = addItemToCart(state, springRolls);

      expect(nextState.itemsById.item_1001.quantity).toBe(2);
      expect(nextState.itemIds).toEqual(['item_1001']);
    });

    it('preserves item order when adding multiple items', () => {
      const state = createCartState();

      const withSpringRolls = addItemToCart(state, springRolls);
      const withFries = addItemToCart(withSpringRolls, fries);

      expect(withFries.itemIds).toEqual(['item_1001', 'item_4001']);
    });
  });

  describe('removeItemFromCart', () => {
    it('removes an existing item', () => {
      const state = addItemToCart(createCartState(), springRolls);

      const nextState = removeItemFromCart(state, 'item_1001');

      expect(nextState.itemsById.item_1001).toBeUndefined();
      expect(nextState.itemIds).toEqual([]);
    });

    it('does nothing when removing a missing item', () => {
      const state = addItemToCart(createCartState(), springRolls);

      const nextState = removeItemFromCart(state, 'missing_item');

      expect(nextState.itemsById).toEqual(state.itemsById);
      expect(nextState.itemIds).toEqual(['item_1001']);
    });
  });

  describe('updateItemQuantityInCart', () => {
    it('updates quantity for an existing item', () => {
      const state = addItemToCart(createCartState(), springRolls);

      const nextState = updateItemQuantityInCart(state, 'item_1001', 3);

      expect(nextState.itemsById.item_1001.quantity).toBe(3);
      expect(nextState.itemIds).toEqual(['item_1001']);
    });

    it('removes item when quantity is zero', () => {
      const state = addItemToCart(createCartState(), springRolls);

      const nextState = updateItemQuantityInCart(state, 'item_1001', 0);

      expect(nextState.itemsById.item_1001).toBeUndefined();
      expect(nextState.itemIds).toEqual([]);
    });

    it('removes item when quantity is negative', () => {
      const state = addItemToCart(createCartState(), springRolls);

      const nextState = updateItemQuantityInCart(state, 'item_1001', -1);

      expect(nextState.itemsById.item_1001).toBeUndefined();
      expect(nextState.itemIds).toEqual([]);
    });

    it('does nothing when updating a missing item', () => {
      const state = createCartState();

      const nextState = updateItemQuantityInCart(state, 'missing_item', 2);

      expect(nextState).toBe(state);
    });
  });
});
