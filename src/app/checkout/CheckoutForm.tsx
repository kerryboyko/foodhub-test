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
import { useState } from 'react';
import styles from './checkoutpage.module.scss';
import { CreditCard } from 'lucide-react';

export default function CheckoutForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    isCartEmpty
  } = useCheckoutCartWithFulfilment({ fulfilmentType });

  const doHandleSubmit = handleSubmit(async (data: CheckoutFormData) => {
    setSubmitError(null);
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
      setSubmitError(result.message ?? 'Checkout failed');
      return;
    }
    clearCart();
    router.push(`/order-confirmation/${result.orderId}`);
  });

  const disableSubmit = Boolean(isSubmitting || isCartEmpty);

  return (
    <div suppressHydrationWarning>
      {/* Zustand persists cart state in localStorage and rehydrates on the client.
          During hydration, the server-rendered cart state may temporarily differ
          from the client state. suppressHydrationWarning prevents React from
          reporting this expected mismatch. */}
      <form onSubmit={doHandleSubmit}>
        <CustomerFields register={register} errors={errors} />

        <FulfilmentFields
          register={register}
          errors={errors}
          fulfilmentType={fulfilmentType}
        />

        <PaymentFields register={register} errors={errors} />
        {submitError ? (
          <p
            className={styles.error}
            data-testid="checkout-form-submit-error"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}
        <hr />
        <CheckoutTotals totalCents={totalCents} />
        <div className={styles.checkoutpage__placeOrder}>
          <button
            data-testid={'checkout-page-submit-button'}
            type="submit"
            disabled={disableSubmit}
            className={styles.checkoutpage__placeOrder__submitButton}
          >
            <CreditCard
              className={styles.checkoutpage__placeOrder__submitButton__icon}
            />
            {isSubmitting ? 'Placing order...' : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  );
}
