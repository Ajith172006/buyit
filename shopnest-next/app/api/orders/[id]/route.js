import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/api/models/Order';

function requireAdmin(req) {
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || process.env.ADMIN_API_KEY || 'changeme-in-production';
  const provided = req.headers.get('authorization')?.replace('Bearer ', '').trim();
  return provided === adminKey;
}

// PUT — update order status (admin only)
export async function PUT(req, { params }) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const order = await Order.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/orders/[id]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
