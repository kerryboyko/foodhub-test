// CustomerFields.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CustomerFields from './CustomerFields';

const register = (name: string) => ({
  name,
  onChange: () => {},
  onBlur: () => {},
  ref: () => {}
});

describe('CustomerFields', () => {
  it('renders customer information fields', () => {
    render(<CustomerFields register={register as any} errors={{}} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders validation errors', () => {
    render(
      <CustomerFields
        register={register as any}
        errors={
          {
            name: {
              message: 'Name is required'
            },
            phone: {
              message: 'Phone number is required'
            },
            email: {
              message: 'Email address is invalid'
            }
          } as any
        }
      />
    );

    expect(screen.getByText('Name is required')).toBeInTheDocument();

    expect(screen.getByText('Phone number is required')).toBeInTheDocument();

    expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
  });

  it('uses the expected input types', () => {
    render(<CustomerFields register={register as any} errors={{}} />);

    expect(screen.getByLabelText(/name/i)).toHaveAttribute('type', 'text');

    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('type', 'tel');

    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
  });
});
