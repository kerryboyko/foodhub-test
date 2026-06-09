// src/stores/cart-store.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from './cartStore';
import type { MenuItem } from '@/schemas/menu';

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

describe('cart-store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('starts with an empty cart', () => {
    const state = useCartStore.getState();

    expect(state.getItems()).toEqual([]);
    expect(state.subtotalCents()).toBe(0);
  });

  it('adds a new item to the cart', () => {
    useCartStore.getState().addItem(springRolls);

    const state = useCartStore.getState();

    expect(state.itemIds).toEqual(['item_1001']);

    expect(state.itemsById.item_1001).toMatchObject({
      id: 'item_1001',
      quantity: 1
    });
  });

  it('increments quantity when adding the same item again', () => {
    const store = useCartStore.getState();

    store.addItem(springRolls);
    store.addItem(springRolls);

    expect(useCartStore.getState().itemsById.item_1001.quantity).toBe(2);
    expect(useCartStore.getState().itemIds).toEqual(['item_1001']);
  });

  it('preserves item order', () => {
    const store = useCartStore.getState();

    store.addItem(springRolls);
    store.addItem(fries);

    expect(
      useCartStore
        .getState()
        .getItems()
        .map((item) => item.id)
    ).toEqual(['item_1001', 'item_4001']);
  });

  it('updates quantity', () => {
    const store = useCartStore.getState();

    store.addItem(springRolls);
    store.updateQuantity('item_1001', 3);

    expect(useCartStore.getState().itemsById.item_1001.quantity).toBe(3);
  });

  it('removes item when quantity is updated to zero', () => {
    const store = useCartStore.getState();

    store.addItem(springRolls);
    store.updateQuantity('item_1001', 0);

    expect(useCartStore.getState().itemsById.item_1001).toBeUndefined();
    expect(useCartStore.getState().itemIds).toEqual([]);
  });

  it('removes an item from the cart', () => {
    const store = useCartStore.getState();

    store.addItem(springRolls);
    store.removeItem('item_1001');

    expect(useCartStore.getState().getItems()).toEqual([]);
  });

  it('calculates subtotal in cents', () => {
    const store = useCartStore.getState();

    store.addItem(springRolls);
    store.addItem(springRolls);
    store.addItem(fries);

    expect(useCartStore.getState().subtotalCents()).toBe(1585);
  });

  it('clears the cart', () => {
    const store = useCartStore.getState();

    store.addItem(springRolls);
    store.addItem(fries);
    store.clearCart();

    expect(useCartStore.getState().itemsById).toEqual({});
    expect(useCartStore.getState().itemIds).toEqual([]);
  });

  it('works with a very complex scenario', () => {
    const store = useCartStore.getState();

    store.addItem(springRolls);
    store.addItem(fries);
    store.updateQuantity(springRolls.id, 5);
    store.updateQuantity(fries.id, 2);
    expect(useCartStore.getState().itemsById).toEqual({
      [springRolls.id]: { ...springRolls, quantity: 5 },
      [fries.id]: { ...fries, quantity: 2 }
    });
    expect(useCartStore.getState().itemIds).toEqual([springRolls.id, fries.id]);
    expect(useCartStore.getState().subtotalCents()).toBe(3765);

    store.removeItem(springRolls.id);
    expect(useCartStore.getState().itemsById).toEqual({
      [fries.id]: { ...fries, quantity: 2 }
    });
    expect(useCartStore.getState().itemIds).toEqual([fries.id]);
    expect(useCartStore.getState().subtotalCents()).toBe(790);

    store.addItem(springRolls);
    store.updateQuantity(springRolls.id, 2);
    expect(useCartStore.getState().itemsById).toEqual({
      [springRolls.id]: { ...springRolls, quantity: 2 },
      [fries.id]: { ...fries, quantity: 2 }
    });
    expect(useCartStore.getState().itemIds).toEqual([fries.id, springRolls.id]);
    expect(useCartStore.getState().subtotalCents()).toBe(1980);

    store.clearCart();

    expect(useCartStore.getState().itemsById).toEqual({});
    expect(useCartStore.getState().itemIds).toEqual([]);
  });
});
