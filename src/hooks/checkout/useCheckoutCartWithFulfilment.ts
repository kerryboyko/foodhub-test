import { CheckoutFormData } from '@/schemas/checkout';
import { useCheckoutCart } from './useCheckoutCart';
import { getCheckoutTotals } from './utils/getCheckoutTotals';

export const useCheckoutCartWithFulfilment = ({
  fulfilmentType
}: {
  fulfilmentType: CheckoutFormData['fulfilmentType'];
}) => {
  const { items, subtotalCents, clearCart, isCartEmpty } = useCheckoutCart();
  const { totalCents, deliveryChargeCents, deliveryFeeDisplay } =
    getCheckoutTotals({
      fulfilmentType,
      subtotalCents
    });

  return {
    items,
    subtotalCents,
    clearCart,
    totalCents,
    deliveryChargeCents,
    isCartEmpty,
    deliveryFeeDisplay
  };
};
