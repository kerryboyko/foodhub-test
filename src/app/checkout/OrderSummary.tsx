'use client';
import { useCheckoutCart } from '@/hooks/checkout/useCheckoutCart';
import { formatPrice } from '@/lib/formatPrice';

export default function OrderSummary() {
  const { items } = useCheckoutCart();

  return (
    <main>
      <>
        {items.map((item) => (
          <div key={item.id}>
            <h2 data-testid={`item-name-${item.name}`}>{item.name}</h2>
            <p data-testid={`item-quantity-${item.name}`}>
              Quantity: {item.quantity}
            </p>
            <p data-testid={`item-price-${item.name}`}>
              Price: {formatPrice(item.priceCents * item.quantity)}
            </p>
          </div>
        ))}
      </>
    </main>
  );
}
