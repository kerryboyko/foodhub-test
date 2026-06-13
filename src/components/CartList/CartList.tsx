'use client';

import {
  useCartStore,
  selectCartItems,
  selectSubtotalCents
} from '@/stores/cartStore';
import { Utensils } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { DELIVERY_WAIVER_MINIMUM, DELIVERY_FEE_CENTS } from '@/data/constants';
import { useShallow } from 'zustand/react/shallow';
import styles from './CartList.module.scss';

export default function CartList() {
  const items = useCartStore(useShallow(selectCartItems));
  const subtotalCents = useCartStore(selectSubtotalCents);

  const isFree = subtotalCents >= DELIVERY_WAIVER_MINIMUM;

  return (
    <>
      <h3 className={styles.cartList__heading} data-testid={`cart-bar-heading`}>
        Your Order:
      </h3>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.cartList__item}
          data-testid={`cart-bar-${item.id}`}
        >
          <Utensils className={styles.cartList__item__icon} />
          {item.quantity} x {item.name}:{' '}
          {formatPrice(item.quantity * item.priceCents)}
        </div>
      ))}
      <div
        className={styles.cartList__subtotal}
        data-testid={`cart-bar-subtotal`}
      >
        Subtotal: {formatPrice(subtotalCents)}
      </div>
      <div
        className={`${styles.cartList__deliveryFee} ${isFree ? styles.cartList__deliveryFee__isFree : ''}`}
        data-testid={`cart-bar-delivery-fee`}
      >
        {isFree
          ? 'This order qualifies for free delivery!'
          : `Delivery: ${formatPrice(DELIVERY_FEE_CENTS)}`}
      </div>
    </>
  );
}
