import OpenAI from 'openai';
import { createFallbackKitchenSummary } from './createFallbackKitchenSummary';
import type { CheckoutRequestData } from '@/schemas/checkoutRequest';

export function factoryGenerateKitchenSummary() {
  const apiKey = process.env.OPENAI_API_KEY;

  // CI/CD builds may not have runtime secrets available.
  // Fall back cleanly instead of failing module evaluation during next build.
  if (!apiKey) {
    return async (order: CheckoutRequestData) =>
      createFallbackKitchenSummary(order);
  }

  const openai = new OpenAI({ apiKey });

  return async (order: CheckoutRequestData) => {
    const promptData = {
      customer: {
        name: order.customer.name,
        fulfilmentType: order.customer.fulfilmentType,
        notes: order.customer.notes,
        addressLine1: order.customer.addressLine1,
        postcode: order.customer.postcode
      },
      order: order.order
    };

    try {
      const response = await openai.responses.create({
        model: 'gpt-4.1-mini',
        input: `Create a concise two-sentence kitchen preparation summary for restaurant staff.

${JSON.stringify(promptData, null, 2)}`
      });

      return response.output_text;
    } catch (error) {
      console.warn('AI summary generation failed:', error);
      return createFallbackKitchenSummary(order);
    }
  };
}

// Create the generator once so the OpenAI client is reused across calls
// instead of being recreated for every checkout.
export const generateKitchenSummary = factoryGenerateKitchenSummary();
