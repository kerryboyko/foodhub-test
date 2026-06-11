import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CheckoutRequestData } from '@/schemas/checkoutRequest';

const openAiMocks = vi.hoisted(() => {
  const create = vi.fn();

  function OpenAI() {
    return {
      responses: {
        create
      }
    };
  }

  return {
    create,
    constructor: vi.fn(OpenAI)
  };
});

vi.mock('openai', () => ({
  default: openAiMocks.constructor
}));

vi.mock('./createFallbackKitchenSummary', () => ({
  createFallbackKitchenSummary: vi.fn()
}));

import { factoryGenerateKitchenSummary } from './generateKitchenSummary';
import { createFallbackKitchenSummary } from './createFallbackKitchenSummary';

function createOrder(): CheckoutRequestData {
  return {
    customer: {
      name: 'Bob',
      email: 'bob@example.com',
      phone: '555-1234',
      fulfilmentType: 'delivery',
      notes: 'No onions',
      addressLine1: '123 Test Street',
      addressLine2: '',
      postcode: 'D01 TEST',
      creditCard: '4242424242424242',
      ccExpiration: '12/30',
      ccCVCcode: '123'
    },
    order: {
      items: [
        {
          id: 'spring-rolls',
          name: 'Vegetable Spring Rolls',
          priceCents: 595,
          quantity: 2
        }
      ],
      subtotalCents: 1190,
      deliveryChargeCents: 499,
      totalCents: 1689
    }
  };
}

describe('factoryGenerateKitchenSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    process.env.OPENAI_API_KEY = 'test-api-key';

    openAiMocks.create.mockResolvedValue({
      output_text:
        'Prepare 2 vegetable spring rolls for delivery. Customer requested no onions.'
    });

    vi.mocked(createFallbackKitchenSummary).mockReturnValue(
      'Fallback kitchen summary.'
    );
  });

  it('returns the OpenAI kitchen summary when generation succeeds', async () => {
    const generateKitchenSummary = factoryGenerateKitchenSummary();
    const order = createOrder();

    const result = await generateKitchenSummary(order);

    expect(result).toBe(
      'Prepare 2 vegetable spring rolls for delivery. Customer requested no onions.'
    );
  });

  it('returns the fallback kitchen summary when OpenAI generation fails', async () => {
    const generateKitchenSummary = factoryGenerateKitchenSummary();
    const order = createOrder();

    openAiMocks.create.mockRejectedValue(new Error('OpenAI exploded'));

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await generateKitchenSummary(order);

    expect(result).toBe('Fallback kitchen summary.');
    expect(createFallbackKitchenSummary).toHaveBeenCalledWith(order);
    expect(warnSpy).toHaveBeenCalledWith(
      'AI summary generation failed:',
      expect.any(Error)
    );
  });

  it('returns the fallback kitchen summary when no API key is configured', async () => {
    delete process.env.OPENAI_API_KEY;

    const generateKitchenSummary = factoryGenerateKitchenSummary();
    const order = createOrder();

    const result = await generateKitchenSummary(order);

    expect(result).toBe('Fallback kitchen summary.');
    expect(openAiMocks.constructor).not.toHaveBeenCalled();
    expect(openAiMocks.create).not.toHaveBeenCalled();
  });
});
