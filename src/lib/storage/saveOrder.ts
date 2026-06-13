import * as fs from 'fs/promises';
import { ensureOrdersFile } from './ensureOrdersFile';
import { ordersFilePath } from '@/lib/storage/ordersFilePath';
import type { CheckoutRequestData } from '@/schemas/checkoutRequest';
import type { StoredOrder } from '@/schemas/order';
import { appendKitchenSummary } from '@/lib/openai/appendKitchenSummary';

export async function saveOrder(
  checkout: CheckoutRequestData
): Promise<StoredOrder> {
  await ensureOrdersFile();

  const file = await fs.readFile(ordersFilePath, 'utf8');
  const existingOrders = JSON.parse(file) as StoredOrder[];
  const orderId = crypto.randomUUID();

  const {
    creditCard: _creditCard,
    ccExpiration: _ccExpiration,
    ccCVCcode: _ccCVCcode,
    ...storedCustomer
  } = checkout.customer;

  const order: StoredOrder = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customer: storedCustomer,
    order: checkout.order,
    kitchenSummary: null
  };

  existingOrders.push(order);

  await fs.writeFile(
    ordersFilePath,
    JSON.stringify(existingOrders, null, 2),
    'utf8'
  );

  // side-effect, runs in the background.
  // Fire-and-forget enrichment. Checkout should not wait on AI,
  // but the order must exist before the background task updates it.
  void appendKitchenSummary(orderId, checkout);

  return order;
}
