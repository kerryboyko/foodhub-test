import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as fs from 'fs/promises';

import { getAllOrders } from './getAllOrders';
import { ensureOrdersFile } from './ensureOrdersFile';
import { ordersFilePath } from '@/lib/storage/ordersFilePath';

vi.mock('fs/promises', () => ({
  readFile: vi.fn()
}));

vi.mock('./ensureOrdersFile', () => ({
  ensureOrdersFile: vi.fn()
}));

describe('getAllOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns all orders from storage', async () => {
    const mockOrders = [
      {
        id: 'order-123',
        totalCents: 1500
      }
    ];

    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify(mockOrders) as never
    );

    const result = await getAllOrders();

    expect(ensureOrdersFile).toHaveBeenCalledTimes(1);

    expect(fs.readFile).toHaveBeenCalledWith(ordersFilePath, 'utf8');

    expect(result).toEqual(mockOrders);
  });
});
