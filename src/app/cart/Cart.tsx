'use client';
import { CartControl } from '@/components/CartControl';
import { DELIVERY_FEE_CENTS, DELIVERY_WAIVER_MINIMUM } from '@/data/constants';
import { useCheckoutCart } from '@/hooks/checkout/useCheckoutCart';
import { formatPrice } from '@/lib/formatPrice';

export default function Cart() {
  const { items, subtotalCents } = useCheckoutCart();

  return (
    <main>
      <>
        <div>Subtotal: {formatPrice(subtotalCents)}</div>
        <div>
          {subtotalCents >= DELIVERY_WAIVER_MINIMUM
            ? 'This order qualifies for free delivery!'
            : `Delivery: ${formatPrice(DELIVERY_FEE_CENTS)}`}
        </div>
        {items.map((item) => (
          <div key={item.id}>
            <h2>{item.name}</h2>
            <CartControl item={item} />
          </div>
        ))}
      </>
    </main>
  );
}
