// src/app/api/order-confirmation/[orderId]/route.ts

import { NextResponse } from 'next/server';
import { getOrderById } from '@/lib/storage/getOrderById';

type RouteParams = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ order });
}
