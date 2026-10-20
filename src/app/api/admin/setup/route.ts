import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { db } from '@/lib/db';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check if master admin already exists
    const existingMaster = await db.user.findFirst({
      where: { role: 'master_admin' },
    });

    if (existingMaster) {
      return NextResponse.json({
        success: true,
        message: 'Master admin already exists',
        admin: {
          id: existingMaster.id,
          email: existingMaster.email,
          name: existingMaster.name,
          role: existingMaster.role,
        },
        database: prisma ? 'PostgreSQL (Neon)' : 'In-Memory (Demo)',
      });
    }

    // Get credentials from environment variables
    const email = process.env.MASTER_ADMIN_EMAIL || 'davidmartinbigson@gmail.com';
    const password = process.env.MASTER_ADMIN_PASSWORD || '123papers';

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create master admin
    const masterAdmin = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Master Admin',
        role: 'master_admin',
        isActive: true,
        businessType: null,
        businessName: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Master admin account created successfully',
      admin: {
        id: masterAdmin.id,
        email: masterAdmin.email,
        name: masterAdmin.name,
        role: masterAdmin.role,
      },
      database: prisma ? 'PostgreSQL (Neon)' : 'In-Memory (Demo)',
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Setup failed: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}
