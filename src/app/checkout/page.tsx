import Link from 'next/link';
import OrderSummary from './OrderSummary';
import CheckoutForm from './CheckoutForm';

export default async function CartPage() {
  return (
    <main>
      <>
        <div>Checkout</div>
        <hr />
        <div>
          <div>
            <Link href="/menu">Back to menu</Link>
          </div>
          <div>
            <Link href="/cart">Change Order</Link>
          </div>
          <hr />
          <OrderSummary />
          <CheckoutForm />
        </div>
      </>
    </main>
  );
}
