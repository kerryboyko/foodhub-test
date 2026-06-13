import { formatPrice } from '@/lib/formatPrice';
import styles from './checkoutpage.module.scss';

export default function CheckoutTotals({ totalCents }: { totalCents: number }) {
  return (
    <div className={styles.total} data-testid="checkout-totals-total">
      Total: {formatPrice(totalCents)}
    </div>
  );
}
