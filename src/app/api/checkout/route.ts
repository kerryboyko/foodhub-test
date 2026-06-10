// src/app/api/checkout/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { CheckoutSchema } from '@/schemas/checkout';
import { saveOrder } from './saveOrder';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = CheckoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: 'Invalid checkout payload',
          errors: z.treeifyError(result.error)
        },
        { status: 400 }
      );
    }

    const order = await saveOrder(result.data);

    return NextResponse.json(
      {
        message: 'Checkout successful',
        order
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
