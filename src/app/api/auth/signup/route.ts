import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      name,
      businessName,
      businessType,
      phone,
      businessPhone,
      country,
      currency,
      address,
      branchCount,
      staffCount,
      posTerminals,
    } = body;

    // Validation
    if (!email || !password || !name || !businessName) {
      return NextResponse.json(
        { error: 'Email, password, owner name, and business name are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with all details
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        businessType: businessType || 'retail',
        businessName,
        role: 'customer',
        isActive: false, // Pending admin approval
        licenseKey: null,
        licenseExpiry: null,
        // Store additional details in a metadata field (for future use)
        businessPhone: businessPhone || null,
        ownerPhone: phone || null,
        country: country || null,
        currency: currency || null,
        address: address || null,
        branchCount: branchCount || 1,
        staffCount: staffCount || 1,
        posTerminals: posTerminals || 1,
      },
    } as any);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Your account is pending admin approval. You will receive a license key via email once approved.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        businessName: user.businessName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
