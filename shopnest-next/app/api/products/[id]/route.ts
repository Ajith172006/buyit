import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';
import { requireFirebaseAdmin } from '@/lib/firebase-admin';
import { productSchema } from '@/lib/validation';

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
const cloudinaryPublicId = (url: string) => { try { const parsed = new URL(url); if (parsed.hostname !== 'res.cloudinary.com') return null; const path = parsed.pathname.split('/upload/')[1]?.replace(/^v\d+\//, ''); return path?.replace(/\.[^.]+$/, '') ?? null; } catch { return null; } };
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) { try { await requireFirebaseAdmin(request); const parsed = productSchema.partial().safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 }); const data = await prisma.product.update({ where: { id: (await params).id }, data: parsed.data }); return NextResponse.json({ success: true, data }); } catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to update product.' }, { status: 401 }); } }
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) { try { await requireFirebaseAdmin(request); const product = await prisma.product.delete({ where: { id: (await params).id } }); for (const image of [product.image, ...product.images]) { const publicId = cloudinaryPublicId(image); if (publicId) await cloudinary.uploader.destroy(publicId).catch(() => undefined); } return NextResponse.json({ success: true }); } catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to delete product.' }, { status: 401 }); } }
