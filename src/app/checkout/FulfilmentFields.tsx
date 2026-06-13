import type { CheckoutFormData } from '@/schemas/checkout';
import type { CheckoutCommonProps } from './checkout.types';
import styles from './checkoutpage.module.scss';

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
      <fieldset className={`${styles.field} ${styles.radioGroup}`}>
        <legend className={styles.label}>
          How will you receive the order?
        </legend>
        <label className={styles.radioOption}>
          <input
            data-testid="fulfilment-fields-radio-delivery"
            type="radio"
            value="delivery"
            {...register('fulfilmentType')}
          />
          <span className={styles.radioText}>Deliver the order to me</span>{' '}
        </label>
        <label className={styles.radioOption}>
          <input
            data-testid="fulfilment-fields-radio-collection"
            type="radio"
            value="collection"
            {...register('fulfilmentType')}
          />
          <span className={styles.radioText}>
            I will collect the order myself
          </span>{' '}
        </label>
        {errors.fulfilmentType && (
          <p className={styles.error}>{errors.fulfilmentType.message}</p>
        )}
      </fieldset>

      {fulfilmentType === 'delivery' && (
        <>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="addressLine1">
              Address Line 1
            </label>
            <input
              data-testid="fulfillment-fields-addressLine1-input"
              id="addressLine1"
              type="text"
              {...register('addressLine1')}
            />
            {errors.addressLine1 && (
              <p className={styles.error}>{errors.addressLine1.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="addressLine2">
              Address Line 2
            </label>
            <input
              data-testid="fulfillment-fields-addressLine2-input"
              id="addressLine2"
              type="text"
              {...register('addressLine2')}
            />
            {errors.addressLine2 && (
              <p className={styles.error}>{errors.addressLine2.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="postcode">
              Postcode/Zipcode
            </label>
            <input
              data-testid="fulfillment-fields-notes-postcode"
              id="postcode"
              type="text"
              {...register('postcode')}
            />
            {errors.postcode && (
              <p className={styles.error}>{errors.postcode.message}</p>
            )}
          </div>
        </>
      )}

      <div data-testid="fulfillment-fields-notes" className={styles.field}>
        <label className={styles.label} htmlFor="notes">
          Notes (optional)
        </label>
        <textarea
          data-testid="fulfillment-fields-notes-input"
          id="notes"
          {...register('notes')}
        />
        {errors.notes && <p className={styles.error}>{errors.notes.message}</p>}
      </div>
    </>
  );
}
