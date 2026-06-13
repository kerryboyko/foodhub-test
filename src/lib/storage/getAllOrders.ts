import * as fs from 'fs/promises';
import { ensureOrdersFile } from './ensureOrdersFile';
import { ordersFilePath } from '@/lib/storage/ordersFilePath';
import type { Order } from '@/schemas/order';

export async function getAllOrders() {
  await ensureOrdersFile();

  const file = await fs.readFile(ordersFilePath, 'utf8');
  const existingOrders = JSON.parse(file) as Order[];
  return existingOrders;
}
