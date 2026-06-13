import * as fs from 'fs/promises';
import { getOrderById } from './getOrderById';
import { ordersFilePath } from '@/lib/storage/ordersFilePath';

vi.mock('fs/promises', () => ({
  readFile: vi.fn()
}));

describe('getOrderById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the matching order', async () => {
    const mockOrders = [{ id: 'order-123' }, { id: 'order-456' }];

    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockOrders));

    const result = await getOrderById('order-123');

    expect(fs.readFile).toHaveBeenCalledWith(ordersFilePath, 'utf8');
    expect(result).toEqual({ id: 'order-123' });
  });

  it('returns null when no order matches', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify([{ id: 'order-123' }])
    );

    const result = await getOrderById('missing-order');

    expect(result).toBeNull();
  });

  it('returns null when reading the file fails', async () => {
    vi.mocked(fs.readFile).mockRejectedValue(new Error('File missing'));

    const result = await getOrderById('order-123');

    expect(result).toBeNull();
  });
});
