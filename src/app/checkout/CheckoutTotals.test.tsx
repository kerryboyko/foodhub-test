import { render, screen } from '@testing-library/react';
import CheckoutTotals from './CheckoutTotals';

describe('CheckoutTotals', () => {
  it('renders the total', () => {
    render(<CheckoutTotals totalCents={1190} />);

    expect(screen.getByTestId('checkout-totals-total')).toHaveTextContent(
      'Total: €11.90'
    );
  });

  it('renders zero totals', () => {
    render(<CheckoutTotals totalCents={0} />);

    expect(screen.getByTestId('checkout-totals-total')).toHaveTextContent(
      'Total: €0.00'
    );
  });
});
