import { CheckoutCommonProps } from './checkout.types';

export default function CustomerFields({
  register,
  errors
}: CheckoutCommonProps) {
  return (
    <>
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
    </>
  );
}
