import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireFirebaseAdmin } from '@/lib/firebase-admin';

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });

export async function POST(request: NextRequest) {
  try { await requireFirebaseAdmin(request);
  if (!process.env.CLOUDINARY_CLOUD_NAME) return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 503 });
  const form = await request.formData(); const file = form.get('file');
  if (!(file instanceof File) || !file.type.startsWith('image/')) return NextResponse.json({ error: 'An image file is required' }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  const upload = await new Promise<{ secure_url: string }>((resolve, reject) => cloudinary.uploader.upload_stream({ folder: 'buyit/products' }, (error, result) => error || !result ? reject(error) : resolve(result)).end(bytes));
  return NextResponse.json({ url: upload.secure_url }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed.' }, { status: 401 }); }
}
