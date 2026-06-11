import * as fs from 'fs/promises';
import { ensureOrdersFile } from './ensureOrdersFile';
import { ordersFilePath } from './ordersFilePath';
import type { CheckoutRequestData } from '@/schemas/checkoutRequest';
import type { Order } from '@/schemas/order';

export async function saveOrder(checkout: CheckoutRequestData): Promise<Order> {
  await ensureOrdersFile();

  const file = await fs.readFile(ordersFilePath, 'utf8');
  const existingOrders = JSON.parse(file) as Order[];

  const order: Order = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...checkout
  };

  existingOrders.push(order);

  await fs.writeFile(
    ordersFilePath,
    JSON.stringify(existingOrders, null, 2),
    'utf8'
  );

  return order;
}
