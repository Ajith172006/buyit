import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/api/models/User';
import Order from '@/api/models/Order';
import Product from '@/api/models/Product';

export async function POST(req) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { email, productId, rating, text } = body;
    
    if (!email || !productId || !rating || !text) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    // Verify purchase
    const userOrders = await Order.find({ userId: user._id });
    let hasPurchased = false;
    
    for (const order of userOrders) {
      if (order.items.some(item => item.productId.toString() === productId)) {
        hasPurchased = true;
        break;
      }
    }
    
    if (!hasPurchased) {
      return NextResponse.json({ 
        success: false, 
        message: 'You can only review products you have purchased.' 
      }, { status: 403 });
    }
    
    // Add review
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    // Check if user already reviewed
    const existingReview = product.reviews.find(r => r.user === user.name);
    if (existingReview) {
      return NextResponse.json({ success: false, message: 'You have already reviewed this product' }, { status: 400 });
    }
    
    product.reviews.push({
      user: user.name,
      text,
      rating,
      date: new Date()
    });
    
    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = (totalRating / product.reviews.length).toFixed(1);
    
    await product.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Review added successfully',
      data: product 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in /api/reviews POST:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
