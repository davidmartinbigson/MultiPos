import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'master_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await db.user.findMany({
      where: { role: 'customer' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'master_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, licenseKey, licenseExpiry, isActive } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (licenseKey !== undefined) updateData.licenseKey = licenseKey;
    if (licenseExpiry !== undefined) updateData.licenseExpiry = licenseExpiry ? new Date(licenseExpiry) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'User updated successfully',
      user 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
