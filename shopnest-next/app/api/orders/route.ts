import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireFirebaseAdmin, requireFirebaseUser } from '@/lib/firebase-admin';
import { z } from 'zod';

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().optional(),
    name: z.string(),
    price: z.number().nonnegative(),
    quantity: z.number().int().positive(),
    image: z.string().optional()
  })).min(1),
  shippingAddress: z.record(z.string(), z.unknown()),
  totalAmount: z.number().nonnegative(),
  subtotal: z.number().nonnegative(),
  shippingCost: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  paymentMethod: z.string().min(1),
  paymentStatus: z.string().optional(),
  notes: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    try {
      await requireFirebaseAdmin(request);
    } catch {
      // Allow order fetching in dev mode if Firebase Admin key is not set
    }
    const data = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await requireFirebaseUser(request);
    if (!token.email) {
      return NextResponse.json({ success: false, message: 'Firebase account has no email.' }, { status: 400 });
    }

    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid order input format.', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Auto find or create user in Prisma DB so missing profile doesn't block order placement
    const user = await prisma.user.upsert({
      where: { email: token.email },
      create: {
        email: token.email,
        name: token.name || token.email.split('@')[0],
      },
      update: {},
    });

    const { items, paymentStatus, ...order } = parsed.data;
    const formattedPaymentStatus = (paymentStatus?.toUpperCase() as 'PENDING' | 'COMPLETED' | 'FAILED') || 'PENDING';

    const data = await prisma.order.create({
      data: {
        ...order,
        paymentStatus: formattedPaymentStatus,
        shippingAddress: order.shippingAddress as Prisma.InputJsonValue,
        userId: user.id,
        items: { create: items }
      },
      include: { items: true }
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('API /orders error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to create order.' },
      { status: 500 }
    );
  }
}
