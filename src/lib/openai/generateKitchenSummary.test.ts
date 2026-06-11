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

import { generateKitchenSummary } from './generateKitchenSummary';
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
      postcode: 'D01 TEST'
    },
    order: {
      items: [
        {
          id: 'spring-rolls',
          name: 'Vegetable Spring Rolls',
          priceCents: 595,
          quantity: 2
        }
      ]
    }
  } as CheckoutRequestData;
}

describe('generateKitchenSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    openAiMocks.create.mockResolvedValue({
      output_text:
        'Prepare 2 vegetable spring rolls for delivery. Customer requested no onions.'
    });

    vi.mocked(createFallbackKitchenSummary).mockReturnValue(
      'Fallback kitchen summary.'
    );
  });

  it('returns the OpenAI kitchen summary when generation succeeds', async () => {
    const order = createOrder();

    const result = await generateKitchenSummary(order);

    expect(result).toBe(
      'Prepare 2 vegetable spring rolls for delivery. Customer requested no onions.'
    );

    expect(openAiMocks.create).toHaveBeenCalledWith({
      model: 'gpt-4.1-mini',
      input: expect.stringContaining(
        'Create a concise two-sentence kitchen preparation summary'
      )
    });

    const input = openAiMocks.create.mock.calls[0][0].input;

    expect(input).toContain('"fulfilmentType": "delivery"');
    expect(input).toContain('"notes": "No onions"');
    expect(input).toContain('"postcode": "D01 TEST"');
  });

  it('returns the fallback kitchen summary when OpenAI generation fails', async () => {
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
});
