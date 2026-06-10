import {
  useCartStore,
  selectCartItems,
  selectSubtotalCents,
  selectCartIsEmpty
} from '@/stores/cartStore';
import { useShallow } from 'zustand/react/shallow';

// Factoring out checkout cart state makes this easier to test independently.
export const useCheckoutCart = () => {
  const items = useCartStore(useShallow(selectCartItems));
  const subtotalCents = useCartStore(selectSubtotalCents);
  const clearCart = useCartStore((state) => state.clearCart);
  const isCartEmpty = useCartStore(selectCartIsEmpty);

  return {
    items,
    subtotalCents,
    clearCart,
    isCartEmpty
  };
};
