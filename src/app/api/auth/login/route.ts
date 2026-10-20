import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken, setSessionCookie } from '@/lib/auth';

const MASTER_EMAIL = 'davidmartinbigson@gmail.com';
const MASTER_PASSWORD = '123papers';

// Ensure master admin exists
async function ensureMasterAdmin() {
  try {
    const existing = await db.user.findFirst({ where: { role: 'master_admin' } });
    if (!existing) {
      const { hashPassword } = await import('@/lib/auth');
      const hashedPassword = await hashPassword(MASTER_PASSWORD);
      await db.user.create({
        data: {
          email: MASTER_EMAIL,
          password: hashedPassword,
          name: 'Master Admin',
          role: 'master_admin',
          isActive: true,
        },
      });
      console.log('Master admin auto-created');
    }
  } catch (e) {
    console.error('Master admin creation error:', e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, isMaster } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Always ensure master admin exists
    await ensureMasterAdmin();

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if account is active (for customers)
    if (!user.isActive && user.role === 'customer') {
      return NextResponse.json({ 
        error: 'Your account is pending admin approval. You will receive a license key once approved.' 
      }, { status: 403 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Account deactivated' }, { status: 403 });
    }

    if (isMaster && user.role !== 'master_admin') {
      return NextResponse.json({ error: 'Master admin access required' }, { status: 403 });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken(user.id, user.email, user.role);
    setSessionCookie(token);

    // Check if user needs license activation
    const needsLicense = user.role === 'customer' && !user.licenseKey;
    const redirectUrl = user.role === 'master_admin' 
      ? '/admin' 
      : needsLicense 
        ? '/license' 
        : '/dashboard';

    return NextResponse.json({
      success: true,
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        businessName: user.businessName,
        licenseKey: user.licenseKey,
      },
      redirect: redirectUrl,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
