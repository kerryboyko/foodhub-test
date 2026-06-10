import * as fs from 'fs/promises';
import { ensureOrdersFile } from './ensureOrdersFile.js';
import { ordersFilePath } from './ordersFilePath.js';
import type { CheckoutFormData } from '@/schemas/checkout.js';
import type { Order } from '@/schemas/order.js';

export async function saveOrder(checkout: CheckoutFormData): Promise<Order> {
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
