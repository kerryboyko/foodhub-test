import * as fs from 'fs/promises';
import { ensureOrdersFile } from './ensureOrdersFile';
import { ordersFilePath } from '@/lib/storage/ordersFilePath';
import type { CheckoutRequestData } from '@/schemas/checkoutRequest';
import type { Order } from '@/schemas/order';
import { appendKitchenSummary } from '@/lib/openai/appendKitchenSummary';

export async function saveOrder(checkout: CheckoutRequestData): Promise<Order> {
  await ensureOrdersFile();

  const file = await fs.readFile(ordersFilePath, 'utf8');
  const existingOrders = JSON.parse(file) as Order[];
  const orderId = crypto.randomUUID();

  const order: Order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    ...checkout,
    kitchenSummary: null
  };

  // side-effect, runs in the background.
  appendKitchenSummary(orderId, checkout);

  existingOrders.push(order);

  await fs.writeFile(
    ordersFilePath,
    JSON.stringify(existingOrders, null, 2),
    'utf8'
  );

  return order;
}
