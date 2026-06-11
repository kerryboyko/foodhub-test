'use client';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer: data,
        order: orderData
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message ?? 'Checkout failed');
    }
    clearCart();
    router.push(`/order-confirmation/${result.orderId}`);
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
