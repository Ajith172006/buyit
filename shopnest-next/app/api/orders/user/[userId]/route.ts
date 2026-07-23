import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireFirebaseUser } from '@/lib/firebase-admin';

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) { try { const token = await requireFirebaseUser(request); if (!token.email) return NextResponse.json({ success: false, message: 'Firebase account has no email.' }, { status: 400 }); const user = await prisma.user.findUnique({ where: { email: token.email } }); if (!user || user.id !== (await params).userId) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 }); const data = await prisma.order.findMany({ where: { userId: user.id }, include: { items: true }, orderBy: { createdAt: 'desc' } }); return NextResponse.json({ success: true, data }); } catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to load orders.' }, { status: 401 }); } }
