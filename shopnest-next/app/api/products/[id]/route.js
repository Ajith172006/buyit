import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/api/models/Product';

function requireAdmin(req) {
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || process.env.ADMIN_API_KEY || 'changeme-in-production';
  const provided = req.headers.get('authorization')?.replace('Bearer ', '').trim();
  return provided === adminKey;
}

// PUT — update a product (admin only)
export async function PUT(req, { params }) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/products/[id]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// DELETE — remove a product (admin only)
export async function DELETE(req, { params }) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
