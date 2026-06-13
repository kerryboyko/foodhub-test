import * as fs from 'fs/promises';
import { generateKitchenSummary } from '@/lib/openai/generateKitchenSummary';
import { ordersFilePath } from '@/lib/storage/ordersFilePath';
import type { CheckoutRequestData } from '@/schemas/checkoutRequest';
import type { Order } from '@/schemas/order';

// this will run asynchronously in the background
// after the order is confirmed.
export async function appendKitchenSummary(
  orderId: string,
  checkout: CheckoutRequestData
): Promise<void> {
  try {
    const kitchenSummary = await generateKitchenSummary(checkout);

    const file = await fs.readFile(ordersFilePath, 'utf8');
    const orders = JSON.parse(file) as Order[];

    const order = orders.find((order) => order.id === orderId);

    if (!order) {
      console.warn(
        `Could not append kitchen summary: order ${orderId} not found`
      );
      return;
    }

    order.kitchenSummary = kitchenSummary;

    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
  } catch (error) {
    console.warn('Failed to append kitchen summary:', error);
  }
}
