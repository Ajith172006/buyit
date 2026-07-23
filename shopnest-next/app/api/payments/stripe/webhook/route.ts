import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });
  try {
    const event = new Stripe(process.env.STRIPE_SECRET_KEY).webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await prisma.order.updateMany({ where: { stripeSessionId: session.id }, data: { paymentStatus: 'COMPLETED', orderStatus: 'CONFIRMED' } });
    }
    if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await prisma.order.updateMany({ where: { stripeSessionId: session.id }, data: { paymentStatus: 'FAILED', orderStatus: 'CANCELLED' } });
    }
    return NextResponse.json({ received: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid webhook.' }, { status: 400 }); }
}
