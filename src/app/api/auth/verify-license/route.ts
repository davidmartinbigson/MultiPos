import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateToken, setSessionCookie, getCurrentUser } from '@/lib/auth';
import { validateLicenseKey, normalizeLicenseKey } from '@/lib/license';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseKey } = body;

    if (!licenseKey || typeof licenseKey !== 'string') {
      return NextResponse.json(
        { error: 'License key is required' },
        { status: 400 }
      );
    }

    const normalizedKey = normalizeLicenseKey(licenseKey);

    if (!validateLicenseKey(normalizedKey)) {
      return NextResponse.json(
        { error: 'Invalid license key format. Expected format: MP-XXXX-XXXX-XXXX-XXXX' },
        { status: 400 }
      );
    }

    // Get current logged in user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Please login first' },
        { status: 401 }
      );
    }

    // Find user with this license key
    const licenseUser = await db.user.findUnique({
      where: { licenseKey: normalizedKey },
    });

    if (!licenseUser) {
      return NextResponse.json(
        { error: 'License key not found. Please check your key or contact support.' },
        { status: 404 }
      );
    }

    // Verify this license belongs to the logged in user
    if (licenseUser.id !== currentUser.id) {
      return NextResponse.json(
        { error: 'This license key does not belong to your account.' },
        { status: 403 }
      );
    }

    // Check if license is expired
    if (licenseUser.licenseExpiry) {
      const expiryDate = new Date(licenseUser.licenseExpiry);
      if (expiryDate < new Date()) {
        return NextResponse.json(
          { error: 'This license has expired. Please renew your subscription.' },
          { status: 403 }
        );
      }
    }

    // Activate the user account
    await db.user.update({
      where: { id: currentUser.id },
      data: {
        licenseKey: normalizedKey,
        isActive: true,
      },
    });

    // Generate new session token
    const token = generateToken(currentUser.id, currentUser.email, currentUser.role);
    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: 'License activated successfully',
      redirect: '/dashboard',
    });
  } catch (error) {
    console.error('License verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
