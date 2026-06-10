// CheckoutTotals.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CheckoutTotals from './CheckoutTotals';
import { formatPrice } from '@/lib/formatPrice';

describe('CheckoutTotals', () => {
  it('renders subtotal and total', () => {
    render(
      <CheckoutTotals
        subtotalCents={1299}
        totalCents={1798}
        deliveryFeeText={null}
      />
    );

    expect(
      screen.getByText(`Subtotal: ${formatPrice(1299)}`)
    ).toBeInTheDocument();

    expect(screen.getByText(`Total: ${formatPrice(1798)}`)).toBeInTheDocument();
  });

  it('renders delivery fee text when provided', () => {
    render(
      <CheckoutTotals
        subtotalCents={1299}
        totalCents={1798}
        deliveryFeeText="Delivery: €4.99"
      />
    );

    expect(screen.getByText('Delivery: €4.99')).toBeInTheDocument();
  });

  it('does not render delivery fee text when null', () => {
    render(
      <CheckoutTotals
        subtotalCents={1299}
        totalCents={1798}
        deliveryFeeText={null}
      />
    );
    expect(
      screen.queryByTestId('checkout-totals-delivery-fee-text')
    ).not.toBeInTheDocument();

    expect(screen.queryByText(/delivery:/i)).not.toBeInTheDocument();
  });

  it('renders free delivery text when provided', () => {
    render(
      <CheckoutTotals
        subtotalCents={5000}
        totalCents={5000}
        deliveryFeeText="This order qualifies for free delivery!"
      />
    );

    expect(
      screen.getByText('This order qualifies for free delivery!')
    ).toBeInTheDocument();
  });
});
