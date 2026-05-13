import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/api/models/User';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, name, phone, age, address } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    // Try to find the user by email
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user with new details
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.age = age || user.age;
      
      // Merge address
      if (address) {
        user.address = {
          street: address, // Saving the simple text address to street
          city: user.address?.city,
          state: user.address?.state,
          pincode: user.address?.pincode,
          country: user.address?.country,
        };
      }

      await user.save();
    } else {
      // Create new user
      user = new User({
        name: name || 'Google User',
        email,
        phone,
        age,
        address: address ? { street: address } : {},
        isVerified: true, // Google auth implies verified email
      });
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: 'User profile synced to MongoDB',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        address: user.address?.street || '',
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/user POST:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    
    // Get email from URL query params
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email query parameter is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        address: user.address?.street || '',
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/user GET:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
