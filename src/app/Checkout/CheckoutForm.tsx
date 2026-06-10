'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutSchema } from '@/schemas/checkout';
import type { CheckoutFormData } from '@/schemas/checkout';
import { useCartStore } from '@/stores/cartStore';
import { DELIVERY_WAIVER_MINIMUM, DELIVERY_FEE_CENTS } from '@/data/constants';
import DeliveryFeeDisplay from './DeliveryFeeDisplay';
import { formatPrice } from '@/lib/formatPrice';

export default function CheckoutForm() {
  const itemIds = useCartStore((state) => state.itemIds);
  const itemsById = useCartStore((state) => state.itemsById);
  const items = itemIds.map((id) => itemsById[id]).filter(Boolean);

  const subtotalCents = useCartStore((state) => state.subtotalCents());

  // const clearCart = useCartStore((state) => state.clearCart);

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
  const deliveryChargeCents =
    fulfilmentType === 'delivery' && subtotalCents < DELIVERY_WAIVER_MINIMUM
      ? DELIVERY_FEE_CENTS
      : 0;

  const totalCents = subtotalCents + deliveryChargeCents;

  const isCartEmpty = items.length === 0;

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
    // clearCart();
  });

  return (
    <>
      <div>Subtotal: {formatPrice(subtotalCents)}</div>
      <DeliveryFeeDisplay
        fulfilmentType={fulfilmentType}
        subtotalCents={subtotalCents}
      />
      <div>Total: {formatPrice(totalCents)}</div>
      <hr />
      <form onSubmit={doHandleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" {...register('name')} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="tel" {...register('phone')} />
          {errors.phone && <p>{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <fieldset>
          <legend>How will you receive the order?</legend>

          <label>
            <input
              type="radio"
              value="delivery"
              {...register('fulfilmentType')}
            />
            Delivery
          </label>

          <label>
            <input
              type="radio"
              value="collection"
              {...register('fulfilmentType')}
            />
            Collection
          </label>

          {errors.fulfilmentType && <p>{errors.fulfilmentType.message}</p>}
        </fieldset>

        {fulfilmentType === 'delivery' && (
          <>
            <div>
              <label htmlFor="addressLine1">Address Line 1</label>
              <input
                id="addressLine1"
                type="text"
                {...register('addressLine1')}
              />
              {errors.addressLine1 && <p>{errors.addressLine1.message}</p>}
            </div>

            <div>
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                id="addressLine2"
                type="text"
                {...register('addressLine2')}
              />
              {errors.addressLine2 && <p>{errors.addressLine2.message}</p>}
            </div>

            <div>
              <label htmlFor="postcode">Postcode/Zipcode</label>
              <input id="postcode" type="text" {...register('postcode')} />
              {errors.postcode && <p>{errors.postcode.message}</p>}
            </div>
          </>
        )}

        <div>
          <label htmlFor="notes">Notes optional</label>
          <textarea id="notes" {...register('notes')} />
          {errors.notes && <p>{errors.notes.message}</p>}
        </div>

        <div>
          <label htmlFor="creditCard">Credit Card</label>
          <input
            id="creditCard"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            {...register('creditCard')}
          />
          {errors.creditCard && <p>{errors.creditCard.message}</p>}
        </div>

        <div>
          <label htmlFor="ccExpiration">Expiration Date</label>
          <input
            id="ccExpiration"
            type="text"
            placeholder="MM/YY"
            autoComplete="cc-exp"
            {...register('ccExpiration')}
          />
          {errors.ccExpiration && <p>{errors.ccExpiration.message}</p>}
        </div>

        <div>
          <label htmlFor="ccCVCcode">CVC Code</label>
          <input
            id="ccCVCcode"
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
            {...register('ccCVCcode')}
          />
          {errors.ccCVCcode && <p>{errors.ccCVCcode.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting || isCartEmpty}>
          {isSubmitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </>
  );
}
