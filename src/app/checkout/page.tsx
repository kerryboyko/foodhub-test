import Link from 'next/link';
import CheckoutForm from './CheckoutForm';

export default async function CartPage() {
  return (
    <main>
      <>
        <h2>Checkout</h2>
        <hr />
        <div>
          <div>
            <Link href="/menu">Back to menu</Link>
          </div>
          <div>
            <Link href="/cart">Change Order</Link>
          </div>
          <hr />
          <CheckoutForm />
        </div>
      </>
    </main>
  );
}
