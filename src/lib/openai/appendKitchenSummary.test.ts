import * as fs from 'fs/promises';
import { ordersFilePath } from '../storage/ordersFilePath';
import { appendKitchenSummary } from './appendKitchenSummary';
import { generateKitchenSummary } from '@/lib/openai/generateKitchenSummary';
import type { CheckoutRequestData } from '@/schemas/checkoutRequest';

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn()
}));

vi.mock('@/lib/openai/generateKitchenSummary', () => ({
  generateKitchenSummary: vi.fn()
}));

const mockCheckout: CheckoutRequestData = {
  customer: {
    name: 'Kerry Ann Burke',
    email: 'kerry@example.com',
    phone: '202 202 2020',
    fulfilmentType: 'delivery',
    addressLine1: '123 Test Street',
    notes: 'Leave at door'
  },
  order: {
    items: [
      {
        id: 'spring-rolls',
        quantity: 2,
        name: 'Spring Roles',
        priceCents: 595
      }
    ],
    totalCents: 1190,
    subtotalCents: 1190,
    deliveryChargeCents: 0
  }
};

describe('appendKitchenSummary()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('appends a kitchen summary to an existing order', async () => {
    const orders = [
      {
        id: 'order-123',
        kitchenSummary: ''
      }
    ];

    vi.mocked(generateKitchenSummary).mockResolvedValue('Pack separately');

    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(orders) as never);

    await appendKitchenSummary('order-123', mockCheckout);

    expect(generateKitchenSummary).toHaveBeenCalledWith(mockCheckout);

    expect(fs.writeFile).toHaveBeenCalledWith(
      ordersFilePath,
      JSON.stringify(
        [
          {
            id: 'order-123',
            kitchenSummary: 'Pack separately'
          }
        ],
        null,
        2
      ),
      'utf8'
    );
  });

  it('does not write when order cannot be found', async () => {
    vi.mocked(generateKitchenSummary).mockResolvedValue('Pack separately');

    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify([]) as never);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await appendKitchenSummary('missing-order', mockCheckout);

    expect(fs.writeFile).not.toHaveBeenCalled();

    expect(warnSpy).toHaveBeenCalledWith(
      'Could not append kitchen summary: order missing-order not found'
    );
  });

  it('logs a warning if summary generation fails', async () => {
    const error = new Error('OpenAI exploded');

    vi.mocked(generateKitchenSummary).mockRejectedValue(error);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await appendKitchenSummary('order-123', mockCheckout);

    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to append kitchen summary:',
      error
    );

    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('logs a warning if writeFile fails', async () => {
    const error = new Error('Disk full');

    vi.mocked(generateKitchenSummary).mockResolvedValue('Pack separately');

    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify([{ id: 'order-123' }]) as never
    );

    vi.mocked(fs.writeFile).mockRejectedValue(error);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await appendKitchenSummary('order-123', mockCheckout);

    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to append kitchen summary:',
      error
    );
  });
});
