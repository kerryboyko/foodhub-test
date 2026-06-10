// src/stores/cart-store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CartItem } from './cartTypes';
import type { MenuItem } from '@/schemas/menu';
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
  getItems: () => CartItem[];
  subtotalCents: () => number;
};

/* N.B.: Regarding the getItems() selector. We're going to end up recreating it a lot in the component, instead of
   calling it directly. 
   
   There's an issue with React Compiler; the selector will return a new array on every render.

   Now, the normal solution is to use Zustand's 'useShallow', but React Compiler + Zustand + selector-generated
   arrays can sometimes produce surprising interactions. 

   I'm making a deliberate choice to keep the selector for internal use, but to use a manual selector
   in the components. 
*/

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
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
          set({ itemsById: {}, itemIds: [] }, false, 'cart/clearCart'),

        getItems: () =>
          get()
            .itemIds.map((id) => get().itemsById[id])
            .filter((item): item is CartItem => Boolean(item)),

        subtotalCents: () =>
          get()
            .getItems()
            .reduce((total, item) => total + item.priceCents * item.quantity, 0)
      }),
      { name: 'cart-store' }
    )
  )
);
