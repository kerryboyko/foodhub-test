import { CheckoutCommonProps } from './checkout.types';
import styles from './checkoutpage.module.scss';

export default function CustomerFields({
  register,
  errors
}: CheckoutCommonProps) {
  return (
    <>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input id="name" type="text" {...register('name')} />
        {errors.name && (
          <p data-testid="customer-fields-name-error" className={styles.error}>
            {errors.name.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="phone">
          Phone
        </label>
        <input id="phone" type="tel" {...register('phone')} />
        {errors.phone && (
          <p data-testid="customer-fields-phone-error" className={styles.error}>
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && (
          <p data-testid="customer-fields-email-error" className={styles.error}>
            {errors.email.message}
          </p>
        )}
      </div>
    </>
  );
}
