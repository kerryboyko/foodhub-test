import { formatPrice } from '@/lib/formatPrice';

interface CheckoutTotalsProps {
  subtotalCents: number;
  totalCents: number;
  deliveryFeeText: string | null;
}

export default function CheckoutTotals({
  subtotalCents,
  totalCents,
  deliveryFeeText
}: CheckoutTotalsProps) {
  return (
    <>
      <div data-testid="checkout-totals-subtotal">
        Subtotal: {formatPrice(subtotalCents)}
      </div>
      {deliveryFeeText ? (
        <div data-testid="checkout-totals-delivery-fee-text">
          {deliveryFeeText}
        </div>
      ) : null}
      <div data-testid="checkout-totals-total">
        Total: {formatPrice(totalCents)}
      </div>
    </>
  );
}
