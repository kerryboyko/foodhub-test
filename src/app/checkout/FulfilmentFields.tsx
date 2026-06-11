import type { CheckoutFormData } from '@/schemas/checkout';
import type { CheckoutCommonProps } from './checkout.types';

interface FulfilmentFieldProps extends CheckoutCommonProps {
  fulfilmentType: CheckoutFormData['fulfilmentType'];
}

export default function FulfilmentFields({
  register,
  errors,
  fulfilmentType
}: FulfilmentFieldProps) {
  return (
    <>
      <fieldset>
        <legend>How will you receive the order?</legend>

        <label>
          <input
            data-testid="fulfilment-fields-radio-delivery"
            type="radio"
            value="delivery"
            {...register('fulfilmentType')}
          />
          Delivery
        </label>

        <label>
          <input
            data-testid="fulfilment-fields-radio-collection"
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
    </>
  );
}
