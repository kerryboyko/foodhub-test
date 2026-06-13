import type { CheckoutCommonProps } from './checkout.types';
import styles from './checkoutpage.module.scss';

export default function PaymentFields({
  register,
  errors
}: CheckoutCommonProps) {
  return (
    <>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="creditCard">
          Credit Card
        </label>
        <input
          id="creditCard"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          {...register('creditCard')}
        />
        {errors.creditCard && (
          <p
            data-testid="payment-fields-creditCard-error"
            className={styles.error}
          >
            {errors.creditCard.message}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="ccExpiration">
          Expiration Date
        </label>
        <input
          id="ccExpiration"
          type="text"
          placeholder="MM/YY"
          autoComplete="cc-exp"
          {...register('ccExpiration')}
        />
        {errors.ccExpiration && (
          <p className={styles.error}>{errors.ccExpiration.message}</p>
        )}
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="ccCVCcode">
          CVC Code
        </label>
        <input
          id="ccCVCcode"
          type="text"
          inputMode="numeric"
          autoComplete="cc-csc"
          {...register('ccCVCcode')}
        />
        {errors.ccCVCcode && (
          <p className={styles.error}>{errors.ccCVCcode.message}</p>
        )}
      </div>
    </>
  );
}
