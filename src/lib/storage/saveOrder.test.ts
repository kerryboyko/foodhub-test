import { saveOrder } from './saveOrder';
import { ensureOrdersFile } from './ensureOrdersFile.js';
import type { CheckoutFormData } from '@/schemas/checkout';
import { CheckoutRequestData } from '@/schemas/checkoutRequest';

const aiMocks = vi.hoisted(() => ({
  generateKitchenSummary: vi.fn()
}));

vi.mock('@/lib/openai/generateKitchenSummary', () => ({
  generateKitchenSummary: aiMocks.generateKitchenSummary
}));

const fsMocks = vi.hoisted(() => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
  access: vi.fn()
}));

const mocks = vi.hoisted(() => ({
  ensureOrdersFile: vi.fn()
}));

vi.mock('fs/promises', () => fsMocks);

vi.mock('./ensureOrdersFile.js', () => ({
  ensureOrdersFile: mocks.ensureOrdersFile
}));

describe('saveOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00.000Z'));
    aiMocks.generateKitchenSummary.mockResolvedValue('Mock kitchen summary.');
    fsMocks.readFile.mockResolvedValue('[]');
    fsMocks.writeFile.mockResolvedValue(undefined);
    mocks.ensureOrdersFile.mockResolvedValue(undefined);

    vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-order-id');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('saves a new order', async () => {
    const checkout = {
      name: 'Bob',
      email: 'bob@example.com',
      phone: '555-1234',
      fulfilmentType: 'delivery'
    } satisfies CheckoutFormData;

    const order = await saveOrder(checkout as unknown as CheckoutRequestData);

    expect(ensureOrdersFile).toHaveBeenCalledOnce();

    expect(fsMocks.readFile).toHaveBeenCalledWith(expect.any(String), 'utf8');

    expect(order).toEqual({
      id: 'test-order-id',
      createdAt: '2026-06-11T12:00:00.000Z',
      kitchenSummary: null,
      ...checkout
    });

    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify([order], null, 2),
      'utf8'
    );
  });

  it('appends to existing orders', async () => {
    const existingOrder = {
      id: 'existing-order-id',
      createdAt: '2026-06-10T12:00:00.000Z',
      name: 'Alice',
      email: 'alice@example.com',
      phone: '555-0000',
      fulfilmentType: 'collection'
    };

    fsMocks.readFile.mockResolvedValue(JSON.stringify([existingOrder]));

    const checkout = {
      name: 'Bob',
      email: 'bob@example.com',
      phone: '555-1234',
      fulfilmentType: 'delivery'
    } satisfies CheckoutFormData;

    const order = await saveOrder(checkout as unknown as CheckoutRequestData);

    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify([existingOrder, order], null, 2),
      'utf8'
    );
  });
});
