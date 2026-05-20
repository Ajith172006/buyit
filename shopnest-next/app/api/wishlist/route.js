import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/api/models/User';
import Product from '@/api/models/Product'; // needed for population if necessary

export async function POST(req) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { email, productId } = body;
    
    if (!email || !productId) {
      return NextResponse.json({ success: false, message: 'Email and Product ID are required' }, { status: 400 });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    // Toggle wishlist
    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      user.wishlist.push(productId);
    } else {
      user.wishlist.splice(index, 1);
    }
    
    await user.save();
    
    return NextResponse.json({ 
      success: true, 
      wishlist: user.wishlist 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in /api/wishlist POST:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email query parameter is required' }, { status: 400 });
    }
    
    // Populate the wishlist with product details
    const user = await User.findOne({ email }).populate('wishlist', 'name price image discount brand rating reviews');
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: user.wishlist
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in /api/wishlist GET:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
