import { DELIVERY_FEE_CENTS, DELIVERY_WAIVER_MINIMUM } from '@/data/constants';
import { formatPrice } from '@/lib/formatPrice';
import { CheckoutFormData } from '@/schemas/checkout';

export default function DeliveryFeeDisplay({
  fulfilmentType,
  subtotalCents
}: {
  fulfilmentType: CheckoutFormData['fulfilmentType'];
  subtotalCents: number;
}) {
  if (fulfilmentType !== 'delivery') {
    return null;
  }
  if (subtotalCents >= DELIVERY_WAIVER_MINIMUM) {
    return `This order qualifies for free delivery!`;
  }
  return `Delivery: ${formatPrice(DELIVERY_FEE_CENTS)}`;
}
