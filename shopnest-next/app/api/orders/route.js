import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/api/models/Order';
import mongoose from 'mongoose';

// GET all orders — admin only (requires Authorization header)
export async function GET(req) {
  try {
    const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || process.env.ADMIN_API_KEY || 'changeme-in-production';
    const authHeader = req.headers.get('authorization');
    const provided = authHeader?.replace('Bearer ', '').trim();
    if (provided !== adminKey) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: orders.length, data: orders }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — create a new order
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    // If userId is provided, validate it's a real MongoDB ObjectId
    if (body.userId) {
      if (!mongoose.isValidObjectId(body.userId)) {
        delete body.userId; // Drop invalid userId (demo/Firebase users)
      }
    }

    const order = new Order(body);
    await order.save();

    // Populate product info if productId references are valid ObjectIds
    try {
      await order.populate('items.productId', 'name price image');
    } catch (e) {
      // Non-critical — skip if populate fails (e.g., demo product IDs)
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
