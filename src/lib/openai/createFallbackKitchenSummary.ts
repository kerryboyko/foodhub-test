import type { CheckoutRequestData } from '@/schemas/checkoutRequest';

export function createFallbackKitchenSummary(order: CheckoutRequestData) {
  const itemCount = order.order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return [
    `${order.customer.fulfilmentType} order with ${itemCount} item(s).`,
    order.customer.notes
      ? `Customer note: ${order.customer.notes}`
      : 'No customer notes provided.',
    'AI summary unavailable: using fallback kitchen summary.'
  ].join(' ');
}
