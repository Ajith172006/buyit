import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/api/models/Product';

function requireAdmin(req) {
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || process.env.ADMIN_API_KEY || 'changeme-in-production';
  const provided = req.headers.get('authorization')?.replace('Bearer ', '').trim();
  return provided === adminKey;
}

// GET /api/products?category=...&search=...
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '0');

    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let dbQuery = Product.find(query).sort({ createdAt: -1 });
    if (limit > 0) dbQuery = dbQuery.limit(limit);

    const products = await dbQuery;
    return NextResponse.json({ success: true, count: products.length, data: products }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — create a new product (admin only)
export async function POST(req) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const product = new Product(body);
    await product.save();
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
