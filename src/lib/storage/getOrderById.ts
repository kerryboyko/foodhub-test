import * as fs from 'fs/promises';
import { ordersFilePath } from '@/lib/storage/ordersFilePath';
import type { Order } from '@/schemas/order';

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const file = await fs.readFile(ordersFilePath, 'utf8');
    // Demo implementation: orders are stored in a JSON file and searched
    // in-memory. A production implementation would typically query an
    // indexed database by order ID.
    const orders = JSON.parse(file) as Order[];

    return orders.find((order) => order.id === orderId) ?? null;
  } catch {
    // no order found
    return null;
  }
}
