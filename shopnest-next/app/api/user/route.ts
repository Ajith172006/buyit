import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FirebaseAdminConfigurationError, requireFirebaseUser } from '@/lib/firebase-admin';
import { profileSchema } from '@/lib/validation';

const publicProfile = (user: any) => ({ id: user.id, name: user.name, email: user.email, phone: user.phone, age: user.age, savedAddresses: user.addresses, wishlist: user.wishlist.map((item: any) => item.productId), address: user.addresses[0] ? `${user.addresses[0].doorNo}, ${user.addresses[0].street}, ${user.addresses[0].city}` : '' });

export async function GET(request: NextRequest) {
  try {
    const token = await requireFirebaseUser(request);
    if (!token.email) return NextResponse.json({ success: false, message: 'Firebase account has no email.' }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: token.email }, include: { addresses: true, wishlist: true } });
    return user ? NextResponse.json({ success: true, data: publicProfile(user) }) : NextResponse.json({ success: false, message: 'Profile not found.' }, { status: 404 });
  } catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to load profile.' }, { status: error instanceof FirebaseAdminConfigurationError ? 503 : 401 }); }
}

export async function POST(request: NextRequest) {
  try {
    const token = await requireFirebaseUser(request);
    if (!token.email) return NextResponse.json({ success: false, message: 'Firebase account has no email.' }, { status: 400 });
    const parsed = profileSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
    const user = await prisma.user.upsert({ where: { email: token.email }, create: { email: token.email, name: parsed.data.name ?? token.name ?? null, phone: parsed.data.phone, age: parsed.data.age, addresses: parsed.data.address ? { create: parsed.data.address } : undefined }, update: { name: parsed.data.name, phone: parsed.data.phone, age: parsed.data.age, ...(parsed.data.address ? { addresses: { create: parsed.data.address } } : {}) }, include: { addresses: true, wishlist: true } });
    return NextResponse.json({ success: true, data: publicProfile(user) });
  } catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to save profile.' }, { status: error instanceof FirebaseAdminConfigurationError ? 503 : 401 }); }
}
