import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, generateLicenseKey } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'master_admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, licenseDuration } = body;

    let updateData: any = {};

    // Approve user
    if (action === 'approve') {
      updateData.isActive = true;
      
      // Generate license key
      const licenseKey = generateLicenseKey();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + (licenseDuration || 30));
      
      updateData.licenseKey = licenseKey;
      updateData.licenseExpiry = expiryDate;
    }
    
    // Suspend user
    else if (action === 'suspend') {
      updateData.isActive = false;
    }
    
    // Activate user
    else if (action === 'activate') {
      updateData.isActive = true;
    }
    
    // Extend license
    else if (action === 'extend') {
      updateData.licenseExpiry = new Date(
        new Date().getTime() + (licenseDuration || 30) * 24 * 60 * 60 * 1000
      );
    }

    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `User ${action}d successfully`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isActive: updatedUser.isActive,
        licenseKey: updatedUser.licenseKey,
        licenseExpiry: updatedUser.licenseExpiry,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'master_admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await db.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
