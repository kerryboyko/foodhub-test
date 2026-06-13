import { saveOrder } from './saveOrder';
import { ensureOrdersFile } from './ensureOrdersFile.js';
import { CheckoutRequestData } from '@/schemas/checkoutRequest';
import { ordersFilePath } from './ordersFilePath';

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

// helpers

const toStoredCustomer = (customer: CheckoutRequestData['customer']) => {
  const {
    creditCard: _creditCard,
    ccExpiration: _ccExpiration,
    ccCVCcode: _ccCVCcode,
    ...storedCustomer
  } = customer;

  return storedCustomer;
};

const mockCheckout = {
  customer: {
    name: 'Bob',
    email: 'bob@example.com',
    phone: '555-1234',
    fulfilmentType: 'delivery',
    addressLine1: '123 Test Street',
    postcode: 'D01 TEST',
    notes: '',
    creditCard: '4242424242424242',
    ccExpiration: '01/99',
    ccCVCcode: '111'
  },
  order: {
    items: [
      {
        id: 'item_1001',
        name: 'Vegetable Spring Rolls',
        priceCents: 595,
        quantity: 2
      }
    ],
    subtotalCents: 1190,
    deliveryChargeCents: 300,
    totalCents: 1490
  }
};

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
    const order = await saveOrder(mockCheckout as any);

    expect(ensureOrdersFile).toHaveBeenCalledOnce();

    expect(fsMocks.readFile).toHaveBeenCalledWith(expect.any(String), 'utf8');

    expect(order).toEqual({
      id: 'test-order-id',
      createdAt: '2026-06-11T12:00:00.000Z',
      kitchenSummary: null,
      order: mockCheckout.order,
      customer: toStoredCustomer(mockCheckout.customer as any)
    });

    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify([order], null, 2),
      'utf8'
    );
    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      ordersFilePath,
      expect.not.stringContaining(mockCheckout.customer.creditCard),
      'utf8'
    );
  });

  it('appends to existing orders', async () => {
    const firstOrder = {
      order: mockCheckout.order,
      customer: toStoredCustomer(mockCheckout.customer as any)
    };

    fsMocks.readFile.mockResolvedValue(JSON.stringify([firstOrder]));

    const alice = {
      customer: {
        ...mockCheckout.customer,
        name: 'Alice',
        email: 'alice@example.com',
        phone: '555-1234',
        fulfilmentType: 'delivery'
      },

      order: mockCheckout.order
    };

    const storedAlice = {
      id: 'test-order-id',
      createdAt: '2026-06-11T12:00:00.000Z',
      customer: toStoredCustomer(alice.customer),
      order: alice.order,
      kitchenSummary: null
    };

    await saveOrder(alice as unknown as CheckoutRequestData);

    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify([firstOrder, storedAlice], null, 2),
      'utf8'
    );
  });
});
