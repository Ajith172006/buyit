import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/api/models/Order';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { userId } = params;

    // Return empty list for demo/Firebase users with non-ObjectId IDs
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return NextResponse.json({ success: true, count: 0, data: [] }, { status: 200 });
    }

    const orders = await Order.find({ userId })
      .populate('items.productId', 'name price image')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: orders.length, data: orders }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/orders/user/[userId]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
