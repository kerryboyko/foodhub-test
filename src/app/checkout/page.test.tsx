import { render, screen } from '@testing-library/react';
import CheckoutPage from './page';

vi.mock('./CheckoutForm', () => ({
  default: () => <div data-testid="checkout-form" />
}));

vi.mock('@/components/CartList/CartList', () => ({
  default: () => <div data-testid="cart-list" />
}));

describe('CheckoutPage', () => {
  it('renders the checkout heading', async () => {
    const Page = await CheckoutPage();

    render(Page);

    expect(
      screen.getByRole('heading', { name: /checkout/i })
    ).toBeInTheDocument();
  });

  it('renders the cart list', async () => {
    const Page = await CheckoutPage();

    render(Page);

    expect(screen.getByTestId('cart-list')).toBeInTheDocument();
  });

  it('renders the checkout form', async () => {
    const Page = await CheckoutPage();

    render(Page);

    expect(screen.getByTestId('checkout-form')).toBeInTheDocument();
  });

  it('renders a link back to the menu', async () => {
    const Page = await CheckoutPage();

    render(Page);

    const link = screen.getByRole('link', {
      name: /change your order/i
    });

    expect(link).toHaveAttribute('href', '/menu');
  });
});
