'use client';

import { useCartStore, selectCartIsEmpty } from '@/stores/cartStore';
import { ShoppingBasket } from 'lucide-react';

import styles from './CartBar.module.scss';
import Link from 'next/link';
import CartList from '../CartList/CartList';

export default function CartBar() {
  const cartIsEmpty = useCartStore(selectCartIsEmpty);

  return (
    <div
      className={`${styles.cartBar} ${!cartIsEmpty ? styles.cartBarVisible : ''}`}
      data-testid="cart-bar"
    >
      {cartIsEmpty ? null : (
        <>
          <CartList />
          <div className={styles.cartBar__goToCheckout}>
            <Link
              className={styles.cartBar__goToCheckout__link}
              href="/checkout"
            >
              <ShoppingBasket
                className={styles.cartBar__goToCheckout__link__icon}
              />
              Go To Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
