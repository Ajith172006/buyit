import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validation';
import { requireFirebaseAdmin } from '@/lib/firebase-admin';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) { const q = request.nextUrl.searchParams; const where = { ...(q.get('category') ? { category: q.get('category')! } : {}), ...(q.get('search') ? { OR: ['name','brand','description'].map(field => ({ [field]: { contains: q.get('search')!, mode: 'insensitive' as const } })) } : {}) }; const data = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' }, take: Number(q.get('limit')) || undefined, include: { reviews: true } }); return NextResponse.json({ success: true, count: data.length, data }); }
export async function POST(request: NextRequest) { try { await requireFirebaseAdmin(request); const parsed = productSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 }); const data = await prisma.product.create({ data: parsed.data }); return NextResponse.json({ success: true, data }, { status: 201 }); } catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to create product.' }, { status: 401 }); } }
