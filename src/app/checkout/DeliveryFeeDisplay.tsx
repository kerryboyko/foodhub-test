import { DELIVERY_FEE_CENTS, DELIVERY_WAIVER_MINIMUM } from '@/data/constants';
import { CheckoutFormData } from '@/schemas/checkout';

export default function DeliveryFeeDisplay({
  fulfillmentType,
  subtotalCents
}: {
  fulfillmentType: CheckoutFormData['fulfilmentType'];
  subtotalCents: number;
}) {
  if (fulfillmentType !== 'delivery') {
    return null;
  }
  if (subtotalCents >= DELIVERY_WAIVER_MINIMUM) {
    return `This order qualifies for free delivery!`;
  }
  return `Delivery: €${(DELIVERY_FEE_CENTS / 100).toFixed(2)}`;
}
