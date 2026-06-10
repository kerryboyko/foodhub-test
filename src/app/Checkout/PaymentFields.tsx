import type { CheckoutCommonProps } from './checkout.types';

export default function PaymentFields({
  register,
  errors
}: CheckoutCommonProps) {
  return (
    <>
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
    </>
  );
}
