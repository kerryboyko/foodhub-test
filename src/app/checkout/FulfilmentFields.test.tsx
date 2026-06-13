// FulfilmentFields.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import FulfilmentFields from './FulfilmentFields';

const register = (name: string) => ({
  name,
  onChange: () => {},
  onBlur: () => {},
  ref: () => {}
});

describe('FulfilmentFields', () => {
  it('renders delivery and collection radio buttons', () => {
    render(
      <FulfilmentFields
        register={register as any}
        errors={{}}
        fulfilmentType="delivery"
      />
    );

    expect(
      screen.getByTestId('fulfilment-fields-radio-delivery')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('fulfilment-fields-radio-collection')
    ).toBeInTheDocument();
  });

  it('renders delivery address fields when fulfilment type is delivery', () => {
    render(
      <FulfilmentFields
        register={register as any}
        errors={{}}
        fulfilmentType="delivery"
      />
    );

    expect(screen.getByLabelText(/address line 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address line 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postcode\/zipcode/i)).toBeInTheDocument();
  });

  it('does not render delivery address fields when fulfilment type is collection', () => {
    render(
      <FulfilmentFields
        register={register as any}
        errors={{}}
        fulfilmentType="collection"
      />
    );

    expect(screen.queryByLabelText(/address line 1/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/address line 2/i)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/postcode\/zipcode/i)
    ).not.toBeInTheDocument();
  });

  it('always renders notes field', () => {
    render(
      <FulfilmentFields
        register={register as any}
        errors={{}}
        fulfilmentType="collection"
      />
    );

    expect(
      screen.getByTestId('fulfillment-fields-notes-input')
    ).toBeInTheDocument();
  });

  it('renders validation errors', () => {
    render(
      <FulfilmentFields
        register={register as any}
        fulfilmentType="delivery"
        errors={
          {
            fulfilmentType: {
              message: 'Choose delivery or collection'
            },
            addressLine1: {
              message: 'Address line 1 is required'
            },
            addressLine2: {
              message: 'Address line 2 is invalid'
            },
            postcode: {
              message: 'Postcode is required'
            },
            notes: {
              message: 'Notes are too long'
            }
          } as any
        }
      />
    );

    expect(
      screen.getByText('Choose delivery or collection')
    ).toBeInTheDocument();
    expect(screen.getByText('Address line 1 is required')).toBeInTheDocument();
    expect(screen.getByText('Address line 2 is invalid')).toBeInTheDocument();
    expect(screen.getByText('Postcode is required')).toBeInTheDocument();
    expect(screen.getByText('Notes are too long')).toBeInTheDocument();
  });
});
