'use client';

import type { MenuItem } from '@/schemas/menu';
import { useCartStore } from '@/stores/cartStore';

type CartControlProps = {
  item: MenuItem;
};

export function CartControl({ item }: CartControlProps) {
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const quantity = useCartStore(
    (state) => state.itemsById[item.id]?.quantity ?? 0
  );

  const add = () => addItem(item);
  const remove = () => removeItem(item.id);
  const increment = () => updateQuantity(item.id, quantity + 1);
  const decrement = () => updateQuantity(item.id, quantity - 1);

  return (
    <div data-testid={`cart-control-${item.id}`} className={'tbd'}>
      {quantity <= 0 ? (
        <button
          data-testid={`cart-control-add-${item.id}`}
          type="button"
          onClick={add}
          disabled={!item.available}
          aria-label={`Add ${item.name} to cart`}
        >
          {item.available ? 'Add to cart' : 'Unavailable'}
        </button>
      ) : (
        <div>
          <button
            data-testid={`cart-control-decrement-${item.id}`}
            type="button"
            onClick={decrement}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            -
          </button>
          <div data-testid={`cart-control-quantity-${item.id}`}>{quantity}</div>
          <button
            data-testid={`cart-control-increment-${item.id}`}
            type="button"
            onClick={increment}
            aria-label={`Increase quantity of ${item.name}`}
          >
            +
          </button>
          <button
            data-testid={`cart-control-remove-${item.id}`}
            type="button"
            onClick={remove}
            aria-label={`Remove ${item.name} from cart`}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
