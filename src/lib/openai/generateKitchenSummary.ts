import OpenAI from 'openai';
import { createFallbackKitchenSummary } from './createFallbackKitchenSummary';
import type { CheckoutRequestData } from '@/schemas/checkoutRequest';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateKitchenSummary(order: CheckoutRequestData) {
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
}
