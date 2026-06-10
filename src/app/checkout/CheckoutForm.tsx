'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutSchema } from '@/schemas/checkout';
import CheckoutTotals from './CheckoutTotals';
import CustomerFields from './CustomerFields';
import FulfilmentFields from './FulfilmentFields';
import PaymentFields from './PaymentFields';
import { useCheckoutCartWithFulfilment } from '@/hooks/checkout/useCheckoutCartWithFulfilment';
import type { CheckoutFormData } from '@/schemas/checkout';

export default function CheckoutForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
    mode: 'onBlur',
    defaultValues: {
      fulfilmentType: 'delivery'
    }
  });

  // useWatch is used here because we are using
  // React Compiler. the normal 'watch' can't be memoized
  // without leading to stale UI.
  const fulfilmentType = useWatch({
    control,
    name: 'fulfilmentType'
  });

  const {
    items,
    subtotalCents,
    clearCart,
    totalCents,
    deliveryChargeCents,
    isCartEmpty,
    deliveryFeeDisplay
  } = useCheckoutCartWithFulfilment({ fulfilmentType });

  const doHandleSubmit = handleSubmit(async (data: CheckoutFormData) => {
    const orderData = {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        priceCents: item.priceCents,
        quantity: item.quantity
      })),
      subtotalCents,
      deliveryChargeCents,
      totalCents
    };
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Fake checkout submitted:', { data, order: orderData }); // codesmell. Replace with real submission logic.
    clearCart();
  });

  return (
    <>
      <CheckoutTotals
        subtotalCents={subtotalCents}
        totalCents={totalCents}
        deliveryFeeText={deliveryFeeDisplay}
      />
      <hr />
      <form onSubmit={doHandleSubmit}>
        <CustomerFields register={register} errors={errors} />

        <FulfilmentFields
          register={register}
          errors={errors}
          fulfilmentType={fulfilmentType}
        />
        <hr />

        <PaymentFields register={register} errors={errors} />
        <hr />

        <button type="submit" disabled={isSubmitting || isCartEmpty}>
          {isSubmitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </>
  );
}
