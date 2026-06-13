'use client';
import {
  Utensils,
  Frown,
  CircleX,
  SquarePlus,
  SquareMinus
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import type { MenuItem } from '@/schemas/menu';
import styles from './CartControl.module.scss';

type CartControlProps = {
  item: MenuItem;
};

export default function CartControl({ item }: CartControlProps) {
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
    <div className={styles.cartControl} data-testid={`cart-control-${item.id}`}>
      {quantity <= 0 ? (
        <button
          className={styles.cartControl__addToCart}
          data-testid={`cart-control-add-${item.id}`}
          type="button"
          onClick={add}
          disabled={!item.available}
          aria-label={`Add ${item.name} to cart`}
        >
          {item.available ? (
            <>
              <Utensils className={styles.cartControl__addToCart__icon} />
              <div>Add to cart</div>
            </>
          ) : (
            <>
              <Frown className={styles.cartControl__addToCart__icon} />
              <div>Unavailable</div>
            </>
          )}
        </button>
      ) : (
        <>
          <button
            className={styles.cartControl__decrement}
            data-testid={`cart-control-decrement-${item.id}`}
            type="button"
            onClick={decrement}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            <SquareMinus />
          </button>
          <div
            className={styles.cartControl__quantity}
            data-testid={`cart-control-quantity-${item.id}`}
          >
            {quantity}
          </div>
          <button
            className={styles.cartControl__increment}
            data-testid={`cart-control-increment-${item.id}`}
            type="button"
            onClick={increment}
            aria-label={`Increase quantity of ${item.name}`}
          >
            <SquarePlus />
          </button>
          <button
            className={styles.cartControl__remove}
            data-testid={`cart-control-remove-${item.id}`}
            type="button"
            onClick={remove}
            aria-label={`Remove ${item.name} from cart`}
          >
            <CircleX className={styles.cartControl__remove__icon} />
            Remove
          </button>
        </>
      )}
    </div>
  );
}
