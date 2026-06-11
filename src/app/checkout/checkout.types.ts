import { CheckoutFormData } from '@/schemas/checkout';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

export interface CheckoutCommonProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}
