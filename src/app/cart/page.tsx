// src/app/menu/page.tsx

import Link from 'next/link';
import Cart from './Cart';

export default async function CartPage() {
  return (
    <main>
      <>
        <h2>Cart</h2>
        <Cart />
        <div>
          <div>
            <Link href="/menu">Back to menu</Link>
          </div>
          <div>
            <Link href="/checkout">Go to checkout</Link>
          </div>
        </div>
      </>
    </main>
  );
}
