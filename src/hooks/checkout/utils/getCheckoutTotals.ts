import { DELIVERY_WAIVER_MINIMUM, DELIVERY_FEE_CENTS } from '@/data/constants';
import { formatPrice } from '@/lib/formatPrice';
import { CheckoutFormData } from '@/schemas/checkout';

interface GetCheckoutTotalsParams {
  fulfilmentType: CheckoutFormData['fulfilmentType'];
  subtotalCents: number;
}

export const getCheckoutTotals = ({
  fulfilmentType,
  subtotalCents
}: GetCheckoutTotalsParams): {
  totalCents: number;
  deliveryChargeCents: number;
  deliveryFeeDisplay: string | null;
} => {
  if (fulfilmentType === 'collection') {
    return {
      deliveryFeeDisplay: null,
      totalCents: subtotalCents,
      deliveryChargeCents: 0
    };
  }
  if (
    fulfilmentType === 'delivery' &&
    subtotalCents < DELIVERY_WAIVER_MINIMUM
  ) {
    return {
      deliveryChargeCents: DELIVERY_FEE_CENTS,
      totalCents: subtotalCents + DELIVERY_FEE_CENTS,
      deliveryFeeDisplay: `Delivery: ${formatPrice(DELIVERY_FEE_CENTS)}`
    };
  }
  return {
    deliveryChargeCents: 0,
    totalCents: subtotalCents,
    deliveryFeeDisplay: `This order qualifies for free delivery!`
  };
};
