// src/app/order-confirmation/[orderId]/page.tsx

import { notFound } from 'next/navigation';
import { getOrderById } from '@/app/api/checkout/getOrderById';
import { formatPrice } from '@/lib/formatPrice';

type PageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params;

  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <main>
      <h1>Order Confirmed</h1>
      <p>Order ID: {order.id}</p>

      <h2>Customer</h2>
      <p>{order.customer.name}</p>
      <p>{order.customer.email}</p>
      <p>{order.customer.phone}</p>

      <h2>Items</h2>
      {order.order.items.map((item) => (
        <div key={item.id}>
          <p>
            {item.quantity} × {item.name}
          </p>
          <p>{formatPrice(item.priceCents * item.quantity)}</p>
        </div>
      ))}

      {order.kitchenSummary ? (
        <>
          <h2>AI Kitchen Summary</h2>
          <p>{order.kitchenSummary}</p>
        </>
      ) : null}

      <h2>Total</h2>
      <p>{formatPrice(order.order.totalCents)}</p>
    </main>
  );
}
