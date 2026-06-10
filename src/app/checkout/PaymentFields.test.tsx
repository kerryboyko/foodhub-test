// PaymentFields.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PaymentFields from './PaymentFields';

const register = () => ({
  name: '',
  onChange: () => {},
  onBlur: () => {},
  ref: () => {}
});

describe('PaymentFields', () => {
  it('renders payment inputs', () => {
    render(<PaymentFields register={register as any} errors={{}} />);

    expect(screen.getByLabelText(/credit card/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiration date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvc code/i)).toBeInTheDocument();
  });

  it('renders validation errors', () => {
    render(
      <PaymentFields
        register={register as any}
        errors={
          {
            creditCard: {
              message: 'Card number is required'
            },
            ccExpiration: {
              message: 'Expiration date is required'
            },
            ccCVCcode: {
              message: 'CVC is required'
            }
          } as any
        }
      />
    );

    expect(screen.getByText('Card number is required')).toBeInTheDocument();

    expect(screen.getByText('Expiration date is required')).toBeInTheDocument();

    expect(screen.getByText('CVC is required')).toBeInTheDocument();
  });

  it('sets expected input attributes', () => {
    render(<PaymentFields register={register as any} errors={{}} />);

    expect(screen.getByLabelText(/credit card/i)).toHaveAttribute(
      'autocomplete',
      'cc-number'
    );

    expect(screen.getByLabelText(/expiration date/i)).toHaveAttribute(
      'autocomplete',
      'cc-exp'
    );

    expect(screen.getByLabelText(/expiration date/i)).toHaveAttribute(
      'placeholder',
      'MM/YY'
    );

    expect(screen.getByLabelText(/cvc code/i)).toHaveAttribute(
      'autocomplete',
      'cc-csc'
    );
  });
});
