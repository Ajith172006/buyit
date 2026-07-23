import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireFirebaseUser } from '@/lib/firebase-admin';

const schema = z.object({ items: z.array(z.object({ productId: z.string().optional(), name: z.string().min(1), price: z.number().positive(), quantity: z.number().int().positive(), image: z.string().optional() })).min(1), shippingAddress: z.record(z.string(), z.unknown()), totalAmount: z.number().positive(), subtotal: z.number().positive() });

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 });
    const token = await requireFirebaseUser(request);
    if (!token.email) return NextResponse.json({ error: 'Firebase account has no email.' }, { status: 400 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid checkout payload.', details: parsed.error.flatten() }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: token.email } });
    if (!user) return NextResponse.json({ error: 'Complete your profile before checkout.' }, { status: 400 });
    const order = await prisma.order.create({ data: { userId: user.id, items: { create: parsed.data.items }, shippingAddress: parsed.data.shippingAddress as never, totalAmount: Math.round(parsed.data.totalAmount), subtotal: Math.round(parsed.data.subtotal), paymentMethod: 'stripe' } });
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {
      const checkout = await stripe.checkout.sessions.create({ mode: 'payment', customer_email: token.email, metadata: { orderId: order.id }, line_items: parsed.data.items.map(item => ({ price_data: { currency: 'inr', product_data: { name: item.name }, unit_amount: Math.round(item.price * 100) }, quantity: item.quantity })), success_url: `${request.nextUrl.origin}/?payment=success`, cancel_url: `${request.nextUrl.origin}/?payment=cancelled` });
      await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: checkout.id } });
      return NextResponse.json({ id: checkout.id, url: checkout.url });
    } catch (error) { await prisma.order.delete({ where: { id: order.id } }); throw error; }
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create checkout.' }, { status: 500 }); }
}
