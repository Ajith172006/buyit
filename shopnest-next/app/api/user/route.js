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
      if (address && address.street) {
        const newAddress = {
          label: address.label || 'Home',
          doorNo: address.doorNo,
          street: address.street,
          city: address.city,
          district: address.district,
          state: address.state,
          pincode: address.pincode,
          isDefault: user.savedAddresses?.length === 0,
        };
        if (!user.savedAddresses) user.savedAddresses = [];
        user.savedAddresses.push(newAddress);
      }

      await user.save();
    } else {
      // Create new user
      user = new User({
        name: name || 'Google User',
        email,
        phone,
        age,
        savedAddresses: address && address.street ? [{ label: 'Home', ...address, isDefault: true }] : [],
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
        savedAddresses: user.savedAddresses || [],
        wishlist: user.wishlist || [],
        address: user.savedAddresses && user.savedAddresses.length > 0 
          ? `${user.savedAddresses[0].doorNo}, ${user.savedAddresses[0].street}, ${user.savedAddresses[0].city}` 
          : user.address?.street || '',
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
        savedAddresses: user.savedAddresses || [],
        wishlist: user.wishlist || [],
        address: user.savedAddresses && user.savedAddresses.length > 0 
          ? `${user.savedAddresses[0].doorNo}, ${user.savedAddresses[0].street}, ${user.savedAddresses[0].city}` 
          : user.address?.street || '',
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/user GET:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
