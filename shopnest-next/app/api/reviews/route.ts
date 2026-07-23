import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireFirebaseUser } from '@/lib/firebase-admin';
import { z } from 'zod';

const reviewSchema = z.object({ productId: z.string().min(1), rating: z.number().int().min(1).max(5), text: z.string().trim().min(1).max(2000) });
export async function POST(request: NextRequest) {
  try {
    const token = await requireFirebaseUser(request);
    if (!token.email) return NextResponse.json({ success: false, message: 'Firebase account has no email.' }, { status: 400 });
    const parsed = reviewSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: token.email } });
    if (!user) return NextResponse.json({ success: false, message: 'Profile not found.' }, { status: 404 });
    const purchased = await prisma.orderItem.findFirst({ where: { productId: parsed.data.productId, order: { userId: user.id, paymentStatus: 'COMPLETED' } } });
    if (!purchased) return NextResponse.json({ success: false, message: 'You can only review products you have purchased.' }, { status: 403 });
    await prisma.review.create({ data: { ...parsed.data, userId: user.id } });
    const reviews = await prisma.review.findMany({ where: { productId: parsed.data.productId } });
    const product = await prisma.product.update({ where: { id: parsed.data.productId }, data: { rating: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length }, include: { reviews: { include: { user: { select: { name: true } } } } } });
    return NextResponse.json({ success: true, data: product });
  } catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to submit review.' }, { status: 400 }); }
}
