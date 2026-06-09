// src/features/cart/cart-helpers.ts
import type { MenuItem } from '@/schemas/menu';
import { CartState } from './cartStore';

/* Why have this cartHelpers file instead of putting the logic directly in the store?
- Separation of concerns: Keeps the store focused on state management, while cartHelpers 
     handles business logic.
- Reusability: Allows us to reuse the add/remove logic in other places if needed 
     (e.g., server-side cart processing).
- Testability: Makes it easier to write unit tests for the cart manipulation logic 
     without needing to set up the entire store.
*/

export function addItemToCart(state: CartState, item: MenuItem) {
  const { itemsById, itemIds } = state;

  const existingItem = itemsById[item.id];

  const newItemsById = {
    ...itemsById,
    [item.id]: {
      ...item,
      quantity: existingItem ? existingItem.quantity + 1 : 1
    }
  };

  const newItemIds = existingItem ? itemIds : [...itemIds, item.id];

  return { ...state, itemsById: newItemsById, itemIds: newItemIds };
}

export function removeItemFromCart(state: CartState, itemId: string) {
  const { itemsById, itemIds } = state;
  const { [itemId]: _removed, ...remainingItems } = itemsById;
  return {
    ...state,
    itemsById: remainingItems,
    itemIds: itemIds.filter((id) => id !== itemId)
  };
}

export function updateItemQuantityInCart(
  state: CartState,
  itemId: string,
  quantity: number
) {
  const { itemsById } = state;

  if (quantity <= 0) {
    return removeItemFromCart(state, itemId);
  }

  const existingItem = itemsById[itemId];

  if (!existingItem) {
    return state;
  }

  const newItemsById = {
    ...itemsById,
    [itemId]: {
      ...existingItem,
      quantity
    }
  };

  return { ...state, itemsById: newItemsById };
}
