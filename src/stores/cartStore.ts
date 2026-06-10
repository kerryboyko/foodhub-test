// src/stores/cart-store.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { MenuItem } from '@/schemas/menu';
import type { CartItem } from './cartTypes';
import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantityInCart
} from './cartHelpers';

export type CartState = {
  itemsById: Record<string, CartItem>;
  itemIds: string[];

  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

// selectors
export const selectCartItems = (state: CartState): CartItem[] =>
  state.itemIds
    .map((id) => state.itemsById[id])
    .filter((item): item is CartItem => Boolean(item));

export const selectSubtotalCents = (state: CartState): number =>
  selectCartItems(state).reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0
  );

export const selectCartIsEmpty = (state: CartState): boolean =>
  state.itemIds.length === 0;

// useCartStore
export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        itemsById: {},
        itemIds: [],

        addItem: (item) =>
          set((state) => addItemToCart(state, item), false, 'cart/addItem'),

        removeItem: (itemId) =>
          set(
            (state) => removeItemFromCart(state, itemId),
            false,
            'cart/removeItem'
          ),

        updateQuantity: (itemId, quantity) =>
          set(
            (state) => updateItemQuantityInCart(state, itemId, quantity),
            false,
            'cart/updateQuantity'
          ),

        clearCart: () =>
          set({ itemsById: {}, itemIds: [] }, false, 'cart/clearCart')
      }),
      { name: 'cart-store' }
    )
  )
);
