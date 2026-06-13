import { formatPrice } from '@/lib/formatPrice';
import { getAllOrders } from '@/lib/storage/getAllOrders';
import { Order } from '@/schemas/order';
import { notFound } from 'next/navigation';

export default async function UnsafeSeeOrdersPage() {
  const orders: Order[] = await getAllOrders();

  if (!orders) {
    notFound();
  }

  return (
    <main>
      <h1>Unsafe See Orders Page</h1>
      <h2>This page intentionally left ugly.</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>CreatedAt</th>
            <th>Name</th>
            <th>Items</th>
            <th>Fulfilment</th>
            <th>Total</th>
            <th>AI Generated Kitchen Summary</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order: Order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.createdAt}</td>
              <td>{order.customer.name}</td>
              <td>
                {order.order.items.map((item) => (
                  <div key={item.id}>
                    {item.quantity} x {item.name}
                  </div>
                ))}
              </td>
              <td>{order.customer.fulfilmentType}</td>
              <td>{formatPrice(order.order.totalCents)}</td>
              <td>{order.kitchenSummary ?? 'Pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
