// src/app/order-confirmation/[orderId]/page.tsx

import { notFound } from 'next/navigation';
import { getOrderById } from '@/lib/storage/getOrderById';
import { formatPrice } from '@/lib/formatPrice';
import styles from './orderconfirmationpage.module.scss';

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
    <main className={styles.orderconfirmationpage__container}>
      <div className={styles.orderconfirmationpage}>
        <h1 className={styles.orderconfirmationpage__heading}>
          Order Confirmed
        </h1>
        <p
          className={styles.orderconfirmationpage__orderId}
          data-testid={`order-confirmation-${order.id}`}
        >
          Order ID: {order.id}
        </p>

        <h2 className={styles.orderconfirmationpage__heading}>Customer</h2>
        <p
          className={styles.orderconfirmationpage__customerName}
          data-testid={`order-confirmation-name`}
        >
          {order.customer.name}
        </p>
        <p
          className={styles.orderconfirmationpage__customerEmail}
          data-testid={`order-confirmation-email`}
        >
          {order.customer.email}
        </p>
        <p
          className={styles.orderconfirmationpage__customerPhone}
          data-testid={`order-confirmation-phone`}
        >
          {order.customer.phone}
        </p>

        <h2 className={styles.orderconfirmationpage__heading}>Items</h2>
        {order.order.items.map((item) => (
          <div
            className={styles.orderconfirmationpage__item}
            data-testid={`order-confirmation-item-${item.id}`}
            key={item.id}
          >
            <p
              className={styles.orderconfirmationpage__item__details}
              data-testid={`order-confirmation-item-quantity-name-${item.id}`}
            >
              {item.quantity} × {item.name}
            </p>
            <p
              className={styles.orderconfirmationpage__item__price}
              data-testid={`order-confirmation-item-price-${item.id}`}
            >
              {formatPrice(item.priceCents * item.quantity)}
            </p>
          </div>
        ))}

        <h2 className={styles.orderconfirmationpage__heading}>Total</h2>
        <p
          className={styles.orderconfirmationpage__total}
          data-testid={`order-confirmation-total-price`}
        >
          {formatPrice(order.order.totalCents)}
        </p>
        {order.order.deliveryChargeCents > 0 ? (
          <>
            <div
              data-testid={`order-confirmation-deliverycharge`}
              className={styles.orderconfirmationpage__deliveryCharge}
            >
              Price includes a delivery charge of{' '}
              {formatPrice(order.order.deliveryChargeCents)}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
