import Link from 'next/link';
import CheckoutForm from './CheckoutForm';
import CartList from '@/components/CartList/CartList';
import { ArrowBigLeft } from 'lucide-react';
import styles from './checkoutpage.module.scss';

export default async function CheckoutPage() {
  return (
    <main className={styles.checkoutpage__container}>
      <div className={styles.checkoutpage}>
        <h2 className={styles.checkoutpage__heading}>Checkout</h2>
        <hr />
        <CartList />
        <div className={styles.checkoutpage__changeOrder}>
          <Link
            className={styles.checkoutpage__changeOrder__link}
            data-testid={`cart-control-changeOrder-link`}
            aria-label={`Change your order`}
            href="/menu"
          >
            <ArrowBigLeft
              className={styles.checkoutpage__changeOrder__link__icon}
            />
            Change Your Order
          </Link>
        </div>
        <hr />

        <CheckoutForm />
      </div>
    </main>
  );
}
